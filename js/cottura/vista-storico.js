/**
 * VISTA-STORICO.JS — "com'è andata" e le cotture passate dello stesso taglio.
 *
 * È il pezzo che chiude il giro: il calcolatore propone dei tempi, tu cuoci, e
 * poi dici se il risultato era al punto. Dopo qualche cottura sullo stesso
 * taglio la tendenza dice se i coefficienti vanno alzati o abbassati — che è
 * l'unico modo onesto di trasformare stime in numeri tuoi.
 *
 * Il pannello si vede sempre, ma in due forme: chi ha avviato la cottura trova
 * i pulsanti, chi sta ancora leggendo il piano trova una riga che spiega a cosa
 * serve e quando comparirà. Prima esisteva solo la prima forma, quindi la
 * funzione era invisibile finché non la si trovava per caso — che è esattamente
 * come è andata la prima volta che qualcuno l'ha cercata.
 */

import { ESITI, registra, perTaglio, voceDi, tendenza } from './storico.js';
import { esc, num } from './formato.js';

const giorno = (ms) => new Date(ms).toLocaleDateString('it-IT', {
    day: 'numeric', month: 'long', year: 'numeric',
});

/**
 * @param {{avviata: () => boolean}} opzioni  `avviata` è una FUNZIONE, non un
 *   booleano: viene richiamata a ogni ridisegno. Con un booleano catturato al
 *   montaggio il pannello restava quello di partenza anche dopo l'avvio del
 *   primo timer, e cambiava solo ricaricando la pagina.
 */
export function montaStorico(radice, piano, config, { avviata }) {
    function disegna() {
        const passate = perTaglio(config.taglio);
        const t = tendenza(config.taglio);
        const partita = typeof avviata === 'function' ? avviata() : Boolean(avviata);
        radice.innerHTML = [
            partita ? pannelloEsito(piano, config) : pannelloInAttesa(),
            passate.length ? elencoPassate(passate, t) : '',
        ].join('');
    }

    radice.addEventListener('click', (e) => {
        const scelta = e.target.closest('[data-esito]');
        if (!scelta) return;
        radice.querySelectorAll('[data-esito]').forEach(b => {
            b.classList.toggle('is-attiva', b === scelta);
            b.setAttribute('aria-pressed', String(b === scelta));
        });
    });

    radice.addEventListener('submit', (e) => {
        const modulo = e.target.closest('[data-modulo-esito]');
        if (!modulo) return;
        e.preventDefault();

        const scelta = radice.querySelector('[data-esito].is-attiva');
        if (!scelta) {
            radice.querySelector('.esito__errore').textContent = 'Scegli com\'è venuta: è il dato che serve per tarare.';
            return;
        }

        registra({
            config,
            piano,
            esito: scelta.dataset.esito,
            nota: modulo.querySelector('[name="nota"]').value,
            quando: Date.now(),
        });
        disegna();
    });

    disegna();
    return { disegna };
}

// ═══════════════════════════════════════════════════════════════

/**
 * Forma "in attesa": visibile, ma non invita a dichiarare l'esito di una
 * cottura che non è ancora cominciata. Dice anche quando comparirà l'altra, che
 * era l'informazione mancante.
 */
function pannelloInAttesa() {
    return `
      <section class="esito esito--attesa">
        <h2 class="piano__blocco-titolo">Com'è andata</h2>
        <p class="esito__perche">
          Quando avrai cucinato questo piano, qui potrai registrare com'è venuta —
          al punto, poco cotta, troppo cotta — con una nota tua.
          Serve a tarare i tempi sul tuo kamado: dopo tre cotture sullo stesso
          taglio il sito ti dice in che direzione correggere i coefficienti.
        </p>
        <p class="esito__quando">Compare appena avvii il primo timer qui sopra.</p>
      </section>`;
}

function pannelloEsito(piano, config) {
    const gia = voceDi(config, Date.now());

    return `
      <section class="esito">
        <h2 class="piano__blocco-titolo">Com'è andata</h2>
        <p class="esito__perche">
          ${gia
            ? 'Registrata. Puoi correggere la risposta se ci ripensi.'
            : 'Serve a tarare i coefficienti sul tuo kamado: dopo tre cotture sullo stesso taglio '
            + 'il sito ti dice se i tempi vanno alzati o abbassati.'}
        </p>
        <form data-modulo-esito>
          <div class="esito__scelte">
            ${ESITI.map(e => `
              <button type="button" class="cottura-opzione${gia?.esito === e.id ? ' is-attiva' : ''}"
                      data-esito="${esc(e.id)}" aria-pressed="${gia?.esito === e.id ? 'true' : 'false'}">
                <span class="cottura-opzione__titolo">${esc(e.nome)}</span>
              </button>`).join('')}
          </div>
          <label class="esito__nota">
            <span>Nota (facoltativa) — quello che ricorderesti la prossima volta</span>
            <textarea name="nota" rows="3" maxlength="400"
              placeholder="Es. il lardello è rimasto bianco, la prossima volta due minuti in più in piedi">${esc(gia?.nota || '')}</textarea>
          </label>
          <p class="esito__errore" role="alert"></p>
          <button type="submit" class="cottura-azione">${gia ? 'Aggiorna' : 'Registra la cottura'}</button>
        </form>
      </section>`;
}

/**
 * Ogni valore passa da `esc`, compresi quelli che dovrebbero essere numeri.
 *
 * `num()` è solo `String(n).replace('.', ',')` e non protegge niente, e queste
 * voci arrivano da localStorage, che `leggiStorico` valida solo nella forma
 * esterna (versione + array), mai nei campi. Un `estrazione_c` contenente un
 * tag immagine con `onerror` eseguiva all'apertura dello storico, senza un
 * clic — provato, non dedotto.
 *
 * Nota per chi modifica: qui dentro non si scrivono commenti HTML, perché il
 * markup è un template literal e i backtick di un commento lo chiuderebbero.
 */
function elencoPassate(voci, t) {
    return `
      <section class="piano__blocco">
        <!-- Niente toLowerCase sul nome del taglio: "Fiorentina / T-bone"
             diventerebbe "fiorentina / t-bone". -->
        <h2 class="piano__blocco-titolo">Le tue cotture di ${esc(voci[0].nomeTaglio)} — ${voci.length}</h2>

        ${t.suggerimento ? `
          <div class="avviso avviso--attenzione">
            <strong class="avviso__titolo">Tendenza su ${voci.length >= 3 ? 'queste cotture' : 'poche cotture'}</strong>
            <p class="avviso__testo">${esc(t.suggerimento)}</p>
          </div>` : ''}

        <ul class="storico">
          ${voci.slice(0, 8).map(v => `
            <li class="storico__voce">
              <div class="storico__testa">
                <span class="storico__quando">${esc(giorno(v.quando))}</span>
                ${v.esito ? `<span class="storico__esito storico__esito--${esc(v.esito)}">${esc(ESITI.find(e => e.id === v.esito)?.nome || v.esito)}</span>` : ''}
              </div>
              <div class="storico__dati">
                ${v.dominante === 'spessore' ? `${esc(num(v.spessore))} cm` : `${esc(num(v.peso))} kg`}
                · ${esc(String(v.cottura).replace(/_/g, ' '))}
                · estratta a ${esc(v.estrazione_c)} °C
              </div>
              ${v.nota ? `<p class="storico__nota">${esc(v.nota)}</p>` : ''}
            </li>`).join('')}
        </ul>
        ${voci.length > 8 ? `<p class="cottura-nota">Mostrate le ultime 8 di ${voci.length}.</p>` : ''}
      </section>`;
}
