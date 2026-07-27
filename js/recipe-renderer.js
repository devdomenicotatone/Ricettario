/* ============================================
   IL RICETTARIO — Recipe Renderer (2026)
   Renderizza una ricetta dal JSON nel DOM
   ============================================ */

import { BASE } from './router.js';
import { initMadeToggle } from './recipe-bookmarks.js';
import { fluentEmoji, refreshIcons } from './emoji.js';
import { escHtml } from './escape.js';
import { formatDoseInline } from './token-dosi.js';
// Il markup della pagina sta in html-ricetta.js, che è PURO e viene importato
// anche dal pre-rendering: qui restano solo il fetch, il montaggio e le
// funzionalità che hanno bisogno di un browser.
import { htmlRicetta } from './html-ricetta.js';

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
    document.title = `${recipe.title} — Ricettario Lab`;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', recipe.description || '');

    // ── Render ──
    app.innerHTML = htmlRicetta(recipe, { base: BASE, categoryDir: category, interattivo: true });

    // ── Init interactive features ──
    initDoseCalculator(recipe);
    initMadeToggle(recipe.slug);
    initSensoryChart(recipe);

    // Inizializza le icone Lucide per il nuovo DOM
    refreshIcons();

  } catch (err) {
    app.innerHTML = `
      <div class="container" style="padding: 120px 0; text-align: center;">
        <h2>${fluentEmoji('prohibited', 28)} Ricetta non trovata</h2>
        <p style="color: var(--color-text-muted);">${escHtml(err.message)}</p>
        <a href="${BASE}" data-link class="btn-back">${fluentEmoji('fire', 16)} Torna alla Home</a>
      </div>`;
  }
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
      cell.getAnimations().forEach(a => a.cancel());
      cell.classList.remove('dose-updated');
      requestAnimationFrame(() => cell.classList.add('dose-updated'));
    });

    // Aggiorna tutti i token inline nel procedimento (escluso i fissi)
    document.querySelectorAll('.dose-inline:not([data-fixed])').forEach(el => {
      const base = parseFloat(el.getAttribute('data-base'));
      if (!isNaN(base)) {
        el.textContent = formatDoseInline(base * multiplier);
        el.getAnimations().forEach(a => a.cancel());
        el.classList.remove('dose-updated');
        requestAnimationFrame(() => el.classList.add('dose-updated'));
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
// `escHtml` viveva qui, ed era una delle tre copie sparse nel progetto: ora
// arriva da `./escape.js`, che è l'unica. Stessa storia per i token dose:
// la grammatica e `formatDoseInline` stanno in `./token-dosi.js`, condivisi
// col pre-rendering.

/**
 * Inizializza il toggle del pannello sensoriale con Chart.js lazy-loaded.
 * Usa addEventListener (no onclick inline) e closure per i dati (no data-attributes JSON).
 */
/** Chart.js, caricato una volta sola e condiviso fra le ricette visitate. */
let ChartLib = null;

function initSensoryChart(recipe) {
  const header = document.getElementById('sensory-header');
  if (!header) return;

  const container = document.getElementById('sensory-chart-container');
  if (!container) return;

  // Il chevron si cerca al clic, non qui: subito dopo questa funzione gira
  // `refreshIcons()`, che sostituisce ogni `<i data-lucide>` con l'<svg>
  // corrispondente. Un riferimento preso adesso punterebbe a un elemento
  // staccato dal documento, e la freccia non ruoterebbe mai.
  const chevron = () => header.querySelector('.sensory-chevron');

  // I dati arrivano dalla ricetta stessa: il markup esce dal modulo puro
  // condiviso (html-ricetta.js), che non può registrare niente su window,
  // e questo init riceve direttamente il JSON — che è anche più semplice
  // del vecchio registro globale con l'id stampato nel markup.
  const assi = recipe.sensoryProfile?.axes;
  if (!assi?.length) return;
  const chartData = {
    labels: assi.map(a => a.label),
    values: assi.map(a => a.value),
  };

  let chartInstance = null;

  header.addEventListener('click', async () => {
    const isHidden = container.style.display === 'none' || !container.style.display;

    // `aria-expanded` è l'unico modo che ha chi ascolta di sapere se il
    // pannello è aperto: il chevron ruotato lo dice solo a chi guarda.
    header.setAttribute('aria-expanded', String(isHidden));

    if (isHidden) {
      container.style.display = 'block';
      chevron()?.style.setProperty('transform', 'rotate(180deg)');

      // Chart.js si carica solo qui, alla prima apertura del pannello.
      // L'import dinamico di un pacchetto locale finisce in un chunk separato:
      // resta pigro come prima, ma senza dipendere da un CDN a runtime.
      // Importando i singoli componenti invece del bundle "auto" si porta
      // dietro solo ciò che serve al radar.
      if (!ChartLib) {
        try {
          const { Chart, RadarController, RadialLinearScale, PointElement, LineElement, Filler, Tooltip } =
            await import('chart.js');
          Chart.register(RadarController, RadialLinearScale, PointElement, LineElement, Filler, Tooltip);
          ChartLib = Chart;
        } catch (err) {
          console.error('Errore caricamento Chart.js:', err);
          return;
        }
      }

      // Distruggi chart esistente se presente
      if (chartInstance) {
        chartInstance.destroy();
        chartInstance = null;
      }

      const ctx = document.getElementById('sensoryChart')?.getContext('2d');
      if (!ctx) return;

      const { labels, values } = chartData;

      // Spezza le label lunghe su più righe per i dispositivi mobili
      const isMobile = window.innerWidth < 600;
      const formattedLabels = labels.map(l => {
        if (isMobile && l.includes(' ')) return l.split(' ');
        return l;
      });

      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      const color = isDark ? 'rgba(212, 165, 116, 0.8)' : 'rgba(184, 129, 58, 0.8)';
      const bgColor = isDark ? 'rgba(212, 165, 116, 0.2)' : 'rgba(184, 129, 58, 0.2)';
      const gridColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
      const textColor = isDark ? '#94a3b8' : '#64748b';

      chartInstance = new ChartLib(ctx, {
        type: 'radar',
        data: {
          labels: formattedLabels,
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
          maintainAspectRatio: true,
          layout: { padding: isMobile ? 10 : 20 },
          scales: {
            r: {
              min: 0,
              max: 10,
              angleLines: { color: gridColor },
              grid: { color: gridColor },
              pointLabels: {
                color: textColor,
                font: { family: 'Inter', size: isMobile ? 10 : 12, weight: '500' }
              },
              ticks: { display: false, stepSize: 2 }
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
                label: (context) => context.formattedValue + ' / 10'
              }
            }
          }
        }
      });
    } else {
      container.style.display = 'none';
      chevron()?.style.setProperty('transform', 'rotate(0deg)');
    }
  });
}
