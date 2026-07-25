/**
 * FORM.JS — il form a step del calcolatore di cottura.
 *
 * Una decisione per schermata, pulsante sempre nello stesso punto in basso.
 * Si usa in giardino davanti al kamado, spesso con una mano e con le dita
 * sporche: i target sono grandi, il contrasto alto, e non c'è nulla che
 * richieda precisione di puntamento.
 *
 * Gli step sono dati, non codice ripetuto: `rilevante` decide se lo step ha
 * senso per il taglio scelto, e quelli con una sola risposta possibile
 * spariscono invece di chiedere una scelta che non esiste (il brisket non ha
 * gradi di cottura, il pollo non ha metodi alternativi).
 */

import {
    GRADI_COTTURA, METODI, PARTENZA, SOGLIE,
} from '../../dati/cottura/coefficienti.js';
import { ossoObbligato } from './stato-url.js';
import { esc, num } from './formato.js';

const CHIAVE_ATTREZZATURA = 'ricettario-cottura-attrezzatura';

// ═══════════════════════════════════════════════════════════════
//  SUGGERIMENTO DEL METODO
// ═══════════════════════════════════════════════════════════════

/**
 * Il metodo consigliato dal taglio, corretto per lo spessore effettivo: su una
 * bistecca sottile il reverse sear è il metodo sbagliato anche se è quello
 * scritto nel profilo.
 */
export function metodoSuggerito(taglio, spessore) {
    if (taglio.famiglia === 'bistecca'
        && spessore < SOGLIE.reverse_sear_spessore_minimo
        && taglio.metodi_ammessi.includes('diretta')) {
        return 'diretta';
    }
    return taglio.metodo_consigliato;
}

// ═══════════════════════════════════════════════════════════════
//  STEP
// ═══════════════════════════════════════════════════════════════

