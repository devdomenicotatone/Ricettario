/**
 * MOTORE.JS — dagli input del form al piano di cottura a fasi.
 *
 * REGOLE DI QUESTO FILE, da non rompere:
 *
 *   1. È PURO. Nessun accesso al DOM, nessun `import.meta`, nessuna API del
 *      browser. Lo importa anche Node, dentro scripts/build-cottura.js e
 *      scripts/generate-og.js: è lo stesso motore che gira nel browser e in
 *      fase di build, e questo è il motivo per cui le pagine pre-generate non
 *      possono divergere da quello che l'utente vede.
 *
 *   2. I DATI ARRIVANO COME ARGOMENTO, non con un import. Node e Vite
 *      importano il JSON con sintassi diverse; passandoli dall'esterno il
 *      problema non esiste e il motore diventa verificabile con dati finti.
 *
 *   3. NON DECIDE NIENTE SUI NUMERI. Ogni coefficiente viene da
 *      dati/cottura/coefficienti.js. Se un numero è scritto qui, è un bug.
 */

import {
    CURVE, PARTENZA, K_OSSO, CARRYOVER, CAMERA, RIPOSO, SOGLIE,
} from '../../dati/cottura/coefficienti.js';
import * as kamado from './kamado.js';
import { valutaRegole } from './regole.js';

/**
 * Registry delle famiglie di dispositivo. Aggiungere un kettle a carbone o un
 * pellet significa scrivere il modulo e aggiungere una riga qui.
 */
const FAMIGLIE = { kamado };

// ═══════════════════════════════════════════════════════════════
//  INTERPOLAZIONE
// ═══════════════════════════════════════════════════════════════

/** Segmento di ancore che contiene x. Fuori dagli estremi usa quello vicino. */
function segmento(ancore, x, chiaveX) {
    if (x <= ancore[0][chiaveX]) return [ancore[0], ancore[1]];
    for (let i = 0; i < ancore.length - 1; i++) {
        if (x <= ancore[i + 1][chiaveX]) return [ancore[i], ancore[i + 1]];
    }
    return [ancore[ancore.length - 2], ancore[ancore.length - 1]];
}

/**
 * Interpolazione log-log tra le ancore: la curva passa esattamente per i valori
 * osservati, e tra due ancore segue l'esponente che quelle due ancore
 * implicano. Fuori dalla tabella estrapola con l'esponente del segmento più
 * vicino, che è meglio di una retta ma resta un'estrapolazione.
 */
export function interpolaLogLog(ancore, x, chiaveX, chiaveY) {
    const [a, b] = segmento(ancore, x, chiaveX);
    const t = Math.log(x / a[chiaveX]) / Math.log(b[chiaveX] / a[chiaveX]);
    return a[chiaveY] * Math.pow(b[chiaveY] / a[chiaveY], t);
}

/** Interpolazione lineare, per grandezze che non hanno crescita esponenziale. */
export function interpolaLineare(ancore, x, chiaveX, chiaveY) {
    const [a, b] = segmento(ancore, x, chiaveX);
    const t = (x - a[chiaveX]) / (b[chiaveX] - a[chiaveX]);
    return a[chiaveY] + t * (b[chiaveY] - a[chiaveY]);
}

// ═══════════════════════════════════════════════════════════════
//  MODELLO TERMICO
// ═══════════════════════════════════════════════════════════════

/**
 * Tempo per portare il cuore da T0 a Tc in una camera a Tcam, a meno di una
 * costante che dipende dalla geometria:
 *
 *     t ∝ ln( (Tcam − T0) / (Tcam − Tc) )
 *
 * Verificato contro le ancore: a camera 150 °C predice −25%, che è il valore
 * osservato. Serve per correggere sia la temperatura di camera sia il grado di
 * cottura, dove non esistono tabelle.
 *
 * NON serve per la temperatura di partenza della carne: lì il modello predice
 * −25% mentre l'esperienza dice −10/15%, perché ignora il ritardo di
 * conduzione interna. Per quella si usa il coefficiente piatto K_PARTENZA.
 */
function f(cuoreC, cameraC, inizialeC) {
    return Math.log((cameraC - inizialeC) / (cameraC - cuoreC));
}

/**
 * Fattore che corregge la curva di riferimento per camera e cuore effettivi.
 * Usa sempre la temperatura iniziale DI RIFERIMENTO, non quella scelta
 * dall'utente: altrimenti la partenza verrebbe contata due volte.
 */
