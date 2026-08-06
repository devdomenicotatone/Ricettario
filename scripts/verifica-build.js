/**
 * VERIFICA-BUILD.JS — Controlli sulla build prima di pubblicare.
 *
 * Il sito non ha test unitari e non ne ha bisogno: quasi tutto il rischio sta
 * nell'output statico. Questo script guarda dist/ e verifica le cose che si
 * sono davvero rotte in passato, invece di controllare astrattamente il codice.
 *
 * Uso: npm run verifica   (già incluso in `npm run check` e in `npm run deploy`)
 */

import { readdirSync, readFileSync, existsSync, statSync } from 'fs';
import { join, sep } from 'path';

const DIST = 'dist';
const SITE_URL = 'https://devdomenicotatone.github.io/Ricettario';

const problemi = [];
const avvisi = [];
const err = (m) => problemi.push(m);
const warn = (m) => avvisi.push(m);

if (!existsSync(DIST)) {
    console.error('❌ dist/ non esiste: esegui prima `npm run build`.');
    process.exit(1);
}

/**
 * Normalizza gli spazi. Va applicata a ENTRAMBI i lati di un confronto:
 * il testo delle ricette contiene spazi unificatori (U+00A0), che qui
 * diventano spazi normali. Normalizzarne solo uno produce falsi allarmi.
 */
const normalizza = (s) => String(s || '').replace(/\s+/g, ' ').trim();