const STEP = [
    {
        id: 'taglio',
        domanda: 'Che cosa cuoci?',
        rilevante: () => true,
        render: (s, d) => opzioni(d.tagli.map(t => ({
            valore: t.id,
            campo: 'taglio',
            attiva: s.taglio === t.id,
            titolo: t.nome,
            riga: descrizioneTaglio(t),
        }))),
    },

    {
        id: 'misure',
        domanda: (s, d) => taglioDi(s, d).parametro_dominante === 'spessore'
            ? 'Quanto è spessa?'
            : 'Quanto pesa?',
        rilevante: () => true,
        render: (s, d) => {
            const t = taglioDi(s, d);
            const perSpessore = t.parametro_dominante === 'spessore';
            const blocchi = [];

            blocchi.push(perSpessore
                ? cursore('spessore', s.spessore, t.spessore, 0.5, 'cm')
                : cursore('peso', s.peso, t.peso, 0.1, 'kg'));

            blocchi.push(`<p class="cottura-nota">${perSpessore
                ? 'Lo spessore è il parametro che decide il tempo, non il peso: una bistecca da 800 g spessa 3 cm cuoce prima di una da 600 g spessa 5.'
                : 'Su un pezzo intero il peso è il parametro che conta. Serve anche a stimare le porzioni.'}</p>`);

            // Il secondo parametro serve comunque, per porzioni e carryover.
            blocchi.push(perSpessore
                ? cursore('peso', s.peso, t.peso, 0.1, 'kg', 'Peso del pezzo — serve per le porzioni')
                : cursore('spessore', s.spessore, t.spessore, 0.5, 'cm', 'Spessore nel punto più grosso'));

            if (ossoObbligato(t) === null) {
                blocchi.push(sottotitolo('Osso'));
                blocchi.push(opzioni([
                    { valore: '1', campo: 'osso', attiva: s.osso === true, titolo: 'Con osso' },
                    { valore: '0', campo: 'osso', attiva: s.osso === false, titolo: 'Senza osso' },
                ], 'orizzontale'));
            }

            if (t.gestione_grasso?.bordo_grasso) {
                blocchi.push(sottotitolo('Bordo di grasso (lardello)'));
                blocchi.push(opzioni([
                    { valore: '0', campo: 'bordo_grasso_cm', attiva: !s.bordo_grasso_cm, titolo: 'Assente o sottile' },
                    { valore: '1', campo: 'bordo_grasso_cm', attiva: s.bordo_grasso_cm === 1, titolo: 'Circa 1 cm' },
                    { valore: '1.8', campo: 'bordo_grasso_cm', attiva: s.bordo_grasso_cm === 1.8, titolo: 'Più di 1,5 cm' },
                ], 'orizzontale'));
            }

            return blocchi.join('');
        },
    },

    {
        id: 'partenza',
        domanda: 'Da che temperatura parti?',
        // Su una cottura di dieci ore la temperatura di partenza è irrilevante.
        rilevante: (s, d) => taglioDi(s, d).famiglia !== 'low_and_slow',
        render: (s) => opzioni(Object.entries(PARTENZA).map(([id, p]) => ({
            valore: id,
            campo: 'partenza',
            attiva: s.partenza === id,
            titolo: p.nome,
            badge: p.dettaglio,
        }))),
    },

    {
        id: 'cottura',
        domanda: 'Come la vuoi?',
        // Sul low & slow non c'è nulla da scegliere né da spiegare: si va a
        // cedimento del collagene, non a grado di cottura. Su tutto il resto lo
        // step serve, anche quando l'unica opzione ammessa è una: le altre
        // compaiono bloccate col perché, che è metà del valore della schermata.
        rilevante: (s, d) => taglioDi(s, d).famiglia !== 'low_and_slow',
        render: (s, d) => {
            const t = taglioDi(s, d);
            const righe = GRADI_COTTURA.map(g => {
                const ammessa = t.cotture_ammesse.includes(g.id);
                const temp = t.temperature_cuore[g.id];
                return {
                    valore: g.id,
                    campo: 'cottura',
                    attiva: s.cottura === g.id,
                    titolo: g.nome,
                    badge: temp != null ? `${temp} °C` : null,
                    bloccata: !ammessa,
                    // La spiegazione è nel dato, non inventata qui: `verifica`
                    // in build-cottura.js impedisce che un taglio escluda
                    // qualcosa senza dire perché.
                    perche: ammessa ? null : (t.motivo_soglia || t.motivo_cotture_escluse),
                };
            });
            return opzioni(righe) + `<p class="cottura-nota">La temperatura accanto a ogni voce è quella al cuore, ed è l'unico dato che decide davvero se la carne è come la volevi.</p>`;
        },
    },

    {
        id: 'metodo',
        domanda: 'Con che metodo?',
        rilevante: (s, d) => taglioDi(s, d).metodi_ammessi.length > 1,
        render: (s, d) => {
            const t = taglioDi(s, d);
            const suggerito = metodoSuggerito(t, s.spessore);
            return opzioni(t.metodi_ammessi.map(m => ({
                valore: m,
                campo: 'metodo',
                attiva: s.metodo === m,
                titolo: METODI[m].nome,
                riga: METODI[m].riga,
                badge: m === suggerito ? 'consigliato' : null,
            })));
        },
    },

    {
        id: 'attrezzatura',
        domanda: 'La tua attrezzatura',
        rilevante: () => true,
        render: (s, d) => {
            const blocchi = [];
            blocchi.push(sottotitolo('Misura del kamado'));
            blocchi.push(opzioni(d.dispositivi.map(disp => ({
                valore: disp.id,
                campo: 'dispositivo',
                attiva: s.dispositivo === disp.id,
                titolo: `${disp.nome} — ${disp.pollici}"`,
                riga: disp.modelli.slice(0, 3).join(' · '),
                badge: `${disp.griglia_cm} cm`,
            }))));

            blocchi.push(sottotitolo('Cosa hai a disposizione'));
            blocchi.push(interruttori([
                { campo: 'sonda', attiva: s.sonda, titolo: 'Termometro a sonda', riga: 'Cambia tutto il piano: con la sonda comandano le temperature, senza comandano i tempi.' },
                { campo: 'deflettore', attiva: s.deflettore, titolo: 'Deflettore', riga: 'Serve per qualunque cottura indiretta.' },
                { campo: 'griglia_rialzata', attiva: s.griglia_rialzata, titolo: 'Griglia rialzata', riga: 'Distanza dalle braci: conta di più sui kamado piccoli.' },
            ]));

            blocchi.push(sottotitolo('Legno da affumicatura'));
            blocchi.push(opzioni([
                { valore: '', campo: 'legno', attiva: !s.legno, titolo: 'Niente legno' },
                ...['quercia', 'ciliegio', 'melo', 'faggio', 'hickory'].map(l => ({
                    valore: l, campo: 'legno', attiva: s.legno === l,
                    titolo: l.charAt(0).toUpperCase() + l.slice(1),
                })),
            ], 'orizzontale'));

            return blocchi.join('');
        },
    },
];

// ═══════════════════════════════════════════════════════════════
//  PEZZI DI INTERFACCIA
// ═══════════════════════════════════════════════════════════════

function taglioDi(stato, dati) {
    return dati.tagli.find(t => t.id === stato.taglio) || dati.tagli[0];
}

