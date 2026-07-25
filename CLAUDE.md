# CLAUDE.md — Ricettario Lab

Istruzioni di progetto per Claude Code (caricate a ogni sessione).
Per stack, comandi e schema delle ricette vedi [README.md](./README.md);
qui c'è solo quello che non si deduce leggendo il codice.

## Fonti uniche: non duplicarle

Alcune cose in questo progetto sono già state duplicate una volta, e le copie
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
- **`dati/cottura/coefficienti.js` è l'unica fonte dei numeri del
  calcolatore.** I tagli puntano una curva per nome (`curva_tempo`), non se ne
  portano una copia: se ogni taglio di manzo avesse la sua tabella,
  ricalibrare dopo una cottura reale vorrebbe dire modificarne sei. Se scrivi
  un numero dentro `js/cottura/`, è un bug.
- **`dati/cottura/dispositivi.json` è il registry degli apparecchi.** Il
  comportamento della famiglia kamado sta in `js/cottura/kamado.js`; i numeri
  dei singoli modelli stanno nel JSON. Aggiungere un kamado è una voce di
  dati, aggiungere un tipo di barbecue è un modulo accanto a `kamado.js`.

## Le pagine devono restare indicizzabili

`scripts/generate-og.js` pre-renderizza pagine complete a partire da
`dist/index.html`: ricette, categorie, e i piani del calcolatore di cottura.
Due vincoli da non rompere:

- **Niente redirect JavaScript.** Prima c'era un `location.replace()`
  immediato: i crawler lo seguivano e consolidavano tutto sulla homepage,
  quindi nessuna ricetta era indicizzata. `npm run verifica` fallisce se
  rientra.
- **I dati strutturati devono corrispondere a contenuto visibile.** Marcare
  con JSON-LD ingredienti o passaggi che la pagina non mostra è una violazione
  delle linee guida Google, non un'ottimizzazione. Se aggiungi campi allo
  schema, aggiungi anche il markup visibile corrispondente.

## Due file del calcolatore devono restare puri

`js/cottura/motore.js` (il calcolo) e `js/cottura/html-piano.js` (il markup del
piano) **non possono toccare il DOM, `window`, `localStorage` o
`import.meta`**, e i dati devono arrivargli come argomento invece che con un
`import`. Non è una preferenza di stile: li importa anche Node, dentro
`scripts/generate-og.js` e `scripts/build-cottura.js`.

Se qualcuno ci infila un riferimento al browser, il pre-rendering si rompe e la
strada facile diventa riscrivere il markup a mano nello script di build — cioè
una seconda copia del piano, che divergerebbe al primo cambiamento. È da questa
purezza che deriva la garanzia che l'`HowTo` corrisponda a contenuto visibile:
la pagina statica e quella interattiva escono dalla stessa funzione.

Il montaggio nel browser (timer, storico, Wake Lock) sta in `vista-piano.js`,
`vista-timer.js` e `vista-storico.js`: è là che va il codice che ha bisogno di
un browser.

## Cose del calcolatore che sembrano bug e non lo sono

- **La temperatura di estrazione non scende sotto `soglia_sicurezza`.** La
  regola generale è `target − carryover`, ma sul pollo la soglia vince
  sull'aritmetica: su un patogeno non si scommette su una stima. Sta in
  `estrazione()` dentro `motore.js` ed è una scelta concordata.
- **L'allarme dei timer suona al tempo MINIMO della finestra**, non al massimo.
  "35-45 minuti" vuol dire "da 35 comincia a controllare", non "pronto a 45":
  un allarme sul massimo arriverebbe quando la carne è già oltre.
- **La curva del manzo cresce con circa s^1,45, non con s².** Applicando il
  quadrato dall'ancora dei 2,5 cm, a 6,5 cm uscirebbero 118 minuti invece dei
  60-80 osservati. Le ancore sono esperienza reale e vincono sulla formula.
- **La stagnola è vietata nel riposo delle bistecche e corretta sul brisket.**
  La regola in `regole.js` è vincolata a `famiglia`: non "uniformarla".
- **`dati/cottura/` non finisce in `dist/`.** Non è in `public/`: viene
  importato dal codice, quindi entra nel bundle del calcolatore, che è un chunk
  caricato solo su `/cottura/`.

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

Il cancello include `npm run build:cottura`, che oltre a validare i dati
**genera 918 piani** — ogni taglio per ogni dispositivo, cottura, metodo e
temperatura di partenza — e controlla monotonìe (più spesso deve voler dire più
tempo), intervalli rovesciati e avvisi agganciati a fasi inesistenti. Ha già
intercettato un avviso di sicurezza che spariva su un intero metodo di cottura:
se aggiungi regole o fasi, quel controllo è ciò che se ne accorge.

Per vedere un piano senza aprire il browser:
`node scripts/build-cottura.js --piano fiorentina 4.5 media_al_sangue kamado_piccolo`

Per verificare il comportamento nel browser usa `npm run preview`, che serve
`dist/` come sarà pubblicato. `npm run dev` non esegue il pre-rendering,
quindi non mostra quello che vedono i crawler.

## Deploy

Deploy = `npm run deploy`. **Il push su `main` non pubblica niente**: GitHub
Pages serve dal branch `gh-pages`, aggiornato solo da quel comando.

Il deploy è preceduto da `npm run check` con `&&`: se i dati sono incoerenti
la pubblicazione si ferma prima di partire. È voluto, non aggirarlo.

**Pubblica senza chiedere, se `npm run check` passa.** È il cancello a
decidere: quando è verde, chiudi il lavoro con `npm run deploy` invece di
fermarti a domandare. Se fallisce, non forzare — riporta cosa si è rotto.
(Indicazione esplicita di Domenico, 25/07/2026.)

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
