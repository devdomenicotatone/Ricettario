---
paths:
  - "js/**/*.js"
  - "scripts/**/*.js"
  - "index.html"
---

# Moduli condivisi, pre-rendering e rotte

## I moduli condivisi col pre-rendering devono restare PURI

`js/cottura/motore.js`, `js/cottura/html-piano.js`, e da luglio 2026 anche
`js/html-ricetta.js`, `js/html-categoria.js`, `js/token-dosi.js` ed `js/emoji-core.js`
**non possono toccare il DOM, `window`, `localStorage` o `import.meta`**, e i dati devono
arrivargli come argomento invece che con un `import`. Non è stile: li importa anche Node,
dentro `scripts/generate-og.js`, `scripts/build-recipes.js` e `scripts/build-cottura.js`.

In particolare **non importare `js/router.js` o `js/emoji.js` da questi moduli**: leggono
`import.meta.env`, che esiste solo dentro Vite. La `base` si passa come argomento
(`{ base }`), come già fa `html-piano.js`.

Le vecchie copie a mano del markup dentro `generate-og.js` (`prerenderRecipe`,
`prerenderCategory`) sono state rimosse perché **erano già divergute in produzione**: la
pagina statica non aveva Pro Tips, Conservazione né Glossario, e le pagine categoria avevano
H1 diversi dalla SPA. Non reintrodurle: il pre-rendering chiama gli stessi builder con
`interattivo: false`, che omette solo i controlli morti senza JavaScript (calcolatore dosi,
toolbar, canvas, toggle del pannello sensoriale — i cui DATI però restano come contenuto
piatto, perché il JSON-LD `NutritionInformation` deve corrispondere a testo visibile) e toglie
le classi `reveal`, che senza JS restano a `opacity: 0`.

Le frecce dei caroselli non stanno nel markup: le crea `attivaCarosello` in `main.js`, che
**idrata** le righe pre-renderizzate invece di ricostruirle — rifarle dal fetch significava
cancellare 80 link funzionanti al primo errore di rete.

Se qualcuno ci infila un riferimento al browser, il pre-rendering si rompe e la strada facile
diventa riscrivere il markup a mano nello script di build — cioè una seconda copia che
divergerà al primo cambiamento. È da questa purezza che deriva la garanzia che l'`HowTo`
corrisponda a contenuto visibile: pagina statica e pagina interattiva escono dalla stessa
funzione.

Il montaggio nel browser (timer, storico, Wake Lock) sta in `vista-piano.js`, `vista-timer.js`
e `vista-storico.js`: è là che va il codice che ha bisogno di un browser.

## Fonti uniche: non duplicarle

- **`public/recipes.json` è generato** da `scripts/build-recipes.js`. Non modificarlo a mano:
  la modifica sparisce al primo `npm run check`. Se manca un campo, aggiungilo al generatore.
- **`index.html` è l'unica fonte del markup della homepage.** La SPA lo fotografa dal DOM e lo
  ripristina quando serve. Esisteva una seconda copia in `js/main.js` (`getHomepageHTML`):
  titolo, sottotitolo e schede strumenti erano diversi a seconda di come si arrivava in home.
  Non reintrodurla.
- **`js/categories.js` è il registry delle categorie.** Il campo `dir` è la cartella su disco e
  non sempre coincide con la chiave (`secondi_piatti` → `ricette/secondi-piatti/`). Per path e
  URL usa `dir` o `CATEGORIES_BY_DIR`, mai la chiave.

## Le pagine devono restare indicizzabili

`scripts/generate-og.js` pre-renderizza pagine complete da `dist/index.html`: ricette,
categorie e piani del calcolatore. Due vincoli:

- **Niente redirect JavaScript.** Prima c'era un `location.replace()` immediato: i crawler lo
  seguivano e consolidavano tutto sulla homepage, quindi nessuna ricetta era indicizzata.
  `npm run verifica` fallisce se rientra.
- **I dati strutturati devono corrispondere a contenuto visibile.** Marcare con JSON-LD
  ingredienti o passaggi che la pagina non mostra viola le linee guida Google, non è
  un'ottimizzazione.

## Un indirizzo che non esiste deve dirlo

Il server risponde già **404** per ogni URL senza file (`public/404.html`, misurato il
28/07/2026). Il problema non era Google — quegli indirizzi non li indicizza — ma la persona:
`404.html` rimanda alla SPA, e la SPA ripiegava su `{ type: 'home' }`, cioè homepage servita
sotto l'indirizzo sbagliato. Un soft 404 per chi legge, non per il crawler.

**La FORMA dell'URL la giudica il router, l'ESISTENZA dei dati la giudica chi ha i dati.**

- `matchRoute` restituisce `nonTrovata` quando il path non assomiglia a nessuna rotta: è
  l'unica cosa che può decidere da sé.
- Se una categoria esista lo sa `CATEGORIES_BY_DIR` (in `renderCategory`), se una ricetta
  esista lo dice il 404 del fetch del suo JSON, se uno slug del calcolatore si rilegga lo sa
  `configDaSlug`. Portare quei controlli dentro `matchRoute` significherebbe una seconda copia
  del registry e un `recipes.json` scaricato prima di ogni navigazione.
- Il messaggio è **uno solo**, in `js/non-trovata.js`. Le tre copie che c'erano avevano già tre
  uscite diverse. Scrive anche `document.title`, perché il router lo legge dopo il render per
  la regione live: senza, chi ascolta si sente annunciare la pagina precedente.

**Non** correggere l'URL verso la home con `replaceState`: toglie l'unica prova di cosa era
stato chiesto — un refuso non si vede più, un link rotto non si può segnalare — e a Google non
dà niente, il 404 ce l'ha già.

Un caso è scoperto **di proposito**: `/cottura/<slug>` valido ma fuori da `PAGINE_SEO` (es.
`fiorentina-4-5cm-kamado`) è l'unico indirizzo dove la SPA disegna una pagina vera sotto un
404. Il piano è calcolabile davvero e la stessa configurazione vive a 200 in query string:
trasformarlo in errore toglierebbe una pagina utile per amore di coerenza.