/** Testo visibile di una pagina, come lo vedrebbe un crawler senza JS. */
function testoVisibile(html) {
    const app = html.match(/<div id="app">([\s\S]*?)<\/div><!-- \/#app -->/);
    return normalizza((app ? app[1] : '')
        .replace(/<script[\s\S]*?<\/script>/g, ' ')
        .replace(/<[^>]+>/g, ' ')
        .replace(/&[a-z]+;/gi, ' '));
}

/**
 * Doppia codifica UTF-8: byte UTF-8 riletti come Windows-1252 e risalvati.
 * Si vede come "metÃ " al posto di "metà", o come un trattino lungo che
 * diventa tre caratteri incomprensibili. È già successo su 7 ricette.
 *
 * Prima qui c'era una regex che guardava solo i byte guida C2/C3 e solo le
 * continuazioni Latin-1: copriva le lettere accentate e basta, quindi
 * lasciava passare trattini lunghi, virgolette tipografiche ed emoji — 186
 * sequenze rimaste per mesi in 7 ricette pubblicate. Riconoscere il mojibake
 * byte per byte costa dieci righe in più e non ha quel buco.
 */

/** Windows-1252: i byte 0x80-0x9F che NON coincidono con Latin-1. */
const CP1252_ALTI = {
    0x80: '€', 0x82: '‚', 0x83: 'ƒ', 0x84: '„',
    0x85: '…', 0x86: '†', 0x87: '‡', 0x88: 'ˆ',
    0x89: '‰', 0x8A: 'Š', 0x8B: '‹', 0x8C: 'Œ',
    0x8E: 'Ž', 0x91: '‘', 0x92: '’', 0x93: '“',
    0x94: '”', 0x95: '•', 0x96: '–', 0x97: '—',
    0x98: '˜', 0x99: '™', 0x9A: 'š', 0x9B: '›',
    0x9C: 'œ', 0x9E: 'ž', 0x9F: 'Ÿ',
};
const BYTE_DI = new Map();
for (let b = 0; b <= 0xFF; b++) {
    const c = CP1252_ALTI[b] ?? String.fromCharCode(b);
    if (!BYTE_DI.has(c)) BYTE_DI.set(c, b);
}
// Chi ha riletto i byte come Latin-1 puro invece che come Windows-1252 non
// ottiene "€" ma il carattere di controllo U+0080. Vale come byte anche quello,
// e nel testo di una ricetta non ci finisce per altre strade.
for (let b = 0x80; b <= 0x9F; b++) {
    const c = String.fromCharCode(b);
    if (!BYTE_DI.has(c)) BYTE_DI.set(c, b);
}
const byteDi = (c) => (BYTE_DI.has(c) ? BYTE_DI.get(c) : -1);

/**
 * Le sequenze di doppia codifica trovate in `testo`, come si leggono a schermo.
 *
 * Non basta cercare i caratteri sospetti uno per uno: le lettere accentate e il
 * simbolo di grado sono italiano normale. È mojibake solo quando i caratteri,
 * riconvertiti in byte, formano una sequenza UTF-8 multibyte COMPLETA e valida:
 * un byte guida seguito esattamente dalle sue continuazioni. Una lettera
 * accentata da sola non ha continuazioni dietro e non fa scattare niente.
 */
function sequenzeDoppiaCodifica(testo) {
    const trovate = [];
    for (let i = 0; i < testo.length; i++) {
        const guida = byteDi(testo[i]);
        let lunghezza = 0;
        if (guida >= 0xC2 && guida <= 0xDF) lunghezza = 2;
        else if (guida >= 0xE0 && guida <= 0xEF) lunghezza = 3;
        else if (guida >= 0xF0 && guida <= 0xF4) lunghezza = 4;
        if (!lunghezza || i + lunghezza > testo.length) continue;

        const byte = [guida];
        for (let k = 1; k < lunghezza; k++) {
            const b = byteDi(testo[i + k]);
            if (b < 0x80 || b > 0xBF) break;
            byte.push(b);
        }
        if (byte.length !== lunghezza) continue;

        // Buffer mette U+FFFD sulle sequenze non valide (overlong, surrogati):
        // in quel caso non è mojibake, è testo che si somiglia per caso.
        const decodificato = Buffer.from(byte).toString('utf8');
        if (decodificato.includes('�')) continue;

        trovate.push(testo.slice(i, i + lunghezza));
        i += lunghezza - 1;
    }
    return trovate;
}

/**
 * Segnala il mojibake trovato in un testo, con qualche esempio.
 * `bloccante` a false per i file che non vengono pubblicati: vale la pena
 * saperlo, non vale la pena fermare un deploy per un file che nessuno legge.
 */
function controllaDoppiaCodifica(etichetta, testo, bloccante = true) {
    const rotti = sequenzeDoppiaCodifica(testo);
    if (!rotti.length) return;
    const esempi = [...new Set(rotti)].slice(0, 4).map(s => JSON.stringify(s)).join(' ');
    const messaggio = `${etichetta}: testo a doppia codifica UTF-8 (${rotti.length} occorrenze: ${esempi})`;
    if (bloccante) err(messaggio);
    else warn(messaggio);
}

/** Contenuto di un tag/attributo singolo, o stringa vuota. */
function estrai(html, regex) {
    const m = html.match(regex);
    return m ? normalizza(m[1].replace(/<[^>]+>/g, ' ')) : '';
}

/**
 * Un token dose sopravvissuto alla resa: `{farina_00:100}`, `{tempo:5!}` o la
 * forma senza valore `{farina_primo}`. Nelle pagine pubblicate non deve
 * esistere: il lettore deve vedere il numero, non la graffa. È il controllo
 * speculare del cancello alla fonte in build-recipes.js — quello boccia i dati
 * che la grammatica di js/token-dosi.js non riconosce, questo si accorge se la
 * grammatica e il renderer divergono di nuovo (è già successo: 11 pagine
 * pubblicate per mesi con `{farina_00:100}` nel testo e nel JSON-LD).
 */
const TOKEN_RESIDUO = /\{[a-zA-Z_][a-zA-Z0-9_]*(?::\d+(?:\.\d+)?!?)?\}/;

/** Minuti da una durata ISO 8601 tipo PT3H30M, o null se non è in quel formato. */
function minutiDaIso(iso) {
    const m = String(iso || '').match(/^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/);
    if (!m || (!m[1] && !m[2] && !m[3])) return null;
    return Number(m[1] || 0) * 60 + Number(m[2] || 0) + Number(m[3] || 0) / 60;
}

/*
 * ── Redirect JavaScript: tutte le forme di scrittura su location ──
 *
 * La prima versione cercava solo `location.replace`: riconosceva una
 * scrittura su quattro. Passavano `location.href = …`, `window.location = …`,
 * `location.assign(…)` e soprattutto l'alias `var l = window.location;
 * l.replace(…)` — che è testualmente la forma di public/404.html: il cancello
 * non vedeva proprio la scrittura che il progetto usa davvero.
 *
 * Le LETTURE non devono scattare: location.pathname, .search, .hash, .origin
 * e location.href letto nei confronti sono il pane della SPA (js/router.js,
 * js/main.js, js/cottura/pagina.js). Per questo ogni forma pretende una
 * SCRITTURA: una chiamata che naviga o un assegnamento con `=` singolo
 * (né `==`/`===`, né `=>`). Scrivere location.hash resta fuori apposta:
 * cambia l'àncora senza ricaricare, non è un redirect che un crawler segue.
 * Il perimetro sono le pagine .html: il bundle (assets/*.js) non si scandisce,
 * ed è lì che vive il `window.location.assign(BASE)` legittimo di main.js.
 */

/**
 * L'oggetto location globale: nudo o dietro uno dei prefissi che lo espongono.
 * Il lookbehind esclude le proprietà omonime di altri oggetti (`foo.location`),
 * gli identificatori che finiscono così (`$location`) e `data-location`.
 */
const OGGETTO_LOCATION =
    String.raw`(?:(?:window|document|top|self|parent)\s*\.\s*|(?<![\w$.-]))location`;

const FORME_REDIRECT = [
    {
        forma: 'chiamata a location.replace()/assign()',
        regex: new RegExp(OGGETTO_LOCATION + String.raw`\s*\.\s*(?:replace|assign)\s*\(`),
    },
    {
        // `location = …`, `location.href = …` e le altre proprietà che
        // navigano. `+=` incluso: su href è comunque una navigazione.
        forma: 'assegnamento a location o a una sua proprietà di navigazione',
        regex: new RegExp(OGGETTO_LOCATION
            + String.raw`(?:\s*\.\s*(?:href|pathname|search|protocol|hostname|host|port))?\s*\+?=(?![=>])`),
    },
    {
        // Copiare l'oggetto intero in una variabile è il passo prima di
        // `l.replace(…)` ed è già di per sé il segnale: nessuna lettura ne ha
        // bisogno, i sorgenti leggono sempre la singola proprietà.
        forma: 'alias dell\'oggetto location in una variabile',
        regex: new RegExp(String.raw`[\w$]+\s*=\s*` + OGGETTO_LOCATION + String.raw`\b(?!\s*\.)`),
    },
    {
        forma: 'meta refresh',
        regex: /http-equiv\s*=\s*["']?\s*refresh/i,
    },
];

/** Boccia ogni forma di redirect trovata nell'HTML, col frammento incriminato. */
function controllaRedirect(rel, html) {
    for (const { forma, regex } of FORME_REDIRECT) {
        const m = html.match(regex);
        if (m) {
            err(`${rel}: redirect che impedisce l'indicizzazione — ${forma} `
                + `(${JSON.stringify(m[0].trim())})`);
        }
    }
}

function paginaHtml(percorso) {
    const rel = percorso.split(sep).join('/');
    const html = readFileSync(percorso, 'utf8');
    const eRicetta = /\/ricette\/[^/]+\/[^/]+\/index\.html$/.test(rel);
    const ePianoCottura = /\/cottura\/[^/]+\/index\.html$/.test(rel);
    const eIndiceCottura = /\/cottura\/index\.html$/.test(rel);
    const eStrumento = /\/strumenti\/[^/]+\/index\.html$/.test(rel);
    const eIndiceStrumenti = /\/strumenti\/index\.html$/.test(rel);

    if (!/rel="canonical"/.test(html)) err(`${rel}: manca <link rel="canonical">`);

    // Il redirect JS rendeva le pagine non indicizzabili: i crawler lo seguono
    // e consolidano tutto sulla homepage. Non deve tornare, in nessuna delle
    // sue forme (le regex stanno in FORME_REDIRECT, sopra).
    controllaRedirect(rel, html);

    // Ogni pagina deve avere ESATTAMENTE un H1 dentro #app, e non è solo
    // struttura dei titoli: è l'elemento a cui il router dà il fuoco dopo una
    // navigazione SPA (`dopoIlCambioPagina` in js/router.js). Se manca, il
    // fuoco ricade sull'intero `main#contenuto` — e con quello NVDA leggeva
    // la ricetta intera in un annuncio unico da 8-9.000 caratteri (punto 10
    // di CHECKUP-ACCESSIBILITA.md). Il controllo esisteva solo per le pagine
    // di cottura, cioè su 14 pagine su 105.
    const dentroApp = html.match(/<div id="app">([\s\S]*?)<\/div><!-- \/#app -->/);
    const quantiH1 = [...(dentroApp ? dentroApp[1] : '').matchAll(/<h1\b/g)].length;
    if (quantiH1 !== 1) {
        err(`${rel}: ${quantiH1} H1 dentro #app, ne serve esattamente uno — è l'elemento `
            + `a cui il router dà il fuoco dopo una navigazione, e senza il fuoco torna `
            + `sull'intero contenuto (punto 10 del checkup accessibilità)`);
    }

    const blocchi = [];
    for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
        try {
            blocchi.push(JSON.parse(m[1]));
        } catch (e) {
            err(`${rel}: JSON-LD non parsabile — ${e.message}`);
        }
    }

    const tipi = blocchi.map(b => b['@type']);
    if (new Set(tipi).size !== tipi.length) {
        err(`${rel}: dati strutturati duplicati (${tipi.join(', ')})`);
    }

    // ── Pagine del calcolatore di cottura ──
    // Valgono le stesse regole delle ricette, per lo stesso motivo: sono
    // generate da uno script, e uno script che marca con HowTo dei passaggi che
    // la pagina non mostra produce una violazione delle linee guida, non un
    // vantaggio. Qui il rischio è concreto perché il markup arriva da
    // html-piano.js e il JSON-LD da generate-og.js: se qualcuno cambia uno dei
    // due, questo controllo è ciò che se ne accorge.
    if (ePianoCottura) {
        const howTo = blocchi.find(b => b['@type'] === 'HowTo');
        if (!howTo) {
            err(`${rel}: pagina di cottura senza JSON-LD HowTo`);
            return { rel, blocchi };
        }
        for (const campo of ['name', 'step', 'totalTime']) {
            if (!howTo[campo] || howTo[campo].length === 0) err(`${rel}: HowTo senza "${campo}"`);
        }

        const testo = testoVisibile(html);
        if (testo.length < 300) err(`${rel}: solo ${testo.length} caratteri visibili senza JS`);
        for (const passo of howTo.step || []) {
            const inizio = normalizza(passo.text).slice(0, 40);
            if (inizio && !testo.includes(inizio)) {
                err(`${rel}: passo HowTo marcato ma non visibile — "${inizio}…"`);
            }
            if (passo.name && !testo.includes(normalizza(passo.name))) {
                err(`${rel}: nome del passo HowTo non visibile — "${passo.name}"`);
            }
        }

        // Titolo, meta description e H1 devono dire tre cose diverse: sono tre
        // spazi diversi e ripetere la stessa frase in tutti e tre spreca due.
        // Il controllo vale solo qui: sulle ricette titolo e H1 coincidono per
        // scelta, ed è corretto così.
        const titolo = estrai(html, /<title>([\s\S]*?)<\/title>/);
        const descrizione = estrai(html, /<meta\s+name="description"\s+content="([^"]*)"/);
        const h1 = estrai(html, /<h1[^>]*>([\s\S]*?)<\/h1>/);
        if (!h1) err(`${rel}: manca l'H1`);
        if (!descrizione) err(`${rel}: manca la meta description`);
        const senzaSito = titolo.replace(/\s+—\s+Ricettario Lab$/, '');
        if (h1 && senzaSito === h1) err(`${rel}: titolo e H1 identici ("${h1}")`);
        if (descrizione && (descrizione === senzaSito || descrizione === h1)) {
            err(`${rel}: meta description uguale al titolo o all'H1`);
        }
        return { rel, blocchi };
    }

    if (eIndiceCottura) {
        if (!blocchi.some(b => b['@type'] === 'CollectionPage')) {
            err(`${rel}: indice del calcolatore senza JSON-LD CollectionPage`);
        }
        const testo = testoVisibile(html);
        if (testo.length < 300) {
            err(`${rel}: solo ${testo.length} caratteri visibili senza JS — il crawler non compila il form, `
                + 'quindi questa pagina è tutto quello che vede');
        }
        return { rel, blocchi };
    }

    // ── Pagine strumenti ──
    // Stesse regole di cottura, per lo stesso motivo: markup da
    // js/html-strumenti.js, JSON-LD da generate-og.js — se uno dei due cambia
    // da solo, è questo controllo che se ne accorge.
    if (eStrumento) {
        if (!blocchi.some(b => b['@type'] === 'ItemPage')) {
            err(`${rel}: pagina strumento senza JSON-LD ItemPage`);
        }
        if (!blocchi.some(b => b['@type'] === 'BreadcrumbList')) {
            err(`${rel}: pagina strumento senza BreadcrumbList`);
        }
        const testo = testoVisibile(html);
        if (testo.length < 300) {
            err(`${rel}: solo ${testo.length} caratteri visibili senza JS — la guida È il contenuto, `
                + 'se non si vede la pagina non ha ragione di essere indicizzata');
        }
        const titolo = estrai(html, /<title>([\s\S]*?)<\/title>/);
        const descrizione = estrai(html, /<meta\s+name="description"\s+content="([^"]*)"/);
        const h1 = estrai(html, /<h1[^>]*>([\s\S]*?)<\/h1>/);
        if (!h1) err(`${rel}: manca l'H1`);
        if (!descrizione) err(`${rel}: manca la meta description`);
        const senzaSito = titolo.replace(/\s+—\s+Ricettario Lab$/, '');
        if (h1 && senzaSito === h1) err(`${rel}: titolo e H1 identici ("${h1}")`);
        if (descrizione && (descrizione === senzaSito || descrizione === h1)) {
            err(`${rel}: meta description uguale al titolo o all'H1`);
        }
        return { rel, blocchi };
    }

    if (eIndiceStrumenti) {
        if (!blocchi.some(b => b['@type'] === 'CollectionPage')) {
            err(`${rel}: indice strumenti senza JSON-LD CollectionPage`);
        }
        const testo = testoVisibile(html);
        if (testo.length < 300) {
            err(`${rel}: solo ${testo.length} caratteri visibili senza JS`);
        }
        return { rel, blocchi };
    }

    if (!eRicetta) return { rel, blocchi };

    const ricetta = blocchi.find(b => b['@type'] === 'Recipe');
    if (!ricetta) {
        err(`${rel}: pagina ricetta senza JSON-LD Recipe`);
        return { rel, blocchi };
    }
    for (const campo of ['name', 'image', 'recipeIngredient', 'recipeInstructions']) {
        if (!ricetta[campo] || ricetta[campo].length === 0) {
            err(`${rel}: Recipe senza "${campo}"`);
        }
    }

    // Google pretende che i dati strutturati corrispondano a contenuto
    // visibile. Marcare ingredienti che la pagina non mostra è una violazione.
    const testo = testoVisibile(html);
    if (testo.length < 300) {
        err(`${rel}: solo ${testo.length} caratteri visibili senza JS`);
    }
    for (const ing of ricetta.recipeIngredient || []) {
        const nome = normalizza(ing.replace(/^[\d.,]+\s*g\s*/, '').split(' (')[0]);
        if (nome && !testo.includes(nome)) {
            err(`${rel}: ingrediente marcato ma non visibile — "${nome}"`);
        }
    }
    for (const step of ricetta.recipeInstructions || []) {
        const inizio = normalizza(step.text).slice(0, 40);
        if (inizio && !testo.includes(inizio)) {
            err(`${rel}: step marcato ma non visibile — "${inizio}…"`);
        }
        const residuoLd = String(step.text || '').match(TOKEN_RESIDUO);
        if (residuoLd) {
            err(`${rel}: token dose non risolto nel JSON-LD — "${residuoLd[0]}"`);
        }
    }
    const residuo = testo.match(TOKEN_RESIDUO);
    if (residuo) {
        err(`${rel}: token dose non risolto nel testo visibile — "${residuo[0]}"`);
    }

    // Durate del JSON-LD: più di 24 ore di cookTime per una ricetta di casa non
    // è una ricetta, è un parsing andato male («Effeuno P134H» letto come 134
    // ore — pubblicato davvero); e un totale minore della sola cottura è
    // internamente contraddittorio.
    const cookMin = minutiDaIso(ricetta.cookTime);
    const totMin = minutiDaIso(ricetta.totalTime);
    if (cookMin != null && cookMin > 24 * 60) {
        err(`${rel}: cookTime ${ricetta.cookTime} — oltre 24 ore di cottura: quasi certamente `
            + `una durata letta da testo che non era una durata`);
    }
    if (cookMin != null && totMin != null && cookMin > totMin) {
        err(`${rel}: cookTime ${ricetta.cookTime} maggiore di totalTime ${ricetta.totalTime}`);
    }

    // NutritionInformation marcata → le calorie devono essere visibili: è lo
    // stesso vincolo di ingredienti e passaggi. Si era già rotto in silenzio:
    // le pagine statiche marcavano nutrition nel JSON-LD senza un solo valore
    // nutrizionale nel testo, e questo controllo non esisteva.
    const calorie = ricetta.nutrition?.calories;
    if (calorie) {
        const kcal = String(calorie).replace(/\s*kcal\s*$/i, '');
        if (!new RegExp(`${kcal}\\s*kcal`, 'i').test(testo)) {
            err(`${rel}: NutritionInformation marcata (${calorie}) ma nessun valore calorico visibile nella pagina`);
        }
    }

    // …e la BASE deve combaciare, non solo il numero. Il JSON-LD dichiara
    // servingSize "100 g" mentre il disclaimer visibile ha dichiarato per mesi
    // la base sbagliata (la ricetta intera): il confronto sul numero non poteva
    // accorgersene, perché kcal esce dalla stessa fonte da entrambe le parti.
    // Qui si pretende la locuzione «per 100 g» nel testo che una persona
    // legge — il semplice "100 g" non basta, lo direbbe qualunque riga
    // ingrediente.
    const baseNutrizione = ricetta.nutrition?.servingSize;
    if (baseNutrizione && /100\s*g/i.test(String(baseNutrizione))
        && !/per\s+100\s*g/i.test(testo)) {
        err(`${rel}: il JSON-LD dichiara servingSize "${baseNutrizione}" ma nel testo visibile manca la base «per 100 g»`);
    }

    return { rel, blocchi };
}

