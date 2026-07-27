/**
 * EMOJI.JS — Fluent Emoji helper module (faccia SPA)
 *
 * Le mappe e il markup stanno in js/emoji-core.js, che è puro e viene
 * importato anche dal pre-rendering: qui c'è solo l'applicazione della BASE
 * del router e il refresh delle icone Lucide, che toccano il browser.
 */

import { BASE } from './router.js';
import { createIcons } from './icons.js';
import { fluentEmojiCon, categoryEmojiCon } from './emoji-core.js';
import { CATEGORY_EMOJI_MAP } from './categories.js';

/**
 * Genera un tag <img> inline per una Fluent Emoji.
 * @param {string} name - Nome dell'emoji (chiave di EMOJI_MAP in emoji-core.js)
 * @param {number} size - Dimensione in px (default: 20)
 * @param {string} extraClass - Classe CSS aggiuntiva
 * @returns {string} HTML <img> tag
 */
export function fluentEmoji(name, size = 20, extraClass = '') {
  return fluentEmojiCon(BASE, name, size, extraClass);
}

/**
 * Mappa categorie → emoji Fluent (derivata da categories.js)
 */
export const CATEGORY_FLUENT = CATEGORY_EMOJI_MAP;

/**
 * Shorthand per emoji categoria
 */
export function categoryEmoji(category, size = 20) {
  return categoryEmojiCon(BASE, category, size);
}

/**
 * Rigenera le icone inline dopo aver iniettato nuovo markup.
 * Le icone non arrivano più da un CDN: vedi js/icons.js.
 */
export function refreshIcons() {
  createIcons();
}
