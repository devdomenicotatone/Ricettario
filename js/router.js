/* ============================================
   IL RICETTARIO — SPA Router (2026)
   Client-side router per GitHub Pages
   ============================================ */

import { annuncia } from './annuncio.js';
import { mostraNonTrovata } from './non-trovata.js';

const BASE = import.meta.env.BASE_URL; // es. "/Ricettario/"

/**
 * Mappa dei renderer per tipo di pagina.
 * Ogni renderer riceve il container #app e i params estratti dalla route.
 */
let renderers = {};

/**
 * Registra i renderer per le varie pagine.
 * Chiamato da main.js all'avvio.
 */
export function registerRenderers(map) {
  renderers = map;
}

/**
 * Determina il tipo di pagina dall'URL corrente.
 * Returns: { type: 'home' | 'recipe' | 'category' | 'cottura' | 'nonTrovata', params: {...} }
 */
function matchRoute(pathname) {
  // Rimuovi base path
  let path = pathname.replace(BASE, '').replace(/^\/+|\/+$/g, '');

  // Homepage
  if (!path || path === 'index.html') {
    return { type: 'home', params: {} };
  }

  // Ricetta: ricette/<categoria>/<slug>
  const recipeMatch = path.match(/^ricette\/([^/]+)\/([^/]+?)(?:\.html)?$/);
  if (recipeMatch) {
    return { type: 'recipe', params: { category: recipeMatch[1], slug: recipeMatch[2] } };
  }

  // Categoria: ricette/<categoria>/
  const catMatch = path.match(/^ricette\/([^/]+)\/?$/);
  if (catMatch) {
    return { type: 'category', params: { category: catMatch[1] } };
  }

  // Calcolatore cottura: cottura/ oppure cottura/<slug-configurazione>
  // Lo slug serve alle pagine pre-generate (fiorentina-4cm-kamado); la
  // configurazione libera viaggia in query string, che il renderer legge da
  // window.location.
  const cotturaMatch = path.match(/^cottura(?:\/([^/]+?))?(?:\.html)?$/);
  if (cotturaMatch) {
    return { type: 'cottura', params: { config: cotturaMatch[1] || null } };
  }

  // Nessuna forma riconosciuta → la pagina non esiste.
  //
  // Qui c'era `{ type: 'home' }`, ed è il motivo per cui
  // /Ricettario/ricette/ mostrava la homepage con l'indirizzo sbagliato nella
  // barra: contenuto buono sotto un URL che non esiste, e nessun segnale per
  // chi legge. Il server la risposta giusta la dà già — misurato il
  // 28/07/2026: GitHub Pages risponde 404 e serve 404.html, che è lo shim
  // della SPA — quindi qui mancava solo di dirlo a chi guarda.
  //
  // Attenzione a cosa NON si decide qui: se una categoria o una ricetta
  // ESISTANO lo sanno i dati, non la forma dell'URL. Quelle risposte restano
  // dove stanno già (`CATEGORIES_BY_DIR` in renderCategory, il 404 del fetch
  // in renderRecipe, `configDaSlug` nel calcolatore). Portarle qui vorrebbe
  // dire una seconda copia del registry delle categorie e un recipes.json
  // scaricato prima di ogni navigazione.
  return { type: 'nonTrovata', params: { percorso: pathname } };
}

/**
 * Il primo `navigateTo` è quello che disegna la pagina appena aperta, non un
 * cambio di rotta: lì non si sposta il focus e non si annuncia niente. Il
 * browser ha già fatto il suo lavoro, e rubare il focus al caricamento
 * disorienta invece di aiutare.
 */
let primaNavigazione = true;

/**
 * Quello che va fatto DOPO che il contenuto nuovo è nel DOM.
 *
 * Perché serve: questa è una SPA. Cliccando una ricetta il browser non carica
 * niente — il contenuto viene sostituito e basta. Chi vede se ne accorge; chi
 * usa uno screen reader no: il focus resta dov'era, la voce resta ferma, e
 * l'unico indizio che qualcosa è successo è che non c'è nessun indizio.
 *
 * Si fanno DUE cose, e nessuna delle due basta da sola:
 *
 *   il focus va sull'H1 della pagina  perché altrimenti il Tab successivo
 *                                     ripartirebbe dalla navbar, cioè da capo,
 *                                     a ogni navigazione;
 *   il titolo va nella regione live   perché un H1 da solo non dice che è
 *                                     cambiata la pagina intera.
 *
 * PERCHÉ L'H1 E NON PIÙ `main#contenuto`: con il fuoco sull'intero contenitore,
 * NVDA leggeva la ricetta INTERA in un annuncio unico e ininterrotto da
 * 8-9.000 caratteri — briciole, tabella ingredienti riga per riga, tutti i
 * passaggi (punto 10 di CHECKUP-ACCESSIBILITA.md, misurato sul sito
 * pubblicato). Spostare il fuoco su un elemento piccolo è il pattern standard
 * delle SPA, ed è lo stesso già usato dal form di cottura sulla sua domanda.
 * Onestà dovuta: il meccanismo esatto del megannuncio non è mai stato isolato
 * (tre riproduzioni sintetiche non lo riproducono), quindi questa è l'ipotesi
 * più probabile applicata, non una correzione dimostrata — va ri-misurata con
 * NVDA sul sito pubblicato prima di chiudere il punto 10.
 *
 * Il fallback su `#contenuto` resta per le pagine senza H1 (non dovrebbero
 * esistere, ma un fuoco perso alla navbar è peggio di un annuncio lungo).
 *
 * L'annuncio viene messo dopo il focus e non prima: al contrario, la voce
 * dell'assistente verrebbe interrotta dal cambio di focus a metà frase.
 */
