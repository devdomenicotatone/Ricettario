/**
 * GENERATE-OG.JS — Social Card HTML Generator (Post-Build)
 * 
 * Genera file HTML statici con meta tag Open Graph + Twitter Card
 * per ogni ricetta e ogni pagina categoria.
 * 
 * I crawler social (WhatsApp, Facebook, Telegram, Twitter/X, LinkedIn)
 * NON eseguono JavaScript, quindi leggono i meta tag dall'HTML statico.
 * Gli utenti umani vengono reindirizzati alla SPA tramite un JS redirect.
 * 
 * Eseguire DOPO `vite build` e PRIMA di `deploy-ghpages.js`.
 * 
 * Flusso:
 *   vite build → generate-og.js → deploy-ghpages.js
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, resolve } from 'path';

const PROJECT_DIR = process.cwd();
const DIST_DIR = join(PROJECT_DIR, 'dist');
const SITE_URL = 'https://devdomenicotatone.github.io/Ricettario';
const SITE_NAME = 'Ricettario Lab';
const BASE_PATH = '/Ricettario';

// ── Utility: Escape HTML per evitare XSS nei meta tag ──
function escAttr(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

// ── Tronca descrizione a ~160 caratteri (standard OG) ──
function truncateDesc(desc, maxLen = 160) {
    if (!desc || desc.length <= maxLen) return desc || '';
    return desc.slice(0, maxLen - 1).replace(/\s+\S*$/, '') + '…';
}

/**
 * Genera un file HTML con meta OG + redirect SPA.
 * - I crawler leggono og:title, og:description, og:image
 * - Gli utenti umani vengono reindirizzati alla SPA
 */
function buildOgHtml({ title, description, url, image, type = 'article' }) {
    const fullTitle = `${escAttr(title)} — ${SITE_NAME}`;
    const desc = escAttr(truncateDesc(description));
    const imgUrl = image ? `${SITE_URL}/${image.replace(/^\//, '')}` : `${SITE_URL}/images/og/homepage.png`;

    return `<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${fullTitle}</title>
    <meta name="description" content="${desc}">

    <!-- Open Graph — Social Sharing Card -->
    <meta property="og:type" content="${type}">
    <meta property="og:title" content="${escAttr(title)}">
    <meta property="og:description" content="${desc}">
    <meta property="og:url" content="${escAttr(url)}">
    <meta property="og:image" content="${escAttr(imgUrl)}">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:site_name" content="${SITE_NAME}">
    <meta property="og:locale" content="it_IT">

    <!-- Twitter / X Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${escAttr(title)}">
    <meta name="twitter:description" content="${desc}">
    <meta name="twitter:image" content="${escAttr(imgUrl)}">

    <!-- SPA Redirect: i crawler non eseguono JS, gli utenti sì -->
    <script>
        sessionStorage.setItem('spa-redirect', window.location.pathname + window.location.search + window.location.hash);
        window.location.replace('${BASE_PATH}/');
    </script>
</head>
<body>
    <!-- Fallback noscript per utenti senza JS -->
    <noscript>
        <meta http-equiv="refresh" content="0;url=${BASE_PATH}/">
        <p>Stai per essere reindirizzato a <a href="${BASE_PATH}/">Ricettario Lab</a>.</p>
    </noscript>
</body>
</html>
`;
}

/**
 * Mappa categorie del JSON alle directory (normalizzazione slug)
 */
const CATEGORY_DIR_MAP = {
    'Pane': 'pane',
    'Pizza': 'pizza',
    'Pasta': 'pasta',
    'Focaccia': 'focaccia',
    'Lievitati': 'lievitati',
    'Dolci': 'dolci',
    'Conserve': 'conserve',
    'Condimenti': 'condimenti',
    'Secondi Piatti': 'secondi-piatti',
};

// ═══════════════════════════════════════
//  MAIN
// ═══════════════════════════════════════

async function generate() {
    console.log('🔗 Generazione Social Card HTML (Open Graph)...\n');

    // ── Carica recipes.json ──
    const recipesPath = join(DIST_DIR, 'recipes.json');
    if (!existsSync(recipesPath)) {
        // Fallback: cerca in public/
        const publicPath = join(PROJECT_DIR, 'public', 'recipes.json');
        if (!existsSync(publicPath)) {
            console.error('❌ recipes.json non trovato né in dist/ né in public/');
            process.exit(1);
        }
    }

    const data = JSON.parse(readFileSync(recipesPath, 'utf8'));
    const { recipes, categories } = data;

    let recipeCount = 0;
    let categoryCount = 0;

    // ── 1. Genera HTML per ogni RICETTA ──
    for (const recipe of recipes) {
        const catDir = recipe.categoryDir || CATEGORY_DIR_MAP[recipe.category] || recipe.category.toLowerCase().replace(/\s+/g, '-');
        const slug = recipe.slug;

        if (!slug) {
            console.warn(`   ⚠ Ricetta senza slug: "${recipe.title}" — skip`);
            continue;
        }

        const outDir = join(DIST_DIR, 'ricette', catDir, slug);
        const outFile = join(outDir, 'index.html');

        // Non sovrascrivere se esiste già un file HTML (es. da Vite)
        // NOTA: sovrascriviamo sempre perché il 404.html redirect non ha i meta OG
        mkdirSync(outDir, { recursive: true });

        const html = buildOgHtml({
            title: recipe.title,
            description: recipe.description,
            url: `${SITE_URL}/ricette/${catDir}/${slug}`,
            image: recipe.image,
            type: 'article',
        });

        writeFileSync(outFile, html, 'utf8');
        recipeCount++;
    }

    // ── 2. Genera HTML per ogni CATEGORIA ──
    for (const cat of categories) {
        const catDir = CATEGORY_DIR_MAP[cat.name] || cat.name.toLowerCase().replace(/\s+/g, '-');
        const catRecipes = recipes.filter(r => r.category === cat.name);

        // Usa l'immagine della prima ricetta della categoria come OG image
        const firstWithImage = catRecipes.find(r => r.image);

        const outDir = join(DIST_DIR, 'ricette', catDir);
        const outFile = join(outDir, 'index.html');

        mkdirSync(outDir, { recursive: true });

        const html = buildOgHtml({
            title: `${cat.name} — ${cat.count} Ricette`,
            description: `Esplora ${cat.count} ricette di ${cat.name.toLowerCase()} nel Ricettario Lab — parametri tecnici, dosi precise e risultati replicabili.`,
            url: `${SITE_URL}/ricette/${catDir}/`,
            image: firstWithImage?.image || null,
            type: 'website',
        });

        writeFileSync(outFile, html, 'utf8');
        categoryCount++;
    }

    // ── Report finale ──
    console.log(`   📄 ${recipeCount} pagine ricetta generate`);
    console.log(`   📂 ${categoryCount} pagine categoria generate`);
    console.log(`   📊 Totale: ${recipeCount + categoryCount} file HTML con meta OG\n`);
    console.log('✅ Social card HTML generati con successo!\n');
}

generate();
