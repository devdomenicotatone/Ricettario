/* ============================================
   IL RICETTARIO — Escape HTML condiviso
   ============================================ */

/**
 * Neutralizza il testo che finisce dentro l'HTML, sia nel contenuto sia dentro
 * un attributo con le virgolette doppie.
 *
 * PERCHÉ STA QUI E NON IN TRE POSTI
 * Ne esistevano tre copie quasi identiche — `esc` in `credito-foto.js`,
 * `escHtml` in `recipe-renderer.js`, `escAttr` in `scripts/generate-og.js` — e
 * la conseguenza non è stata estetica: `generate-og.js` la applicava ovunque,
 * `recipe-renderer.js` in 22 punti su 42. Risultato, la stessa ricetta usciva
 * protetta nella pagina pre-renderizzata che vede il crawler e iniettabile in
 * quella che vede il lettore. Con una copia sola quel divario non si riapre.
 *
 * Questo modulo lo importa anche Node, dentro `scripts/generate-og.js`: niente
 * DOM, niente `window`, niente `import.meta`.
 *
 * PERCHÉ NON SCAPPA L'APOSTROFO
 * Servirebbe solo per gli attributi delimitati da apici singoli, che in questo
 * progetto non esistono (verificato: ogni attributo interpolato usa le
 * virgolette doppie). In compenso costerebbe caro: `scripts/verifica-build.js`
 * confronta i dati strutturati con il testo visibile e sa togliere solo le
 * entità con nome (`&[a-z]+;`), quindi un `&#39;` resterebbe nel testo. In
 * italiano l'apostrofo è ovunque — «l'impasto» — e il cancello comincerebbe a
 * bocciare build sane.
 *
 * Se un giorno servisse davvero, va cambiato PRIMA `testoVisibile` in
 * `verifica-build.js` perché decodifichi anche le entità numeriche.
 *
 * @param {unknown} valore - Qualsiasi cosa arrivi dal JSON della ricetta
 * @returns {string} Testo sicuro da interpolare nell'HTML
 */
export function escHtml(valore) {
    // `== null` copre null e undefined ma NON lo zero: la versione precedente
    // usava `if (!str) return ''`, quindi un valore 0 legittimo (grammi, gradi,
    // un punteggio sensoriale) spariva dalla pagina invece di stamparsi.
    if (valore == null) return '';
    return String(valore)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

/** Alias esplicito per l'uso dentro gli attributi, per leggibilità. */
export const escAttr = escHtml;
