/* ============================================
   IL RICETTARIO — Markup della pagina ricetta
   PURO: condiviso fra SPA e pre-rendering
   ============================================ */

/**
 * L'unica fonte del markup di una pagina ricetta.
 *
 * PERCHÉ STA QUI E NON IN DUE POSTI
 * La SPA aveva il suo builder (`buildRecipeHTML` in recipe-renderer.js) e il
 * pre-rendering un altro scritto a mano (`prerenderRecipe` in generate-og.js),
 * ed erano GIÀ divergenti in produzione: la versione statica non aveva Pro
 * Tips, Conservazione, Glossario, sospensioni, tabella farine né condimento —
 * un crawler leggeva una ricetta amputata, un lettore con JS una completa.
 * È lo stesso difetto già risolto per il calcolatore con html-piano.js, e la
 * soluzione è la stessa: una funzione sola, importata da tutte e due le
 * strade.
 *
 * Come html-piano.js, questo modulo NON può toccare DOM, `window`,
 * `localStorage` o `import.meta`, e i dati gli arrivano come argomento: lo
 * importa anche Node dentro scripts/generate-og.js. La `base` arriva
 * anch'essa da fuori, perché il router (che la conosce) legge
 * `import.meta.env` e da Node non si può importare.
 *
 * `interattivo: false` è la modalità del pre-rendering: si omettono SOLO i
 * controlli che senza JavaScript non avrebbero nessuno ad ascoltarli — il
 * calcolatore dosi, il pulsante «Fatta», il canvas e il toggle del pannello
 * sensoriale — e i token dose diventano numeri semplici invece di <span>
 * aggiornabili. I CONTENUTI invece ci sono tutti: profilo sensoriale, note e
 * valori nutrizionali escono come markup piatto visibile, perché il JSON-LD
 * NutritionInformation deve corrispondere a contenuto che il crawler vede.
 */

import { escHtml, escAttr } from './escape.js';
import { risolviTokenSpan, risolviTokenTesto } from './token-dosi.js';
import { htmlCreditoFoto } from './credito-foto.js';
import { isValidBadge } from './recipe-meta.js';
import { buildHeroPicture } from './image-utils.js';
import { fluentEmojiCon, categoryEmojiCon } from './emoji-core.js';

/**
 * Le classi `reveal` partono a `opacity: 0` e diventano visibili solo quando
 * l'IntersectionObserver della SPA aggiunge `.visible`: in una pagina statica
 * senza JavaScript sarebbero contenuto invisibile. La vecchia copia a mano del
 * pre-rendering le ometteva per questo motivo; il builder unico le toglie a
 * valle, così il markup resta scritto una volta sola.
 */
function senzaReveal(html) {
  return html.replace(/class="([^"]*)"/g, (m, classi) => {
    const pulite = classi.split(/\s+/)
      .filter(c => c && c !== 'reveal' && !/^reveal-delay-\d$/.test(c));
    return `class="${pulite.join(' ')}"`;
  });
}