export function fattoreTermico(curva, cuoreC, cameraC) {
    if (cameraC <= cuoreC + 5) {
        throw new Error(`Camera a ${cameraC} °C troppo bassa per un cuore a ${cuoreC} °C.`);
    }
    const rif = f(curva.cuore_rif, curva.camera_rif, curva.iniziale_rif);
    return f(cuoreC, cameraC, curva.iniziale_rif) / rif;
}

/**
 * Temperatura al cuore attesa dopo `t` minuti, per i checkpoint intermedi.
 * Ricava la costante di tempo dal fatto che a `tTot` il cuore è a `cuoreFine`.
 *
 * Serve più di quanto sembri: a metà del tempo il cuore è molto più freddo di
 * metà strada — su una fiorentina spessa, a metà cottura sta intorno ai 30 °C.
 * Senza checkpoint chi ha la sonda pensa di essere in ritardo e alza la
 * temperatura, che è il modo classico di rovinare un reverse sear.
 */
export function cuoreAlMinuto(t, tTot, cameraC, inizialeC, cuoreFineC) {
    const tau = tTot / Math.log((cameraC - inizialeC) / (cameraC - cuoreFineC));
    return cameraC - (cameraC - inizialeC) * Math.exp(-t / tau);
}

// ═══════════════════════════════════════════════════════════════
//  CARRYOVER ED ESTRAZIONE
// ═══════════════════════════════════════════════════════════════

/** Salita al cuore durante il riposo, in funzione di massa/spessore e metodo. */
export function carryover({ famiglia, spessore, peso, metodo }) {
    const k = CARRYOVER.k_metodo[metodo] ?? 1;
    const base = famiglia === 'bistecca'
        ? interpolaLineare(CARRYOVER.ancore, spessore, 'spessore', 'gradi')
        : interpolaLineare(CARRYOVER.per_peso, peso, 'peso', 'gradi');
    return arrotonda(base * k, 0.5);
}

/**
 * Temperatura di estrazione: il numero più importante di tutta la schermata.
 *
 * È `target − carryover`, con UN'ECCEZIONE: non scende mai sotto la soglia di
 * sicurezza del taglio. Sul pollo l'aritmetica direbbe di estrarre a 70 per
 * arrivare a 74 dopo il riposo; qui la soglia vince, perché su un patogeno non
 * si scommette su una stima. Scelta concordata, non una svista.
 */
export function estrazione({ targetC, carryoverC, sogliaSicurezzaC }) {
    const grezza = targetC - carryoverC;
    if (sogliaSicurezzaC != null && grezza < sogliaSicurezzaC) {
        return {
            c: sogliaSicurezzaC,
            target_c: targetC,
            carryover_c: carryoverC,
            pavimento_sicurezza: true,
        };
    }
    return {
        c: Math.round(grezza),
        target_c: targetC,
        carryover_c: carryoverC,
        pavimento_sicurezza: false,
    };
}

// ═══════════════════════════════════════════════════════════════
//  DURATA DELLA COTTURA PRINCIPALE
// ═══════════════════════════════════════════════════════════════

function durataPerSpessore(curva, { spessore, cuoreC, cameraC, partenza, osso }) {
    const kTermico = fattoreTermico(curva, cuoreC, cameraC);
    const kPartenza = PARTENZA[partenza]?.k ?? 1;
    const kOsso = osso ? K_OSSO : 1;
    const k = kTermico * kPartenza * kOsso;
    return [
        interpolaLogLog(curva.ancore, spessore, 'spessore', 'min') * k,
        interpolaLogLog(curva.ancore, spessore, 'spessore', 'max') * k,
    ];
}

function durataPerPeso(curva, { peso, cuoreC, cameraC, partenza, osso }) {
    const kTermico = fattoreTermico(curva, cuoreC, cameraC);
    const kPartenza = PARTENZA[partenza]?.k ?? 1;
    const kOsso = osso ? K_OSSO : 1;
    // Esponente sotto 1: un pezzo da 4 kg non impiega il doppio di uno da 2.
    const scala = Math.pow(peso, curva.esponente_peso) * kTermico * kPartenza * kOsso;
    return [curva.minuti_1kg.min * scala, curva.minuti_1kg.max * scala];
}

// ═══════════════════════════════════════════════════════════════
//  PIANO
// ═══════════════════════════════════════════════════════════════

/**
 * @param {object} input  scelte del form
 * @param {{tagli: object[], dispositivi: object[]}} dati  contenuto dei JSON
 * @returns {object} piano a fasi
 */
