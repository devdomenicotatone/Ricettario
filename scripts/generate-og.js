/**
 * GENERATE-OG.JS — Pre-rendering statico + SEO (post-build)
 *
 * Per ogni ricetta e ogni categoria genera una pagina HTML completa a partire
 * da dist/index.html, con:
 *   - meta Open Graph / Twitter Card specifici
 *   - <link rel="canonical">
 *   - JSON-LD schema.org (Recipe / CollectionPage)
 *   - il contenuto della ricetta già renderizzato dentro #app
 *
 * Il contenuto pre-renderizzato non è un dettaglio estetico: Google pretende
 * che i dati strutturati corrispondano a contenuto visibile. Marcare una
 * ricetta con JSON-LD su una pagina vuota è una violazione, non un vantaggio.
 * Per lo stesso motivo qui non c'è più il redirect JS immediato che c'era
 * prima: rendeva le pagine ricetta non indicizzabili, perché i crawler lo
 * seguono e consolidano tutto sulla homepage.
 *
 * La SPA si avvia normalmente (gli asset sono quelli di dist/index.html) e
 * sostituisce il contenuto pre-renderizzato appena il router parte.
 *
 * Eseguire DOPO `vite build` e PRIMA di `deploy-ghpages.js`.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

// Il calcolatore di cottura viene pre-renderizzato con lo STESSO motore e lo
// STESSO markup che gira nel browser. È l'unico modo di garantire che i dati
// strutturati HowTo corrispondano a contenuto visibile: se lo script si
// riscrivesse il markup a mano, le due versioni divergerebbero al primo
// cambiamento e i dati marcati non corrisponderebbero più a quello che si vede.
import { piano } from '../js/cottura/motore.js';
import { htmlPiano } from '../js/cottura/html-piano.js';
import { normalizza, slugDaConfig } from '../js/cottura/stato-url.js';
import { durata as durataUmana } from '../js/cottura/formato.js';
import { PAGINE_SEO } from '../dati/cottura/coefficienti.js';

// Stesso motivo, esteso a ricette, categorie e caroselli: il
// markup esce dagli stessi moduli puri che usa la SPA. Le copie a mano che
// vivevano qui dentro (prerenderRecipe, prerenderCategory) erano GIÀ
// divergenti in produzione: niente Pro Tips, Conservazione o Glossario nella
// versione statica, H1 diversi sulle pagine categoria.
import { htmlRicetta } from '../js/html-ricetta.js';
import { isValidBadge } from '../js/recipe-meta.js';
import { htmlCategoria, htmlRigaCarosello, metaPaginaCategoria } from '../js/html-categoria.js';
import { CATEGORIES, CATEGORY_ORDER, CATEGORIES_BY_DIR } from '../js/categories.js';

// Sezione strumenti: stesso principio. Anagrafe dal registry (js/strumenti.js),
// contenuti da dati/strumenti/, markup e title/description dagli stessi moduli
// puri che usa la SPA (js/html-strumenti.js).
import { STRUMENTI } from '../js/strumenti.js';
import { CONTENUTI_STRUMENTI } from '../dati/strumenti/indice.js';
import { htmlHubStrumenti, htmlStrumento, metaHubStrumenti, metaPaginaStrumento } from '../js/html-strumenti.js';

const PROJECT_DIR = process.cwd();
const DIST_DIR = join(PROJECT_DIR, 'dist');
const SITE_URL = 'https://devdomenicotatone.github.io/Ricettario';
const SITE_NAME = 'Ricettario Lab';
const BASE_PATH = '/Ricettario';

// ── Escape ──
// Era la terza copia della stessa funzione (le altre in `js/credito-foto.js` e
// `js/recipe-renderer.js`). Ora è una sola: vedi `js/escape.js`. I due nomi
// restano come alias perché in questo file compaiono una trentina di volte e
// dicono in che posizione finisce il testo.
import { escHtml as escapeCondiviso } from '../js/escape.js';

const escAttr = escapeCondiviso;
const escHtml = escapeCondiviso;

// Stessa storia dei token dose `{acqua:750}` negli step: la grammatica e la
// resa del valore stanno in js/token-dosi.js, condivise con la SPA. La copia
// locale che viveva qui non ammetteva cifre nei nomi (`{farina_00:100}`) e ha
// pubblicato graffe grezze nel testo visibile e nel JSON-LD di 11 pagine.
import { risolviTokenTesto } from '../js/token-dosi.js';

/**
 * Toglie i blocchi JSON-LD già presenti. Serve perché il template è
 * dist/index.html, che questo stesso script riscrive alla fine: senza
 * ripulire, una seconda esecuzione senza rebuild duplicherebbe i dati
 * strutturati su ogni pagina.
 */
