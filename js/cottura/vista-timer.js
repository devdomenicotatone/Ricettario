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

    function disegnaFase(contenitore) {
        const s = statoFase(sessione, contenitore.dataset.timer, ora());
        if (!s) return;

        const finestra = `finestra ${durata([Math.round(s.minMs / 60000), Math.round(s.maxMs / 60000)])}`;

        if (s.stato === 'ferma') {
            contenitore.className = 'timer';
            contenitore.innerHTML = `
              <button class="timer__avvia" data-azione="avvia">Avvia — ${esc(durata([Math.round(s.minMs / 60000), Math.round(s.maxMs / 60000)]))}</button>`;
            return;
        }

        if (s.stato === 'completata') {
            contenitore.className = 'timer is-completata';
            contenitore.innerHTML = `
              <span class="timer__fatto">✓ fatta in ${orologio(s.trascorsoMs)}</span>
              <button class="timer__minore" data-azione="azzera">rifai</button>`;
            return;
        }

        const scaduta = s.stato === 'scaduta';
        contenitore.className = `timer is-attiva${scaduta ? ' is-scaduta' : ''}${s.stato === 'in_pausa' ? ' is-pausa' : ''}`;
        contenitore.innerHTML = `
          <div class="timer__tempo">${scaduta ? '+' : ''}${orologio(scaduta ? s.oltreMs : s.rimanenteMs)}</div>
          <div class="timer__barra"><span style="width:${Math.round(s.frazione * 100)}%"></span></div>
          <p class="timer__nota">${esc(nota(s, finestra))}</p>
          <div class="timer__comandi">
            ${s.stato === 'in_pausa'
                ? '<button class="timer__minore" data-azione="riprendi">Riprendi</button>'
                : '<button class="timer__minore" data-azione="pausa">Pausa</button>'}
            <button class="timer__avvia timer__avvia--stretto" data-azione="completa">Fatta</button>
          </div>`;
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
        barra.innerHTML = `
          <div class="barra-timer__fase">
            <span class="barra-timer__nome">${esc(attiva.nome)}</span>
            <span class="barra-timer__stato">${attiva.stato === 'in_pausa' ? 'in pausa' : scaduta ? 'controlla' : 'in corso'}</span>
          </div>
          <div class="barra-timer__tempo">${scaduta ? '+' : ''}${orologio(scaduta ? attiva.oltreMs : attiva.rimanenteMs)}</div>
          <button class="barra-timer__bottone" data-azione="${attiva.stato === 'in_pausa' ? 'riprendi' : 'pausa'}"
                  aria-label="${attiva.stato === 'in_pausa' ? 'Riprendi' : 'Pausa'}">
            ${attiva.stato === 'in_pausa' ? '▶' : '❙❙'}
          </button>
          <button class="barra-timer__bottone barra-timer__bottone--fine" data-azione="completa" aria-label="Fase completata">✓</button>`;
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
        battiSeServe();
        onCambio?.(sessione);
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
