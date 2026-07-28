/* ============================================
   IL RICETTARIO — Markup di categorie e schede
   PURO: condiviso fra SPA e pre-rendering
   ============================================ */

/**
 * L'unica fonte del markup delle pagine categoria, delle schede ricetta e
 * delle righe carosello della homepage.
 *
 * Come html-ricetta.js (e html-piano.js prima di lui): la SPA e il
 * pre-rendering avevano ciascuno la propria copia scritta a mano, e le copie
 * erano GIÀ divergenti in produzione — H1 diversi («Pane» statico contro
 * «Pane Artigianale» nella SPA), sottotitoli diversi, card diverse. Qui la
 * funzione è una, e la modalità `interattivo: false` del pre-rendering omette
 * solo ciò che senza JavaScript sarebbe un controllo morto (toolbar di
 * ricerca, ordinamento, cambio vista), non il contenuto.
 *
 * Niente DOM, `window`, `localStorage` o `import.meta`: lo importa anche Node
 * dentro scripts/generate-og.js. I dati (meta della categoria dal registry,
 * ricette dall'indice recipes.json) e la `base` arrivano come argomenti.
 */

import { escHtml, escAttr } from './escape.js';
import { isValidBadge } from './recipe-meta.js';
import { buildPicture, getImageSources } from './image-utils.js';
import { fluentEmojiCon } from './emoji-core.js';

/**
 * Scheda ricetta della griglia categoria. `r` è una voce dell'indice
 * recipes.json (title, slug, categoryDir, description, hydration, time,
 * image). L'`alt` dell'immagine è vuoto di proposito: il link porta già il
 * titolo, e con l'alt pieno uno screen reader sentiva ogni nome due volte
 * (CHECKUP-ACCESSIBILITA, «piccole cose»).
 */
export function htmlCardCategoria(r, { base }) {
  const href = `${base}ricette/${r.categoryDir}/${r.slug}/`;
  // sizes: la griglia è auto-fill minmax(280px, 1fr) dentro .container
  // (max 1200px, gap 24px): la colonna arriva a 368px da 3 colonne in su,
  // sotto i 640 è una sola a tutta larghezza meno il padding.
  const foto = r.image
    ? buildPicture(`${base}${r.image}`, '', 'category-card__image', 'lazy',
      '(min-width: 640px) 368px, calc(100vw - 32px)')
    : '';
  return `
      <a href="${escAttr(href)}" class="category-card" data-link
         data-title="${escAttr((r.title || '').toLowerCase())}"
         data-hydration="${parseInt(r.hydration) || 0}">
        <div class="category-card__image-wrapper">
          ${foto}
          <div class="category-card__meta">
            ${isValidBadge(r.hydration) ? `<span class="category-card__tag">${fluentEmojiCon(base, 'droplet', 14)} ${escHtml(r.hydration)}</span>` : ''}
            ${isValidBadge(r.time) ? `<span class="category-card__tag">${fluentEmojiCon(base, 'stopwatch', 14)} ${escHtml(r.time)}</span>` : ''}
          </div>
        </div>
        <div class="category-card__body">
          <h2 class="category-card__title">${escHtml(r.title)}</h2>
          ${r.description ? `<p class="category-card__desc">${escHtml(r.description)}</p>` : ''}
        </div>
      </a>`;
}

/** Schede scheletro mostrate dalla SPA mentre l'indice si scarica. */
export function htmlSchedeScheletro(count) {
  return Array.from({ length: count }, () => `
    <div class="category-card category-card--skeleton">
      <div class="category-card__image-wrapper"></div>
      <div class="category-card__body">
        <div class="skeleton-line skeleton-line--title"></div>
        <div class="skeleton-line skeleton-line--desc"></div>
      </div>
    </div>`).join('');
}