export function piano(input, dati) {
    const taglio = dati.tagli.find(t => t.id === input.taglio);
    if (!taglio) throw new Error(`Taglio sconosciuto: ${input.taglio}`);

    const dispositivo = dati.dispositivi.find(d => d.id === input.dispositivo);
    if (!dispositivo) throw new Error(`Dispositivo sconosciuto: ${input.dispositivo}`);

    const famiglia = FAMIGLIE[dispositivo.famiglia];
    if (!famiglia) throw new Error(`Famiglia senza modulo di comportamento: ${dispositivo.famiglia}`);

    const metodo = taglio.metodi_ammessi.includes(input.metodo)
        ? input.metodo
        : taglio.metodo_consigliato;

    // Cottura richiesta ma non ammessa: si ripiega sulla più vicina consentita
    // e il motivo finisce negli avvisi. Bloccare senza spiegare insegna solo
    // che lo strumento è rotto.
    const cotturaRichiesta = input.cottura;
    const cottura = taglio.cotture_ammesse.includes(cotturaRichiesta)
        ? cotturaRichiesta
        : taglio.cotture_ammesse[0];

    const targetC = taglio.temperature_cuore[cottura];
    const spessore = input.spessore ?? taglio.spessore.default;
    const peso = input.peso ?? taglio.peso.default;
    const osso = input.osso ?? taglio.con_osso === 'sempre';
    const partenza = input.partenza ?? 'frigo';

    const contesto = {
        input, taglio, dispositivo, metodo, cottura, cotturaRichiesta,
        targetC, spessore, peso, osso, partenza,
    };

    const costruttore = metodo === 'low_and_slow' ? pianoLowAndSlow : pianoBistecca;
    const corpo = costruttore(contesto, famiglia);

    const totale = corpo.fasi.reduce(
        (acc, fase) => fase.durata_min
            ? [acc[0] + fase.durata_min[0], acc[1] + fase.durata_min[1]]
            : acc,
        [0, 0],
    );

    const oreBassa = corpo.ore_bassa ?? totale[1] / 60;
    const oreAlta = corpo.ore_alta ?? 0;

    return {
        taglio: { id: taglio.id, nome: taglio.nome, famiglia: taglio.famiglia, specie: taglio.specie },
        dispositivo: { id: dispositivo.id, nome: dispositivo.nome, griglia_cm: dispositivo.griglia_cm },
        metodo,
        cottura,
        misura: taglio.parametro_dominante === 'spessore'
            ? { spessore_cm: spessore, peso_kg: peso, dominante: 'spessore' }
            : { spessore_cm: spessore, peso_kg: peso, dominante: 'peso' },
        percorso: input.sonda ? 'temperature' : 'tempi',
        estrazione: corpo.estrazione,
        fasi: corpo.fasi,
        totale_min: [Math.round(totale[0]), Math.round(totale[1])],
        porzioni: Math.max(1, Math.round((peso * 1000) / taglio.porzioni_g_per_persona)),
        ingombro: famiglia.ingombro(taglio, dispositivo),
        carbone: famiglia.carbone(dispositivo, oreBassa, oreAlta),
        avvisi: valutaRegole(contesto, {
            famiglia,
            oreTotali: totale[1] / 60,
            estrazione: corpo.estrazione,
            // Le regole ne hanno bisogno per capire in quale fase agganciarsi:
            // la cottura principale si chiama `indiretta` o `finitura` secondo
            // il metodo, e una regola non deve dipendere da quale dei due.
            fasi: corpo.fasi,
        }),
        note_specifiche: taglio.note_specifiche,
        errori_comuni: taglio.errori_comuni,
        // Non è un disclaimer a fondo pagina: è il primo dato del piano.
        premessa: 'I tempi sono stime, e restano stime anche quando sono precise al minuto. Il dato che comanda è la temperatura al cuore.',
    };
}

// ── Bistecche, arrosti, tagli interi ──────────────────────────

