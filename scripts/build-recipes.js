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
import { graffeNonRisolte } from '../js/token-dosi.js';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const RECIPES_DIR = resolve(ROOT, 'ricette');
const OUT_FILE = resolve(ROOT, 'public', 'recipes.json');
const PUBLIC_DIR = resolve(ROOT, 'public');

/** Sidecar e backup che vivono accanto alle ricette ma non sono ricette. */
const NOT_A_RECIPE = /\.(backup|pre-edit)\.json$/;

/** Valori usati per dire "non si applica": vanno normalizzati a null. */
const PLACEHOLDER = ['n/a', 'na', 'nessuna', 'nessuno', 'none', 'null', '0', '-', '—'];

/** Testo UTF-8 riletto come Latin-1/CP1252: `ðŸ“·` invece di 📷, `â€”` invece di —. */
const DOPPIA_CODIFICA = /ðŸ|â€|[Â-Ã][-¿]/;

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

/**
 * I token dose `{id:valore}` sono un mini-formato dentro il testo degli step,
 * e per mesi nessun cancello li ha guardati: una regex troppo stretta ha
 * pubblicato `{farina_00:100}` come testo grezzo — visibile e nel JSON-LD — su
 * 11 pagine, e il panettone usava una forma senza valore (`{farina_primo}`)
 * che il sito non ha mai risolto. Il controllo a valle in verifica-build.js
 * era cieco per costruzione: confronta dati strutturati e testo visibile, ma
 * i due lati uscivano dalla stessa regex, quindi coincidevano anche sul rotto.
 *
 * Da qui in poi si boccia alla fonte: dentro gli step ogni graffa deve
 * appartenere a un token che matcha la grammatica di js/token-dosi.js; fuori
 * dagli step le graffe sono vietate del tutto, perché il sito i token li
 * risolve SOLO negli step — un token in un proTip arriva al lettore così com'è.
 */
function controllaToken(raw, dove) {
  const testiStep = new Set();
  for (const s of [...(raw.steps || []), ...(raw.stepsCondiment || [])]) {
    if (s?.text) testiStep.add(s.text);
  }
  (function scava(val, campo) {
    if (typeof val === 'string') {
      if (testiStep.has(val)) {
        for (const rotto of graffeNonRisolte(val)) {
          errors.push(`${dove}: token malformato in "${campo}" — ${JSON.stringify(rotto)} `
            + `(la grammatica è {id:numero} o {id:numero!}, vedi js/token-dosi.js)`);
        }
      } else if (/[{}]/.test(val)) {
        errors.push(`${dove}: graffe in "${campo}", ma il sito risolve i token solo nel testo `
          + `degli step: qui arriverebbero al lettore come testo grezzo`);
      }
    } else if (Array.isArray(val)) {
      for (const v of val) scava(v, campo);
    } else if (val && typeof val === 'object') {
      for (const [k, v] of Object.entries(val)) scava(v, campo || k);
    }
  })(raw, '');
}

/**
 * I tag che promettono qualcosa a chi mangia.
 *
 * PERCHÉ ESISTE QUESTO CONTROLLO
 * I tag non li scrive nessuno di questo repo: arrivano dalla dashboard che
 * genera le ricette, cambiano modello nel tempo (`_generatedBy` dice
 * `gemini-3.1`, `claude`, `claude-opus`) e da qui vanno dritti nelle
 * `keywords` dei dati strutturati, cioè a Google. Nessuno li guardava.
 *
 * «coreano» o «street food» sbagliato è un fastidio. «senza glutine» sbagliato
 * è un'informazione su cui una persona celiaca decide se può mangiare una
 * cosa: la Mayak Gyeran è stata pubblicata con quel tag ed è costruita sulla
 * salsa di soia, che il grano ce l'ha. Su 22 ricette con una promessa
 * alimentare era l'unica smentita dai suoi stessi ingredienti — cioè il
 * generatore ci prende quasi sempre, ed è esattamente per questo che
 * l'errore raro passa inosservato.
 *
 * L'analisi qualità della dashboard non copre questo: nei suoi 83 referti le
 * aree sono Coerenza, Dosi, Setup, Tempi, Temperature — di tag e allergeni
 * non parla mai. È un controllo che serve qui.
 *
 * COME SI DICHIARA UNA PROMESSA CONDIZIONATA
 * Un tag con una parentesi è considerato già vincolato e passa:
 * `senza glutine (con tamari)` è la convenzione che questo repo usa sulla
 * salsa teriyaki, e dice al lettore *a quale condizione* la promessa vale.
 * È la via d'uscita voluta — non silenziare il controllo, qualificare il tag.
 *
 * Le liste sono volutamente CORTE e ad alta confidenza: un cancello che
 * boccia build sane viene disattivato, e allora non protegge più niente.
 *
 * SI GUARDA IL NOME DELL'INGREDIENTE, MAI LA NOTA — e vale in tutti e due i
 * versi. Sul lato dell'accusa perché una prima versione scandiva anche le
 * note e incolpava il purè per «patate a pasta gialla», dove «pasta» è la
 * polpa del tubero. Sul lato dell'assoluzione perché è peggio: la nota della
 * Mayak Gyeran spiega che «per la versione senza glutine usa tamari», e con
 * l'esenzione applicata alla nota il cancello leggeva la parola «tamari» e
 * assolveva una ricetta che di suo monta salsa di soia col grano dentro.
 * Un controllo che si lascia disinnescare dalla prosa che spiega il problema
 * non protegge niente: la nota è una spiegazione, il nome è l'ingrediente.
 */
