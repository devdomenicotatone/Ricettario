/* ============================================
   IL RICETTARIO — Recipe Bookmarks (2026)
   Gestisce il sistema "Fatta ✓" con localStorage
   ============================================ */

const STORAGE_KEY = 'ricettario_fatte';

/**
 * Legge l'elenco delle ricette fatte dal localStorage
 * @returns {Set<string>} Set di slug
 */
function getMadeRecipes() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

/**
 * Salva l'elenco delle ricette fatte
 * @param {Set<string>} slugs
 */
function saveMadeRecipes(slugs) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...slugs]));
}

/**
 * Check se una ricetta è stata fatta
 * @param {string} slug
 * @returns {boolean}
 */
export function isMade(slug) {
  return getMadeRecipes().has(slug);
}

/**
 * Toggle stato "fatta" per una ricetta
 * @param {string} slug
 * @returns {boolean} nuovo stato (true = fatta)
 */
export function toggleMade(slug) {
  const set = getMadeRecipes();
  const newState = !set.has(slug);
  if (newState) {
    set.add(slug);
  } else {
    set.delete(slug);
  }
  saveMadeRecipes(set);
  return newState;
}

/**
 * Conta le ricette fatte
 * @returns {number}
 */
export function getMadeCount() {
  return getMadeRecipes().size;
}

// ═══════════════════════════════════════
//  UI — Badge sulla card homepage/categoria
// ═══════════════════════════════════════

/**
 * Aggiunge badge "✓ Fatta" alle card nella homepage e categoria.
 * Deve essere chiamata dopo che il DOM delle card è stato renderizzato.
 */
export function applyMadeBadgesToCards() {
  const madeSet = getMadeRecipes();
  if (madeSet.size === 0) return;

  // Card homepage (compact) e card categoria
  const allCards = document.querySelectorAll('.recipe-card--compact, .category-card');
  allCards.forEach(card => {
    const href = card.getAttribute('href') || '';
    // Estrai slug dall'href: .../ricette/pane/ciabatta-poolish → ciabatta-poolish
    const slug = href.split('/').filter(Boolean).pop();

    if (slug && madeSet.has(slug)) {
      // Aggiungi badge solo se non esiste già
      if (!card.querySelector('.made-badge')) {
        const badge = document.createElement('span');
        badge.className = 'made-badge';
        badge.textContent = '✓';
        badge.title = 'Ricetta già fatta!';

        // Su card compact, mettilo nell'image wrapper; su category card uguale
        const wrapper = card.querySelector('.recipe-card--compact__image-wrapper, .category-card__image-wrapper');
        if (wrapper) {
          wrapper.appendChild(badge);
        }
      }
    }
  });
}

// ═══════════════════════════════════════
//  UI — Toggle button sulla pagina ricetta
// ═══════════════════════════════════════

/**
 * Inizializza il bottone "Fatta!" sulla pagina dettaglio ricetta.
 * @param {string} slug - Slug della ricetta corrente
 */
export function initMadeToggle(slug) {
  const btn = document.getElementById('made-toggle');
  if (!btn) return;

  const updateButton = (made) => {
    btn.classList.toggle('made-toggle--active', made);
    btn.innerHTML = made
      ? '<span class="made-toggle__icon">✓</span> <span class="made-toggle__label">Fatta!</span>'
      : '<span class="made-toggle__icon">○</span> <span class="made-toggle__label">Segna come fatta</span>';
    btn.title = made ? 'Clicca per rimuovere' : 'Segna questa ricetta come fatta';
  };

  updateButton(isMade(slug));

  btn.addEventListener('click', (e) => {
    e.preventDefault();
    const newState = toggleMade(slug);
    updateButton(newState);

    // Micro-animation
    btn.classList.add('made-toggle--pop');
    setTimeout(() => btn.classList.remove('made-toggle--pop'), 400);
  });
}