function pianoBistecca(ctx, famiglia) {
    const { taglio, dispositivo, metodo, targetC, spessore, peso, osso, partenza } = ctx;

    const curva = CURVE[taglio.curva_tempo];
    if (!curva) throw new Error(`${taglio.id}: curva "${taglio.curva_tempo}" inesistente`);

    const cameraBassa = cameraConsentita(
        metodo === 'diretta' ? CAMERA.diretta.unica : CAMERA[metodo].bassa,
        taglio.camera_ammessa,
    );
    const cameraAlta = metodo === 'reverse_sear' ? CAMERA.reverse_sear.alta : cameraBassa;

    const carry = carryover({ famiglia: taglio.famiglia, spessore, peso, metodo });
    const estr = estrazione({
        targetC,
        carryoverC: carry,
        sogliaSicurezzaC: taglio.soglia_sicurezza,
    });

    const durata = curva.tipo === 'spessore'
        ? durataPerSpessore(curva, { spessore, cuoreC: estr.c, cameraC: cameraBassa, partenza, osso })
        : durataPerPeso(curva, { peso, cuoreC: estr.c, cameraC: cameraBassa, partenza, osso });

    const prep = famiglia.preparazione(dispositivo, cameraBassa);
    const sear = famiglia.scottatura(dispositivo);

    const fasi = [{
        id: 'braci',
        nome: 'Braci e fumo pulito',
        durata_min: prep.durata_min,
        camera_c: prep.stabilizza_a_c,
        cuore_atteso_c: null,
        azione: prep.istruzioni,
        valvole: prep.valvole,
        timer: true,
    }];

    if (metodo === 'diretta') {
        const searMin = (sear.secondi_per_lato[1] * 2) / 60;
        const finitura = [
            Math.max(2, durata[0] - searMin),
            Math.max(3, durata[1] - searMin),
        ];
        fasi.push({
            id: 'scottatura_iniziale',
            nome: 'Scottatura sulle due facce',
            durata_min: [r(searMin), r(searMin) + 1],
            camera_c: cameraBassa,
            cuore_atteso_c: null,
            azione: [
                `${sear.secondi_per_lato[0]}-${sear.secondi_per_lato[1]} secondi per lato sulla brace viva, senza muovere la carne prima che si stacchi da sola.`,
                sear.nota,
            ].filter(Boolean),
            timer: true,
        });
        fasi.push({
            id: 'finitura',
            nome: 'Finitura nella zona meno calda',
            durata_min: [r(finitura[0]), r(finitura[1])],
            camera_c: cameraBassa,
            cuore_atteso_c: estr.c,
            checkpoint: checkpoint(finitura[1], cameraBassa, temperaturaIniziale(partenza), estr.c),
            azione: [`Sposta il pezzo fuori dalla brace diretta e chiudi il coperchio. Estrai a ${estr.c} °C.`],
            timer: true,
        });
    } else {
        fasi.push({
            id: 'indiretta',
            nome: metodo === 'indiretta_lenta' ? 'Indiretta lenta' : 'Cottura indiretta',
            durata_min: [r(durata[0]), r(durata[1])],
            camera_c: cameraBassa,
            cuore_atteso_c: estr.c,
            checkpoint: checkpoint(durata[1], cameraBassa, temperaturaIniziale(partenza), estr.c),
            // Le indicazioni su muscoli multipli e rotazione sui bordi non sono
            // qui: sono regole in regole.js con `fase: 'indiretta'`, e la UI le
            // mostra dentro questo passaggio. Un testo, un posto.
            azione: [
                `Deflettore in posizione, carne al centro, coperchio chiuso. Camera a ${cameraBassa} °C.`,
            ],
            timer: true,
        });
    }

    fasi.push({
        id: 'estrazione',
        nome: 'Estrazione',
        durata_min: null,
        camera_c: null,
        cuore_atteso_c: estr.c,
        azione: [
            `Togli la carne a ${estr.c} °C al cuore. Non a ${estr.target_c}: durante il riposo sale ancora di ${estr.carryover_c} °C da sola.`,
            estr.pavimento_sicurezza
                ? `Qui l'estrazione non scende sotto la soglia di sicurezza di ${taglio.soglia_sicurezza} °C, anche se il conto del carryover lo permetterebbe.`
                : null,
        ].filter(Boolean),
        timer: false,
    });

    if (metodo === 'reverse_sear') {
        const riposo = riposoPreScottatura(spessore);
        const trans = famiglia.transizione(dispositivo, cameraBassa, cameraAlta);
        fasi.push({
            id: 'riposo_salita',
            nome: 'Riposo della carne + salita del kamado',
            durata_min: [
                Math.max(riposo[0], trans.durata_min[0]),
                Math.max(riposo[1], trans.durata_min[1]),
            ],
            camera_c: cameraAlta,
            cuore_atteso_c: estr.target_c,
            parallelo: true,
            azione: [
                'Sono la stessa fase, non due attese in fila: la carne riposa mentre il kamado sale.',
                ...trans.istruzioni,
            ],
            valvole: trans.valvole,
            timer: true,
        });
        fasi.push({
            id: 'scottatura',
            nome: 'Scottatura finale',
            durata_min: [1, 3],
            camera_c: cameraAlta,
            cuore_atteso_c: null,
            azione: [
                `${sear.secondi_per_lato[0]}-${sear.secondi_per_lato[1]} secondi per lato. Guarda la crosta, non l'orologio: quando è uniformemente bruna e la carne si stacca dalla griglia senza strappare, è fatta.`,
                sear.nota,
            ].filter(Boolean),
            timer: true,
        });
    }

    fasi.push({
        id: 'riposo_finale',
        nome: 'Riposo finale e taglio',
        durata_min: taglio.famiglia === 'bistecca'
            ? RIPOSO.finale_min
            : [r(peso * RIPOSO.arrosto_min_per_kg), r(peso * RIPOSO.arrosto_min_per_kg * 1.5)],
        camera_c: null,
        cuore_atteso_c: estr.target_c,
        azione: [
            'Taglia perpendicolare alle fibre: accorcia le fibre invece di seguirle, ed è la differenza tra tenero e filoso.',
            taglio.muscoli_multipli && taglio.id === 'fiorentina'
                ? 'Stacca prima filetto e controfiletto dall\'osso, poi affetta i due muscoli separatamente: hanno fibre in direzioni diverse.'
                : null,
        ].filter(Boolean),
        timer: true,
    });

    const oreAlta = metodo === 'reverse_sear' ? 0.4 : (metodo === 'diretta' ? 0.5 : 0);

    return {
        fasi,
        estrazione: estr,
        ore_bassa: (durata[1] + prep.durata_min[1]) / 60,
        ore_alta: oreAlta,
    };
}