/** Glutine: cereali col glutine e cose che ne derivano. */
const FONTI_GLUTINE = [
  { re: /\bfarin[ae]\b/i, salvo: /\b(riso|mais|ceci|mandorl|castagn|grano saraceno|cocco)\b/i },
  { re: /\bsemol(a|ino)\b/i },
  { re: /\bpangrattato\b/i },
  { re: /\bpane\b/i },
  { re: /\bcous ?cous\b/i },
  { re: /\b(orzo|farro|seitan|bulgur)\b/i },
  { re: /\bmalto\b/i },
  { re: /\bbirra\b/i },
  // La soia normale è fermentata col grano: senza glutine è il tamari.
  { re: /\bsalsa di soia\b|\bsoia light\b/i, salvo: /\btamari\b/i },
  // La Worcestershire europea è fatta con aceto di malto d'orzo; quella
  // americana con aceto distillato ed è dichiarata senza glutine. Dal nome
  // dell'ingrediente non si distingue, quindi qui non c'è esenzione: chi la
  // usa in una ricetta senza glutine deve qualificare il tag e dire nella
  // nota quale bottiglia serve.
  { re: /\bworcestershire\b|\bsalsa inglese\b/i },
];

/**
 * Carne e pesce: smentiscono sia «vegetariano» sia «vegano», e stanno in una
 * lista sola perché ripeterla nelle due promesse vorrebbe dire due elenchi
 * che divergono al primo ingrediente nuovo.
 */
// `\w*` sulle radici, e non è un dettaglio: scritte come `\b(acciugh)\b` il
// confine di parola finale pretendeva che la parola finisse lì, quindi
// «Acciughe» non combaciava e una ricetta con le alici passava per
// vegetariana. Il test negativo l'ha intercettato.
// `salam[ei]` invece resta stretto di proposito: `salam\w*` prenderebbe la
// «salamoia», che è acqua e sale.
const FONTI_CARNE_PESCE = [
  { re: /\b(carne|pancetta|guanciale|lardo|strutto|prosciutto|salsicc\w*|speck|bresaola|salam[ei])\b/i },
  { re: /\b(pesce|acciugh\w*|alici|gamber\w*|crostacei|tonno|colatura|bottarga|vongole|cozze|calamar\w*|seppi\w*|salmone)\b/i },
  { re: /\bbrodo di (carne|pollo|manzo|vitello|pesce)\b/i },
  { re: /\bgelatina\b/i, salvo: /\bagar\b/i },
  // Le acciughe della Worcestershire non compaiono nel nome dell'ingrediente,
  // ed è proprio per questo che sta in elenco: un ingrediente la cui
  // composizione non si legge dall'etichetta è quello che sfugge a chi
  // controlla a occhio.
  { re: /\bworcestershire\b|\bsalsa inglese\b/i },
];

/**
 * Uova, latticini e miele: smentiscono «vegano» ma NON «vegetariano», che
 * li ammette. È la differenza fra le due promesse, ed è tutta qui.
 */
