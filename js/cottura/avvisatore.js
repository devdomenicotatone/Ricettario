/**
 * AVVISATORE.JS — quello che il telefono fa mentre cuoci: suono, vibrazione,
 * notifiche e schermo che resta accesso.
 *
 * Quattro API del browser che hanno in comune una cosa sola, ma decisiva: hanno
 * tutte lo stesso ciclo di vita (attive mentre un timer corre) e tutte possono
 * non esserci. Ognuna degrada in silenzio: se il Wake Lock non c'è lo schermo si
 * spegne e i timer continuano a funzionare, se le notifiche sono negate resta il
 * suono, se l'audio è bloccato resta la vibrazione. Nessuna di queste mancanze
 * rompe la cottura.
 *
 * Il suono è generato con Web Audio, non è un file: il sito non fa richieste a
 * terze parti e non ha senso aggiungere un mp3 per tre note.
 */

let contesto = null;
let notificheChieste = false;
let sentinella = null;

// ═══════════════════════════════════════════════════════════════
//  SBLOCCO
// ═══════════════════════════════════════════════════════════════

/**
 * Da chiamare sul primo tocco dell'utente (l'avvio del primo timer).
 *
 * L'audio nei browser non può partire senza un gesto dell'utente: se creassi il
 * contesto al caricamento della pagina resterebbe sospeso e il primo allarme
 * sarebbe muto. Lo stesso momento è quello giusto per chiedere il permesso alle
 * notifiche: l'utente ha appena detto "avvia", quindi la richiesta ha un motivo
 * evidente invece di arrivare a freddo.
 */
export async function sblocca() {
    try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx && !contesto) contesto = new AudioCtx();
        if (contesto?.state === 'suspended') await contesto.resume();
    } catch {
        contesto = null;
    }

    if (!notificheChieste && 'Notification' in window && Notification.permission === 'default') {
        notificheChieste = true;
        try {
            await Notification.requestPermission();
        } catch { /* niente notifiche, pazienza */ }
    }
}

// ═══════════════════════════════════════════════════════════════
//  SUONO
// ═══════════════════════════════════════════════════════════════

function nota(frequenza, inizioS, durataS, volume = 0.22) {
    if (!contesto) return;
    const osc = contesto.createOscillator();
    const guadagno = contesto.createGain();
    osc.type = 'sine';
    osc.frequency.value = frequenza;

    const t = contesto.currentTime + inizioS;
    // Attacco e rilascio morbidi: un'onda tagliata di netto fa "clic"
    guadagno.gain.setValueAtTime(0, t);
    guadagno.gain.linearRampToValueAtTime(volume, t + 0.015);
    guadagno.gain.linearRampToValueAtTime(0, t + durataS);

    osc.connect(guadagno).connect(contesto.destination);
    osc.start(t);
    osc.stop(t + durataS + 0.02);
}

/**
 * `tipo`:
 *   'fase'  — una fase ha raggiunto il tempo minimo: tre note che salgono
 *   'fine'  — cottura completata: una cadenza più lunga
 *   'tocco' — conferma discreta di un comando
 */
export function suona(tipo = 'fase') {
    if (!contesto) return;
    if (tipo === 'tocco') {
        nota(880, 0, 0.07, 0.12);
        return;
    }
    if (tipo === 'fine') {
        [523, 659, 784, 1047].forEach((f, i) => nota(f, i * 0.16, 0.3));
        return;
    }
    [784, 784, 1047].forEach((f, i) => nota(f, i * 0.22, 0.18));
}

// ═══════════════════════════════════════════════════════════════
//  VIBRAZIONE
// ═══════════════════════════════════════════════════════════════

export function vibra(tipo = 'fase') {
    if (!navigator.vibrate) return;
    const schemi = {
        fase: [200, 120, 200, 120, 400],
        fine: [500, 200, 500],
        tocco: [30],
    };
    try {
        navigator.vibrate(schemi[tipo] || schemi.fase);
    } catch { /* alcuni browser la dichiarano e non la fanno */ }
}

// ═══════════════════════════════════════════════════════════════
//  NOTIFICHE
// ═══════════════════════════════════════════════════════════════

/**
 * Su iOS le notifiche web arrivano solo se il sito è stato aggiunto alla
 * schermata Home: il manifest c'è, quindi è possibile, ma non è automatico.
 * Chi non le ha si accorge comunque della fase finita dal suono e dalla
 * vibrazione, che è il motivo per cui non sono l'unico canale.
 */
export function notifica(titolo, corpo) {
    if (!('Notification' in window) || Notification.permission !== 'granted') return;
    try {
        new Notification(titolo, {
            body: corpo,
            icon: '/Ricettario/images/emoji/thermometer.png',
            badge: '/Ricettario/images/emoji/fire.png',
            tag: 'cottura-kamado',
            renotify: true,
        });
    } catch { /* Safari lancia in certi contesti */ }
}

/** Suono + vibrazione + notifica in un colpo. */
export function avvisa(tipo, titolo, corpo) {
    suona(tipo);
    vibra(tipo);
    if (titolo) notifica(titolo, corpo);
}

// ═══════════════════════════════════════════════════════════════
//  SCHERMO ACCESO (Wake Lock)
// ═══════════════════════════════════════════════════════════════

/**
 * Tiene lo schermo accesso mentre un timer corre.
 *
 * Serve due volte: perché non devi sbloccare il telefono con le mani sporche
 * per vedere quanto manca, e perché con la pagina in primo piano l'allarme
 * suona all'istante giusto invece che al primo risveglio della scheda.
 *
 * La sentinella viene rilasciata dal browser da sola quando la pagina passa in
 * secondo piano: va richiesta di nuovo al ritorno, e ci pensa chi chiama
 * ascoltando `visibilitychange`.
 */
export async function tieniSchermoAcceso(attivo) {
    if (!('wakeLock' in navigator)) return false;

    if (!attivo) {
        try {
            await sentinella?.release();
        } catch { /* già rilasciata */ }
        sentinella = null;
        return false;
    }

    if (sentinella) return true;
    try {
        sentinella = await navigator.wakeLock.request('screen');
        sentinella.addEventListener('release', () => { sentinella = null; });
        return true;
    } catch {
        // Succede se la pagina non è visibile o il documento non è attivo
        sentinella = null;
        return false;
    }
}

export function schermoTenutoAcceso() {
    return sentinella != null;
}

export function supporti() {
    return {
        suono: Boolean(window.AudioContext || window.webkitAudioContext),
        vibrazione: Boolean(navigator.vibrate),
        notifiche: 'Notification' in window,
        schermo: 'wakeLock' in navigator,
    };
}
