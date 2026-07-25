/**
 * BUILD-COTTURA.JS — valida i dati del calcolatore di cottura, e su richiesta
 * stampa un piano in terminale.
 *
 * Il senso è lo stesso di verifica-build.js: qui il rischio non sta nel codice
 * ma nei dati, e i dati sono fatti per essere modificati a mano dopo una
 * cottura reale. Questo script è la rete sotto quelle modifiche.
 *
 * Uso:
 *   node scripts/build-cottura.js
 *       valida tutto ed esce 1 se qualcosa non torna
 *
 *   node scripts/build-cottura.js --piano fiorentina 4.5 media_al_sangue kamado_piccolo
 *       stampa il piano leggibile per quella configurazione
 */

import { readFileSync } from 'fs';
import { join } from 'path';
import { piano } from '../js/cottura/motore.js';
import { durata } from '../js/cottura/formato.js';
import { CURVE, CARRYOVER, PAGINE_SEO, PARTENZA, GRADI_COTTURA, METODI } from '../dati/cottura/coefficienti.js';

const DATI = join(process.cwd(), 'dati', 'cottura');

const problemi = [];
const avvisi = [];
const err = (m) => problemi.push(m);
const warn = (m) => avvisi.push(m);

/** Stessa insidia delle ricette: testo salvato Latin-1 e ri-codificato. */
const DOPPIA_CODIFICA = /[Â-Ã][\x80-\xBF]/g;

function leggi(nome) {
    const testo = readFileSync(join(DATI, nome), 'utf8');
    const rotti = testo.match(DOPPIA_CODIFICA);
    if (rotti) {
        const esempi = [...new Set(rotti)].slice(0, 4).map(s => JSON.stringify(s)).join(' ');
        err(`${nome}: testo a doppia codifica UTF-8 (${rotti.length} occorrenze: ${esempi})`);
    }
    return JSON.parse(testo);
}

const docTagli = leggi('tagli.json');
const docDispositivi = leggi('dispositivi.json');
const tagli = docTagli.tagli;
const dispositivi = docDispositivi.dispositivi;
const dati = { tagli, dispositivi };

// ═══════════════════════════════════════════════════════════════
//  1. CURVE
// ═══════════════════════════════════════════════════════════════

const FAMIGLIE_TAGLIO = ['bistecca', 'arrosto', 'intero', 'low_and_slow'];
const GRASSO = ['magro', 'medio', 'marezzato', 'grasso'];
const PARTENZE = Object.keys(PARTENZA);

for (const [id, curva] of Object.entries(CURVE)) {
    if (curva.camera_rif <= curva.cuore_rif + 5) {
        err(`curva ${id}: camera di riferimento ${curva.camera_rif} °C troppo vicina al cuore ${curva.cuore_rif} °C`);
    }
    if (curva.tipo === 'spessore') {
        const a = curva.ancore;
        if (!a?.length || a.length < 2) err(`curva ${id}: servono almeno due ancore`);
        for (let i = 1; i < a.length; i++) {
            if (a[i].spessore <= a[i - 1].spessore) err(`curva ${id}: ancore non ordinate per spessore crescente`);
            if (a[i].min <= a[i - 1].min) err(`curva ${id}: il tempo minimo non cresce tra ${a[i - 1].spessore} e ${a[i].spessore} cm`);
        }
        for (const riga of a) {
            if (riga.min >= riga.max) err(`curva ${id}: a ${riga.spessore} cm il minimo (${riga.min}) non è sotto il massimo (${riga.max})`);
        }
    } else if (curva.tipo === 'peso') {
        if (!(curva.minuti_1kg?.min < curva.minuti_1kg?.max)) err(`curva ${id}: minuti_1kg incoerenti`);
        if (!(curva.esponente_peso > 0.5 && curva.esponente_peso <= 1)) {
            err(`curva ${id}: esponente_peso ${curva.esponente_peso} fuori dall'intervallo sensato (0,5-1)`);
        }
    } else {
        err(`curva ${id}: tipo "${curva.tipo}" sconosciuto`);
    }
}

for (let i = 1; i < CARRYOVER.ancore.length; i++) {
    if (CARRYOVER.ancore[i].gradi <= CARRYOVER.ancore[i - 1].gradi) {
        err('CARRYOVER: i gradi non crescono con lo spessore');
    }
}

