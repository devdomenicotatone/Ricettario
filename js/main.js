/* ============================================
   IL RICETTARIO — Main JS 2026
   Il Ricettario — Main JS 2026
   ============================================ */

// ── Cascade Layers — ordine di priorità ──
// L'ordine degli import definisce la priorità dei layer CSS
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
import '../css/utilities/animations.css';

document.addEventListener('DOMContentLoaded', () => {

  // === NAVBAR SCROLL EFFECT ===
  const navbar = document.getElementById('navbar');
  if (navbar) {
    const onScroll = () => {
      navbar.classList.toggle('scrolled', window.scrollY > 50);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // === THEME TOGGLE ===
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';

      // Animazione rotazione
      themeToggle.classList.add('theme-toggle--switching');
      setTimeout(() => themeToggle.classList.remove('theme-toggle--switching'), 400);

      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
    });

    // Ascolta cambiamenti del sistema (solo se non c'è override manuale)
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem('theme')) {
        document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
      }
    });
  }

  // === HAMBURGER MENU MOBILE ===
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navLinks.classList.toggle('open');
    });

    // Chiudi menu quando clicchi un link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
      });
    });

    // Chiudi cliccando fuori
    document.addEventListener('click', (e) => {
      if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
      }
    });
  }

  // === SCROLL REVEAL — IntersectionObserver ===
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length > 0) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    reveals.forEach(el => revealObserver.observe(el));
  }

  // === ACTIVE NAV LINK ===
  const sections = document.querySelectorAll('section[id]');
  if (sections.length > 0) {
    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          document.querySelectorAll('.navbar__links a').forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
          });
        }
      });
    }, { threshold: 0.3 });

    sections.forEach(section => navObserver.observe(section));
  }

  // === CATEGORY CAROUSELS — Netflix-style rows ===
  const carouselsContainer = document.getElementById('recipe-carousels');
  if (carouselsContainer) {
    const CATEGORY_ORDER = [
      { key: 'Pasta', emoji: '🍝', dir: 'pasta' },
      { key: 'Pane', emoji: '🥖', dir: 'pane' },
      { key: 'Pizza', emoji: '🍕', dir: 'pizza' },
      { key: 'Lievitati', emoji: '🥐', dir: 'lievitati' },
      { key: 'Dolci', emoji: '🍪', dir: 'dolci' },
      { key: 'Focaccia', emoji: '🫓', dir: 'focaccia' },
    ];

    // Fetch recipes data
    fetch(`${import.meta.env.BASE_URL}recipes.json`)
      .then(r => r.json())
      .then(data => {
        carouselsContainer.innerHTML = ''; // Remove loading placeholder

        // Group by category
        const grouped = {};
        data.recipes.forEach(r => {
          if (!grouped[r.category]) grouped[r.category] = [];
          grouped[r.category].push(r);
        });

        // Render each category row
        CATEGORY_ORDER.forEach(cat => {
          const recipes = grouped[cat.key];
          if (!recipes || recipes.length === 0) return;

          const row = document.createElement('div');
          row.className = 'category-row reveal';
          row.dataset.category = cat.key;

          row.innerHTML = `
            <div class="category-row__header">
              <h3 class="category-row__title">
                ${cat.emoji} ${cat.key}
                <span class="category-row__count">${recipes.length} ricette</span>
              </h3>
              <a href="ricette/${cat.dir}/" class="category-row__link">Vedi tutte</a>
            </div>
            <div class="category-row__carousel-wrapper">
              <button class="carousel-arrow carousel-arrow--prev" aria-label="Precedente">‹</button>
              <div class="category-row__carousel">
                ${recipes.map(r => `
                  <a href="${r.href}" class="recipe-card--compact" data-title="${r.title.toLowerCase()}" data-category="${r.category}">
                    <div class="recipe-card--compact__image-wrapper">
                      ${r.image ? `<img src="${r.image}" alt="${r.title}" class="recipe-card--compact__image" loading="lazy">` : ''}
                    </div>
                    <div class="recipe-card--compact__body">
                      <h4 class="recipe-card--compact__title">${r.title}</h4>
                      <div class="recipe-card--compact__meta">
                        ${r.hydration ? `<span class="recipe-card--compact__tag">💧 ${r.hydration}</span>` : ''}
                        ${r.time ? `<span>⏱️ ${r.time}</span>` : ''}
                      </div>
                    </div>
                  </a>
                `).join('')}
              </div>
              <button class="carousel-arrow carousel-arrow--next" aria-label="Successivo">›</button>
            </div>
          `;

          carouselsContainer.appendChild(row);

          // Setup carousel scroll logic
          const carousel = row.querySelector('.category-row__carousel');
          const wrapper = row.querySelector('.category-row__carousel-wrapper');
          const prevBtn = row.querySelector('.carousel-arrow--prev');
          const nextBtn = row.querySelector('.carousel-arrow--next');
          const cardWidth = 276; // card width + gap

          const updateScrollState = () => {
            const { scrollLeft, scrollWidth, clientWidth } = carousel;
            wrapper.classList.toggle('has-scroll-left', scrollLeft > 10);
            wrapper.classList.toggle('has-scroll-right', scrollLeft < scrollWidth - clientWidth - 10);
            prevBtn.disabled = scrollLeft <= 10;
            nextBtn.disabled = scrollLeft >= scrollWidth - clientWidth - 10;
          };

          carousel.addEventListener('scroll', updateScrollState, { passive: true });
          requestAnimationFrame(updateScrollState);

          prevBtn.addEventListener('click', () => {
            carousel.scrollBy({ left: -cardWidth * 3, behavior: 'smooth' });
          });
          nextBtn.addEventListener('click', () => {
            carousel.scrollBy({ left: cardWidth * 3, behavior: 'smooth' });
          });
        });

        // Re-observe reveal elements for new dynamic content
        const newReveals = carouselsContainer.querySelectorAll('.reveal');
        if (newReveals.length > 0) {
          const revealObs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
              if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObs.unobserve(entry.target);
              }
            });
          }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
          newReveals.forEach(el => revealObs.observe(el));
        }

        // Setup search after carousels are rendered
        setupSearch();
      })
      .catch(err => {
        console.error('Errore caricamento recipes.json:', err);
        carouselsContainer.innerHTML = '<p style="text-align:center; color: var(--color-text-muted);">Errore nel caricamento delle ricette.</p>';
      });
  }

  // === SEARCH RICETTE ===
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

      // Hide entire category row if no visible cards
      allRows.forEach(row => {
        const visibleCards = row.querySelectorAll('.recipe-card--compact:not([style*="display: none"])');
        row.style.display = visibleCards.length > 0 ? '' : 'none';
      });
    });

    // Shortcut: "/" per focus search
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

  // === ANNO DINAMICO nel Footer ===
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // === SETUP TOGGLE ===
  const setupBadge = document.getElementById('setup-badge');
  if (setupBadge) {
    const heroTag = document.getElementById('hero-setup-tag');
    const badgeValue = document.getElementById('setup-badge-value');
    const stepPanels = document.querySelectorAll('.recipe-panel[data-setup]');

    // Rileva dinamicamente quali setup sono disponibili nella pagina
    const SETUP_CONFIG = {
      spirale: { icon: '🔧', label: 'Impastatrice a spirale' },
      estrusore: { icon: '🔧', label: 'Estrusore con trafila' },
      mano: { icon: '🤲', label: 'A mano' },
    };

    const SETUPS = [];
    stepPanels.forEach(panel => {
      const id = panel.getAttribute('data-setup');
      if (SETUP_CONFIG[id]) {
        SETUPS.push({ id, ...SETUP_CONFIG[id] });
      }
    });

    // Se c'è un solo setup, nascondi il toggle
    if (SETUPS.length <= 1) {
      setupBadge.style.cursor = 'default';
      setupBadge.removeAttribute('role');
      setupBadge.removeAttribute('tabindex');
    }

    let currentIndex = 0;

    const activateSetup = (index) => {
      currentIndex = index;
      const config = SETUPS[index];

      // Show/hide procedure panels (escludendo "condimento" che è sempre visibile)
      stepPanels.forEach(panel => {
        if (panel.getAttribute('data-setup') === 'condimento') return;
        panel.style.display = panel.getAttribute('data-setup') === config.id ? '' : 'none';
      });

      // Update hero tag
      if (heroTag) heroTag.textContent = `${config.icon} ${config.label}`;

      // Update tech badge
      if (badgeValue) badgeValue.textContent = `\u00a0${config.label}`;

      // Persist
      localStorage.setItem('recipe-setup', config.id);
    };

    // Click cycles to next setup (solo se > 1 setup)
    if (SETUPS.length > 1) {
      setupBadge.addEventListener('click', () => {
        activateSetup((currentIndex + 1) % SETUPS.length);
      });

      // Keyboard accessibility
      setupBadge.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          activateSetup((currentIndex + 1) % SETUPS.length);
        }
      });
    }

    // Restore saved choice
    const savedSetup = localStorage.getItem('recipe-setup');
    if (savedSetup) {
      const savedIndex = SETUPS.findIndex(s => s.id === savedSetup);
      if (savedIndex !== -1) activateSetup(savedIndex);
    }
  }

  // === CALCOLATORE DOSI ===
  const doseInput = document.getElementById('dose-input');
  const doseBadge = document.getElementById('dose-badge');
  const doseDecrease = document.getElementById('dose-decrease');
  const doseIncrease = document.getElementById('dose-increase');

  if (doseInput && doseBadge) {
    const allQtyCells = document.querySelectorAll('.ingredient-qty[data-base]');
    // Base reale della ricetta (dal data-base-total generato dal template)
    const baseTotal = parseFloat(doseInput.getAttribute('data-base-total')) || 1000;
    const baseKg = baseTotal / 1000;

    const updateDoses = () => {
      const kg = parseFloat(doseInput.value) || baseKg;
      const multiplier = kg / baseKg;

      // Update badge
      doseBadge.textContent = multiplier === 1 ? '×1' : `×${multiplier % 1 === 0 ? multiplier : multiplier.toFixed(1)}`;

      // Update each ingredient quantity
      allQtyCells.forEach(cell => {
        const base = parseFloat(cell.getAttribute('data-base'));
        const newVal = base * multiplier;

        // Smart rounding: integer if >= 10g, one decimal if < 10g
        const formatted = newVal >= 10
          ? `${Math.round(newVal)}g`
          : `${Math.round(newVal * 10) / 10}g`;

        cell.textContent = formatted;

        // Pulse animation
        cell.classList.remove('dose-updated');
        // Force reflow for re-triggering animation
        void cell.offsetWidth;
        cell.classList.add('dose-updated');
      });
    };

    doseInput.addEventListener('input', updateDoses);
    doseInput.addEventListener('change', updateDoses);

    // Step proporzionale alla ricetta: incremento/decremento = base kg
    const stepKg = baseKg <= 0.5 ? baseKg : 0.5;

    if (doseDecrease) {
      doseDecrease.addEventListener('click', () => {
        const current = parseFloat(doseInput.value) || baseKg;
        const min = parseFloat(doseInput.min) || stepKg;
        if (current > min) {
          doseInput.value = Math.round((current - stepKg) * 10) / 10;
          updateDoses();
        }
      });
    }

    if (doseIncrease) {
      doseIncrease.addEventListener('click', () => {
        const current = parseFloat(doseInput.value) || baseKg;
        const max = parseFloat(doseInput.max) || 5;
        if (current < max) {
          doseInput.value = Math.round((current + stepKg) * 10) / 10;
          updateDoses();
        }
      });
    }

    // Sincronizza UI all'avvio
    updateDoses();
  }

  // === VIEW TRANSITIONS API — Navigazione Fluida ===
  if ('startViewTransition' in document) {
    document.querySelectorAll('a[href]').forEach(link => {
      const href = link.getAttribute('href');
      // Solo link interni a pagine HTML
      if (href && href.endsWith('.html') && !href.startsWith('http')) {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          document.startViewTransition(() => {
            window.location.href = href;
          });
        });
      }
    });
  }

});
