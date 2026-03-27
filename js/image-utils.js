/* ============================================
   IL RICETTARIO — Image Utilities
   Helper per generare <picture> con AVIF/WebP/JPG
   ============================================ */

/**
 * Dato un path immagine (jpg/png), restituisce i path AVIF e WebP corrispondenti.
 * @param {string} src - Path originale dell'immagine (es. 'images/ricette/pane/ciabatta.jpg')
 * @returns {{ avif: string, webp: string, fallback: string }}
 */
export function getImageSources(src) {
  const fallback = src;
  const base = src.replace(/\.(jpg|jpeg|png)$/i, '');
  return {
    avif: `${base}.avif`,
    webp: `${base}.webp`,
    fallback,
  };
}

/**
 * Genera il markup <picture> con AVIF + WebP + fallback originale.
 * @param {string} src - Path immagine originale
 * @param {string} alt - Testo alternativo
 * @param {string} [cssClass] - Classe CSS per l'<img>
 * @param {string} [loading] - 'lazy' o 'eager'
 * @returns {string} Markup HTML <picture>
 */
export function buildPicture(src, alt, cssClass = '', loading = 'lazy') {
  if (!src) return '';
  const { avif, webp, fallback } = getImageSources(src);
  const cls = cssClass ? ` class="${cssClass}"` : '';
  const load = loading ? ` loading="${loading}"` : '';

  return `<picture>
  <source srcset="${avif}" type="image/avif">
  <source srcset="${webp}" type="image/webp">
  <img src="${fallback}" alt="${alt}"${cls}${load}>
</picture>`;
}

/**
 * Genera il markup <picture> per un hero a pieno schermo (posizionamento assoluto).
 * Usato come sostituto di background-image per supportare AVIF/WebP.
 * @param {string} src - Path immagine originale
 * @param {string} alt - Testo alternativo
 * @returns {string} Markup HTML <picture> con stile hero
 */
export function buildHeroPicture(src, alt) {
  if (!src) return '';
  const { avif, webp, fallback } = getImageSources(src);

  return `<picture class="recipe-hero__picture">
  <source srcset="${avif}" type="image/avif">
  <source srcset="${webp}" type="image/webp">
  <img src="${fallback}" alt="${alt}" class="recipe-hero__img">
</picture>`;
}