// ── 1. Tutte le pagine ──
// Il controllo redirect copre TUTTI gli .html di dist, non solo gli
// index.html: prima l'esclusione era implicita («si guardano solo i file
// chiamati index.html») e su 107 pagine l'unica non controllata era proprio
// 404.html. L'eccezione ora è dichiarata: dist/404.html è lo shim di GitHub
// Pages e il redirect DEVE farlo — è il suo mestiere (vedi CLAUDE.md, «Un
// indirizzo che non esiste deve dirlo»); che lo faccia davvero, e verso la
// base giusta, lo pretende la sezione 3 qui sotto.
const REDIRECT_AMMESSO = new Set([`${DIST}/404.html`]);
let pagine = 0;
(function scorri(dir) {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
        const p = join(dir, e.name);
        if (e.isDirectory()) scorri(p);
        else if (e.name === 'index.html') { paginaHtml(p); pagine++; }
        else if (/\.html$/i.test(e.name)) {
            const rel = p.split(sep).join('/');
            if (!REDIRECT_AMMESSO.has(rel)) controllaRedirect(rel, readFileSync(p, 'utf8'));
        }
    }
})(DIST);

// ── 1-bis. Doppia codifica, ovunque ──
// Il controllo stava dentro paginaHtml e guardava solo gli index.html: bastava
// che il testo corrotto stesse in un campo non pre-renderizzato (un consiglio,
// una nota, la definizione di un glossario) perché passasse indisturbato e
// arrivasse comunque al browser via recipes.json o via il .json della ricetta.
// Qui si guarda tutto quello che è testo: la sorgente in ricette/ — così il
// problema si vede prima ancora della build — e ogni file pubblicabile di dist/.
const ESTENSIONI_TESTO = /\.(html|json|xml|txt|css|js|svg|webmanifest)$/i;