function stripJsonLd(html) {
    return html.replace(/[ \t]*<script type="application\/ld\+json">[\s\S]*?<\/script>\n?/g, '');
}

/** Il JSON-LD va in uno <script>: neutralizza solo la chiusura del tag. */
function jsonLdSafe(obj) {
    return JSON.stringify(obj, null, 2).replace(/</g, '\\u003c');
}

// ── Tronca descrizione a ~160 caratteri (standard OG) ──
function truncateDesc(desc, maxLen = 160) {
    if (!desc || desc.length <= maxLen) return desc || '';
    return desc.slice(0, maxLen - 1).replace(/\s+\S*$/, '') + '…';
}

function absUrl(path) {
    if (!path) return null;
    return `${SITE_URL}/${String(path).replace(/^\//, '')}`;
}

/**
 * Estrae una durata in minuti dal linguaggio naturale, o null se il formato
 * non è riconosciuto con certezza. Sui range prende il minimo: è il tempo
 * minimo per portare a casa la ricetta, non il caso peggiore.
 * Es: "24-72h in frigo" → 1440 | "20-25 minuti" → 20 | "90 secondi" → 1.5
 *
 * Il lookbehind `(?<![a-z0-9])` esige che il numero cominci una parola: senza,
 * il modello del forno «Effeuno P134H» combaciava come "134" + "h" e la pizza
 * napoletana è stata pubblicata con `cookTime: PT134H` — 134 ore di cottura
 * dichiarate a Google, in contraddizione col suo stesso totalTime.
 */
function durataMinuti(text) {
    if (!text) return null;
    const s = String(text).toLowerCase();
    const m = s.match(/(?<![a-z0-9])(\d+(?:[.,]\d+)?)\s*(?:[-–]\s*\d+(?:[.,]\d+)?\s*)?(h\b|ore|ora|min\b|minuti|minuto|sec\b|secondi|secondo)/);
    if (!m) return null;
    const value = parseFloat(m[1].replace(',', '.'));
    if (!Number.isFinite(value) || value <= 0) return null;
    if (/^(h|ore|ora)$/.test(m[2])) return value * 60;
    if (/^sec/.test(m[2])) return value / 60;
    return value;
}

/** Minuti (anche frazionari: "90 secondi" → 1.5) in ISO 8601. */
function isoDaMinuti(minuti) {
    const sec = Math.round(minuti * 60);
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    let iso = 'PT';
    if (h) iso += `${h}H`;
    if (m) iso += `${m}M`;
    if (s || iso === 'PT') iso += `${s}S`;
    return iso;
}

/** Appiattisce ingredientGroups/ingredients in righe "1000 g Farina (nota)". */
function flatIngredients(src) {
    const groups = src.ingredientGroups?.length
        ? src.ingredientGroups.flatMap(g => g.items || [])
        : (src.ingredients || []);
    return groups.filter(i => i && i.name);
}

function ingredientLine(ing) {
    const qty = ing.grams != null ? `${ing.grams} g ` : '';
    const note = ing.note ? ` ${ing.note}` : '';
    return `${qty}${ing.name}${note}`.trim();
}

/**
 * Peso totale, escludendo ciò che il renderer esclude. «di impasto» solo
 * quando l'idratazione è vera: hydration 0 o assente marca ciò che impasto
 * non è (salse, conserve, condimenti — convenzione README), e il burro
 * chiarificato dichiarava a Google «circa 500 g di impasto». Stessa guardia
 * dell'etichetta visibile (etichettaPesoTotale in html-ricetta.js): i dati
 * strutturati devono corrispondere al contenuto visibile.
 */
function totalWeight(src) {
    const items = flatIngredients(src).filter(i => !i.excludeFromTotal && typeof i.grams === 'number');
    if (!items.length) return null;
    const sum = items.reduce((t, i) => t + i.grams, 0);
    if (sum <= 0) return null;
    return isValidBadge(src.hydration) ? `circa ${Math.round(sum)} g di impasto` : `circa ${Math.round(sum)} g`;
}

// ═══════════════════════════════════════
//  JSON-LD
// ═══════════════════════════════════════

