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

  // === 3D TILT su Recipe Cards ===
  document.querySelectorAll('.recipe-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `translateY(-8px) perspective(800px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // === FILTRI CATEGORIA ===
  const filterBar = document.getElementById('filter-bar');
  let activeFilter = 'tutti';

  if (filterBar) {
    const filterChips = filterBar.querySelectorAll('.filter-chip');
    const allCards = document.querySelectorAll('.recipe-card');

    const applyFilter = (category) => {
      activeFilter = category;

      // Update chip attivo
      filterChips.forEach(chip => {
        chip.classList.toggle('active', chip.dataset.filter === category);
      });

      // Filtra card
      allCards.forEach(card => {
        const cardCategory = card.dataset.category || '';
        const matchesFilter = category === 'tutti' || cardCategory === category;
        card.classList.toggle('recipe-card--filtered', !matchesFilter);
      });
    };

    filterChips.forEach(chip => {
      chip.addEventListener('click', () => applyFilter(chip.dataset.filter));
    });
  }

  // === SEARCH RICETTE ===
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    const recipeCards = document.querySelectorAll('.recipe-card');

    searchInput.addEventListener('input', () => {
      const query = searchInput.value.toLowerCase().trim();

      recipeCards.forEach(card => {
        if (!query) {
          card.classList.remove('recipe-card--hidden');
          return;
        }
        const text = card.textContent.toLowerCase();
        const matchesSearch = text.includes(query);
        // Rispetta anche il filtro categoria attivo
        const cardCategory = card.dataset.category || '';
        const matchesFilter = activeFilter === 'tutti' || cardCategory === activeFilter;
        card.classList.toggle('recipe-card--hidden', !matchesSearch || !matchesFilter);
      });
    });

    // Shortcut: "/" per focus search
    document.addEventListener('keydown', (e) => {
      if (e.key === '/' && document.activeElement !== searchInput) {
        e.preventDefault();
        searchInput.focus();
        searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      // Escape per clear e blur
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

    const SETUPS = [
      { id: 'spirale', icon: '🔧', label: 'Impastatrice a spirale' },
      { id: 'mano', icon: '🤲', label: 'A mano' }
    ];

    let currentIndex = 0;

    const activateSetup = (index) => {
      currentIndex = index;
      const config = SETUPS[index];

      // Show/hide procedure panels
      stepPanels.forEach(panel => {
        panel.style.display = panel.getAttribute('data-setup') === config.id ? '' : 'none';
      });

      // Update hero tag
      if (heroTag) heroTag.textContent = `${config.icon} ${config.label}`;

      // Update tech badge
      if (badgeValue) badgeValue.textContent = `\u00a0${config.label}`;

      // Persist
      localStorage.setItem('recipe-setup', config.id);
    };

    // Click cycles to next setup
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

    const updateDoses = () => {
      const kg = parseFloat(doseInput.value) || 1;
      const multiplier = kg;

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

    if (doseDecrease) {
      doseDecrease.addEventListener('click', () => {
        const current = parseFloat(doseInput.value) || 1;
        const min = parseFloat(doseInput.min) || 0.5;
        if (current > min) {
          doseInput.value = (current - 0.5).toFixed(1);
          updateDoses();
        }
      });
    }

    if (doseIncrease) {
      doseIncrease.addEventListener('click', () => {
        const current = parseFloat(doseInput.value) || 1;
        const max = parseFloat(doseInput.max) || 5;
        if (current < max) {
          doseInput.value = (current + 0.5).toFixed(1);
          updateDoses();
        }
      });
    }
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
