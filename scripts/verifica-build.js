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

function paginaHtml(percorso) {
    const rel = percorso.split(sep).join('/');
    const html = readFileSync(percorso, 'utf8');
    const eRicetta = /\/ricette\/[^/]+\/[^/]+\/index\.html$/.test(rel);
    const ePianoCottura = /\/cottura\/[^/]+\/index\.html$/.test(rel);
    const eIndiceCottura = /\/cottura\/index\.html$/.test(rel);

    if (!/rel="canonical"/.test(html)) err(`${rel}: manca <link rel="canonical">`);

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

// ── Esito ──
console.log(`🔍 Verifica build — ${pagine} pagine, ${testiControllati} file di testo, ${mb.toFixed(1)} MB`);
for (const a of avvisi) console.warn(`⚠️  ${a}`);
if (problemi.length) {
    for (const p of problemi.slice(0, 25)) console.error(`❌ ${p}`);
    if (problemi.length > 25) console.error(`   …e altri ${problemi.length - 25}`);
    console.error(`\n${problemi.length} problem${problemi.length === 1 ? 'a' : 'i'}: non pubblicare.`);
    process.exit(1);
}
console.log('✅ Build verificata.');
