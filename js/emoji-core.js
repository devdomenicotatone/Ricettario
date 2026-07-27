/**
 * EMOJI-CORE.JS — Il nucleo PURO di emoji.js
 *
 * Genera i tag <img> delle Fluent Emoji con la base passata come argomento
 * invece di importarla dal router: `js/router.js` legge `import.meta.env`,
 * che esiste solo dentro Vite, quindi tutto ciò che lo importa è
 * inimportabile da Node. Questo modulo invece lo importano anche i builder
 * condivisi col pre-rendering (`html-ricetta.js`, `html-categoria.js`),
 * che girano pure dentro `scripts/generate-og.js`.
 *
 * `js/emoji.js` resta l'interfaccia per la SPA: stesse funzioni, con la BASE
 * del router già applicata. Le due facce condividono QUESTA mappa e QUESTO
 * markup: se divergessero, le emoji delle pagine statiche e quelle della SPA
 * sarebbero due set diversi.
 *
 * Niente DOM, niente `window`, niente `import.meta`.
 */

import { CATEGORY_EMOJI_MAP } from './categories.js';

export const EMOJI_MAP = {
  // Sezioni ricetta
  'shopping-cart': 'shopping-cart',
  'balance-scale': 'balance-scale',
  'peanuts': 'peanuts',
  'gear': 'gear',
  'sheaf-of-rice': 'flatbread',  // usiamo flatbread come proxy per farine
  'fire': 'fire',
  'light-bulb': 'light-bulb',
  'open-book': 'open-book',
  'prohibited': 'prohibited',
  'warning': 'warning',

  // Badge tecnici
  'droplet': 'droplet',
  'thermometer': 'thermometer',
  'stopwatch': 'stopwatch',
  'wrench': 'wrench',

  // Categorie food
  'baguette-bread': 'baguette-bread',
  'pizza': 'pizza',
  'spaghetti': 'spaghetti',
  'croissant': 'croissant',
  'cookie': 'cookie',
  'flatbread': 'flatbread',
  'shortcake': 'shortcake',
  'canned-food': 'canned-food',
  'herb': 'herb',
  'fork-and-knife': 'fork-and-knife',

  // Homepage/strumenti
  'star': 'star',
  'house': 'house',
  'high-voltage': 'high-voltage',
  'bullseye': 'bullseye',
  'package': 'package',
  'tomato': 'tomato',
};

/**
 * Tag <img> di una Fluent Emoji, con la base esplicita.
 * @param {string} base - Prefisso URL del sito (es. "/Ricettario/")
 * @param {string} name - Nome dell'emoji (chiave di EMOJI_MAP)
 * @param {number} size - Dimensione in px
 * @param {string} extraClass - Classe CSS aggiuntiva
 */
export function fluentEmojiCon(base, name, size = 20, extraClass = '') {
  const file = EMOJI_MAP[name] || name;
  const cls = `fluent-emoji${extraClass ? ' ' + extraClass : ''}`;
  return `<img src="${base}images/emoji/${file}.png" width="${size}" height="${size}" alt="" class="${cls}" loading="lazy">`;
}

/** Emoji della categoria (nome display), con la base esplicita. */
export function categoryEmojiCon(base, category, size = 20) {
  const name = CATEGORY_EMOJI_MAP[category];
  return name ? fluentEmojiCon(base, name, size) : '';
}
