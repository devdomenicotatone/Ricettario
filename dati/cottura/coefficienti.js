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
export const MODELLO_TERMICO = {
    attivo: true,
    // Sotto questo scarto camera−cuore il logaritmo del modello diverge e i
    // tempi esplodono: il motore preferisce fermarsi con un errore chiaro.
    margine_minimo_camera_cuore_c: 5,
};

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
    // Metodo fuori elenco: si assume una camera bassa prudente. La legge solo
    // il controllo del burping, che deve scattare sui metodi caldi.
    fallback: { bassa: 120 },
};

// ═══════════════════════════════════════════════════════════════
//  RIPOSO
// ═══════════════════════════════════════════════════════════════

export const RIPOSO = {
    // [DA TARARE] Riposo tra indiretta e scottatura, nel reverse sear.
    pre_scottatura_min_per_cm: 2.5,
    pre_scottatura_min: 6,
    pre_scottatura_max: 15,
    // L'estremo alto della finestra è il basso × fattore, ma non sfora il
    // tetto di più di questi minuti: la finestra si allarga, il riposo no.
    pre_scottatura_fattore_max: 1.4,
    pre_scottatura_sforo_max_min: 3,
    finale_min: [3, 5],
    // Gli arrosti riposano più a lungo, in proporzione alla massa; l'estremo
    // alto della finestra è il basso × il fattore.
    arrosto_min_per_kg: 8,
    arrosto_fattore_max: 1.5,
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

    // Chunk di legno consigliati, comunque tutti all'inizio: uno sotto la
    // soglia delle cotture brevi, due entro le ore utili, tre oltre. Di più
    // non aggiunge aroma: deposita amaro. [DA TARARE]
    legno_cottura_breve_h: 1.5,
    legno_chunk: { breve: 1, media: 2, lunga: 3 },

    // Confini di taglia della famiglia (griglie reali: 34, 46, 61 cm).
    // Fino al piccolo le braci sono vicine e la scottatura è più violenta;
    // dal grande in su una bistecca sotto il chilo spreca cestello e attesa.
    griglia_piccola_fino_a_cm: 38,
    griglia_grande_da_cm: 61,

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
    // Sopra questa soglia il pezzo è "spesso": si cuoce in piedi sui tre
    // bordi, e in diretta sulla griglia bassa si brucia fuori prima di
    // scaldarsi dentro. Le due regole leggono lo stesso numero apposta.
    rotazione_su_bordi_da_cm: 4.0,
    bordo_grasso_spesso_cm: 1.2,
    magro_avviso_da_cottura: 63,       // ben cotta su taglio magro
    bistecca_piccola_sotto_kg: 1.0,    // sotto: su una griglia grande scatta "molto kamado per poca carne"
};

// ═══════════════════════════════════════════════════════════════
//  FASI — durate e ripartizioni che non escono dalle curve
// ═══════════════════════════════════════════════════════════════

/**
 * Numeri che danno forma alle fasi del piano: minimi, finestre e quote che
 * derivano dalla meccanica del metodo, non dalla curva del taglio.
 */
