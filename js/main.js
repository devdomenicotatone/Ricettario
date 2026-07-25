/* ============================================
   IL RICETTARIO — Main JS 2026 (SPA)
   ============================================ */

// ── CSS Imports (design system) ──
import '../css/base/tokens.css';
import '../css/base/reset.css';
import '../css/layout/container.css';
import '../css/components/navbar.css';
import '../css/components/theme-toggle.css';
import '../css/components/hero.css';
import '../css/components/recipe-card.css';
import '../css/components/filter-bar.css';
import '../css/components/category-carousel.css';
import '../css/components/tool-spotlight.css';
import '../css/components/footer.css';
import '../css/pages/recipe-detail.css';
import '../css/components/category-page.css';
import '../css/utilities/animations.css';

// ── SPA Router ──
import { initRouter, registerRenderers, initReveal, BASE } from './router.js';
import { renderRecipe } from './recipe-renderer.js';
import { buildPicture } from './image-utils.js';
import { applyMadeBadgesToCards } from './recipe-bookmarks.js';
import { fluentEmoji, categoryEmoji, CATEGORY_FLUENT, refreshIcons } from './emoji.js';
import { initLogoIntro } from './logo-intro-v2b.js';
import { CATEGORIES, CATEGORIES_BY_DIR, CATEGORY_ORDER as CAT_ORDER } from './categories.js';
import { isValidBadge } from './recipe-meta.js';

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
    localStorage.setItem('theme', next);
  });

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
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
  const meta = CATEGORY_META[category] || {
    name: category, emoji: 'spaghetti',
    title: category, desc: `Tutte le ricette di ${category}.`,
  };

  document.title = `${meta.title} — Il Ricettario`;
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.setAttribute('content', meta.desc);

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

  // Struttura HTML con toolbar aggiornata
  app.innerHTML = `
    <section class="category-hero" id="category-hero">
      <div class="category-hero__content">
        <h1 class="category-hero__title">${meta.title}</h1>
        <p class="category-hero__subtitle">${meta.desc}</p>
        <div class="category-hero__count" id="recipe-count">⏳ Caricamento...</div>
      </div>
    </section>

    <main class="section">
      <div class="container">
        <nav class="breadcrumb">
          <a href="${BASE}" data-link>Home</a>
          <span class="breadcrumb__separator">›</span>
          <a href="${BASE}#ricette" data-link>Ricette</a>
          <span class="breadcrumb__separator">›</span>
          <span class="breadcrumb__current">${meta.name}</span>
        </nav>

        <div class="category-toolbar" id="category-toolbar">
          <div class="category-toolbar__search">
            <span class="category-toolbar__search-icon"><i data-lucide="search" style="width:16px;height:16px"></i></span>
            <input type="text" class="category-toolbar__search-input" id="category-search"
              placeholder="Cerca tra le ricette di ${meta.name.toLowerCase()}...">
          </div>
          <div class="category-toolbar__results" id="results-counter"></div>
          <div class="category-toolbar__sort">
            <button class="category-toolbar__sort-btn active" data-sort="az">A-Z</button>
            <button class="category-toolbar__sort-btn" data-sort="hydration">${fluentEmoji('droplet', 14)} Idratazione</button>
          </div>
          <div class="category-toolbar__views">
            <button class="view-toggle-btn ${catState.viewMode === 'grid' ? 'active' : ''}" data-view="grid" aria-label="Vista griglia">
              <i data-lucide="grid-3x3" style="width:16px;height:16px"></i>
            </button>
            <button class="view-toggle-btn ${catState.viewMode === 'list' ? 'active' : ''}" data-view="list" aria-label="Vista lista">
              <i data-lucide="list" style="width:16px;height:16px"></i>
            </button>
          </div>
        </div>

        <div class="category-grid ${catState.viewMode === 'list' ? 'category-grid--list' : ''}" id="category-grid">
          ${buildSkeletonCards(6)}
        </div>

        <div id="load-more-container"></div>
      </div>
    </main>
  `;

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

  const { filteredRecipes, displayedCount, categoryDir } = catState;
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

  // Render visible cards
  grid.innerHTML = visible.map((r, index) => {
    const spaHref = `${BASE}ricette/${r.categoryDir || categoryDir}/${r.slug}`;
    return `
      <a href="${spaHref}" class="category-card" data-link
         data-title="${(r.title || '').toLowerCase()}"
         data-hydration="${parseInt(r.hydration) || 0}">
        <div class="category-card__image-wrapper">
          ${r.image ? buildPicture(`${BASE}${r.image}`, r.title, 'category-card__image', 'lazy') : ''}
          <div class="category-card__meta">
            ${isValidBadge(r.hydration) ? `<span class="category-card__tag">${fluentEmoji('droplet', 14)} ${r.hydration}</span>` : ''}
            ${isValidBadge(r.time) ? `<span class="category-card__tag">${fluentEmoji('stopwatch', 14)} ${r.time}</span>` : ''}
          </div>
        </div>
        <div class="category-card__body">
          <h3 class="category-card__title">${r.title}</h3>
          ${r.description ? `<p class="category-card__desc">${r.description}</p>` : ''}
        </div>
      </a>`;
  }).join('');

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

