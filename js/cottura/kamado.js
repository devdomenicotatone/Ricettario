/**
 * KAMADO.JS — comportamento della famiglia "kamado".
 *
 * Qui sta ciò che distingue un kamado da un timer per bistecche: inerzia
 * asimmetrica, fumo pulito, burping, deflettore, valvole, carbone. I NUMERI
 * dei singoli apparecchi stanno in dati/cottura/dispositivi.json; questo file
 * contiene solo le regole che valgono per tutta la famiglia.
 *
 * Il giorno che si aggiunge un barbecue di tipo diverso (kettle a carbone, gas,
 * pellet) si scrive un modulo accanto a questo e si registra in motore.js: la
 * logica del kamado non va toccata né generalizzata a forza.
 *
 * Nessun accesso al DOM: questo modulo gira anche in Node, dentro
 * scripts/build-cottura.js e scripts/generate-og.js.
 */

import { KAMADO } from '../../dati/cottura/coefficienti.js';

export const FAMIGLIA = 'kamado';

// ═══════════════════════════════════════════════════════════════
//  VALVOLE
// ═══════════════════════════════════════════════════════════════

/**
 * Posizione indicativa delle valvole per una temperatura di camera.
 * Indicativa per davvero: cambia con il modello, la guarnizione, il carbone e
 * il vento. Il testo che accompagna il valore deve dirlo, o il numero viene
 * letto come una verità.
 */
export function valvole(temperaturaC) {
    const fascia = KAMADO.valvole.find(v => temperaturaC >= v.da && temperaturaC < v.a)
        || KAMADO.valvole[KAMADO.valvole.length - 1];
    return {
        sotto: fascia.sotto,
        sopra: fascia.sopra,
        avvertenza: 'Posizioni indicative: variano da modello a modello e vanno tarate sul tuo.',
    };
}

// ═══════════════════════════════════════════════════════════════
//  PREPARAZIONE E INERZIA
// ═══════════════════════════════════════════════════════════════

/**
 * Fase di accensione: durata e istruzioni.
 *
 * Il tempo del fumo pulito e quello di stabilizzazione si sovrappongono — sono
 * la stessa attesa, non due — quindi la durata è il maggiore dei due, non la
 * somma. Su un kamado piccolo la stabilizzazione finisce prima e comanda il
 * fumo; su uno grande è il contrario.
 *
 * L'inerzia è asimmetrica: sale in fretta e non scende. Quindi si stabilizza
 * SOTTO l'obiettivo e si sale, mai il contrario.
 */
export function preparazione(dispositivo, cameraObiettivoC) {
    const [fumoMin, fumoMax] = KAMADO.fumo_pulito_min;
    const [stabMin, stabMax] = dispositivo.stabilizzazione_min;
    const margine = dispositivo.margine_sotto_target_c;
    const stabilizzaA = cameraObiettivoC - margine;

    return {
        durata_min: [Math.max(fumoMin, stabMin), Math.max(fumoMax, stabMax)],
        stabilizza_a_c: stabilizzaA,
        obiettivo_c: cameraObiettivoC,
        valvole: valvole(stabilizzaA),
        recupero_min: dispositivo.recupero_sovratemperatura_min,
        istruzioni: [
            `Accendi e aspetta il fumo pulito: dall'accensione servono ${fumoMin}-${fumoMax} minuti perché il fumo bianco e denso diventi azzurrino e appena visibile. Mettere la carne prima deposita composti amari sulla superficie.`,
            `Stabilizza a ${stabilizzaA} °C, non a ${cameraObiettivoC}: da lì sali aprendo le valvole di poco. Se superi l'obiettivo, tornare indietro richiede ${dispositivo.recupero_sovratemperatura_min[0]}-${dispositivo.recupero_sovratemperatura_min[1]} minuti — il kamado sale in fretta e scende quasi per niente.`,
            'Metti il deflettore prima che il kamado sia caldo: dopo è rovente e va spostato con i guanti.',
        ],
    };
}

/**
 * Transizione da bassa ad alta temperatura nel reverse sear.
 * Va in parallelo al riposo della carne: sono la stessa fase.
 */
export function transizione(dispositivo, daC, aC) {
    return {
        durata_min: dispositivo.transizione_bassa_alta_min,
        da_c: daC,
        a_c: aC,
        valvole: valvole(aC),
        istruzioni: [
            'Togli il deflettore — è rovente, servono i guanti — e spalanca le valvole.',
            `Da ${daC} a ${aC} °C servono ${dispositivo.transizione_bassa_alta_min[0]}-${dispositivo.transizione_bassa_alta_min[1]} minuti su questo kamado: è esattamente il tempo in cui la carne riposa. Non sono due attese, è una.`,
        ],
    };
}

/** Tempi di scottatura per lato, propri del dispositivo. */
export function scottatura(dispositivo) {
    const [a, b] = dispositivo.scottatura_s_per_lato;
    return {
        secondi_per_lato: [a, b],
        nota: dispositivo.griglia_cm <= 38
            ? 'Su un kamado piccolo le braci sono vicine alla griglia: la scottatura è più violenta e più corta di quanto si aspetti chi viene da un modello grande.'
            : null,
    };
}

