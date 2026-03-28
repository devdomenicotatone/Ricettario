/* ============================================
   IL RICETTARIO — Recipe Renderer (2026)
   Renderizza una ricetta dal JSON nel DOM
   ============================================ */

import { BASE } from './router.js';
import { buildHeroPicture } from './image-utils.js';

// ── Emoji per categoria ──
const CATEGORY_EMOJI = {
  Pane: '🥖', Pasta: '🍝', Pizza: '🍕',
  Lievitati: '🥐', Dolci: '🍪', Focaccia: '🫓',
};

/**
 * Renderizza una ricetta completa nel container #app.
 * @param {HTMLElement} app - Container DOM
 * @param {{ category: string, slug: string }} params
 */
export async function renderRecipe(app, { category, slug }) {
  // ── Loading state ──
  app.innerHTML = `
    <div class="recipe-loading">
      <div class="recipe-loading__spinner"></div>
      <p>Caricamento ricetta...</p>
    </div>`;

  try {
    // ── Fetch JSON ──
    const jsonUrl = `${BASE}ricette/${category}/${slug}.json`;
    const res = await fetch(jsonUrl);
    if (!res.ok) throw new Error(`Ricetta non trovata (${res.status})`);
    const recipe = await res.json();

    // ── Update page metadata ──
    document.title = `${recipe.title} — Il Ricettario`;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', recipe.description || '');

    // ── Render ──
    app.innerHTML = buildRecipeHTML(recipe, category);

    // ── Init interactive features ──
    initSetupToggle();
    initDoseCalculator(recipe);

  } catch (err) {
    app.innerHTML = `
      <div class="container" style="padding: 120px 0; text-align: center;">
        <h2>😔 Ricetta non trovata</h2>
        <p style="color: var(--color-text-muted);">${err.message}</p>
        <a href="${BASE}" data-link class="btn-back">← Torna alla Home</a>
      </div>`;
  }
}

// ═══════════════════════════════════════
//  HTML BUILDER — Genera tutto il markup
// ═══════════════════════════════════════

function buildRecipeHTML(r, categoryDir) {
  const catEmoji = CATEGORY_EMOJI[r.category] || '📖';
  const imagePath = r.image
    ? `${BASE}${r.image.replace(/^\//, '')}`
    : `${BASE}images/ricette/${categoryDir}/${r.slug}.jpg`;

  // Determina quali step esistono realmente
  const hasSpiralSteps = (r.stepsSpiral || []).length > 0;
  const hasExtruderSteps = (r.stepsExtruder || []).length > 0;
  const hasHandSteps = (r.stepsHand || []).length > 0;
  const isPasta = (r.category || '').toLowerCase() === 'pasta';
  const hasMachineSteps = isPasta ? hasExtruderSteps : hasSpiralSteps;
  const isHandOnly = !hasMachineSteps && hasHandSteps;

  // Hero tag dinamico (nascosto se hand-only)
  const heroToolTag = isHandOnly
    ? ''
    : `<span class="tag tag--tool" id="hero-setup-tag">${isPasta ? '🍝 Pasta' : '🔧 Impastatrice a spirale'}</span>`;

  return `
    <!-- ═══════════ RECIPE HERO ═══════════ -->
    <div class="recipe-hero">
      ${buildHeroPicture(imagePath, r.title)}
      <div class="container">
        <nav class="breadcrumb reveal">
          <a href="${BASE}" data-link>Home</a>
          <span class="breadcrumb__separator">›</span>
          <a href="${BASE}#ricette" data-link>Ricette</a>
          <span class="breadcrumb__separator">›</span>
          <a href="${BASE}ricette/${categoryDir}/" data-link>${r.category}</a>
          <span class="breadcrumb__separator">›</span>
          <span>${r.title}</span>
        </nav>

        <div class="recipe-hero__content">
          <div class="recipe-hero__tags reveal">
            ${heroToolTag}
            <span class="tag tag--category">${catEmoji} ${r.category}</span>
          </div>
          <h1 class="recipe-hero__title reveal reveal-delay-1">${r.title}</h1>
          <p class="recipe-hero__subtitle reveal reveal-delay-2">${r.subtitle || r.description}</p>
        </div>
      </div>
    </div>

    <!-- ═══════════ TECH BADGES ═══════════ -->
    <div class="container" style="padding-top: 40px;">
      <div class="tech-badges reveal">
        ${r.hydration ? `<div class="tech-badge">💧 Idratazione: <span class="tech-badge__value">&nbsp;${r.hydration}%</span></div>` : ''}
        ${r.targetTemp ? `<div class="tech-badge">🌡️ Target Temp: <span class="tech-badge__value">&nbsp;${r.targetTemp}</span></div>` : ''}
        ${r.fermentation ? `<div class="tech-badge">⏱️ Lievitazione: <span class="tech-badge__value">&nbsp;${r.fermentation}</span></div>` : ''}
        ${buildSetupBadge(r)}
      </div>
    </div>

    <!-- ═══════════ RECIPE CONTENT ═══════════ -->
    <section class="recipe-content" id="recipe-content">
      <div class="container">
        <div class="recipe-layout">

          <!-- COLONNA SX: Ingredienti -->
          <div>
            ${buildIngredientsPanel(r)}
            ${r.suspensions?.length ? buildSuspensionsPanel(r) : ''}
          </div>

          <!-- COLONNA DX: Procedimento -->
          <div>
            ${buildStepsPanel(r, 'stepsSpiral', 'spirale', '🔧 Spirale', isHandOnly)}
            ${buildStepsPanel(r, 'stepsExtruder', 'estrusore', '🔧 Estrusore', isHandOnly)}
            ${buildStepsPanel(r, 'stepsHand', 'mano', '🤲 A mano', isHandOnly)}
            ${buildStepsPanel(r, 'stepsCondiment', 'condimento', '🍅 Condimento', isHandOnly)}
          </div>

        </div>

        ${buildFlourTable(r)}
        ${buildAlert(r)}
        ${buildBaking(r)}
        ${buildProTips(r)}
        ${buildGlossary(r)}
      </div>
    </section>
  `;
}