function buildSkeletonCards(count) {
  return Array.from({ length: count }, () => `
    <div class="category-card category-card--skeleton">
      <div class="category-card__image-wrapper"></div>
      <div class="category-card__body">
        <div class="skeleton-line skeleton-line--title"></div>
        <div class="skeleton-line skeleton-line--desc"></div>
      </div>
    </div>`).join('');
}

// ═══════════════════════════════════════
//  CAROUSELS (Netflix-style rows)
// ═══════════════════════════════════════

function buildCarouselRow(container, catKey, catEmoji, catDir, recipes) {
  const row = document.createElement('div');
  row.className = 'category-row reveal';
  row.dataset.category = catKey;

  row.innerHTML = `
    <div class="category-row__header">
      <h3 class="category-row__title">
        ${fluentEmoji(catEmoji, 32)} ${catKey}
        <span class="category-row__count">${recipes.length} ricett${recipes.length === 1 ? 'a' : 'e'}</span>
      </h3>
      <a href="${BASE}ricette/${catDir}/" class="category-row__link" data-link>Vedi tutte</a>
    </div>
    <div class="category-row__carousel-wrapper">
      <button class="carousel-arrow carousel-arrow--prev" aria-label="Precedente">‹</button>
      <div class="category-row__carousel">
        ${recipes.map(r => {
          const spaHref = r.href.replace('.html', '');
          return `
          <a href="${spaHref}" class="recipe-card--compact" data-link data-title="${r.title.toLowerCase()}" data-category="${r.category}">
            <div class="recipe-card--compact__image-wrapper">
              ${r.image ? buildPicture(r.image, r.title, 'recipe-card--compact__image', 'lazy') : ''}
            </div>
            <div class="recipe-card--compact__body">
              <h4 class="recipe-card--compact__title">${r.title}</h4>
              <div class="recipe-card--compact__meta">
                ${isValidBadge(r.hydration) ? `<span class="recipe-card--compact__tag">${fluentEmoji('droplet', 16)} ${r.hydration}</span>` : ''}
                ${isValidBadge(r.time) ? `<span>${fluentEmoji('stopwatch', 16)} ${r.time}</span>` : ''}
              </div>
            </div>
          </a>`;
        }).join('')}
      </div>
      <button class="carousel-arrow carousel-arrow--next" aria-label="Successivo">›</button>
    </div>
  `;

  container.appendChild(row);

  // Carousel scroll logic
  const carousel = row.querySelector('.category-row__carousel');
  const wrapper = row.querySelector('.category-row__carousel-wrapper');
  const prevBtn = row.querySelector('.carousel-arrow--prev');
  const nextBtn = row.querySelector('.carousel-arrow--next');
  const cardWidth = 276;

  const updateScrollState = () => {
    const { scrollLeft, scrollWidth, clientWidth } = carousel;
    wrapper.classList.toggle('has-scroll-left', scrollLeft > 10);
    wrapper.classList.toggle('has-scroll-right', scrollLeft < scrollWidth - clientWidth - 10);
    prevBtn.disabled = scrollLeft <= 10;
    nextBtn.disabled = scrollLeft >= scrollWidth - clientWidth - 10;
  };

  carousel.addEventListener('scroll', updateScrollState, { passive: true });
  requestAnimationFrame(updateScrollState);

  prevBtn.addEventListener('click', () => carousel.scrollBy({ left: -cardWidth * 3, behavior: 'smooth' }));
  nextBtn.addEventListener('click', () => carousel.scrollBy({ left: cardWidth * 3, behavior: 'smooth' }));
}

function initCarousels() {
  const carouselsContainer = document.getElementById('recipe-carousels');
  if (!carouselsContainer) return;

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
