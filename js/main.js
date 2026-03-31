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
import '../css/components/logo-intro.css';

// ── SPA Router ──
import { initRouter, registerRenderers, initReveal, BASE } from './router.js';
import { renderRecipe } from './recipe-renderer.js';
import { buildPicture } from './image-utils.js';
import { applyMadeBadgesToCards } from './recipe-bookmarks.js';
import { fluentEmoji, categoryEmoji, CATEGORY_FLUENT } from './emoji.js';
import { initLogoIntro } from './logo-intro-v2b.js';

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
 * Renderizza la homepage. Se il contenuto HTML è già inline (primo caricamento),
 * lo mantiene e aggiunge solo la logica interattiva. Se è una navigazione SPA,
 * ricostruisce il contenuto.
 */
async function renderHomepage(app /*, params */) {
  // Resetta metadata
  document.title = 'Il Ricettario';
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.setAttribute('content', 'Il Ricettario — Ricette artigianali ottimizzate per i miei strumenti.');

  // Se il contenuto homepage non è presente (navigazione SPA), ricostruiscilo
  if (!app.querySelector('#ricette')) {
    // Fetch recipes.json e ricostruisci
    app.innerHTML = getHomepageHTML();
  }

  // Init caroselli e search
  initCarousels();
  initReveal();
}

function getHomepageHTML() {
  return `
    <!-- ═══════════ HERO ═══════════ -->
    <section class="hero" id="home">
      <div class="hero__content">
        <div class="hero__badge reveal">${fluentEmoji('fire', 24)} Laboratorio Artigianale</div>
        <h1 class="hero__title reveal reveal-delay-1">Il mio<br><span>Ricettario</span></h1>
        <p class="hero__subtitle reveal reveal-delay-2">Pane, lievitati e pasta — ricette replicabili, parametri reali.</p>
        <div class="hero__search reveal reveal-delay-3" id="recipe-search">
          <svg class="hero__search-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input type="text" class="hero__search-input" id="search-input"
            placeholder="Cerca ricette, ingredienti, setup..." aria-label="Cerca ricette">
          <kbd class="hero__search-kbd">/</kbd>
        </div>
      </div>
    </section>

    <section class="section" id="ricette">
      <div class="container">
        <div class="section-header reveal">
          <div class="section-header__label">Le mie ricette</div>
          <h2 class="section-header__title">Ricette Testate & Documentate</h2>
          <p class="section-header__desc">Ogni ricetta è stata perfezionata con dosi precise, parametri tecnici e note dettagliate per risultati replicabili al 100%.</p>
        </div>
        <div id="recipe-carousels"></div>
      </div>
    </section>

    <section class="section tools-section" id="strumenti">
      <div class="container">
        <div class="section-header reveal">
          <div class="section-header__label">Il mio setup</div>
          <h2 class="section-header__title">Strumenti del Mestiere</h2>
          <p class="section-header__desc">Ogni ricetta è tarata specificamente per questi strumenti. Hardware serio per risultati seri.</p>
        </div>

        <div class="tool-spotlight reveal">
          <div class="tool-spotlight__image-wrapper">
            ${buildPicture(`${BASE}images/strumenti/famag-grilletta.png`, 'Famag Grilletta', 'tool-spotlight__image', 'lazy')}
            <span class="tool-spotlight__badge">${fluentEmoji('star', 22)} Impasti</span>
          </div>
          <div class="tool-spotlight__info">
            <h3 class="tool-spotlight__name">Famag Grilletta <span>IM 5/230 HH</span></h3>
            <p class="tool-spotlight__desc">Impastatrice a spirale professionale. 10 velocità, capacità 5 kg, vasca da 7L. Fino al 95% idratazione. Made in Italy.</p>
            <div class="tool-spotlight__specs">
              <div class="spec-card reveal"><div class="spec-card__icon">${fluentEmoji('high-voltage', 32)}</div><div class="spec-card__label">Motore</div><div class="spec-card__value">Brushless 0.5 HP</div></div>
              <div class="spec-card reveal reveal-delay-1"><div class="spec-card__icon">${fluentEmoji('bullseye', 32)}</div><div class="spec-card__label">Velocità</div><div class="spec-card__value">10 (90–320 RPM)</div></div>
              <div class="spec-card reveal reveal-delay-2"><div class="spec-card__icon">${fluentEmoji('package', 32)}</div><div class="spec-card__label">Capacità</div><div class="spec-card__value">5 kg / 7 litri</div></div>
              <div class="spec-card reveal reveal-delay-3"><div class="spec-card__icon">${fluentEmoji('droplet', 32)}</div><div class="spec-card__label">Idr. Max</div><div class="spec-card__value">Fino al 95%</div></div>
            </div>
          </div>
        </div>

        <div class="tool-spotlight reveal">
          <div class="tool-spotlight__image-wrapper">
            ${buildPicture(`${BASE}images/strumenti/philips-serie-7000.jpg`, 'Philips Serie 7000', 'tool-spotlight__image', 'lazy')}
            <span class="tool-spotlight__badge">${fluentEmoji('house', 22)} Pasta Home</span>
          </div>
          <div class="tool-spotlight__info">
            <h3 class="tool-spotlight__name">Philips <span>Serie 7000</span></h3>
            <p class="tool-spotlight__desc">Macchina per la pasta automatica. Pesatura integrata, 8 trafile, fino a 8 porzioni. Pasta in < 10 min.</p>
            <div class="tool-spotlight__specs">
              <div class="spec-card reveal"><div class="spec-card__icon">${fluentEmoji('high-voltage', 32)}</div><div class="spec-card__label">Potenza</div><div class="spec-card__value">200 W</div></div>
              <div class="spec-card reveal reveal-delay-1"><div class="spec-card__icon">${fluentEmoji('balance-scale', 32)}</div><div class="spec-card__label">Capacità</div><div class="spec-card__value">800g / 8 porz.</div></div>
              <div class="spec-card reveal reveal-delay-2"><div class="spec-card__icon">${fluentEmoji('spaghetti', 32)}</div><div class="spec-card__label">Trafile</div><div class="spec-card__value">8 incluse</div></div>
              <div class="spec-card reveal reveal-delay-3"><div class="spec-card__icon">${fluentEmoji('stopwatch', 32)}</div><div class="spec-card__label">Tempo</div><div class="spec-card__value">< 10 min</div></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section" id="chi-sono">
      <div class="container container--narrow">
        <div class="section-header reveal">
          <div class="section-header__label">About</div>
          <h2 class="section-header__title">Chi Sono</h2>
          <p class="section-header__desc">Appassionato di panificazione artigianale, pasta fresca e impasti ad alta idratazione. Ogni ricetta è documentata con precisione tecnica per risultati replicabili al 100%.</p>
        </div>
      </div>
    </section>
  `;
}