// ── Setup Badge ──
function buildSetupBadge(r) {
  const hasMultiSetup = (r.stepsSpiral?.length || r.stepsExtruder?.length) && r.stepsHand?.length;
  if (!hasMultiSetup) return '';

  return `
    <div class="tech-badge tech-badge--toggle" id="setup-badge" role="button" tabindex="0" aria-label="Cambia setup">
      🔧 Setup: <span class="tech-badge__value" id="setup-badge-value">&nbsp;Impastatrice a spirale</span>
    </div>`;
}

// ── Ingredienti ──
function buildIngredientsPanel(r) {
  if (!r.ingredients?.length) return '';

  const rows = r.ingredients.map(ing => {
    const setupNotes = ing.setupNote
      ? Object.entries(ing.setupNote).map(([k, v]) => `data-setup-note-${k}="${escHtml(v)}"`).join(' ')
      : '';

    return `<tr>
      <td>${escHtml(ing.name)} ${ing.note ? `<span class="ingredient-note" ${setupNotes}>${escHtml(ing.note)}</span>` : ''}</td>
      <td class="ingredient-qty">${ing.grams != null ? `${ing.grams}g` : ''}</td>
    </tr>`;
  }).join('');

  return `
    <div class="recipe-panel reveal">
      <h2 class="recipe-panel__title">
        <span class="recipe-panel__title-icon">🛒</span> Ingredienti Base
      </h2>

      <div class="dose-calculator" id="dose-calculator">
        <div class="dose-calculator__label">
          <span class="dose-calculator__label-icon">⚖️</span> Dosi
        </div>
        <div class="dose-calculator__controls">
          <button class="dose-calculator__btn" id="dose-decrease" aria-label="Diminuisci dosi">−</button>
          <div class="dose-calculator__display" id="dose-badge">×1</div>
          <button class="dose-calculator__btn" id="dose-increase" aria-label="Aumenta dosi">+</button>
        </div>
      </div>

      <table class="ingredients-table" id="ingredients-table">
        ${rows}
      </table>
    </div>`;
}

// ── Sospensioni ──
function buildSuspensionsPanel(r) {
  const rows = r.suspensions.map(s => `
    <tr>
      <td>${escHtml(s.name)} ${s.note ? `<span class="ingredient-note">${escHtml(s.note)}</span>` : ''}</td>
      <td class="ingredient-qty">${s.grams != null ? `${s.grams}g` : ''}</td>
    </tr>
  `).join('');

  return `
    <div class="recipe-panel reveal" style="margin-top: 24px;">
      <h2 class="recipe-panel__title">
        <span class="recipe-panel__title-icon">🥜</span> Ingredienti Aggiuntivi / Sospensioni
      </h2>
      <table class="ingredients-table" id="suspensions-table">${rows}</table>
    </div>`;
}

// ── Steps (Procedimento) ──
function buildStepsPanel(r, key, setupId, label, isHandOnly = false) {
  const steps = r[key];
  if (!steps?.length) return '';

  // Se è hand-only, il pannello "mano" è il primario e deve essere visibile
  // Nasconde "mano" SOLO se ci sono altri setup (spirale/estrusore)
  const shouldHide = setupId === 'mano' && !isHandOnly;
  const isHidden = shouldHide ? ' style="display: none;"' : '';

  return `
    <div class="recipe-panel reveal reveal-delay-1" data-setup="${setupId}" id="steps-${setupId}"${isHidden}>
      <h2 class="recipe-panel__title">
        <span class="recipe-panel__title-icon">⚙️</span> Procedimento
        <span class="recipe-panel__title-badge">${label}</span>
      </h2>
      <ol class="steps-list">
        ${steps.map(s => `<li><strong>${escHtml(s.title)}</strong><p>${escHtml(s.text)}</p></li>`).join('')}
      </ol>
    </div>`;
}