const FONTI_NON_VEGANE = [
  { re: /\buov[ao]\b/i },
  { re: /\bmiele\b/i },
  { re: /\bburro\b/i, salvo: /\b(cacao|arachidi|mandorl|vegetale)\b/i },
  { re: /\blatte\b/i, salvo: /\b(cocco|mandorl|soia|riso|avena|vegetale)\b/i },
  { re: /\bpanna\b/i, salvo: /\bvegetale\b/i },
  { re: /\byogurt\b/i, salvo: /\b(soia|vegetale|cocco)\b/i },
  { re: /\b(formagg\w*|parmigiano|pecorino|grana|ricotta|mascarpone|provola|mozzarella|burrata|stracchino)\b/i },
];

/**
 * Lattosio: SOLO latticini freschi, ed è una lista più corta di quella dei
 * latticini in generale — di proposito.
 *
 * Fuori restano i **formaggi a lunga stagionatura** (parmigiano, grana,
 * pecorino stagionato), che di lattosio ne hanno tracce sotto la soglia
 * dichiarabile e vengono venduti come «naturalmente privi di lattosio»: una
 * ricetta senza lattosio col parmigiano dentro è corretta, e bocciarla
 * insegnerebbe solo che il cancello è da aggirare. Fuori anche il **burro**,
 * che ne ha pochissimo, e il chiarificato praticamente zero.
 *
 * Questo controllo dice «attenzione, qui c'è un latticino fresco», non
 * pretende di fare il conto dei grammi di lattosio.
 */
const FONTI_LATTOSIO = [
  { re: /\blatte\b/i, salvo: /\b(cocco|mandorl|soia|riso|avena|vegetale|delattosat|senza lattosio)\b/i },
  { re: /\bpanna\b/i, salvo: /\b(vegetale|senza lattosio)\b/i },
  { re: /\b(ricotta|mascarpone|mozzarella|burrata|stracchino|robiola|crescenza|philadelphia)\b/i },
  { re: /\byogurt\b/i, salvo: /\b(soia|vegetale|cocco|senza lattosio)\b/i },
];

const PROMESSE_ALIMENTARI = [
  { tag: /senza glutine|gluten[ -]?free/i, cosa: 'glutine', fonti: FONTI_GLUTINE },
  { tag: /senza lattosio|lactose[ -]?free/i, cosa: 'lattosio', fonti: FONTI_LATTOSIO },
  // `[oiae]?` copre anche il femminile («vegana», «ricette vegane»), che con
  // `[oi]?` passava il cancello senza controllo: la gemella della cicatrice
  // delle acciughe qui sopra, corretta allora solo sul lato ingredienti.
  { tag: /\bvegan[oiae]?\b/i, cosa: 'ingredienti animali', fonti: [...FONTI_CARNE_PESCE, ...FONTI_NON_VEGANE] },
  // «vegetariano» ammette uova e latticini: gli si contesta solo carne e pesce.
  { tag: /\bvegetarian[oiae]?\b/i, cosa: 'carne o pesce', fonti: FONTI_CARNE_PESCE },
];

