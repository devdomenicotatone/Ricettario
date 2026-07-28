/**
 * REGOLE.JS — motore dei consigli contestuali.
 *
 * Le regole sono DATI: una condizione e un testo. Si attivano sulla
 * combinazione di input, non su un blocco generico sulla cottura della carne
 * mostrato sempre uguale a tutti.
 *
 * Il campo `fase` è quello che evita la duplicazione: una regola con `fase`
 * viene mostrata dentro quel passaggio del piano, dove serve; una senza va nel
 * pannello dei consigli. Il testo esiste comunque una volta sola, qui.
 *
 * `fase` accetta un elenco di alternative, e vince la prima presente nel piano.
 * Serve perché la stessa fase ha nomi diversi secondo il metodo: la cottura
 * principale si chiama `indiretta` nel reverse sear e `finitura` nella diretta.
 * Con un id secco, una regola giusta sarebbe scomparsa in silenzio sui metodi
 * che quella fase non hanno.
 *
 * `gravita`: 'sicurezza' (non si nasconde e non si chiude) | 'attenzione' | 'info'.
 */

import { SOGLIE, CAMERA, KAMADO } from '../../dati/cottura/coefficienti.js';

const magro = (ctx) => ctx.taglio.grasso === 'magro';

export const REGOLE = [
    // ── Sicurezza ──────────────────────────────────────────────
    {
        id: 'cottura_non_ammessa',
        gravita: 'sicurezza',
        quando: (ctx) => ctx.cotturaRichiesta && ctx.cotturaRichiesta !== ctx.cottura,
        titolo: (ctx) => `Su ${ctx.taglio.nome} quella cottura non è disponibile`,
        testo: (ctx) => ctx.taglio.motivo_soglia
            || `Il grado di cottura richiesto non è tra quelli ammessi per questo taglio: il piano usa "${etichettaCottura(ctx.cottura)}".`,
    },
    {
        id: 'pavimento_sicurezza',
        gravita: 'sicurezza',
        fase: 'estrazione',
        quando: (ctx, extra) => extra?.estrazione?.pavimento_sicurezza === true,
        titolo: 'Qui il carryover non si sottrae',
        testo: (ctx) => `Su tutti gli altri tagli la temperatura di estrazione è il target meno il carryover. Qui no: non scende sotto i ${ctx.taglio.soglia_sicurezza} °C, anche se il conto lo permetterebbe. Su un patogeno non si scommette su una stima.`,
    },

    // ── Metodo ─────────────────────────────────────────────────
    {
        id: 'reverse_sear_sottile',
        gravita: 'attenzione',
        quando: (ctx) => ctx.metodo === 'reverse_sear'
            && ctx.taglio.famiglia === 'bistecca'
            && ctx.spessore < SOGLIE.reverse_sear_spessore_minimo,
        titolo: 'Il reverse sear qui non conviene',
        testo: (ctx) => `A ${virgola(ctx.spessore)} cm la carne attraversa la fascia di temperatura utile troppo in fretta: quando la superficie è pronta per la scottatura il cuore è già oltre. Sotto i ${SOGLIE.reverse_sear_spessore_minimo} cm la diretta classica dà un risultato migliore in un quarto del tempo. Il piano che vedi resta valido, ma è il metodo sbagliato per questo pezzo.`,
    },
    {
        id: 'senza_deflettore',
        gravita: 'attenzione',
        quando: (ctx) => ctx.input.deflettore === false
            && ['reverse_sear', 'indiretta_lenta', 'low_and_slow'].includes(ctx.metodo),
        titolo: 'Senza deflettore non c\'è cottura indiretta',
        testo: 'Il deflettore è ciò che trasforma il kamado in un forno: senza, la carne prende irraggiamento diretto dalle braci e la superficie brucia molto prima che il cuore si muova. Come rimedio di fortuna si può usare una teglia con acqua appoggiata sotto la griglia, ma è un ripiego. In alternativa, cambia metodo e vai di diretta.',
    },
    {
        id: 'griglia_bassa_pezzo_spesso',
        gravita: 'info',
        // Stessa soglia della rotazione sui bordi: è il confine "pezzo spesso".
        quando: (ctx) => ctx.input.griglia_rialzata === false
            && ctx.metodo === 'diretta'
            && ctx.spessore >= SOGLIE.rotazione_su_bordi_da_cm,
        titolo: 'Griglia troppo vicina alle braci',
        testo: () => `Un pezzo da ${SOGLIE.rotazione_su_bordi_da_cm} cm o più sulla griglia bassa in diretta si brucia fuori prima di scaldarsi dentro. Con la griglia rialzata guadagni la distanza che serve; senza, conviene passare al reverse sear.`,
    },

    // ── Taglio ─────────────────────────────────────────────────
    {
        id: 'due_muscoli',
        gravita: 'attenzione',
        fase: ['indiretta', 'finitura'],
        quando: (ctx) => ctx.taglio.muscoli_multipli && ctx.taglio.famiglia === 'bistecca',
        titolo: 'Due muscoli, due velocità',
        testo: 'Il filetto è più piccolo del controfiletto e corre avanti di 3-5 °C. Orienta il lato del filetto verso la zona meno calda, e sonda il controfiletto nel punto più spesso, in orizzontale e lontano dall\'osso: l\'osso conduce diversamente e restituisce letture false.',
    },
    {
        id: 'rotazione_bordi',
        gravita: 'info',
        fase: ['indiretta', 'finitura'],
        quando: (ctx) => ctx.taglio.gestione_grasso?.rotazione_su_bordi
            && ctx.spessore >= SOGLIE.rotazione_su_bordi_da_cm,
        titolo: 'Cuocila in piedi, non sulle facce',
        testo: (ctx) => `Sopra i ${SOGLIE.rotazione_su_bordi_da_cm} cm conviene tenerla in piedi e ruotarla sui tre bordi — i due fianchi e il bordo di grasso — invece di appoggiarla sulle due facce piatte. Due vantaggi concreti: le facce restano asciutte fino alla scottatura, quindi la crosta si forma in metà tempo; e il bordo di grasso ha finalmente il tempo di fondere invece di arrivare bianco a fine cottura.`,
    },
    {
        id: 'bordo_grasso_spesso',
        gravita: 'info',
        fase: ['scottatura', 'scottatura_iniziale'],
        quando: (ctx) => (ctx.input.bordo_grasso_cm ?? 0) >= SOGLIE.bordo_grasso_spesso_cm,
        titolo: 'Il lardello vuole il suo tempo',
        testo: (ctx) => `Un bordo di grasso da ${virgola(ctx.input.bordo_grasso_cm)} cm non fonde nei secondi che bastano alle facce. Tienilo in piedi sulla brace uno o due minuti in più, all'inizio della scottatura: se resta bianco e gommoso è la parte che finisce nel piatto e non si mangia.`,
    },
    {
        id: 'ben_cotta_magra',
        gravita: 'attenzione',
        quando: (ctx) => magro(ctx) && ctx.targetC >= SOGLIE.magro_avviso_da_cottura
            && ctx.taglio.soglia_sicurezza == null,
        titolo: 'Taglio magro portato a cottura alta',
        testo: (ctx) => `${ctx.taglio.nome} non ha grasso interno che compensi: a ${ctx.targetC} °C esce asciutto, e non è un difetto di esecuzione ma il risultato inevitabile della combinazione. Se ti serve quella cottura, mettilo in conto; se puoi scendere, fermati due gradi prima.`,
    },

    // ── Affumicatura ───────────────────────────────────────────
    {
        id: 'fumo_carne_magra',
        gravita: 'info',
        quando: (ctx) => Boolean(ctx.input.legno) && magro(ctx),
        titolo: 'Poco legno su carne magra',
        testo: (ctx) => `${ctx.taglio.nome} ha poco grasso, e il grasso è quello che lega il fumo trasformandolo in aroma. Senza, il fumo resta in superficie e diventa acre. Un chunk, non tre, e ${ctx.input.legno} solo se è tra i legni delicati.`,
    },

    // ── Sonda ──────────────────────────────────────────────────
    {
        id: 'senza_sonda',
        gravita: 'attenzione',
        quando: (ctx) => ctx.input.sonda === false,
        titolo: 'Senza sonda i tempi sono tutto quello che hai',
        testo: 'Il piano è impostato sui tempi e sui test tattili, ma è la modalità peggiore: gli stessi minuti su due pezzi diversi danno due risultati diversi, e non c\'è modo di accorgersene prima di tagliare. Una sonda a filo costa meno di una fiorentina e la prima volta che la usi ti risparmia il pezzo. È lo strumento con il miglior rapporto tra costo e risultato in questo tipo di cottura, molto più di qualsiasi accessorio del kamado.',
    },
    {
        id: 'test_tattile',
        gravita: 'info',
        fase: ['indiretta', 'finitura'],
        quando: (ctx) => ctx.input.sonda === false && ctx.taglio.famiglia === 'bistecca',
        titolo: 'Come controllare senza sonda',
        testo: 'Premi al centro con un dito: al sangue cede come il polpastrello a mano aperta, media al sangue come quando unisci pollice e medio, media come pollice e anulare. Confronta ogni volta con la tua mano, non con la memoria della volta prima.',
    },

    // ── Dispositivo ────────────────────────────────────────────
    {
        id: 'kamado_sovradimensionato',
        gravita: 'info',
        quando: (ctx) => ctx.dispositivo.griglia_cm >= KAMADO.griglia_grande_da_cm
            && ctx.taglio.famiglia === 'bistecca'
            && ctx.peso < SOGLIE.bistecca_piccola_sotto_kg,
        titolo: 'Molto kamado per poca carne',
        testo: (ctx) => `Su ${ctx.dispositivo.nome.toLowerCase()} una bistecca sotto il chilo funziona, ma paghi ${ctx.dispositivo.stabilizzazione_min[1]} minuti di stabilizzazione e un cestello di carbone per una cottura che ne userà una frazione. Se capita spesso, è il caso d'uso di un modello piccolo.`,
    },
    {
        id: 'zona_fredda_piccola',
        gravita: 'info',
        fase: ['indiretta', 'finitura', 'cottura', 'salita'],
        quando: (ctx) => ctx.dispositivo.zona_fredda === 'piccola'
            && ctx.taglio.muscoli_multipli,
        titolo: 'Zona fredda stretta: ruota invece di spostare',
        testo: 'Su questo kamado la zona meno calda è troppo piccola per spostarci davvero il pezzo. Usa il deflettore a mezzaluna e ruota la carne di 180° a metà cottura: ottieni lo stesso effetto di riequilibrio.',
    },

    // ── Riposo ─────────────────────────────────────────────────
    {
        id: 'niente_stagnola',
        gravita: 'attenzione',
        fase: ['riposo_salita', 'riposo_finale'],
        quando: (ctx) => ctx.taglio.famiglia === 'bistecca' || ctx.taglio.famiglia === 'intero',
        titolo: 'Riposo scoperto, mai nella stagnola',
        testo: 'La stagnola trattiene il vapore, che si condensa e riumidisce la superficie: la crosta che avevi asciugato torna indietro e la scottatura poi richiede il doppio del tempo per riformarla. Riposo scoperto, su una griglia, in modo che l\'aria giri sotto. Vale per le bistecche e per i pezzi interi — sul brisket la stagnola serve, ed è un\'altra cosa.',
    },
];

