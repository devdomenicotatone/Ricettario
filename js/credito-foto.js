/**
 * CREDITO-FOTO.JS — Un solo posto che decide cosa si legge sotto la foto.
 *
 * Le foto Creative Commons (Wikimedia, Openverse) obbligano a citare autore e
 * licenza ogni volta che l'immagine viene mostrata. Il testo del credito è già
 * nei JSON delle ricette (`imageAttribution`, scritto dalla dashboard nella
 * forma `📷 Foto: Autore — Licenza via Provider`), ma finora non usciva da lì:
 * il sito pubblicava le foto senza attribuzione.
 *
 * Qui il testo viene scomposto una volta sola e trasformato in markup una volta
 * sola. Lo usano sia la pagina interattiva (`js/recipe-renderer.js`) sia quella
 * pre-renderizzata (`scripts/generate-og.js`): il credito è un obbligo di
 * licenza, non può dipendere da come si è arrivati sulla pagina, e due copie
 * della stessa logica divergerebbero al primo cambiamento.
 *
 * Per lo stesso motivo questo file deve restare PURO — niente DOM, niente
 * `window`, niente `import.meta`: lo importa anche Node dentro
 * `scripts/generate-og.js`.
 */

// L'escape arriva dal modulo condiviso: qui ce n'era una copia, ed era una
// delle tre che convivevano nel progetto. Vedi `js/escape.js` per il perché.
import { escHtml as esc } from './escape.js';

/**
 * Attribuzioni che non citano nessuno: non hanno niente da mostrare.
 *
 * `provenienza non documentata` non è un sinonimo pigro degli altri due: dice
 * che la fonte è stata CERCATA e non trovata. Quattro foto entrate nel repo
 * prima che la pipeline registrasse i crediti non hanno lasciato traccia da
 * nessuna parte — né nei JSON di allora, né negli indici della dashboard, né
 * negli EXIF (i JPEG originali erano già ripuliti). Scriverlo nel dato è
 * meglio del campo vuoto: il campo vuoto sembra una dimenticanza da riempire,
 * questo dice che qualcuno ha già guardato. In pagina non compare comunque:
 * un credito che non cita nessuno non è un credito.
 */
const SEGNAPOSTO = ['immagine esistente', 'caricata manualmente', 'provenienza non documentata'];

/** Nomi che sono provider, non licenze: `— Pexels` significa "via Pexels". */
const PROVIDER = ['pexels', 'unsplash', 'pixabay', 'wikimedia', 'openverse', 'flickr'];

/** Licenze proprietarie dei banchi immagini: l'URL è fisso e noto. */
const URL_LICENZE_PROVIDER = {
    'pexels license': 'https://www.pexels.com/license/',
    'unsplash license': 'https://unsplash.com/license',
    'pixabay license': 'https://pixabay.com/service/license-summary/',
};

/**
 * URL della licenza, o null se non è ricostruibile con certezza.
 *
 * Una CC senza numero di versione (`CC BY-SA`, com'è arrivata da Openverse)
 * NON viene collegata: un URI di licenza sbagliato dichiara condizioni d'uso
 * diverse da quelle vere, che è peggio di non dichiararle. In quel caso resta
 * il link alla pagina d'origine, che la licenza esatta ce l'ha scritta sopra.
 */
export function urlLicenza(licenza) {
    const s = String(licenza ?? '').trim().toLowerCase();
    if (!s) return null;

    if (URL_LICENZE_PROVIDER[s]) return URL_LICENZE_PROVIDER[s];

    // "CC CC0" e "CC BY 2.0" arrivano entrambe col prefisso "CC".
    const cc = s.replace(/^cc\s+/, '');
    if (/^cc0\b/.test(cc) || cc === 'zero') return 'https://creativecommons.org/publicdomain/zero/1.0/';
    if (/^(public domain|pdm|dominio pubblico)\b/.test(cc)) return 'https://creativecommons.org/publicdomain/mark/1.0/';

    const m = cc.match(/^(by(?:-nc)?(?:-sa|-nd)?)\s+(\d\.\d)$/);
    return m ? `https://creativecommons.org/licenses/${m[1]}/${m[2]}/` : null;
}

/**
 * Pagina d'origine dell'immagine, o null.
 *
 * `_originalImageUrl` punta al file, non alla pagina: il file JPEG da solo non
 * dice né chi l'ha scattato né a quali condizioni si può usare. La pagina sì, e
 * quando la licenza non è collegabile (una `CC BY-SA` senza numero di versione)
 * è l'unico posto dove chi legge può verificare davvero le condizioni d'uso.
 *
 * Si ricava solo dove la corrispondenza file → pagina è certa. Un indirizzo
 * inventato per riempire il vuoto sarebbe peggio del vuoto: il vincolo è "mai
 * un link rotto", quindi tutto ciò che non si riconosce restituisce null.
 */
