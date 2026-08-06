/**
 * PAGINA.JS — punto di ingresso della sezione strumenti nella SPA.
 *
 * Registrato in main.js come renderer della route `strumenti`, e caricato con
 * import dinamico come il calcolatore di cottura: i testi delle guide e il CSS
 * di questa sezione non pesano su chi apre una ricetta.
 *
 * Due stati, decisi dall'URL:
 *   /strumenti/                              → l'hub con le schede
 *   /strumenti/cutter-sirman-c-tronic-6/     → la pagina dello strumento
 *
 * La FORMA dell'URL l'ha già giudicata il router; se lo slug ESISTA lo decide
 * il registry qui sotto (js/strumenti.js), come CATEGORIES_BY_DIR per le
 * categorie e configDaSlug per il calcolatore.
 */

import '../../css/pages/strumenti.css';

import { BASE } from '../router.js';
import { mostraNonTrovata } from '../non-trovata.js';
import { STRUMENTI, STRUMENTI_BY_SLUG } from '../strumenti.js';
import { CONTENUTI_STRUMENTI } from '../../dati/strumenti/indice.js';
import { htmlHubStrumenti, htmlStrumento, metaHubStrumenti, metaPaginaStrumento } from '../html-strumenti.js';
import { CATEGORIES } from '../categories.js';

/* global __RECIPES_HASH__ */
const CACHE_BUST = typeof __RECIPES_HASH__ !== 'undefined' ? `?v=${__RECIPES_HASH__}` : '';

export async function renderStrumenti(app, params = {}) {
    if (!params.slug) return mostraHub(app);

    const voce = STRUMENTI_BY_SLUG[params.slug];
    const contenuto = CONTENUTI_STRUMENTI[params.slug];
    if (!voce || !contenuto) {
        return mostraNonTrovata(app, {
            base: BASE,
            dettaglio: `Non c'è nessuno strumento all'indirizzo «${window.location.pathname}».`,
            uscite: [
                { href: `${BASE}strumenti/`, testo: 'Vedi tutti gli strumenti' },
                { href: BASE, testo: 'Torna alla home' },
            ],
        });
    }
    return mostraStrumento(app, voce, contenuto);
}

function mostraHub(app) {
    const meta = metaHubStrumenti();
    document.title = meta.titolo;
    aggiornaDescrizione(meta.descrizione);
    app.innerHTML = htmlHubStrumenti(STRUMENTI, { base: BASE });
}

async function mostraStrumento(app, voce, contenuto) {
    const meta = metaPaginaStrumento(voce);
    document.title = meta.titolo;
    aggiornaDescrizione(meta.descrizione);

    // Le ricette collegate vengono dall'indice, che è l'unica fonte del campo
    // `tools`. Se il fetch fallisce e la pagina pre-renderizzata è già lì,
    // il contenuto buono resta al suo posto: sostituirlo con una versione
    // senza ricette sarebbe un peggioramento travestito da render.
    let ricettePerLama = {};
    if (voce.lame.length) {
        try {
            ricettePerLama = await caricaRicettePerLama(voce.slug);
        } catch (e) {
            console.error('Strumenti: indice ricette non raggiungibile', e);
            if (app.querySelector('.strumento')) return;
        }
    }

    const categorie = (contenuto.categorieCollegate || [])
        .map(chiave => CATEGORIES[chiave])
        .filter(Boolean);

    app.innerHTML = htmlStrumento(contenuto, voce, { base: BASE, ricettePerLama, categorie });
}

async function caricaRicettePerLama(strumentoSlug) {
    const res = await fetch(`${BASE}recipes.json${CACHE_BUST}`);
    if (!res.ok) throw new Error(`recipes.json → HTTP ${res.status}`);
    const dati = await res.json();

    const perLama = {};
    for (const r of dati.recipes) {
        for (const t of r.tools || []) {
            if (t.strumento !== strumentoSlug) continue;
            (perLama[t.lama] ??= []).push({
                title: r.title,
                slug: r.slug,
                categoryDir: r.categoryDir,
                nota: t.nota || '',
            });
        }
    }
    for (const voci of Object.values(perLama)) {
        voci.sort((a, b) => a.title.localeCompare(b.title, 'it'));
    }
    return perLama;
}

/**
 * Stessa ragione del gemello in cottura/pagina.js: il pre-rendering riscrive
 * la meta description, ma la SPA cambia pagina senza ricaricare — senza
 * questo, chi condivide dalla barra del browser condivide la home.
 */
function aggiornaDescrizione(testo) {
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', 'description');
        document.head.appendChild(meta);
    }
    meta.setAttribute('content', testo);
}
