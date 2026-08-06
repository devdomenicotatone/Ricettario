/* ============================================
   IL RICETTARIO — Markup della sezione Strumenti
   PURO: condiviso fra SPA e pre-rendering
   ============================================ */

/**
 * L'unica fonte del markup dell'hub /strumenti/ e delle pagine dettaglio
 * /strumenti/<slug>/. Come html-categoria.js: niente DOM, `window`,
 * `localStorage` o `import.meta` — lo importa anche Node dentro
 * scripts/generate-og.js. Dati e `base` arrivano come argomenti.
 *
 * Le pagine sono contenuto puro, senza controlli interattivi: non serve la
 * distinzione `interattivo` di ricette e categorie, e le classi `reveal`
 * restano fuori di proposito (senza JavaScript lascerebbero i blocchi a
 * opacity: 0 — stessa regola del pre-rendering altrove).
 */

import { escHtml, escAttr } from './escape.js';
import { buildPicture } from './image-utils.js';

/**
 * Title e meta description dell'hub: la composizione è QUI e solo qui,
 * come metaPaginaCategoria. `titoloBreve` è per buildPage (generate-og.js),
 * che appende « — Ricettario Lab»; `titolo` è il document.title completo
 * che scrive la SPA. Devono coincidere.
 */
export function metaHubStrumenti() {
  const titoloBreve = 'I miei strumenti: cutter e impastatrice';
  return {
    titoloBreve,
    titolo: `${titoloBreve} — Ricettario Lab`,
    descrizione: 'Gli strumenti su cui sono tarate le ricette del sito: il cutter Sirman C-Tronic 6 VT con la guida alle cinque lame e l\'impastatrice a spirale Famag Grilletta IM 5.',
  };
}

/** Title e meta description di una pagina strumento. `voce` è la voce del registry (js/strumenti.js). */
export function metaPaginaStrumento(voce) {
  const titoloBreve = voce.title;
  return {
    titoloBreve,
    titolo: `${titoloBreve} — Ricettario Lab`,
    descrizione: voce.desc,
  };
}

/**
 * Hub /strumenti/: breadcrumb, titolo e una griglia di schede, una per
 * strumento. `strumenti` sono le voci del registry (js/strumenti.js).
 */
export function htmlHubStrumenti(strumenti, { base }) {
  const schede = strumenti.map(s => {
    const foto = s.image
      ? `<div class="category-card__image-wrapper">
          ${buildPicture(`${base}${s.image}`, '', 'category-card__image', 'lazy',
    '(min-width: 640px) 368px, calc(100vw - 32px)')}
        </div>`
      : '';
    return `
        <a href="${escAttr(`${base}strumenti/${s.slug}/`)}" class="category-card" data-link>
          ${foto}
          <div class="category-card__body">
            <div class="strumento-card__tipo">${escHtml(s.tipo)}</div>
            <h2 class="category-card__title">${escHtml(s.nome)}</h2>
            <p class="category-card__desc">${escHtml(s.cardDesc)}</p>
          </div>
        </a>`;
  }).join('');

  return `
    <div class="container container--narrow strumenti-hub">
      <nav class="breadcrumb">
        <a href="${base}" data-link>Home</a>
        <span class="breadcrumb__separator">›</span>
        <span class="breadcrumb__current">Strumenti</span>
      </nav>

      <h1 class="strumento__titolo">I miei strumenti</h1>
      <p class="strumento__premessa">
        Ogni ricetta di questo sito è tarata su attrezzature precise, non su una
        macchina ideale. Qui ci sono le schede: che cosa fa bene ciascuno
        strumento, con quali accessori, e su quali ricette lavora davvero.
      </p>

      <div class="category-grid">${schede}</div>
    </div>`;
}

/**
 * Pagina dettaglio di uno strumento.
 *
 * `contenuto` è il modulo di dati/strumenti/<slug>.js; `voce` la voce del
 * registry. `ricettePerLama` mappa key lama → voci dell'indice recipes.json
 * collegate ({ title, slug, categoryDir, nota }); `categorie` sono le voci del
 * registry categorie da linkare quando lo strumento copre intere famiglie
 * (es. l'impastatrice). Entrambi possono mancare.
 */
