/**
 * STATO-URL.JS — la configurazione del calcolatore vive nell'URL.
 *
 * Due formati, per due scopi diversi:
 *
 *   /cottura/?taglio=fiorentina&cm=4.5&cottura=media_al_sangue&…
 *       configurazione libera, condivisibile e ricaricabile. Chiavi leggibili
 *       di proposito: un URL che si legge è un URL che si aggiusta. La
 *       compressione in due lettere farebbe risparmiare byte che nessuno paga.
 *
 *   /cottura/fiorentina-4cm-kamado/
 *       slug delle configurazioni pre-generate, quelle che diventano pagine
 *       statiche indicizzabili. Il peso non entra nello slug: per i tagli
 *       dominati dal peso c'è una pagina sola, con il valore di default.
 *
 * Nessun accesso al DOM: questo modulo lo usa anche generate-og.js in Node.
 */

/** Bool → "1"/"0" e viceversa, senza sorprese su stringhe vuote. */
const bool = (v) => v === true || v === '1' || v === 'true';

/**
 * Legge una configurazione da una query string.
 * Non valida niente: la validazione è in `normalizza`, che ha bisogno dei dati.
 */
export function leggiQuery(search) {
    const q = new URLSearchParams(search || '');
    if (!q.get('taglio')) return null;

    const numero = (chiave) => {
        const v = q.get(chiave);
        if (v == null || v === '') return undefined;
        const n = parseFloat(v.replace(',', '.'));
        return Number.isFinite(n) ? n : undefined;
    };

    return {
        taglio: q.get('taglio'),
        spessore: numero('cm'),
        peso: numero('kg'),
        osso: q.has('osso') ? bool(q.get('osso')) : undefined,
        bordo_grasso_cm: numero('grasso'),
        partenza: q.get('partenza') || undefined,
        cottura: q.get('cottura') || undefined,
        metodo: q.get('metodo') || undefined,
        dispositivo: q.get('kamado') || undefined,
        deflettore: q.has('deflettore') ? bool(q.get('deflettore')) : undefined,
        griglia_rialzata: q.has('rialzata') ? bool(q.get('rialzata')) : undefined,
        sonda: q.has('sonda') ? bool(q.get('sonda')) : undefined,
        legno: q.get('legno') || null,
    };
}

/** Configurazione → query string (senza il "?"). */
export function scriviQuery(config) {
    const q = new URLSearchParams();
    q.set('taglio', config.taglio);
    if (config.spessore != null) q.set('cm', String(config.spessore));
    if (config.peso != null) q.set('kg', String(config.peso));
    q.set('osso', config.osso ? '1' : '0');
    if (config.bordo_grasso_cm) q.set('grasso', String(config.bordo_grasso_cm));
    q.set('partenza', config.partenza);
    q.set('cottura', config.cottura);
    q.set('metodo', config.metodo);
    q.set('kamado', config.dispositivo);
    q.set('deflettore', config.deflettore ? '1' : '0');
    q.set('rialzata', config.griglia_rialzata ? '1' : '0');
    q.set('sonda', config.sonda ? '1' : '0');
    if (config.legno) q.set('legno', config.legno);
    return q.toString();
}

// ═══════════════════════════════════════════════════════════════
//  SLUG DELLE PAGINE PRE-GENERATE
// ═══════════════════════════════════════════════════════════════

const kebab = (id) => id.replace(/_/g, '-');

/**
 * `fiorentina-4cm-kamado` per i tagli dominati dallo spessore,
 * `roast-beef-kamado` per quelli dominati dal peso.
 */
export function slugDaConfig({ taglio, spessore }, dati) {
    const t = dati.tagli.find(x => x.id === taglio);
    if (!t) return null;
    if (t.parametro_dominante === 'spessore' && spessore != null) {
        const cm = String(spessore).replace('.', '-').replace(/-0$/, '');
        return `${kebab(t.id)}-${cm}cm-kamado`;
    }
    return `${kebab(t.id)}-kamado`;
}

/** Inverso di slugDaConfig. Restituisce null se lo slug non è riconosciuto. */
export function configDaSlug(slug, dati) {
    if (!slug) return null;
    const m = String(slug).match(/^(.+?)(?:-(\d+(?:-\d+)?)cm)?-kamado$/);
    if (!m) return null;

    const idKebab = m[1];
    const t = dati.tagli.find(x => kebab(x.id) === idKebab);
    if (!t) return null;

    const config = { taglio: t.id };
    if (m[2]) config.spessore = parseFloat(m[2].replace('-', '.'));
    return config;
}

// ═══════════════════════════════════════════════════════════════
//  NORMALIZZAZIONE
// ═══════════════════════════════════════════════════════════════

/**
 * Completa una configurazione parziale con i default del taglio e riporta i
 * valori fuori scala dentro l'intervallo ammesso.
 *
 * Serve perché l'URL è modificabile a mano e le pagine pre-generate ne
 * specificano solo una parte: senza questo passaggio un `?cm=99` arriverebbe
 * fino al motore.
 */
export function normalizza(parziale, dati) {
    const t = dati.tagli.find(x => x.id === parziale?.taglio) || dati.tagli[0];
    const dispositivoId = dati.dispositivi.some(d => d.id === parziale?.dispositivo)
        ? parziale.dispositivo
        : dati.defaultDispositivo;

    const clamp = (v, r, def) => {
        if (v == null || !Number.isFinite(v)) return def;
        return Math.min(Math.max(v, r.min), r.max);
    };

    const cottura = t.cotture_ammesse.includes(parziale?.cottura)
        ? parziale.cottura
        // Default sensato: la seconda cottura ammessa (media al sangue sul
        // manzo), o la prima quando ce n'è una sola (pollo, low & slow).
        : t.cotture_ammesse[Math.min(1, t.cotture_ammesse.length - 1)];

    return {
        taglio: t.id,
        spessore: clamp(parziale?.spessore, t.spessore, t.spessore.default),
        peso: clamp(parziale?.peso, t.peso, t.peso.default),
        osso: parziale?.osso ?? t.con_osso === 'sempre',
        bordo_grasso_cm: t.gestione_grasso?.bordo_grasso
            ? (parziale?.bordo_grasso_cm ?? 0)
            : 0,
        partenza: ['frigo', 'temperata', 'ambiente'].includes(parziale?.partenza)
            ? parziale.partenza
            : 'frigo',
        cottura,
        metodo: t.metodi_ammessi.includes(parziale?.metodo) ? parziale.metodo : t.metodo_consigliato,
        dispositivo: dispositivoId,
        deflettore: parziale?.deflettore ?? true,
        griglia_rialzata: parziale?.griglia_rialzata ?? true,
        sonda: parziale?.sonda ?? true,
        legno: parziale?.legno || null,
    };
}

/**
 * L'osso non è opzionale su tutti i tagli: dove la scelta non esiste, il
 * valore del taglio vince su quello dell'utente.
 */
export function ossoObbligato(taglio) {
    if (taglio.con_osso === 'sempre') return true;
    if (taglio.con_osso === 'mai') return false;
    return null;
}