// ── Low & slow ────────────────────────────────────────────────

function pianoLowAndSlow(ctx, famiglia) {
    const { taglio, dispositivo, peso } = ctx;
    const ls = taglio.low_and_slow;
    const cameraC = arrotonda((ls.temperatura_camera[0] + ls.temperatura_camera[1]) / 2, 5);

    const totale = ls.durata_fissa_h
        ? [ls.durata_fissa_h[0] * 60, ls.durata_fissa_h[1] * 60]
        : [ls.minuti_per_kg[0] * peso, ls.minuti_per_kg[1] * peso];

    // Nel low & slow il carryover esiste ma non serve a niente: si estrae a 95-96 °C
    // per sciogliere il collagene, e nessuna soglia di doneness è in gioco. Mostrarlo
    // farebbe credere che si debba togliere la carne cinque gradi prima.
    const estr = {
        c: ls.target_finale,
        target_c: ls.target_finale,
        carryover_c: null,
        pavimento_sicurezza: false,
        criterio: ls.criterio,
    };

    const prep = famiglia.preparazione(dispositivo, cameraC);
    const fasi = [{
        id: 'braci',
        nome: 'Braci e fumo pulito',
        durata_min: prep.durata_min,
        camera_c: prep.stabilizza_a_c,
        cuore_atteso_c: null,
        azione: prep.istruzioni,
        valvole: prep.valvole,
        timer: true,
    }];

    if (ls.stallo) {
        // Le tre fasi sono una ripartizione del totale, non tre stime
        // indipendenti: sommare gli estremi peggiori di intervalli separati
        // produceva un massimo più lungo dell'intera cottura, e sulla fase
        // finale addirittura un intervallo rovesciato (4,5-3,5 h).
        // Lo stallo resta dichiarato per quello che è — la parte meno
        // prevedibile — nel testo della sua fase.
        const quota = (t) => {
            const pre = t * 0.40;
            const stallo = Math.min(Math.max(t * 0.25, ls.stallo.durata_min[0]), ls.stallo.durata_min[1]);
            return { pre, stallo, post: Math.max(30, t - pre - stallo) };
        };
        const q0 = quota(totale[0]);
        const q1 = quota(totale[1]);
        const pre = [q0.pre, q1.pre];
        const stallo = [q0.stallo, q1.stallo];
        const post = [q0.post, q1.post];
        fasi.push({
            id: 'salita',
            nome: `Salita fino allo stallo (${ls.stallo.da} °C)`,
            durata_min: [r(pre[0]), r(pre[1])],
            camera_c: cameraC,
            cuore_atteso_c: ls.stallo.da,
            azione: [`Camera a ${cameraC} °C e coperchio chiuso. Qui il legno da affumicatura lavora: dopo non serve più.`],
            timer: true,
        });
        fasi.push({
            id: 'stallo',
            nome: 'Stallo',
            durata_min: [r(stallo[0]), r(stallo[1])],
            camera_c: cameraC,
            cuore_atteso_c: ls.stallo.a,
            azione: [
                `Tra i ${ls.stallo.da} e i ${ls.stallo.a} °C la temperatura si ferma, e può restare ferma per ore: non è il kamado che si è spento, è l'acqua che evapora e raffredda la superficie tanto quanto il fuoco la scalda.`,
                `È la parte meno prevedibile della cottura: su questo taglio dura tipicamente tra ${Math.round(ls.stallo.durata_min[0] / 60 * 10) / 10} e ${Math.round(ls.stallo.durata_min[1] / 60 * 10) / 10} ore, e il tempo che si prende lo toglie o lo aggiunge alle fasi intorno.`,
                'Non alzare la temperatura per sbloccarlo: asciughi la carne senza guadagnare tempo.',
                ls.stagnola_ammessa
                    ? 'Qui la stagnola è tecnica corretta e non scorciatoia: avvolgere blocca l\'evaporazione e supera lo stallo. Costa un po\' di crosta.'
                    : null,
            ].filter(Boolean),
            timer: true,
        });
        fasi.push({
            id: 'finitura',
            nome: `Fase finale fino a ${ls.target_finale} °C`,
            durata_min: [r(post[0]), r(post[1])],
            camera_c: cameraC,
            cuore_atteso_c: ls.target_finale,
            azione: [`Il numero è un'indicazione: il criterio vero è che ${ls.criterio}.`],
            timer: true,
        });
    } else {
        fasi.push({
            id: 'cottura',
            nome: 'Cottura indiretta lenta',
            durata_min: [r(totale[0]), r(totale[1])],
            camera_c: cameraC,
            cuore_atteso_c: ls.target_finale,
            azione: [
                `Camera a ${cameraC} °C. Il legno lavora nelle prime ore, poi solo carbone.`,
                `Il criterio non è il numero ma il cedimento: ${ls.criterio}.`,
            ],
            timer: true,
        });
    }

    fasi.push({
        id: 'riposo_finale',
        nome: 'Riposo in borsa termica',
        durata_min: RIPOSO.low_and_slow_min,
        camera_c: null,
        cuore_atteso_c: null,
        azione: [
            'Avvolto e chiuso in una borsa termica. Non è un\'attesa facoltativa: è il tempo in cui il collagene sciolto si redistribuisce.',
            'Sfilacciare o affettare appena estratto significa perdere per terra tutto quello che dieci ore hanno prodotto.',
        ],
        timer: true,
    });

    return {
        fasi,
        estrazione: estr,
        ore_bassa: (totale[1] + prep.durata_min[1]) / 60,
        ore_alta: 0,
    };
}