function descrizioneTaglio(t) {
    const famiglia = {
        bistecca: 'bistecca', arrosto: 'arrosto', intero: 'pezzo intero', low_and_slow: 'low & slow',
    }[t.famiglia] || t.famiglia;
    return `${famiglia} · ${t.specie}${t.grasso === 'magro' ? ' · magro' : ''}`;
}

function sottotitolo(testo) {
    return `<h2 class="cottura-sottotitolo">${esc(testo)}</h2>`;
}

function opzioni(righe, disposizione = 'verticale') {
    return `<div class="cottura-opzioni cottura-opzioni--${disposizione}">${righe.map(riga => {
        if (riga.bloccata) {
            return `
              <div class="cottura-opzione cottura-opzione--bloccata">
                <button class="cottura-opzione__testa" data-perche="${esc(riga.valore)}" aria-expanded="false">
                  <span class="cottura-opzione__lucchetto" aria-hidden="true">🔒</span>
                  <span class="cottura-opzione__titolo">${esc(riga.titolo)}</span>
                  ${riga.badge ? `<span class="cottura-opzione__badge">${esc(riga.badge)}</span>` : ''}
                  <span class="cottura-opzione__perche">perché?</span>
                </button>
                <div class="cottura-opzione__spiegazione" id="perche-${esc(riga.valore)}" hidden>
                  ${esc(riga.perche || 'Questa opzione non è prevista per questo taglio.')}
                </div>
              </div>`;
        }
        return `
          <button class="cottura-opzione${riga.attiva ? ' is-attiva' : ''}"
                  data-campo="${esc(riga.campo)}" data-valore="${esc(riga.valore)}"
                  aria-pressed="${riga.attiva ? 'true' : 'false'}">
            <span class="cottura-opzione__titolo">${esc(riga.titolo)}</span>
            ${riga.badge ? `<span class="cottura-opzione__badge">${esc(riga.badge)}</span>` : ''}
            ${riga.riga ? `<span class="cottura-opzione__riga">${esc(riga.riga)}</span>` : ''}
          </button>`;
    }).join('')}</div>`;
}

function interruttori(righe) {
    return `<div class="cottura-opzioni cottura-opzioni--verticale">${righe.map(riga => `
      <button class="cottura-opzione cottura-opzione--interruttore${riga.attiva ? ' is-attiva' : ''}"
              data-campo="${esc(riga.campo)}" data-valore="${riga.attiva ? '0' : '1'}"
              aria-pressed="${riga.attiva ? 'true' : 'false'}">
        <span class="cottura-opzione__titolo">${esc(riga.titolo)}</span>
        <span class="cottura-opzione__riga">${esc(riga.riga)}</span>
        <span class="cottura-interruttore" aria-hidden="true"></span>
      </button>`).join('')}</div>`;
}

function cursore(campo, valore, range, passo, unita, etichetta) {
    return `
      <div class="cottura-cursore">
        ${etichetta ? `<div class="cottura-cursore__etichetta">${esc(etichetta)}</div>` : ''}
        <output class="cottura-cursore__valore" data-uscita="${esc(campo)}">${num(valore)} ${esc(unita)}</output>
        <input type="range" class="cottura-cursore__input"
               data-cursore="${esc(campo)}" data-unita="${esc(unita)}"
               min="${range.min}" max="${range.max}" step="${passo}" value="${valore}"
               aria-label="${esc(etichetta || campo)}">
        <div class="cottura-cursore__estremi">
          <span>${num(range.min)}</span><span>${num(range.max)}</span>
        </div>
      </div>`;
}

// ═══════════════════════════════════════════════════════════════
//  MONTAGGIO
// ═══════════════════════════════════════════════════════════════

/**
 * @param {HTMLElement} radice  contenitore in cui vivere
 * @param {object} stato        configurazione iniziale (già normalizzata)
 * @param {object} dati         { tagli, dispositivi }
 * @param {{onFine: (stato) => void, onAnnulla?: () => void}} azioni
 */