/**
 * Valuta tutte le regole e restituisce quelle attive, più gli avvisi che
 * arrivano dal modulo di famiglia del dispositivo (burping, ingombro, carbone,
 * legno): quelli non sono regole generiche, dipendono dall'apparecchio.
 */
export function valutaRegole(ctx, extra = {}) {
    const attivi = [];

    for (const regola of REGOLE) {
        let attiva = false;
        try {
            attiva = Boolean(regola.quando(ctx, extra));
        } catch {
            attiva = false; // una regola che esplode non deve far cadere il piano
        }
        if (!attiva) continue;
        attivi.push({
            id: regola.id,
            gravita: regola.gravita,
            fase: primaFasePresente(regola.fase, extra.fasi),
            titolo: risolvi(regola.titolo, ctx, extra),
            testo: risolvi(regola.testo, ctx, extra),
        });
    }

    const famiglia = extra.famiglia;
    if (famiglia) {
        const burp = famiglia.burping(cameraMassima(ctx));
        if (burp) {
            // Anche gli avvisi che arrivano dal dispositivo devono risolvere la
            // fase contro il piano reale: con il metodo diretto la scottatura
            // si chiama `scottatura_iniziale`, e un avviso di SICUREZZA che
            // punta al nome sbagliato è la cosa peggiore che possa sparire.
            attivi.push({
                ...burp,
                id: 'burping',
                fase: primaFasePresente(['scottatura', 'scottatura_iniziale'], extra.fasi),
            });
        }

        const ing = famiglia.ingombro(ctx.taglio, ctx.dispositivo);
        if (ing.esito !== 'ci_sta') {
            attivi.push({ id: 'ingombro', gravita: ing.gravita, fase: null, titolo: 'Verifica le misure', testo: ing.testo });
        }

        if (ctx.input.legno) {
            const aff = famiglia.affumicatura(extra.oreTotali ?? 1, ctx.input.legno);
            if (aff.testo) {
                attivi.push({ id: 'legno_ore_utili', gravita: aff.gravita, fase: null, titolo: `Il legno serve nelle prime ${KAMADO.legno_ore_utili} ore`, testo: aff.testo });
            }
        }
    }

    const ordine = { sicurezza: 0, attenzione: 1, info: 2 };
    return attivi.sort((a, b) => (ordine[a.gravita] ?? 3) - (ordine[b.gravita] ?? 3));
}