export function htmlRicetta(r, { base, categoryDir, interattivo = true }) {
  const ctx = {
    base,
    interattivo,
    emoji: (nome, size) => fluentEmojiCon(base, nome, size),
    // Nel testo degli step i token diventano <span> per il calcolatore dosi
    // nella SPA, e il numero nudo nella pagina statica. Stessa formattazione
    // (token-dosi.js): il testo visibile è identico da tutte e due le parti,
    // ed è la condizione perché il confronto col JSON-LD in verifica-build
    // non bocci build sane.
    testoStep: (t) => interattivo
      ? risolviTokenSpan(escHtml(t))
      : escHtml(risolviTokenTesto(t)),
  };

  const catEmoji = categoryEmojiCon(base, r.category, 22);
  const imagePath = r.image
    ? `${base}${String(r.image).replace(/^\//, '')}`
    : `${base}images/ricette/${categoryDir}/${r.slug}.webp`;

  // Il credito della foto esce dallo stesso modulo puro che usa il
  // pre-rendering (js/credito-foto.js): è un obbligo di licenza, non può
  // comparire solo su una delle due strade.
  const credito = htmlCreditoFoto(r.imageAttribution, r._originalImageUrl);

  // `data-ricetta` marca il markup con l'identità «categoria/slug». Serve al
  // primo caricamento delle pagine pre-renderizzate: recipe-renderer.js lo
  // legge per riconoscere che dentro #app c'è già QUESTA ricetta e lasciare
  // la versione statica al suo posto mentre scarica il JSON, invece di
  // buttarla per lo spinner.
  const pagina = `
    <!-- ═══════════ RECIPE HERO ═══════════ -->
    ${credito ? '<figure class="recipe-foto">' : ''}
    <div class="recipe-hero" data-ricetta="${escAttr(categoryDir)}/${escAttr(r.slug)}">
      ${buildHeroPicture(imagePath, r.title)}
      <div class="container">
        <nav class="breadcrumb reveal">
          <a href="${base}" data-link>Home</a>
          <span class="breadcrumb__separator">›</span>
          <a href="${base}#ricette" data-link>Ricette</a>
          <span class="breadcrumb__separator">›</span>
          <a href="${escAttr(base)}ricette/${escAttr(categoryDir)}/" data-link>${escHtml(r.category)}</a>
          <span class="breadcrumb__separator">›</span>
          <span>${escHtml(r.title)}</span>
        </nav>

        <div class="recipe-hero__content">
          <div class="recipe-hero__tags reveal">
            <span class="tag tag--category">${catEmoji} ${escHtml(r.category)}</span>
          </div>
          <h1 class="recipe-hero__title reveal reveal-delay-1">${escHtml(r.title)}</h1>
          <p class="recipe-hero__subtitle reveal reveal-delay-2">${escHtml(r.subtitle || r.description)}</p>
        </div>
      </div>
    </div>
    ${credito ? `<figcaption class="recipe-foto__credito"><div class="container">${credito}</div></figcaption></figure>` : ''}

    <!-- ═══════════ TECH BADGES ═══════════ -->
    <div class="container" style="padding-top: 40px;">
      <div class="tech-badges reveal">
        ${isValidBadge(r.hydration) ? `<div class="tech-badge">${ctx.emoji('droplet', 18)} Idratazione: <span class="tech-badge__value">&nbsp;${escHtml(r.hydration)}%</span></div>` : ''}
        ${isValidBadge(r.targetTemp) ? `<div class="tech-badge">${ctx.emoji('thermometer', 18)} Target Temp: <span class="tech-badge__value">&nbsp;${escHtml(r.targetTemp)}</span></div>` : ''}
        ${isValidBadge(r.fermentation) ? `<div class="tech-badge">${ctx.emoji('stopwatch', 18)} Lievitazione: <span class="tech-badge__value">&nbsp;${escHtml(r.fermentation)}</span></div>` : ''}
        ${interattivo ? '<button class="made-toggle" id="made-toggle" type="button" aria-pressed="false"></button>' : ''}
      </div>
    </div>

    <!-- ═══════════ RECIPE CONTENT ═══════════ -->
    <section class="recipe-content" id="recipe-content">
      <div class="container">
        <div class="recipe-layout">

          <!-- COLONNA SX: Ingredienti -->
          <div>
            ${buildIngredientsPanel(r, ctx)}
            ${r.suspensions?.length ? buildSuspensionsPanel(r, ctx) : ''}
          </div>

          <!-- COLONNA DX: Procedimento -->
          <div>
            ${buildStepsPanel(r, ctx)}
            ${buildCondimentPanel(r, ctx)}
          </div>

        </div>

        ${buildSensoryProfile(r, ctx)}
        ${buildFlourTable(r, ctx)}
        ${buildAlert(r, ctx)}
        ${buildBaking(r, ctx)}
        ${buildProTips(r, ctx)}
        ${buildStorage(r, ctx)}
        ${buildGlossary(r, ctx)}
      </div>
    </section>
  `;

  return interattivo ? pagina : senzaReveal(pagina);
}

