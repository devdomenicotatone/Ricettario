# Ricettario Lab

Ricettario personale di panificazione e cucina applicata: ogni ricetta è
documentata con parametri tecnici (idratazione, temperatura impasto, tempi di
maturazione) e tarata sugli strumenti di casa — Famag Grilletta, Fimar PF25E,
Philips Serie 7000.

Ospita anche un **calcolatore di cottura della carne su kamado**
([/cottura/](https://devdomenicotatone.github.io/Ricettario/cottura/)): dai
parametri del pezzo e dell'attrezzatura genera un piano a fasi con tempi,
temperatura di estrazione e gestione delle valvole.

Sito statico pubblicato su GitHub Pages:
**https://devdomenicotatone.github.io/Ricettario/**

## Stack

- **Vite 6** per build e dev server
- **JavaScript vanilla**, ES modules
- **CSS con design token in OKLCH**, doppio tema chiaro/scuro
- Router SPA scritto a mano (`js/router.js`) con View Transitions API
- Le pagine vengono **pre-renderizzate staticamente** in fase di build: i
  crawler leggono contenuto vero, la SPA si avvia sopra

Il sito non fa **nessuna richiesta a terze parti**: font, icone e Chart.js
sono serviti dal dominio. Chart.js è l'unica dipendenza, importata
dinamicamente e quindi in un chunk a parte: si scarica solo quando si apre
il pannello sensoriale di una ricetta.

## Avvio

```bash
npm install
npm run dev
```

Il dev server apre su `http://localhost:5173/Ricettario/`. Il `base` è
`/Ricettario/` perché su GitHub Pages il sito vive in una sottocartella:
vale anche in locale, non toglierlo.

## Comandi

| Comando | Cosa fa |
|---|---|
| `npm run dev` | Dev server con hot reload |
| `npm run build:recipes` | Rigenera `public/recipes.json` dai JSON in `ricette/`, validando i dati |
| `npm run build:cottura` | Valida i dati del calcolatore e genera 918 piani di prova per controllarli |
| `npm run build` | Build Vite in `dist/` |
| `npm run generate-og` | Pre-renderizza le pagine statiche, i dati strutturati, sitemap e robots |
| `npm run verifica` | Controlla l'output in `dist/` (vedi sotto) |
| `npm run check` | Tutti e cinque in sequenza: è quello che gira in CI |
| `npm run deploy` | `check` + pubblicazione su GitHub Pages |
| `npm run preview` | Serve `dist/` in locale, per vedere il sito come sarà pubblicato |

## Come sono organizzate le ricette

Ogni ricetta è un JSON in `ricette/<categoria>/<slug>.json`. Il nome del file
**deve** coincidere col campo `slug`, e la cartella con la categoria: la build
fallisce se non è così.

`public/recipes.json` è l'**indice generato**, usato dalla homepage e dalle
pagine categoria. Non modificarlo a mano: viene riscritto da
`npm run build:recipes`.

### Campi principali

| Campo | Note |
|---|---|
| `title`, `slug`, `category`, `description` | Obbligatori |
| `image` | Path relativo a `public/`, es. `images/ricette/pane/x.webp`. Servono anche `.avif` e `.webp` affiancati |
| `hydration` | Numero (non stringa). `0` per ciò che non è un impasto: salse, conserve, condimenti |
| `targetTemp`, `fermentation` | Stringhe libere. Lascia `""` se non si applica — **mai** `"n/a"` o `"nessuna"`, verrebbero stampate come se fossero dati |
| `ingredientGroups` | `[{ group, items: [{ name, note, grams, tokenId, excludeFromTotal }] }]` |
| `steps` | `[{ title, text }]`. Nel testo `{tokenId:valore}` diventa un numero che si riscala col calcolatore dosi |
| `baking`, `storage`, `proTips`, `glossary`, `alert` | Sezioni opzionali del dettaglio |
| `sensoryProfile`, `nutrition` | Alimentano il grafico sensoriale e i valori nutrizionali (per 100 g) |
| `tags` | Diventano le `keywords` dei dati strutturati |

I file `.backup.json`, `.pre-edit.json`, `.qualita.md` e `.validazione.md`
accanto alle ricette sono materiale di lavoro: restano nel repo ma non
vengono pubblicati.

### Aggiungere una ricetta

1. Crea `ricette/<categoria>/<slug>.json`
2. Metti le immagini in `public/images/ricette/<categoria>/<slug>.{webp,avif}`
3. `npm run check` — se qualcosa non torna, te lo dice e si ferma

### Aggiungere una categoria

`js/categories.js` è l'unica fonte. Aggiungi la voce con `name`, `dir`,
`emoji` (nome del PNG in `public/images/emoji/`), `unicode`, `title` e `desc`,
poi inseriscila in `CATEGORY_ORDER`. Crea la cartella `ricette/<dir>/`.

Attenzione: `dir` è la cartella su disco e **non sempre coincide con la
chiave** (`secondi_piatti` → `ricette/secondi-piatti/`). Per costruire path e
URL usa sempre `dir`.

## Il calcolatore di cottura

Vive su `/cottura/`: form a sei passi, poi un piano a fasi con timer. Il codice
sta in `js/cottura/`, i dati in `dati/cottura/`. Il modulo è un **import
dinamico**: chi apre una ricetta di pane non scarica niente del calcolatore.

| File | Cosa contiene |
|---|---|
| `dati/cottura/tagli.json` | I 13 profili dei tagli: temperature al cuore, soglie di sicurezza, ingombro, note ed errori comuni |
| `dati/cottura/dispositivi.json` | Le tre misure standard di kamado: diametro griglia, cestello carbone, inerzia, tempi di transizione |
| `dati/cottura/coefficienti.js` | **Tutti** i numeri tarabili: curve, correzioni, carryover, valvole, soglie, pagine SEO |
| `js/cottura/motore.js` | Dal form al piano. Puro: nessun DOM, dati come argomento |
| `js/cottura/kamado.js` | Comportamento della famiglia kamado: fumo pulito, burping, valvole, carbone, ingombro |
| `js/cottura/regole.js` | Consigli contestuali come dati, agganciati alle fasi del piano |
| `js/cottura/timer.js` | Timer a istanti assoluti, non contatori |

### Tarare i coefficienti sulla tua esperienza

I numeri in `coefficienti.js` sono marcati per affidabilità, e serve leggere il
marcatore prima di toccarli:

- `[ANCORA]` — valore d'esperienza diretta. Non modificarlo per far tornare una
  formula.
- `[DERIVATO]` — calcolato da un modello fisico e verificato contro le ancore.
- `[DA TARARE]` — punto di partenza ragionevole ma non misurato. È qui che
  conviene intervenire dopo una cottura reale.

Il sito aiuta: registrando l'esito delle cotture (al punto / poco cotta /
troppo cotta), dalla terza cottura sullo stesso taglio compare la tendenza e
dice in che direzione correggere. Lo storico sta in `localStorage`, non esce dal
tuo browser.

### Aggiungere un taglio

Una voce in `dati/cottura/tagli.json`. Obbligatori `id`, `nome`, `famiglia`,
`specie`, `grasso`, `parametro_dominante`, `ingombro_cm`, `temperature_cuore`,
`cotture_ammesse`, `metodi_ammessi`. `curva_tempo` punta una curva esistente in
`coefficienti.js` — non copiarne i numeri.

Se il taglio esclude un grado di cottura, **devi spiegare perché**
(`motivo_soglia` per la sicurezza, `motivo_cotture_escluse` per la qualità): il
form mostra le opzioni non ammesse bloccate con la spiegazione, e
`npm run build:cottura` fallisce se manca. Un pulsante grigio e muto insegna
solo che lo strumento è rotto.

### Aggiungere un apparecchio

Una voce in `dati/cottura/dispositivi.json`. Se è un altro kamado bastano i
numeri. Se è un tipo diverso di barbecue serve anche un modulo di comportamento
accanto a `js/cottura/kamado.js`, registrato in `FAMIGLIE` dentro `motore.js`:
le regole del kamado (inerzia asimmetrica, burping, deflettore) non valgono per
un gas.

### Aggiungere una pagina indicizzabile

Una voce in `PAGINE_SEO` dentro `coefficienti.js`, poi `npm run check`. Restare
pochi è voluto: pagine quasi identiche che cambiano solo un numero sono
contenuto sottile e fanno perdere visite invece di portarne. La misura del
kamado non entra nell'URL, è un selettore dentro la pagina.

## Cosa controlla `npm run verifica`

Il sito non ha test unitari perché quasi tutto il rischio sta nell'output
statico. `scripts/verifica-build.js` guarda `dist/` e blocca la pubblicazione
se trova:

- pagine senza `<link rel="canonical">`
- redirect JavaScript sulle pagine ricetta (rendono il sito non indicizzabile)
- JSON-LD non parsabile o duplicato
- pagine ricetta con `Recipe` incompleto (senza immagine, ingredienti o passaggi)
- pagine di cottura con `HowTo` incompleto (senza nome, passi o `totalTime`)
- **ingredienti o passaggi marcati nei dati strutturati che non compaiono nel
  testo visibile** — per Google è una violazione, non un dettaglio. Vale sia per
  i `Recipe` delle ricette sia per gli `HowTo` dei piani di cottura
- titolo, meta description e H1 identici tra loro sulle pagine di cottura (sulle
  ricette titolo e H1 coincidono per scelta, ed è corretto)
- testo a doppia codifica UTF-8 (`metÃ ` invece di `metà`)
- URL nella sitemap che non corrispondono a nessuna pagina
- file di lavoro o PDF sorgente finiti nel deploy
- `dist/` sopra i 60 MB, segno che è rientrato qualcosa di grosso

## Font

Inter e Playfair Display sono in `public/fonts/`, dichiarati in
`css/base/fonts.css`. Sono i file **variabili del solo subset latin**: coprono
tutti gli accenti usati dal sito (à, è, ù, ö, ü, ×), che stanno in U+0000–00FF.
In tutto 122 KB per tre file, contro due connessioni esterne render-blocking.

Entrambi i font sono sotto SIL Open Font License 1.1, che consente l'hosting
diretto. Per aggiornarli, riscarica da Google Fonts i blocchi `@font-face` con
`unicode-range` che inizia per `U+0000-00FF` e sostituisci i `.woff2`,
tenendo gli stessi nomi (sono referenziati anche dai `<link rel="preload">`
in `index.html`).

## Deploy

```bash
npm run deploy
```

**Il push su `main` non pubblica nulla.** GitHub Pages serve dal branch
`gh-pages`, che viene aggiornato solo da questo comando: builda, verifica, e
solo se tutto passa fa push di `dist/` su `gh-pages` usando un repo di appoggio
in `C:\tmp\ghp-ricettario`.

Per ricreare il branch da zero (ripulendo anche la storia) basta cancellare
quella cartella prima di deployare.

### Nota su `robots.txt`

Su un project site di GitHub Pages l'unico `robots.txt` che i crawler leggono è
quello alla radice del dominio (`devdomenicotatone.github.io/robots.txt`), che
sta in un altro repo. Quello generato qui è corretto ma **non viene letto**:
diventerebbe efficace con un dominio custom. Nel frattempo la sitemap va
inviata a mano da Google Search Console.

## Struttura

```
index.html              Unica fonte del markup della homepage
js/
  router.js             Router SPA + gestione del deep link su GitHub Pages
  main.js               Avvio, homepage, pagine categoria, caroselli, ricerca
  recipe-renderer.js    Pagina ricetta: dosi, grafico sensoriale, sezioni
  categories.js         Registry categorie — unica fonte
  recipe-meta.js        Guardia sui badge (idratazione, tempi)
  icons.js              Icone Lucide inline, nessun CDN
  emoji.js              Helper per le Fluent Emoji locali
  cottura/              Calcolatore di cottura (chunk a parte, import dinamico)
    pagina.js           Ingresso nella SPA: decide form o piano dall'URL
    form.js             Form a sei passi
    motore.js           Calcolo del piano — PURO, importato anche da Node
    html-piano.js       Markup del piano — PURO, condiviso col pre-rendering
    vista-piano.js      Montaggio nel browser
    kamado.js           Comportamento della famiglia kamado
    regole.js           Consigli contestuali come dati
    timer.js            Timer a istanti assoluti
    avvisatore.js       Suono, vibrazione, notifiche, Wake Lock
    storico.js          Cotture passate e tendenza di taratura
    stato-url.js        Configurazione in query string e slug SEO
    formato.js          Numeri e durate in italiano
css/                    Token, componenti, pagine
dati/cottura/           Tagli, dispositivi e coefficienti del calcolatore
ricette/<cat>/*.json    Le ricette
public/                 Servito così com'è: immagini, recipes.json, 404.html
scripts/
  build-recipes.js      Genera e valida l'indice
  build-cottura.js      Valida i dati di cottura e genera 918 piani di prova
  generate-og.js        Pre-rendering, dati strutturati, sitemap, robots
  verifica-build.js     Controlli sull'output
  deploy-ghpages.js     Pubblicazione su gh-pages
```
