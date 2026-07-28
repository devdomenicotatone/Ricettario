/**
 * VISTA-TIMER.JS — i comandi dei timer dentro il piano, più la barra fissa in
 * basso con la fase in corso.
 *
 * La logica del tempo sta tutta in timer.js e qui non se ne rifà nemmeno un
 * pezzo: questo file disegna e ascolta. L'intervallo di un secondo serve solo a
 * ridisegnare i numeri — se il browser lo strozza perché la scheda è in secondo
 * piano non si perde niente, perché al ritorno il tempo viene ricalcolato dagli
 * istanti assoluti.
 */

import {
    creaSessione, caricaSessione, salvaSessione, scartaSessione, stessaCottura,
    avvia, pausa, riprendi, completa, azzera,
    statoFase, faseAttiva, tutteCompletate, allarmiDaDare, orologio,
} from './timer.js';
import { sblocca, avvisa, suona, vibra, tieniSchermoAcceso, supporti } from './avvisatore.js';
import { annuncia } from '../annuncio.js';
import { esc, durata } from './formato.js';

export function montaTimer(radice, piano, config, { onCambio } = {}) {
    const ora = () => Date.now();
    const salvata = caricaSessione();

    // Una cottura per volta: è un kamado, non una cucina professionale. Se la
    // sessione salvata è di un'altra configurazione la si tiene da parte e
    // l'utente decide, invece di sovrascriverla di nascosto.
    let sessione = salvata && stessaCottura(salvata.config, config)
        ? salvata
        : creaSessione(config, piano, ora());
    const altrove = salvata && !stessaCottura(salvata.config, config) ? salvata : null;

    let battito = null;
    let barra = null;

    // ── Disegno ──────────────────────────────────────────────

    /**
     * IL MARKUP SI RIFÀ SOLO QUANDO CAMBIA LO STATO, NON A OGNI SECONDO.
     *
     * Prima `disegnaFase` riscriveva `innerHTML` a ogni battito. I numeri
     * cambiavano — e insieme a loro sparivano e rinascevano i pulsanti. Per chi
     * usa il mouse è invisibile; per chi naviga da tastiera vuol dire che
     * l'elemento con il focus veniva distrutto **una volta al secondo** e il
     * focus tornava al `<body>`: Pausa e Fatta erano irraggiungibili proprio
     * mentre il timer correva, cioè nell'unico momento in cui servono.
     * Misurato: focus su Pausa, due secondi dopo focus su BODY e quel pulsante
     * non era più nel documento.
     *
     * Adesso la *forma* del pannello (quali pulsanti, quale testo fisso) dipende
     * solo dallo stato, e si ricostruisce quando lo stato cambia. A ogni battito
     * si riscrivono soltanto i valori: il tempo, la barra, la nota. Il focus
     * sopravvive perché gli elementi sono gli stessi.
     *
     * Quando invece la forma cambia davvero, il fuoco va rimesso a mano: sulla
     * stessa azione se il cambio arriva dal tempo (qui sotto), sul comando
     * equivalente se arriva da un comando (`rimettiIlFuoco`).
     */
    function formaDi(s) {
        return `${s.stato}${s.oltreMassimo ? '|oltre' : ''}`;
    }

    function classeDi(s) {
        if (s.stato === 'ferma') return 'timer';
        if (s.stato === 'completata') return 'timer is-completata';
        return `timer is-attiva${s.stato === 'scaduta' ? ' is-scaduta' : ''}${s.stato === 'in_pausa' ? ' is-pausa' : ''}`;
    }

    function markupDi(s, finestra) {
        if (s.stato === 'ferma') {
            return `<button class="timer__avvia" data-azione="avvia">Avvia — ${esc(durata([Math.round(s.minMs / 60000), Math.round(s.maxMs / 60000)]))}</button>`;
        }

        if (s.stato === 'completata') {
            return `
              <span class="timer__fatto">✓ fatta in <span data-valore="tempo">${orologio(s.trascorsoMs)}</span></span>
              <button class="timer__minore" data-azione="azzera">rifai</button>`;
        }

        const scaduta = s.stato === 'scaduta';
        // «14:45» da solo, per chi ascolta, è un orario: senza la premessa non
        // si capisce se manca o se è passato. La barra invece non aggiunge
        // niente — è lo stesso numero disegnato — e va tolta di mezzo.
        return `
          <div class="timer__tempo">
            <span class="solo-lettore">${scaduta ? 'Oltre il tempo minimo di ' : 'Tempo rimanente '}</span><span data-valore="tempo"></span>
          </div>
          <div class="timer__barra" aria-hidden="true"><span></span></div>
          <p class="timer__nota" data-valore="nota"></p>
          <div class="timer__comandi">
            ${s.stato === 'in_pausa'
                ? '<button class="timer__minore" data-azione="riprendi">Riprendi</button>'
                : '<button class="timer__minore" data-azione="pausa">Pausa</button>'}
            <button class="timer__avvia timer__avvia--stretto" data-azione="completa">Fatta</button>
          </div>`;
    }

    /** I soli pezzi che cambiano fra un secondo e l'altro. */
    function aggiornaValori(contenitore, s, finestra) {
        const scaduta = s.stato === 'scaduta';

        const tempo = contenitore.querySelector('[data-valore="tempo"]');
        if (tempo) {
            const testo = s.stato === 'completata'
                ? orologio(s.trascorsoMs)
                : `${scaduta ? '+' : ''}${orologio(scaduta ? s.oltreMs : s.rimanenteMs)}`;
            if (tempo.textContent !== testo) tempo.textContent = testo;
        }

        const riempimento = contenitore.querySelector('.timer__barra span');
        if (riempimento) riempimento.style.width = `${Math.round(s.frazione * 100)}%`;

        const nodoNota = contenitore.querySelector('[data-valore="nota"]');
        if (nodoNota) {
            // `textContent` e non `innerHTML`: il testo non viene interpretato
            // come markup, quindi qui l'escape non serve proprio.
            const testo = nota(s, finestra);
            if (nodoNota.textContent !== testo) nodoNota.textContent = testo;
        }
    }

    /**
     * L'azione del pulsante che ha il fuoco, se il fuoco sta dentro `dentro`.
     * Va letta PRIMA di rifare l'innerHTML: dopo, il fuoco è già sul body.
     */
    function azioneColFuoco(dentro) {
        const attivo = document.activeElement;
        return dentro.contains(attivo) ? attivo.closest('[data-azione]')?.dataset.azione : null;
    }

    function disegnaFase(contenitore) {
        const s = statoFase(sessione, contenitore.dataset.timer, ora());
        if (!s) return;

        const finestra = `finestra ${durata([Math.round(s.minMs / 60000), Math.round(s.maxMs / 60000)])}`;
        const forma = formaDi(s);

        if (contenitore.dataset.forma !== forma) {
            // Anche il cambio di forma senza comando strappa il fuoco: allo
            // scoccare del minimo (in corso → scaduta → oltre) i pulsanti si
            // rifanno identici, e chi teneva il fuoco su Pausa o Fatta lo
            // perdeva proprio quando l'allarme chiama. Qui si rimette sulla
            // STESSA azione, se nel markup nuovo esiste ancora; quando è un
            // comando a cambiare il set dei pulsanti, ci pensa
            // `rimettiIlFuoco`. Al primo disegno non c'è niente da rimettere:
            // il contenitore nasce vuoto, il fuoco non può stare qui dentro.
            const daRimettere = azioneColFuoco(contenitore);
            contenitore.dataset.forma = forma;
            contenitore.className = classeDi(s);
            contenitore.innerHTML = markupDi(s, finestra);
            if (daRimettere) contenitore.querySelector(`[data-azione="${daRimettere}"]`)?.focus({ preventScroll: true });
        }

        aggiornaValori(contenitore, s, finestra);
    }

    function nota(s, finestra) {
        if (s.stato === 'in_pausa') return `In pausa. Il tempo non scorre. ${finestra}.`;
        if (s.oltreMassimo) {
            return `Oltre il massimo previsto di ${Math.round(s.maxMs / 60000)} minuti. Se hai la sonda fidati di quella, non di questo numero.`;
        }
        if (s.stato === 'scaduta') {
            return `Tempo minimo raggiunto: vai a controllare. Non vuol dire "pronto" — la ${finestra} arriva fino a ${Math.round(s.maxMs / 60000)} minuti.`;
        }
        return `${finestra}. L'allarme suona al minimo, che è quando conviene iniziare a controllare.`;
    }

    function disegnaBarra() {
        const attiva = faseAttiva(sessione, ora());
        const corre = attiva && ['in_corso', 'scaduta', 'in_pausa'].includes(attiva.stato);

        if (!corre) {
            barra?.remove();
            barra = null;
            return;
        }

        if (!barra) {
            barra = document.createElement('div');
            barra.className = 'barra-timer';
            barra.addEventListener('click', (e) => {
                const azione = e.target.closest('[data-azione]')?.dataset.azione;
                if (azione) return comanda(attiva.id, azione);
                document.getElementById(`fase-${attiva.id}`)
                    ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            });
            radice.appendChild(barra);
        }

        const scaduta = attiva.stato === 'scaduta';
        barra.classList.toggle('is-scaduta', scaduta);

        // Stessa regola del pannello di fase: la barra contiene due pulsanti, e
        // rifarne il markup a ogni secondo li strappava di sotto al focus.
        const forma = `${attiva.id}|${attiva.stato}`;
        if (barra.dataset.forma !== forma) {
            const daRimettere = azioneColFuoco(barra);
            barra.dataset.forma = forma;
            barra.innerHTML = `
              <div class="barra-timer__fase">
                <span class="barra-timer__nome">${esc(attiva.nome)}</span>
                <span class="barra-timer__stato">${attiva.stato === 'in_pausa' ? 'in pausa' : scaduta ? 'controlla' : 'in corso'}</span>
              </div>
              <div class="barra-timer__tempo" data-valore="tempo"></div>
              <button class="barra-timer__bottone" data-azione="${attiva.stato === 'in_pausa' ? 'riprendi' : 'pausa'}"
                      aria-label="${attiva.stato === 'in_pausa' ? 'Riprendi' : 'Pausa'}">
                ${attiva.stato === 'in_pausa' ? '▶' : '❙❙'}
              </button>
              <button class="barra-timer__bottone barra-timer__bottone--fine" data-azione="completa" aria-label="Fase completata">✓</button>`;
            if (daRimettere) barra.querySelector(`[data-azione="${daRimettere}"]`)?.focus({ preventScroll: true });
        }

        const tempo = barra.querySelector('[data-valore="tempo"]');
        const testo = `${scaduta ? '+' : ''}${orologio(scaduta ? attiva.oltreMs : attiva.rimanenteMs)}`;
        if (tempo && tempo.textContent !== testo) tempo.textContent = testo;
    }

    function disegnaTutto() {
        radice.querySelectorAll('[data-timer]').forEach(disegnaFase);
        disegnaBarra();
        evidenziaFaseAttiva();
    }

    function evidenziaFaseAttiva() {
        const attiva = faseAttiva(sessione, ora());
        radice.querySelectorAll('.piano-fase').forEach(el => {
            el.classList.toggle('is-attiva', Boolean(attiva) && el.id === `fase-${attiva.id}`);
        });
    }

    // ── Battito e allarmi ────────────────────────────────────

    function serveBattito() {
        return sessione.fasi.some(f => f.avviatoA && !f.completataA && !f.pausaDa);
    }

    function battiSeServe() {
        const serve = serveBattito();
        if (serve && !battito) battito = setInterval(giro, 1000);
        if (!serve && battito) { clearInterval(battito); battito = null; }
        tieniSchermoAcceso(serve);
    }

    function giro() {
        // Il router della SPA sostituisce il contenuto di #app senza avvisare
        // nessuno: se la nostra radice non è più nel documento, l'utente ha
        // lasciato il piano e questo battito non deve continuare a girare —
        // soprattutto il Wake Lock, che altrimenti terrebbe accesso lo schermo
        // su una pagina che non c'è più.
        if (!radice.isConnected) {
            smonta();
            return;
        }

        for (const s of allarmiDaDare(sessione, ora())) {
            const ritardo = Math.floor(s.oltreMs / 60000);
            avvisa(
                'fase',
                `${s.nome}: tempo minimo raggiunto`,
                ritardo >= 1
                    ? `Scaduto ${ritardo} minut${ritardo === 1 ? 'o' : 'i'} fa. Vai a controllare.`
                    : 'Vai a controllare la carne.',
            );
            salvaSessione(sessione);
        }
        disegnaTutto();
    }

    // ── Comandi ──────────────────────────────────────────────

    async function comanda(faseId, azione) {
        const t = ora();

        // Anche il fuoco si legge prima: il ridisegno distrugge il pulsante
        // premuto, e a quel punto `document.activeElement` è già il body.
        const pannello = radice.querySelector(`[data-timer="${CSS.escape(faseId)}"]`);
        const fuocoNelPannello = Boolean(pannello?.contains(document.activeElement));
        const fuocoNellaBarra = Boolean(barra?.contains(document.activeElement));

        // Il nome e la finestra si leggono prima di toccare la sessione: dopo
        // `completa` la fase non è più quella attiva e servirebbe cercarla.
        const prima = statoFase(sessione, faseId, t);
        const nome = prima?.nome || 'Fase';
        const finestra = prima
            ? durata([Math.round(prima.minMs / 60000), Math.round(prima.maxMs / 60000)])
            : '';

        if (azione === 'avvia') {
            await sblocca();
            if (altrove) scartaSessione();
            avvia(sessione, faseId, t);
            const f = sessione.fasi.find(x => x.id === faseId);
            if (f) f.allarmeDato = false;
            suona('tocco');
            vibra('tocco');
            // Il conto alla rovescia non si annuncia: una regione live che
            // parla ogni secondo rende la pagina inascoltabile. Si annunciano i
            // cambi di stato, che sono le cose che l'utente ha bisogno di
            // sapere e che altrimenti succedono in silenzio.
            annuncia(`${nome}: timer avviato, finestra ${finestra}. L'allarme suona al tempo minimo.`);
        } else if (azione === 'pausa') {
            pausa(sessione, faseId, t);
            annuncia(`${nome}: timer in pausa.`);
        } else if (azione === 'riprendi') {
            riprendi(sessione, faseId, t);
            annuncia(`${nome}: timer ripreso.`);
        } else if (azione === 'completa') {
            completa(sessione, faseId, t);
            if (tutteCompletate(sessione)) {
                // `avvisa` annuncia già per conto suo: qui non si ripete.
                avvisa('fine', 'Cottura completata', 'Registra com\'è andata: serve a tarare i tempi.');
            } else {
                suona('tocco');
                vibra('tocco');
                // Porta sotto gli occhi la fase successiva invece di lasciare
                // l'utente a cercarla scorrendo con le mani sporche.
                const prossima = faseAttiva(sessione, t);
                if (prossima) {
                    requestAnimationFrame(() => document.getElementById(`fase-${prossima.id}`)
                        ?.scrollIntoView({ behavior: 'smooth', block: 'center' }));
                }
                annuncia(prossima
                    ? `${nome}: fase completata. Adesso tocca a ${prossima.nome}.`
                    : `${nome}: fase completata.`);
            }
        } else if (azione === 'azzera') {
            azzera(sessione, faseId);
            annuncia(`${nome}: timer azzerato.`);
        }

        salvaSessione(sessione);
        disegnaTutto();
        if (fuocoNelPannello || fuocoNellaBarra) rimettiIlFuoco(azione, faseId, fuocoNellaBarra, t);
        battiSeServe();
        onCambio?.(sessione);
    }

    /**
     * Dopo un comando la forma cambia e l'innerHTML si rifà da zero: il
     * pulsante premuto non esiste più e il fuoco cade sul body — da lì,
     * misurato, servivano dodici Tab per tornare ai comandi. Come il form del
     * calcolatore rimette il fuoco sull'opzione equivalente dopo il redraw,
     * qui va sul comando che continua il gesto:
     *
     *   Avvia → Pausa · Pausa → Riprendi · Riprendi → Pausa · rifai → Avvia
     *
     * «Fatta» un seguito nel suo pannello non ce l'ha (resta solo «rifai»): il
     * bersaglio è l'Avvia della fase successiva — dove la pagina sta già
     * scorrendo e dove l'annuncio indirizza («adesso tocca a…») — e, se un
     * Avvia successivo non c'è (ultima fase, o successiva già avviata), il
     * «rifai» appena comparso.
     *
     * Due cautele. Si agisce solo se PRIMA del ridisegno il fuoco stava nel
     * markup rifatto: a chi sta altrove non si ruba niente, come al primo
     * disegno. E solo se il fuoco è davvero caduto: se la stessa azione
     * esisteva ancora, `disegnaFase`/`disegnaBarra` l'hanno già rimesso loro.
     * `preventScroll` perché lo scorrimento ha già un padrone, lo
     * scrollIntoView morbido verso la fase successiva.
     */
    function rimettiIlFuoco(azione, faseId, dallaBarra, t) {
        const attivo = document.activeElement;
        if (attivo && attivo !== document.body && attivo.isConnected) return;

        let bersaglio;
        if (azione === 'completa') {
            const prossima = faseAttiva(sessione, t);
            bersaglio = (prossima && radice.querySelector(`[data-timer="${CSS.escape(prossima.id)}"] [data-azione="avvia"]`))
                || radice.querySelector(`[data-timer="${CSS.escape(faseId)}"] [data-azione="azzera"]`);
        } else {
            const equivalente = { avvia: 'pausa', pausa: 'riprendi', riprendi: 'pausa', azzera: 'avvia' }[azione];
            const dove = dallaBarra ? barra : radice.querySelector(`[data-timer="${CSS.escape(faseId)}"]`);
            bersaglio = equivalente ? dove?.querySelector(`[data-azione="${equivalente}"]`) : null;
        }
        bersaglio?.focus({ preventScroll: true });
    }

    // ── Ascoltatori ──────────────────────────────────────────

    function alClic(e) {
        const bottone = e.target.closest('[data-azione]');
        if (!bottone) return;
        const contenitore = bottone.closest('[data-timer]');
        if (!contenitore) return;
        e.preventDefault();
        comanda(contenitore.dataset.timer, bottone.dataset.azione);
    }

    function allaVisibilita() {
        if (document.visibilityState !== 'visible') return;
        // Il Wake Lock viene rilasciato dal browser quando la pagina si
        // nasconde: se un timer sta ancora correndo va richiesto di nuovo.
        battiSeServe();
        giro();
    }

    function smonta() {
        if (battito) { clearInterval(battito); battito = null; }
        barra?.remove();
        barra = null;
        radice.removeEventListener('click', alClic);
        document.removeEventListener('visibilitychange', allaVisibilita);
        tieniSchermoAcceso(false);
    }

    radice.addEventListener('click', alClic);
    document.addEventListener('visibilitychange', allaVisibilita);

    disegnaTutto();
    battiSeServe();

    return {
        sessione: () => sessione,
        altrove,
        supporti: supporti(),
        smonta,
    };
}
