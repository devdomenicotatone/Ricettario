/**
 * TIMER.JS — i timer delle fasi di cottura.
 *
 * REGOLA CENTRALE: nessun contatore che decrementa. Lo stato è fatto di
 * ISTANTI ASSOLUTI (`avviatoA`, `pausaDa`, `completataA`) e il tempo trascorso
 * si ricalcola ogni volta da `Date.now()`.
 *
 * Non è pignoleria. Un `setInterval` che sottrae un secondo per volta viene
 * strozzato quando la scheda passa in secondo piano e si ferma del tutto quando
 * il telefono blocca lo schermo: dopo mezz'ora in tasca il conteggio sarebbe
 * indietro di mezz'ora, e su una cottura è la differenza tra media al sangue e
 * ben cotta. Con gli istanti assoluti, l'intervallo serve solo a ridisegnare i
 * numeri: se non gira, al ritorno il tempo è comunque esatto.
 *
 * Tutte le funzioni ricevono `ora` dall'esterno invece di leggere l'orologio da
 * sole: così la logica è verificabile senza aspettare quaranta minuti.
 *
 * L'ALLARME SUONA AL TEMPO MINIMO, non al massimo. La finestra 35-45 minuti non
 * significa "pronto a 45": significa "da 35 comincia a controllare". Un allarme
 * sul massimo arriverebbe quando la carne è già oltre.
 */

const CHIAVE = 'ricettario-cottura-sessione';
const VERSIONE = 1;

// ═══════════════════════════════════════════════════════════════
//  SESSIONE
// ═══════════════════════════════════════════════════════════════

/**
 * Una sessione è una cottura in corso: la configurazione che l'ha generata più
 * lo stato di ogni fase. Viene salvata a ogni cambiamento, così chiudere il
 * browser in giardino non perde la cottura.
 */
export function creaSessione(config, piano, ora) {
    return {
        versione: VERSIONE,
        id: `c${ora}`,
        iniziataA: ora,
        config,
        etichetta: `${piano.taglio.nome} · ${piano.misura.dominante === 'spessore'
            ? `${piano.misura.spessore_cm} cm` : `${piano.misura.peso_kg} kg`}`,
        fasi: piano.fasi
            .filter(f => f.timer && f.durata_min)
            .map(f => ({
                id: f.id,
                nome: f.nome,
                minMs: f.durata_min[0] * 60000,
                maxMs: f.durata_min[1] * 60000,
                avviatoA: null,
                pausaDa: null,
                pausaTotale: 0,
                completataA: null,
            })),
    };
}

export function caricaSessione() {
    try {
        const s = JSON.parse(localStorage.getItem(CHIAVE) || 'null');
        if (!s || s.versione !== VERSIONE || !Array.isArray(s.fasi)) return null;
        return s;
    } catch {
        return null;
    }
}

export function salvaSessione(s) {
    try {
        localStorage.setItem(CHIAVE, JSON.stringify(s));
    } catch {
        // Modalità privata o spazio esaurito: i timer continuano a funzionare
        // in memoria, si perde solo la capacità di riprendere dopo un ricarico.
    }
}

export function scartaSessione() {
    try {
        localStorage.removeItem(CHIAVE);
    } catch { /* niente da fare */ }
}

/** Due configurazioni sono la stessa cottura? Confronto sui campi che contano. */
export function stessaCottura(a, b) {
    if (!a || !b) return false;
    return ['taglio', 'spessore', 'peso', 'cottura', 'metodo', 'dispositivo']
        .every(k => a[k] === b[k]);
}

// ═══════════════════════════════════════════════════════════════
//  COMANDI
// ═══════════════════════════════════════════════════════════════

function trova(s, faseId) {
    return s.fasi.find(f => f.id === faseId);
}

export function avvia(s, faseId, ora) {
    const f = trova(s, faseId);
    if (!f || f.avviatoA) return s;
    f.avviatoA = ora;
    f.pausaDa = null;
    f.pausaTotale = 0;
    f.completataA = null;
    return s;
}

export function pausa(s, faseId, ora) {
    const f = trova(s, faseId);
    if (!f || !f.avviatoA || f.pausaDa || f.completataA) return s;
    f.pausaDa = ora;
    return s;
}

