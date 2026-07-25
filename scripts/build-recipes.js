/**
 * Genera public/recipes.json a partire dai JSON in ricette/.
 *
 * Prima esisteva solo l'artefatto, non lo script che lo produce: l'indice e le
 * singole ricette potevano divergere senza che nessuno se ne accorgesse.
 * Qui l'indice è sempre derivato, e la derivazione fallisce rumorosamente
 * se i dati sorgente sono incoerenti.
 *
 * Uso: npm run build:recipes
 */

import { readFileSync, writeFileSync, existsSync, readdirSync } from 'fs';
import { resolve, dirname, basename } from 'path';
import { fileURLToPath } from 'url';
import { CATEGORIES, CATEGORY_ORDER } from '../js/categories.js';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const RECIPES_DIR = resolve(ROOT, 'ricette');
const OUT_FILE = resolve(ROOT, 'public', 'recipes.json');
const PUBLIC_DIR = resolve(ROOT, 'public');

/** Sidecar e backup che vivono accanto alle ricette ma non sono ricette. */
const NOT_A_RECIPE = /\.(backup|pre-edit)\.json$/;

/** Valori usati per dire "non si applica": vanno normalizzati a null. */
const PLACEHOLDER = ['n/a', 'na', 'nessuna', 'nessuno', 'none', 'null', '0', '-', '—'];

const errors = [];
const warnings = [];

/**
 * 17 ricette hanno `_createdAt` solo nell'indice e non nel proprio JSON:
 * rigenerare da zero le perderebbe. Le recupero dall'indice precedente.
 */
const previousCreatedAt = existsSync(OUT_FILE)
  ? Object.fromEntries(
      JSON.parse(readFileSync(OUT_FILE, 'utf8')).recipes
        .filter(r => r._createdAt)
        .map(r => [r.slug, r._createdAt])
    )
  : {};

/** Normalizza un campo testuale: stringa vuota e placeholder diventano null. */
function text(v) {
  if (v === null || v === undefined) return null;
  const s = String(v).trim();
  if (s === '' || PLACEHOLDER.includes(s.toLowerCase())) return null;
  return s;
}

/** L'idratazione è un numero nel sorgente e una stringa "NN%" nell'indice. */
function hydration(v, slug) {
  if (v === null || v === undefined || v === '' || Number(v) === 0) return null;
  const n = Number(v);
  if (Number.isNaN(n)) {
    errors.push(`${slug}: hydration non numerica (${JSON.stringify(v)})`);
    return null;
  }
  if (n < 30 || n > 120) {
    errors.push(`${slug}: hydration ${n}% fuori dal range plausibile per un impasto (30–120)`);
    return null;
  }
  return `${n}%`;
}

function buildEntry(cat, file) {
  const slug = basename(file, '.json');
  const raw = JSON.parse(readFileSync(resolve(RECIPES_DIR, cat.dir, file), 'utf8'));

  if (raw.slug !== slug) {
    errors.push(`${cat.dir}/${file}: campo slug "${raw.slug}" diverso dal nome file "${slug}"`);
  }
  if (raw.category !== cat.name) {
    errors.push(`${cat.dir}/${slug}: category "${raw.category}" ma sta in ricette/${cat.dir}/ (atteso "${cat.name}")`);
  }
  if (raw.image && !existsSync(resolve(PUBLIC_DIR, raw.image))) {
    errors.push(`${cat.dir}/${slug}: immagine mancante → public/${raw.image}`);
  }
  if (!raw.description) warnings.push(`${cat.dir}/${slug}: description vuota`);

  return {
    title: raw.title,
    slug,
    category: cat.name,
    categoryDir: cat.dir,
    emoji: raw.emoji ?? cat.unicode,
    href: `ricette/${cat.dir}/${slug}.html`,
    image: raw.image ?? null,
    description: raw.description ?? '',
    hydration: hydration(raw.hydration, `${cat.dir}/${slug}`),
    time: text(raw.fermentation),
    temp: text(raw.targetTemp),
    tool: raw.tool ?? '',
    hasSensory: Boolean(raw.sensoryProfile),
    hasStorage: Boolean(raw.storage),
    _generatedBy: raw._generatedBy ?? null,
    _createdAt: raw._createdAt ?? previousCreatedAt[slug] ?? null,
  };
}

const recipes = [];
const categories = [];

for (const key of CATEGORY_ORDER) {
  const cat = CATEGORIES[key];
  const dir = resolve(RECIPES_DIR, cat.dir);
  if (!existsSync(dir)) {
    warnings.push(`categoria "${key}" dichiarata ma ricette/${cat.dir}/ non esiste`);
    continue;
  }

  const files = readdirSync(dir)
    .filter(f => f.endsWith('.json') && !NOT_A_RECIPE.test(f))
    .sort();

  const entries = files
    .map(f => buildEntry(cat, f))
    .sort((a, b) => a.title.localeCompare(b.title, 'it'));

  if (entries.length === 0) {
    warnings.push(`categoria "${key}" senza ricette`);
    continue;
  }

  recipes.push(...entries);
  categories.push({ name: cat.name, count: entries.length, emoji: cat.unicode });
}

// Cartelle su disco che nessuna categoria dichiara: ricette invisibili sul sito.
const declared = new Set(Object.values(CATEGORIES).map(c => c.dir));
for (const d of readdirSync(RECIPES_DIR, { withFileTypes: true })) {
  if (d.isDirectory() && !declared.has(d.name)) {
    errors.push(`ricette/${d.name}/ non è dichiarata in js/categories.js: le sue ricette non compaiono sul sito`);
  }
}

for (const w of warnings) console.warn(`⚠️  ${w}`);
if (errors.length) {
  for (const e of errors) console.error(`❌ ${e}`);
  console.error(`\n${errors.length} error${errors.length === 1 ? 'e' : 'i'}: indice non generato.`);
  process.exit(1);
}

const index = {
  generatedAt: new Date().toISOString(),
  totalRecipes: recipes.length,
  categories,
  recipes,
};

writeFileSync(OUT_FILE, JSON.stringify(index, null, 2) + '\n', 'utf8');
console.log(`✅ public/recipes.json — ${recipes.length} ricette in ${categories.length} categorie`);
for (const c of categories) console.log(`   ${c.emoji} ${c.name}: ${c.count}`);
