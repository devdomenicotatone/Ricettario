/**
 * EMOJI.JS — Fluent Emoji helper module
 * Genera <img> tag per le Fluent Emoji 3D PNG (Microsoft)
 * ospitate localmente in /images/emoji/
 */

import { BASE } from './router.js';

const EMOJI_MAP = {
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

  // Homepage/strumenti
  'star': 'star',
  'house': 'house',
  'high-voltage': 'high-voltage',
  'bullseye': 'bullseye',
  'package': 'package',
  'tomato': 'tomato',
};

/**
 * Genera un tag <img> inline per una Fluent Emoji.
 * @param {string} name - Nome dell'emoji (chiave di EMOJI_MAP)
 * @param {number} size - Dimensione in px (default: 20)
 * @param {string} extraClass - Classe CSS aggiuntiva
 * @returns {string} HTML <img> tag
 */
export function fluentEmoji(name, size = 20, extraClass = '') {
  const file = EMOJI_MAP[name] || name;
  const cls = `fluent-emoji${extraClass ? ' ' + extraClass : ''}`;
  return `<img src="${BASE}images/emoji/${file}.png" width="${size}" height="${size}" alt="" class="${cls}" loading="lazy">`;
}

/**
 * Mappa categorie → emoji Fluent
 */
export const CATEGORY_FLUENT = {
  Pane: 'baguette-bread',
  Pasta: 'spaghetti',
  Pizza: 'pizza',
  Lievitati: 'croissant',
  Dolci: 'cookie',
  Focaccia: 'flatbread',
  Conserve: 'canned-food',
};

/**
 * Shorthand per emoji categoria
 */
export function categoryEmoji(category, size = 20) {
  const name = CATEGORY_FLUENT[category];
  return name ? fluentEmoji(name, size) : '';
}
