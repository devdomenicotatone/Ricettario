/* ============================================
   IL RICETTARIO — Image Utilities
   Helper per generare <picture> con AVIF + WebP
   ============================================ */

import { escAttr } from './escape.js';
import { DIMENSIONI_FOTO } from './dimensioni-foto.js';

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

/** Larghezza (px) delle varianti ridotte generate accanto agli originali. */
const LARGHEZZA_VARIANTE = 640;

/**
 * Dimensioni reali `[larghezza, altezza]` dell'originale, dalla mappa statica
 * (js/dimensioni-foto.js). La chiave è il path da `images/` in poi senza
 * estensione, così `src` può arrivare con qualunque `base` davanti
 * (`/`, `/Ricettario/`, …). `null` per le foto fuori mappa: chi chiama torna
 * al markup semplice, un solo file per formato.
 */
function dimensioniFoto(src) {
  const inizio = src.indexOf('images/');
  if (inizio === -1) return null;
  const chiave = src.slice(inizio).replace(/\.(jpg|jpeg|png|webp)$/i, '');
  return DIMENSIONI_FOTO[chiave] || null;
}

/** `foo.avif` → `foo-640.avif 640w, foo.avif 1800w` (la piccola prima: è quella scelta più spesso). */
function srcsetConVariante(path, larghezza) {
  const variante = path.replace(/\.(avif|webp)$/i, `-${LARGHEZZA_VARIANTE}.$1`);
  return `${variante} ${LARGHEZZA_VARIANTE}w, ${path} ${larghezza}w`;
}

/**
 * Genera il markup <picture> con AVIF + WebP (fallback).
 *
 * Per le foto presenti in DIMENSIONI_FOTO ogni formato esce con DUE larghezze
 * (variante `-640` e originale) più `sizes`, e l'<img> porta `width`/`height`
 * reali: senza, la scheda del carosello scaricava lo stesso file 1200-1880 px
 * dell'hero — 24 volte i pixel del suo slot (CHECKUP, punto 2).
 *
 * @param {string} src - Path immagine originale
 * @param {string} alt - Testo alternativo
 * @param {string} [cssClass] - Classe CSS per l'<img>
 * @param {string} [loading] - 'lazy' o 'eager'
 * @param {string} [sizes] - Larghezza resa, dichiarata dal chiamante che
 *                           conosce il CSS (es. '(min-width: 480px) 260px, 200px').
 *                           Default '100vw': sovrastima prudente — al massimo
 *                           scarica l'originale, mai una foto sfocata.
 * @returns {string} Markup HTML <picture>
 */
export function buildPicture(src, alt, cssClass = '', loading = 'lazy', sizes = '100vw') {
  if (!src) return '';
  const { avif, webp } = getImageSources(src);
  const cls = cssClass ? ` class="${escAttr(cssClass)}"` : '';
  const load = loading ? ` loading="${escAttr(loading)}"` : '';
  const dim = dimensioniFoto(src);

  // `alt` è il titolo della ricetta, che lo scrive l'AI leggendo pagine
  // scaricate dal web: senza escape una virgoletta lo fa uscire
  // dall'attributo. Vale anche per `src`, che deriva dal campo `image`.
  if (!dim) {
    return `<picture>
  <source srcset="${escAttr(avif)}" type="image/avif">
  <source srcset="${escAttr(webp)}" type="image/webp">
  <img src="${escAttr(webp)}" alt="${escAttr(alt)}"${cls}${load}>
</picture>`;
  }

  const [w, h] = dim;
  const sz = ` sizes="${escAttr(sizes)}"`;
  return `<picture>
  <source srcset="${escAttr(srcsetConVariante(avif, w))}"${sz} type="image/avif">
  <source srcset="${escAttr(srcsetConVariante(webp, w))}"${sz} type="image/webp">
  <img src="${escAttr(webp)}" srcset="${escAttr(srcsetConVariante(webp, w))}"${sz} width="${w}" height="${h}" alt="${escAttr(alt)}"${cls}${load}>
</picture>`;
}

/**
 * Genera il markup <picture> per un hero a pieno schermo (posizionamento assoluto).
 * L'immagine copre l'intera larghezza della sezione full-bleed (`inset: 0`),
 * quindi `sizes` è fisso a `100vw`; niente `loading="lazy"`: è la LCP della
 * pagina. `width`/`height` reali anche qui — con l'hero assoluto non spostano
 * il layout, ma danno al browser le proporzioni prima del caricamento.
 * @param {string} src - Path immagine originale
 * @param {string} alt - Testo alternativo
 * @returns {string} Markup HTML <picture> con stile hero
 */
export function buildHeroPicture(src, alt) {
  if (!src) return '';
  const { avif, webp } = getImageSources(src);
  const dim = dimensioniFoto(src);

  if (!dim) {
    return `<picture class="recipe-hero__picture">
  <source srcset="${escAttr(avif)}" type="image/avif">
  <source srcset="${escAttr(webp)}" type="image/webp">
  <img src="${escAttr(webp)}" alt="${escAttr(alt)}" class="recipe-hero__img">
</picture>`;
  }

  const [w, h] = dim;
  const sz = ' sizes="100vw"';
  return `<picture class="recipe-hero__picture">
  <source srcset="${escAttr(srcsetConVariante(avif, w))}"${sz} type="image/avif">
  <source srcset="${escAttr(srcsetConVariante(webp, w))}"${sz} type="image/webp">
  <img src="${escAttr(webp)}" srcset="${escAttr(srcsetConVariante(webp, w))}"${sz} width="${w}" height="${h}" alt="${escAttr(alt)}" class="recipe-hero__img">
</picture>`;
}
