/**
 * VISTA-STORICO.JS — "com'è andata" e le cotture passate dello stesso taglio.
 *
 * È il pezzo che chiude il giro: il calcolatore propone dei tempi, tu cuoci, e
 * poi dici se il risultato era al punto. Dopo qualche cottura sullo stesso
 * taglio la tendenza dice se i coefficienti vanno alzati o abbassati — che è
 * l'unico modo onesto di trasformare stime in numeri tuoi.
 *
 * Il pannello dell'esito compare solo se la cottura è stata avviata davvero:
 * chiedere com'è andata a chi sta ancora leggendo il piano non ha senso.
 */

import { ESITI, registra, perTaglio, voceDi, tendenza } from './storico.js';
import { esc, num } from './formato.js';

const giorno = (ms) => new Date(ms).toLocaleDateString('it-IT', {
    day: 'numeric', month: 'long', year: 'numeric',
});

export function montaStorico(radice, piano, config, { avviata }) {
    function disegna() {
        const passate = perTaglio(config.taglio);
        const t = tendenza(config.taglio);
        radice.innerHTML = [
            avviata ? pannelloEsito(piano, config) : '',
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
                ${v.dominante === 'spessore' ? `${num(v.spessore)} cm` : `${num(v.peso)} kg`}
                · ${esc(String(v.cottura).replace(/_/g, ' '))}
                · estratta a ${v.estrazione_c} °C
              </div>
              ${v.nota ? `<p class="storico__nota">${esc(v.nota)}</p>` : ''}
            </li>`).join('')}
        </ul>
        ${voci.length > 8 ? `<p class="cottura-nota">Mostrate le ultime 8 di ${voci.length}.</p>` : ''}
      </section>`;
}