function recipeJsonLd(recipe, src, url) {
    const ld = {
        '@context': 'https://schema.org',
        '@type': 'Recipe',
        name: recipe.title,
        description: src.description || recipe.description || '',
        url,
        author: { '@type': 'Organization', name: SITE_NAME },
        publisher: { '@type': 'Organization', name: SITE_NAME },
        recipeCategory: recipe.category,
        inLanguage: 'it-IT',
    };

    const img = absUrl(recipe.image || src.image);
    if (img) ld.image = [img];

    if (recipe._createdAt) ld.datePublished = String(recipe._createdAt).slice(0, 10);
    if (src.tags?.length) ld.keywords = src.tags.join(', ');

    const ingredients = flatIngredients(src).map(ingredientLine);
    if (ingredients.length) ld.recipeIngredient = ingredients;

    const steps = (src.steps || []).filter(s => s && s.text);
    if (steps.length) {
        ld.recipeInstructions = steps.map((s, i) => ({
            '@type': 'HowToStep',
            position: i + 1,
            ...(s.title ? { name: s.title } : {}),
            text: risolviTokenTesto(s.text),
        }));
    }

    const yield_ = totalWeight(src);
    if (yield_) ld.recipeYield = yield_;

    // `totalTime` è la somma di lievitazione e cottura, non la sola
    // lievitazione: schema.org lo definisce come il tempo complessivo, e un
    // totale minore del solo cookTime sarebbe internamente contraddittorio
    // (verifica-build ora lo boccia).
    const cookMin = durataMinuti(src.baking?.time);
    if (cookMin) ld.cookTime = isoDaMinuti(cookMin);
    const totalMin = (durataMinuti(src.fermentation) || 0) + (cookMin || 0);
    if (totalMin) ld.totalTime = isoDaMinuti(totalMin);

    // I valori nutrizionali del progetto sono per 100 g: lo dichiaro esplicitamente,
    // altrimenti Google li interpreterebbe come "per porzione".
    if (src.nutrition?.kcal_per_100g) {
        const n = src.nutrition;
        ld.nutrition = {
            '@type': 'NutritionInformation',
            servingSize: '100 g',
            calories: `${n.kcal_per_100g} kcal`,
            ...(n.macros?.carbs != null ? { carbohydrateContent: `${n.macros.carbs} g` } : {}),
            ...(n.macros?.protein != null ? { proteinContent: `${n.macros.protein} g` } : {}),
            ...(n.macros?.fat != null ? { fatContent: `${n.macros.fat} g` } : {}),
        };
    }

    return ld;
}

function categoryJsonLd(cat, catRecipes, url) {
    return {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: `${cat.name} — ${SITE_NAME}`,
        url,
        inLanguage: 'it-IT',
        isPartOf: { '@type': 'WebSite', name: SITE_NAME, url: `${SITE_URL}/` },
        mainEntity: {
            '@type': 'ItemList',
            numberOfItems: catRecipes.length,
            itemListElement: catRecipes.map((r, i) => ({
                '@type': 'ListItem',
                position: i + 1,
                name: r.title,
                url: `${SITE_URL}/ricette/${r.categoryDir}/${r.slug}/`,
            })),
        },
    };
}

// ═══════════════════════════════════════
//  COTTURA: JSON-LD E CONTENUTO
// ═══════════════════════════════════════

const DATI_COTTURA = (() => {
    const leggi = (nome) => JSON.parse(readFileSync(join(PROJECT_DIR, 'dati', 'cottura', nome), 'utf8'));
    const tagli = leggi('tagli.json').tagli;
    const dispositivi = leggi('dispositivi.json');
    return { tagli, dispositivi: dispositivi.dispositivi, defaultDispositivo: dispositivi.default };
})();

function minutiIso(minuti) {
    const m = Math.round(minuti);
    const h = Math.floor(m / 60);
    const resto = m % 60;
    if (!h) return `PT${resto}M`;
    return resto ? `PT${h}H${resto}M` : `PT${h}H`;
}

function misuraDi(p) {
    return p.misura.dominante === 'spessore'
        ? `${String(p.misura.spessore_cm).replace('.', ',')} cm`
        : `${String(p.misura.peso_kg).replace('.', ',')} kg`;
}

/**
 * HowTo del piano di cottura.
 *
 * `text` di ogni passo è la concatenazione delle azioni della fase, che sono
 * esattamente le righe che la pagina mostra: il controllo in verifica-build.js
 * confronta i due lati e blocca la pubblicazione se divergono.
 *
 * Nota onesta sul valore SEO: Google ha smesso di mostrare i rich result HowTo
 * nei risultati di ricerca nel 2023. Il markup resta dati strutturati corretti e
 * leggibili da altri consumatori, ma non aspettarsi il riquadro illustrato: il
 * traffico su queste pagine lo fanno titolo, contenuto vero e link interni.
 */
