/* ============================================
   IL RICETTARIO — Metadati Ricetta
   Guardie condivise sui badge (idratazione,
   lievitazione) usate da card e pagina dettaglio.
   ============================================ */

/**
 * Valori che alcune ricette usano per dire "questo dato non si applica".
 * Un pesto non ha lievitazione: stampare "nessuna" sulla card è peggio
 * che non stampare nulla.
 */
const PLACEHOLDER = ['n/a', 'na', 'nessuna', 'nessuno', 'none', 'null', '0', '-', '—'];

/**
 * True se il valore merita di finire in un badge.
 * @param {unknown} v - Valore grezzo dal JSON (può essere null, numero o stringa)
 * @returns {boolean}
 */
export function isValidBadge(v) {
  if (v === null || v === undefined) return false;
  const s = String(v).trim();
  return s !== '' && !PLACEHOLDER.includes(s.toLowerCase());
}
