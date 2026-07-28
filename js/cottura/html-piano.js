/**
 * HTML-PIANO.JS — il piano di cottura come stringa HTML. PURO.
 *
 * Nessun DOM, nessuna API del browser: questo file lo importa anche Node, in
 * scripts/generate-og.js, per pre-renderizzare le pagine statiche.
 *
 * È la ragione per cui il montaggio (ascoltatori, timer, storico) sta in
 * vista-piano.js e non qui: se il rendering e l'interattività vivessero nello
 * stesso file, il pre-rendering dovrebbe caricare Wake Lock e localStorage in
 * Node, e la strada facile sarebbe stata riscrivere il markup a mano nello
 * script di build — cioè una seconda copia, che divergerebbe.
 *
 * Da questo vincolo dipende una garanzia concreta: i dati strutturati HowTo
 * corrispondono a contenuto visibile perché la pagina statica e la pagina
 * interattiva escono dalla STESSA funzione.
 */

import { GRADI_COTTURA, METODI } from '../../dati/cottura/coefficienti.js';
import { esc, num, durata, porzioni, etichetta } from './formato.js';

const NOME_GRADO = Object.fromEntries(GRADI_COTTURA.map(g => [g.id, g.nome]));

// ═══════════════════════════════════════════════════════════════
//  HTML
// ═══════════════════════════════════════════════════════════════

export function htmlPiano(p, { base = '/Ricettario', modificabile = true } = {}) {
    const misura = p.misura.dominante === 'spessore'
        ? `${num(p.misura.spessore_cm)} cm`
        : `${num(p.misura.peso_kg)} kg`;

    // Rete di sicurezza: un avviso che punta a una fase inesistente finisce nel
    // pannello generale invece di non comparire da nessuna parte.
    const idFasi = new Set(p.fasi.map(f => f.id));
    const generali = p.avvisi.filter(a => !a.fase || !idFasi.has(a.fase));
    const sicurezza = generali.filter(a => a.gravita === 'sicurezza');
    const altri = generali.filter(a => a.gravita !== 'sicurezza');

    return `
      <article class="piano piano--${p.percorso}">
        <div class="container container--narrow">

          <nav class="breadcrumb">
            <a href="${base}/">Home</a>
            <span class="breadcrumb__separator">›</span>
            <a href="${base}/cottura/">Cottura su kamado</a>
            <span class="breadcrumb__separator">›</span>
            <span class="breadcrumb__current">${esc(p.taglio.nome)}</span>
          </nav>

          <header class="piano__testa">
            <h1 class="piano__titolo">${esc(p.taglio.nome)} da ${esc(misura)}</h1>
            <p class="piano__sottotitolo">
              ${esc(NOME_GRADO[p.cottura] || etichetta(p.cottura))} ·
              ${esc(METODI[p.metodo]?.nome || etichetta(p.metodo))} ·
              ${esc(p.dispositivo.nome)} (${p.dispositivo.griglia_cm} cm)
            </p>
            <ul class="piano__sintesi">
              <li><strong>${esc(durata(p.totale_min))}</strong> in tutto, braci comprese</li>
              <li><strong>${esc(porzioni(p.porzioni))}</strong></li>
              <li><strong>${esc(p.carbone.riempimento)}</strong></li>
            </ul>
            ${modificabile ? `<button class="piano__modifica" data-modifica>Cambia i parametri</button>` : ''}
          </header>

          <p class="piano__premessa">${esc(p.premessa)}</p>

          ${sicurezza.map(a => avviso(a)).join('')}

          ${boxEstrazione(p)}

          <ol class="piano__fasi">
            ${p.fasi.map((f, i) => fase(f, i, p)).join('')}
          </ol>

          ${p.ingombro.esito !== 'ci_sta' ? avviso({
        gravita: p.ingombro.gravita, titolo: 'Verifica le misure prima di accendere', testo: p.ingombro.testo,
    }) : ''}

          ${p.approfondimento ? `
            <section class="piano__blocco">
              <h2 class="piano__blocco-titolo">${esc(p.approfondimento.titolo)}</h2>
              ${p.approfondimento.paragrafi.map(t => `<p>${esc(t)}</p>`).join('')}
            </section>` : ''}

          <section class="piano__blocco">
            <h2 class="piano__blocco-titolo">Carbone</h2>
            <p>${esc(p.carbone.testo)}</p>
          </section>

          ${altri.length ? `
            <section class="piano__blocco">
              <h2 class="piano__blocco-titolo">Su questa configurazione</h2>
              ${altri.map(a => avviso(a)).join('')}
            </section>` : ''}

          ${p.note_specifiche?.length ? `
            <section class="piano__blocco">
              <h2 class="piano__blocco-titolo">Note su ${esc(p.taglio.nome)}</h2>
              <ul class="piano__elenco">${p.note_specifiche.map(n => `<li>${esc(n)}</li>`).join('')}</ul>
            </section>` : ''}

          ${p.errori_comuni?.length ? `
            <section class="piano__blocco">
              <h2 class="piano__blocco-titolo">Errori che si fanno di solito</h2>
              <ul class="piano__elenco piano__elenco--errori">${p.errori_comuni.map(n => `<li>${esc(n)}</li>`).join('')}</ul>
            </section>` : ''}

          <!-- Riempito da vista-storico.js: esito della cottura e cotture
               passate. Resta vuoto nelle pagine pre-generate, dove non c'è
               nessuno storico da mostrare. -->
          <div id="cottura-coda"></div>

        </div>
      </article>`;
}