function howToJsonLd(p, config, url, descrizione) {
    const attrezzi = [`Kamado in ceramica (${p.dispositivo.nome.toLowerCase()}, griglia ${p.dispositivo.griglia_cm} cm)`];
    if (config.deflettore) attrezzi.push('Deflettore di calore');
    if (config.griglia_rialzata) attrezzi.push('Griglia rialzata');
    if (config.sonda) attrezzi.push('Termometro a sonda');

    const ingredienti = [`${p.taglio.nome} da ${misuraDi(p)}`, 'Carbone vegetale in pezzi'];
    if (config.legno) ingredienti.push(`Legno da affumicatura (${config.legno})`);

    return {
        '@context': 'https://schema.org',
        '@type': 'HowTo',
        name: `${p.taglio.nome} da ${misuraDi(p)} sul kamado`,
        description: descrizione,
        url,
        inLanguage: 'it-IT',
        totalTime: minutiIso(p.totale_min[1]),
        yield: `${p.porzioni} porzion${p.porzioni === 1 ? 'e' : 'i'}`,
        tool: attrezzi.map(name => ({ '@type': 'HowToTool', name })),
        supply: ingredienti.map(name => ({ '@type': 'HowToSupply', name })),
        step: p.fasi
            .filter(f => f.azione?.length)
            .map((f, i) => ({
                '@type': 'HowToStep',
                position: i + 1,
                name: f.nome,
                text: f.azione.join(' '),
                url: `${url}#fase-${f.id}`,
            })),
    };
}

/**
 * Contenuto della pagina indice /cottura/.
 *
 * La SPA lo sostituisce col form appena parte, esattamente come fa sulle pagine
 * ricetta. Serve ai crawler, che il form non lo compilano: senza questo, l'unica
 * cosa indicizzabile del calcolatore sarebbe il nulla.
 */
function prerenderHub(pagine) {
    return `
      <div class="container container--narrow">
        <nav class="breadcrumb">
          <a href="${BASE_PATH}/">Home</a>
          <span class="breadcrumb__separator">›</span>
          <span class="breadcrumb__current">Cottura su kamado</span>
        </nav>

        <h1 class="piano__titolo">Calcolatore di cottura della carne sul kamado</h1>

        <p class="piano__premessa">
          I tempi qui sotto sono stime, e restano stime anche quando sono precise al minuto.
          Il dato che comanda è la temperatura al cuore.
        </p>

        <div class="piano__blocco">
          <p>
            Indichi il taglio, lo spessore o il peso, la cottura che vuoi e l'attrezzatura che hai,
            e ne esce un piano a fasi: preparazione delle braci e attesa del fumo pulito, cottura
            indiretta con i controlli intermedi, la temperatura di estrazione calcolata sul carryover,
            riposo e scottatura finale.
          </p>
          <p>
            Non è un timer generico per bistecche. Le regole sono quelle del kamado in ceramica:
            l'inerzia asimmetrica, che sale in fretta e non scende, e da cui la regola di stabilizzare
            <em>sotto</em> la temperatura obiettivo e salire; i quindici o venti minuti che servono
            perché il fumo bianco diventi azzurrino, che stanno nel conto del tempo totale; l'apertura
            del coperchio in due tempi sopra i 250 °C; le posizioni delle valvole per fascia di
            temperatura; e il controllo che il pezzo ci stia davvero sulla griglia, perché un piano
            perfetto per un tomahawk che non entra è un piano inutile.
          </p>
          <p>
            Le tre misure standard dei kamado sono coperte tutte — piccolo da 34 cm circa
            (Joe Jr, MiniMax), medio da 46 cm (Classic, BGE Large), grande da 61 cm (Big Joe, BGE XL) —
            perché il diametro cambia i tempi di stabilizzazione, l'inerzia termica, la durata
            del carbone e cosa ci si può appoggiare sopra.
          </p>
        </div>

        <h2 class="piano__blocco-titolo">Piani già pronti</h2>
        <div class="category-grid">
          ${pagine.map(x => `
            <a href="${BASE_PATH}/cottura/${escAttr(x.slug)}/" class="category-card">
              <div class="category-card__body">
                <h3 class="category-card__title">${escHtml(x.titoloBreve)}</h3>
                <p class="category-card__desc">${escHtml(x.riassunto)}</p>
              </div>
            </a>`).join('')}
        </div>
      </div>`;
}

function cotturaHubJsonLd(pagine, url) {
    return {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: `Calcolatore di cottura su kamado — ${SITE_NAME}`,
        url,
        inLanguage: 'it-IT',
        isPartOf: { '@type': 'WebSite', name: SITE_NAME, url: `${SITE_URL}/` },
        mainEntity: {
            '@type': 'ItemList',
            numberOfItems: pagine.length,
            itemListElement: pagine.map((x, i) => ({
                '@type': 'ListItem',
                position: i + 1,
                name: x.titoloBreve,
                url: `${SITE_URL}/cottura/${x.slug}/`,
            })),
        },
    };
}

function strumentiHubJsonLd(url) {
    return {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: `I miei strumenti — ${SITE_NAME}`,
        url,
        inLanguage: 'it-IT',
        isPartOf: { '@type': 'WebSite', name: SITE_NAME, url: `${SITE_URL}/` },
        mainEntity: {
            '@type': 'ItemList',
            numberOfItems: STRUMENTI.length,
            itemListElement: STRUMENTI.map((s, i) => ({
                '@type': 'ListItem',
                position: i + 1,
                name: s.nome,
                url: `${SITE_URL}/strumenti/${s.slug}/`,
            })),
        },
    };
}

