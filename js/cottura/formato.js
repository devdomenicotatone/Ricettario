/**
 * FORMATO.JS — come si scrivono numeri e durate nel calcolatore.
 *
 * Sta in un file suo perché lo usano tre posti diversi: il form, la vista del
 * piano e lo script di verifica in terminale. Averne tre copie significava
 * vedere "4.5 cm" in un posto e "4,5 cm" nell'altro.
 *
 * Nessun accesso al DOM: gira anche in Node.
 */

/** Virgola decimale, che è come si scrivono i numeri in italiano. */
export function num(n) {
    if (n == null) return '';
    return String(n).replace('.', ',');
}

/**
 * Escape HTML. L'implementazione NON sta qui: era la quarta copia identica nel
 * progetto, e le copie divergono. Resta esportata da questo file perché la
 * importano già cinque moduli del calcolatore, e `js/escape.js` è puro quanto
 * questo — lo carica anche Node dentro `scripts/generate-og.js`.
 */
export { escHtml as esc } from '../escape.js';

/**
 * Un intervallo di minuti in forma leggibile. Sopra l'ora e mezza passa alle
 * ore: "3,7-5 h" si legge, "220-300 min" va contato.
 */
export function durata(minuti) {
    if (!minuti) return '—';
    const [a, b] = minuti;
    if (b < 90) return a === b ? `${a} min` : `${a}-${b} min`;
    const ore = (n) => num(Math.round(n / 6) / 10);
    return `${ore(a)}-${ore(b)} h`;
}

/** "3 porzioni", "1 porzione". */
export function porzioni(n) {
    return `${n} porzion${n === 1 ? 'e' : 'i'}`;
}

/** Etichette leggibili dei gradi di cottura e dei metodi. */
export function etichetta(id) {
    return String(id || '').replace(/_/g, ' ');
}