// ═══════════════════════════════════════
//  CATEGORY RENDERER
// ═══════════════════════════════════════

const CATEGORY_META = {
  pane:      { name: 'Pane',      emoji: 'baguette-bread', title: 'Pane Artigianale',           desc: 'Ricette di pane ad alta idratazione — ciabatta, filone, baguette e pane speciale.' },
  pizza:     { name: 'Pizza',     emoji: 'pizza',           title: 'Pizza Artigianale',          desc: 'Pizze con lievitazione lunga — napoletana, in teglia, canotto e pinsa romana.' },
  pasta:     { name: 'Pasta',     emoji: 'spaghetti',       title: 'Pasta Fresca',               desc: 'Pasta fresca fatta in casa — trafilata, ripiena e formati speciali.' },
  lievitati: { name: 'Lievitati', emoji: 'croissant',       title: 'Lievitati Dolci e Salati',   desc: 'Brioche, cornetti, panettone, burger buns e rosticceria.' },
  focaccia:  { name: 'Focaccia',  emoji: 'flatbread',       title: 'Focaccia Artigianale',       desc: 'Focacce ad alta idratazione — genovese, barese, pugliese e varianti creative.' },
  dolci:     { name: 'Dolci',     emoji: 'shortcake',       title: 'Dolci e Pasticceria',        desc: 'Dolci tradizionali, frolle, biscotti e pasticceria artigianale.' },
};

