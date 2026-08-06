/**
 * STRUMENTI.JS — Single Source of Truth degli strumenti di casa.
 *
 * Come js/categories.js per le categorie: ogni modulo che deve sapere quali
 * strumenti esistono (router della sezione /strumenti/, generatore dell'indice,
 * pre-rendering, box strumento nella pagina ricetta) importa da qui.
 *
 * PURO: niente DOM, `window`, `localStorage` o `import.meta` — lo importa
 * anche Node dentro scripts/build-recipes.js e scripts/generate-og.js.
 *
 * I CONTENUTI delle pagine (guida alle lame, scheda tecnica, fonti) NON stanno
 * qui: vivono in dati/strumenti/<slug>.js e viaggiano solo nel chunk della
 * sezione e nel pre-rendering. Qui c'è l'anagrafe: slug, nomi, titoli SEO e
 * l'elenco delle lame ammesse dal campo `tools` delle ricette.
 */

export const STRUMENTI = [
  {
    slug: 'cutter-sirman-c-tronic-6',
    nome: 'Sirman C-Tronic 6 VT',
    tipo: 'Cutter professionale',
    // Titolo breve di pagina: buildPage (generate-og.js) e la SPA vi appendono
    // « — Ricettario Lab». Deve restare identico nei due mondi.
    title: 'Cutter Sirman C-Tronic 6 VT: guida alle lame',
    desc: 'Guida alle cinque lame del cutter Sirman C-Tronic 6 VT: usi, tecnica, errori da evitare, scheda tecnica e le ricette del sito in cui il cutter lavora meglio.',
    cardDesc: 'Cutter da 5,3 litri con variatore di velocità: la guida completa ai cinque mozzi — lisce, dentate, forate, impasti e pesto.',
    image: 'images/strumenti/cutter-sirman-c-tronic-6-detail.webp',
    // Tavola dei mozzi opzionali (dal catalogo Sirman): la pagina strumento
    // la mostra in testa alla guida delle lame. Solo il cutter ce l'ha.
    imageMozzi: 'images/strumenti/cutter-sirman-c-tronic-6-mozzi.webp',
    lame: [
      { key: 'lisce',   nome: 'Lame lisce' },
      { key: 'dentate', nome: 'Lame dentate' },
      { key: 'forate',  nome: 'Lame forate' },
      { key: 'impasti', nome: 'Mozzo per impasti' },
      { key: 'pesto',   nome: 'Mozzo per pesto' },
    ],
  },
  {
    slug: 'famag-grilletta',
    nome: 'Famag Grilletta IM 5/230 HH',
    tipo: 'Impastatrice a spirale',
    title: 'Impastatrice Famag Grilletta IM 5/230 HH',
    desc: 'La scheda dell\'impastatrice a spirale Famag Grilletta IM 5/230 HH: motore brushless, dieci velocità, vasca da 7 litri e impasti fino al 95% di idratazione.',
    cardDesc: 'Impastatrice a spirale con motore brushless e inverter: il cuore di tutti i lievitati del sito, tarata per l\'alta idratazione.',
    image: 'images/strumenti/famag-grilletta-detail.webp',
    lame: [],
  },
];

/** Mappa slug → voce. L'URL contiene lo slug: è questa la chiave di risoluzione. */
export const STRUMENTI_BY_SLUG = Object.fromEntries(
  STRUMENTI.map(s => [s.slug, s])
);

/**
 * Nome visuale di una lama di uno strumento (es. 'forate' → 'Lame forate').
 * Ritorna null se lo strumento o la lama non esistono: chi chiama decide
 * se è un errore (build-recipes) o un dato da omettere (markup).
 */
export function nomeLama(strumentoSlug, lamaKey) {
  const s = STRUMENTI_BY_SLUG[strumentoSlug];
  if (!s) return null;
  const lama = s.lame.find(l => l.key === lamaKey);
  return lama ? lama.nome : null;
}