/**
 * ItemPage e non Product o HowTo: qui non si vende niente (un Product senza
 * offerta racconterebbe una scheda commerciale che non esiste) e i rich
 * result HowTo autonomi sono stati dismessi da Google. Si marca la pagina,
 * che è esattamente ciò che c'è.
 */
function strumentoJsonLd(meta, url) {
    return {
        '@context': 'https://schema.org',
        '@type': 'ItemPage',
        name: meta.titoloBreve,
        description: meta.descrizione,
        url,
        inLanguage: 'it-IT',
        isPartOf: { '@type': 'WebSite', name: SITE_NAME, url: `${SITE_URL}/` },
    };
}

function breadcrumbJsonLd(trail) {
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: trail.map((t, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: t.name,
            item: t.url,
        })),
    };
}

// ═══════════════════════════════════════
//  PRE-RENDERING DEL CONTENUTO
// ═══════════════════════════════════════

// Il markup statico di ricette e categorie esce da js/html-ricetta.js e
// js/html-categoria.js in modalità `interattivo: false`: le funzioni
// prerenderRecipe e prerenderCategory che vivevano qui erano copie a mano
// della SPA, già divergenti in produzione. Vedi i commenti in testa ai due
// moduli.

// ═══════════════════════════════════════
//  COMPOSIZIONE DELLA PAGINA
// ═══════════════════════════════════════

/**
 * Costruisce una pagina partendo da dist/index.html: sostituisce i meta,
 * inietta canonical e JSON-LD, e rimpiazza il contenuto di #app.
 * Usare il template reale invece di un HTML scritto a mano tiene navbar,
 * footer e riferimenti agli asset con hash sempre allineati alla build.
 */
