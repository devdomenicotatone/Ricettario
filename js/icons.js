/**
 * ICONS.JS — Le icone Lucide usate dal sito, inline.
 *
 * Prima arrivavano da `https://unpkg.com/lucide@0.474.0`: uno <script> di
 * terze parti, render-blocking, per usarne otto. Qui c'è solo la geometria
 * che serve (~1 KB) e nessuna richiesta di rete.
 *
 * `createIcons()` replica il comportamento di lucide.createIcons(): sostituisce
 * ogni elemento con `data-lucide` con l'<svg> corrispondente, riportando class,
 * style e gli altri attributi dell'originale.
 *
 * Geometria da Lucide (https://lucide.dev), licenza ISC.
 * Per aggiungere un'icona: copia il contenuto di lucide.dev/icons/<nome>.
 */

const ICONS = {
  'arrow-up-right': '<path d="M7 7h10v10"/><path d="M7 17 17 7"/>',
  'chevron-down': '<path d="m6 9 6 6 6-6"/>',
  'grid-3x3': '<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M3 15h18"/><path d="M9 3v18"/><path d="M15 3v18"/>',
  'list': '<path d="M3 5h.01"/><path d="M3 12h.01"/><path d="M3 19h.01"/><path d="M8 5h13"/><path d="M8 12h13"/><path d="M8 19h13"/>',
  'microscope': '<path d="M6 18h8"/><path d="M3 22h18"/><path d="M14 22a7 7 0 1 0 0-14h-1"/><path d="M9 14h2"/><path d="M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Z"/><path d="M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3"/>',
  'moon': '<path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401"/>',
  'search': '<path d="m21 21-4.34-4.34"/><circle cx="11" cy="11" r="8"/>',
  'sun': '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>',
};

const SVG_NS = 'http://www.w3.org/2000/svg';

const BASE_ATTRS = {
  xmlns: SVG_NS,
  width: '24',
  height: '24',
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  'stroke-width': '2',
  'stroke-linecap': 'round',
  'stroke-linejoin': 'round',
};

/**
 * Sostituisce gli elementi `[data-lucide]` con l'SVG corrispondente.
 * @param {ParentNode} [root=document] - Sottoalbero da processare
 */
export function createIcons(root = document) {
  for (const el of root.querySelectorAll('[data-lucide]')) {
    const name = el.getAttribute('data-lucide');
    const body = ICONS[name];
    if (!body) {
      console.warn(`[icons] icona "${name}" non disponibile: aggiungila a js/icons.js`);
      continue;
    }

    const svg = document.createElementNS(SVG_NS, 'svg');
    for (const [k, v] of Object.entries(BASE_ATTRS)) svg.setAttribute(k, v);

    // Gli attributi dell'originale vincono (width/height/style inline, aria-*…)
    for (const attr of el.attributes) {
      if (attr.name === 'data-lucide') continue;
      svg.setAttribute(attr.name, attr.value);
    }
    svg.setAttribute('class', `lucide lucide-${name}${el.className ? ' ' + el.className : ''}`);

    svg.innerHTML = body;
    el.replaceWith(svg);
  }
}