export function montaForm(radice, stato, dati, azioni) {
    const s = { ...stato, ...attrezzaturaRicordata() };
    let indice = 0;

    const attivi = () => STEP.filter(p => p.rilevante(s, dati));

    function disegna() {
        const passi = attivi();
        indice = Math.min(indice, passi.length - 1);
        const passo = passi[indice];
        const ultimo = indice === passi.length - 1;

        radice.innerHTML = `
          <div class="cottura-form">
            <header class="cottura-form__testa">
              <button class="cottura-torna" data-indietro aria-label="Indietro">←</button>
              <div class="cottura-avanzamento" role="progressbar"
                   aria-valuemin="1" aria-valuemax="${passi.length}" aria-valuenow="${indice + 1}">
                ${passi.map((_, i) => `<span class="cottura-avanzamento__punto${i <= indice ? ' is-fatto' : ''}"></span>`).join('')}
              </div>
              <span class="cottura-form__contatore">${indice + 1}/${passi.length}</span>
            </header>

            <h1 class="cottura-domanda">${esc(risolvi(passo.domanda, s, dati))}</h1>
            <div class="cottura-form__corpo">${passo.render(s, dati)}</div>

            <div class="cottura-form__piede">
              <button class="cottura-azione" data-avanti>
                ${ultimo ? 'Vedi il piano di cottura' : 'Avanti'}
              </button>
            </div>
          </div>`;
        radice.querySelector('.cottura-form__corpo')?.scrollTo?.(0, 0);
        window.scrollTo(0, 0);
    }

    radice.addEventListener('click', (e) => {
        const opzione = e.target.closest('[data-campo]');
        if (opzione) {
            imposta(s, opzione.dataset.campo, opzione.dataset.valore, dati);
            disegna();
            return;
        }

        const perche = e.target.closest('[data-perche]');
        if (perche) {
            const box = radice.querySelector(`#perche-${CSS.escape(perche.dataset.perche)}`);
            const aperto = perche.getAttribute('aria-expanded') === 'true';
            perche.setAttribute('aria-expanded', String(!aperto));
            if (box) box.hidden = aperto;
            return;
        }

        if (e.target.closest('[data-avanti]')) {
            const passi = attivi();
            if (indice === passi.length - 1) {
                ricordaAttrezzatura(s);
                azioni.onFine(s);
            } else {
                indice++;
                disegna();
            }
            return;
        }

        if (e.target.closest('[data-indietro]')) {
            if (indice === 0) {
                azioni.onAnnulla?.();
            } else {
                indice--;
                disegna();
            }
        }
    });

    // Durante il trascinamento aggiorno solo il numero: ridisegnare lo step a
    // ogni evento `input` farebbe perdere il contatto col cursore.
    radice.addEventListener('input', (e) => {
        const cursore = e.target.closest('[data-cursore]');
        if (!cursore) return;
        const uscita = radice.querySelector(`[data-uscita="${cursore.dataset.cursore}"]`);
        if (uscita) uscita.textContent = `${num(cursore.value)} ${cursore.dataset.unita}`;
    });

    radice.addEventListener('change', (e) => {
        const cursore = e.target.closest('[data-cursore]');
        if (!cursore) return;
        s[cursore.dataset.cursore] = parseFloat(cursore.value);
    });

    disegna();
}

function risolvi(v, s, d) {
    return typeof v === 'function' ? v(s, d) : v;
}

/**
 * Scrivere un campo può invalidare quelli scelti dopo: cambiando taglio, la
 * cottura e il metodo di prima possono non esistere più. Qui si azzerano
 * invece di trascinarsi dietro un valore incompatibile.
 */
function imposta(s, campo, valore, dati) {
    if (campo === 'taglio') {
        if (s.taglio === valore) return;
        const t = dati.tagli.find(x => x.id === valore);
        s.taglio = valore;
        s.spessore = t.spessore.default;
        s.peso = t.peso.default;
        s.osso = t.con_osso === 'sempre';
        s.bordo_grasso_cm = 0;
        s.cottura = t.cotture_ammesse[Math.min(1, t.cotture_ammesse.length - 1)];
        s.metodo = metodoSuggerito(t, t.spessore.default);
        return;
    }
    if (campo === 'osso') { s.osso = valore === '1'; return; }
    if (campo === 'bordo_grasso_cm') { s.bordo_grasso_cm = parseFloat(valore); return; }
    if (campo === 'legno') { s.legno = valore || null; return; }
    if (['sonda', 'deflettore', 'griglia_rialzata'].includes(campo)) {
        s[campo] = valore === '1';
        return;
    }
    s[campo] = valore;
}

// ── L'attrezzatura non cambia tra una cottura e l'altra ──

function attrezzaturaRicordata() {
    try {
        const salvata = JSON.parse(localStorage.getItem(CHIAVE_ATTREZZATURA) || 'null');
        if (!salvata || typeof salvata !== 'object') return {};
        return salvata;
    } catch {
        return {};
    }
}

function ricordaAttrezzatura(s) {
    try {
        localStorage.setItem(CHIAVE_ATTREZZATURA, JSON.stringify({
            dispositivo: s.dispositivo,
            sonda: s.sonda,
            deflettore: s.deflettore,
            griglia_rialzata: s.griglia_rialzata,
        }));
    } catch {
        // Modalità privata o storage pieno: si perde il ricordo, non la funzione.
    }
}