/** Sidecar e backup che vivono accanto alle ricette ma non sono ricette. */
const NON_E_UNA_RICETTA = /\.(backup|pre-edit|pre-gen|qualita)\.json$/i;

function scorriTesti(dir, azione) {
    if (!existsSync(dir)) return;
    for (const e of readdirSync(dir, { withFileTypes: true })) {
        const p = join(dir, e.name);
        if (e.isDirectory()) scorriTesti(p, azione);
        else if (ESTENSIONI_TESTO.test(e.name)) azione(p, p.split(sep).join('/'));
    }
}

let testiControllati = 0;
for (const cartella of ['ricette', DIST]) {
    scorriTesti(cartella, (percorso, rel) => {
        testiControllati++;
        controllaDoppiaCodifica(rel, readFileSync(percorso, 'utf8'), !NON_E_UNA_RICETTA.test(rel));
    });
}

// ── 2. Sitemap ──
if (!existsSync(join(DIST, 'sitemap.xml'))) {
    err('manca dist/sitemap.xml');
} else {
    const xml = readFileSync(join(DIST, 'sitemap.xml'), 'utf8');
    const urls = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1]);
    if (urls.length !== new Set(urls).size) err('sitemap.xml: URL duplicati');
    for (const u of urls) {
        if (!u.startsWith(SITE_URL)) { err(`sitemap.xml: URL fuori dominio — ${u}`); continue; }
        const rel = u.slice(SITE_URL.length + 1);
        const file = rel === '' ? join(DIST, 'index.html') : join(DIST, rel, 'index.html');
        if (!existsSync(file)) err(`sitemap.xml: ${u} non corrisponde a nessuna pagina`);
    }
    if (urls.length !== pagine) {
        warn(`sitemap.xml elenca ${urls.length} URL ma le pagine sono ${pagine}`);
    }
}

