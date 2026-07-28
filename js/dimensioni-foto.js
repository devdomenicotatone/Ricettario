/* ============================================
   IL RICETTARIO — Dimensioni reali delle foto
   Mappa statica generata: non scriverla a mano
   ============================================ */

/**
 * Larghezza e altezza in pixel dell'ORIGINALE di ogni foto ricetta, misurate
 * con sharp sui file di `public/images/ricette/`. Le legge `image-utils.js`
 * per emettere `srcset` con i descrittori di larghezza e `width`/`height`
 * sull'`<img>` (senza, il browser non conosce le proporzioni prima del
 * caricamento e la pagina salta — CLS).
 *
 * PERCHÉ UNA MAPPA STATICA E NON UNA LETTURA DEI FILE
 * `image-utils.js` è un modulo puro condiviso col pre-rendering: niente DOM,
 * niente `fs`, i dati entrano da fermo. Le foto NON hanno tutte la stessa
 * misura (26 formati diversi, da 1200×896 a 1880×1254), quindi una costante
 * non basta e leggere i file a runtime è vietato: restano i numeri scritti
 * qui.
 *
 * INVARIANTE: una chiave sta in questa mappa SE E SOLO SE accanto
 * all'originale esistono le varianti ridotte `<nome>-640.avif` e
 * `<nome>-640.webp` (stesse proporzioni, larghe 640 px). `buildPicture` emette
 * gli URL `-640` solo per le chiavi presenti: una voce senza varianti sul
 * disco produce 404, una foto senza voce torna al comportamento vecchio
 * (un solo file per formato, nessun `width`/`height`).
 *
 * Chiave: path della foto da `images/` in poi, senza estensione.
 * Valore: `[larghezza, altezza]` dell'originale.
 *
 * QUANDO AGGIUNGI O SOSTITUISCI UNA FOTO, rigenera varianti e voce con sharp
 * (in una cartella temporanea fuori dal repo, `npm i sharp`):
 *
 *   const sharp = require('sharp');
 *   const meta = await sharp('public/images/ricette/<dir>/<nome>.webp').metadata();
 *   // → aggiungi ['images/ricette/<dir>/<nome>']: [meta.width, meta.height]
 *   await sharp(orig).resize({ width: 640 }).avif({ quality: 55, effort: 6 }).toFile('<nome>-640.avif');
 *   await sharp(orig).resize({ width: 640 }).webp({ quality: 75 }).toFile('<nome>-640.webp');
 */
