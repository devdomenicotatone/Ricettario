# CLAUDE.md — Ricettario Lab

Istruzioni di progetto per Claude Code (caricate a ogni sessione).
Per stack, comandi e schema delle ricette vedi [README.md](./README.md);
qui c'è solo quello che non si deduce leggendo il codice.

## Fonti uniche: non duplicarle

Tre cose in questo progetto sono già state duplicate una volta, e le copie
sono divergute in silenzio. Se ti serve quel contenuto altrove, **leggilo
dalla fonte**, non riscriverlo.

- **`public/recipes.json` è generato** da `scripts/build-recipes.js`. Non
  modificarlo a mano: la modifica sparisce al primo `npm run check`. Se manca
  un campo nell'indice, aggiungilo al generatore.
- **`index.html` è l'unica fonte del markup della homepage.** La SPA lo
  fotografa dal DOM e lo ripristina quando serve. Esisteva una seconda copia
  in `js/main.js` (`getHomepageHTML`): titolo, sottotitolo e schede strumenti
  erano diversi a seconda di come si arrivava in home. Non reintrodurla.
- **`js/categories.js` è il registry delle categorie.** Il campo `dir` è la
  cartella su disco e non sempre coincide con la chiave (`secondi_piatti` →
  `ricette/secondi-piatti/`). Per path e URL usa `dir` o `CATEGORIES_BY_DIR`,
  mai la chiave.

## Le pagine ricetta devono restare indicizzabili

`scripts/generate-og.js` pre-renderizza pagine complete a partire da
`dist/index.html`. Due vincoli da non rompere:

- **Niente redirect JavaScript.** Prima c'era un `location.replace()`
  immediato: i crawler lo seguivano e consolidavano tutto sulla homepage,
  quindi nessuna ricetta era indicizzata. `npm run verifica` fallisce se
  rientra.
- **I dati strutturati devono corrispondere a contenuto visibile.** Marcare
  con JSON-LD ingredienti o passaggi che la pagina non mostra è una violazione
  delle linee guida Google, non un'ottimizzazione. Se aggiungi campi allo
  schema, aggiungi anche il markup visibile corrispondente.

## Codifica dei file

I JSON delle ricette sono UTF-8. Sette file sono già stati salvati una volta
come Latin-1 e ri-codificati, producendo `metÃ ` al posto di `metà` — testo
corrotto visibile sul sito per mesi. `npm run verifica` ora lo intercetta.
Se modifichi un JSON di ricetta, salvalo in UTF-8 senza BOM.

## Verifica prima di dire "fatto"

Il progetto non ha test unitari di proposito: il rischio sta quasi tutto
nell'output statico, e lo copre `npm run check` (dati + build + pre-rendering
+ controlli su `dist/`). Fallo girare davvero prima di dichiarare che una
modifica funziona — non basta che il file sia stato scritto.

Per verificare il comportamento nel browser usa `npm run preview`, che serve
`dist/` come sarà pubblicato. `npm run dev` non esegue il pre-rendering,
quindi non mostra quello che vedono i crawler.

## Deploy

Deploy = `npm run deploy`. **Il push su `main` non pubblica niente**: GitHub
Pages serve dal branch `gh-pages`, aggiornato solo da quel comando.

Il deploy è preceduto da `npm run check` con `&&`: se i dati sono incoerenti
la pubblicazione si ferma prima di partire. È voluto, non aggirarlo.

`public/pdf/` (~173 MB di materiale sorgente) è nel `.gitignore` ma Vite copia
tutto `public/` in `dist/`: un plugin in `vite.config.js` lo esclude
esplicitamente. Se tocchi quel plugin, controlla il peso di `dist/`.

## Identità git

Questo repo ha 132 commit storici fatti con `devdomenicotatone@gmail.com`
(senza punto), che **non è collegata all'account GitHub**: quei commit non
risultano attribuiti. L'indirizzo giusto è `dev.domenicotatone@gmail.com` ed è
già configurato in locale. Non cambiarlo, e non "uniformarlo" alla storia
vecchia.

## Lingua

Codice, commenti, commit e interfaccia sono in italiano. Mantieni la
convenzione, inclusi i messaggi di commit in stile `tipo(ambito): descrizione`.