// ═══════════════════════════════════════════════════════════════
//  2. TAGLI
// ═══════════════════════════════════════════════════════════════

const visti = new Set();
for (const t of tagli) {
    const q = (m) => err(`taglio ${t.id || '(senza id)'}: ${m}`);

    if (!t.id || !/^[a-z0-9_]+$/.test(t.id)) q('id assente o non in snake_case');
    if (visti.has(t.id)) q('id duplicato');
    visti.add(t.id);

    if (!FAMIGLIE_TAGLIO.includes(t.famiglia)) q(`famiglia "${t.famiglia}" sconosciuta`);
    if (!GRASSO.includes(t.grasso)) q(`grasso "${t.grasso}" non classificato`);
    if (!['spessore', 'peso'].includes(t.parametro_dominante)) q('parametro_dominante deve essere spessore o peso');
    if (!(t.ingombro_cm > 0)) q('ingombro_cm mancante: senza non si può dire se ci sta nel kamado');

    for (const campo of ['spessore', 'peso']) {
        const r = t[campo];
        if (!r) { q(`${campo} mancante`); continue; }
        if (!(r.min <= r.default && r.default <= r.max)) {
            q(`${campo}: default ${r.default} fuori da [${r.min}, ${r.max}]`);
        }
    }

    // Curva / low & slow: uno dei due, secondo la famiglia
    if (t.famiglia === 'low_and_slow') {
        const ls = t.low_and_slow;
        if (!ls) q('famiglia low_and_slow senza blocco low_and_slow');
        else {
            if (!ls.minuti_per_kg && !ls.durata_fissa_h) q('low_and_slow: servono minuti_per_kg o durata_fissa_h');
            if (!(ls.target_finale >= 88)) q(`low_and_slow: target_finale ${ls.target_finale} °C troppo basso per sciogliere il collagene`);
            if (!ls.criterio) q('low_and_slow: manca il criterio di cedimento (il numero da solo non basta)');
            if (ls.stallo && !(ls.stallo.da < ls.stallo.a)) q('low_and_slow: intervallo di stallo incoerente');
        }
    } else if (!CURVE[t.curva_tempo]) {
        q(`curva_tempo "${t.curva_tempo}" non esiste in coefficienti.js`);
    }

    // Se il taglio vincola la camera, la curva deve essere stata osservata
    // dentro quel vincolo: altrimenti si corregge da una temperatura che il
    // taglio non ammette, e il fattore termico parte sbagliato.
    if (t.camera_ammessa) {
        const [cMin, cMax] = t.camera_ammessa;
        if (!(cMin < cMax)) q('camera_ammessa deve essere [min, max]');
        const rif = CURVE[t.curva_tempo]?.camera_rif;
        if (rif != null && (rif < cMin || rif > cMax)) {
            q(`camera_ammessa [${cMin}, ${cMax}] non contiene la camera di riferimento della curva (${rif} °C)`);
        }
    }

    // Temperature e cotture
    const temp = t.temperature_cuore || {};
    if (!t.cotture_ammesse?.length) q('nessuna cottura ammessa');
    for (const c of t.cotture_ammesse || []) {
        if (temp[c] == null) q(`cottura ammessa "${c}" senza temperatura al cuore`);
    }
    const valori = Object.values(temp);
    for (let i = 1; i < valori.length; i++) {
        if (valori[i] <= valori[i - 1]) q('temperature al cuore non crescenti');
    }

    // Soglia di sicurezza: nessuna cottura ammessa può stare sotto
    if (t.soglia_sicurezza != null) {
        if (!t.motivo_soglia) q('soglia di sicurezza senza motivo: va spiegata, non solo imposta');
        for (const c of t.cotture_ammesse || []) {
            if (temp[c] < t.soglia_sicurezza) {
                q(`cottura "${c}" a ${temp[c]} °C è sotto la soglia di sicurezza di ${t.soglia_sicurezza} °C`);
            }
        }
    }

    if (!t.metodi_ammessi?.includes(t.metodo_consigliato)) {
        q('metodo_consigliato non è tra i metodi ammessi');
    }
    for (const m of t.metodi_ammessi || []) {
        if (!METODI[m]) q(`metodo "${m}" senza descrizione in METODI`);
    }

    // Il form mostra la scala completa dei gradi di cottura, e quelli non
    // ammessi compaiono bloccati CON la spiegazione. Un taglio che esclude
    // qualcosa senza dire perché produrrebbe un pulsante grigio e muto.
    if (t.famiglia !== 'low_and_slow') {
        const esclusi = GRADI_COTTURA.filter(g => !t.cotture_ammesse.includes(g.id));
        if (esclusi.length && !t.motivo_soglia && !t.motivo_cotture_escluse) {
            q(`esclude ${esclusi.map(g => g.id).join(', ')} senza motivo_soglia né motivo_cotture_escluse`);
        }
    }
    if (!t.note_specifiche?.length) warn(`taglio ${t.id}: nessuna nota specifica`);
    if (!t.errori_comuni?.length) warn(`taglio ${t.id}: nessun errore comune documentato`);
}