export const DIMENSIONI_FOTO = {
  'images/ricette/condimenti/babaganoush-crema-melanzane': [1200, 896],
  'images/ricette/condimenti/besciamella': [1200, 896],
  'images/ricette/condimenti/burro-composto-acciughe-tartufo': [1200, 896],
  'images/ricette/condimenti/burro-maitre-d-hotel': [1200, 896],
  'images/ricette/condimenti/caesar-dressing': [1200, 896],
  'images/ricette/condimenti/chimichurri': [1200, 896],
  'images/ricette/condimenti/coulis-salsa-pomodoro-fresco': [1800, 1200],
  'images/ricette/condimenti/crema-al-parmigiano': [1200, 896],
  'images/ricette/condimenti/crema-di-peperoni': [1600, 1066],
  'images/ricette/condimenti/dressing-miele-senape': [1200, 896],
  'images/ricette/condimenti/fumetto-di-crostacei': [1800, 1200],
  'images/ricette/condimenti/guacamole': [1800, 1200],
  'images/ricette/condimenti/maionese': [1800, 1200],
  'images/ricette/condimenti/marinatura-menta-aceto-verdure-grigliate': [1280, 896],
  'images/ricette/condimenti/olio-aglio-nero-ossidiana': [1200, 896],
  'images/ricette/condimenti/olio-al-basilico-verde-smeraldo': [1280, 896],
  'images/ricette/condimenti/olio-carota-zenzero-arancio-fluo': [1200, 896],
  'images/ricette/condimenti/olio-cavolo-viola-elettrico': [1200, 896],
  'images/ricette/condimenti/olio-curcuma-zafferano-giallo-oro': [1200, 896],
  'images/ricette/condimenti/olio-extravergine-aromatizzato-verde-dorato': [1200, 896],
  'images/ricette/condimenti/olio-peperone-crusco-rosso-rubino': [1200, 896],
  'images/ricette/condimenti/pesto-alla-genovese-tradizionale': [1800, 1200],
  'images/ricette/condimenti/pesto-alla-siciliana': [1800, 1200],
  'images/ricette/condimenti/pesto-di-barbabietola': [1733, 1300],
  'images/ricette/condimenti/pesto-di-fave-maro': [1314, 1300],
  'images/ricette/condimenti/pesto-di-pistacchi-artigianale': [1800, 1200],
  'images/ricette/condimenti/pesto-di-zucchine': [1800, 1200],
  'images/ricette/condimenti/pesto-pomodori-secchi-mandorle-basilico': [1800, 1119],
  'images/ricette/condimenti/pesto-rucola-artigianale': [1335, 1300],
  'images/ricette/condimenti/pure-di-patate': [1200, 896],
  'images/ricette/condimenti/salmoriglio-siciliano-tradizionale': [1800, 1200],
  'images/ricette/condimenti/salsa-alle-noci': [1800, 1200],
  'images/ricette/condimenti/salsa-allo-yogurt': [1800, 1200],
  'images/ricette/condimenti/salsa-allo-yogurt-ed-erba-cipollina': [1800, 1192],
  'images/ricette/condimenti/salsa-bbq-artigianale': [1800, 965],
  'images/ricette/condimenti/salsa-bernese': [1200, 896],
  'images/ricette/condimenti/salsa-cocktail-rosa-artigianale': [1200, 896],
  'images/ricette/condimenti/salsa-teriyaki-originale': [1200, 896],
  'images/ricette/condimenti/salsa-verde-tradizionale': [1800, 1201],
  'images/ricette/condimenti/vinaigrette-classica-e-citronette': [1733, 1300],
  'images/ricette/conserve/burro-chiarificato': [1200, 896],
  'images/ricette/conserve/dado-vegetale-fatto-in-casa': [1200, 896],
  'images/ricette/conserve/dado-vegetale-granulare': [1200, 896],
  'images/ricette/conserve/pomodorini-confit-sottolio': [1800, 1195],
  'images/ricette/dolci/cantuccini-di-prato': [1800, 1239],
  'images/ricette/dolci/cartocci-alla-crema-siciliani': [1800, 1200],
  'images/ricette/dolci/migliaccio-napoletano': [1800, 1200],
  'images/ricette/focaccia/calzone-cipolla-barese-pugliese': [1200, 896],
  'images/ricette/focaccia/focaccia-barese': [1800, 1350],
  'images/ricette/focaccia/focaccia-di-recco-igp': [1800, 1350],
  'images/ricette/focaccia/focaccia-genovese-classica': [1880, 1253],
  'images/ricette/focaccia/focaccia-genovese-fugassa': [1200, 896],
  'images/ricette/lievitati/burger-buns-con-biga': [1800, 1200],
  'images/ricette/lievitati/cornetti-sfogliati-classici': [1800, 1200],
  'images/ricette/lievitati/impasto-rosticceria-siciliana': [1200, 896],
  'images/ricette/lievitati/panettone-fatto-in-casa-caputo': [1800, 1202],
  'images/ricette/lievitati/panettone-pere-cioccolato': [1880, 1251],
  'images/ricette/lievitati/pasta-brioche-artigianale': [1800, 1200],
  'images/ricette/lievitati/pasta-brioche-classica': [1800, 1064],
  'images/ricette/lievitati/pasta-madre-solida-creazione-rinfresco': [1800, 1202],
  'images/ricette/pane/baguette-francese-tradizionale': [1733, 1300],
  'images/ricette/pane/ciabatta-con-poolish': [1800, 1200],
  'images/ricette/pane/pane-ai-cereali-semi': [1200, 896],
  'images/ricette/pane/pane-alle-noci-con-poolish': [1200, 896],
  'images/ricette/pane/pane-di-altamura-dop': [1200, 896],
  'images/ricette/pane/pane-integrale-con-biga': [1800, 1182],
  'images/ricette/pane/pane-pugliese-con-biga': [1500, 1000],
  'images/ricette/pane/treccia-di-pane-olio': [1800, 1200],
  'images/ricette/pizza/pinsa-romana': [1500, 1125],
  'images/ricette/pizza/pizza-contemporanea-canotto': [1880, 1253],
  'images/ricette/pizza/pizza-in-teglia-romana': [1700, 1300],
  'images/ricette/pizza/pizza-in-teglia-romana-alta-idratazione': [1800, 1013],
  'images/ricette/pizza/pizza-margherita-verace-disciplinare-avpn': [1800, 1200],
  'images/ricette/pizza/pizza-marinara-napoletana-verace': [1800, 1202],
  'images/ricette/pizza/pizza-napoletana-biga-criscito': [1880, 1253],
  'images/ricette/pizza/pizza-napoletana-verace-stg': [1800, 1013],
  'images/ricette/pizza/pizza-romana-stesa-al-matterello': [1800, 1202],
  'images/ricette/primi/gnocchi-di-patate': [1800, 1196],
  'images/ricette/primi/polenta-concia-valdostana': [1200, 896],
  'images/ricette/secondi-piatti/brisket-stile-toscano': [1800, 1201],
  'images/ricette/secondi-piatti/mayak-gyeran-uova-marinate-coreane': [1200, 896],
  'images/ricette/secondi-piatti/pulled-pork-bbq': [1280, 853],
  'images/ricette/secondi-piatti/spare-ribs-salsa-bbq': [1280, 853],
};