// ═══════════════════════════════════════════════════════════════
//  SICUREZZA
// ═══════════════════════════════════════════════════════════════

/**
 * Il burping non è un consiglio opzionale: aprire di colpo un kamado sopra i
 * 250 °C richiama aria su braci affamate di ossigeno e produce una fiammata
 * di ritorno che arriva in faccia.
 */
export function burping(cameraMassimaC) {
    if (cameraMassimaC < KAMADO.burping_sopra_c) return null;
    return {
        gravita: 'sicurezza',
        titolo: 'Apri il coperchio in due tempi',
        testo: `Sopra i ${KAMADO.burping_sopra_c} °C il coperchio non si spalanca: alzalo di due dita, conta due secondi, poi aprilo. Serve a far entrare l'aria gradualmente. Aprirlo di colpo richiama ossigeno su braci che ne sono affamate e produce una fiammata di ritorno.`,
    };
}

// ═══════════════════════════════════════════════════════════════
//  INGOMBRO
// ═══════════════════════════════════════════════════════════════

/**
 * Un piano di cottura perfetto per un pezzo che non entra nel kamado è un
 * piano inutile. Il confronto è tra la dimensione massima del taglio e il
 * diametro della griglia.
 */
export function ingombro(taglio, dispositivo) {
    const serve = taglio.ingombro_cm;
    const ha = dispositivo.griglia_cm;
    const limite = ha * KAMADO.ingombro_tolleranza;

    if (serve <= ha) {
        return { esito: 'ci_sta', testo: null };
    }
    if (serve <= limite) {
        return {
            esito: 'stretto',
            gravita: 'info',
            testo: `${taglio.nome} misura circa ${serve} cm e la griglia ne ha ${ha}: ci sta, ma in diagonale e senza niente accanto.`,
        };
    }
    if (taglio.divisibile) {
        return {
            esito: 'da_dividere',
            gravita: 'attenzione',
            testo: `${taglio.nome} misura circa ${serve} cm, la griglia ${ha}: intero non ci sta. Va diviso in due pezzi — che cuociono anche più uniformi — o comprato già porzionato.`,
        };
    }
    return {
        esito: 'non_ci_sta',
        gravita: 'attenzione',
        testo: `${taglio.nome} misura circa ${serve} cm contro i ${ha} della griglia, e non è un taglio che si divide. Su questo kamado non si appoggia in piano: serve un modello più grande, o un taglio diverso.`,
    };
}

// ═══════════════════════════════════════════════════════════════
//  CARBONE
// ═══════════════════════════════════════════════════════════════

/**
 * Il suggerimento è in riempimento del cestello, non in chili: il carbone non
 * consumato si riusa alla cottura dopo, quindi "1,4 kg" è un numero inutile
 * mentre "cestello a tre quarti" è un'istruzione eseguibile.
 */
export function carbone(dispositivo, oreBassa, oreAlta = 0) {
    const kg = oreBassa * dispositivo.consumo_kg_h.bassa
        + oreAlta * dispositivo.consumo_kg_h.alta;
    const frazione = kg / dispositivo.carbone_cestello_kg;
    const scaglione = KAMADO.riempimento.find(r => frazione <= r.fino_a);

    const autonomiaOre = dispositivo.carbone_cestello_kg / dispositivo.consumo_kg_h.bassa;

    if (!scaglione) {
        return {
            riempimento: 'cestello pieno',
            sufficiente: false,
            kg_stimati: arrotonda(kg, 0.1),
            gravita: 'attenzione',
            testo: `Servono circa ${arrotonda(kg, 0.1)} kg di carbone e il cestello ne tiene ${dispositivo.carbone_cestello_kg}: riempilo fino all'orlo e preventiva un rabbocco a caldo. Su questo kamado l'autonomia a bassa temperatura è di ${Math.round(autonomiaOre)} ore circa.`,
        };
    }

    return {
        riempimento: scaglione.etichetta,
        sufficiente: true,
        kg_stimati: arrotonda(kg, 0.1),
        testo: `${maiuscola(scaglione.etichetta)}. Riempi comunque senza risparmiare: il carbone che non brucia lo ritrovi alla prossima cottura, mentre restare a secco a metà no.`,
    };
}

/**
 * Il legno da affumicatura serve solo nella prima parte della cottura: dopo,
 * la superficie è asciutta e non assorbe più. Su una cottura lunga continuare
 * ad alimentarlo aggiunge amaro, non aroma.
 */
export function affumicatura(oreTotali, tipoLegno) {
    const utili = KAMADO.legno_ore_utili;
    if (oreTotali <= utili) {
        return { chunk: oreTotali < 1.5 ? 1 : 2, testo: null };
    }
    return {
        chunk: 3,
        gravita: 'info',
        testo: `Il ${tipoLegno || 'legno'} va messo all'inizio e basta: dopo le prime ${utili} ore la superficie non assorbe più fumo, e quello che continui a produrre si deposita amaro. Due o tre chunk in partenza, poi solo carbone.`,
    };
}

// ── utilità locali ──
function arrotonda(n, passo) {
    return Math.round(n / passo) * passo;
}

function maiuscola(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
}
