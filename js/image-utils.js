/* ============================================
   IL RICETTARIO — Image Utilities
   Helper per generare <picture> con AVIF + WebP
   ============================================ */

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
  const cls = cssClass ? ` class="${cssClass}"` : '';
  const load = loading ? ` loading="${loading}"` : '';

  return `<picture>
  <source srcset="${avif}" type="image/avif">
  <img src="${webp}" alt="${alt}"${cls}${load}>
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
  <source srcset="${avif}" type="image/avif">
  <img src="${webp}" alt="${alt}" class="recipe-hero__img">
</picture>`;
}
