/* ============================================
   IL RICETTARIO — SPA Router (2026)
   Client-side router per GitHub Pages
   ============================================ */

import { annuncia } from './annuncio.js';

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
 * Returns: { type: 'home' | 'recipe' | 'category', params: {...} }
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

  // Fallback → homepage
  return { type: 'home', params: {} };
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
 *   il focus va su `main#contenuto`  perché altrimenti il Tab successivo
 *                                    ripartirebbe dalla navbar, cioè da capo,
 *                                    a ogni navigazione;
 *   il titolo va nella regione live  perché `<main>` da solo si annuncia come
 *                                    "principale" e non dice DOVE sei
 *                                    arrivato.
 *
 * L'annuncio viene messo dopo il focus e non prima: al contrario, la voce
 * dell'assistente verrebbe interrotta dal cambio di focus a metà frase.
 */
function dopoIlCambioPagina() {
  const contenuto = document.getElementById('contenuto');
  if (contenuto) contenuto.focus({ preventScroll: true });

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
      await renderRoute(route, app);
    });
    // `updateCallbackDone` scatta quando il DOM nuovo è a posto, senza
    // aspettare la fine dell'animazione: il focus non deve stare dietro a
    // mezzo secondo di dissolvenza.
    if (!eraLaPrima) transizione.updateCallbackDone.then(dopoIlCambioPagina).catch(() => {});
  } else {
    await renderRoute(route, app);
    if (!eraLaPrima) dopoIlCambioPagina();
  }
}

/**
 * Renderizza la route corrente nel container #app.
 */
async function renderRoute(route, app) {
  const renderer = renderers[route.type];
  if (renderer) {
    await renderer(app, route.params);
  } else {
    app.innerHTML = `<div class="container" style="padding: 80px 0; text-align: center;">
      <h2>Pagina non trovata</h2>
      <p><a href="${BASE}" data-link>← Torna alla Home</a></p>
    </div>`;
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
