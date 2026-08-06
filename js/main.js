/* ============================================
   IL RICETTARIO — Main JS 2026 (SPA)
   ============================================ */

// ── CSS Imports (design system) ──
import '../css/base/fonts.css';
import '../css/base/tokens.css';
import '../css/base/reset.css';
import '../css/layout/container.css';
import '../css/components/navbar.css';
import '../css/components/theme-toggle.css';
import '../css/components/hero.css';
import '../css/components/recipe-card.css';
import '../css/components/category-carousel.css';
import '../css/components/tool-spotlight.css';
import '../css/components/cottura-promo.css';
import '../css/components/footer.css';
import '../css/pages/recipe-detail.css';
import '../css/components/category-page.css';
import '../css/utilities/animations.css';
import '../css/utilities/testo.css';

// ── SPA Router ──
import { initRouter, registerRenderers, initReveal, BASE } from './router.js';
import { renderRecipe } from './recipe-renderer.js';
import { applyMadeBadgesToCards } from './recipe-bookmarks.js';
import { fluentEmoji, CATEGORY_FLUENT, refreshIcons } from './emoji.js';
import { initLogoIntro } from './logo-intro-v2b.js';
import { CATEGORIES, CATEGORIES_BY_DIR, CATEGORY_ORDER as CAT_ORDER } from './categories.js';
import { mostraNonTrovata } from './non-trovata.js';
// Il markup di pagine categoria, schede e caroselli sta in html-categoria.js,
// che è PURO e viene importato anche dal pre-rendering: qui restano stato,
// fetch e listener.
import { htmlCategoria, htmlCardCategoria, htmlRigaCarosello, metaPaginaCategoria } from './html-categoria.js';

/* global __RECIPES_HASH__ */
const RECIPE_CACHE_BUST = typeof __RECIPES_HASH__ !== 'undefined' ? `?v=${__RECIPES_HASH__}` : '';

// ── Logo Intro: inietta subito (pre-render) ──
initLogoIntro();

document.addEventListener('DOMContentLoaded', () => {

  // === NAVBAR (persistente — fuori da #app) ===
  initNavbar();
  initThemeToggle();
  initHamburger();

  // === FOOTER (persistente) ===
  const yearEl = document.getElementById('current-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // === ICONE (anche quelle del footer, che sta fuori da #app) ===
  refreshIcons();

  // === HOMEPAGE: fotografa il markup servito, prima che il router lo sostituisca ===
  captureHomeFromDom();

  // === REGISTRA RENDERERS & AVVIA ROUTER ===
  registerRenderers({
    home: renderHomepage,
    recipe: renderRecipe,
    category: renderCategory,
    // Import dinamico: il calcolatore di cottura si porta dietro i profili dei
    // tagli, i coefficienti e il suo CSS. Chi apre una ricetta di pane non
    // scarica niente di tutto questo. Stessa scelta fatta per Chart.js.
    cottura: async (app, params) => {
      const { renderCottura } = await import('./cottura/pagina.js');
      return renderCottura(app, params);
    },
    // Stesso schema per la sezione strumenti: guide, scheda tecnica e CSS
    // viaggiano nel loro chunk.
    strumenti: async (app, params) => {
      const { renderStrumenti } = await import('./strumenti/pagina.js');
      return renderStrumenti(app, params);
    },
    // Indirizzo che non assomiglia a nessuna rotta. Prima non c'era e
    // `matchRoute` ripiegava sulla home: vedi il commento là.
    nonTrovata: (app, { percorso } = {}) => mostraNonTrovata(app, {
      base: BASE,
      dettaglio: percorso
        ? `L'indirizzo «${percorso}» non corrisponde a nessuna pagina di questo sito.`
        : '',
    }),
  });

  initRouter();
});

// ═══════════════════════════════════════
//  NAVBAR (persistente, non cambia tra pagine)
// ═══════════════════════════════════════

function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 50);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

