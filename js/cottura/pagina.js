/**
 * PAGINA.JS — punto di ingresso del calcolatore di cottura nella SPA.
 *
 * Registrato in main.js come renderer della route `cottura`, e caricato con
 * import dinamico: profili dei tagli, coefficienti e CSS di questa pagina non
 * pesano su chi apre una ricetta di pane.
 *
 * Due stati, decisi dall'URL:
 *   /cottura/                         → il form
 *   /cottura/?taglio=…&cm=…           → il piano
 *   /cottura/fiorentina-4cm-kamado/   → il piano (configurazione pre-generata)
 *
 * L'URL è l'unica fonte dello stato: ricaricare la pagina o mandare il link a
 * qualcuno deve dare la stessa schermata.
 */

import '../../css/pages/cottura.css';

import DOC_TAGLI from '../../dati/cottura/tagli.json';
import DOC_DISPOSITIVI from '../../dati/cottura/dispositivi.json';

import { BASE, navigateTo } from '../router.js';
import { piano } from './motore.js';
import { montaForm } from './form.js';
import { montaPiano } from './vista-piano.js';
import { leggiQuery, scriviQuery, configDaSlug, normalizza } from './stato-url.js';
import { num } from './formato.js';

const DATI = {
    tagli: DOC_TAGLI.tagli,
    dispositivi: DOC_DISPOSITIVI.dispositivi,
    defaultDispositivo: DOC_DISPOSITIVI.default,
};

const SITO = 'Ricettario Lab';

export async function renderCottura(app, params = {}) {
    // Priorità allo slug: se l'URL è una pagina pre-generata, è quella che
    // comanda, e la query serve solo per le varianti.
    const daSlug = configDaSlug(params.config, DATI);
    const daQuery = leggiQuery(window.location.search);
    const parziale = daSlug ? { ...daSlug, ...(daQuery || {}) } : daQuery;

    if (!parziale) return mostraForm(app, normalizza(null, DATI));
    return mostraPiano(app, normalizza(parziale, DATI));
}

// ═══════════════════════════════════════════════════════════════

function mostraForm(app, config) {
    document.title = `Calcolatore di cottura su kamado — ${SITO}`;
    aggiornaDescrizione('Un piano di cottura completo per il tuo pezzo di carne sul kamado: fasi, tempi, temperatura al cuore, gestione delle valvole e temperatura di estrazione calcolata.');

    app.innerHTML = '<div class="container container--narrow"><div id="cottura-form"></div></div>';
    const radice = app.querySelector('#cottura-form');

    montaForm(radice, config, DATI, {
        onFine: (finale) => {
            // Il piano prende un URL suo: condivisibile, ricaricabile, e il
            // tasto Indietro riporta al form invece di uscire dal sito.
            navigateTo(`${BASE}cottura/?${scriviQuery(finale)}`);
        },
        onAnnulla: () => navigateTo(BASE),
    });
}

function mostraPiano(app, config) {
    let calcolato;
    try {
        calcolato = piano(config, DATI);
    } catch (e) {
        // Un URL manomesso non deve lasciare la pagina bianca.
        console.error('Calcolatore cottura:', e);
        return mostraForm(app, normalizza(null, DATI));
    }

    const misura = calcolato.misura.dominante === 'spessore'
        ? `${num(calcolato.misura.spessore_cm)} cm`
        : `${num(calcolato.misura.peso_kg)} kg`;

    document.title = `${calcolato.taglio.nome} da ${misura} su kamado — ${SITO}`;
    aggiornaDescrizione(
        // Il nome del taglio non si abbassa: "Fiorentina / T-bone" diventerebbe
        // "fiorentina / t-bone". Quello del dispositivo sì, è un nome comune.
        `Piano di cottura per ${calcolato.taglio.nome} da ${misura} su ${calcolato.dispositivo.nome.toLowerCase()}: `
        + `estrazione a ${calcolato.estrazione.c} °C, fasi, temperature di camera e gestione delle valvole.`,
    );

    app.innerHTML = '<div id="cottura-piano"></div>';
    montaPiano(app.querySelector('#cottura-piano'), calcolato, {
        base: BASE.replace(/\/$/, ''),
        config,
        onModifica: () => mostraForm(app, config),
    });
}

/**
 * La meta description la riscrive anche il pre-rendering, ma la SPA cambia
 * pagina senza ricaricare: senza questo, chi condivide dalla barra del browser
 * dopo aver navigato dentro il calcolatore condivide la descrizione della home.
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