async function renderCategory(app, { category }) {
  const meta = CATEGORY_META[category] || {
    name: category, emoji: 'spaghetti',
    title: category, desc: `Tutte le ricette di ${category}.`,
  };

  document.title = `${meta.title} — Il Ricettario`;
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.setAttribute('content', meta.desc);

  // Struttura HTML della pagina categoria
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

        <div class="category-toolbar">
          <div class="category-toolbar__search">
            <span class="category-toolbar__search-icon"><i data-lucide="search" style="width:16px;height:16px"></i></span>
            <input type="text" class="category-toolbar__search-input" id="category-search"
              placeholder="Cerca tra le ricette di ${meta.name.toLowerCase()}...">
          </div>
          <div class="category-toolbar__sort">
            <button class="category-toolbar__sort-btn active" data-sort="az">A-Z</button>
            <button class="category-toolbar__sort-btn" data-sort="hydration">${fluentEmoji('droplet', 14)} Idratazione</button>
          </div>
        </div>

        <div class="category-grid" id="category-grid">
          <div class="category-empty">
            <div class="category-empty__icon">⏳</div>
            <p>Caricamento ricette...</p>
          </div>
        </div>
      </div>
    </main>
  `;

  // Carica ricette e renderizza
  try {
    const resp = await fetch(`${BASE}recipes.json`);
    const data = await resp.json();
    const allRecipes = data.recipes.filter(r => r.categoryDir === category || r.category === meta.name);

    // Hero con immagine della prima ricetta che ha un'immagine
    const heroRecipe = allRecipes.find(r => r.image);
    if (heroRecipe) {
      const heroEl = document.getElementById('category-hero');
      if (heroEl) heroEl.style.backgroundImage = `url('${BASE}${heroRecipe.image}')`;
    }

    // Contatore
    const countEl = document.getElementById('recipe-count');
    if (countEl) countEl.textContent = `${fluentEmoji('bullseye', 16)} ${allRecipes.length} ricette`;

    // Render griglia
    const grid = document.getElementById('category-grid');
    renderCategoryGrid(grid, allRecipes, category);

    // Search
    const searchInput = document.getElementById('category-search');
    if (searchInput) {
      searchInput.addEventListener('input', () => {
        const query = searchInput.value.toLowerCase().trim();
        const cards = grid.querySelectorAll('.category-card');
        cards.forEach(card => {
          const title = card.dataset.title || '';
          card.style.display = (!query || title.includes(query)) ? '' : 'none';
        });
      });
    }

    // Sort
    const sortBtns = app.querySelectorAll('.category-toolbar__sort-btn');
    sortBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        sortBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const sortType = btn.dataset.sort;
        let sorted = [...allRecipes];
        if (sortType === 'az') {
          sorted.sort((a, b) => (a.title || '').localeCompare(b.title || '', 'it'));
        } else if (sortType === 'hydration') {
          sorted.sort((a, b) => (parseInt(b.hydration) || 0) - (parseInt(a.hydration) || 0));
        }
        renderCategoryGrid(grid, sorted, category);
      });
    });

    initReveal();
    applyMadeBadgesToCards();
  } catch (err) {
    console.error('Errore caricamento categoria:', err);
    const grid = document.getElementById('category-grid');
    if (grid) grid.innerHTML = `<div class="category-empty"><div class="category-empty__icon">${fluentEmoji('prohibited', 32)}</div><p>Errore nel caricamento delle ricette.</p></div>`;
  }
}

function renderCategoryGrid(grid, recipes, categoryDir) {
  if (!grid) return;

  if (recipes.length === 0) {
    grid.innerHTML = `
      <div class="category-empty" style="grid-column: 1 / -1">
        <div class="category-empty__icon"><i data-lucide="search" style="width:32px;height:32px"></i></div>
        <p>Nessuna ricetta trovata</p>
      </div>`;
    return;
  }

  grid.innerHTML = recipes.map((r, index) => {
    const delay = Math.min(index * 0.05, 1.5);
    const spaHref = `${BASE}ricette/${r.categoryDir || categoryDir}/${r.slug}`;
    return `
      <a href="${spaHref}" class="category-card slide-up-enter" data-link
         style="animation-delay: ${delay}s" data-title="${(r.title || '').toLowerCase()}" 
         data-hydration="${parseInt(r.hydration) || 0}">
        <div class="category-card__image-wrapper">
          ${r.image ? buildPicture(`${BASE}${r.image}`, r.title, 'category-card__image', 'lazy') : ''}
          <div class="category-card__meta">
            ${r.hydration ? `<span class="category-card__tag">${fluentEmoji('droplet', 14)} ${r.hydration}</span>` : ''}
            ${r.time ? `<span class="category-card__tag">${fluentEmoji('stopwatch', 14)} ${r.time}</span>` : ''}
          </div>
        </div>
        <div class="category-card__body">
          <h3 class="category-card__title">${r.title}</h3>
          ${r.description ? `<p class="category-card__desc">${r.description}</p>` : ''}
        </div>
      </a>`;
  }).join('');
}

// ═══════════════════════════════════════
//  CAROUSELS (Netflix-style rows)
// ═══════════════════════════════════════

function initCarousels() {
  const carouselsContainer = document.getElementById('recipe-carousels');
  if (!carouselsContainer) return;

  const CATEGORY_ORDER = [
    { key: 'Pasta', emoji: 'spaghetti', dir: 'pasta' },
    { key: 'Pane', emoji: 'baguette-bread', dir: 'pane' },
    { key: 'Pizza', emoji: 'pizza', dir: 'pizza' },
    { key: 'Lievitati', emoji: 'croissant', dir: 'lievitati' },
    { key: 'Dolci', emoji: 'cookie', dir: 'dolci' },
    { key: 'Focaccia', emoji: 'flatbread', dir: 'focaccia' },
  ];

  fetch(`${BASE}recipes.json`)
    .then(r => r.json())
    .then(data => {
      carouselsContainer.innerHTML = '';

      const grouped = {};
      data.recipes.forEach(r => {
        if (!grouped[r.category]) grouped[r.category] = [];
        grouped[r.category].push(r);
      });

      CATEGORY_ORDER.forEach(cat => {
        const recipes = grouped[cat.key];
        if (!recipes || recipes.length === 0) return;

        const row = document.createElement('div');
        row.className = 'category-row reveal';
        row.dataset.category = cat.key;

        // Fix href per SPA: rimuovi .html
        row.innerHTML = `
          <div class="category-row__header">
            <h3 class="category-row__title">
              ${fluentEmoji(cat.emoji, 32)} ${cat.key}
              <span class="category-row__count">${recipes.length} ricette</span>
            </h3>
            <a href="${BASE}ricette/${cat.dir}/" class="category-row__link" data-link>Vedi tutte</a>
          </div>
          <div class="category-row__carousel-wrapper">
            <button class="carousel-arrow carousel-arrow--prev" aria-label="Precedente">‹</button>
            <div class="category-row__carousel">
              ${recipes.map(r => {
                // Converti href .html → senza estensione per SPA
                const spaHref = r.href.replace('.html', '');
                return `
                <a href="${spaHref}" class="recipe-card--compact" data-link data-title="${r.title.toLowerCase()}" data-category="${r.category}">
                  <div class="recipe-card--compact__image-wrapper">
                    ${r.image ? buildPicture(r.image, r.title, 'recipe-card--compact__image', 'lazy') : ''}
                  </div>
                  <div class="recipe-card--compact__body">
                    <h4 class="recipe-card--compact__title">${r.title}</h4>
                    <div class="recipe-card--compact__meta">
                      ${r.hydration ? `<span class="recipe-card--compact__tag">${fluentEmoji('droplet', 16)} ${r.hydration}</span>` : ''}
                      ${r.time ? `<span>${fluentEmoji('stopwatch', 16)} ${r.time}</span>` : ''}
                    </div>
                  </div>
                </a>`;
              }).join('')}
            </div>
            <button class="carousel-arrow carousel-arrow--next" aria-label="Successivo">›</button>
          </div>
        `;

        carouselsContainer.appendChild(row);

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
      card.style.display = (!query || title.includes(query)) ? '' : 'none';
    });

    allRows.forEach(row => {
      const visibleCards = row.querySelectorAll('.recipe-card--compact:not([style*="display: none"])');
      row.style.display = visibleCards.length > 0 ? '' : 'none';
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