function dopoIlCambioPagina() {
  const contenuto = document.getElementById('contenuto');
  const destinazione = contenuto?.querySelector('h1') || contenuto;
  if (destinazione) {
    if (!destinazione.hasAttribute('tabindex')) destinazione.setAttribute('tabindex', '-1');
    destinazione.focus({ preventScroll: true });
  }

  // Il titolo del documento lo aggiorna il renderer: qui si legge dopo, a
  // contenuto già scritto. Il `— Ricettario Lab` finale si toglie perché
  // ripeterlo a ogni navigazione è rumore.
  const titolo = document.title.replace(/\s*[—-]\s*(Il )?Ricettario( Lab)?\s*$/i, '').trim();

  // La regione live è una sola per tutto il sito: vedi js/annuncio.js, dove
  // sta anche il perché della pausa prima di scrivere.
  annuncia(titolo ? `${titolo}, pagina caricata` : 'Pagina caricata');
}

/**
 * Naviga a un URL, renderizza la pagina corrispondente.
 */
async function navigateTo(url, pushState = true) {
  const fullUrl = new URL(url, window.location.origin);

  if (pushState) {
    // La query string va conservata: il calcolatore di cottura ci tiene la
    // configurazione, e troncarla renderebbe i link non ricaricabili.
    history.pushState(null, '', fullUrl.pathname + fullUrl.search);
  }

  const route = matchRoute(fullUrl.pathname);
  const app = document.getElementById('app');

  if (!app) return;

  // Scroll to top
  window.scrollTo(0, 0);

  // Il primo giro disegna la pagina aperta dall'utente: non è un cambio di
  // rotta, e non va né annunciato né rubato il focus.
  const eraLaPrima = primaNavigazione;
  primaNavigazione = false;

  // View Transition API per animazioni fluide
  if ('startViewTransition' in document) {
    const transizione = document.startViewTransition(async () => {
      await renderRoute(route, app, eraLaPrima);
    });
    // `updateCallbackDone` scatta quando il DOM nuovo è a posto, senza
    // aspettare la fine dell'animazione: il focus non deve stare dietro a
    // mezzo secondo di dissolvenza.
    if (!eraLaPrima) transizione.updateCallbackDone.then(dopoIlCambioPagina).catch(() => {});
  } else {
    await renderRoute(route, app, eraLaPrima);
    if (!eraLaPrima) dopoIlCambioPagina();
  }
}

/**
 * Renderizza la route corrente nel container #app.
 *
 * `primoCaricamento` dice al renderer che sta disegnando la pagina con cui il
 * sito si è aperto: le pagine ricetta lo usano per NON buttare il contenuto
 * pre-renderizzato già servito dentro #app in favore dello spinner. I
 * renderer che non se ne curano lo ignorano.
 */
async function renderRoute(route, app, primoCaricamento = false) {
  const renderer = renderers[route.type];
  if (renderer) {
    await renderer(app, route.params, { primoCaricamento });
  } else {
    // Guardia difensiva: il tipo `nonTrovata` un renderer ce l'ha (main.js),
    // quindi qui ci si arriva solo se un giorno nasce un tipo di rotta e
    // nessuno lo registra. La pagina è la stessa delle altre non trovate — un
    // H1 a cui dare il fuoco e un `document.title` per la regione live — così
    // il buco si vede invece di far sparire il contenuto.
    mostraNonTrovata(app, { base: BASE });
  }

  // Re-init scroll reveal per i nuovi elementi
  initReveal();
}

/**
 * Inizializza IntersectionObserver per gli elementi .reveal
 */
function initReveal() {
  const reveals = document.querySelectorAll('.reveal:not(.visible)');
  if (reveals.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  reveals.forEach(el => observer.observe(el));
}

/**
 * Inizializza il router: intercetta click sui link, popstate, e
 * gestisce il redirect da 404.html di GitHub Pages.
 */
export function initRouter() {
  // 1. Gestisci redirect da 404.html (GitHub Pages SPA hack)
  const redirectPath = sessionStorage.getItem('spa-redirect');
  if (redirectPath) {
    sessionStorage.removeItem('spa-redirect');
    history.replaceState(null, '', redirectPath);
  }

  // 2. Intercetta click sui link interni
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href]');
    if (!link) return;

    const href = link.getAttribute('href');

    // Gestione link navbar con data-nav-section
    const navSection = link.getAttribute('data-nav-section');
    if (navSection) {
      const route = matchRoute(window.location.pathname);
      if (route.type !== 'home') {
        // Non siamo in homepage: naviga prima alla home, poi scrolla
        e.preventDefault();
        navigateTo(BASE).then(() => {
          setTimeout(() => {
            const target = document.getElementById(navSection);
            if (target) target.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        });
        return;
      }
      // Siamo in homepage: lascia il comportamento anchor nativo
      return;
    }

    // Skip link esterni, anchor, mailto, tel
    if (!href || href.startsWith('http') || href.startsWith('#') ||
        href.startsWith('mailto:') || href.startsWith('tel:')) return;

    // Skip se ha target="_blank"
    if (link.target === '_blank') return;

    e.preventDefault();

    // Risolvi URL relativo
    const resolved = new URL(href, window.location.href);
    navigateTo(resolved.href);
  });

  // 3. Back/Forward del browser
  window.addEventListener('popstate', () => {
    navigateTo(window.location.href, false);
  });

  // 4. Render iniziale
  navigateTo(window.location.href, false);
}

export { navigateTo, initReveal, BASE };
