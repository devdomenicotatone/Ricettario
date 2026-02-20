/**
 * CATEGORY PAGE JS
 * Shared logic for all category pages.
 * Detects category from URL path, loads recipes.json, renders grid.
 */

// Import all styles (same as main.js)
import '../css/base/tokens.css';
import '../css/base/reset.css';
import '../css/layout/container.css';
import '../css/components/navbar.css';
import '../css/components/theme-toggle.css';
import '../css/components/category-page.css';
import '../css/components/footer.css';
import '../css/utilities/animations.css';

document.addEventListener('DOMContentLoaded', () => {

    // === DETECT CATEGORY FROM URL ===
    const path = window.location.pathname;
    const categoryMap = {
        '/ricette/pasta/': 'Pasta',
        '/ricette/pane/': 'Pane',
        '/ricette/pizza/': 'Pizza',
        '/ricette/lievitati/': 'Lievitati',
        '/ricette/focaccia/': 'Focaccia',
    };

    // Find the matching category (handle Vite base path)
    let currentCategory = null;
    for (const [urlPart, cat] of Object.entries(categoryMap)) {
        if (path.includes(urlPart)) {
            currentCategory = cat;
            break;
        }
    }

    if (!currentCategory) {
        console.error('Categoria non riconosciuta dal path:', path);
        return;
    }

    // === THEME TOGGLE ===
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const current = document.documentElement.getAttribute('data-theme');
            const next = current === 'dark' ? 'light' : 'dark';
            themeToggle.classList.add('theme-toggle--switching');
            setTimeout(() => themeToggle.classList.remove('theme-toggle--switching'), 400);
            document.documentElement.setAttribute('data-theme', next);
            localStorage.setItem('theme', next);
        });
    }

    // === HAMBURGER ===
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');
    if (hamburger && navLinks) {
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
    }

    // === NAVBAR SCROLL ===
    const navbar = document.getElementById('navbar');
    if (navbar) {
        const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 50);
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

    // === YEAR ===
    const yearEl = document.getElementById('current-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // === LOAD RECIPES ===
    const grid = document.getElementById('category-grid');
    const countEl = document.getElementById('recipe-count');
    let allRecipes = [];

    fetch(`${import.meta.env.BASE_URL}recipes.json`)
        .then(r => r.json())
        .then(data => {
            allRecipes = data.recipes.filter(r => r.category === currentCategory);

            // Update count
            countEl.textContent = `📊 ${allRecipes.length} ricette`;

            // Initial render
            renderGrid(allRecipes);

            // Setup search
            setupSearch();

            // Setup sort
            setupSort();
        })
        .catch(err => {
            console.error('Errore caricamento:', err);
            grid.innerHTML = '<p style="text-align:center; padding: 2rem;">Errore nel caricamento.</p>';
        });

    // === RENDER GRID ===
    function renderGrid(recipes) {
        if (recipes.length === 0) {
            grid.innerHTML = `
        <div class="category-empty" style="grid-column: 1 / -1">
          <div class="category-empty__icon">🔍</div>
          <p>Nessuna ricetta trovata</p>
        </div>`;
            return;
        }

        grid.innerHTML = recipes.map((r, index) => {
            const delay = Math.min(index * 0.05, 1.5); // Cap to 1.5s max delay
            return `
      <a href="${r.slug}.html" class="category-card slide-up-enter" style="animation-delay: ${delay}s" data-title="${r.title.toLowerCase()}" data-hydration="${parseInt(r.hydration) || 0}">
        <div class="category-card__image-wrapper">
          ${r.image ? `<img src="../../${r.image}" alt="${r.title}" class="category-card__image" loading="lazy">` : ''}
          <div class="category-card__meta">
            ${r.hydration ? `<span class="category-card__tag">💧 ${r.hydration}</span>` : ''}
            ${r.tool ? `<span class="category-card__tag">🔧 ${r.tool}</span>` : ''}
          </div>
        </div>
        <div class="category-card__body">
          <h3 class="category-card__title">${r.title}</h3>
          ${r.description ? `<p class="category-card__desc">${r.description}</p>` : ''}
        </div>
      </a>
    `;
        }).join('');
    }

    // === SEARCH ===
    function setupSearch() {
        const searchInput = document.getElementById('category-search');
        if (!searchInput) return;

        searchInput.addEventListener('input', () => {
            const query = searchInput.value.toLowerCase().trim();
            const cards = grid.querySelectorAll('.category-card');

            cards.forEach(card => {
                const title = card.dataset.title || '';
                card.style.display = (!query || title.includes(query)) ? '' : 'none';
            });
        });
    }

    // === SORT ===
    function setupSort() {
        const sortBtns = document.querySelectorAll('.category-toolbar__sort-btn');

        sortBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                sortBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const sortType = btn.dataset.sort;
                let sorted = [...allRecipes];

                if (sortType === 'az') {
                    sorted.sort((a, b) => a.title.localeCompare(b.title, 'it'));
                } else if (sortType === 'hydration') {
                    sorted.sort((a, b) => {
                        const hA = parseInt(a.hydration) || 0;
                        const hB = parseInt(b.hydration) || 0;
                        return hB - hA; // Descending
                    });
                }

                renderGrid(sorted);
            });
        });
    }
});
