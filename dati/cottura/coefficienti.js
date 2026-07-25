/**
 * COEFFICIENTI.JS — tutti i numeri tarabili del calcolatore di cottura.
 *
 * Questo file esiste per essere modificato dopo una cottura reale, senza
 * toccare il codice. È un .js e non un .json solo perché il JSON non ammette
 * commenti, e qui i commenti sono metà del contenuto.
 *
 * LEGENDA DELL'AFFIDABILITÀ — i numeri non nascono tutti allo stesso modo:
 *
 *   [ANCORA]     Valore fornito da Domenico, esperienza diretta. Non toccarlo
 *                senza un motivo migliore di una formula.
 *   [DERIVATO]   Calcolato da un modello fisico e verificato contro le ancore.
 *   [DA TARARE]  Punto di partenza ragionevole ma non misurato. Va corretto
 *                alla prima cottura reale di quel tipo.
 */

// ═══════════════════════════════════════════════════════════════
//  CURVE TEMPO
// ═══════════════════════════════════════════════════════════════

/**
 * Ogni curva dichiara le proprie condizioni di riferimento, così il motore sa
 * da dove correggere. Le curve `tipo: 'spessore'` sono tabelle di ancore
 * interpolate; quelle `tipo: 'peso'` usano minuti per 1 kg con esponente.
 *
 * PERCHÉ UNA TABELLA E NON UNA FORMULA: la tabella del manzo cresce con circa
 * s^1,45, non con s². Applicando s² a partire dall'ancora dei 2,5 cm, a 6,5 cm
 * uscirebbero 118 minuti invece dei 60-80 osservati. L'interpolazione tra le
 * ancore non ha questo problema e segue le correzioni che fai tu.
 *
 * PERCHÉ IL PESO HA UN ESPONENTE: un arrosto da 4 kg non cuoce in doppio
 * tempo di uno da 2, ma in circa 1,7 volte. I minuti/kg lineari sopravvalutano
 * i pezzi grossi.
 */
export const CURVE = {
    manzo_indiretta: {
        tipo: 'spessore',
        camera_rif: 120,
        cuore_rif: 50,
        iniziale_rif: 4,
        // [ANCORA] manzo in indiretta 110-130 °C, da frigo, fino a 50 °C al cuore
        ancore: [
            { spessore: 2.5, min: 15, max: 20 },
            { spessore: 3.0, min: 20, max: 28 },
            { spessore: 4.0, min: 30, max: 40 },
            { spessore: 5.0, min: 45, max: 55 },
            { spessore: 6.5, min: 60, max: 80 },
        ],
    },

    manzo_arrosto: {
        tipo: 'peso',
        camera_rif: 130,
        cuore_rif: 50,
        iniziale_rif: 4,
        minuti_1kg: { min: 40, max: 50 }, // [DA TARARE]
        esponente_peso: 0.75,
    },

    // Non è il manzo con un moltiplicatore sopra: il maiale ha una curva sua.
    // I valori partono dall'esperienza comune sull'arista in indiretta.
    maiale_arrosto: {
        tipo: 'peso',
        camera_rif: 140,
        cuore_rif: 50,
        iniziale_rif: 4,
        minuti_1kg: { min: 42, max: 52 }, // [DA TARARE]
        esponente_peso: 0.75,
    },

    agnello_arrosto: {
        tipo: 'peso',
        camera_rif: 140,
        cuore_rif: 50,
        iniziale_rif: 4,
        minuti_1kg: { min: 38, max: 48 }, // [DA TARARE]
        esponente_peso: 0.75,
    },

    // Il pollo ha un solo grado di cottura ammesso, quindi la curva è tarata
    // direttamente sui 74 °C: nessuna correzione di target da applicare.
    pollo_arrosto: {
        tipo: 'peso',
        camera_rif: 170,
        cuore_rif: 74,
        iniziale_rif: 4,
        minuti_1kg: { min: 48, max: 58 }, // [DA TARARE]
        esponente_peso: 0.75,
    },
};

// ═══════════════════════════════════════════════════════════════
//  CORREZIONI
// ═══════════════════════════════════════════════════════════════

/**
 * [ANCORA] Temperatura di partenza della carne.
 *
 * `k` è un coefficiente piatto e non una formula, ed è una scelta voluta.
 * Il modello a corpo concentrato (quello usato per camera e target qui sotto)
 * predice −25% partendo da temperatura ambiente, mentre l'esperienza dice
 * −10/15%. Il modello sbaglia perché ignora il ritardo di conduzione interna,
 * che non scala con la differenza di temperatura. Qui vince l'esperienza.
 *
 * `gradi` è la temperatura effettiva, usata per i checkpoint intermedi: sta qui
 * e non nel codice, così le tre voci restano allineate per costruzione.
 */