// ── Ingredienti (con supporto gruppi) ──
/**
 * Il nome dell'ingrediente è un `<th scope="row">`, non un `<td>`: è
 * l'intestazione della riga, e senza di essa chi naviga la tabella con un
 * lettore di schermo sente «1000g» senza sapere di che cosa. Con lo `scope` la
 * quantità viene annunciata insieme all'ingrediente a cui appartiene.
 */
function buildIngredientRow(ing) {
  const excludeAttr = ing.excludeFromTotal ? ' data-exclude-total="true"' : '';

  return `<tr${excludeAttr}>
    <th scope="row">${escHtml(ing.name)} ${ing.note ? `<span class="ingredient-note">${escHtml(ing.note)}</span>` : ''}</th>
    <td class="ingredient-qty">${ing.grams != null ? `${escHtml(ing.grams)}g` : ''}</td>
  </tr>`;
}

/** La stessa formattazione del totale che usa il calcolatore dosi della SPA. */
function pesoTotale(r) {
  const flat = r.ingredientGroups?.length
    ? r.ingredientGroups.flatMap(g => g.items || [])
    : (r.ingredients || []);
  const totale = flat
    .filter(i => i && !i.excludeFromTotal && typeof i.grams === 'number')
    .reduce((t, i) => t + i.grams, 0);
  if (totale <= 0) return '';
  return totale >= 1000 ? `~${(totale / 1000).toFixed(1)}kg` : `${Math.round(totale)}g`;
}

/**
 * «Impasto» solo quando l'idratazione è vera: per convenzione (README)
 * hydration 0 o assente marca ciò che impasto non è — salse, conserve,
 * condimenti — e il burro chiarificato non deve stampare «Peso Totale
 * Impasto». Stessa guardia del badge Idratazione, così tabella e badge
 * raccontano la stessa storia; il JSON-LD (totalWeight in generate-og.js)
 * segue la stessa regola.
 */
function etichettaPesoTotale(r) {
  return isValidBadge(r.hydration) ? 'Peso Totale Impasto' : 'Peso Totale';
}

function buildIngredientsPanel(r, ctx) {
  const hasGroups = r.ingredientGroups?.length > 0;
  const hasFlat = r.ingredients?.length > 0;
  if (!hasGroups && !hasFlat) return '';

  let rows;
  if (hasGroups) {
    rows = r.ingredientGroups.map(group => {
      if (!group.items?.length) return ''; // skip gruppi malformati
      const header = `<tr class="ingredient-section-header"><th colspan="2" scope="colgroup">${escHtml(group.group || 'Ingredienti')}</th></tr>`;
      const items = group.items.map(buildIngredientRow).join('');
      return header + items;
    }).join('');
  } else {
    rows = r.ingredients.map(buildIngredientRow).join('');
  }

  // Il calcolatore dosi ha senso solo con JavaScript: nella pagina statica i
  // suoi pulsanti non avrebbero nessuno ad ascoltarli (stessa scelta del
  // «Cambia i parametri» dei piani di cottura). Il peso totale invece nella
  // SPA lo scrive updateTotalWeight al primo giro, e nella statica va scritto
  // qui, o la riga resterebbe vuota.
  const calcolatore = ctx.interattivo ? `
      <div class="dose-calculator" id="dose-calculator">
        <div class="dose-calculator__label">
          <span class="dose-calculator__label-icon">${ctx.emoji('balance-scale', 18)}</span> Dosi
        </div>
        <div class="dose-calculator__controls">
          <button class="dose-calculator__btn" id="dose-decrease" aria-label="Diminuisci dosi">−</button>
          <div class="dose-calculator__display" id="dose-badge">×1</div>
          <button class="dose-calculator__btn" id="dose-increase" aria-label="Aumenta dosi">+</button>
        </div>
      </div>` : '';

  return `
    <div class="recipe-panel reveal">
      <h2 class="recipe-panel__title">
        <span class="recipe-panel__title-icon">${ctx.emoji('shopping-cart', 24)}</span> Ingredienti Base
      </h2>
      ${calcolatore}
      <table class="ingredients-table" id="ingredients-table" aria-label="Ingredienti e quantità">
        ${rows}
        <tr class="ingredient-total-row" id="ingredient-total-row">
          <th scope="row">${etichettaPesoTotale(r)}</th>
          <td class="ingredient-qty" id="ingredient-total-qty">${ctx.interattivo ? '' : pesoTotale(r)}</td>
        </tr>
      </table>
    </div>`;
}