/**
 * Title e meta description della pagina categoria: la composizione è QUI e
 * solo qui. Erano due — il pre-rendering serviva «Pane — 8 Ricette —
 * Ricettario Lab», la SPA riscriveva «Pane Artigianale — Il Ricettario» — e
 * divergevano perfino nel brand. `meta` è la voce del registry
 * (js/categories.js): name, title, desc.
 *
 * `titolo` è il document.title completo: main.js lo scrive così com'è.
 * `titoloBreve` è per buildPage (generate-og.js), che appende « — Ricettario
 * Lab» (SITE_NAME) a ogni pagina del sito: il <title> che ne esce deve
 * coincidere con `titolo`. Il conteggio ricette NON c'è di proposito: la SPA
 * scrive il title prima del fetch dell'indice, quando il numero non c'è
 * ancora — identico batte ricco.
 */
export function metaPaginaCategoria(meta) {
  const titoloBreve = meta.title;
  return {
    titoloBreve,
    titolo: `${titoloBreve} — Ricettario Lab`,
    descrizione: meta.desc,
  };
}

/**
 * Pagina categoria completa: hero, breadcrumb e griglia.
 *
 * `meta` è la voce del registry (js/categories.js): name, title, desc.
 * `ricette` sono le voci dell'indice; `null` nella SPA, che le carica dopo e
 * riempie la griglia — in quel caso la griglia parte con gli scheletri e il
 * contatore con «Caricamento».
 */
export function htmlCategoria(meta, ricette, { base, interattivo = true, viewMode = 'grid' }) {
  const heroImg = ricette?.find(r => r.image)?.image;
  // Doppia dichiarazione di sfondo: la prima (solo WebP) è il fallback per i
  // browser senza image-set(), la seconda lascia scegliere l'AVIF gemello —
  // stessa foto, circa metà dei byte. Prima l'AVIF restava ignorato (CHECKUP,
  // punto 2).
  const sfondoHero = heroImg ? getImageSources(`${base}${heroImg}`) : null;
  const stileHero = sfondoHero
    ? ` style="background-image: url('${escAttr(sfondoHero.webp)}'); background-image: image-set(url('${escAttr(sfondoHero.avif)}') type('image/avif'), url('${escAttr(sfondoHero.webp)}') type('image/webp'))"`
    : '';
  const conteggio = ricette
    ? `${ricette.length} ricett${ricette.length === 1 ? 'a' : 'e'}`
    : '⏳ Caricamento...';

  const toolbar = interattivo ? `
        <div class="category-toolbar" id="category-toolbar">
          <div class="category-toolbar__search">
            <span class="category-toolbar__search-icon"><i data-lucide="search" style="width:16px;height:16px"></i></span>
            <input type="text" class="category-toolbar__search-input" id="category-search"
              placeholder="Cerca tra le ricette di ${escAttr(meta.name.toLowerCase())}...">
          </div>
          <div class="category-toolbar__results" id="results-counter"></div>
          <div class="category-toolbar__sort">
            <button class="category-toolbar__sort-btn active" data-sort="az">A-Z</button>
            <button class="category-toolbar__sort-btn" data-sort="hydration">${fluentEmojiCon(base, 'droplet', 14)} Idratazione</button>
          </div>
          <div class="category-toolbar__views">
            <button class="view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}" data-view="grid" aria-label="Vista griglia">
              <i data-lucide="grid-3x3" style="width:16px;height:16px"></i>
            </button>
            <button class="view-toggle-btn ${viewMode === 'list' ? 'active' : ''}" data-view="list" aria-label="Vista lista">
              <i data-lucide="list" style="width:16px;height:16px"></i>
            </button>
          </div>
        </div>` : '';

  const griglia = interattivo
    ? htmlSchedeScheletro(6)
    : ricette.map(r => htmlCardCategoria(r, { base })).join('');

  return `
    <section class="category-hero" id="category-hero"${stileHero}>
      <div class="category-hero__content">
        <h1 class="category-hero__title">${escHtml(meta.title)}</h1>
        <p class="category-hero__subtitle">${escHtml(meta.desc)}</p>
        <div class="category-hero__count" id="recipe-count">${conteggio}</div>
      </div>
    </section>

    <!-- Qui ci vuole una "section", non un "main": il landmark principale è
         quello del guscio, che avvolge #app e sopravvive ai cambi di rotta.
         Uno annidato dentro l'altro è markup non valido. -->
    <section class="section">
      <div class="container">
        <nav class="breadcrumb">
          <a href="${base}" data-link>Home</a>
          <span class="breadcrumb__separator">›</span>
          <a href="${base}#ricette" data-link>Ricette</a>
          <span class="breadcrumb__separator">›</span>
          <span class="breadcrumb__current">${escHtml(meta.name)}</span>
        </nav>
        ${toolbar}
        <div class="category-grid ${viewMode === 'list' ? 'category-grid--list' : ''}" id="category-grid">
          ${griglia}
        </div>

        ${interattivo ? '<div id="load-more-container"></div>' : ''}
      </div>
    </section>
  `;
}