export const PARTENZA = {
    frigo: { k: 1.00, gradi: 4, nome: 'Dal frigo', dettaglio: 'circa 4 °C' },
    temperata: { k: 0.93, gradi: 10, nome: 'Temperata un\'ora', dettaglio: 'circa 10 °C' },
    ambiente: { k: 0.87, gradi: 19, nome: 'Temperatura ambiente', dettaglio: '18-20 °C' },
};

/**
 * Scala dei gradi di cottura, nell'ordine. Il calcolatore la mostra INTERA,
 * anche le voci che il taglio non ammette: quelle compaiono bloccate con la
 * spiegazione del perché. Un pulsante grigio e muto insegna solo che lo
 * strumento è rotto.
 */
export const GRADI_COTTURA = [
    { id: 'al_sangue', nome: 'Al sangue' },
    { id: 'media_al_sangue', nome: 'Media al sangue' },
    { id: 'media', nome: 'Media' },
    { id: 'media_ben_cotta', nome: 'Media-ben cotta' },
    { id: 'ben_cotta', nome: 'Ben cotta' },
];

/** Metodi: nome e la riga di spiegazione mostrata accanto alla scelta. */
export const METODI = {
    reverse_sear: {
        nome: 'Reverse sear',
        riga: 'Indiretta bassa fino al cuore, riposo, scottatura finale. È il metodo che dà più controllo sui pezzi spessi.',
    },
    diretta: {
        nome: 'Diretta classica',
        riga: 'Tutto sulla brace viva, girando. Veloce, e sotto i 3 cm è la scelta giusta.',
    },
    indiretta_lenta: {
        nome: 'Indiretta lenta',
        riga: 'Solo calore indiretto, nessuna scottatura. Per arrosti e pezzi che devono restare uniformi.',
    },
    low_and_slow: {
        nome: 'Low & slow',
        riga: 'Ore a 110 °C per sciogliere il collagene. Non è una cottura, è una giornata.',
    },
};

/**
 * [DERIVATO] Camera e temperatura al cuore usano
 *
 *     t ∝ ln( (T_camera − T_iniziale) / (T_camera − T_cuore) )
 *
 * verificato contro le ancore: a 150 °C il modello dà −25%, identico al valore
 * osservato. Da lì la fiducia per usarlo anche sui gradi di cottura, dove non
 * esistono tabelle e scriverne cinque a mano sarebbe peggio.
 *
 * Valori risultanti a camera 120 °C, partenza 4 °C (manzo):
 *     50 °C → 1,00   54 °C → 1,12   58 °C → 1,24   63 °C → 1,55   70 °C → 1,83
 */
export const MODELLO_TERMICO = { attivo: true };

/**
 * [ANCORA] Osso.
 *
 * +5% sul totale, non di più: l'osso non rallenta il pezzo in modo
 * significativo, falsa la lettura della sonda. Il vero effetto è un consiglio
 * ("sonda lontano dall'osso"), non un moltiplicatore.
 */
export const K_OSSO = 1.05;

// ═══════════════════════════════════════════════════════════════
//  CARRYOVER (cottura residua durante il riposo)
// ═══════════════════════════════════════════════════════════════

/**
 * [ANCORA] Salita al cuore dopo l'estrazione, con scottatura aggressiva.
 * Le ancore fornite sono +2/3 °C a 2,5 cm e +5/8 °C a 4-5 cm: le altre righe
 * sono interpolate su quelle.
 */
export const CARRYOVER = {
    ancore: [
        { spessore: 2.5, gradi: 2.5 },
        { spessore: 3.0, gradi: 3.5 },
        { spessore: 4.0, gradi: 5.5 },
        { spessore: 5.0, gradi: 6.5 },
        { spessore: 6.5, gradi: 8.0 },
    ],
    // Il metodo cambia quanta energia è immagazzinata negli strati esterni.
    k_metodo: {
        reverse_sear: 1.00,    // scottatura finale violenta: caso delle ancore
        diretta: 0.90,
        indiretta_lenta: 0.55, // nessuna scottatura: gradiente già dolce
        low_and_slow: 0.60,
    },
    // Per gli arrosti il carryover dipende dalla massa, non dallo spessore.
    // [DA TARARE]
    per_peso: [
        { peso: 1.0, gradi: 3.0 },
        { peso: 2.0, gradi: 5.0 },
        { peso: 4.0, gradi: 7.0 },
    ],
};

// ═══════════════════════════════════════════════════════════════
//  TEMPERATURE DI CAMERA PER METODO
// ═══════════════════════════════════════════════════════════════

export const CAMERA = {
    reverse_sear: { bassa: 120, alta: 300 },
    diretta: { unica: 250 },
    indiretta_lenta: { bassa: 110 },
    low_and_slow: { bassa: 110 },
};