// ── Sospensioni ──
function buildSuspensionsPanel(r, ctx) {
  const rows = r.suspensions.map(s => `
    <tr>
      <th scope="row">${escHtml(s.name)} ${s.note ? `<span class="ingredient-note">${escHtml(s.note)}</span>` : ''}</th>
      <td class="ingredient-qty">${s.grams != null ? `${escHtml(s.grams)}g` : ''}</td>
    </tr>
  `).join('');

  return `
    <div class="recipe-panel reveal" style="margin-top: 24px;">
      <h2 class="recipe-panel__title">
        <span class="recipe-panel__title-icon">${ctx.emoji('peanuts', 24)}</span> Ingredienti Aggiuntivi / Sospensioni
      </h2>
      <table class="ingredients-table" id="suspensions-table" aria-label="Ingredienti aggiuntivi e quantità">${rows}</table>
    </div>`;
}

// ── Steps (Procedimento) ──
function buildStepsPanel(r, ctx) {
  const steps = r.steps;
  if (!steps?.length) return '';

  return `
    <div class="recipe-panel reveal reveal-delay-1" id="steps-panel">
      <h2 class="recipe-panel__title">
        <span class="recipe-panel__title-icon">${ctx.emoji('gear', 24)}</span> Procedimento
      </h2>
      <ol class="steps-list">
        ${steps.map(s => `<li class="step-item">
            <strong>${escHtml(s.title)}</strong>
            <p>${ctx.testoStep(s.text)}</p>
          </li>`).join('')}
      </ol>
    </div>`;
}

// ── Condimento ──
function buildCondimentPanel(r, ctx) {
  const steps = r.stepsCondiment;
  if (!steps?.length) return '';

  return `
    <div class="recipe-panel reveal reveal-delay-2" id="steps-condimento" style="margin-top: 32px;">
      <h2 class="recipe-panel__title">
        <span class="recipe-panel__title-icon">${ctx.emoji('tomato', 24)}</span> Preparazione Condimento
      </h2>
      <ol class="steps-list">
        ${steps.map(s => `<li class="step-item">
            <strong>${escHtml(s.title)}</strong>
            <p>${ctx.testoStep(s.text)}</p>
          </li>`).join('')}
      </ol>
    </div>`;
}

