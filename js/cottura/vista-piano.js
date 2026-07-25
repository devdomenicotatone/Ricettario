/**
 * VISTA-PIANO.JS — montaggio del piano nel browser.
 *
 * L'HTML lo produce html-piano.js, che è puro e condiviso con il pre-rendering.
 * Qui si attacca tutto quello che ha bisogno di un browser: timer, storico,
 * Wake Lock.
 */

import { esc } from './formato.js';
import { htmlPiano } from './html-piano.js';
import { montaTimer } from './vista-timer.js';
import { montaStorico } from './vista-storico.js';
import { scriviQuery } from './stato-url.js';

export function montaPiano(radice, p, { base, config, onModifica }) {
    radice.innerHTML = htmlPiano(p, { base });
    radice.querySelector('[data-modifica]')?.addEventListener('click', onModifica);

    let coda = null;
    const timer = montaTimer(radice, p, config, {
        onCambio: () => coda?.disegna(),
    });

    coda = montaStorico(radice.querySelector('#cottura-coda'), p, config, {
        // Funzione e non valore: viene richiamata a ogni ridisegno, così il
        // pannello passa dalla forma "in attesa" a quella con i pulsanti nel
        // momento in cui parte il primo timer, senza aspettare un ricarico.
        avviata: () => timer.sessione().fasi.some(f => f.avviatoA),
    });

    if (timer.altrove) mostraCotturaAltrove(radice, timer.altrove, base);
    if (!timer.supporti.schermo) avvisaSchermo(radice);

    return timer;
}

/**
 * Un kamado alla volta: se c'è una cottura avviata su un'altra configurazione
 * l'utente deve poterci tornare, invece di scoprire che l'ha persa premendo
 * "Avvia" qui.
 */
function mostraCotturaAltrove(radice, sessione, base) {
    const banner = document.createElement('div');
    banner.className = 'avviso avviso--attenzione avviso--in-cima';
    banner.innerHTML = `
      <strong class="avviso__titolo">Hai una cottura in corso: ${esc(sessione.etichetta)}</strong>
      <p class="avviso__testo">
        Avviando un timer su questa pagina quella si chiude.
        <a href="${base}/cottura/?${esc(scriviQuery(sessione.config))}">Torna a quella cottura</a>
      </p>`;
    radice.querySelector('.piano__premessa')?.after(banner);
}

function avvisaSchermo(radice) {
    const nota = document.createElement('p');
    nota.className = 'cottura-nota';
    nota.textContent = 'Su questo browser lo schermo non può restare acceso da solo: '
        + 'se si spegne i timer continuano comunque a contare, perché usano l\'orologio e non un conteggio interno.';
    radice.querySelector('.piano__premessa')?.after(nota);
}