function controllaPromesse(raw, dove) {
  const ingredienti = [
    ...(raw.ingredientGroups || []).flatMap(g => g.items || []),
    ...(raw.ingredients || []),
    ...(raw.suspensions || []),
  ].filter(i => i && i.name);

  for (const tag of raw.tags || []) {
    // Una parentesi nel tag dice a quale condizione la promessa vale: è la
    // forma corretta di dichiararla, e passa.
    if (/\(.+\)/.test(tag)) continue;

    for (const promessa of PROMESSE_ALIMENTARI) {
      if (!promessa.tag.test(tag)) continue;
      for (const ing of ingredienti) {
        const nome = String(ing.name);
        const fonte = promessa.fonti.find(f => f.re.test(nome) && !(f.salvo?.test(nome)));
        if (!fonte) continue;
        errors.push(`${dove}: il tag "${tag}" è smentito dall'ingrediente "${nome}" `
          + `(${promessa.cosa}). O togli il tag, o cambia l'ingrediente, o vincola la `
          + `promessa scrivendola fra parentesi — «senza glutine (con tamari)» — come `
          + `fa condimenti/salsa-teriyaki-originale.`);
        break; // un ingrediente basta: il tag è già da correggere
      }
    }
  }
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

  // Il credito finisce sotto la foto, quindi il testo corrotto si vede. Il
  // controllo in verifica-build.js intercetta solo la doppia codifica delle
  // lettere accentate (`metÃ `): su `—` e su 📷 produce `â€”` e `ðŸ“·`, che
  // quel filtro lascia passare. Sei ricette erano in questo stato.
  if (DOPPIA_CODIFICA.test(raw.imageAttribution ?? '')) {
    errors.push(`${cat.dir}/${slug}: imageAttribution a doppia codifica UTF-8 (${JSON.stringify(raw.imageAttribution)})`);
  }

  controllaToken(raw, `${cat.dir}/${slug}`);
  controllaPromesse(raw, `${cat.dir}/${slug}`);

  // Dati sensoriali e nutrizionali: AVVISO, non errore. Una ricetta senza il
  // profilo sensoriale si pubblica benissimo — il pannello semplicemente non
  // compare — quindi fermare la build sarebbe sproporzionato. Ma è un pezzo
  // che dovrebbe esserci, e senza qualcuno che lo nomini resta mancante per
  // sempre: oggi sono 2 ricette su 81, cioè una svista, non una scelta.
  if (!raw.sensoryProfile?.axes?.length) {
    warnings.push(`${cat.dir}/${slug}: senza profilo sensoriale (niente grafico né tabella dei tratti)`);
  }

  // LA REGOLA: un asse che vale 0 o 1 non è un asse di questa ricetta.
  //
  // Gli assi sono CINQUE, e sono l'intero profilo sensoriale: uno speso per
  // dire «questo tratto non si applica» è un quinto buttato, e sul radar
  // disegna una punta schiacciata che non informa nessuno. Se un tratto è
  // assente non va misurato a zero, va sostituito con un tratto che la
  // ricetta ha davvero.
  //
  // Da dove nasce: la dashboard sceglieva gli assi da una tabella categoria
  // → cinque assi, e «Secondi Piatti» non avendo la sua usava quella del
  // PANE — così delle costine di maiale venivano valutate su «Alveolatura
  // Mollica», che vale zero. Aggiungere righe alla tabella non basta:
  // «Secondi Piatti» tiene insieme costine e uova marinate, che non
  // condividono quasi nessun tratto, quindi QUALUNQUE set fisso produce
  // zeri su metà categoria. La regola sostituisce la tabella.
  //
  // Soglia a 1 e non a 0 perché il caso limite lo dice meglio di una
  // spiegazione: «Acidità: 1» su un burro chiarificato è un'informazione
  // vera — il burro non è acido — ma resta un asse su cinque speso per una
  // negazione, in un profilo che aveva Purezza, Nota di Nocciola e Pulizia
  // del Gusto da raccontare.
  for (const a of raw.sensoryProfile?.axes || []) {
    if (typeof a?.value === 'number' && a.value <= 1) {
      warnings.push(`${cat.dir}/${slug}: l'asse sensoriale "${a.label}" vale ${a.value} — un tratto `
        + `assente non è un asse di questa ricetta: sostituiscilo con uno che la ricetta ha davvero`);
    }
  }
  if (!raw.nutrition?.kcal_per_100g) {
    warnings.push(`${cat.dir}/${slug}: senza valori nutrizionali`);
  }

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
    // Il credito della foto: senza di lui le immagini CC risultano pubblicate
    // in violazione della licenza, e chi legge l'indice non ha modo di saperlo.
    imageAttribution: text(raw.imageAttribution),
    // `Boolean(raw.sensoryProfile)` diceva `true` anche per un profilo senza
    // assi, cioè per una ricetta che il pannello sensoriale non lo mostra:
    // chi filtra su questo campo cercava le ricette incomplete e non le
    // trovava. Ora la condizione è la stessa che usa il renderer.
    hasSensory: Boolean(raw.sensoryProfile?.axes?.length),
    hasStorage: Boolean(raw.storage),
    // `_generatedBy` (quale modello ha scritto la ricetta) NON entra qui: lo
    // legge solo la dashboard, e lo legge dal JSON della ricetta nel repo, non
    // da questo indice. Copiarlo qui significava pubblicarlo senza che nessuna
    // pagina lo mostrasse — il peggio dei due mondi.
    //
    // `_createdAt` invece SÌ, ed è obbligatorio: l'underscore dice "interno" ma
    // questo campo è contratto pubblico. Per 17 ricette la vera data di
    // creazione esiste SOLO qui dentro (vedi `previousCreatedAt` più sopra), e
    // da qui la rileggono sia questo script al giro successivo sia
    // `generate-og.js` per `datePublished` e per `lastmod` della sitemap.
    // Toglierlo perché "comincia con _" fa perdere le date in silenzio.
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
