/* ============================================
   IL RICETTARIO — Token dose condivisi
   ============================================ */

/**
 * La grammatica dei token `{id:valore}` negli step delle ricette, in un posto
 * solo.
 *
 * PERCHÉ STA QUI E NON IN DUE POSTI
 * La regex viveva in due copie identiche — `recipe-renderer.js` per la SPA e
 * `scripts/generate-og.js` per le pagine statiche e il JSON-LD — ed entrambe
 * erano identicamente sbagliate: `[a-z_]+` non ammetteva cifre né maiuscole nei
 * nomi, quindi `{farina_00:100}` e `{targetTemp:24!}` restavano graffe grezze
 * nel testo visibile E nei dati strutturati di 11 pagine pubblicate. Il
 * controllo di verifica-build che confronta JSON-LD e testo visibile non poteva
 * accorgersene: i due lati uscivano dalla stessa regex, quindi coincidevano
 * anche sul testo rotto. Con una copia sola quel divario non si riapre, e il
 * cancello in `build-recipes.js` boccia alla fonte ciò che la grammatica non
 * riconosce.
 *
 * Questo modulo lo importa anche Node (`scripts/generate-og.js` e
 * `scripts/build-recipes.js`): niente DOM, niente `window`, niente
 * `import.meta`.
 *
 * La grammatica ufficiale è quella del README: `{id:numero}` per le dosi che
 * si riscalano col calcolatore, `{id:numero!}` per i valori fissi (tempi,
 * temperature). L'`id` è `[a-zA-Z_][a-zA-Z0-9_]*`; il valore è un numero con
 * eventuale parte decimale col punto. La forma senza valore `{id}` NON esiste:
 * il panettone l'aveva usata contando su un lookup negli ingredienti mai
 * implementato, ed è rimasta graffa visibile finché il cancello non è nato.
 */

/** Fonte unica della grammatica. `nuovo()` perché una regex `g` condivisa
 *  porterebbe in giro il suo `lastIndex` tra un chiamante e l'altro. */
const TOKEN_SRC = /\{([a-zA-Z_][a-zA-Z0-9_]*):(\d+(?:\.\d+)?)(!)?\}/;
const nuovo = () => new RegExp(TOKEN_SRC.source, 'g');

/**
 * Formatta un valore di dose come lo mostra il sito: intero da 10 in su, un
 * decimale tra 1 e 10, due sotto l'1. Usata sia alla prima resa sia dal
 * calcolatore dosi quando riscala.
 */
export function formatDoseInline(val) {
    if (val === 0) return '0';
    if (val >= 10) return `${Math.round(val)}`;
    if (val >= 1) return `${Math.round(val * 10) / 10}`;
    return `${Math.round(val * 100) / 100}`;
}

/**
 * Per la SPA: sostituisce ogni token con lo `<span class="dose-inline">` che il
 * calcolatore dosi aggiorna. Il testo deve essere GIÀ passato da `escHtml`:
 * i token sopravvivono all'escape perché non contengono caratteri speciali,
 * e l'`id` (`[a-zA-Z0-9_]`) è innocuo dentro l'attributo.
 */
export function risolviTokenSpan(testo) {
    return String(testo || '').replace(nuovo(), (_, id, valore, fisso) => {
        const num = parseFloat(valore);
        const fissoAttr = fisso ? ' data-fixed="true"' : '';
        return `<span class="dose-inline" data-base="${num}" data-token-id="${id}"${fissoAttr}>${formatDoseInline(num)}</span>`;
    });
}

/**
 * Per il pre-rendering e il JSON-LD: sostituisce ogni token col solo valore,
 * formattato ESATTAMENTE come lo formatta la SPA. Se i due lati divergessero,
 * il confronto testo visibile ↔ dati strutturati in verifica-build comincerebbe
 * a bocciare build sane.
 */
export function risolviTokenTesto(testo) {
    return String(testo || '').replace(nuovo(), (_, __, valore) => formatDoseInline(parseFloat(valore)));
}

/**
 * Per i cancelli: quello che resta di ogni graffa dopo aver tolto i token
 * validi. Un array vuoto vuol dire testo sano; qualsiasi elemento è un token
 * malformato (`{farina impasto:100}`), una graffa spaiata, o la forma senza
 * valore (`{farina_primo}`) che il sito non risolve.
 */
export function graffeNonRisolte(testo) {
    const resto = String(testo || '').replace(nuovo(), '');
    return resto.match(/\{[^{}]*\}|[{}]/g) || [];
}
