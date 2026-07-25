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
 * Doppia codifica UTF-8: testo salvato come Latin-1 e ri-codificato.
 * Si vede come "metÃ " al posto di "metà". È già successo su 7 ricette.
 */
const DOPPIA_CODIFICA = /[Â-Ã][-¿]/g;

/** Contenuto di un tag/attributo singolo, o stringa vuota. */
function estrai(html, regex) {
    const m = html.match(regex);
    return m ? normalizza(m[1].replace(/<[^>]+>/g, ' ')) : '';
}

function paginaHtml(percorso) {
    const rel = percorso.split(sep).join('/');
    const html = readFileSync(percorso, 'utf8');
    const eRicetta = /\/ricette\/[^/]+\/[^/]+\/index\.html$/.test(rel);
    const ePianoCottura = /\/cottura\/[^/]+\/index\.html$/.test(rel);
    const eIndiceCottura = /\/cottura\/index\.html$/.test(rel);

    if (!/rel="canonical"/.test(html)) err(`${rel}: manca <link rel="canonical">`);

    DOPPIA_CODIFICA.lastIndex = 0;
    const rotti = html.match(DOPPIA_CODIFICA);
    if (rotti) {
        const esempi = [...new Set(rotti)].slice(0, 4).map(s => JSON.stringify(s)).join(' ');
        err(`${rel}: testo a doppia codifica UTF-8 (${rotti.length} occorrenze: ${esempi})`);
    }

    // Il redirect JS rendeva le pagine non indicizzabili: i crawler lo seguono
    // e consolidano tutto sulla homepage. Non deve tornare.
    if (/location\.replace|http-equiv="refresh"/.test(html)) {
        err(`${rel}: contiene un redirect che impedisce l'indicizzazione`);
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
    }

    return { rel, blocchi };
}

// ── 1. Tutte le pagine ──
let pagine = 0;
(function scorri(dir) {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
        const p = join(dir, e.name);
        if (e.isDirectory()) scorri(p);
        else if (e.name === 'index.html') { paginaHtml(p); pagine++; }
    }
})(DIST);

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

// ── 4. Peso ──
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

// ── Esito ──
console.log(`🔍 Verifica build — ${pagine} pagine, ${mb.toFixed(1)} MB`);
for (const a of avvisi) console.warn(`⚠️  ${a}`);
if (problemi.length) {
    for (const p of problemi.slice(0, 25)) console.error(`❌ ${p}`);
    if (problemi.length > 25) console.error(`   …e altri ${problemi.length - 25}`);
    console.error(`\n${problemi.length} problem${problemi.length === 1 ? 'a' : 'i'}: non pubblicare.`);
    process.exit(1);
}
console.log('✅ Build verificata.');
