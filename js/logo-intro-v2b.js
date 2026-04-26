/* ============================================
   IL RICETTARIO — Logo Intro V2B (Composizione Multi-Stelo)
   
   ✦ 3 steli di grano asimmetrici (piccolo, medio, grande)
   ✦ Stelo principale: arco curvo da basso-SX ad alto-DX
   ✦ Stelo medio: quasi verticale, 65% altezza
   ✦ Stelo piccolo: curva a sinistra, 40% altezza
   ✦ 3 chicchi sparsi nel vento (dettaglio firma)
   ✦ Gerarchia di profondità via opacity (0.65 / 0.82 / 1.0)
   ✦ Chicchi organici irregolari su ogni stelo
   ============================================ */

/**
 * SVG composizione multi-stelo — 3 spighe + chicchi nel vento
 * Approccio D: Asimmetrico Naturale
 * ViewBox: 52×80 (spazio per tutti gli steli + chicchi volanti)
 */
function createWheatSVG_V2B() {
  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="-14 -16 52 80" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="gi1b" x1="0.15" y1="0" x2="0.85" y2="1">
          <stop offset="0%" stop-color="#F5DDB0" />
          <stop offset="30%" stop-color="#D4A560" />
          <stop offset="65%" stop-color="#B8813A" />
          <stop offset="100%" stop-color="#8B5E2A" />
        </linearGradient>
        <linearGradient id="gi3b" x1="0.2" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stop-color="#FFF8E8" stop-opacity="0.85" />
          <stop offset="100%" stop-color="#E8C89E" stop-opacity="0" />
        </linearGradient>
        <linearGradient id="gi2b" x1="0.5" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stop-color="#B8935C" />
          <stop offset="50%" stop-color="#8B6B3C" />
          <stop offset="100%" stop-color="#5C3D18" />
        </linearGradient>
        <filter id="gisb" x="-15%" y="-15%" width="130%" height="130%">
          <feDropShadow dx="0.2" dy="0.4" stdDeviation="0.35" flood-color="#5C3310" flood-opacity="0.25"/>
        </filter>
      </defs>

      <!-- ═══════════════════════════════════════════════════
           COMPOSIZIONE ASIMMETRICA NATURALE
           Ordine di rendering (back → front):
           1. Stelo 3 (piccolo, SX, sfondo)
           2. Stelo 2 (medio, centro, piano medio)
           3. Stelo 1 (grande, DX, primo piano — protagonista)
           4. Chicchi sparsi nel vento
           ═══════════════════════════════════════════════════ -->

      <!-- ══════════════════════════════════════
           STELO 3 — Piccolo, SX, curva a sinistra
           Altezza: ~40% | Opacity: 0.65
           3 coppie chicchi, stelo sottile
           ══════════════════════════════════════ -->
      <g opacity="0.65">
        <path class="logo-intro__stelo"
          d="M3 56 C1 50, -2 45, -4 41
             C-5.5 38, -6.5 35, -7.5 32
             C-8 30, -8.5 28, -9 26"
          stroke="url(#gi2b)" stroke-width="0.9" stroke-linecap="round" fill="none" />
        <path class="logo-intro__ramo"
          d="M2.5 53 C0 52, -2.5 52, -4.5 53"
          stroke="#7A5A30" stroke-width="0.55" stroke-linecap="round" fill="none" />

        <!-- Coppia 1 (basso) -->
        <ellipse class="logo-intro__chicco" cx="-1.5" cy="44.5" rx="2.2" ry="1.3" transform="rotate(-42 -1.5 44.5)" fill="url(#gi1b)" />
        <ellipse class="logo-intro__chicco" cx="2" cy="43.5" rx="2.0" ry="1.2" transform="rotate(25 2 43.5)" fill="url(#gi1b)" />
        <!-- Coppia 2 -->
        <ellipse class="logo-intro__chicco" cx="-4" cy="39.5" rx="1.9" ry="1.15" transform="rotate(-38 -4 39.5)" fill="url(#gi1b)" />
        <ellipse class="logo-intro__chicco" cx="-0.5" cy="38.5" rx="1.7" ry="1.05" transform="rotate(22 -0.5 38.5)" fill="url(#gi1b)" />
        <!-- Coppia 3 -->
        <ellipse class="logo-intro__chicco" cx="-6" cy="34.5" rx="1.6" ry="1.0" transform="rotate(-35 -6 34.5)" fill="url(#gi1b)" />
        <ellipse class="logo-intro__chicco" cx="-3" cy="33.5" rx="1.4" ry="0.9" transform="rotate(18 -3 33.5)" fill="url(#gi1b)" />
        <!-- Apice -->
        <ellipse class="logo-intro__chicco" cx="-7.5" cy="29.5" rx="1.2" ry="0.85" transform="rotate(-28 -7.5 29.5)" fill="url(#gi1b)" />

        <!-- Ariste corte verso SX-alto -->
        <path class="logo-intro__arista" d="M-8.5 27 C-9.5 24, -10 21, -10.5 18" stroke="#A8774A" stroke-width="0.3" stroke-linecap="round" fill="none" />
        <path class="logo-intro__arista" d="M-8 28 C-6.5 25, -5.5 22, -5 19" stroke="#A8774A" stroke-width="0.3" stroke-linecap="round" fill="none" />
      </g>

      <!-- ══════════════════════════════════════
           STELO 2 — Medio, centro-SX, quasi verticale
           Altezza: ~65% | Opacity: 0.82
           5 coppie chicchi, stelo medio
           ══════════════════════════════════════ -->
      <g opacity="0.82">
        <path class="logo-intro__stelo"
          d="M4.5 56 C4 50, 3.5 44, 3 38
             C2.5 32, 2 26, 1.8 20
             C1.6 17, 1.5 14, 1.5 11"
          stroke="url(#gi2b)" stroke-width="1.2" stroke-linecap="round" fill="none" />
        <path class="logo-intro__ramo"
          d="M4 52 C2 50.5, -0.5 50.5, -3 51.5"
          stroke="#7A5A30" stroke-width="0.7" stroke-linecap="round" fill="none" />
        <path class="logo-intro__ramo"
          d="M4.5 49 C6 48, 8 48, 9.5 48.5"
          stroke="#7A5A30" stroke-width="0.6" stroke-linecap="round" fill="none" />

        <!-- Coppia 1 (basso) -->
        <g filter="url(#gisb)">
          <ellipse class="logo-intro__chicco" cx="0.5" cy="40.5" rx="2.8" ry="1.55" transform="rotate(-35 0.5 40.5)" fill="url(#gi1b)" />
          <ellipse class="logo-intro__chicco" cx="5.8" cy="39.5" rx="2.5" ry="1.5" transform="rotate(24 5.8 39.5)" fill="url(#gi1b)" />
        </g>
        <!-- Coppia 2 -->
        <g filter="url(#gisb)">
          <ellipse class="logo-intro__chicco" cx="0" cy="35" rx="2.5" ry="1.4" transform="rotate(-30 0 35)" fill="url(#gi1b)" />
          <ellipse class="logo-intro__chicco" cx="5" cy="34" rx="2.3" ry="1.35" transform="rotate(20 5 34)" fill="url(#gi1b)" />
        </g>
        <!-- Coppia 3 -->
        <g filter="url(#gisb)">
          <ellipse class="logo-intro__chicco" cx="-0.3" cy="29.5" rx="2.2" ry="1.3" transform="rotate(-26 -0.3 29.5)" fill="url(#gi1b)" />
          <ellipse class="logo-intro__chicco" cx="4.3" cy="28.5" rx="2.1" ry="1.2" transform="rotate(16 4.3 28.5)" fill="url(#gi1b)" />
        </g>
        <!-- Coppia 4 -->
        <g filter="url(#gisb)">
          <ellipse class="logo-intro__chicco" cx="-0.5" cy="24" rx="1.8" ry="1.1" transform="rotate(-20 -0.5 24)" fill="url(#gi1b)" />
          <ellipse class="logo-intro__chicco" cx="3.8" cy="23" rx="1.9" ry="1.05" transform="rotate(12 3.8 23)" fill="url(#gi1b)" />
        </g>
        <!-- Coppia 5 -->
        <g filter="url(#gisb)">
          <ellipse class="logo-intro__chicco" cx="-0.3" cy="19" rx="1.5" ry="0.95" transform="rotate(-14 -0.3 19)" fill="url(#gi1b)" />
          <ellipse class="logo-intro__chicco" cx="3.3" cy="18" rx="1.6" ry="0.9" transform="rotate(8 3.3 18)" fill="url(#gi1b)" />
        </g>
        <!-- Apice -->
        <g filter="url(#gisb)">
          <ellipse class="logo-intro__chicco logo-intro__chicco--top" cx="1.5" cy="14" rx="1.2" ry="0.9" transform="rotate(-4 1.5 14)" fill="url(#gi1b)" />
        </g>

        <!-- Ariste medie verso l'alto -->
        <path class="logo-intro__arista" d="M1.5 12 C1 9, 0 5, -1 2" stroke="#B8875A" stroke-width="0.45" stroke-linecap="round" fill="none" />
        <path class="logo-intro__arista" d="M2 13 C3 10, 4.5 7, 5.5 4" stroke="#B8875A" stroke-width="0.45" stroke-linecap="round" fill="none" />
        <path class="logo-intro__arista" d="M-0.2 18 C-1.5 15, -2.5 12, -3.5 9" stroke="#9A6D40" stroke-width="0.35" stroke-linecap="round" fill="none" opacity="0.55" />
      </g>

      <!-- ══════════════════════════════════════════════════
           STELO 1 — Principale/Protagonista, DX, arco pronunciato
           Altezza: 100% | Opacity: 1.0 (primo piano)
           7 coppie chicchi con highlight, stelo pieno
           ══════════════════════════════════════════════════ -->

      <!-- Stelo — arco da basso-SX ad alto-DX -->
      <path class="logo-intro__stelo"
        d="M6 57 C6 52, 6.5 46, 7 40
           C7.5 34, 8.5 28, 11 22
           C13.5 16, 16 10, 20 4
           C22 0, 23.5 -3, 25 -7"
        stroke="url(#gi2b)" stroke-width="1.5" stroke-linecap="round" fill="none" />
      <!-- Foglia basale SX -->
      <path class="logo-intro__ramo logo-intro__ramo--1"
        d="M6.2 49 C4.5 47.5, 1 47, -2.5 48 C-4 48.5, -5 49.5, -5.5 50"
        stroke="#7A5A30" stroke-width="0.85" stroke-linecap="round" fill="none" />
      <!-- Foglia basale DX -->
      <path class="logo-intro__ramo logo-intro__ramo--2"
        d="M6.8 46 C8.5 44.5, 11 44, 13.5 44.8"
        stroke="#7A5A30" stroke-width="0.8" stroke-linecap="round" fill="none" />

      <!-- 7 coppie chicchi con highlight (premium) -->
      <g filter="url(#gisb)">
        <ellipse class="logo-intro__chicco logo-intro__chicco--l1" cx="4.5" cy="38.5" rx="3.5" ry="1.9" transform="rotate(-40 4.5 38.5)" fill="url(#gi1b)" />
        <ellipse class="logo-intro__chicco logo-intro__chicco--l1h" cx="3.9" cy="37.7" rx="2.0" ry="0.95" transform="rotate(-40 3.9 37.7)" fill="url(#gi3b)" />
      </g>
      <g filter="url(#gisb)">
        <ellipse class="logo-intro__chicco logo-intro__chicco--r1" cx="9.8" cy="37" rx="3.3" ry="2.0" transform="rotate(30 9.8 37)" fill="url(#gi1b)" />
        <ellipse class="logo-intro__chicco logo-intro__chicco--r1h" cx="10.2" cy="36.2" rx="1.9" ry="1.0" transform="rotate(30 10.2 36.2)" fill="url(#gi3b)" />
      </g>
      <g filter="url(#gisb)">
        <ellipse class="logo-intro__chicco logo-intro__chicco--l2" cx="5.2" cy="33" rx="3.0" ry="1.8" transform="rotate(-36 5.2 33)" fill="url(#gi1b)" />
        <ellipse class="logo-intro__chicco logo-intro__chicco--l2h" cx="4.7" cy="32.3" rx="1.7" ry="0.85" transform="rotate(-36 4.7 32.3)" fill="url(#gi3b)" />
      </g>
      <g filter="url(#gisb)">
        <ellipse class="logo-intro__chicco logo-intro__chicco--r2" cx="10.8" cy="31.5" rx="3.3" ry="1.85" transform="rotate(25 10.8 31.5)" fill="url(#gi1b)" />
        <ellipse class="logo-intro__chicco logo-intro__chicco--r2h" cx="11.2" cy="30.8" rx="1.9" ry="0.9" transform="rotate(25 11.2 30.8)" fill="url(#gi3b)" />
      </g>
      <g filter="url(#gisb)">
        <ellipse class="logo-intro__chicco logo-intro__chicco--l3" cx="6.5" cy="27.8" rx="3.1" ry="1.75" transform="rotate(-32 6.5 27.8)" fill="url(#gi1b)" />
        <ellipse class="logo-intro__chicco logo-intro__chicco--l3h" cx="6.0" cy="27.1" rx="1.8" ry="0.8" transform="rotate(-32 6.0 27.1)" fill="url(#gi3b)" />
      </g>
      <g filter="url(#gisb)">
        <ellipse class="logo-intro__chicco logo-intro__chicco--r3" cx="13.0" cy="26.2" rx="3.5" ry="1.9" transform="rotate(35 13.0 26.2)" fill="url(#gi1b)" />
        <ellipse class="logo-intro__chicco logo-intro__chicco--r3h" cx="13.5" cy="25.4" rx="2.0" ry="0.9" transform="rotate(35 13.5 25.4)" fill="url(#gi3b)" />
      </g>
      <g filter="url(#gisb)">
        <ellipse class="logo-intro__chicco logo-intro__chicco--l1" cx="8.5" cy="23" rx="2.8" ry="1.6" transform="rotate(-25 8.5 23)" fill="url(#gi1b)" />
        <ellipse class="logo-intro__chicco logo-intro__chicco--l1h" cx="8.0" cy="22.4" rx="1.6" ry="0.78" transform="rotate(-25 8.0 22.4)" fill="url(#gi3b)" />
      </g>
      <g filter="url(#gisb)">
        <ellipse class="logo-intro__chicco logo-intro__chicco--r1" cx="14.5" cy="21.5" rx="2.9" ry="1.7" transform="rotate(30 14.5 21.5)" fill="url(#gi1b)" />
        <ellipse class="logo-intro__chicco logo-intro__chicco--r1h" cx="14.9" cy="20.8" rx="1.6" ry="0.82" transform="rotate(30 14.9 20.8)" fill="url(#gi3b)" />
      </g>
      <g filter="url(#gisb)">
        <ellipse class="logo-intro__chicco logo-intro__chicco--l2" cx="10.5" cy="18.2" rx="2.6" ry="1.5" transform="rotate(-18 10.5 18.2)" fill="url(#gi1b)" />
        <ellipse class="logo-intro__chicco logo-intro__chicco--l2h" cx="10.1" cy="17.6" rx="1.4" ry="0.72" transform="rotate(-18 10.1 17.6)" fill="url(#gi3b)" />
      </g>
      <g filter="url(#gisb)">
        <ellipse class="logo-intro__chicco logo-intro__chicco--r2" cx="15.8" cy="16.5" rx="2.8" ry="1.5" transform="rotate(38 15.8 16.5)" fill="url(#gi1b)" />
        <ellipse class="logo-intro__chicco logo-intro__chicco--r2h" cx="16.2" cy="15.8" rx="1.5" ry="0.7" transform="rotate(38 16.2 15.8)" fill="url(#gi3b)" />
      </g>
      <g filter="url(#gisb)">
        <ellipse class="logo-intro__chicco logo-intro__chicco--l3" cx="13.0" cy="13.5" rx="2.3" ry="1.35" transform="rotate(-10 13.0 13.5)" fill="url(#gi1b)" />
        <ellipse class="logo-intro__chicco logo-intro__chicco--l3h" cx="12.6" cy="13.0" rx="1.2" ry="0.6" transform="rotate(-10 12.6 13.0)" fill="url(#gi3b)" />
      </g>
      <g filter="url(#gisb)">
        <ellipse class="logo-intro__chicco logo-intro__chicco--r3" cx="17.5" cy="11.5" rx="2.5" ry="1.3" transform="rotate(42 17.5 11.5)" fill="url(#gi1b)" />
        <ellipse class="logo-intro__chicco logo-intro__chicco--r3h" cx="17.9" cy="10.8" rx="1.3" ry="0.62" transform="rotate(42 17.9 10.8)" fill="url(#gi3b)" />
      </g>
      <g filter="url(#gisb)">
        <ellipse class="logo-intro__chicco logo-intro__chicco--l1" cx="16.0" cy="8.5" rx="1.9" ry="1.15" transform="rotate(-2 16.0 8.5)" fill="url(#gi1b)" />
        <ellipse class="logo-intro__chicco logo-intro__chicco--l1h" cx="15.6" cy="8.0" rx="1.0" ry="0.52" transform="rotate(-2 15.6 8.0)" fill="url(#gi3b)" />
      </g>
      <g filter="url(#gisb)">
        <ellipse class="logo-intro__chicco logo-intro__chicco--r1" cx="20.0" cy="6.5" rx="2.1" ry="1.1" transform="rotate(48 20.0 6.5)" fill="url(#gi1b)" />
        <ellipse class="logo-intro__chicco logo-intro__chicco--r1h" cx="20.5" cy="5.8" rx="1.1" ry="0.5" transform="rotate(48 20.5 5.8)" fill="url(#gi3b)" />
      </g>
      <!-- Chicco apice -->
      <g filter="url(#gisb)">
        <ellipse class="logo-intro__chicco logo-intro__chicco--top" cx="21.5" cy="2.5" rx="1.7" ry="1.4" transform="rotate(25 21.5 2.5)" fill="url(#gi1b)" />
        <ellipse class="logo-intro__chicco logo-intro__chicco--toph" cx="22.0" cy="1.9" rx="0.95" ry="0.65" transform="rotate(25 22.0 1.9)" fill="url(#gi3b)" />
      </g>

      <!-- Ariste protagonista — verso alto-DX -->
      <path class="logo-intro__arista logo-intro__arista--1" d="M22 1.5 C23 -1, 24.5 -4, 25 -8" stroke="#B8875A" stroke-width="0.65" stroke-linecap="round" fill="none" />
      <path class="logo-intro__arista logo-intro__arista--2" d="M22.5 2.5 C24.5 1, 27 -1, 29 -3" stroke="#B8875A" stroke-width="0.65" stroke-linecap="round" fill="none" />
      <path class="logo-intro__arista logo-intro__arista--1" d="M18 5 C19.5 2, 21 -1, 22 -4" stroke="#A8774A" stroke-width="0.5" stroke-linecap="round" fill="none" />
      <path class="logo-intro__arista logo-intro__arista--2" d="M20.5 4.5 C22.5 3, 25 1, 27 -1" stroke="#A8774A" stroke-width="0.5" stroke-linecap="round" fill="none" />
      <path class="logo-intro__arista logo-intro__arista--3" d="M15.5 10.5 C17 7.5, 18.5 4, 19.5 1" stroke="#9A6D40" stroke-width="0.4" stroke-linecap="round" fill="none" opacity="0.65" />
      <path class="logo-intro__arista logo-intro__arista--4" d="M18 9 C20 7, 22.5 4.5, 24 2" stroke="#9A6D40" stroke-width="0.4" stroke-linecap="round" fill="none" opacity="0.6" />

      <!-- ══════════════════════════════════════
           CHICCHI SPARSI — volano nel vento
           3 chicchi staccati, decrescente opacità
           Effetto "brezza" dalla punta dello stelo
           ══════════════════════════════════════ -->
      <g filter="url(#gisb)">
        <ellipse class="logo-intro__chicco logo-intro__chicco--sparso"
          cx="28" cy="0" rx="1.3" ry="0.85" transform="rotate(35 28 0)" fill="url(#gi1b)" opacity="0.6" />
      </g>
      <g filter="url(#gisb)">
        <ellipse class="logo-intro__chicco logo-intro__chicco--sparso"
          cx="32" cy="7" rx="1.0" ry="0.6" transform="rotate(52 32 7)" fill="url(#gi1b)" opacity="0.42" />
      </g>
      <g filter="url(#gisb)">
        <ellipse class="logo-intro__chicco logo-intro__chicco--sparso"
          cx="26" cy="-7" rx="0.8" ry="0.5" transform="rotate(15 26 -7)" fill="url(#gi1b)" opacity="0.3" />
      </g>

    </svg>`;
}





/**
 * Genera l'HTML completo dell'overlay intro V2B
 */
function createIntroHTML_V2B() {
  return `
    <div class="logo-intro" id="logo-intro" aria-hidden="true" role="presentation">
      <!-- Phase 0: Ambient glow -->
      <div class="logo-intro__glow"></div>

      <!-- Concentric ring halos -->
      <div class="logo-intro__ring"></div>
      <div class="logo-intro__ring logo-intro__ring--outer"></div>

      <!-- Phase 8: Particle burst (12 particles) -->
      <div class="logo-intro__particles">
        ${Array.from({ length: 12 }, () => '<div class="logo-intro__particle"></div>').join('')}
      </div>

      <!-- Phase 1-6: Logo SVG (Spiga Botanica V2B) -->
      <div class="logo-intro__logo logo-intro__logo--tall" id="logo-intro-logo">
        ${createWheatSVG_V2B()}
      </div>

      <!-- Phase 7: Title text -->
      <div class="logo-intro__text">Il Ricettario</div>

      <!-- Phase 7b: Subtitle -->
      <div class="logo-intro__subtitle">Laboratorio Artigianale</div>
    </div>
  `;
}


/**
 * Inizializza l'intro V2B.
 */
export function initLogoIntro() {
  // Skip se già mostrata in questa sessione
  if (sessionStorage.getItem('intro-shown')) return;

  // Skip per accessibilità
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    sessionStorage.setItem('intro-shown', '1');
    return;
  }

  // Lazy-load CSS intro (449 righe / 17KB) — solo quando serve
  import('../css/components/logo-intro.css');

  const inject = () => {
    document.body.insertAdjacentHTML('afterbegin', createIntroHTML_V2B());
    setupIntroLifecycle();
    sessionStorage.setItem('intro-shown', '1');
  };

  if (document.body) {
    inject();
  } else {
    document.addEventListener('DOMContentLoaded', inject, { once: true });
  }
}


/**
 * Gestisce il lifecycle post-iniezione
 */
function setupIntroLifecycle() {
  const overlay = document.getElementById('logo-intro');
  const logo = document.getElementById('logo-intro-logo');

  if (!overlay) return;

  document.documentElement.style.overflow = 'hidden';

  const glowTimer = setTimeout(() => {
    if (logo) logo.classList.add('glowing');
  }, 1700);

  overlay.addEventListener('animationend', (e) => {
    if (e.animationName === 'introOverlayOut') {
      document.documentElement.style.overflow = '';
      overlay.classList.add('logo-intro--done');
      requestAnimationFrame(() => overlay.remove());
      clearTimeout(glowTimer);
    }
  });

  setTimeout(() => {
    if (document.getElementById('logo-intro')) {
      document.documentElement.style.overflow = '';
      overlay.remove();
    }
  }, 5000);
}
