/**
 * Aggregatore dei contenuti delle pagine strumento.
 *
 * Importato SOLO dal chunk della sezione (js/strumenti/pagina.js) e dal
 * pre-rendering (scripts/generate-og.js): i testi delle guide non pesano su
 * chi apre una ricetta. L'anagrafe (slug, titoli, lame) sta in js/strumenti.js.
 */

import { CONTENUTO as CUTTER } from './cutter-sirman-c-tronic-6.js';
import { CONTENUTO as FAMAG } from './famag-grilletta.js';

export const CONTENUTI_STRUMENTI = {
  [CUTTER.slug]: CUTTER,
  [FAMAG.slug]: FAMAG,
};