// ═══════════════════════════════════════════════════════════════
//  3. DISPOSITIVI
// ═══════════════════════════════════════════════════════════════

const vistiD = new Set();
for (const d of dispositivi) {
    const q = (m) => err(`dispositivo ${d.id || '(senza id)'}: ${m}`);
    if (!d.id || vistiD.has(d.id)) q('id assente o duplicato');
    vistiD.add(d.id);
    if (d.famiglia !== 'kamado') q(`famiglia "${d.famiglia}" senza modulo di comportamento in js/cottura/`);
    if (!(d.griglia_cm > 0)) q('griglia_cm mancante');
    if (!(d.carbone_cestello_kg > 0)) q('carbone_cestello_kg mancante');
    if (!(d.consumo_kg_h?.bassa > 0 && d.consumo_kg_h?.alta > d.consumo_kg_h.bassa)) {
        q('consumo_kg_h incoerente: in alta si consuma più che in bassa');
    }
    for (const campo of ['stabilizzazione_min', 'recupero_sovratemperatura_min', 'transizione_bassa_alta_min', 'scottatura_s_per_lato']) {
        const r = d[campo];
        if (!Array.isArray(r) || r.length !== 2 || !(r[0] <= r[1])) q(`${campo} deve essere [min, max]`);
    }
    if (!(d.margine_sotto_target_c > 0)) q('margine_sotto_target_c mancante: è la regola contro il sorpasso di temperatura');
}
if (!dispositivi.some(d => d.id === docDispositivi.default)) {
    err(`dispositivi.json: default "${docDispositivi.default}" non corrisponde a nessun dispositivo`);
}

// Le tre misure standard devono restare distinguibili
const diametri = dispositivi.map(d => d.griglia_cm);
if (new Set(diametri).size !== diametri.length) err('dispositivi.json: due dispositivi con lo stesso diametro di griglia');

// ═══════════════════════════════════════════════════════════════
//  4. PAGINE SEO
// ═══════════════════════════════════════════════════════════════

for (const p of PAGINE_SEO) {
    const t = tagli.find(x => x.id === p.taglio);
    if (!t) { err(`PAGINE_SEO: taglio "${p.taglio}" inesistente`); continue; }
    if (t.parametro_dominante === 'spessore' && p.spessore == null && t.famiglia !== 'low_and_slow') {
        err(`PAGINE_SEO ${p.taglio}: il parametro dominante è lo spessore ma non è indicato`);
    }
    if (p.spessore != null && (p.spessore < t.spessore.min || p.spessore > t.spessore.max)) {
        err(`PAGINE_SEO ${p.taglio}: spessore ${p.spessore} cm fuori dall'intervallo del taglio`);
    }
    if (p.peso != null && (p.peso < t.peso.min || p.peso > t.peso.max)) {
        err(`PAGINE_SEO ${p.taglio}: peso ${p.peso} kg fuori dall'intervallo del taglio`);
    }
}
const slug = PAGINE_SEO.map(p => `${p.taglio}-${p.spessore ?? p.peso ?? ''}`);
if (new Set(slug).size !== slug.length) err('PAGINE_SEO: due combinazioni identiche');

// ═══════════════════════════════════════════════════════════════
//  5. IL MOTORE REGGE OGNI COMBINAZIONE
// ═══════════════════════════════════════════════════════════════

