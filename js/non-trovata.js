/* ============================================
   IL RICETTARIO — La pagina che dice «non c'è»
   ============================================ */

/**
 * NON-TROVATA.JS — l'unico messaggio «questo indirizzo non esiste» del sito.
 *
 * Il sito ha quattro modi diversi di non trovare qualcosa, e ognuno lo scopre
 * da un'altra parte: una rotta che non assomiglia a nessuna forma valida
 * (`matchRoute`), una categoria fuori dal registry (`CATEGORIES_BY_DIR`), una
 * ricetta il cui JSON risponde 404 (il fetch), uno slug del calcolatore che
 * non si sa rileggere (`configDaSlug`). Quattro posti dove accorgersene, ma
 * una cosa sola da dire: le tre pagine che esistevano avevano già tre uscite
 * diverse («Torna alla Home», «🔥 Torna alla Home», «Vedi tutte le ricette»)
 * e due formulazioni diverse dello stesso concetto.
 *
 * `document.title` lo scrive questa funzione insieme all'H1, e non è pulizia:
 * il router legge il titolo DOPO il render per annunciarlo nella regione live
 * (`dopoIlCambioPagina` in router.js). Un titolo dimenticato fa annunciare a
 * chi ascolta la pagina PRECEDENTE — è già successo sulle ricette, dove sopra
 * un «Ricetta non trovata» si sentiva «Calcolatore di cottura su kamado».
 *
 * La base arriva come argomento e le emoji da `emoji-core.js` invece che da
 * `emoji.js`: quest'ultimo importa il router, e il router importa questo
 * modulo. Così non si chiude nessun cerchio, e il markup resta una funzione
 * pura di ciò che riceve.
 */

import { fluentEmojiCon } from './emoji-core.js';
import { escHtml } from './escape.js';

/**
 * Disegna la pagina «non trovata» dentro `app` e allinea il titolo del
 * documento.
 *
 * @param {HTMLElement} app - Container #app
 * @param {object} opzioni
 * @param {string}  opzioni.base        - Prefisso URL del sito ("/Ricettario/")
 * @param {string}  [opzioni.titolo]    - Che cosa non è stato trovato
 * @param {string}  [opzioni.dettaglio] - La riga che dice perché
 * @param {Array<{href: string, testo: string}>} [opzioni.uscite] - Vie d'uscita,
 *        la prima diventa il pulsante. Ce ne vuole sempre almeno una: una
 *        pagina che dice solo «no» lascia la persona nel vicolo cieco in cui
 *        è arrivata.
 */
export function mostraNonTrovata(app, { base, titolo = 'Pagina non trovata', dettaglio = '', uscite } = {}) {
  document.title = `${titolo} — Ricettario Lab`;

  const [principale, ...altre] = uscite?.length ? uscite : [
    { href: base, testo: 'Torna alla home' },
    { href: `${base}#ricette`, testo: 'Vedi tutte le ricette' },
  ];

  // `.btn-back` sta in css/pages/recipe-detail.css ed è caricato ovunque
  // (main.js lo importa nel bundle principale).
  const link = (u, classe = '') =>
    `<a href="${escHtml(u.href)}" data-link${classe ? ` class="${classe}"` : ''}>${escHtml(u.testo)}</a>`;

  // Il testo arriva dall'URL, cioè da fuori: passa tutto da escHtml, href
  // delle uscite compreso.
  app.innerHTML = `
    <div class="container" style="padding: 120px 0; text-align: center;">
      <h1>${fluentEmojiCon(base, 'prohibited', 28)} ${escHtml(titolo)}</h1>
      ${dettaglio ? `<p style="color: var(--color-text-muted);">${escHtml(dettaglio)}</p>` : ''}
      <p>${link(principale, 'btn-back')}</p>
      ${altre.length ? `<p>${altre.map(u => link(u)).join(' · ')}</p>` : ''}
    </div>`;
  // Niente refreshIcons: qui le icone sono <img> Fluent, non <i data-lucide>.
}