export function htmlStrumento(contenuto, voce, { base, ricettePerLama = {}, categorie = [] }) {
  const foto = voce.image
    ? `<div class="strumento__foto">
        ${buildPicture(`${base}${voce.image}`, `${voce.nome} — ${voce.tipo}`, 'strumento__immagine', 'eager',
      '(min-width: 720px) 640px, calc(100vw - 32px)')}
      </div>`
    : '';

  const intro = (contenuto.intro || [])
    .map(p => `<p>${escHtml(p)}</p>`).join('\n        ');

  const specifiche = contenuto.specifiche?.length ? `
      <h2 class="strumento__sezione-titolo">Scheda tecnica</h2>
      <dl class="strumento__specifiche">
        ${contenuto.specifiche.map(s => `
        <div class="strumento__spec">
          <dt class="strumento__spec-voce">${escHtml(s.voce)}</dt>
          <dd class="strumento__spec-valore">${escHtml(s.valore)}</dd>
        </div>`).join('')}
      </dl>` : '';

  // La tavola dei mozzi (voce.imageMozzi, registry) apre la guida alle lame.
  // Nell'immagine mancano le lisce — sono la dotazione di serie, la tavola
  // mostra gli opzionali — e c'è la Piranha, che la guida non documenta:
  // l'alt lo dice, così testo e figura non si smentiscono.
  const fotoMozzi = voce.imageMozzi ? `
      <div class="strumento__foto">
        ${buildPicture(`${base}${voce.imageMozzi}`,
    'I mozzi opzionali della gamma C-Tronic 6: pesto, impasto, forate, Piranha e dentate (le lame lisce sono di serie)',
    'strumento__immagine', 'lazy', '(min-width: 720px) 640px, calc(100vw - 32px)')}
      </div>` : '';

  const lame = contenuto.lame?.length ? `
      <h2 class="strumento__sezione-titolo">Le lame: quale mozzo per cosa</h2>
      ${fotoMozzi}
      ${contenuto.lame.map(l => htmlLama(l, ricettePerLama[l.key] || [], { base })).join('\n')}` : '';

  const famiglie = categorie.length ? `
      <h2 class="strumento__sezione-titolo">Le ricette per questa macchina</h2>
      <div class="category-grid">
        ${categorie.map(c => `
        <a href="${escAttr(`${base}ricette/${c.dir}/`)}" class="category-card" data-link>
          <div class="category-card__body">
            <h3 class="category-card__title">${escHtml(c.title)}</h3>
            <p class="category-card__desc">${escHtml(c.desc)}</p>
          </div>
        </a>`).join('')}
      </div>` : '';

  const listaSemplice = (titolo, voci) => voci?.length ? `
      <h2 class="strumento__sezione-titolo">${escHtml(titolo)}</h2>
      <ul class="strumento__lista">
        ${voci.map(v => `<li>${escHtml(v)}</li>`).join('\n        ')}
      </ul>` : '';

  const fonti = contenuto.fonti?.length ? `
      <h2 class="strumento__sezione-titolo">Fonti</h2>
      <ul class="strumento__fonti">
        ${contenuto.fonti.map(f => `<li><a href="${escAttr(f.url)}" rel="noopener">${escHtml(f.titolo)}</a></li>`).join('\n        ')}
      </ul>` : '';

  return `
    <div class="container container--narrow strumento">
      <nav class="breadcrumb">
        <a href="${base}" data-link>Home</a>
        <span class="breadcrumb__separator">›</span>
        <a href="${escAttr(`${base}strumenti/`)}" data-link>Strumenti</a>
        <span class="breadcrumb__separator">›</span>
        <span class="breadcrumb__current">${escHtml(contenuto.nome)}</span>
      </nav>

      <div class="strumento__testata">
        <div class="strumento__tipo">${escHtml(contenuto.categoria)}</div>
        <h1 class="strumento__titolo">${escHtml(contenuto.nome)}</h1>
      </div>
      ${foto}
      <div class="strumento__intro">
        ${intro}
      </div>
      ${specifiche}
      ${lame}
      ${famiglie}
      ${listaSemplice('Pulizia e manutenzione', contenuto.manutenzione)}
      ${listaSemplice('Sicurezza', contenuto.sicurezza)}
      ${fonti}
    </div>`;
}

/** Blocco di una singola lama della guida, con le ricette del sito collegate. */
function htmlLama(l, ricette, { base }) {
  const lista = (titolo, voci) => voci?.length ? `
        <h4 class="lama__lista-titolo">${titolo}</h4>
        <ul class="lama__lista">
          ${voci.map(v => `<li>${escHtml(v)}</li>`).join('\n          ')}
        </ul>` : '';

  const dalRicettario = ricette.length ? `
        <h4 class="lama__lista-titolo">Dal ricettario</h4>
        <ul class="lama__ricette">
          ${ricette.map(r => `
          <li>
            <a href="${escAttr(`${base}ricette/${r.categoryDir}/${r.slug}/`)}" data-link>${escHtml(r.title)}</a>
            ${r.nota ? `<span class="lama__ricetta-nota"> — ${escHtml(r.nota)}</span>` : ''}
          </li>`).join('')}
        </ul>` : '';

  return `
      <section class="lama" id="lama-${escAttr(l.key)}">
        <div class="lama__testata">
          <h3 class="lama__nome">${escHtml(l.nome)}</h3>
          ${l.badge ? `<span class="lama__badge">${escHtml(l.badge)}</span>` : ''}
        </div>
        <p class="lama__descrizione">${escHtml(l.descrizione)}</p>
        ${lista('Cosa ci fai', l.usi)}
        ${lista('Tecnica e consigli', l.consigli)}
        ${lista('Errori da evitare', l.errori)}
        ${l.quando ? `<p class="lama__quando"><strong>Quando scegliere questa e non le altre:</strong> ${escHtml(l.quando)}</p>` : ''}
        ${dalRicettario}
      </section>`;
}