function initThemeToggle() {
  const themeToggle = document.getElementById('theme-toggle');
  if (!themeToggle) return;

  themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';

    themeToggle.classList.add('theme-toggle--switching');
    setTimeout(() => themeToggle.classList.remove('theme-toggle--switching'), 400);

    document.documentElement.setAttribute('data-theme', next);
    // La barra del browser segue il tema. I due colori stanno nello script
    // in testa a index.html, non qui: vedi il commento là.
    window.applicaColoreBarra?.(next);
    localStorage.setItem('theme', next);
  });

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      const tema = e.matches ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', tema);
      window.applicaColoreBarra?.(tema);
    }
  });
}

function initHamburger() {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');

  if (!hamburger || !navLinks) return;

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });

  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    }
  });
}

// ═══════════════════════════════════════
//  HOMEPAGE RENDERER
// ═══════════════════════════════════════

/**
 * Unica fonte del markup della homepage: index.html.
 *
 * Prima esisteva anche una copia in JS (`getHomepageHTML`) che il router usava
 * per ricostruire la home dopo una navigazione SPA. Le due versioni erano già
 * divergute — titolo, sottotitolo e schede strumenti diversi — quindi il testo
 * cambiava a seconda di come ci si arrivava. Ora la home viene fotografata dal
 * DOM servito, ed è anche la pagina che i crawler indicizzano.
 */
let homeSnapshot = null;

/**
 * I path relativi del markup servito (es. "images/emoji/fire.png") valgono solo
 * a BASE. Reiniettandoli da una route profonda si romperebbero: li rendo assoluti.
 */