/**
 * Scheda compatta dei caroselli della homepage. Stessa scelta sull'`alt`
 * della scheda grande.
 */
function htmlCardCarosello(r, { base }) {
  const href = `${base}ricette/${r.categoryDir}/${r.slug}/`;
  // sizes: le larghezze CSS della scheda compatta (200 → 260 a 480px →
  // 290 a 1200px, css/components/category-carousel.css). Era il caso peggiore
  // del checkup: originale da 1200-1880px in uno slot da 200-290.
  const foto = r.image
    ? buildPicture(`${base}${r.image}`, '', 'recipe-card--compact__image', 'lazy',
      '(min-width: 1200px) 290px, (min-width: 480px) 260px, 200px')
    : '';
  return `
          <a href="${escAttr(href)}" class="recipe-card--compact" data-link data-title="${escAttr((r.title || '').toLowerCase())}" data-category="${escAttr(r.category)}">
            <div class="recipe-card--compact__image-wrapper">
              ${foto}
            </div>
            <div class="recipe-card--compact__body">
              <h4 class="recipe-card--compact__title">${escHtml(r.title)}</h4>
              <div class="recipe-card--compact__meta">
                ${isValidBadge(r.hydration) ? `<span class="recipe-card--compact__tag">${fluentEmojiCon(base, 'droplet', 16)} ${escHtml(r.hydration)}</span>` : ''}
                ${isValidBadge(r.time) ? `<span>${fluentEmojiCon(base, 'stopwatch', 16)} ${escHtml(r.time)}</span>` : ''}
              </div>
            </div>
          </a>`;
}

/**
 * Contenuto di una riga carosello della homepage (header + schede).
 * La SPA lo monta dentro il suo <div class="category-row"> e ci attacca la
 * logica di scorrimento; il pre-rendering lo scrive così com'è dentro
 * #recipe-carousels — è ciò che dà alla homepage statica un link a OGNI
 * ricetta, invece del contenitore vuoto che i crawler trovavano prima.
 *
 * Le frecce di scorrimento NON stanno nel markup: le crea `attivaCarosello`
 * in main.js quando aggancia la logica. Nella pagina statica sarebbero state
 * 18 fermate da tastiera annunciate come pulsanti funzionanti che non fanno
 * niente — la stessa classe di controlli morti che `interattivo: false`
 * omette per toolbar e calcolatore dosi.
 */
export function htmlRigaCarosello(catNome, emojiNome, catDir, ricette, { base }) {
  return `
    <div class="category-row__header">
      <h3 class="category-row__title">
        ${fluentEmojiCon(base, emojiNome, 32)} ${escHtml(catNome)}
        <span class="category-row__count">${ricette.length} ricett${ricette.length === 1 ? 'a' : 'e'}</span>
      </h3>
      <a href="${escAttr(`${base}ricette/${catDir}/`)}" class="category-row__link" data-link>Vedi tutte</a>
    </div>
    <div class="category-row__carousel-wrapper">
      <div class="category-row__carousel">
        ${ricette.map(r => htmlCardCarosello(r, { base })).join('')}
      </div>
    </div>
  `;
}
