/**
 * STORICO.JS — le cotture passate, con com'è andata.
 *
 * Non è un registro per nostalgia: è il modo in cui i coefficienti si tarano.
 * Ogni voce tiene la configurazione usata e l'esito dichiarato ("al punto",
 * "poco cotta", "troppo cotta"), e dopo qualche cottura sullo stesso taglio
 * emerge una tendenza. Se tre fiorentine su quattro escono troppo cotte, non è
 * sfortuna: è la curva in dati/cottura/coefficienti.js che va abbassata, e
 * `tendenza()` lo dice invece di lasciarlo capire.
 */

const CHIAVE = 'ricettario-cottura-storico';
const VERSIONE = 1;
const MASSIMO = 100;

export const ESITI = [
    { id: 'poco', nome: 'Poco cotta', segno: -1 },
    { id: 'punto', nome: 'Al punto', segno: 0 },
    { id: 'troppo', nome: 'Troppo cotta', segno: +1 },
];

export function leggiStorico() {
    try {
        const doc = JSON.parse(localStorage.getItem(CHIAVE) || 'null');
        if (!doc || doc.versione !== VERSIONE || !Array.isArray(doc.voci)) return [];
        return doc.voci;
    } catch {
        return [];
    }
}

function scrivi(voci) {
    try {
        localStorage.setItem(CHIAVE, JSON.stringify({
            versione: VERSIONE,
            voci: voci.slice(-MASSIMO),
        }));
        return true;
    } catch {
        return false;
    }
}

/**
 * Registra o aggiorna l'esito di una cottura. La chiave è la configurazione più
 * il giorno: rispondere due volte sulla stessa cottura corregge la risposta
 * invece di creare un doppione.
 */
export function registra({ config, piano, esito, nota, quando }) {
    const voci = leggiStorico();
    const giorno = new Date(quando).toISOString().slice(0, 10);
    const chiave = `${config.taglio}|${config.spessore}|${config.peso}|${config.cottura}|${giorno}`;

    const voce = {
        chiave,
        quando,
        taglio: config.taglio,
        nomeTaglio: piano.taglio.nome,
        dominante: piano.misura.dominante,
        spessore: config.spessore,
        peso: config.peso,
        cottura: config.cottura,
        metodo: config.metodo,
        dispositivo: config.dispositivo,
        estrazione_c: piano.estrazione.c,
        totale_min: piano.totale_min,
        esito,
        nota: (nota || '').slice(0, 400),
    };

    const esistente = voci.findIndex(v => v.chiave === chiave);
    if (esistente >= 0) voci[esistente] = voce;
    else voci.push(voce);

    scrivi(voci);
    return voce;
}

export function perTaglio(idTaglio) {
    return leggiStorico()
        .filter(v => v.taglio === idTaglio)
        .sort((a, b) => b.quando - a.quando);
}

export function voceDi(config, quando) {
    const giorno = new Date(quando).toISOString().slice(0, 10);
    const chiave = `${config.taglio}|${config.spessore}|${config.peso}|${config.cottura}|${giorno}`;
    return leggiStorico().find(v => v.chiave === chiave) || null;
}

/**
 * Tendenza su un taglio: serve a decidere se ricalibrare, e in che direzione.
 * Sotto le tre cotture non dice niente — due dati non sono una tendenza, e
 * suggerire di modificare i coefficienti su due cotture farebbe più danni che
 * altro.
 */
export function tendenza(idTaglio) {
    const voci = perTaglio(idTaglio).filter(v => v.esito);
    const conta = { poco: 0, punto: 0, troppo: 0 };
    for (const v of voci) conta[v.esito] = (conta[v.esito] || 0) + 1;

    if (voci.length < 3) {
        return { totale: voci.length, conta, suggerimento: null };
    }

    const soglia = Math.ceil(voci.length * 0.6);
    let suggerimento = null;

    if (conta.troppo >= soglia) {
        suggerimento = `${conta.troppo} cotture su ${voci.length} sono uscite troppo cotte. `
            + 'Non è sfortuna: i tempi di questa curva sono lunghi per il tuo kamado. '
            + 'Abbassa del 10% le ancore della curva in dati/cottura/coefficienti.js, oppure alza il carryover — '
            + 'se il carryover è sottostimato, la temperatura di estrazione esce troppo alta.';
    } else if (conta.poco >= soglia) {
        suggerimento = `${conta.poco} cotture su ${voci.length} sono uscite poco cotte. `
            + 'Alza del 10% le ancore della curva in dati/cottura/coefficienti.js. '
            + 'Prima però controlla la temperatura di camera reale con un termometro indipendente: '
            + 'il termometro nel coperchio del kamado legge la cupola, non la griglia, e spesso segna di più.';
    } else if (conta.punto >= soglia) {
        suggerimento = `${conta.punto} cotture su ${voci.length} al punto. I coefficienti per questo taglio sono tarati bene: non toccarli.`;
    }

    return { totale: voci.length, conta, suggerimento };
}

export function scartaStorico() {
    try {
        localStorage.removeItem(CHIAVE);
    } catch { /* niente da fare */ }
}