// ── 2-bis. Il grafo dei link interni ──
// Era l'unico layer senza cancello, e si è visto: il footer ha pubblicato per
// mesi link relativi che si rompevano su 104 pagine su 105 (un path relativo
// nel guscio condiviso si risolve contro l'URL della pagina che lo ospita),
// più una categoria «pasta» che non esiste. Qui ogni <a href> interno di ogni
// pagina deve risolvere a qualcosa che esiste davvero in dist/.
{
    const BASE_PATH = new URL(SITE_URL).pathname + '/'; // "/Ricettario/"
    // Il candidato deve essere un FILE: una directory senza index.html
    // "esiste" per existsSync ma in produzione è un 404.
    const eFile = (p) => {
        try { return statSync(p).isFile(); } catch { return false; }
    };
    const esisteTarget = new Map();
    const target = (percorso) => {
        if (esisteTarget.has(percorso)) return esisteTarget.get(percorso);
        const locale = percorso.replace(/\/+$/, '');
        const candidati = locale === ''
            ? [join(DIST, 'index.html')]
            : [
                join(DIST, ...locale.split('/'), 'index.html'),
                join(DIST, ...locale.split('/')),
                join(DIST, ...`${locale}.html`.split('/')),
            ];
        const ok = candidati.some(eFile);
        esisteTarget.set(percorso, ok);
        return ok;
    };

    (function scorriPagine(dir) {
        for (const e of readdirSync(dir, { withFileTypes: true })) {
            const p = join(dir, e.name);
            if (e.isDirectory()) { scorriPagine(p); continue; }
            if (e.name !== 'index.html') continue;
            const rel = p.slice(DIST.length + 1).split(sep).join('/');
            const html = readFileSync(p, 'utf8');
            // L'URL della cartella della pagina: è la base contro cui il
            // browser risolverebbe un href relativo, quindi è quella giusta
            // anche per giudicarlo.
            const dirUrl = `https://pagina${BASE_PATH}${rel.replace(/index\.html$/, '')}`;
            for (const m of html.matchAll(/<a\s[^>]*?href="([^"]*)"/g)) {
                const href = m[1];
                if (!href || /^(https?:|mailto:|tel:|#|javascript:)/i.test(href)) continue;
                let u;
                try { u = new URL(href, dirUrl); } catch {
                    err(`${rel}: href non interpretabile — "${href}"`);
                    continue;
                }
                if (!u.pathname.startsWith(BASE_PATH)) {
                    err(`${rel}: link interno fuori dalla base del sito — href="${href}" `
                        + `risolve a ${u.pathname}. Un path relativo nel guscio condiviso vale `
                        + `solo sulla pagina dove per caso torna: scrivilo assoluto (${BASE_PATH}…).`);
                    continue;
                }
                const percorso = decodeURI(u.pathname.slice(BASE_PATH.length));
                if (!target(percorso)) {
                    err(`${rel}: link a una pagina che non esiste — href="${href}"`);
                }
            }
        }
    })(DIST);

    // Le pagine categoria sono linkate staticamente solo dal footer della
    // homepage: senza quei link sono orfane per un crawler senza JS, e
    // l'elenco nel footer è per forza una copia di js/categories.js (markup
    // statico). Questo controllo è ciò che impedisce alle due liste di
    // divergere: categoria nuova nell'indice → link nuovo nel footer, o non
    // si pubblica.
    const indicePath = join(DIST, 'recipes.json');
    if (existsSync(indicePath)) {
        const indice = JSON.parse(readFileSync(indicePath, 'utf8'));
        const home = readFileSync(join(DIST, 'index.html'), 'utf8');
        for (const d of [...new Set(indice.recipes.map(r => r.categoryDir))]) {
            if (!home.includes(`href="${BASE_PATH}ricette/${d}/"`)) {
                err(`index.html: la categoria "${d}" non ha un link statico in homepage — `
                    + `aggiungila all'elenco del footer in index.html, o la sua pagina resta `
                    + `orfana per i crawler`);
            }
        }
    }
}

// ── 2-ter. Il file che risponde agli indirizzi che non esistono ──
// GitHub Pages serve dist/404.html per ogni URL che non corrisponde a un file,
// e lo serve con status 404 (misurato il 28/07/2026 su /ricette/ e su
// /cottura/slug-inventato/). Quel file fa DUE mestieri insieme, ed è per questo
// che va guardato: è la risposta d'errore del server, ed è anche il guscio che
// rimanda alla SPA l'indirizzo chiesto, perché sia lei a dire cosa manca.
//
// Il modo peggiore di romperlo non è cancellarlo: è riempirlo con la homepage.
// deploy-ghpages.js lo faceva da sé quando il file mancava — copiava
// index.html — e il risultato sarebbe stato il sito intero servito sotto
// qualunque indirizzo sbagliato, cioè il soft 404 messo su disco. La copia è
// stata tolta; questo controllo è ciò che se ne accorge se rientra da un'altra
// strada.
{
    const p404 = join(DIST, '404.html');
    if (!existsSync(p404)) {
        err('manca dist/404.html: senza, GitHub Pages risponde con la sua pagina di default e i '
            + 'deep link non arrivano mai al router della SPA. Deve arrivare da public/404.html.');
    } else {
        const html = readFileSync(p404, 'utf8');
        if (!/spa-redirect/.test(html)) {
            err('dist/404.html non è lo shim della SPA (non nomina "spa-redirect"): ogni indirizzo '
                + 'profondo — anche quelli giusti che non hanno un file, come una configurazione '
                + 'del calcolatore — smetterebbe di arrivare al router.');
        }
        if (/id="recipe-carousels"/.test(html)) {
            err('dist/404.html è una copia della homepage: ogni indirizzo sbagliato servirebbe il '
                + 'sito intero con status 404 addosso. È il soft 404 che il router non fa più: non '
                + 'rimetterlo nel file che dovrebbe dire il contrario.');
        }
        // La via d'uscita senza JavaScript è l'unico posto del file dove la base
        // è scritta a mano invece che contata: se il sito cambia base, questo
        // link resta indietro e nessuno se ne accorge (è visibile solo a chi ha
        // JavaScript disattivato).
        const BASE_PATH = new URL(SITE_URL).pathname + '/';
        const uscita = html.match(/<noscript>[\s\S]*?href="([^"]*)"/);
        if (!uscita) {
            warn('dist/404.html: nessuna via d\'uscita dentro <noscript>. Senza JavaScript è '
                + 'l\'unica pagina bianca del sito, visto che tutte le altre sono pre-renderizzate.');
        } else if (uscita[1] !== BASE_PATH) {
            err(`dist/404.html: il link del <noscript> punta a "${uscita[1]}" ma la base del sito è `
                + `"${BASE_PATH}". Allinealo, o chi non ha JavaScript finisce fuori dal sito.`);
        }
    }
}

// ── 2-ter. Il manifest della PWA ──
// Era l'unico file del sito che nessun cancello apriva: `SEMPRE_LECITE` lo
// dichiara lecito e nessuno ne guardava il contenuto. Intanto stava nella
// radice del repo invece che in public/, quindi Vite lo trattava come asset di
// index.html e lo emetteva hashato dentro /assets/ — SENZA riscrivere gli URL
// che contiene, perché quelli stanno dentro un JSON e non nell'HTML. Risultato
// misurato in produzione: `"src": "favicon.svg"` risolveva a
// /Ricettario/assets/favicon.svg (404) e `"start_url": "./"` a
// /Ricettario/assets/ (404). Cioè installando la PWA si apriva una pagina
// inesistente, e l'icona non c'era.
//
// Il controllo risolve gli URL del manifest come farebbe il browser — relativi
// alla posizione in cui il manifest è servito — e pretende che esistano.
{
    const BASE_PATH = new URL(SITE_URL).pathname + '/';
    const manifestPath = join(DIST, 'site.webmanifest');
    if (!existsSync(manifestPath)) {
        err('dist/site.webmanifest non trovato: deve stare in public/, non nella radice del repo, '
            + 'o Vite lo hasha dentro /assets/ e gli URL relativi che contiene puntano nel vuoto.');
    } else {
        const home = readFileSync(join(DIST, 'index.html'), 'utf8');
        if (!home.includes(`href="${BASE_PATH}site.webmanifest"`)) {
            err(`index.html non punta a ${BASE_PATH}site.webmanifest: se il riferimento passa da `
                + 'Vite il file viene hashato in /assets/ e gli URL interni si rompono.');
        }
        let manifest;
        try {
            manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
        } catch (e) {
            err(`dist/site.webmanifest non parsabile — ${e.message}`);
        }
        if (manifest) {
            const daControllare = [
                ['start_url', manifest.start_url],
                ['scope', manifest.scope],
                ...(manifest.icons || []).map((i, n) => [`icons[${n}].src`, i?.src]),
            ].filter(([, v]) => v);

            for (const [campo, valore] of daControllare) {
                // Il manifest è servito da BASE_PATH: è lì che il browser
                // risolve i suoi percorsi relativi.
                const risolto = new URL(valore, `https://x${BASE_PATH}site.webmanifest`).pathname;
                if (!risolto.startsWith(BASE_PATH)) {
                    err(`site.webmanifest: "${campo}" = "${valore}" esce dalla base del sito (${risolto}).`);
                    continue;
                }
                const rel = risolto.slice(BASE_PATH.length);
                const bersaglio = rel === '' ? join(DIST, 'index.html') : join(DIST, ...rel.split('/'));
                if (!existsSync(bersaglio)) {
                    err(`site.webmanifest: "${campo}" = "${valore}" punta a ${risolto}, che non esiste. `
                        + `Una PWA installata con questo manifest apre un 404.`);
                }
            }
            if (!manifest.icons?.length) {
                warn('site.webmanifest: nessuna icona dichiarata.');
            }
        }
    }
}

