/**
 * CATEGORIES.JS — Single Source of Truth (Frontend SPA)
 * 
 * Tutte le categorie sono definite QUI e solo qui.
 * Ogni altro modulo importa da questo file.
 */

/**
 * Registry completo delle categorie.
 * Ogni entry contiene: nome display, cartella su disco, emoji Fluent,
 * emoji unicode (indice recipes.json), titolo pagina e descrizione SEO.
 *
 * `dir` è la cartella reale sotto ricette/ e non sempre coincide con la
 * chiave: `secondi_piatti` vive in `ricette/secondi-piatti/`. Usa sempre
 * `dir` per costruire path e URL, mai la chiave.
 */
export const CATEGORIES = {
  pane:       { name: 'Pane',       dir: 'pane',       emoji: 'baguette-bread', unicode: '🥖', title: 'Pane Artigianale',           desc: 'Ricette di pane ad alta idratazione — ciabatta, filone, baguette e pane speciale.' },
  pizza:      { name: 'Pizza',      dir: 'pizza',      emoji: 'pizza',          unicode: '🍕', title: 'Pizza Artigianale',          desc: 'Pizze con lievitazione lunga — napoletana, in teglia, canotto e pinsa romana.' },
  pasta:      { name: 'Pasta',      dir: 'pasta',      emoji: 'spaghetti',      unicode: '🍝', title: 'Pasta Fresca',               desc: 'Pasta fresca fatta in casa — trafilata, ripiena e formati speciali.' },
  primi:      { name: 'Primi',      dir: 'primi',      emoji: 'tomato',         unicode: '🥣', title: 'Primi Piatti',               desc: 'Primi piatti della tradizione — polenta, zuppe e piatti unici caldi.' },
  lievitati:  { name: 'Lievitati',  dir: 'lievitati',  emoji: 'croissant',      unicode: '🥐', title: 'Lievitati Dolci e Salati',   desc: 'Brioche, cornetti, panettone, burger buns e rosticceria.' },
  focaccia:   { name: 'Focaccia',   dir: 'focaccia',   emoji: 'flatbread',      unicode: '🫓', title: 'Focaccia Artigianale',       desc: 'Focacce ad alta idratazione — genovese, barese, pugliese e varianti creative.' },
  dolci:      { name: 'Dolci',      dir: 'dolci',      emoji: 'shortcake',      unicode: '🍪', title: 'Dolci e Pasticceria',        desc: 'Dolci tradizionali, frolle, biscotti e pasticceria artigianale.' },
  conserve:   { name: 'Conserve',   dir: 'conserve',   emoji: 'canned-food',    unicode: '🫙', title: 'Conserve e Preparazioni',    desc: 'Conserve fatte in casa — dadi vegetali, salse, sottoli e preparazioni base.' },
  condimenti: { name: 'Condimenti', dir: 'condimenti', emoji: 'herb',           unicode: '🌿', title: 'Condimenti',                 desc: 'Salse, pesti e condimenti artigianali per ogni piatto.' },
  secondi_piatti: { name: 'Secondi Piatti', dir: 'secondi-piatti', emoji: 'fork-and-knife', unicode: '🍲', title: 'Secondi Piatti', desc: 'Esplora ricette complete e saporite per i tuoi secondi piatti: carne, pesce, legumi e verdure.' },
};

/**
 * Ordine delle categorie per la homepage carousel.
 * Chiavi dello stesso oggetto CATEGORIES.
 */
export const CATEGORY_ORDER = [
  'pasta', 'primi', 'pane', 'pizza', 'lievitati', 'dolci', 'focaccia', 'conserve', 'condimenti', 'secondi_piatti',
];

/**
 * Mappa cartella → categoria. È questa la chiave giusta per risolvere una
 * route: l'URL contiene la cartella (`secondi-piatti`), non la chiave.
 */
export const CATEGORIES_BY_DIR = Object.fromEntries(
  Object.values(CATEGORIES).map(c => [c.dir, c])
);

/**
 * Mappa Name → emoji (derivata da CATEGORIES, per retrocompatibilità).
 * Es: { Pane: 'baguette-bread', Pizza: 'pizza', ... }
 */
export const CATEGORY_EMOJI_MAP = Object.fromEntries(
  Object.values(CATEGORIES).map(c => [c.name, c.emoji])
);

/**
 * Lista nomi validi (per validazione).
 */
export const VALID_CATEGORY_NAMES = Object.values(CATEGORIES).map(c => c.name);