export function urlFonte(urlOriginale) {
    const u = String(urlOriginale ?? '').trim();
    if (!/^https:\/\//i.test(u)) return null;

    // Wikimedia: il nome del file è l'ultimo pezzo del percorso, sia nella
    // forma diretta sia in quella dei thumbnail (.../thumb/a/aa/Nome.jpg/800px-Nome.jpg).
    const wiki = u.match(/^https:\/\/upload\.wikimedia\.org\/wikipedia\/[a-z-]+\/(?:thumb\/)?[0-9a-f]\/[0-9a-f]{2}\/([^/?#]+)/i);
    if (wiki) return `https://commons.wikimedia.org/wiki/File:${wiki[1]}`;

    // Pexels: l'identificativo della foto è dentro l'URL del file, e la pagina
    // si compone con quello (`.../photo/15026917/` è una forma valida e stabile).
    const pexels = u.match(/^https:\/\/images\.pexels\.com\/photos\/(\d+)\//i);
    if (pexels) return `https://www.pexels.com/photo/${pexels[1]}/`;

    // Se quello che c'è scritto è già la pagina, va bene così com'è.
    if (/^https:\/\/(commons\.wikimedia\.org\/wiki\/|www\.pexels\.com\/photo\/|unsplash\.com\/photos\/|pixabay\.com\/[a-z-]+\/|openverse\.org\/image\/|www\.flickr\.com\/photos\/)/i.test(u)) {
        return u;
    }

    return null;
}

/**
 * Scompone `imageAttribution` nei suoi pezzi.
 * @param {string} attribuzione - il campo `imageAttribution` della ricetta
 * @param {string} [urlOriginale] - il campo `_originalImageUrl` della ricetta
 * @returns {{autore: string, licenza: string|null, fonte: string|null,
 *            urlLicenza: string|null, urlFonte: string|null}|null}
 */
export function creditoFoto(attribuzione, urlOriginale) {
    const grezzo = String(attribuzione ?? '').trim();
    if (!grezzo) return null;

    // L'icona 📷 e l'etichetta "Foto:" le rimette la pagina: qui serve il contenuto.
    const corpo = grezzo.replace(/^📷\s*/, '').replace(/^Foto:\s*/i, '').trim();
    if (!corpo || SEGNAPOSTO.includes(corpo.toLowerCase())) return null;

    const pezzi = corpo.split(/\s+[—–]\s+/);
    const autore = pezzi[0].trim();
    if (!autore) return null;

    let licenza = null;
    let fonte = null;

    if (pezzi.length > 1) {
        const coda = pezzi.slice(1).join(' — ').trim();
        const via = coda.match(/^(.*?)\s+via\s+(.+)$/i);
        if (via) {
            licenza = via[1].trim() || null;
            fonte = via[2].trim();
        } else if (PROVIDER.includes(coda.toLowerCase())) {
            fonte = coda;
        } else {
            licenza = coda || null;
        }
    }

    return {
        autore,
        licenza,
        fonte,
        urlLicenza: urlLicenza(licenza),
        urlFonte: urlFonte(urlOriginale),
    };
}

/**
 * Contenuto della `<figcaption>` sotto la foto: già in HTML, già con l'escape
 * fatto. Restituisce stringa vuota se non c'è niente da citare.
 *
 * Dove porta il nome della licenza, in ordine di preferenza:
 *   1. l'URI esatto della licenza, quando è ricostruibile senza ambiguità;
 *   2. altrimenti la pagina d'origine della foto, che la licenza esatta ce
 *      l'ha scritta sopra — è il caso di `CC BY-SA` senza numero di versione,
 *      che arriva così da Openverse;
 *   3. altrimenti niente link, solo il testo. Un indirizzo approssimativo
 *      dichiarerebbe condizioni d'uso diverse da quelle vere.
 * Il terzo caso esiste davvero (`pinsa-romana`: licenza senza versione e
 * nessun `_originalImageUrl`) ed è il motivo per cui il ripiego finale deve
 * restare "testo semplice" invece di un link qualunque.
 */
export function htmlCreditoFoto(attribuzione, urlOriginale) {
    const c = creditoFoto(attribuzione, urlOriginale);
    if (!c) return '';

    const link = (testo, url, rel) => (url
        ? `<a href="${esc(url)}" target="_blank" rel="${rel}">${esc(testo)}</a>`
        : esc(testo));

    // `rel="license"` dichiara che il link È il testo della licenza: vale solo
    // per l'URI vero. Sulla pagina d'origine sarebbe una dichiarazione falsa.
    const ripiegoSullaFonte = Boolean(c.licenza && !c.urlLicenza && c.urlFonte);

    let html = `Foto: ${esc(c.autore)}`;
    if (c.licenza) {
        html += ripiegoSullaFonte
            ? ` — ${link(c.licenza, c.urlFonte, 'noopener nofollow')}`
            : ` — ${link(c.licenza, c.urlLicenza, 'license noopener nofollow')}`;
    }
    // Il provider non ripete il link alla fonte se se l'è già preso la licenza:
    // due volte lo stesso indirizzo nella stessa riga è solo rumore.
    if (c.fonte) html += ` via ${link(c.fonte, ripiegoSullaFonte ? null : c.urlFonte, 'noopener nofollow')}`;
    else if (c.urlFonte && !ripiegoSullaFonte) html += ` — ${link('fonte', c.urlFonte, 'noopener nofollow')}`;

    return html;
}
