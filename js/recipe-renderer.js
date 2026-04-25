/* ============================================
   IL RICETTARIO — Recipe Renderer (2026)
   Renderizza una ricetta dal JSON nel DOM
   ============================================ */

import { BASE } from './router.js';
import { buildHeroPicture } from './image-utils.js';
import { initMadeToggle } from './recipe-bookmarks.js';
import { fluentEmoji, categoryEmoji, CATEGORY_FLUENT } from './emoji.js';

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
    initDoseCalculator(recipe);
    initMadeToggle(recipe.slug);
    
    // Inizializza le icone Lucide per il nuovo DOM
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

  } catch (err) {
    app.innerHTML = `
      <div class="container" style="padding: 120px 0; text-align: center;">
        <h2>${fluentEmoji('prohibited', 28)} Ricetta non trovata</h2>
        <p style="color: var(--color-text-muted);">${err.message}</p>
        <a href="${BASE}" data-link class="btn-back">${fluentEmoji('fire', 16)} Torna alla Home</a>
      </div>`;
  }
}

// ═══════════════════════════════════════
//  HTML BUILDER — Genera tutto il markup
// ═══════════════════════════════════════

function buildRecipeHTML(r, categoryDir) {
  const catEmoji = categoryEmoji(r.category, 22);
  const imagePath = r.image
    ? `${BASE}${r.image.replace(/^\//, '')}`
    : `${BASE}images/ricette/${categoryDir}/${r.slug}.jpg`;

  const isValidBadge = (v) => v && String(v).trim() !== '' && !['n/a', 'nessuna', '0'].includes(String(v).trim().toLowerCase());

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
        ${isValidBadge(r.hydration) ? `<div class="tech-badge">${fluentEmoji('droplet', 18)} Idratazione: <span class="tech-badge__value">&nbsp;${r.hydration}%</span></div>` : ''}
        ${isValidBadge(r.targetTemp) ? `<div class="tech-badge">${fluentEmoji('thermometer', 18)} Target Temp: <span class="tech-badge__value">&nbsp;${r.targetTemp}</span></div>` : ''}
        ${isValidBadge(r.fermentation) ? `<div class="tech-badge">${fluentEmoji('stopwatch', 18)} Lievitazione: <span class="tech-badge__value">&nbsp;${r.fermentation}</span></div>` : ''}
        <button class="made-toggle" id="made-toggle" type="button" aria-label="Segna come fatta"></button>
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
            ${buildStepsPanel(r)}
            ${buildCondimentPanel(r)}
          </div>

        </div>

        ${buildSensoryProfile(r)}
        ${buildFlourTable(r)}
        ${buildAlert(r)}
        ${buildBaking(r)}
        ${buildProTips(r)}
        ${buildStorage(r)}
        ${buildGlossary(r)}
      </div>
    </section>
  `;
}



// ── Ingredienti (con supporto gruppi) ──
function buildIngredientRow(ing) {
  const excludeAttr = ing.excludeFromTotal ? ' data-exclude-total="true"' : '';

  return `<tr${excludeAttr}>
    <td>${escHtml(ing.name)} ${ing.note ? `<span class="ingredient-note">${escHtml(ing.note)}</span>` : ''}</td>
    <td class="ingredient-qty">${ing.grams != null ? `${ing.grams}g` : ''}</td>
  </tr>`;
}

function buildIngredientsPanel(r) {
  const hasGroups = r.ingredientGroups?.length > 0;
  const hasFlat = r.ingredients?.length > 0;
  if (!hasGroups && !hasFlat) return '';

  let rows;
  if (hasGroups) {
    rows = r.ingredientGroups.map(group => {
      if (!group.items?.length) return ''; // skip gruppi malformati
      const header = `<tr class="ingredient-section-header"><td colspan="2">${escHtml(group.group || 'Ingredienti')}</td></tr>`;
      const items = group.items.map(buildIngredientRow).join('');
      return header + items;
    }).join('');
  } else {
    rows = r.ingredients.map(buildIngredientRow).join('');
  }

  return `
    <div class="recipe-panel reveal">
      <h2 class="recipe-panel__title">
        <span class="recipe-panel__title-icon">${fluentEmoji('shopping-cart', 24)}</span> Ingredienti Base
      </h2>

      <div class="dose-calculator" id="dose-calculator">
        <div class="dose-calculator__label">
          <span class="dose-calculator__label-icon">${fluentEmoji('balance-scale', 18)}</span> Dosi
        </div>
        <div class="dose-calculator__controls">
          <button class="dose-calculator__btn" id="dose-decrease" aria-label="Diminuisci dosi">−</button>
          <div class="dose-calculator__display" id="dose-badge">×1</div>
          <button class="dose-calculator__btn" id="dose-increase" aria-label="Aumenta dosi">+</button>
        </div>
      </div>

      <table class="ingredients-table" id="ingredients-table">
        ${rows}
        <tr class="ingredient-total-row" id="ingredient-total-row">
          <td>Peso Totale Impasto</td>
          <td class="ingredient-qty" id="ingredient-total-qty"></td>
        </tr>
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
        <span class="recipe-panel__title-icon">${fluentEmoji('peanuts', 24)}</span> Ingredienti Aggiuntivi / Sospensioni
      </h2>
      <table class="ingredients-table" id="suspensions-table">${rows}</table>
    </div>`;
}

// ── Steps (Procedimento) ──
function buildStepsPanel(r) {
  const steps = r.steps;
  if (!steps?.length) return '';

  return `
    <div class="recipe-panel reveal reveal-delay-1" id="steps-panel">
      <h2 class="recipe-panel__title">
        <span class="recipe-panel__title-icon">${fluentEmoji('gear', 24)}</span> Procedimento
      </h2>
      <ol class="steps-list">
        ${steps.map((s, i) => `<li class="step-item">
            <strong>${escHtml(s.title)}</strong>
            <p>${resolveTokens(escHtml(s.text))}</p>
          </li>`).join('')}
      </ol>
    </div>`;
}

// ── Condimento ──
function buildCondimentPanel(r) {
  const steps = r.stepsCondiment;
  if (!steps?.length) return '';

  return `
    <div class="recipe-panel reveal reveal-delay-2" id="steps-condimento" style="margin-top: 32px;">
      <h2 class="recipe-panel__title">
        <span class="recipe-panel__title-icon">${fluentEmoji('tomato', 24)}</span> Preparazione Condimento
      </h2>
      <ol class="steps-list">
        ${steps.map((s, i) => `<li class="step-item">
            <strong>${escHtml(s.title)}</strong>
            <p>${resolveTokens(escHtml(s.text))}</p>
          </li>`).join('')}
      </ol>
    </div>`;
}

// ── Profilo Sensoriale (Chart.js) ──
function buildSensoryProfile(r) {
  if (!r.sensoryProfile || !r.sensoryProfile.axes || r.sensoryProfile.axes.length === 0) return '';
  
  const labels = r.sensoryProfile.axes.map(a => a.label);
  const values = r.sensoryProfile.axes.map(a => a.value);
  
  // Trova il tratto dominante
  const dominant = r.sensoryProfile.axes.reduce((prev, curr) => (curr.value > prev.value) ? curr : prev, r.sensoryProfile.axes[0]);
  
  const summaryHtml = r.sensoryProfile.summary ? `
    <div style="margin-top: 24px; padding: 16px; background: var(--bg-elevated); border-radius: 8px; border-left: 4px solid var(--accent);">
      <h4 style="margin: 0 0 8px 0; font-size: 14px; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.5px;">Note di Degustazione</h4>
      <p style="margin: 0; font-family: 'Playfair Display', serif; font-style: italic; font-size: 16px; line-height: 1.6; color: var(--text-primary);">
        "${escHtml(r.sensoryProfile.summary)}"
      </p>
    </div>
  ` : '';

  return `
    <div class="recipe-panel sensory-panel reveal" style="margin-top: 40px;">
      <h2 class="recipe-panel__title" style="cursor:pointer; display:flex; justify-content:space-between; align-items:center;" 
          data-labels="${escHtml(JSON.stringify(labels))}" 
          data-values="${escHtml(JSON.stringify(values))}" 
          onclick="toggleSensoryChart(this)">
        <span><span class="recipe-panel__title-icon">${fluentEmoji('star', 24)}</span> Profilo Sensoriale</span>
        <i data-lucide="chevron-down" class="sensory-chevron" style="transition: transform 0.3s;"></i>
      </h2>
      <div class="sensory-chart-container" style="display:none; position:relative; width:100%; max-width:600px; margin: 16px auto 0; padding: 32px 24px; background: var(--bg-elevated); border: 1px solid rgba(212, 165, 116, 0.2); border-radius: 16px; box-shadow: 0 10px 40px rgba(0,0,0,0.03);">
        
        <div style="text-align: center; margin-bottom: 16px;">
          <span style="display: inline-block; padding: 6px 12px; background: rgba(212, 165, 116, 0.15); border: 1px solid rgba(212, 165, 116, 0.4); border-radius: 20px; font-size: 13px; font-weight: 600; color: var(--accent);">
            👑 Tratto Dominante: ${escHtml(dominant.label)} (${dominant.value}/10)
          </span>
        </div>

        <div style="position:relative; width:100%; max-width:450px; margin: 0 auto;">
          <canvas id="sensoryChart"></canvas>
        </div>

        ${summaryHtml}

      </div>
    </div>
  `;
}

// ── Tabella Farine ──
function buildFlourTable(r) {
  if (!r.flourTable?.length) return '';

  return `
    <div class="recipe-panel reveal" style="margin-top: 40px;">
      <h2 class="recipe-panel__title">
        <span class="recipe-panel__title-icon">${fluentEmoji('flatbread', 24)}</span> Consigli Farine & Marchi
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
        <p><strong>${fluentEmoji('light-bulb', 18)} PRO TIP:</strong> La forza (W) è il parametro chiave. Se non trovi i marchi suggeriti, cerca qualsiasi farina con il valore W indicato.</p>
      </div>
    </div>`;
}

// ── Alert ──
function buildAlert(r) {
  if (!r.alert) return '';
  return `
    <div class="alert alert--danger reveal" style="margin-top: 32px;">
      <span class="alert__icon">${fluentEmoji('prohibited', 28)}</span>
      <div class="alert__content">
        <strong>ALERT PROFESSIONALE</strong>
        <p>${fluentEmoji('warning', 18)} ${escHtml(r.alert)}</p>
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
        <span class="recipe-panel__title-icon">${fluentEmoji('fire', 24)}</span> Cottura
      </h2>
      <div class="tech-badges" style="margin-bottom: 16px;">
        ${b.temperature ? `<div class="tech-badge">${fluentEmoji('thermometer', 18)} Temperatura: <span class="tech-badge__value">&nbsp;${escHtml(b.temperature)}</span></div>` : ''}
        ${b.time ? `<div class="tech-badge">${fluentEmoji('stopwatch', 18)} Tempo: <span class="tech-badge__value">&nbsp;${escHtml(b.time)}</span></div>` : ''}
      </div>
      ${b.tips?.length ? `<ul class="baking-tips" style="list-style: none; padding: 0;">
        ${b.tips.map(t => `<li style="padding: 6px 0; border-bottom: 1px solid var(--border-subtle);">${fluentEmoji('light-bulb', 16)} ${escHtml(t)}</li>`).join('')}
      </ul>` : ''}
    </div>`;
}

// ── Pro Tips ──
function buildProTips(r) {
  if (!r.proTips?.length) return '';
  return `
    <div class="recipe-panel reveal" style="margin-top: 32px;">
      <h2 class="recipe-panel__title">
        <span class="recipe-panel__title-icon">${fluentEmoji('light-bulb', 24)}</span> Pro Tips
      </h2>
      <ul class="baking-tips" style="list-style: none; padding: 0;">
        ${r.proTips.map(t => `<li style="padding: 6px 0; border-bottom: 1px solid var(--border-subtle);">${fluentEmoji('light-bulb', 16)} ${escHtml(t)}</li>`).join('')}
      </ul>
    </div>`;
}

// ── Conservazione ──
function buildStorage(r) {
  if (!r.storage?.length) return '';
  return `
    <div class="recipe-panel reveal" style="margin-top: 32px;">
      <h2 class="recipe-panel__title">
        <span class="recipe-panel__title-icon">${fluentEmoji('package', 24)}</span> Conservazione
      </h2>
      <ul class="baking-tips" style="list-style: none; padding: 0;">
        ${r.storage.map(t => `<li style="padding: 6px 0; border-bottom: 1px solid var(--border-subtle);">${fluentEmoji('package', 16)} ${escHtml(t)}</li>`).join('')}
      </ul>
    </div>`;
}

// ── Glossario ──
function buildGlossary(r) {
  if (!r.glossary?.length) return '';
  return `
    <div class="recipe-panel reveal" style="margin-top: 32px;">
      <h2 class="recipe-panel__title">
        <span class="recipe-panel__title-icon">${fluentEmoji('open-book', 24)}</span> Glossario
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

  // Costruisci lista ingredienti piatta (supporta ingredientGroups o ingredients)
  const flatIngredients = recipe.ingredientGroups?.length
    ? recipe.ingredientGroups.flatMap(g => g.items || [])
    : (recipe.ingredients || []);

  const tables = ['ingredients-table', 'suspensions-table'];
  const modelLists = [flatIngredients, recipe.suspensions || []];

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

    // Aggiorna tabella ingredienti (usa data-base se presente, altrimenti baseGrams statico)
    ingredientMap.forEach(({ baseGrams, cell }) => {
      const dataBaseAttr = cell.getAttribute('data-base');
      const dynamicBase = dataBaseAttr !== null ? parseFloat(dataBaseAttr) : baseGrams;
      cell.textContent = formatGrams(dynamicBase * multiplier);
      cell.classList.remove('dose-updated');
      void cell.offsetWidth;
      cell.classList.add('dose-updated');
    });

    // Aggiorna tutti i token inline nel procedimento (escluso i fissi)
    document.querySelectorAll('.dose-inline:not([data-fixed])').forEach(el => {
      const base = parseFloat(el.getAttribute('data-base'));
      if (!isNaN(base)) {
        el.textContent = formatDoseInline(base * multiplier);
        el.classList.remove('dose-updated');
        void el.offsetWidth;
        el.classList.add('dose-updated');
      }
    });

    // Aggiorna il totale impasto
    updateTotalWeight();
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

/**
 * Ricalcola il peso totale sommando tutte le celle .ingredient-qty visibili
 */
function updateTotalWeight() {
  const totalCell = document.getElementById('ingredient-total-qty');
  if (!totalCell) return;

  let total = 0;
  const table = document.getElementById('ingredients-table');
  if (!table) return;

  table.querySelectorAll('tr:not(.ingredient-section-header):not(.ingredient-total-row):not([data-exclude-total]) .ingredient-qty').forEach(cell => {
    const text = cell.textContent.trim();
    const val = parseFloat(text);
    if (!isNaN(val)) total += val;
  });

  // Formatta il totale
  const formatted = total >= 1000
    ? `~${(total / 1000).toFixed(1)}kg`
    : `${Math.round(total)}g`;
  totalCell.textContent = formatted;
  totalCell.classList.remove('dose-updated');
  void totalCell.offsetWidth;
  totalCell.classList.add('dose-updated');
}



// ── Utility ──
function escHtml(str) {
  if (!str) return '';
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/**
 * Risolve i token {id:base} nel testo degli step.
 * Sostituisce {token_name:123} con <span class="dose-inline" data-base="123" data-token-id="token_name">123</span>
 */
function resolveTokens(text) {
  return text.replace(/\{([a-z_]+):(\d+\.?\d*)(!)?\}/g, (match, tokenId, baseValue, fixedFlag) => {
    const num = parseFloat(baseValue);
    const formatted = formatDoseInline(num);
    const fixedAttr = fixedFlag ? ' data-fixed="true"' : '';
    return `<span class="dose-inline" data-base="${num}" data-token-id="${tokenId}"${fixedAttr}>${formatted}</span>`;
  });
}

function formatDoseInline(val) {
  if (val === 0) return '0';
  if (val >= 10) return `${Math.round(val)}`;
  if (val >= 1) return `${Math.round(val * 10) / 10}`;
  return `${Math.round(val * 100) / 100}`;
}

window.toggleSensoryChart = function(headerEl) {
    const container = headerEl.nextElementSibling;
    const chevron = headerEl.querySelector('.sensory-chevron');
    
    if (container.style.display === 'none') {
        container.style.display = 'block';
        chevron.style.transform = 'rotate(180deg)';
        
        // Init chart if not already
        if (window.Chart) {
            let existingChart = Chart.getChart("sensoryChart");
            if (existingChart) {
                existingChart.destroy();
            }
            const labelsStr = headerEl.getAttribute('data-labels');
            const valuesStr = headerEl.getAttribute('data-values');
            const ctx = document.getElementById('sensoryChart').getContext('2d');
            const labels = JSON.parse(labelsStr.replace(/&quot;/g, '"'));
            const values = JSON.parse(valuesStr.replace(/&quot;/g, '"'));
                
                const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
                const color = isDark ? 'rgba(212, 165, 116, 0.8)' : 'rgba(184, 129, 58, 0.8)'; // Brand color
                const bgColor = isDark ? 'rgba(212, 165, 116, 0.2)' : 'rgba(184, 129, 58, 0.2)';
                const gridColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
                const textColor = isDark ? '#94a3b8' : '#64748b';

                new Chart(ctx, {
                    type: 'radar',
                    data: {
                        labels: labels,
                        datasets: [{
                            label: 'Valore',
                            data: values,
                            backgroundColor: bgColor,
                            borderColor: color,
                            pointBackgroundColor: color,
                            pointBorderColor: '#fff',
                            pointHoverBackgroundColor: '#fff',
                            pointHoverBorderColor: color,
                            borderWidth: 2,
                        }]
                    },
                    options: {
                        responsive: true,
                        scales: {
                            r: {
                                min: 0,
                                max: 10,
                                angleLines: { color: gridColor },
                                grid: { color: gridColor },
                                pointLabels: {
                                    color: textColor,
                                    font: { family: 'Inter', size: 12, weight: '500' }
                                },
                                ticks: {
                                    display: false, // Nasconde i numeri sull'asse
                                    stepSize: 2
                                }
                            }
                        },
                        plugins: {
                            legend: { display: false },
                            tooltip: {
                                backgroundColor: isDark ? '#1e293b' : '#fff',
                                titleColor: isDark ? '#f8fafc' : '#0f172a',
                                bodyColor: isDark ? '#cbd5e1' : '#475569',
                                borderColor: isDark ? '#334155' : '#e2e8f0',
                                borderWidth: 1,
                                padding: 10,
                                displayColors: false,
                                callbacks: {
                                    label: function(context) {
                                        return context.formattedValue + ' / 10';
                                    }
                                }
                            }
                        }
                    }
                });
        }
    } else {
        container.style.display = 'none';
        chevron.style.transform = 'rotate(0deg)';
    }
};