let piani = 0;
for (const t of tagli) {
    for (const d of dispositivi) {
        for (const cottura of t.cotture_ammesse) {
            for (const metodo of t.metodi_ammessi) {
                for (const partenza of PARTENZE) {
                    let p;
                    try {
                        p = piano({
                            taglio: t.id, dispositivo: d.id, cottura, metodo, partenza,
                            spessore: t.spessore.default, peso: t.peso.default,
                            osso: t.con_osso === 'sempre', bordo_grasso_cm: 1,
                            deflettore: true, griglia_rialzata: true, sonda: true, legno: null,
                        }, dati);
                    } catch (e) {
                        err(`piano ${t.id}/${d.id}/${cottura}/${metodo}/${partenza}: ${e.message}`);
                        continue;
                    }
                    piani++;

                    const [tmin, tmax] = p.totale_min;
                    if (!(tmin > 0 && tmax >= tmin)) err(`piano ${t.id}/${metodo}: totale incoerente ${tmin}-${tmax}`);
                    if (tmax > 60 * 30) err(`piano ${t.id}/${metodo}: ${Math.round(tmax / 60)} ore, qualcosa non torna`);
                    if (p.estrazione.c > p.estrazione.target_c) {
                        err(`piano ${t.id}: estrazione ${p.estrazione.c} °C sopra il target ${p.estrazione.target_c} °C`);
                    }
                    if (t.soglia_sicurezza != null && p.estrazione.c < t.soglia_sicurezza) {
                        err(`piano ${t.id}: estrazione ${p.estrazione.c} °C sotto la soglia di sicurezza ${t.soglia_sicurezza} °C`);
                    }
                    if (!p.fasi.length) err(`piano ${t.id}/${metodo}: nessuna fase`);

                    // Ogni avviso agganciato a una fase deve trovarla: se il
                    // bersaglio non esiste la vista lo recupera nel pannello
                    // generale, ma è comunque un'intenzione tradita.
                    const idFasi = new Set(p.fasi.map(f => f.id));
                    for (const a of p.avvisi) {
                        if (a.fase && !idFasi.has(a.fase)) {
                            err(`piano ${t.id}/${metodo}: avviso "${a.id}" punta alla fase "${a.fase}" che non esiste`);
                        }
                    }

                    // Intervallo rovesciato: è già capitato sulla fase finale
                    // del low & slow, dove sommare estremi di intervalli
                    // indipendenti dava "4,5-3,5 h".
                    for (const f of p.fasi) {
                        if (!f.durata_min) continue;
                        const [a, b] = f.durata_min;
                        if (!(a <= b)) err(`piano ${t.id}/${metodo}: fase "${f.id}" con intervallo rovesciato ${a}-${b} min`);
                        if (a < 0) err(`piano ${t.id}/${metodo}: fase "${f.id}" con durata negativa`);
                    }
                }
            }
        }
    }
}

// Monotonìe: più spesso deve voler dire più tempo, più cotto anche.
for (const t of tagli.filter(x => x.famiglia === 'bistecca')) {
    const base = { taglio: t.id, dispositivo: 'kamado_medio', metodo: t.metodo_consigliato, partenza: 'frigo', osso: t.con_osso === 'sempre', sonda: true, deflettore: true, griglia_rialzata: true };
    const sottile = piano({ ...base, spessore: t.spessore.min, cottura: t.cotture_ammesse[0] }, dati);
    const spesso = piano({ ...base, spessore: t.spessore.max, cottura: t.cotture_ammesse[0] }, dati);
    if (spesso.totale_min[1] <= sottile.totale_min[1]) {
        err(`monotonìa ${t.id}: ${t.spessore.max} cm non richiede più tempo di ${t.spessore.min} cm`);
    }
    if (t.cotture_ammesse.length > 1) {
        const poco = piano({ ...base, spessore: t.spessore.default, cottura: t.cotture_ammesse[0] }, dati);
        const molto = piano({ ...base, spessore: t.spessore.default, cottura: t.cotture_ammesse[t.cotture_ammesse.length - 1] }, dati);
        if (molto.totale_min[1] <= poco.totale_min[1]) {
            err(`monotonìa ${t.id}: la cottura più avanzata non richiede più tempo`);
        }
    }
}

// ═══════════════════════════════════════════════════════════════
//  STAMPA DI UN PIANO (--piano)
// ═══════════════════════════════════════════════════════════════