// ── Dati Tecnici & Sensoriali ──
// Due rese dagli stessi dati. Nella SPA è un pannello a scomparsa con il
// radar su <canvas> (i dati del grafico li riceve initSensoryChart
// direttamente dalla ricetta: nessun registro su window). Nella pagina
// statica il pannello a scomparsa sarebbe un bottone muto e un riquadro
// vuoto, ma OMETTERLO — come faceva la prima versione — lasciava il JSON-LD
// NutritionInformation senza nessun contenuto nutrizionale visibile, cioè la
// violazione che CLAUDE.md vieta: quindi la modalità statica rende gli stessi
// dati come contenuto piatto — tabella sensoriale visibile, note, valori
// nutrizionali — senza canvas, senza toggle.
function buildSensoryProfile(r, ctx) {
  if (!r.sensoryProfile || !r.sensoryProfile.axes || r.sensoryProfile.axes.length === 0) return '';

  // Trova il tratto dominante
  const dominant = r.sensoryProfile.axes.reduce((prev, curr) => (curr.value > prev.value) ? curr : prev, r.sensoryProfile.axes[0]);

  const summaryHtml = r.sensoryProfile.summary ? `
    <div class="sensory-note">
      <h3 class="sensory-note__title">Note di Degustazione</h3>
      <p class="sensory-note__text">"${escHtml(r.sensoryProfile.summary)}"</p>
    </div>
  ` : '';

  let nutritionHtml = '';
  if (r.nutrition && r.nutrition.macros) {
      // `Number(...)` non è cosmesi: questi valori arrivano dal JSON e finiscono
      // sia nell'aritmetica delle percentuali sia dentro l'HTML. Forzarli a
      // numero li rende innocui in entrambi i posti, e un valore non numerico
      // diventa 0 invece di NaN nella barra.
      const carbs = Number(r.nutrition.macros.carbs) || 0;
      const prot = Number(r.nutrition.macros.protein) || 0;
      const fat = Number(r.nutrition.macros.fat) || 0;
      const total = carbs + prot + fat;
      const pctCarbs = total > 0 ? (carbs / total) * 100 : 0;
      const pctProt = total > 0 ? (prot / total) * 100 : 0;
      const pctFat = total > 0 ? (fat / total) * 100 : 0;

      const nutritionContent = `
        <div class="nutrition-content">
          <div class="nutrition-kcal">
              <span class="nutrition-kcal__value">${escHtml(r.nutrition.kcal_per_100g)}</span>
              <span class="nutrition-kcal__unit">Kcal</span>
          </div>

          <div class="nutrition-bar">
            <div class="nutrition-bar__segment nutrition-bar__segment--carbs" style="width: ${pctCarbs}%;" title="Carboidrati"></div>
            <div class="nutrition-bar__segment nutrition-bar__segment--prot" style="width: ${pctProt}%;" title="Proteine"></div>
            <div class="nutrition-bar__segment nutrition-bar__segment--fat" style="width: ${pctFat}%;" title="Grassi"></div>
          </div>

          <div class="nutrition-legend">
            <div class="nutrition-legend__item">
              <div class="nutrition-legend__dot nutrition-legend__dot--carbs"></div>
              <span>Carboidrati <strong>${carbs}g</strong></span>
            </div>
            <div class="nutrition-legend__item">
              <div class="nutrition-legend__dot nutrition-legend__dot--prot"></div>
              <span>Proteine <strong>${prot}g</strong></span>
            </div>
            <div class="nutrition-legend__item">
              <div class="nutrition-legend__dot nutrition-legend__dot--fat"></div>
              <span>Grassi <strong>${fat}g</strong></span>
            </div>
          </div>

          <p class="nutrition-disclaimer">
            <em>Disclaimer: Valori medi per 100 g di prodotto finito, calcolati sugli ingredienti della ricetta con dati USDA FoodData Central e resa di cottura dichiarata. I valori effettivi possono variare in base ai marchi commerciali usati.</em>
          </p>
        </div>`;

      // Nella SPA il blocco sta dietro un <details>; nella statica un toggle
      // chiuso equivarrebbe a contenuto invisibile, quindi si apre e basta.
      nutritionHtml = ctx.interattivo ? `
      <details class="nutrition-toggle">
        <summary class="nutrition-toggle__btn">
          <i data-lucide="microscope" class="nutrition-toggle__icon"></i> Analisi Nutrizionale
        </summary>
${nutritionContent}
      </details>
      ` : `
      <h3 class="sensory-note__title">Analisi Nutrizionale</h3>
${nutritionContent}`;
  }

  // Il radar è disegnato su <canvas>: per chi non vede è un buco nero, perché
  // un canvas non ha contenuto, solo pixel. Gli stessi assi escono anche in
  // tabella, marcata `solo-lettore` — invisibile agli occhi, presente
  // nell'albero di accessibilità. Il canvas va quindi nascosto agli assistenti
  // (`aria-hidden`), o il grafico verrebbe annunciato come elemento vuoto
  // accanto alla sua stessa alternativa.
  //
  // Il nome della tabella è un `aria-label` e non una `<caption>`: la caption è
  // l'unico pezzo che `table-layout: fixed` non riesce a stringere, e quella
  // frase, tenuta su una riga sola, teneva larga tutta la tabella nascosta —
  // 266 px che sporgevano oltre il bordo della pagina.
  const righeAssi = r.sensoryProfile.axes
    .map(a => `<tr><th scope="row">${escHtml(a.label)}</th><td>${escHtml(a.value)} su 10</td></tr>`)
    .join('');

  // Resa statica: gli stessi dati, visibili e piatti. La tabella qui NON è
  // `solo-lettore`: senza il canvas è l'unica rappresentazione del profilo,
  // e deve vedersi — è quello che rende vero il vincolo «i dati strutturati
  // corrispondono a contenuto visibile» anche per NutritionInformation.
  if (!ctx.interattivo) {
    return `
    <div class="recipe-panel sensory-panel recipe-panel--spaced">
      <h2 class="recipe-panel__title">
        <span><span class="recipe-panel__title-icon">${ctx.emoji('star', 24)}</span> Dati Tecnici & Sensoriali</span>
      </h2>
      <div class="sensory-dominant">
        <span class="sensory-dominant__badge">
          👑 Tratto Dominante: ${escHtml(dominant.label)} (${escHtml(dominant.value)}/10)
        </span>
      </div>
      <table class="ingredients-table" aria-label="Profilo sensoriale, in scala da 1 a 10">
        <tbody>${righeAssi}</tbody>
      </table>
      ${summaryHtml}
      ${nutritionHtml}
    </div>`;
  }

  return `
    <div class="recipe-panel sensory-panel reveal recipe-panel--spaced">
      <h2 class="recipe-panel__title">
        <button type="button" class="sensory-panel__header" id="sensory-header"
                aria-expanded="false" aria-controls="sensory-chart-container">
          <span><span class="recipe-panel__title-icon">${ctx.emoji('star', 24)}</span> Dati Tecnici & Sensoriali</span>
          <i data-lucide="chevron-down" class="sensory-chevron" aria-hidden="true"></i>
        </button>
      </h2>
      <div class="sensory-chart-container" id="sensory-chart-container" style="display:none;">

        <div class="sensory-dominant">
          <span class="sensory-dominant__badge">
            👑 Tratto Dominante: ${escHtml(dominant.label)} (${escHtml(dominant.value)}/10)
          </span>
        </div>

        <div class="sensory-canvas-wrap">
          <canvas id="sensoryChart" aria-hidden="true"></canvas>
          <table class="solo-lettore" aria-label="Profilo sensoriale, in scala da 1 a 10">
            <tbody>${righeAssi}</tbody>
          </table>
        </div>

        ${summaryHtml}
        ${nutritionHtml}

      </div>
    </div>
  `;
}