function absolutizeUrls(root) {
  const base = new URL(BASE, window.location.origin);
  const absolutize = (value) =>
    !value || /^([a-z]+:|\/\/|\/|#)/i.test(value) ? value : new URL(value, base).pathname;

  root.querySelectorAll('[src], [href], [srcset]').forEach(el => {
    ['src', 'href'].forEach(attr => {
      const value = el.getAttribute(attr);
      if (value) el.setAttribute(attr, absolutize(value));
    });
    // srcset è una lista "url descrittore, url descrittore"
    const srcset = el.getAttribute('srcset');
    if (srcset) {
      el.setAttribute('srcset', srcset.split(',').map(part => {
        const [url, ...rest] = part.trim().split(/\s+/);
        return [absolutize(url), ...rest].join(' ');
      }).join(', '));
    }
  });
}

function buildSnapshot(appEl, title, description) {
  const clone = appEl.cloneNode(true);
  absolutizeUrls(clone);
  return { html: clone.innerHTML, title, description };
}

/** Cattura la home se è quella attualmente servita (non lo è sulle pagine ricetta). */
function captureHomeFromDom() {
  const app = document.getElementById('app');
  if (!app?.querySelector('#ricette')) return;
  homeSnapshot = buildSnapshot(
    app,
    document.title,
    document.querySelector('meta[name="description"]')?.getAttribute('content') || ''
  );
}

/**
 * Se l'utente è atterrato direttamente su una ricetta, il markup della home non
 * è mai passato dal DOM: lo prendo da index.html, che resta l'unica fonte.
 */
async function getHomeSnapshot() {
  if (homeSnapshot) return homeSnapshot;
  const res = await fetch(BASE);
  const doc = new DOMParser().parseFromString(await res.text(), 'text/html');
  const app = doc.getElementById('app');
  if (!app) throw new Error('index.html non contiene #app');
  homeSnapshot = buildSnapshot(
    app,
    doc.title,
    doc.querySelector('meta[name="description"]')?.getAttribute('content') || ''
  );
  return homeSnapshot;
}

async function renderHomepage(app /*, params */) {
  // Se il markup è già quello servito non tocco nulla: niente reflow inutile.
  if (!app.querySelector('#ricette')) {
    try {
      const snap = await getHomeSnapshot();
      app.innerHTML = snap.html;
    } catch (err) {
      console.error('Impossibile ricostruire la homepage:', err);
      window.location.assign(BASE);
      return;
    }
  }

  const snap = homeSnapshot;
  if (snap) {
    document.title = snap.title;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', snap.description);
  }

  refreshIcons();
  initCarousels();
  initReveal();
}


// ═══════════════════════════════════════
//  CATEGORY RENDERER — Pro Isotope Grid
// ═══════════════════════════════════════

const ITEMS_PER_PAGE = 12;

// La route porta la cartella (es. "secondi-piatti"), non la chiave del registry.
const CATEGORY_META = CATEGORIES_BY_DIR;

// State reattivo per la pagina categoria
let catState = {
  allRecipes: [],
  filteredRecipes: [],
  displayedCount: ITEMS_PER_PAGE,
  viewMode: 'grid', // 'grid' | 'list'
  sortType: 'az',
  searchQuery: '',
  categoryDir: '',
};

async function renderCategory(app, { category }) {
  const meta = CATEGORY_META[category];

  // Categoria non dichiarata: prima veniva inventata una pagina vuota col nome
  // preso dall'URL (es. "pasta" dopo che la categoria è stata rimossa, ma
  // anche qualunque refuso). Meglio dirlo, e offrire una via d'uscita.
  // È il registry a saperlo, non il router: vedi il commento in matchRoute.
  if (!meta) {
    mostraNonTrovata(app, {
      base: BASE,
      titolo: 'Categoria non trovata',
      dettaglio: `La categoria «${category}» non esiste (o non esiste più).`,
    });
    return;
  }

  // Title e description escono dallo stesso helper del pre-rendering
  // (metaPaginaCategoria): il title servito e quello riscritto dalla SPA
  // erano diverguti perfino nel brand. Si scrive PRIMA del fetch dell'indice
  // — è per questo che il formato non porta il conteggio ricette.
  const pagina = metaPaginaCategoria(meta);
  document.title = pagina.titolo;
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.setAttribute('content', pagina.descrizione);

  // Reset state
  catState = {
    allRecipes: [],
    filteredRecipes: [],
    displayedCount: ITEMS_PER_PAGE,
    viewMode: localStorage.getItem('catViewMode') || 'grid',
    sortType: 'az',
    searchQuery: '',
    categoryDir: category,
  };

  // Il markup esce dal builder condiviso col pre-rendering: qui la modalità è
  // interattiva (toolbar + scheletri), le ricette arrivano col fetch qui sotto.
  app.innerHTML = htmlCategoria(meta, null, {
    base: BASE,
    interattivo: true,
    viewMode: catState.viewMode,
  });

  refreshIcons();

  // Carica ricette
  try {
    const resp = await fetch(`${BASE}recipes.json${RECIPE_CACHE_BUST}`);
    const data = await resp.json();
    catState.allRecipes = data.recipes.filter(r => r.categoryDir === category || r.category === meta.name);
    catState.allRecipes.sort((a, b) => (a.title || '').localeCompare(b.title || '', 'it'));
    catState.filteredRecipes = [...catState.allRecipes];

    // Hero image
    const heroRecipe = catState.allRecipes.find(r => r.image);
    if (heroRecipe) {
      const heroEl = document.getElementById('category-hero');
      if (heroEl) heroEl.style.backgroundImage = `url('${BASE}${heroRecipe.image}')`;
    }

    // Contatore hero
    const countEl = document.getElementById('recipe-count');
    if (countEl) countEl.innerHTML = `${fluentEmoji('bullseye', 16)} ${catState.allRecipes.length} ricett${catState.allRecipes.length === 1 ? 'a' : 'e'}`;

    // Render iniziale
    updateCategoryView();

    // Event listeners
    initCategoryListeners(app);

    initReveal();
    applyMadeBadgesToCards();
  } catch (err) {
    console.error('Errore caricamento categoria:', err);
    const grid = document.getElementById('category-grid');
    if (grid) grid.innerHTML = `<div class="category-empty"><div class="category-empty__icon">${fluentEmoji('prohibited', 32)}</div><p>Errore nel caricamento delle ricette.</p></div>`;
  }
}

function initCategoryListeners(app) {
  // Search con debounce
  const searchInput = document.getElementById('category-search');
  let searchTimer;
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      clearTimeout(searchTimer);
      searchTimer = setTimeout(() => {
        catState.searchQuery = searchInput.value.toLowerCase().trim();
        catState.displayedCount = ITEMS_PER_PAGE;
        applyCategoryFilters();
        updateCategoryView();
      }, 150);
    });
  }

  // Sort
  const sortBtns = app.querySelectorAll('.category-toolbar__sort-btn');
  sortBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      sortBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      catState.sortType = btn.dataset.sort;
      catState.displayedCount = ITEMS_PER_PAGE;
      applyCategoryFilters();
      updateCategoryView();
    });
  });

  // View toggle
  const viewBtns = app.querySelectorAll('.view-toggle-btn');
  viewBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      viewBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      catState.viewMode = btn.dataset.view;
      localStorage.setItem('catViewMode', catState.viewMode);
      const grid = document.getElementById('category-grid');
      if (grid) {
        grid.classList.toggle('category-grid--list', catState.viewMode === 'list');
      }
    });
  });
}