function stampaPiano(argv) {
    const [idTaglio, misura, cottura, idDispositivo] = argv;
    const t = tagli.find(x => x.id === idTaglio);
    if (!t) {
        console.error(`Taglio sconosciuto. Disponibili: ${tagli.map(x => x.id).join(', ')}`);
        process.exit(1);
    }
    const num = misura ? parseFloat(String(misura).replace(',', '.')) : null;
    const p = piano({
        taglio: t.id,
        dispositivo: idDispositivo || docDispositivi.default,
        cottura: cottura || t.cotture_ammesse[Math.min(1, t.cotture_ammesse.length - 1)],
        metodo: t.metodo_consigliato,
        partenza: 'frigo',
        spessore: t.parametro_dominante === 'spessore' ? (num ?? t.spessore.default) : t.spessore.default,
        peso: t.parametro_dominante === 'peso' ? (num ?? t.peso.default) : t.peso.default,
        osso: t.con_osso === 'sempre',
        bordo_grasso_cm: t.gestione_grasso.bordo_grasso ? 1.5 : 0,
        deflettore: true, griglia_rialzata: true, sonda: true, legno: null,
    }, dati);

    const dominante = p.misura.dominante === 'spessore'
        ? `${String(p.misura.spessore_cm).replace('.', ',')} cm`
        : `${String(p.misura.peso_kg).replace('.', ',')} kg`;

    console.log(`\n┌─ ${p.taglio.nome} · ${dominante} · ${p.cottura.replace(/_/g, ' ')}`);
    console.log(`│  ${p.dispositivo.nome} (${p.dispositivo.griglia_cm} cm) · ${p.metodo.replace(/_/g, ' ')} · ${p.porzioni} porzion${p.porzioni === 1 ? 'e' : 'i'}`);
    console.log(`│  totale ${durata(p.totale_min)} · ${p.carbone.riempimento}`);
    console.log('│');
    const dettaglioEstrazione = p.estrazione.carryover_c == null
        ? `(criterio: ${p.estrazione.criterio})`
        : `(target ${p.estrazione.target_c}, carryover +${String(p.estrazione.carryover_c).replace('.', ',')}${p.estrazione.pavimento_sicurezza ? ', pavimento di sicurezza' : ''})`;
    console.log(`│  ESTRAI A ${p.estrazione.c} °C   ${dettaglioEstrazione}`);
    console.log('│');
    p.fasi.forEach((f, i) => {
        console.log(`│  ${i + 1}. ${f.nome} — ${durata(f.durata_min)}${f.camera_c ? ` · camera ${f.camera_c} °C` : ''}${f.parallelo ? ' · in parallelo' : ''}`);
        if (f.checkpoint) {
            console.log(`│     checkpoint: ${f.checkpoint.map(c => `${c.al_minuto}′ → ~${c.cuore_atteso_c} °C`).join(' · ')}`);
        }
        const regoleFase = p.avvisi.filter(a => a.fase === f.id);
        for (const a of regoleFase) console.log(`│     [${a.gravita}] ${a.titolo}`);
    });
    console.log('│');
    const generali = p.avvisi.filter(a => !a.fase);
    if (generali.length) {
        console.log('│  Consigli attivati da questa configurazione:');
        for (const a of generali) console.log(`│   • [${a.gravita}] ${a.titolo}`);
    }
    if (p.ingombro.esito !== 'ci_sta') console.log(`│  ⚠ ${p.ingombro.testo}`);
    console.log('└─\n');
}

// ═══════════════════════════════════════════════════════════════
//  ESITO
// ═══════════════════════════════════════════════════════════════

const argv = process.argv.slice(2);
const indicePiano = argv.indexOf('--piano');

console.log(`🥩 Dati cottura — ${tagli.length} tagli, ${dispositivi.length} dispositivi, ${Object.keys(CURVE).length} curve, ${PAGINE_SEO.length} pagine SEO`);
console.log(`   ${piani} piani generati e controllati`);

for (const a of avvisi) console.warn(`⚠️  ${a}`);
if (problemi.length) {
    for (const p of problemi.slice(0, 25)) console.error(`❌ ${p}`);
    if (problemi.length > 25) console.error(`   …e altri ${problemi.length - 25}`);
    console.error(`\n${problemi.length} problem${problemi.length === 1 ? 'a' : 'i'} nei dati di cottura.`);
    process.exit(1);
}
console.log('✅ Dati cottura verificati.');

if (indicePiano !== -1) stampaPiano(argv.slice(indicePiano + 1));