// ── Tabella Farine ──
function buildFlourTable(r, ctx) {
  if (!r.flourTable?.length) return '';

  return `
    <div class="recipe-panel reveal recipe-panel--spaced">
      <h2 class="recipe-panel__title">
        <span class="recipe-panel__title-icon">${ctx.emoji('flatbread', 24)}</span> Consigli Farine & Marchi
      </h2>
      <table class="flour-table">
        <thead><tr><th>Tipo Farina</th><th>Forza (W)</th><th>Marchi Consigliati</th></tr></thead>
        <tbody>
          ${r.flourTable.map(f => `
            <tr>
              <td>${escHtml(f.type)}</td>
              <td class="flour-table__w">${escHtml(f.w || '-')}</td>
              <td>${escHtml(f.brands || '')}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <div class="pro-tip-box">
        <p><strong>${ctx.emoji('light-bulb', 18)} PRO TIP:</strong> La forza (W) è il parametro chiave. Se non trovi i marchi suggeriti, cerca qualsiasi farina con il valore W indicato.</p>
      </div>
    </div>`;
}

// ── Alert ──
function buildAlert(r, ctx) {
  if (!r.alert) return '';
  return `
    <div class="alert alert--danger reveal recipe-panel--spaced">
      <span class="alert__icon">${ctx.emoji('prohibited', 28)}</span>
      <div class="alert__content">
        <strong>ALERT PROFESSIONALE</strong>
        <p>${ctx.emoji('warning', 18)} ${escHtml(r.alert)}</p>
      </div>
    </div>`;
}

// ── Cottura ──
function buildBaking(r, ctx) {
  if (!r.baking) return '';
  const b = r.baking;
  return `
    <div class="recipe-panel reveal recipe-panel--spaced">
      <h2 class="recipe-panel__title">
        <span class="recipe-panel__title-icon">${ctx.emoji('fire', 24)}</span> Cottura
      </h2>
      <div class="tech-badges">
        ${b.temperature ? `<div class="tech-badge">${ctx.emoji('thermometer', 18)} Temperatura: <span class="tech-badge__value">&nbsp;${escHtml(b.temperature)}</span></div>` : ''}
        ${b.time ? `<div class="tech-badge">${ctx.emoji('stopwatch', 18)} Tempo: <span class="tech-badge__value">&nbsp;${escHtml(b.time)}</span></div>` : ''}
      </div>
      ${b.tips?.length ? `<ul class="tip-list">
        ${b.tips.map(t => `<li class="tip-item">${ctx.emoji('light-bulb', 16)} ${escHtml(t)}</li>`).join('')}
      </ul>` : ''}
    </div>`;
}

// ── Pro Tips ──
function buildProTips(r, ctx) {
  if (!r.proTips?.length) return '';
  return `
    <div class="recipe-panel reveal recipe-panel--spaced">
      <h2 class="recipe-panel__title">
        <span class="recipe-panel__title-icon">${ctx.emoji('light-bulb', 24)}</span> Pro Tips
      </h2>
      <ul class="tip-list">
        ${r.proTips.map(t => `<li class="tip-item">${ctx.emoji('light-bulb', 16)} ${escHtml(t)}</li>`).join('')}
      </ul>
    </div>`;
}

// ── Conservazione ──
function buildStorage(r, ctx) {
  if (!r.storage?.length) return '';
  return `
    <div class="recipe-panel reveal recipe-panel--spaced">
      <h2 class="recipe-panel__title">
        <span class="recipe-panel__title-icon">${ctx.emoji('package', 24)}</span> Conservazione
      </h2>
      <ul class="tip-list">
        ${r.storage.map(t => `<li class="tip-item">${ctx.emoji('package', 16)} ${escHtml(t)}</li>`).join('')}
      </ul>
    </div>`;
}

// ── Glossario ──
function buildGlossary(r, ctx) {
  if (!r.glossary?.length) return '';
  return `
    <div class="recipe-panel reveal recipe-panel--spaced">
      <h2 class="recipe-panel__title">
        <span class="recipe-panel__title-icon">${ctx.emoji('open-book', 24)}</span> Glossario
      </h2>
      <dl class="glossary-list">
        ${r.glossary.map(g => `
          <dt class="glossary-term">${escHtml(g.term)}</dt>
          <dd class="glossary-def">${escHtml(g.definition)}</dd>
        `).join('')}
      </dl>
    </div>`;
}