export function riprendi(s, faseId, ora) {
    const f = trova(s, faseId);
    if (!f || !f.pausaDa) return s;
    f.pausaTotale += Math.max(0, ora - f.pausaDa);
    f.pausaDa = null;
    return s;
}

export function completa(s, faseId, ora) {
    const f = trova(s, faseId);
    if (!f || f.completataA) return s;
    if (f.pausaDa) riprendi(s, faseId, ora);
    if (!f.avviatoA) f.avviatoA = ora;
    f.completataA = ora;
    return s;
}

export function azzera(s, faseId) {
    const f = trova(s, faseId);
    if (!f) return s;
    f.avviatoA = null;
    f.pausaDa = null;
    f.pausaTotale = 0;
    f.completataA = null;
    return s;
}

// ═══════════════════════════════════════════════════════════════
//  LETTURA DELLO STATO
// ═══════════════════════════════════════════════════════════════

/** Millisecondi effettivi di cottura, al netto delle pause. */
export function trascorso(f, ora) {
    if (!f?.avviatoA) return 0;
    const fine = f.completataA ?? ora;
    const inPausaOra = f.pausaDa ? Math.max(0, fine - f.pausaDa) : 0;
    return Math.max(0, fine - f.avviatoA - f.pausaTotale - inPausaOra);
}

/**
 * Stato completo di una fase.
 * `stato`: 'ferma' | 'in_corso' | 'in_pausa' | 'scaduta' | 'completata'
 * 'scaduta' vuol dire "tempo minimo raggiunto, vai a controllare", non "pronto".
 */
export function statoFase(s, faseId, ora) {
    const f = trova(s, faseId);
    if (!f) return null;

    const ms = trascorso(f, ora);
    const stato = f.completataA ? 'completata'
        : !f.avviatoA ? 'ferma'
            : f.pausaDa ? 'in_pausa'
                : ms >= f.minMs ? 'scaduta' : 'in_corso';

    return {
        id: f.id,
        nome: f.nome,
        stato,
        trascorsoMs: ms,
        rimanenteMs: Math.max(0, f.minMs - ms),
        oltreMs: Math.max(0, ms - f.minMs),
        minMs: f.minMs,
        maxMs: f.maxMs,
        // Frazione sul minimo: è quello il traguardo dell'allarme
        frazione: f.minMs > 0 ? Math.min(1, ms / f.minMs) : 0,
        // Oltre il massimo la carne è probabilmente andata oltre: va detto
        oltreMassimo: ms > f.maxMs,
    };
}

/** La fase su cui l'utente sta lavorando: la prima non completata avviata, o la prima non completata. */
export function faseAttiva(s, ora) {
    const inCorso = s.fasi.find(f => f.avviatoA && !f.completataA);
    if (inCorso) return statoFase(s, inCorso.id, ora);
    const prossima = s.fasi.find(f => !f.completataA);
    return prossima ? statoFase(s, prossima.id, ora) : null;
}

export function tutteCompletate(s) {
    return s.fasi.length > 0 && s.fasi.every(f => f.completataA);
}

/**
 * Fasi che hanno superato il tempo minimo senza che nessuno le abbia chiuse, e
 * per cui l'allarme non è ancora stato dato. Il campo `allarmeDato` serve
 * perché se la pagina è rimasta in secondo piano l'allarme va suonato al
 * ritorno, una volta sola, dicendo con quanto ritardo.
 */
export function allarmiDaDare(s, ora) {
    return s.fasi
        .filter(f => f.avviatoA && !f.completataA && !f.pausaDa && !f.allarmeDato
            && trascorso(f, ora) >= f.minMs)
        .map(f => {
            f.allarmeDato = true;
            return statoFase(s, f.id, ora);
        });
}

// ═══════════════════════════════════════════════════════════════
//  FORMATO
// ═══════════════════════════════════════════════════════════════

/** mm:ss, oppure h:mm:ss oltre l'ora. */
export function orologio(ms) {
    const totale = Math.max(0, Math.round(ms / 1000));
    const s = totale % 60;
    const m = Math.floor(totale / 60) % 60;
    const h = Math.floor(totale / 3600);
    const dd = (n) => String(n).padStart(2, '0');
    return h > 0 ? `${h}:${dd(m)}:${dd(s)}` : `${dd(m)}:${dd(s)}`;
}