export const FASI = {
    // Diretta: la finitura è il tempo residuo dopo la scottatura, ma al
    // coperchio chiuso va lasciato un minimo per agire sul cuore.
    finitura_minima_min: [2, 3],

    // Reverse sear: la scottatura finale si giudica dalla crosta, non
    // dall'orologio; il timer è un promemoria, non una scadenza.
    scottatura_finale_min: [1, 3],

    // Ore ad alta temperatura imputate al conto del carbone; i metodi senza
    // scottatura non ne hanno. [DA TARARE]
    ore_alta_per_metodo: { reverse_sear: 0.4, diretta: 0.5 },

    // Checkpoint della sonda a queste frazioni del tempo massimo: a metà del
    // tempo il cuore è molto più indietro di metà strada, e senza riferimento
    // chi guarda la sonda alza il fuoco.
    checkpoint_frazioni: [0.5, 0.75],

    // Low & slow: ripartizione del totale fra le tre fasi. La salita prende
    // la sua quota, lo stallo la sua (entro i limiti dichiarati dal taglio),
    // la fase finale il resto ma mai sotto il pavimento.
    low_and_slow_quota_salita: 0.40,
    low_and_slow_quota_stallo: 0.25,
    low_and_slow_finale_minima_min: 30,
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
 *
 * `approfondimento` è la seconda metà della stessa regola: più voci dello
 * stesso taglio condividono fasi, note ed errori, e senza un testo proprio
 * differivano solo nei numeri (misurato: 83% di similarità tra la fiorentina
 * da 5 e quella da 6 cm). Ogni approfondimento dice cosa cambia DAVVERO a
 * quella misura, coi numeri del piano scritti nella prosa. Due reti sotto:
 *
 *   - `vale_per` elenca la configurazione che il testo assume: il motore lo
 *     mostra solo quando il piano è calcolato esattamente così, perché con
 *     una cottura o una partenza diverse i numeri citati non sarebbero più
 *     quelli. Meglio nessun testo di un testo che mente.
 *   - `numeri_citati` ripete in forma verificabile i numeri usati nella
 *     prosa: build-cottura.js ricalcola il piano della pagina e si ferma se
 *     non tornano, così una ritaratura delle curve non lascia in giro testi
 *     rimasti indietro.
 */
export const PAGINE_SEO = [
    {
        taglio: 'fiorentina',
        spessore: 3,
        approfondimento: {
            vale_per: { cottura: 'media_al_sangue', metodo: 'reverse_sear', partenza: 'frigo', osso: true },
            numeri_citati: { estrazione_c: 51, target_c: 54, carryover_c: 3.5, indiretta_min: [22, 30] },
            titolo: 'Tre centimetri: la finestra più stretta',
            paragrafi: [
                'Tre centimetri sono il minimo che il calcolatore accetta per una fiorentina, e non per pignoleria: mezzo centimetro in meno e il reverse sear smetterebbe di convenire, perché la carne attraversa la fascia di temperatura utile troppo in fretta. Questa pagina sta esattamente su quel confine, e i suoi 22-30 minuti di indiretta sono la versione più corta del metodo.',
                'Sul finale il cuore sale ancora di oltre un grado al minuto: dai 41 °C del secondo checkpoint all\'estrazione passano circa sette minuti. Qui il timer conta quanto la sonda, perché la finestra utile si chiude più in fretta che su qualunque altro spessore di questo taglio.',
                'Il carryover è il più basso della scala: 3,5 °C. Si estrae a 51 °C e il riposo porta il cuore ai 54 del target praticamente da solo. Margini così corti non perdonano l\'«ancora un minuto»: a questo ritmo, un minuto è più di un grado.',
                'I due muscoli sono al minimo della loro massa, e il filetto — che corre comunque avanti — su questo spessore ha ancora meno strada da fare: va orientato verso la zona fredda dal primo minuto, perché in mezz\'ora scarsa il tempo di correggere non esiste.',
            ],
        },
    },
    {
        taglio: 'fiorentina',
        spessore: 4,
        approfondimento: {
            vale_per: { cottura: 'media_al_sangue', metodo: 'reverse_sear', partenza: 'frigo', osso: true },
            numeri_citati: { estrazione_c: 49, target_c: 54, carryover_c: 5.5, indiretta_min: [30, 40] },
            titolo: 'Quattro centimetri: dove il piano cambia registro',
            paragrafi: [
                'Quattro centimetri sono una soglia scritta nei coefficienti del calcolatore: da qui in su il piano propone la cottura in piedi sui tre bordi, perché il pezzo è abbastanza alto da stare in equilibrio e abbastanza spesso da guadagnarci. Un centimetro sotto, quel consiglio non compare — e non per dimenticanza.',
                'Il salto vero è nel carryover: 5,5 °C contro i 3,5 della misura più sottile — un centimetro vale due gradi. Gli strati esterni immagazzinano più energia di quanta il cuore ne veda durante la cottura, e la restituiscono nel riposo: per questo si estrae a 49 °C, cinque gradi sotto il target e non tre.',
                'L\'indiretta passa a 30-40 minuti. A metà tempo la sonda legge 29 °C, poco oltre metà salita: da lì il ritmo cala, perché più il cuore si accosta alla temperatura di camera, meno in fretta ci va. Non è un ritardo, e alzare il fuoco per «recuperare» è il modo classico di rovinare il piano.',
                'È anche il primo spessore che perdona qualcosa: sul finale il cuore sale di meno di un grado al minuto, quindi una distrazione da due minuti resta dentro la finestra di estrazione. Più lento di una bistecca sottile, ma molto più difficile da sbagliare.',
            ],
        },
    },
    {
        taglio: 'fiorentina',
        spessore: 5,
        approfondimento: {
            vale_per: { cottura: 'media_al_sangue', metodo: 'reverse_sear', partenza: 'frigo', osso: true },
            numeri_citati: { estrazione_c: 48, target_c: 54, carryover_c: 6.5, indiretta_min: [45, 55] },
            titolo: 'Cinque centimetri: comanda la camera, non l\'orologio',
            paragrafi: [
                'Su 45-55 minuti di indiretta l\'errore che pesa non è il cronometro, è la camera: quindici gradi sopra i 120 °C previsti accorciano la stima di circa il 15%, sette minuti buoni sul massimo. Prima di appoggiare la carne conviene che il kamado sia fermo sul numero da qualche minuto, non che ci stia solo passando davanti.',
                'A metà del tempo il cuore segna 29 °C e sembra un guasto. Non lo è: i primi 25 gradi arrivano in mezz\'ora scarsa, gli ultimi 19 si prendono tutto il resto, perché la salita rallenta man mano che il cuore si avvicina a quella della camera. I checkpoint scritti nel piano esistono per questo momento esatto.',
                'Il riposo qui vale un grado di cottura intero: si estrae a 48 °C e i 6,5 °C di carryover portano il cuore ai 54 del target da soli. Estrarre «al numero giusto», cioè a 54, significherebbe ritrovarsi oltre la media: l\'energia accumulata in cinque centimetri di strati esterni non chiede il permesso.',
                'A questo spessore la fiorentina prende i ritmi di un piccolo arrosto: mezz\'ora abbondante prima di vedere 30 °C al cuore, e ogni apertura del coperchio per dare un\'occhiata butta giù la camera e allunga il conto. La sonda serve anche a questo: a lasciare il coperchio chiuso.',
            ],
        },
    },
    {
        taglio: 'fiorentina',
        spessore: 6,
        approfondimento: {
            vale_per: { cottura: 'media_al_sangue', metodo: 'reverse_sear', partenza: 'frigo', osso: true },
            numeri_citati: { estrazione_c: 47, target_c: 54, carryover_c: 7.5, indiretta_min: [55, 70] },
            titolo: 'Sei centimetri: l\'estrazione che sembra un errore',
            paragrafi: [
                'A 6 cm si estrae a 47 °C, e la prima reazione è che il numero sia sbagliato: 47 al cuore è carne al sangue. Ma il carryover stimato su questo spessore è 7,5 °C, più del doppio di una bistecca sottile, e riporta il pezzo sui 54 °C del target mentre sta fermo sul tagliere. Fidarsi del numero basso è la parte difficile di questa cottura.',
                'L\'indiretta dura 55-70 minuti e la finestra è larga un quarto d\'ora. Sembra comoda, ma sul finale il cuore sale di circa mezzo grado al minuto: quei quindici minuti valgono sette gradi, cioè più di un grado di cottura. Andare a orologio su questa misura non è impreciso, è scegliere la cottura a caso.',
                'A 35 minuti il cuore segna 28 °C: i primi 24 gradi chiedono trentacinque minuti, gli ultimi 19 quasi altrettanti. E il conto non finisce all\'estrazione: prima della scottatura la superficie deve cedere calore, e il riposo intermedio su questo spessore tocca il tetto della sua tabella.',
                'Dopo un\'ora di camera a 120 °C la superficie è asciutta come dopo una notte scoperta in frigo, e su una superficie così la crosta arriva in fretta: la scottatura si sorveglia a vista. Il rischio, a questo punto, non è più il cuore — è il bordo di lardello che passa da fuso a bruciato.',
            ],
        },
    },
    {
        taglio: 'costata',
        spessore: 3,
        approfondimento: {
            vale_per: { cottura: 'media_al_sangue', metodo: 'reverse_sear', partenza: 'frigo', osso: true },
            numeri_citati: { estrazione_c: 51, target_c: 54, carryover_c: 3.5, indiretta_min: [22, 30] },
            titolo: 'Tre centimetri di muscolo unico',
            paragrafi: [
                'Una costata da 3 cm è tra le cotture più corte dell\'intero calcolatore: 22-30 minuti di indiretta e un muscolo solo da gestire. Senza un filetto da proteggere, la zona meno calda serve semmai al bordo di grasso, e la sonda ha un bersaglio unico: centro geometrico, in orizzontale.',
                'Il punto delicato è la vena di grasso al centro, che comincia a fondere intorno ai 55 °C: il target di questa pagina è 54, cioè esattamente sul confine. Se la vuoi fusa e traslucida fino in fondo, su questo spessore la cottura da chiedere è la media — una tacca sopra, non due.',
                'Il carryover vale 3,5 °C, il fondo della tabella: si estrae a 51 °C e al riposo resta poco lavoro. Il secondo checkpoint — 41 °C a 23 minuti — è di fatto l\'ultimo momento buono per decidere se allungare: da lì all\'estrazione passano una manciata di minuti.',
            ],
        },
    },
    {
        taglio: 'costata',
        spessore: 4,
        approfondimento: {
            vale_per: { cottura: 'media_al_sangue', metodo: 'reverse_sear', partenza: 'frigo', osso: true },
            numeri_citati: { estrazione_c: 49, target_c: 54, carryover_c: 5.5, indiretta_min: [30, 40] },
            titolo: 'Quattro centimetri in piedi sull\'osso',
            paragrafi: [
                'A 4 cm la costata entra nella fascia degli spessori seri: compare il consiglio di cuocerla in piedi, e il suo osso — che corre lungo tutto un lato — diventa l\'appoggio naturale. In equilibrio su quel bordo il calore entra dal basso schermato dall\'osso, mentre le due facce aspettano asciutte la scottatura.',
                'Rispetto alla misura da banco cambia soprattutto l\'estrazione: 49 °C, perché il carryover sale a 5,5 °C e il riposo mette da solo i cinque gradi che mancano al target. L\'«ancora un minuto per scrupolo», su questo spessore, si ritrova tutto nel piatto.',
                'L\'indiretta si allunga a 30-40 minuti ma resta la cottura più semplice della categoria: un muscolo unico scalda uniforme, niente da orientare verso la zona fredda, il pezzo si appoggia al centro del deflettore e ci resta fino all\'estrazione.',
                'Il centimetro sopra la misura classica compra margine dove serve: nella scottatura qualche secondo di troppo resta un difetto di superficie invece di diventare un grado di cottura, e la vena centrale ha una decina di minuti in più per arrivare fusa al taglio.',
            ],
        },
    },
    {
        taglio: 'tomahawk',
        spessore: 5,
        approfondimento: {
            vale_per: { cottura: 'media_al_sangue', metodo: 'reverse_sear', partenza: 'frigo', osso: true },
            numeri_citati: { estrazione_c: 48, target_c: 54, carryover_c: 6.5, indiretta_min: [45, 55] },
            titolo: 'Cinque centimetri con un manico d\'osso',
            paragrafi: [
                'I numeri di questa pagina sono quelli di una bistecca alta 5 cm — indiretta di 45-55 minuti, estrazione a 48 °C con 6,5 °C di carryover — ma il pezzo non si maneggia allo stesso modo: si gira con le pinze prendendo la carne, con il manico come guida e non come leva.',
                'Il manico va tenuto fuori dalla verticale delle braci per tutta la scottatura: non cuoce niente, ma carbonizza benissimo, e con lui se ne va la presa che serve a fine cottura.',
                'L\'osso della costola è massa fredda che parte da frigo insieme alla carne: il muscolo che lo tocca resta indietro di qualche grado per tutta la cottura. La lettura che conta si prende al centro della sezione, in orizzontale, entrando dal lato opposto all\'osso.',
                'A tavola conviene trattarlo da piccolo arrosto: riposo completo, poi si stacca il muscolo dall\'osso con un taglio solo e si porziona a fette alte un dito, di traverso rispetto alla fibra. Servirlo intero fa scena; tagliarlo prima fa mangiare meglio.',
            ],
        },
    },
    { taglio: 'controfiletto', spessore: 3 },
    { taglio: 'picanha', peso: 1.2 },
    { taglio: 'roast_beef', peso: 1.5 },
    { taglio: 'arista', peso: 1.5 },
    { taglio: 'pollo_intero', peso: 1.4 },
    { taglio: 'costine' },
    { taglio: 'pulled_pork', peso: 3 },
];