function applyCategoryFilters() {
  let result = [...catState.allRecipes];

  // Filter by search
  if (catState.searchQuery) {
    result = result.filter(r => {
      const title = (r.title || '').toLowerCase();
      const desc = (r.description || '').toLowerCase();
      return title.includes(catState.searchQuery) || desc.includes(catState.searchQuery);
    });
  }

  // Sort
  if (catState.sortType === 'az') {
    result.sort((a, b) => (a.title || '').localeCompare(b.title || '', 'it'));
  } else if (catState.sortType === 'hydration') {
    result.sort((a, b) => (parseInt(b.hydration) || 0) - (parseInt(a.hydration) || 0));
  }

  catState.filteredRecipes = result;
}

function updateCategoryView() {
  const grid = document.getElementById('category-grid');
  const loadMoreContainer = document.getElementById('load-more-container');
  if (!grid) return;

  const { filteredRecipes, displayedCount } = catState;
  const visible = filteredRecipes.slice(0, displayedCount);
  const totalFiltered = filteredRecipes.length;

  // Results counter
  const counter = document.getElementById('results-counter');
  if (counter) {
    if (catState.searchQuery) {
      counter.innerHTML = `<strong>${totalFiltered}</strong> risultat${totalFiltered === 1 ? 'o' : 'i'}`;
    } else {
      counter.innerHTML = `<strong>${Math.min(displayedCount, totalFiltered)}</strong> di <strong>${totalFiltered}</strong>`;
    }
  }

  // Empty state
  if (totalFiltered === 0) {
    grid.innerHTML = `
      <div class="category-empty" style="grid-column: 1 / -1">
        <div class="category-empty__icon"><i data-lucide="search" style="width:32px;height:32px"></i></div>
        <p>Nessuna ricetta trovata</p>
      </div>`;
    if (loadMoreContainer) loadMoreContainer.innerHTML = '';
    refreshIcons();
    return;
  }

  // Render visible cards — stessa scheda del pre-rendering (html-categoria.js)
  grid.innerHTML = visible.map(r => htmlCardCategoria(r, { base: BASE })).join('');

  // Load More
  if (loadMoreContainer) {
    if (displayedCount < totalFiltered) {
      const remaining = totalFiltered - displayedCount;
      const pct = Math.round((displayedCount / totalFiltered) * 100);
      loadMoreContainer.innerHTML = `
        <div class="load-more-wrapper">
          <button class="load-more-btn" id="load-more-btn">
            <span>Carica altre ${Math.min(remaining, ITEMS_PER_PAGE)} ricette</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>
          <div class="load-more-progress">${displayedCount} di ${totalFiltered} ricette</div>
          <div class="load-more-bar"><div class="load-more-bar__fill" style="width: ${pct}%"></div></div>
        </div>`;
      document.getElementById('load-more-btn')?.addEventListener('click', () => {
        catState.displayedCount += ITEMS_PER_PAGE;
        updateCategoryView();
        // Smooth scroll to show new cards
        setTimeout(() => {
          const allCards = grid.querySelectorAll('.category-card');
          const newFirstCard = allCards[displayedCount]; // first new card
          if (newFirstCard) {
            newFirstCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 100);
        applyMadeBadgesToCards();
      });
    } else {
      loadMoreContainer.innerHTML = '';
    }
  }

  refreshIcons();
  applyMadeBadgesToCards();
}

// ═══════════════════════════════════════
//  CAROUSELS (Netflix-style rows)
// ═══════════════════════════════════════

function buildCarouselRow(container, catKey, catEmoji, catDir, recipes) {
  const row = document.createElement('div');
  row.className = 'category-row reveal';
  row.dataset.category = catKey;

  // Stessa riga del pre-rendering (html-categoria.js): qui si aggiunge solo
  // la logica di scorrimento, che ha bisogno del DOM.
  row.innerHTML = htmlRigaCarosello(catKey, catEmoji, catDir, recipes, { base: BASE });

  container.appendChild(row);
  attivaCarosello(row);
}

/**
 * Aggancia la logica di scorrimento a una riga carosello — che sia appena
 * costruita da buildCarouselRow o pre-renderizzata da generate-og. Le frecce
 * le CREA qui, perché nel markup non ci sono: nella pagina statica sarebbero
 * pulsanti morti, 18 fermate da tastiera che non fanno niente.
 */
function attivaCarosello(row) {
  // Le righe restano nel DOM tra una visita e l'altra della home (vengono
  // idratate, non ricostruite): senza questa guardia ogni ritorno
  // aggiungerebbe un secondo set di listener e un altro ResizeObserver.
  if (row.dataset.attivo) return;
  row.dataset.attivo = '1';

  const carousel = row.querySelector('.category-row__carousel');
  const wrapper = row.querySelector('.category-row__carousel-wrapper');
  if (!carousel || !wrapper) return;

  const creaFreccia = (classe, etichetta, testo) => {
    const btn = document.createElement('button');
    btn.className = `carousel-arrow ${classe}`;
    btn.setAttribute('aria-label', etichetta);
    btn.textContent = testo;
    return btn;
  };
  const prevBtn = creaFreccia('carousel-arrow--prev', 'Precedente', '‹');
  const nextBtn = creaFreccia('carousel-arrow--next', 'Successivo', '›');
  wrapper.insertBefore(prevBtn, carousel);
  wrapper.appendChild(nextBtn);

  const cardWidth = 276;

  const updateScrollState = () => {
    const { scrollLeft, scrollWidth, clientWidth } = carousel;
    wrapper.classList.toggle('has-scroll-left', scrollLeft > 10);
    wrapper.classList.toggle('has-scroll-right', scrollLeft < scrollWidth - clientWidth - 10);
    prevBtn.disabled = scrollLeft <= 10;
    nextBtn.disabled = scrollLeft >= scrollWidth - clientWidth - 10;
  };

  carousel.addEventListener('scroll', updateScrollState, { passive: true });

  // Qui c'era un solo `requestAnimationFrame(updateScrollState)`, e non
  // bastava per due motivi che si sommano:
  //
  //   - `requestAnimationFrame` è legato al disegno: in una scheda che il
  //     browser non sta ridisegnando non scatta affatto. È la stessa trappola
  //     già pagata sulla regione live in `router.js`.
  //   - un frame solo arriva comunque prima che le immagini delle schede
  //     abbiano fatto assestare la larghezza del carosello, quindi la misura
  //     cadeva su `scrollWidth === clientWidth` e concludeva «non c'è niente
  //     da scorrere».
  //
  // In più non ricalcolava niente al ridimensionamento della finestra, che è
  // proprio la cosa che decide se il carosello sborda o no.
  //
  // Misurato prima della correzione: tre righe su quattro avevano 2208 px di
  // contenuto in 844 di spazio — cioè da scorrere eccome — e nessuna delle tre
  // aveva la classe. Le frecce restavano disabilitate e le sfumature spente.
  updateScrollState();
  new ResizeObserver(updateScrollState).observe(carousel);

  prevBtn.addEventListener('click', () => carousel.scrollBy({ left: -cardWidth * 3, behavior: 'smooth' }));
  nextBtn.addEventListener('click', () => carousel.scrollBy({ left: cardWidth * 3, behavior: 'smooth' }));
}

function initCarousels() {
  const carouselsContainer = document.getElementById('recipe-carousels');
  if (!carouselsContainer) return;

  // Se le righe ci sono già — pre-renderizzate da generate-og, o ripristinate
  // dallo snapshot della home — NON si rifanno: si aggancia la logica a
  // quelle esistenti. Rifarle dal fetch aveva due difetti concreti: un errore
  // di rete sostituiva 80 link funzionanti con un messaggio d'errore, e la
  // ricostruzione (con la classe `reveal`, che parte a opacity 0) faceva
  // sparire e ridissolvere una sezione che l'utente stava già guardando.
  const righeEsistenti = carouselsContainer.querySelectorAll('.category-row');
  if (righeEsistenti.length) {
    righeEsistenti.forEach(attivaCarosello);
    initReveal();
    setupSearch();
    applyMadeBadgesToCards();
    return;
  }

  // Contenitore vuoto: succede solo con `npm run dev`, dove il pre-rendering
  // non gira. Qui il fetch è l'unica fonte, e il messaggio d'errore non
  // cancella niente che l'utente stesse già usando.
  // Ordine predefinito dalla single source of truth
  const CATEGORY_ORDER = CAT_ORDER.map(key => {
    const cat = CATEGORIES[key];
    return { key: cat.name, emoji: cat.emoji, dir: cat.dir };
  });

  fetch(`${BASE}recipes.json${RECIPE_CACHE_BUST}`)
    .then(r => r.json())
    .then(data => {
      carouselsContainer.innerHTML = '';

      const grouped = {};
      data.recipes.forEach(r => {
        if (!grouped[r.category]) grouped[r.category] = [];
        grouped[r.category].push(r);
      });

      // Categorie note — ordine predefinito
      CATEGORY_ORDER.forEach(cat => {
        const recipes = grouped[cat.key];
        if (!recipes || recipes.length === 0) return;
        buildCarouselRow(carouselsContainer, cat.key, cat.emoji, cat.dir, recipes);
      });

      // ── Auto-discovery: nuove categorie non in CATEGORY_ORDER ──
      const knownKeys = new Set(CATEGORY_ORDER.map(c => c.key));
      Object.keys(grouped).forEach(catName => {
        if (knownKeys.has(catName)) return;
        const recipes = grouped[catName];
        if (!recipes || recipes.length === 0) return;
        const dir = catName.toLowerCase();
        const emoji = CATEGORY_FLUENT[catName] || 'fork-and-knife';
        buildCarouselRow(carouselsContainer, catName, emoji, dir, recipes);
      });

      // Re-init reveal
      initReveal();
      // Setup search
      setupSearch();
      // Badge "Fatta" sulle card
      applyMadeBadgesToCards();
    })
    .catch(err => {
      console.error('Errore caricamento recipes.json:', err);
      carouselsContainer.innerHTML = '<p style="text-align:center; color: var(--color-text-muted);">Errore nel caricamento delle ricette.</p>';
    });
}

// ═══════════════════════════════════════
//  SEARCH
// ═══════════════════════════════════════

function setupSearch() {
  const searchInput = document.getElementById('search-input');
  if (!searchInput) return;

  searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase().trim();
    const allCards = document.querySelectorAll('.recipe-card--compact');
    const allRows = document.querySelectorAll('.category-row');

    allCards.forEach(card => {
      const title = card.dataset.title || card.textContent.toLowerCase();
      card.classList.toggle('hidden', !!(query && !title.includes(query)));
    });

    allRows.forEach(row => {
      const visibleCards = row.querySelectorAll('.recipe-card--compact:not(.hidden)');
      row.classList.toggle('hidden', visibleCards.length === 0);
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === '/' && document.activeElement !== searchInput) {
      e.preventDefault();
      searchInput.focus();
      searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    if (e.key === 'Escape' && document.activeElement === searchInput) {
      searchInput.value = '';
      searchInput.dispatchEvent(new Event('input'));
      searchInput.blur();
    }
  });
}
