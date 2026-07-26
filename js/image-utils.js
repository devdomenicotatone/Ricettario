/* ============================================
   IL RICETTARIO — Image Utilities
   Helper per generare <picture> con AVIF + WebP
   ============================================ */

import { escAttr } from './escape.js';

/**
 * Dato un path immagine, restituisce i path AVIF e WebP corrispondenti.
 * @param {string} src - Path originale dell'immagine (es. 'images/ricette/pane/ciabatta.jpg')
 * @returns {{ avif: string, webp: string }}
 */
export function getImageSources(src) {
  const base = src.replace(/\.(jpg|jpeg|png|webp)$/i, '');
  return {
    avif: `${base}.avif`,
    webp: `${base}.webp`,
  };
}

/**
 * Genera il markup <picture> con AVIF + WebP (fallback).
 * @param {string} src - Path immagine originale
 * @param {string} alt - Testo alternativo
 * @param {string} [cssClass] - Classe CSS per l'<img>
 * @param {string} [loading] - 'lazy' o 'eager'
 * @returns {string} Markup HTML <picture>
 */
export function buildPicture(src, alt, cssClass = '', loading = 'lazy') {
  if (!src) return '';
  const { avif, webp } = getImageSources(src);
  const cls = cssClass ? ` class="${escAttr(cssClass)}"` : '';
  const load = loading ? ` loading="${escAttr(loading)}"` : '';

  // `alt` è il titolo della ricetta, che lo scrive l'AI leggendo pagine
  // scaricate dal web: senza escape una virgoletta lo fa uscire
  // dall'attributo. Vale anche per `src`, che deriva dal campo `image`.
  return `<picture>
  <source srcset="${escAttr(avif)}" type="image/avif">
  <source srcset="${escAttr(webp)}" type="image/webp">
  <img src="${escAttr(webp)}" alt="${escAttr(alt)}"${cls}${load}>
</picture>`;
}

/**
 * Genera il markup <picture> per un hero a pieno schermo (posizionamento assoluto).
 * @param {string} src - Path immagine originale
 * @param {string} alt - Testo alternativo
 * @returns {string} Markup HTML <picture> con stile hero
 */
export function buildHeroPicture(src, alt) {
  if (!src) return '';
  const { avif, webp } = getImageSources(src);

  return `<picture class="recipe-hero__picture">
  <source srcset="${escAttr(avif)}" type="image/avif">
  <source srcset="${escAttr(webp)}" type="image/webp">
  <img src="${escAttr(webp)}" alt="${escAttr(alt)}" class="recipe-hero__img">
</picture>`;
}