// ── Tabella Farine ──
function buildFlourTable(r) {
  if (!r.flourTable?.length) return '';

  return `
    <div class="recipe-panel reveal" style="margin-top: 40px;">
      <h2 class="recipe-panel__title">
        <span class="recipe-panel__title-icon">🌾</span> Consigli Farine & Marchi
      </h2>
      <table class="flour-table">
        <thead><tr><th>Tipo Farina</th><th>Forza (W)</th><th>Marchi Consigliati</th></tr></thead>
        <tbody>
          ${r.flourTable.map(f => `
            <tr>
              <td>${escHtml(f.type)}</td>
              <td style="color: var(--color-accent); font-weight: 600;">${escHtml(f.w || '-')}</td>
              <td>${escHtml(f.brands || '')}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <div class="pro-tip-box" style="margin-top: 16px;">
        <p><strong>💡 PRO TIP:</strong> La forza (W) è il parametro chiave. Se non trovi i marchi suggeriti, cerca qualsiasi farina con il valore W indicato.</p>
      </div>
    </div>`;
}

// ── Alert ──
function buildAlert(r) {
  if (!r.alert) return '';
  return `
    <div class="alert alert--danger reveal" style="margin-top: 32px;">
      <span class="alert__icon">🚫</span>
      <div class="alert__content">
        <strong>ALERT PROFESSIONALE</strong>
        <p>⚠️ ${escHtml(r.alert)}</p>
      </div>
    </div>`;
}

// ── Cottura ──
function buildBaking(r) {
  if (!r.baking) return '';
  const b = r.baking;
  return `
    <div class="recipe-panel reveal" style="margin-top: 32px;">
      <h2 class="recipe-panel__title">
        <span class="recipe-panel__title-icon">🔥</span> Cottura
      </h2>
      <div class="tech-badges" style="margin-bottom: 16px;">
        ${b.temperature ? `<div class="tech-badge">🌡️ Temperatura: <span class="tech-badge__value">&nbsp;${escHtml(b.temperature)}</span></div>` : ''}
        ${b.time ? `<div class="tech-badge">⏱️ Tempo: <span class="tech-badge__value">&nbsp;${escHtml(b.time)}</span></div>` : ''}
      </div>
      ${b.tips?.length ? `<ul class="baking-tips" style="list-style: none; padding: 0;">
        ${b.tips.map(t => `<li style="padding: 6px 0; border-bottom: 1px solid var(--border-subtle);">💡 ${escHtml(t)}</li>`).join('')}
      </ul>` : ''}
    </div>`;
}

// ── Pro Tips ──
function buildProTips(r) {
  if (!r.proTips?.length) return '';
  return `
    <div class="recipe-panel reveal" style="margin-top: 32px;">
      <h2 class="recipe-panel__title">
        <span class="recipe-panel__title-icon">💡</span> Pro Tips
      </h2>
      <ul class="baking-tips" style="list-style: none; padding: 0;">
        ${r.proTips.map(t => `<li style="padding: 6px 0; border-bottom: 1px solid var(--border-subtle);">💡 ${escHtml(t)}</li>`).join('')}
      </ul>
    </div>`;
}

// ── Glossario ──
function buildGlossary(r) {
  if (!r.glossary?.length) return '';
  return `
    <div class="recipe-panel reveal" style="margin-top: 32px;">
      <h2 class="recipe-panel__title">
        <span class="recipe-panel__title-icon">📖</span> Glossario
      </h2>
      <dl class="glossary-list" style="margin: 0; padding: 0;">
        ${r.glossary.map(g => `
          <dt style="font-weight: 600; color: var(--color-text); margin-top: 12px;">${escHtml(g.term)}</dt>
          <dd style="margin: 4px 0 0 0; color: var(--color-text-secondary); font-size: 0.92rem;">${escHtml(g.definition)}</dd>
        `).join('')}
      </dl>
    </div>`;
}

// ═══════════════════════════════════════
//  INTERACTIVE FEATURES (post-render)
// ═══════════════════════════════════════

function initSetupToggle() {
  const setupBadge = document.getElementById('setup-badge');
  if (!setupBadge) return;

  const heroTag = document.getElementById('hero-setup-tag');
  const badgeValue = document.getElementById('setup-badge-value');
  const stepPanels = document.querySelectorAll('.recipe-panel[data-setup]');

  const SETUP_CONFIG = {
    spirale: { icon: '🔧', label: 'Impastatrice a spirale' },
    estrusore: { icon: '🔧', label: 'Estrusore con trafila' },
    mano: { icon: '🤲', label: 'A mano' },
  };

  const SETUPS = [];
  stepPanels.forEach(panel => {
    const id = panel.getAttribute('data-setup');
    if (SETUP_CONFIG[id]) SETUPS.push({ id, ...SETUP_CONFIG[id] });
  });

  if (SETUPS.length <= 1) {
    setupBadge.style.cursor = 'default';
    setupBadge.removeAttribute('role');
    setupBadge.removeAttribute('tabindex');
    return;
  }

  let currentIndex = 0;

  const activateSetup = (index) => {
    currentIndex = index;
    const config = SETUPS[index];

    stepPanels.forEach(panel => {
      if (panel.getAttribute('data-setup') === 'condimento') return;
      panel.style.display = panel.getAttribute('data-setup') === config.id ? '' : 'none';
    });

    if (heroTag) heroTag.textContent = `${config.icon} ${config.label}`;
    if (badgeValue) badgeValue.textContent = `\u00a0${config.label}`;

    document.querySelectorAll('.ingredient-note[data-setup-note-' + config.id + ']').forEach(el => {
      el.textContent = el.getAttribute('data-setup-note-' + config.id);
    });

    localStorage.setItem('recipe-setup', config.id);
  };

  setupBadge.addEventListener('click', () => activateSetup((currentIndex + 1) % SETUPS.length));
  setupBadge.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      activateSetup((currentIndex + 1) % SETUPS.length);
    }
  });

  const savedSetup = localStorage.getItem('recipe-setup');
  if (savedSetup) {
    const savedIndex = SETUPS.findIndex(s => s.id === savedSetup);
    if (savedIndex !== -1) activateSetup(savedIndex);
  }
}

function initDoseCalculator(recipe) {
  const doseBadge = document.getElementById('dose-badge');
  const doseDecrease = document.getElementById('dose-decrease');
  const doseIncrease = document.getElementById('dose-increase');

  if (!doseBadge || !doseDecrease || !doseIncrease) return;

  const STEP = 0.25;
  const MIN_MULT = 0.25;
  let multiplier = 1;

  // Mappa ingredienti → celle DOM (usa direttamente il JSON)
  const ingredientMap = [];

  const tables = ['ingredients-table', 'suspensions-table'];
  const modelLists = [recipe.ingredients || [], recipe.suspensions || []];

  tables.forEach((tableId, listIdx) => {
    const table = document.getElementById(tableId);
    if (!table) return;

    const rows = table.querySelectorAll('tr:not(.ingredient-section-header)');
    const modelList = modelLists[listIdx];
    let rowIdx = 0;

    for (const item of modelList) {
      if (item.grams == null) continue;
      if (rowIdx >= rows.length) break;

      const cell = rows[rowIdx]?.querySelector('.ingredient-qty');
      if (cell) ingredientMap.push({ baseGrams: item.grams, cell });
      rowIdx++;
    }
  });

  const formatGrams = (val) => {
    if (val === 0) return '0g';
    if (val >= 10) return `${Math.round(val)}g`;
    if (val >= 1) return `${Math.round(val * 10) / 10}g`;
    return `${Math.round(val * 100) / 100}g`;
  };

  const formatMultiplier = (m) => {
    if (Number.isInteger(m)) return `×${m}`;
    const rounded1 = Math.round(m * 10) / 10;
    if (Math.abs(m - rounded1) < 0.001) return `×${rounded1.toFixed(1)}`;
    return `×${m.toFixed(2)}`;
  };

  const updateDoses = () => {
    doseBadge.textContent = formatMultiplier(multiplier);
    doseBadge.classList.toggle('dose-calculator__display--modified', multiplier !== 1);
    doseDecrease.disabled = multiplier <= MIN_MULT;

    ingredientMap.forEach(({ baseGrams, cell }) => {
      cell.textContent = formatGrams(baseGrams * multiplier);
      cell.classList.remove('dose-updated');
      void cell.offsetWidth;
      cell.classList.add('dose-updated');
    });
  };

  doseDecrease.addEventListener('click', () => {
    const newMult = Math.round((multiplier - STEP) * 100) / 100;
    if (newMult >= MIN_MULT) { multiplier = newMult; updateDoses(); }
  });
  doseIncrease.addEventListener('click', () => {
    multiplier = Math.round((multiplier + STEP) * 100) / 100;
    updateDoses();
  });

  updateDoses();
}

// ── Utility ──
function escHtml(str) {
  if (!str) return '';
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