// ── utilità ──

/**
 * Risolve il bersaglio di una regola contro le fasi che il piano ha davvero.
 * Restituisce null se nessuna alternativa esiste: l'avviso finisce nel pannello
 * generale invece di sparire.
 */
function primaFasePresente(bersaglio, fasi) {
    if (!bersaglio) return null;
    const presenti = new Set((fasi || []).map(f => f.id));
    const alternative = Array.isArray(bersaglio) ? bersaglio : [bersaglio];
    return alternative.find(id => presenti.has(id)) ?? null;
}

function risolvi(v, ctx, extra) {
    return typeof v === 'function' ? v(ctx, extra) : v;
}

function cameraMassima(ctx) {
    if (ctx.metodo === 'reverse_sear') return CAMERA.reverse_sear.alta;
    if (ctx.metodo === 'diretta') return CAMERA.diretta.unica;
    return CAMERA[ctx.metodo]?.bassa ?? CAMERA.fallback.bassa;
}

function virgola(n) {
    return String(n).replace('.', ',');
}

function etichettaCottura(id) {
    return {
        al_sangue: 'al sangue',
        media_al_sangue: 'media al sangue',
        media: 'media',
        media_ben_cotta: 'media-ben cotta',
        ben_cotta: 'ben cotta',
    }[id] ?? id;
}