// ═══════════════════════════════════════════════════════════════
//  RIPOSO
// ═══════════════════════════════════════════════════════════════

export const RIPOSO = {
    // [DA TARARE] Riposo tra indiretta e scottatura, nel reverse sear.
    pre_scottatura_min_per_cm: 2.5,
    pre_scottatura_min: 6,
    pre_scottatura_max: 15,
    finale_min: [3, 5],
    // Gli arrosti riposano più a lungo, in proporzione alla massa.
    arrosto_min_per_kg: 8,
    // Low & slow: riposo lungo, in borsa termica. Non è opzionale.
    low_and_slow_min: [60, 120],
};

// ═══════════════════════════════════════════════════════════════
//  KAMADO — soglie che attivano logica, non testo decorativo
// ═══════════════════════════════════════════════════════════════

export const KAMADO = {
    // [ANCORA] Dall'accensione al fumo azzurrino appena visibile. Va nel
    // totale: mettere la carne prima deposita composti amari.
    fumo_pulito_min: [15, 20],

    // Sopra questa temperatura il coperchio si apre in due tempi.
    burping_sopra_c: 250,

    // Il legno da affumicatura serve solo nella prima parte della cottura:
    // dopo, la superficie non assorbe più. [DA TARARE]
    legno_ore_utili: 3,

    // Un pezzo più lungo del diametro non ci sta; entro questo margine
    // ci sta ma scomodo.
    ingombro_tolleranza: 1.10,

    // Posizioni valvole indicative. Variano da modello a modello: il testo
    // che le accompagna deve dirlo.
    valvole: [
        { da: 90, a: 120, sotto: 'aperta 1 cm circa, quanto una monetina', sopra: 'petali appena schiusi, ~1/8' },
        { da: 120, a: 150, sotto: 'aperta 2 cm circa', sopra: 'aperta ~1/4' },
        { da: 150, a: 200, sotto: 'aperta 3-4 cm', sopra: 'aperta ~1/2' },
        { da: 200, a: 260, sotto: 'aperta a metà', sopra: 'aperta ~3/4' },
        { da: 260, a: 400, sotto: 'spalancata', sopra: 'spalancata, o rimossa se il modello lo consente' },
    ],

    // Riempimento del cestello invece dei kg: il carbone non consumato si
    // riusa, quindi "1,4 kg" è un numero inutile mentre "tre quarti" è
    // un'istruzione. Frazione del cestello richiesta → etichetta.
    riempimento: [
        { fino_a: 0.35, etichetta: 'cestello a metà' },
        { fino_a: 0.60, etichetta: 'cestello a tre quarti' },
        { fino_a: 1.00, etichetta: 'cestello pieno' },
    ],
};

// ═══════════════════════════════════════════════════════════════
//  SOGLIE CHE ATTIVANO I CONSIGLI
// ═══════════════════════════════════════════════════════════════

export const SOGLIE = {
    reverse_sear_spessore_minimo: 3.0, // sotto: la carne attraversa troppo in fretta
    rotazione_su_bordi_da_cm: 4.0,     // sopra: si cuoce in piedi sui tre bordi
    bordo_grasso_spesso_cm: 1.2,
    magro_avviso_da_cottura: 63,       // ben cotta su taglio magro
};

/**
 * Combinazioni per cui `generate-og.js` pre-genera una pagina statica
 * indicizzabile. Ognuna diventa un file vero in dist/, perché il crawler di
 * Google non compila i form: il piano che il calcolatore produce nel browser
 * non lo vedrebbe mai.
 *
 * Restare pochi è voluto: pagine quasi identiche che cambiano solo un numero
 * sono contenuto sottile, e oltre una certa quantità fanno perdere visite
 * invece di portarne. La misura del kamado NON entra nell'URL — è un selettore
 * dentro la pagina — altrimenti ogni voce si triplicherebbe in tre cloni.
 */
export const PAGINE_SEO = [
    { taglio: 'fiorentina', spessore: 3 },
    { taglio: 'fiorentina', spessore: 4 },
    { taglio: 'fiorentina', spessore: 5 },
    { taglio: 'fiorentina', spessore: 6 },
    { taglio: 'costata', spessore: 3 },
    { taglio: 'costata', spessore: 4 },
    { taglio: 'tomahawk', spessore: 5 },
    { taglio: 'controfiletto', spessore: 3 },
    { taglio: 'picanha', peso: 1.2 },
    { taglio: 'roast_beef', peso: 1.5 },
    { taglio: 'arista', peso: 1.5 },
    { taglio: 'pollo_intero', peso: 1.4 },
    { taglio: 'costine' },
    { taglio: 'pulled_pork', peso: 3 },
];