// ── 3. Robaccia che non deve essere pubblicata ──
(function frughino(dir) {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
        const p = join(dir, e.name);
        if (e.isDirectory()) {
            if (e.name === 'pdf') err(`dist/pdf/ non deve essere pubblicata (~173 MB di sorgenti)`);
            else frughino(p);
        } else if (/\.(backup|pre-edit)\.json$/.test(e.name)) {
            err(`file di lavoro pubblicato: ${p.split(sep).join('/')}`);
        }
    }
})(DIST);

// ── 4. Risorse pubblicate che nessuno usa ──
// `public/` viene copiato per intero in dist/, quindi ci basta metterci un file
// perché finisca online: nessuno lo referenzia, nessuno lo vede, e resta lì.
// È successo con 26 immagini di trafile (324 KB), pubblicate per mesi senza che
// una sola pagina le nominasse.
//
// Come si decide se una risorsa è usata: si cerca in TUTTI i file di testo di
// dist/ (html, css, js, json, sitemap) o il percorso, o il nome del file senza
// estensione. Il nome nudo serve perché i percorsi delle foto ricetta non sono
// mai scritti per esteso: nascono da `images/ricette/${cartella}/${slug}.webp`,
// quindi in dist/ compare lo slug, non il percorso. Basta quello a distinguere
// una foto usata da una dimenticata.
const ESTENSIONI_RISORSA = /\.(webp|avif|png|jpe?g|gif|svg|woff2?|ttf|otf|mp4|webm|pdf)$/i;

/**
 * Risorse che nessuna pagina nomina, ma che vanno servite lo stesso perché le
 * chiede il browser o un crawler da sé.
 */
const SEMPRE_LECITE = [
    /^favicon\./i,
    /^apple-touch-icon/i,
    /^robots\.txt$/i,
    /^site\.webmanifest$/i,
];

function elencaRisorse(dir, acc = []) {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
        const p = join(dir, e.name);
        if (e.isDirectory()) elencaRisorse(p, acc);
        else if (ESTENSIONI_RISORSA.test(e.name)) acc.push(p);
    }
    return acc;
}

// Un'unica grande stringa con tutto il testo pubblicato: cercare 300 volte
// dentro 300 file sarebbe O(n²) su un cancello che deve restare veloce.
let testoPubblicato = '';
scorriTesti(DIST, (percorso) => { testoPubblicato += readFileSync(percorso, 'utf8'); });

const risorse = elencaRisorse(DIST);
const orfane = [];
for (const p of risorse) {
    const rel = p.slice(DIST.length + 1).split(sep).join('/');
    const nome = rel.split('/').pop();
    const senzaEstensione = nome.replace(/\.[^.]+$/, '');
    if (SEMPRE_LECITE.some(r => r.test(nome))) continue;
    // `dist/assets/` sono i file prodotti da Vite: hanno l'hash nel nome e sono
    // referenziati dall'HTML, quindi il controllo li copre già dal caso generale.
    if (testoPubblicato.includes(rel) || testoPubblicato.includes(nome)) continue;
    if (senzaEstensione.length >= 4 && testoPubblicato.includes(senzaEstensione)) continue;
    orfane.push({ rel, kb: Math.round(statSync(p).size / 1024) });
}
if (orfane.length) {
    const totale = orfane.reduce((s, o) => s + o.kb, 0);
    err(`${orfane.length} risorse pubblicate che nessuna pagina referenzia (${totale} KB in totale). `
        + `Se servono, referenziale; se non servono, tienile fuori da public/. `
        + `Prime: ${orfane.slice(0, 3).map(o => o.rel).join(', ')}`);
}

// ── 5. Immagini troppo pesanti ──
// Il totale di dist/ non basta: 60 MB di soglia lasciano passare una singola
// foto da 700 KB, che su una pagina ricetta è dieci volte il peso di tutto il
// JavaScript. La soglia non è inventata: alla dimensione standard del sito
// (1800 px) la mediana delle 38 foto è 181 KB, quindi 500 KB è già il triplo
// della norma e 300 KB il segnale che qualcosa è stato compresso male.
const LIMITE_AVVISO_KB = 300;
const LIMITE_ERRORE_KB = 500;
// Le immagini Open Graph le scarica solo un crawler quando qualcuno condivide
// un link, mai un lettore che naviga: hanno una soglia loro, più larga.
const LIMITE_OG_KB = 1024;

for (const p of risorse) {
    if (!/\.(webp|avif|png|jpe?g)$/i.test(p)) continue;
    const rel = p.slice(DIST.length + 1).split(sep).join('/');
    const kb = Math.round(statSync(p).size / 1024);
    const eOg = rel.includes('images/og/');
    const limite = eOg ? LIMITE_OG_KB : LIMITE_ERRORE_KB;
    if (kb > limite) {
        err(`${rel}: ${kb} KB, oltre il limite di ${limite} KB — va ricompressa`);
    } else if (!eOg && kb > LIMITE_AVVISO_KB) {
        warn(`${rel}: ${kb} KB (la mediana del sito è 181 KB)`);
    }
}

// ── 6. Metadati di produzione pubblicati ──
// I JSON delle ricette servono al sito, ma li scrive la dashboard, che ci
// infila anche roba sua. `_generatedBy` (quale modello ha scritto la ricetta)
// è stato online in 70 ricette su 80 senza che nessuna pagina lo mostrasse.
//
// Il controllo è una lista di ciò che PUÒ essere pubblicato, non di ciò che non
// può: così un campo interno nuovo — che nessuno qui può prevedere, perché
// nasce nell'altro repo — viene intercettato al primo deploy invece che al
// prossimo checkup.
const CAMPI_INTERNI_AMMESSI = {
    // L'underscore dice "interno", ma questi due sono contratto pubblico.
    _createdAt: 'date delle ricette, datePublished nel JSON-LD, lastmod nella sitemap',
    _originalImageUrl: 'link alla pagina d\'origine della foto, richiesto dalle licenze CC',
};

function controllaCampiInterni(dir) {
    if (!existsSync(dir)) return;
    for (const e of readdirSync(dir, { withFileTypes: true })) {
        const p = join(dir, e.name);
        if (e.isDirectory()) { controllaCampiInterni(p); continue; }
        if (!e.name.endsWith('.json')) continue;
        let dati;
        try { dati = JSON.parse(readFileSync(p, 'utf8')); } catch { continue; }
        const ricette = Array.isArray(dati?.recipes) ? dati.recipes : [dati];
        const rel = p.slice(DIST.length + 1).split(sep).join('/');
        const visti = new Set();
        for (const r of ricette) {
            if (!r || typeof r !== 'object') continue;
            for (const k of Object.keys(r)) {
                if (k.startsWith('_') && !(k in CAMPI_INTERNI_AMMESSI)) visti.add(k);
            }
        }
        for (const k of visti) {
            err(`${rel}: pubblica il campo interno "${k}". Se serve al sito, dichiaralo in `
                + `CAMPI_INTERNI_AMMESSI qui in verifica-build.js; se no, toglilo in vite.config.js.`);
        }
    }
}
controllaCampiInterni(DIST);