// ═══════════════════════════════════════════════════════════════
//  UTILITÀ
// ═══════════════════════════════════════════════════════════════

/**
 * La temperatura di camera la propone il metodo, ma alcuni tagli hanno un
 * intervallo fuori dal quale il risultato è sbagliato anche se il cuore arriva
 * al numero giusto: un pollo cotto a 110 °C raggiunge i 74 al cuore e ha la
 * pelle molle e gommosa. Dove il taglio dichiara `camera_ammessa`, comanda lui.
 */
function cameraConsentita(proposta, ammessa) {
    if (!Array.isArray(ammessa)) return proposta;
    return Math.min(Math.max(proposta, ammessa[0]), ammessa[1]);
}

function checkpoint(durataMax, cameraC, inizialeC, cuoreFineC) {
    return [0.5, 0.75].map(frazione => ({
        al_minuto: r(durataMax * frazione),
        cuore_atteso_c: Math.round(cuoreAlMinuto(durataMax * frazione, durataMax, cameraC, inizialeC, cuoreFineC)),
    }));
}

function riposoPreScottatura(spessore) {
    const base = spessore * RIPOSO.pre_scottatura_min_per_cm;
    const min = Math.min(Math.max(base, RIPOSO.pre_scottatura_min), RIPOSO.pre_scottatura_max);
    return [Math.round(min), Math.round(Math.min(min * 1.4, RIPOSO.pre_scottatura_max + 3))];
}

function temperaturaIniziale(partenza) {
    return PARTENZA[partenza]?.gradi ?? PARTENZA.frigo.gradi;
}

function r(n) {
    return n >= 30 ? Math.round(n / 5) * 5 : Math.round(n);
}

function arrotonda(n, passo) {
    return Math.round(n / passo) * passo;
}
