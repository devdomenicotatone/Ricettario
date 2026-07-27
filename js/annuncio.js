/**
 * ANNUNCIO.JS — l'unica regione live del sito.
 *
 * `#annuncio-pagina` sta in `index.html`, fuori da `#app`, ed è dichiarata
 * `role="status" aria-live="polite" aria-atomic="true"`. Chi ha bisogno di far
 * sapere qualcosa a chi ascolta la pagina passa da qui.
 *
 * PERCHÉ UNA SOLA, E PERCHÉ FUORI DA `#app`
 * Il router sostituisce il contenuto di `#app` a ogni navigazione. Una regione
 * live che venisse sostituita insieme al contenuto smetterebbe di essere
 * osservata dall'assistente, e l'annuncio successivo andrebbe perso senza che
 * niente lo segnali. Dev'essere sempre lo stesso elemento, e infatti è uno solo
 * per tutto il sito: il cambio di rotta e gli allarmi dei timer scrivono nello
 * stesso posto perché non capitano mai nello stesso istante.
 */

/**
 * Fa leggere `testo` a chi usa un lettore di schermo. Non fa niente di
 * visibile: la regione è ritagliata a un pixel da `.solo-lettore`.
 *
 * @param {string} testo - la frase da annunciare
 */
export function annuncia(testo) {
    const regione = document.getElementById('annuncio-pagina');
    if (!regione || !testo) return;

    // Svuotare e riempire nello stesso giro non produce annuncio: molti
    // assistenti confrontano il contenuto e, non vedendo differenze, tacciono.
    // Serve una pausa in mezzo perché il cambiamento venga notato — e serve
    // anche quando la frase è identica alla precedente, come quando si torna
    // sulla stessa pagina o scade due volte la stessa fase.
    //
    // `setTimeout` e non `requestAnimationFrame`: quest'ultimo è legato al
    // disegno, e in una scheda che il browser non sta ridisegnando non scatta
    // affatto. L'annuncio sparirebbe proprio quando la pagina è in secondo
    // piano — cioè, per i timer del calcolatore, quasi sempre. Misurato: con
    // rAF la regione restava vuota.
    regione.textContent = '';
    setTimeout(() => {
        regione.textContent = testo;
    }, 100);
}