// ── 7. Foto senza credito ──
// Una foto pubblicata senza dire da dove viene è un rischio di licenza, non un
// dettaglio di forma: le Creative Commons obbligano a citare autore e licenza
// ogni volta che l'immagine si vede, e la CC BY decade da sola se non lo fai.
// È già successo — cinque ricette pubblicate per mesi con foto CC e nessun
// credito (punto 13 del checkup della dashboard).
//
// Il campo può anche dire "provenienza non documentata": è una risposta valida
// e vuol dire che la fonte è stata cercata e non trovata. Quello che il
// cancello non accetta è il silenzio, cioè una foto e nessun campo.
{
    const senzaCredito = [];
    (function cerca(dir) {
        if (!existsSync(dir)) return;
        for (const e of readdirSync(dir, { withFileTypes: true })) {
            const p = join(dir, e.name);
            if (e.isDirectory()) { cerca(p); continue; }
            if (!e.name.endsWith('.json')) continue;
            let r;
            try { r = JSON.parse(readFileSync(p, 'utf8')); } catch { continue; }
            if (!r || typeof r !== 'object' || Array.isArray(r.recipes)) continue;
            if (r.image && !String(r.imageAttribution || '').trim()) {
                senzaCredito.push(p.slice(DIST.length + 1).split(sep).join('/'));
            }
        }
    })(join(DIST, 'ricette'));
    for (const f of senzaCredito) {
        err(`${f}: ha una foto ma nessun "imageAttribution". Se la fonte non è `
            + `ricostruibile, scrivi "📷 Foto: provenienza non documentata" — il sito `
            + `non lo mostra, ma resta agli atti che è stata cercata.`);
    }
}

// ── 8. Peso complessivo ──
function peso(dir) {
    let t = 0;
    for (const e of readdirSync(dir, { withFileTypes: true })) {
        const p = join(dir, e.name);
        t += e.isDirectory() ? peso(p) : statSync(p).size;
    }
    return t;
}
const mb = peso(DIST) / 1048576;
if (mb > 60) err(`dist/ pesa ${mb.toFixed(0)} MB: qualcosa di grosso è rientrato nel deploy`);