function buildPage(template, { title, description, url, image, jsonLd, appHtml, type = 'article' }) {
    const fullTitle = `${title} — ${SITE_NAME}`;
    const desc = truncateDesc(description);
    const imgUrl = absUrl(image) || `${SITE_URL}/images/og/homepage.webp`;

    let html = template;

    // via i meta della homepage: li riscrivo per questa pagina
    html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${escAttr(fullTitle)}</title>`);
    html = html.replace(/[ \t]*<meta\s+name="description"[\s\S]*?>\n?/, '');
    html = html.replace(/[ \t]*<meta\s+property="og:[\s\S]*?>\n?/g, '');
    html = html.replace(/[ \t]*<meta\s+name="twitter:[\s\S]*?>\n?/g, '');
    html = html.replace(/[ \t]*<link\s+rel="canonical"[\s\S]*?>\n?/g, '');
    html = stripJsonLd(html);

    const head = `
    <meta name="description" content="${escAttr(desc)}">
    <link rel="canonical" href="${escAttr(url)}">

    <!-- Open Graph -->
    <meta property="og:type" content="${type}">
    <meta property="og:title" content="${escAttr(title)}">
    <meta property="og:description" content="${escAttr(desc)}">
    <meta property="og:url" content="${escAttr(url)}">
    <meta property="og:image" content="${escAttr(imgUrl)}">
    <meta property="og:site_name" content="${SITE_NAME}">
    <meta property="og:locale" content="it_IT">

    <!-- Twitter / X Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${escAttr(title)}">
    <meta name="twitter:description" content="${escAttr(desc)}">
    <meta name="twitter:image" content="${escAttr(imgUrl)}">

${jsonLd.map(ld => `    <script type="application/ld+json">\n${jsonLdSafe(ld)}\n    </script>`).join('\n')}
</head>`;

    html = html.replace('</head>', head);
    html = html.replace(
        /(<div id="app">)[\s\S]*?(<\/div><!-- \/#app -->)/,
        (_, open, close) => `${open}\n${appHtml}\n    ${close}`
    );

    return html;
}

// ═══════════════════════════════════════
//  MAIN
// ═══════════════════════════════════════

function generate() {
    console.log('🔗 Pre-rendering pagine statiche + SEO...\n');

    const templatePath = join(DIST_DIR, 'index.html');
    if (!existsSync(templatePath)) {
        console.error('❌ dist/index.html non trovato: esegui prima `vite build`.');
        process.exit(1);
    }
    const template = readFileSync(templatePath, 'utf8');

    if (!/<div id="app">[\s\S]*?<\/div><!-- \/#app -->/.test(template)) {
        console.error('❌ dist/index.html non contiene i marker #app: template incompatibile.');
        process.exit(1);
    }

    const recipesPath = join(DIST_DIR, 'recipes.json');
    if (!existsSync(recipesPath)) {
        console.error('❌ dist/recipes.json non trovato: esegui prima `npm run build:recipes` e `vite build`.');
        process.exit(1);
    }
    const { recipes, categories } = JSON.parse(readFileSync(recipesPath, 'utf8'));

    const sitemap = [{ loc: `${SITE_URL}/`, priority: '1.0' }];
    let recipeCount = 0;
    let categoryCount = 0;
    let missingSource = 0;

    // ── 1. Pagine RICETTA ──
    for (const recipe of recipes) {
        const catDir = recipe.categoryDir;
        const slug = recipe.slug;
        if (!slug || !catDir) {
            console.warn(`   ⚠ "${recipe.title}": slug o categoria mancante — skip`);
            continue;
        }

        const srcPath = join(DIST_DIR, 'ricette', catDir, `${slug}.json`);
        if (!existsSync(srcPath)) {
            console.warn(`   ⚠ ${catDir}/${slug}: JSON sorgente assente in dist — pagina senza JSON-LD`);
            missingSource++;
            continue;
        }
        const src = JSON.parse(readFileSync(srcPath, 'utf8'));

        const url = `${SITE_URL}/ricette/${catDir}/${slug}/`;
        const html = buildPage(template, {
            title: recipe.title,
            description: recipe.description,
            url,
            image: recipe.image,
            type: 'article',
            appHtml: htmlRicetta(src, { base: `${BASE_PATH}/`, categoryDir: catDir, interattivo: false }),
            jsonLd: [
                recipeJsonLd(recipe, src, url),
                breadcrumbJsonLd([
                    { name: 'Home', url: `${SITE_URL}/` },
                    { name: recipe.category, url: `${SITE_URL}/ricette/${catDir}/` },
                    { name: recipe.title, url },
                ]),
            ],
        });

        const outDir = join(DIST_DIR, 'ricette', catDir, slug);
        mkdirSync(outDir, { recursive: true });
        writeFileSync(join(outDir, 'index.html'), html, 'utf8');
        sitemap.push({ loc: url, lastmod: recipe._createdAt?.slice(0, 10), priority: '0.8' });
        recipeCount++;
    }

    // ── 2. Pagine CATEGORIA ──
    for (const cat of categories) {
        const catRecipes = recipes.filter(r => r.category === cat.name);
        const catDir = catRecipes[0]?.categoryDir;
        if (!catDir) {
            console.warn(`   ⚠ categoria "${cat.name}" senza ricette — skip`);
            continue;
        }

        const url = `${SITE_URL}/ricette/${catDir}/`;
        // Title e description escono dallo stesso helper della SPA
        // (metaPaginaCategoria in html-categoria.js): buildPage appende
        // « — Ricettario Lab», e il <title> che ne esce coincide col
        // document.title che scrive main.js. Prima erano due composizioni
        // a mano, già divergenti in produzione (punto 13 del checkup).
        const pagina = metaPaginaCategoria(CATEGORIES_BY_DIR[catDir]);
        const html = buildPage(template, {
            title: pagina.titoloBreve,
            description: pagina.descrizione,
            url,
            image: catRecipes.find(r => r.image)?.image || null,
            type: 'website',
            appHtml: htmlCategoria(CATEGORIES_BY_DIR[catDir], catRecipes, { base: `${BASE_PATH}/`, interattivo: false }),
            jsonLd: [
                categoryJsonLd(cat, catRecipes, url),
                breadcrumbJsonLd([
                    { name: 'Home', url: `${SITE_URL}/` },
                    { name: cat.name, url },
                ]),
            ],
        });

        mkdirSync(join(DIST_DIR, 'ricette', catDir), { recursive: true });
        writeFileSync(join(DIST_DIR, 'ricette', catDir, 'index.html'), html, 'utf8');
        sitemap.push({ loc: url, priority: '0.6' });
        categoryCount++;
    }

    // ── 3. Pagine COTTURA ──
    // Il crawler non compila i form: il piano che il calcolatore costruisce nel
    // browser non lo vedrebbe mai. Queste pagine sono lo stesso piano scritto su
    // disco, una per combinazione richiesta in PAGINE_SEO.
    const pagineCottura = [];
    for (const combo of PAGINE_SEO) {
        const config = normalizza(
            { taglio: combo.taglio, spessore: combo.spessore, peso: combo.peso },
            DATI_COTTURA,
        );
        let p;
        try {
            p = piano(config, DATI_COTTURA);
        } catch (e) {
            console.warn(`   ⚠ cottura ${combo.taglio}: ${e.message} — skip`);
            continue;
        }

        const slug = slugDaConfig(config, DATI_COTTURA);
        const url = `${SITE_URL}/cottura/${slug}/`;
        const misura = misuraDi(p);

        // Titolo, descrizione e H1 devono essere tre cose diverse: l'H1 lo
        // produce htmlPiano ("Fiorentina / T-bone da 4 cm"), quindi qui il
        // titolo dice cosa si trova nella pagina e la descrizione dice il dato
        // che la rende utile.
        const titoloBreve = `${p.taglio.nome} da ${misura} sul kamado`;
        const titolo = `${titoloBreve}: tempi e temperatura al cuore`;
        const riassunto = `${durataUmana(p.totale_min)} in tutto, estrazione a ${p.estrazione.c} °C`;
        const descrizione = `Piano di cottura a fasi per ${p.taglio.nome} da ${misura} `
            + `su kamado: ${durataUmana(p.totale_min)} in tutto, estrazione a ${p.estrazione.c} °C, `
            + `temperature di camera, gestione delle valvole e carbone necessario.`;

        const html = buildPage(template, {
            title: titolo,
            description: descrizione,
            url,
            image: null,
            type: 'article',
            // `modificabile: false`: nella pagina statica il pulsante "Cambia i
            // parametri" non avrebbe nessuno ad ascoltarlo finché la SPA non parte.
            appHtml: htmlPiano(p, { base: BASE_PATH, modificabile: false }),
            jsonLd: [
                howToJsonLd(p, config, url, descrizione),
                breadcrumbJsonLd([
                    { name: 'Home', url: `${SITE_URL}/` },
                    { name: 'Cottura su kamado', url: `${SITE_URL}/cottura/` },
                    { name: titoloBreve, url },
                ]),
            ],
        });

        const outDir = join(DIST_DIR, 'cottura', slug);
        mkdirSync(outDir, { recursive: true });
        writeFileSync(join(outDir, 'index.html'), html, 'utf8');
        sitemap.push({ loc: url, priority: '0.7' });
        pagineCottura.push({ slug, titoloBreve, riassunto });
    }

    // ── 4. Indice /cottura/ ──
    if (pagineCottura.length) {
        const url = `${SITE_URL}/cottura/`;
        const html = buildPage(template, {
            title: 'Calcolatore di cottura della carne su kamado',
            description: 'Inserisci taglio, spessore e cottura desiderata: ottieni un piano a fasi con tempi, '
                + 'temperatura di estrazione calcolata sul carryover, gestione delle valvole e carbone necessario.',
            url,
            image: null,
            type: 'website',
            appHtml: prerenderHub(pagineCottura),
            jsonLd: [
                cotturaHubJsonLd(pagineCottura, url),
                breadcrumbJsonLd([
                    { name: 'Home', url: `${SITE_URL}/` },
                    { name: 'Cottura su kamado', url },
                ]),
            ],
        });
        mkdirSync(join(DIST_DIR, 'cottura'), { recursive: true });
        writeFileSync(join(DIST_DIR, 'cottura', 'index.html'), html, 'utf8');
        sitemap.push({ loc: url, priority: '0.8' });
    }

    // ── 4-bis. Sezione strumenti: /strumenti/<slug>/ e indice /strumenti/ ──
    // Stesso schema della coppia cottura. Le ricette collegate arrivano dal
    // campo `tools` dell'indice: la stessa fonte che legge la SPA
    // (js/strumenti/pagina.js), raggruppata per lama nello stesso modo.
    for (const voce of STRUMENTI) {
        const contenuto = CONTENUTI_STRUMENTI[voce.slug];
        if (!contenuto) {
            console.error(`❌ strumento "${voce.slug}" senza contenuto in dati/strumenti/: registry e contenuti divergono.`);
            process.exit(1);
        }

        const ricettePerLama = {};
        for (const r of recipes) {
            for (const t of r.tools || []) {
                if (t.strumento !== voce.slug) continue;
                (ricettePerLama[t.lama] ??= []).push({
                    title: r.title, slug: r.slug, categoryDir: r.categoryDir, nota: t.nota || '',
                });
            }
        }
        for (const voci of Object.values(ricettePerLama)) {
            voci.sort((a, b) => a.title.localeCompare(b.title, 'it'));
        }
        const categorie = (contenuto.categorieCollegate || [])
            .map(chiave => CATEGORIES[chiave]).filter(Boolean);

        const url = `${SITE_URL}/strumenti/${voce.slug}/`;
        const meta = metaPaginaStrumento(voce);
        const html = buildPage(template, {
            title: meta.titoloBreve,
            description: meta.descrizione,
            url,
            image: voce.image,
            type: 'article',
            appHtml: htmlStrumento(contenuto, voce, { base: `${BASE_PATH}/`, ricettePerLama, categorie }),
            jsonLd: [
                strumentoJsonLd(meta, url),
                breadcrumbJsonLd([
                    { name: 'Home', url: `${SITE_URL}/` },
                    { name: 'Strumenti', url: `${SITE_URL}/strumenti/` },
                    { name: voce.nome, url },
                ]),
            ],
        });
        const outDir = join(DIST_DIR, 'strumenti', voce.slug);
        mkdirSync(outDir, { recursive: true });
        writeFileSync(join(outDir, 'index.html'), html, 'utf8');
        sitemap.push({ loc: url, priority: '0.7' });
    }

    {
        const url = `${SITE_URL}/strumenti/`;
        const meta = metaHubStrumenti();
        const html = buildPage(template, {
            title: meta.titoloBreve,
            description: meta.descrizione,
            url,
            image: null,
            type: 'website',
            appHtml: htmlHubStrumenti(STRUMENTI, { base: `${BASE_PATH}/` }),
            jsonLd: [
                strumentiHubJsonLd(url),
                breadcrumbJsonLd([
                    { name: 'Home', url: `${SITE_URL}/` },
                    { name: 'Strumenti', url },
                ]),
            ],
        });
        mkdirSync(join(DIST_DIR, 'strumenti'), { recursive: true });
        writeFileSync(join(DIST_DIR, 'strumenti', 'index.html'), html, 'utf8');
        sitemap.push({ loc: url, priority: '0.8' });
    }

    // ── 5. Homepage: caroselli statici + canonical + JSON-LD WebSite ──
    let home = stripJsonLd(template.replace(/[ \t]*<link\s+rel="canonical"[\s\S]*?>\n?/g, ''));

    // Il contenitore dei caroselli in index.html è vuoto: lo riempie la SPA.
    // Per un crawler senza JavaScript la homepage non aveva UN link a una
    // ricetta — 80 pagine raggiungibili solo via sitemap. Qui si scrivono le
    // stesse righe che monterebbe la SPA (stesso builder, js/html-categoria.js):
    // all'avvio initCarousels le sostituisce con la versione interattiva,
    // quindi chi ha JavaScript non vede differenze. Il wrapper non porta la
    // classe `reveal` perché senza JS resterebbe a opacity 0.
    const righeCaroselli = CATEGORY_ORDER.map(key => {
        const cat = CATEGORIES[key];
        const delCat = recipes.filter(r => r.categoryDir === cat.dir);
        if (!delCat.length) return '';
        return `<div class="category-row">${htmlRigaCarosello(cat.name, cat.emoji, cat.dir, delCat, { base: `${BASE_PATH}/` })}</div>`;
    }).join('\n');
    if (!/<div id="recipe-carousels">\s*<\/div>/.test(home)) {
        console.error('❌ index.html non contiene il contenitore vuoto #recipe-carousels: template incompatibile.');
        process.exit(1);
    }
    home = home.replace(/<div id="recipe-carousels">\s*<\/div>/,
        `<div id="recipe-carousels">${righeCaroselli}</div>`);
    home = home.replace('</head>', `    <link rel="canonical" href="${SITE_URL}/">
    <script type="application/ld+json">
${jsonLdSafe({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: SITE_NAME,
        url: `${SITE_URL}/`,
        inLanguage: 'it-IT',
        description: 'Ricette artigianali documentate con precisione tecnica — pane, pizza, pasta e lievitati.',
    })}
    </script>
</head>`);
    writeFileSync(templatePath, home, 'utf8');

    // ── 6. sitemap.xml ──
    const urlset = sitemap.map(u => [
        '  <url>',
        `    <loc>${escAttr(u.loc)}</loc>`,
        u.lastmod ? `    <lastmod>${u.lastmod}</lastmod>` : null,
        `    <priority>${u.priority}</priority>`,
        '  </url>',
    ].filter(Boolean).join('\n')).join('\n');

    writeFileSync(join(DIST_DIR, 'sitemap.xml'),
        `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlset}\n</urlset>\n`,
        'utf8');

    // ── 7. robots.txt ──
    // Nota: su un project site GitHub Pages il robots.txt valido è quello alla
    // radice del dominio (devdomenicotatone.github.io/robots.txt), non questo.
    // Resta utile come documentazione e diventa efficace con un dominio custom.
    writeFileSync(join(DIST_DIR, 'robots.txt'),
        `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`,
        'utf8');

    console.log(`   📄 ${recipeCount} pagine ricetta (JSON-LD Recipe + contenuto pre-renderizzato)`);
    console.log(`   📂 ${categoryCount} pagine categoria (JSON-LD CollectionPage)`);
    if (missingSource) console.log(`   ⚠  ${missingSource} ricette saltate: JSON sorgente assente`);
    console.log(`   🔥 ${pagineCottura.length} pagine cottura (JSON-LD HowTo) + indice /cottura/`);
    console.log(`   🔧 ${STRUMENTI.length} pagine strumento (JSON-LD ItemPage) + indice /strumenti/`);
    console.log(`   🗺  sitemap.xml — ${sitemap.length} URL`);
    console.log(`   🤖 robots.txt`);
    console.log('\n✅ Pre-rendering completato.\n');
}

generate();
