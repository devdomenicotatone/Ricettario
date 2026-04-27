/**
 * CATEGORIES.JS — Single Source of Truth (Frontend SPA)
 * 
 * Tutte le categorie sono definite QUI e solo qui.
 * Ogni altro modulo importa da questo file.
 */

/**
 * Registry completo delle categorie.
 * Ogni entry contiene: nome display, emoji Fluent, directory slug,
 * titolo pagina, e descrizione SEO.
 */
export const CATEGORIES = {
  pane:       { name: 'Pane',       emoji: 'baguette-bread', title: 'Pane Artigianale',           desc: 'Ricette di pane ad alta idratazione — ciabatta, filone, baguette e pane speciale.' },
  pizza:      { name: 'Pizza',      emoji: 'pizza',          title: 'Pizza Artigianale',          desc: 'Pizze con lievitazione lunga — napoletana, in teglia, canotto e pinsa romana.' },
  pasta:      { name: 'Pasta',      emoji: 'spaghetti',      title: 'Pasta Fresca',               desc: 'Pasta fresca fatta in casa — trafilata, ripiena e formati speciali.' },
  lievitati:  { name: 'Lievitati',  emoji: 'croissant',      title: 'Lievitati Dolci e Salati',   desc: 'Brioche, cornetti, panettone, burger buns e rosticceria.' },
  focaccia:   { name: 'Focaccia',   emoji: 'flatbread',      title: 'Focaccia Artigianale',       desc: 'Focacce ad alta idratazione — genovese, barese, pugliese e varianti creative.' },
  dolci:      { name: 'Dolci',      emoji: 'shortcake',      title: 'Dolci e Pasticceria',        desc: 'Dolci tradizionali, frolle, biscotti e pasticceria artigianale.' },
  conserve:   { name: 'Conserve',   emoji: 'canned-food',    title: 'Conserve e Preparazioni',    desc: 'Conserve fatte in casa — dadi vegetali, salse, sottoli e preparazioni base.' },
  condimenti: { name: 'Condimenti', emoji: 'herb',           title: 'Condimenti',                 desc: 'Salse, pesti e condimenti artigianali per ogni piatto.' },
  secondi_piatti: { name: 'Secondi Piatti', emoji: 'fork-and-knife', title: 'Secondi Piatti', desc: 'Esplora ricette complete e saporite per i tuoi secondi piatti: carne, pesce, legumi e verdure.' },
};

/**
 * Ordine delle categorie per la homepage carousel.
 * Chiavi dello stesso oggetto CATEGORIES.
 */
export const CATEGORY_ORDER = [
  'pasta', 'pane', 'pizza', 'lievitati', 'dolci', 'focaccia', 'conserve', 'condimenti', 'secondi_piatti',
];

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