// ── 9. Il CSS, che non ha errori ──
// Un `var()` che punta a un token inesistente non è un errore di sintassi: il
// foglio si carica, la pagina si disegna, la console tace, e la dichiarazione
// semplicemente non fa niente. Una classe che nessuno scrive più nel markup non
// produce nemmeno un avviso. Sono difetti che nascono morti e restano tali per
// mesi, perché nessuno strumento di questo progetto era in grado di accorgersene:
// tre token mai esistiti hanno tenuto spente le sfumature dei caroselli e
// l'ombra delle frecce dal 20/02/2026, e il bordo del pulsante «Fatta» dal
// 30/03; 25 classi morte facevano scaricare 4 kB di CSS a ogni visitatore.
//
// Guardano i SORGENTI in css/, non dist/, per due motivi: il problema si vede
// prima della build, e il messaggio può nominare il file e la riga veri invece
// di un bundle con l'hash nel nome.
let classiCss = 0;
{
    const fogli = [];
    scorriTesti('css', (percorso, rel) => {
        if (rel.endsWith('.css')) fogli.push({ rel, testo: readFileSync(percorso, 'utf8') });
    });

    // Commenti, stringhe e url() vanno neutralizzati prima di ogni analisi: i
    // commenti nominano di proposito token e classi che non esistono più (è così
    // che si spiega perché sono stati tolti), e `url(../images/x.png)` fa
    // sembrare `.png` un selettore di classe. Si sostituiscono con spazi invece
    // che a vuoto perché i numeri di riga devono restare quelli veri.
    const spazi = (m) => m.replace(/[^\n]/g, ' ');
    const pulisci = (s) => s
        .replace(/\/\*[\s\S]*?\*\//g, spazi)
        .replace(/url\([^)]*\)/g, spazi)
        .replace(/"[^"\n]*"/g, spazi)
        .replace(/'[^'\n]*'/g, spazi);
    const riga = (testo, indice) => testo.slice(0, indice).split('\n').length;
    for (const f of fogli) f.pulito = pulisci(f.testo);

    // ── 9a. Ogni var(--x) deve avere una --x definita ──
    const definiti = new Set();
    for (const f of fogli) {
        for (const m of f.pulito.matchAll(/(--[\w-]+)\s*:/g)) definiti.add(m[1]);
    }
    // Oggi nessuna custom property nasce fuori dai fogli, ma il giorno in cui
    // qualcuno ne scriverà una da JavaScript o in uno `style=` inline, questo
    // controllo non deve accusarla di non esistere.
    scorriTesti('js', (percorso) => {
        const t = readFileSync(percorso, 'utf8');
        for (const m of t.matchAll(/setProperty\(\s*['"`](--[\w-]+)/g)) definiti.add(m[1]);
        for (const m of t.matchAll(/(--[\w-]+)\s*:/g)) definiti.add(m[1]);
    });
    for (const m of readFileSync('index.html', 'utf8').matchAll(/(--[\w-]+)\s*:/g)) definiti.add(m[1]);

    for (const f of fogli) {
        for (const m of f.pulito.matchAll(/var\(\s*(--[\w-]+)\s*(,?)/g)) {
            if (definiti.has(m[1])) continue;
            const dove = `${f.rel}:${riga(f.pulito, m.index)}`;
            if (m[2] === ',') {
                warn(`${dove}: var(${m[1]}) non è definita, quindi vince sempre il valore di ripiego. `
                    + 'Se è voluto scrivilo, se no è un token sbagliato.');
            } else {
                err(`${dove}: var(${m[1]}) non è definita da nessuna parte, quindi l'INTERA dichiarazione `
                    + 'è invalida e la proprietà torna al valore iniziale — senza un errore in console. '
                    + 'Definisci il token in css/base/tokens.css, o usa quello giusto: questo progetto '
                    + 'ha --color-surface-0…3, --border-subtle/medium, --shadow-sm/md/lg.');
            }
        }
    }

    // ── 9b. Ogni classe dichiarata deve comparire da qualche parte ──
    // Quattro famiglie di classi le compone il JavaScript a runtime
    // (`piano--${percorso}`): nel codice non compaiono mai per intero, quindi si
    // riconoscono dal prefisso. Se ne nasce una quinta, va aggiunta qui.
    const PREFISSI_A_RUNTIME = ['cottura-opzioni--', 'piano--', 'avviso--', 'storico__esito--'];

    const dichiarate = new Map();
    for (const f of fogli) {
        for (const m of f.pulito.matchAll(/\.(-?[_a-zA-Z][\w-]*)/g)) {
            if (!dichiarate.has(m[1])) dichiarate.set(m[1], `${f.rel}:${riga(f.pulito, m.index)}`);
        }
    }
    classiCss = dichiarate.size;

    // Tutto ciò che può scrivere una classe nel markup. Le righe che importano
    // un foglio di stile non contano: `filter-bar` compariva solo dentro
    // `import '.../filter-bar.css'`, cioè nella riga che caricava il foglio
    // morto, e si giustificava da sola.
    const CORPUS = /\.(js|html|json|svg|webmanifest)$/i;
    const FUORI = new Set(['node_modules', 'dist', '.git', 'css', 'pdf', 'fonts', 'images', 'materiale']);
    let corpus = '';
    (function raccogli(dir) {
        for (const e of readdirSync(dir, { withFileTypes: true })) {
            if (FUORI.has(e.name)) continue;
            const p = join(dir, e.name);
            if (e.isDirectory()) raccogli(p);
            else if (CORPUS.test(e.name)) {
                corpus += readFileSync(p, 'utf8')
                    .split('\n').filter(r => !/import\s+['"][^'"]+\.css['"]/.test(r)).join('\n') + '\n';
            }
        }
    })('.');

    // Confine di parola, non sottostringa: `.recipe-card` "compare" dentro
    // `recipe-card--compact`, che è una classe diversa. Cercandola fra le parole
    // del corpus il confine è garantito, e il controllo resta lineare invece di
    // scandire tutto il codice una volta per classe.
    const parole = new Set(corpus.split(/[^\w-]+/));

    const morte = [];
    for (const [classe, dove] of dichiarate) {
        if (PREFISSI_A_RUNTIME.some(pre => classe.startsWith(pre))) continue;
        if (!parole.has(classe)) morte.push(`${dove} .${classe}`);
    }
    // ── 9c. Il layer deve essere quello della cartella ──
    // `css/pages/cottura.css` ha dichiarato `@layer components` per mesi, cioè
    // il layer che PERDE contro `pages`: qualunque regola di recipe-detail.css
    // avrebbe battuto una regola del calcolatore a parità di specificità, il
    // contrario di quello che dà per scontato chi apre un file dentro pages/.
    // Non si vedeva perché quei due fogli non hanno un selettore in comune — è
    // il tipo di difetto che aspetta la regola giusta per mordere, e allora non
    // sembra un problema di layer ma di specificità.
    //
    // `css/base/` non è in elenco: è l'unica cartella con più layer per scelta
    // (tokens e reset), e fonts.css non ne ha nessuno perché contiene solo
    // @font-face.
    const LAYER_DELLA_CARTELLA = {
        'css/layout': 'layout',
        'css/components': 'components',
        'css/pages': 'pages',
        'css/utilities': 'utilities',
    };
    for (const f of fogli) {
        const cartella = f.rel.slice(0, f.rel.lastIndexOf('/'));
        const atteso = LAYER_DELLA_CARTELLA[cartella];
        if (!atteso) continue;
        const dichiarati = [...f.pulito.matchAll(/@layer\s+([\w-]+)/g)];
        if (!dichiarati.length) {
            err(`${f.rel}: non dichiara nessun @layer. Le regole fuori dai layer battono TUTTE quelle `
                + `dentro, qualunque sia la specificità — è già successo al pulsante «Fatta». `
                + `Questo foglio deve aprire con @layer ${atteso}.`);
            continue;
        }
        for (const m of dichiarati) {
            if (m[1] === atteso) continue;
            err(`${f.rel}:${riga(f.pulito, m.index)}: dichiara @layer ${m[1]}, ma sta in ${cartella}/ `
                + `e quindi deve essere @layer ${atteso}. L'ordine è tokens → reset → layout → `
                + 'components → pages → utilities: il layer sbagliato fa perdere (o vincere) contro '
                + 'fogli che non c\'entrano niente, e non si vede finché due regole non si incontrano.');
        }
    }

    // ── 9d. I breakpoint sono quelli dichiarati, e sono mobile-first ──
    // Erano nove valori mescolati a tre `max-width`, in un progetto che si
    // dichiara mobile-first: nessuno poteva dire a memoria quali fossero, e due
    // dei tre `max-width` descrivevano da un lato lo stesso confine che un
    // `min-width` descriveva dall'altro. Non era un difetto, era debito — il
    // tipo che si paga quando qualcuno aggiunge il decimo valore perché non
    // sapeva che esistevano gli altri nove.
    //
    // L'elenco NON sta qui: sta in css/base/tokens.css, dove ogni soglia ha il
    // suo perché scritto accanto. Averne una copia in questo file vorrebbe dire
    // due elenchi che divergono al primo cambiamento — è il difetto che questo
    // progetto ha già pagato tre volte.
    {
        const tokens = readFileSync(join('css', 'base', 'tokens.css'), 'utf8');
        const blocco = tokens.match(/\/\*\s*──\s*BREAKPOINT[\s\S]*?\*\//);
        const scala = blocco ? [...blocco[0].matchAll(/^\s*(\d{3,4})\s+\S/gm)].map(m => Number(m[1])) : [];
        if (!scala.length) {
            err('css/base/tokens.css: manca il blocco «── BREAKPOINT», che è l\'elenco delle soglie '
                + 'ammesse. Senza quello questo controllo non sa cosa permettere: rimettilo, non '
                + 'togliere il controllo.');
        } else {
            for (const f of fogli) {
                for (const m of f.pulito.matchAll(/@media[^{]*?\(\s*(min|max)-width\s*:\s*(\d+)px/g)) {
                    const dove = `${f.rel}:${riga(f.pulito, m.index)}`;
                    if (m[1] === 'max') {
                        err(`${dove}: @media (max-width: ${m[2]}px). Questo progetto è mobile-first: la `
                            + 'regola di partenza è quella del telefono e le media query aggiungono, non '
                            + 'tolgono. Girala in `min-width` — e se descrive lo stesso confine di una '
                            + 'query che esiste già, sono due modi di dire la stessa cosa.');
                    } else if (!scala.includes(Number(m[2]))) {
                        err(`${dove}: @media (min-width: ${m[2]}px) non è una delle soglie del progetto `
                            + `(${scala.join(', ')}). Usa quella giusta, o aggiungi la nuova al blocco `
                            + '«── BREAKPOINT» di css/base/tokens.css scrivendo perché serve.');
                    }
                }
            }
        }
    }

    if (morte.length) {
        const quante = morte.length === 1
            ? '1 classe dichiarata nel CSS che non compare'
            : `${morte.length} classi dichiarate nel CSS che non compaiono`;
        err(`${quante} in nessun markup. O il markup che le usava è stato sostituito e le regole sono `
            + 'da cancellare, o le scrive qualcosa che questo controllo non guarda — in quel caso il posto '
            + `giusto è PREFISSI_A_RUNTIME qui in verifica-build.js. ${morte.slice(0, 5).join(', ')}`
            + (morte.length > 5 ? `, …e altre ${morte.length - 5}` : ''));
    }
}

// ── Esito ──
console.log(`🔍 Verifica build — ${pagine} pagine, ${testiControllati} file di testo, `
    + `${classiCss} classi CSS, ${mb.toFixed(1)} MB`);
for (const a of avvisi) console.warn(`⚠️  ${a}`);
if (problemi.length) {
    for (const p of problemi.slice(0, 25)) console.error(`❌ ${p}`);
    if (problemi.length > 25) console.error(`   …e altri ${problemi.length - 25}`);
    console.error(`\n${problemi.length} problem${problemi.length === 1 ? 'a' : 'i'}: non pubblicare.`);
    process.exit(1);
}
console.log('✅ Build verificata.');