/**
 * La temperatura di estrazione è il numero più importante della schermata, e la
 * gerarchia visiva deve dirlo. Senza sonda non c'è nessun numero da mostrare
 * lì: al suo posto va il tempo, che è tutto quello che si ha.
 */
function boxEstrazione(p) {
    if (p.percorso === 'tempi') {
        return `
          <div class="piano-estrazione piano-estrazione--tempi">
            <div class="piano-estrazione__etichetta">Cottura indiretta</div>
            <div class="piano-estrazione__numero">${esc(durata(p.fasi.find(f => f.timer && f.id !== 'braci')?.durata_min))}</div>
            <p class="piano-estrazione__dettaglio">
              Senza sonda il tempo è l'unico riferimento, e il riferimento è debole:
              lo stesso numero su due pezzi diversi dà due risultati diversi.
              La temperatura da raggiungere sarebbe ${p.estrazione.c} °C al cuore.
            </p>
          </div>`;
    }

    if (p.estrazione.carryover_c == null) {
        return `
          <div class="piano-estrazione">
            <div class="piano-estrazione__etichetta">Pronto a</div>
            <div class="piano-estrazione__numero">${p.estrazione.c} °C</div>
            <p class="piano-estrazione__dettaglio">
              Ma il numero è un'indicazione: il criterio vero è che ${esc(p.estrazione.criterio)}.
            </p>
          </div>`;
    }

    return `
      <div class="piano-estrazione">
        <div class="piano-estrazione__etichetta">Estrai dal kamado a</div>
        <div class="piano-estrazione__numero">${p.estrazione.c} °C</div>
        <p class="piano-estrazione__dettaglio">
          Non a ${p.estrazione.target_c} °C: durante il riposo la carne sale
          ancora di ${num(p.estrazione.carryover_c)} °C da sola.
          ${p.estrazione.pavimento_sicurezza
            ? 'Qui l\'estrazione non scende sotto la soglia di sicurezza, anche se il conto del carryover lo permetterebbe.'
            : ''}
        </p>
      </div>`;
}

function fase(f, indice, p) {
    const regole = p.avvisi.filter(a => a.fase === f.id);
    return `
      <li class="piano-fase${f.parallelo ? ' piano-fase--parallela' : ''}" id="fase-${esc(f.id)}">
        <div class="piano-fase__testa">
          <span class="piano-fase__numero">${indice + 1}</span>
          <h2 class="piano-fase__nome">${esc(f.nome)}</h2>
        </div>
        <div class="piano-fase__dati">
          ${f.durata_min ? `<span class="piano-fase__dato"><b>${esc(durata(f.durata_min))}</b></span>` : ''}
          ${f.camera_c ? `<span class="piano-fase__dato">camera ${f.camera_c} °C</span>` : ''}
          ${f.cuore_atteso_c ? `<span class="piano-fase__dato">cuore ${f.cuore_atteso_c} °C</span>` : ''}
        </div>
        ${f.timer && f.durata_min
            ? `<div class="piano-fase__timer" data-timer="${esc(f.id)}"></div>`
            : ''}
        ${f.azione?.length ? `<ul class="piano-fase__azioni">${f.azione.map(a => `<li>${esc(a)}</li>`).join('')}</ul>` : ''}
        ${f.checkpoint && p.percorso === 'temperature' ? `
          <div class="piano-fase__checkpoint">
            <span class="piano-fase__checkpoint-titolo">Se hai la sonda, controlla qui</span>
            ${f.checkpoint.map(c => `<span class="piano-fase__tappa">a ${c.al_minuto}′ → circa ${c.cuore_atteso_c} °C</span>`).join('')}
            <span class="piano-fase__checkpoint-nota">A metà cottura il cuore è molto più freddo di metà strada. È normale: non alzare la temperatura.</span>
          </div>` : ''}
        ${f.valvole ? `
          <div class="piano-fase__valvole">
            <span>Valvola sotto: <b>${esc(f.valvole.sotto)}</b></span>
            <span>Valvola sopra: <b>${esc(f.valvole.sopra)}</b></span>
            <em>${esc(f.valvole.avvertenza)}</em>
          </div>` : ''}
        ${regole.map(a => avviso(a)).join('')}
      </li>`;
}

function avviso(a) {
    return `
      <div class="avviso avviso--${esc(a.gravita || 'info')}">
        <strong class="avviso__titolo">${esc(a.titolo)}</strong>
        <p class="avviso__testo">${esc(a.testo)}</p>
      </div>`;
}
