# Checkup — Il Ricettario (repo del sito)

> **STATO — 28/07/2026, sera. Chiuso tutto.** La seconda edizione di questo
> documento (mattina dello stesso giorno) si apriva con due XSS stored già
> corrette e **15 punti aperti**. In giornata due sessioni ne hanno chiusi due
> — il 5 (la garanzia sul deploy, commit `4f3986c`) e il 6 (il manifest della
> PWA, commit `444f20a`) — e i **quattordici rimasti sono stati chiusi in
> un'unica passata: 14 agenti in parallelo, uno per punto**, con le build
> vietate ai singoli e un solo `npm run check` a valle, più uno smoke test nel
> browser sul sito servito da `dist/`. Una nota di conteggio, perché i numeri
> vanno detti giusti: la tornata che ha chiuso 5 e 6 dichiarava «restano 13»,
> ed erano 14 — il 5 non stava fra i 15 aperti, quindi la sottrazione giusta
> era 15 − 1.
>
> Il cancello dopo la passata: **918 piani cottura generati e controllati
> (con due validazioni in più), 106 pagine pre-renderizzate, 349 classi CSS,
> 30,1 MB in `dist/`, zero errori** — il peso sale di ~3,8 MB per le 162
> varianti responsive delle foto, che però faranno scaricare al visitatore
> molto meno di prima. Ogni punto qui sotto porta la sua chiusura in coda,
> con le verifiche vere; cosa resta da vedere nel browser fisico è elencato
> in fondo, nella sezione nuova «La chiusura, misurata».
>
> **Sotto, il documento della seconda edizione com'era**, coi suoi numeri di
> allora: sono la fotografia contro cui le chiusure si misurano.
>
> **Metodo della seconda edizione:** 24 agenti in parallelo su sette
> dimensioni — cancelli, sicurezza, dati, prestazioni, SEO, accessibilità,
> architettura — più un critico di completezza; ~1.000 chiamate a strumenti;
> ogni difetto passato da uno scettico incaricato di smontarlo. **Dei difetti
> proposti ne sono sopravvissuti 15 su 24**: quelli caduti sono elencati alla
> fine, perché sapere cosa è stato escluso vale quanto sapere cosa resta.
>
> I punti sono in ordine di quanto pesano, non di quanto costa sistemarli.

---

## Quello che regge, misurato

Va prima dei problemi, perché è il motivo per cui la lista è di manutenzione e
non di emergenze. Nessuna di queste righe è stata dedotta.

- **Il markup riscritto oggi regge all'attacco.** 25 campi diversi riempiti con
  `"><img src=x onerror=alert('XSS')>` — titolo, sottotitolo, categoria, slug,
  note ingredienti, passi, alert, crediti foto — su `htmlRicetta` in entrambe
  le modalità e su tutti i builder di `html-categoria.js`: **zero fughe**.
- **La purezza dei sei moduli condivisi è vera anche in modo transitivo.**
  Calcolata la chiusura degli import di `token-dosi`, `html-ricetta`,
  `html-categoria`, `emoji-core`, `cottura/motore` e `cottura/html-piano`:
  nessuno arriva a `router.js`, al DOM o a `import.meta`.
- **I cancelli passano su di sé:** `verifica-build` → 106 pagine, 308 file di
  testo, 349 classi CSS, 26,3 MB, zero problemi; `build-cottura` → 918 piani
  generati e controllati, zero problemi.
- **I dati delle ricette sono coerenti.** 920 token dose confrontati con la
  tabella ingredienti: **uno solo** non combacia, ed è verosimilmente giusto
  (la focaccia ne fa due teglie).
- **Canonical e sitemap sono in ordine su tutte e 106 le pagine**, e i 106
  `<loc>` corrispondono esattamente all'insieme delle pagine reali.
- **La struttura dei titoli è pulita:** 106 pagine su 107 hanno esattamente un
  `<h1>` e **zero salti di livello**. L'unica senza è `404.html`, che è
  un'eccezione dichiarata.
- **Le 80 schede pre-renderizzate in homepage sono costate 6,5 KB compressi**
  (da 5.715 a 12.264 B gzip) per 89 link reali. Il timore che appesantissero
  la home era infondato: il grezzo cresce del 429%, il servito di poco.

---

## 1. Le emoji pesano più di tutto il resto della pagina — CHIUSO

**Gravità 6.** `public/images/emoji/*.png` (29 file) + `js/emoji-core.js:71`

Misurato dal vivo sul sito pubblicato con `performance.getEntriesByType`:

| pagina | peso totale | di cui emoji |
|---|---|---|
| homepage | 671.824 B | **536.824 B — 79,9%** |
| ricetta (pane di Altamura) | 717.534 B | **435.652 B — 60,7%** |

Sono 29 PNG **256×256 RGBA**, da 15 a 47 KB l'uno, 901 KB in totale — resi a
14, 16, 18, 20, 24, 32 o 40 px CSS. Sulla pagina ricetta le emoji pesano **4,1
volte la foto hero** e **22 volte tutto il JavaScript**.

È il difetto più grosso del sito per rapporto costo/beneficio: nessuna
funzione, nessuna scelta di design lo richiede, e si risolve ridimensionando i
PNG alla misura d'uso o passando a uno sprite SVG.

**Chiuso il 28/07/2026.** Prima la misura del perimetro: un grep su js/, css/,
`index.html` e scripts/ conferma che nessun uso supera i 40 px CSS (l'unico
consumatore non-`<img>` è l'icona delle notifiche in `avvisatore.js`, resa dal
sistema operativo). Poi il ridimensionamento in place a **128×128** — copre i
40 px CSS anche a densità 3×. Il primo passaggio con System.Drawing fermava il
totale a ~485 KB; ricodificati dagli originali con sharp (lanczos3, PNG a
palette 8-bit con trasparenza): **da 901.120 a 138.042 byte, −85%**. Il file
più pesante ora è `gear.png` a 6,5 KB — prima il più leggero ne pesava 15.
Ogni file riaperto e verificato due volte, con un parser strutturale (firma,
IHDR 128×128, tRNS, IEND) e con un decoder DIVERSO dall'encoder (GDI+): angolo
trasparente e antialias conservati su tutti e 29. Nomi invariati,
`emoji-core.js` non toccato; gli originali 256×256 sono in un backup fuori dal
repo. Resta per l'occhio umano: la resa dei gradienti Fluent a 2×/3× (la
quantizzazione a palette può introdurre dithering impercettibile).

## 2. Ogni foto è servita in una sola risoluzione — CHIUSO

**Gravità 5.** `js/image-utils.js:29-43`, `js/html-categoria.js:108`

`buildPicture` emette due `<source>` per **formato** (AVIF, WebP) ma nessun
`srcset` per **larghezza**, nessun `sizes`, nessun `width`/`height`. La scheda
del carosello scarica lo stesso file dell'hero: `gnocchi-di-patate.avif` è
175.067 B a 1200×896 per uno slot di **290×160**, cioè 24 volte i pixel
necessari. Le 81 AVIF referenziate dalla homepage pesano **6,4 MB**.

Secondo problema, indipendente e a costo zero: lo sfondo della pagina categoria
usa `url(...webp)` ignorando l'AVIF che ha accanto.

**Chiuso il 28/07/2026.** Generate le varianti a 640 px per tutte le 81 foto
referenziate: 162 file (AVIF + WebP), 4,19 MB, qualità allineata agli
originali — `gnocchi-640.avif` è 32,8 KB, **−81%** sul caso del checkup. Le
foto non sono uniformi (26 formati diversi), quindi le dimensioni reali vivono
nel nuovo modulo dati `js/dimensioni-foto.js` (81 voci, invariante
voce⇔varianti documentato in testa): `image-utils` resta puro, niente fs a
runtime. `buildPicture` e `buildHeroPicture` ora emettono `srcset` a due
larghezze per formato, `sizes` dal chiamante (misurati dai CSS: carosello
`(min-width:1200px) 290px, (min-width:480px) 260px, 200px`; griglia categoria
`(min-width:640px) 368px, calc(100vw - 32px)`) e `width`/`height` reali — una
foto fuori mappa degrada al markup vecchio senza 404. Lo sfondo categoria ha la
doppia dichiarazione con `image-set()` e l'AVIF davanti. Verificato con uno
script che importa i moduli veri (19 controlli) e nel browser sul servito:
`srcset`/`sizes`/`width`/`height` presenti sulle 80 schede. Limite dichiarato:
la griglia categoria a colonna singola su telefono 2× pesca ancora
l'originale (servirebbe una terza taglia ~960); il caso 24× del carosello è
coperto a ogni densità.

## 3. Il calcolatore dosi si disabilita sotto le dita, e non annuncia niente — CHIUSO

**Gravità 5.** `js/recipe-renderer.js:131`, `js/html-ricetta.js:201-211`

Con il fuoco su «Diminuisci dosi», tre clic: ×1 → ×0,75 → ×0,5 → ×0,25, e al
terzo `disabled` diventa `true` e **il fuoco cade sul `<body>`**. Da ×0,25
l'unico modo di risalire è ritraversare la pagina fino al «+».

Sullo stesso giro, la regione live `#annuncio-pagina` — che esiste e che router
e timer usano bene — **resta vuota**: il moltiplicatore, le dieci celle delle
quantità, il peso totale e i token dose dentro il procedimento cambiano tutti
in silenzio.

**Chiuso il 28/07/2026.** `updateDoses` ora sposta il fuoco sull'altro
pulsante PRIMA di impostare `disabled` (riserva difensiva: il display del
moltiplicatore con `tabindex="-1"`), e ogni cambio annuncia una sola frase
sintetica — «Dosi ×0,75», virgola italiana — via `js/annuncio.js`, la regione
live unica del sito: niente seconde regioni, niente elenco delle celle.
L'init non annuncia e non tocca il fuoco (la pagina la annuncia già il
router). Verificato con una simulazione a stub della sequenza completa e poi
nel browser sul servito: al terzo clic il fuoco è sul «+», mai sul `<body>`,
e la regione live dice «Dosi ×0,5». Resta per l'orecchio: la lettura reale
con NVDA.

## 4. Il cancello «niente redirect JavaScript» riconosce una scrittura su quattro — CHIUSO

**Gravità 5.** `scripts/verifica-build.js:166-168` e `328-334`

La regex è `/location\.replace|http-equiv="refresh"/`. Provata contro sette
forme reali: blocca `location.replace(…)`, `window.location.replace(…)`,
`document.location.replace(…)`; **passa** `location.href = …`,
`window.location = …`, `location.assign(…)` e
`var l = window.location; l.replace(…)`.

L'ultima non è ipotetica: **è testuale in `public/404.html`**, cioè la forma che
evade il controllo è già quella che il progetto usa. E la scansione guarda solo
i file chiamati `index.html`: dei 107 `.html` di `dist/` ne controlla 106, e
l'unico escluso è proprio `404.html`.

**Chiuso il 28/07/2026.** Quattro forme nominate in `FORME_REDIRECT`:
chiamate a `replace()`/`assign()` su `location` con o senza prefisso
(`window`/`document`/`top`/`self`/`parent`); assegnamenti a `location` o a una
proprietà che naviga (`href`, `pathname`, `search`, …, anche `+=`, con guardie
che escludono `==`/`===`/`=>`); l'alias dell'oggetto `location` in una
variabile; meta refresh case-insensitive. Le letture legittime della SPA
(`location.pathname` e simili) non scattano perché ogni pattern pretende una
scrittura. La scansione ora copre **tutti** gli `.html` di `dist/` con una
whitelist esplicita e commentata del solo `dist/404.html`, che da shim di
GitHub Pages il redirect DEVE farlo. Provato con un harness che estrae i
pattern dal file vero: le sette forme del punto più undici scritture extra
scattano tutte, zero falsi positivi su righe reali dei sorgenti; sul `dist`
attuale 106 pagine pulite e `404.html` che scatta con l'alias — la regex
vecchia, su quello stesso file, taceva.

## 5. Si pubblica senza passare da GitHub — CHIUSO

**Gravità 5 quando è stato misurato, 2 dopo il rientro, zero adesso.**
`.github/workflows/ci.yml` + `scripts/deploy-ghpages.js`

Quando il critico di completezza l'ha misurato,
`git rev-list --left-right --count origin/main...HEAD` dava **0 17**:
diciassette commit — tutto il lavoro della giornata, comprese le due XSS qui
sopra — esistevano solo su questo portatile. **La CI non li aveva mai visti**,
perché gira sul push a `main`, mentre gli undici deploy erano partiti da qui.

**Rientrato lo stesso giorno**, e non perché qualcuno abbia eseguito il rimedio:
una seconda sessione aperta sullo stesso repo ha spinto il proprio commit e si è
portata dietro anche gli altri diciassette. Verificato interrogando il server —
`git ls-remote`, non il riferimento locale che poteva essere vecchio: `0 0`, i
commit chiave sono tutti antenati di `origin/main`, e il run della CI sul push è
`success`.

**E ora la struttura è chiusa** (commit `4f3986c`): `deploy-ghpages.js` chiede
al server — non al riferimento locale — se il ramo corrente è avanti al suo
remoto, e in quel caso **si rifiuta di pubblicare**, come già si rifiuta quando
`npm run check` fallisce. La via d'uscita legittima (ramo di prova, macchina
senza rete) è esplicita: `npm run deploy -- --comunque`. CLAUDE.md lo
documenta nella sezione Deploy.

## 6. Il manifest della PWA risponde 404, in produzione — CHIUSO

**Gravità 4.** `site.webmanifest` + `index.html:12`

`site.webmanifest` sta nella **radice** del repo, non in `public/`. Vite lo
tratta come asset di `index.html` e lo emette hashato dentro `/assets/`, **senza
riscrivere gli URL relativi che contiene**. Sul sito pubblicato entrambi gli
indirizzi delle icone rispondono 404.

È l'unico file del sito che nessun cancello legge: `verifica-build` lo
considera «sempre lecito» e non ne apre il contenuto.

**Chiuso il 28/07/2026** (commit `444f20a` più la coda in questo commit).
Spostato in `public/`, che è servito così com'è: gli stessi percorsi relativi
tornano giusti — e restano giusti se un domani cambia la base. `index.html` lo
referenzia con path assoluto per non farlo passare da Vite; sparita anche una
`favicon.svg` duplicata identica. Verificato sul sito pubblicato: manifest,
icona e `start_url` rispondono 200. **E il buco che l'aveva reso possibile è
chiuso**: il controllo 2-ter di `verifica-build` risolve `start_url`, `scope` e
ogni `icons[].src` come farebbe il browser — relativi alla posizione in cui il
manifest è servito — e pretende che esistano in `dist/`; provato sui quattro
modi di romperlo, quattro su quattro intercettati.

## 7. Numeri tarabili scritti dentro `js/cottura/` — CHIUSO

**Gravità 4.** `js/cottura/regole.js:67,137,242`, `motore.js`, `kamado.js`

CLAUDE.md dice testualmente: «se scrivi un numero dentro `js/cottura/`, è un
bug». Ce ne sono almeno dieci. Il caso peggiore si dimostra in cinque righe:
`regole.js:67` scrive `ctx.spessore >= 4` come letterale, mentre venti righe
sotto la regola gemella legge `SOGLIE.rotazione_su_bordi_da_cm`, che in
`coefficienti.js:277` vale esattamente `4.0`. **Oggi coincidono, ma sono due
numeri e non uno**: chi ricalibra dopo una cottura reale ne sposta uno.

**Chiuso il 28/07/2026.** Il censimento vero ha trovato più del previsto: **21
letterali di dominio in 15 punti** fra `regole.js`, `motore.js` e `kamado.js`.
Tutti spostati in `dati/cottura/coefficienti.js` senza cambiare alcun valore:
la regola della griglia bassa ora legge `SOGLIE.rotazione_su_bordi_da_cm` sia
nella condizione sia nel testo, e sono nate costanti nuove in `KAMADO` (taglie
griglia, chunk di legno), `CAMERA.fallback`, `MODELLO_TERMICO`, `RIPOSO` e nel
blocco nuovo `FASI` (minimi di finitura e scottatura, frazioni dei checkpoint,
ripartizione del low & slow), ognuna col suo perché scritto accanto. La prova
che il comportamento è identico non è dedotta: **926 piani generati prima e
dopo (i 918 dello spazio completo più 8 configurazioni avverse sui confini
esatti delle soglie toccate), output identico byte per byte**. Restano nei
file solo arrotondamenti, conversioni di unità e indici — e un `+5` gemello
del margine termico in `scripts/build-cottura.js`, annotato ma fuori
perimetro (sta in `scripts/`, non in `js/cottura/`).

## 8. Cinquanta ricette che non sono impasti dicono «Peso Totale Impasto» — CHIUSO

**Gravità 4.** `scripts/generate-og.js:150`, `js/html-ricetta.js:222`

Il README fissa la convenzione: `hydration: 0` significa «ciò che non è un
impasto: salse, conserve, condimenti». **Cinquanta ricette su 81 hanno
`hydration: 0`, e tutte e 50 stampano «Peso Totale Impasto»** nella tabella e
spediscono a Google `recipeYield: "circa N g di impasto"`. Dal JSON-LD
pubblicato: burro chiarificato «circa 500 g di impasto», spare ribs «circa 1836
g di impasto».

**Chiuso il 28/07/2026.** Le ricette erano nel frattempo diventate 51 su 81.
Entrambe le uscite ora passano dalla stessa guardia già usata dal badge
Idratazione (`isValidBadge`): idratazione vera → «Peso Totale Impasto» /
«circa N g di impasto»; `hydration` 0 o assente → «Peso Totale» / «circa N g».
In `html-ricetta.js` la scelta sta nell'helper `etichettaPesoTotale` col
commento sulla convenzione; `generate-og.js` importa la stessa guardia dal
modulo puro. Verificato col builder vero su **tutte le 81 ricette**: etichetta
visibile e `recipeYield` coerenti al 100% (30 con «Impasto», 51 senza), e nel
browser il burro chiarificato dice «Peso Totale» mentre l'Altamura dice «Peso
Totale Impasto» con «circa 1533 g di impasto» nel JSON-LD.

## 9. I valori nutrizionali dicono due basi diverse — CHIUSO

**Gravità 4.** `js/html-ricetta.js:351`, `generate-og.js:207`,
`verifica-build.js:315-321`

Su 80 pagine con `NutritionInformation`, il JSON-LD dichiara
`servingSize: "100 g"` e il testo visibile dice «Valori medi calcolati tramite
database USDA **per l'intera ricetta**». La stringa «per 100 g» non compare da
nessuna parte nel visibile. Il dato sorgente si chiama `kcal_per_100g`: la
frase è quella sbagliata, ed è fissa nel template.

Il cancello non se ne accorge perché confronta **il numero**, e il numero esce
dalla stessa fonte da entrambe le parti — è la terza volta oggi che un
controllo risulta cieco perché guarda due lati derivati da un'unica sorgente.

**Chiuso il 28/07/2026.** Il disclaimer ora dice «Valori medi per 100 g di
prodotto finito» — il resto della frase invariato; `generate-og.js` non andava
toccato (era già coerente, e il pre-rendering passa dallo stesso builder). E il
cancello non guarda più solo il numero: quando il JSON-LD dichiara
`servingSize` con «100 g», pretende che il testo VISIBILE contenga la
locuzione «per 100 g» — il solo «100 g» non basta, lo direbbe qualunque riga
ingrediente. Provato nei due sensi: il markup vecchio bocciato anche con
«100 g di farina» fra gli ingredienti, il nuovo passa; «intera ricetta» non
compare più in nessun sorgente.

*Nota successiva, stesso giorno:* dalla frase è uscito anche «calcolati
tramite database USDA». I valori li stima l'AI della dashboard, non un
database: dichiarare una fonte che non c'è era un difetto della stessa specie
della base sbagliata — solo meno visibile, perché nessun numero lo
contraddiceva. Ora: «stimati sugli ingredienti della ricetta». Se un giorno i
numeri arriveranno davvero da USDA (FoodData Central), la frase tornerà a
nominarlo.

## 10. Il cancello sulle promesse alimentari ignora il femminile — CHIUSO

**Gravità 4.** `scripts/build-recipes.js:229` e `:231`

`/\bvegan[oi]?\b/i` riconosce vegano, vegani, vegan — **non** vegana, vegane.
Verificato con otto ricette-controesempio: «vegana» + Guanciale, «ricetta
vegetariana» + Colatura di alici e «ricette vegane» + Pancetta **passano senza
un avviso**.

È esattamente la cicatrice che il file documenta tre righe sopra («scritto
`\b(acciugh)\b` il plurale Acciughe non combacia»), corretta sul lato
ingredienti e mai applicata al lato tag. Oggi è latente — i 21 tag esistenti
sono tutti maschili — ma la dashboard scrive già decine di tag concordati al
femminile. Costa un carattere per regex, e su 380 tag reali non produce **zero**
falsi positivi.

**Chiuso il 28/07/2026.** Le due regex sono ora `vegan[oiae]?` e
`vegetarian[oiae]?`, `\b` e case-insensitive invariati, con un commento che
affianca questa cicatrice a quella delle acciughe; «senza glutine» e «senza
lattosio» sono locuzioni invarianti, nessun altro buco dello stesso tipo nel
controllo. La misura: gli otto controesempi del checkup ora scattano tutti
(prima zero); su 81 JSON e 583 occorrenze di tag (380 unici) i match passano
da 22 a 22 — **insieme nuovi-meno-vecchi vuoto, zero falsi positivi** — e i
falsi amici (veganesimo, vegetale, vegetazione) restano fuori.

## 11. La pagina ricetta butta il pre-rendering e se lo riscarica — CHIUSO

**Gravità 4.** `js/recipe-renderer.js:23-32`, `js/router.js:263`

L'HTML servito contiene già 26.820 caratteri di ricetta con 28 ingredienti e 11
passaggi. Al primo caricamento il router chiama comunque `navigateTo`, e
`renderRecipe` sostituisce subito tutto con lo spinner «Caricamento ricetta…»,
poi fa `fetch` del JSON e ricostruisce. Misurato: **122 ms** in cui una pagina
completa viene rimpiazzata da un segnaposto.

**Chiuso il 28/07/2026.** Il builder marca l'hero con
`data-ricetta="categoria/slug"` (stesso builder per SPA e pre-rendering,
quindi il marcatore arriva anche nelle pagine statiche), il router passa la
sua bandierina primo-caricamento ai renderer, e `renderRecipe` salta lo
spinner solo quando è il primo caricamento E il marcatore dentro `#app`
combacia con la ricetta chiesta: la statica resta in vista mentre il JSON
scarica, sostituita solo a markup interattivo pronto. Percorso d'errore
deciso: se il fetch fallisce con la statica in vista, la pagina resta intatta
con un banner `role="alert"` — meglio una pagina completa con un avviso che
uno spinner rimpiazzato da un errore. In più una guardia sul `pathname` prima
di ogni scrittura: con la statica in vista i link sono cliccabili durante il
fetch, e una risposta in ritardo non deve sovrascrivere la pagina su cui nel
frattempo si è navigato. Navigazione SPA, arrivo via shim 404 e HTML vecchio
in cache restano con lo spinner di oggi, che è la degradazione voluta.
Resta per il browser fisico: il primo caricamento con rete lenta (il flash
non deve esserci) e la prova con View Transitions attive.

## 12. Le pagine del calcolatore sono cloni al 98,3% — CHIUSO

**Gravità 3.** `dati/cottura/coefficienti.js:293-308`

`fiorentina-5cm` contro `fiorentina-6cm`: 834 parole ciascuna, **14 diverse — e
sono tutte numeri**, nessuna frase. Similarità Jaccard su shingle da 6 parole:
83%. Il commento accanto a `PAGINE_SEO` avverte proprio contro «pagine quasi
identiche che cambiano solo un numero»: la regola è scritta e non è rispettata.

**Chiuso il 28/07/2026.** Rimisurate coi moduli puri **tutte le 91 coppie**:
le coppie stesso-taglio stavano fra il 72 e l'83%. Aggiunto a 7 voci di
`PAGINE_SEO` un campo `approfondimento` — titolo e 3-4 paragrafi scritti per
QUELLA misura, ancorati ai numeri del motore (carryover, estrazione, finestra
di indiretta, checkpoint) — con due cancelli dentro: `vale_per` fa mostrare il
testo solo sulla configurazione per cui è scritto, così una variante in query
string non pubblica numeri falsi; `numeri_citati` è l'ancora verificabile —
`build-cottura.js` ricalcola il piano e **si ferma se la prosa è rimasta
indietro rispetto a una ritaratura**. La sezione la rende `html-piano.js`
(classi esistenti, moduli puri intatti), quindi statica e SPA escono dalla
stessa funzione. Dopo: fiorentina 5~6 da 83,1 a **54,4%**, 4~5 a 55,0%, 3~4 a
50,7%, costata 3~4 a 49,5%; la coppia massima residua dell'intero calcolatore
è 55,4%, sotto l'obiettivo del ~60%.

## 13. Titolo e descrizione delle categorie sono scritti due volte — CHIUSO

**Gravità 3.** `generate-og.js:552-553` contro `js/main.js:281-283`

Il refactoring ha unificato il markup ma non i metadati. Su `/ricette/pane/` il
file servito dice «Pane — 8 Ricette — Ricettario Lab»; appena la SPA parte il
titolo diventa «Pane Artigianale — Il Ricettario». **Già divergenti in
produzione.**

**Chiuso il 28/07/2026.** La composizione è una: `metaPaginaCategoria` in
`js/html-categoria.js` (il modulo puro già condiviso dai due mondi) legge la
voce del registry `js/categories.js` — che titolo parlante e descrizione li
aveva già — e la usano entrambi i lati. Il conteggio ricette è fuori dal
formato **di proposito**: `main.js` scrive `document.title` prima del fetch
dell'indice, quando il numero non c'è ancora — identico batte ricco. Il
brand è «Ricettario Lab» ovunque, via lo stesso suffisso delle pagine
ricetta. Effetto collaterale voluto: `og:title` delle categorie porta il
titolo parlante invece del conteggio. Verificato per tutte le 9 categorie
(title SPA identico al `<title>` statico) e nel browser: su `/ricette/pane/`
il titolo è «Pane Artigianale — Ricettario Lab» servito, e non cambia più
quando la SPA parte.

## 14. Otto link del footer non portano da nessuna parte — CHIUSO

**Gravità 3.** `index.html:311-317` e `359-365`

Sono ancore (`#home`, `#ricette`, `#strumenti`, `#chi-sono`) a sezioni che
esistono **solo in homepage**. Su 105 pagine su 106 il bersaglio non esiste:
sono 840 link morti, e da nessuna pagina interna il footer porta alla home.
Verificato cliccando: l'URL guadagna `#home`, la pagina non si muove.

**Chiuso il 28/07/2026.** Gli otto link (blocco Navigazione e blocco Stack,
entrambi nel footer) sono ora URL assoluti con base — `/Ricettario/` per
Home, `/Ricettario/#sezione` per gli altri — la stessa forma già usata dai
breadcrumb. Ai sette con sezione è agganciato `data-nav-section`, riusando la
gestione che il router ha già per la navbar: senza JavaScript l'URL basta da
solo (carica la home e salta al frammento), da pagina interna il router
naviga in home e poi scorre alla sezione, in homepage resta il salto nativo.
Il dettaglio che non si vedeva: un href nudo intercettato dal router avrebbe
scartato l'hash e riportato in cima **anche in homepage** — regressione
sull'unica pagina dove i link funzionavano. Effetto collaterale utile: le
ancore nude erano invisibili al controllo link del cancello, gli URL nuovi ci
entrano e risolvono a `dist/index.html`. Verificato: zero `href="#…"` residui
nel footer, id bersaglio tutti esistenti, e nel browser gli otto href sono
assoluti e coerenti da ogni forma di pagina.

## 15. I timer di cottura strappano il fuoco a ogni comando — CHIUSO

**Gravità 3.** `js/cottura/vista-timer.js:125-129`

Clic su «Avvia»: a +112 ms i comandi diventano «Pausa | Fatta» e
`document.activeElement` è `BODY`, e ci resta. Stessa cosa su Pausa e su
Riprendi. La causa è `contenitore.innerHTML = …`, che ricostruisce il pannello
a ogni cambio di forma senza rimettere il fuoco. Per tornare al pulsante
servono **12 Tab** su 41 elementi focalizzabili.

Il checkup accessibilità aveva chiuso il caso gemello sul *battito* del timer;
questo è il caso sui *comandi*, e non era stato provato.

**Chiuso il 28/07/2026.** `comanda` legge dove sta il fuoco PRIMA del
ridisegno e, solo se stava nel markup rifatto, lo rimette sul comando che
continua il gesto (`rimettiIlFuoco`, sul pattern di `riprendiIlFuoco` del
form): Avvia→Pausa, Pausa→Riprendi, Riprendi→Pausa, rifai→Avvia; «Fatta»
manda il fuoco sull'Avvia della fase successiva — dove la pagina sta già
scorrendo e dove l'annuncio indirizza — o sul «rifai» se un Avvia dopo non
c'è. Stessa cura sulla barra fissa in basso, che aveva lo stesso difetto sui
suoi due comandi, e sul cambio di forma **a tempo** (in corso→scaduta), stessa
causa `innerHTML` sfuggita al fix del battito. Chi ha il fuoco altrove non
viene toccato. Misurato con un test jsdom sulla mappa completa
stato→markup→fuoco: **21 controlli su 21**. Resta per la tastiera vera:
l'anello di focus visibile e lo scroll morbido non strattonato.

## 16. Il pulsante «Fatta!» non dice mai il suo stato — CHIUSO

**Gravità 3.** `js/html-ricetta.js:114`, `js/recipe-bookmarks.js:112-118`

Spento: testo «○ Segna come fatta», `aria-label` «Segna come fatta»,
`aria-pressed` assente. Acceso: testo «✓ Fatta!», `aria-label` **ancora**
«Segna come fatta», `aria-pressed` **ancora** assente. L'`aria-label` vince sul
contenuto, quindi per chi ascolta il nome è identico nei due stati: è un
interruttore senza valore.

**Chiuso il 28/07/2026.** L'`aria-label` è stato rimosso — il nome accessibile
è il testo corrente, che già distingue gli stati e rispetta «label in name» —
il markup esce con `aria-pressed="false"` (il builder non conosce lo stato:
ci pensa il runtime) e `updateButton` scrive l'attributo sia all'init (stato
da `localStorage` al mount) sia a ogni toggle, nei due sensi; i simboli ○/✓
sono `aria-hidden`. La deviazione dall'APG-purista («nome stabile» con
`aria-pressed`) è deliberata e documentata: con il testo che cambia PIÙ lo
stato, i due stati sono distinti due volte e mai ambigui, e il comando vocale
trova il pulsante col nome che si legge. Verificato col builder (markup
giusto, e il pulsante non c'è nella statica, com'è voluto) e nel browser:
`aria-pressed="false"`, nessun `aria-label`. Resta per l'orecchio: l'annuncio
«premuto/non premuto» con NVDA.

---

## Il punto chiuso: due XSS stored nel calcolatore

**Chiuso il 28/07/2026.** `js/cottura/form.js`, `js/cottura/vista-storico.js`

`attrezzaturaRicordata()` restituiva l'oggetto letto da `localStorage` con il
solo controllo `typeof === 'object'`, e `montaForm` lo sovrapponeva allo stato
**dopo** `normalizza()` — cioè dopo il cancello che clampa i valori, quello il
cui commento dice «senza questo passaggio un `?cm=99` arriverebbe fino al
motore». Uno `spessore` arbitrario finiva nel `value=` di un `<input>`, e con il
payload giusto ne usciva un `onfocus` che **eseguiva**. Nel secondo caso
`estrazione_c` finiva nel markup dello storico senza `esc()`, e un `<img
onerror>` partiva **all'apertura della pagina, senza un clic**.

Perché conta più di quanto sembri: su GitHub Pages tutti i siti di un account
condividono l'origine, **quindi condividono il `localStorage`**. Non serviva
bucare il Ricettario per scrivere quelle chiavi: bastava un'altra pagina
pubblicata sotto lo stesso account.

Correzione: solo le quattro chiavi che `ricordaAttrezzatura` scrive davvero,
col tipo giusto, e `esc()` su tutto lo storico — compresi i campi che
«dovrebbero» essere numeri, perché `num()` è solo `String(n).replace('.', ',')`
e non protegge niente.

**Verificata eseguendo di nuovo i due payload sul percorso vero** — form portato
fino al passo dello spessore, storico aperto sul piano: il cursore rende
`value="4.5"` senza `onfocus`, il payload dello storico si vede come testo
inerte, `document.title` non cambia, zero `img[onerror]`.

---

## La chiusura, misurata

La passata dei 14 punti è del 28/07/2026, sera. Come è stata verificata:

- **Ogni agente ha verificato il suo punto in locale** senza build (vietata ai
  singoli per non far collidere 14 build su `dist/`): simulazioni a stub,
  harness sulle regex estratte dal file vero, test jsdom, script che importano
  i moduli puri sotto Node. Le prove notevoli: 926 piani identici byte per
  byte (punto 7), 21/21 sul fuoco dei timer (punto 15), 81/81 ricette coerenti
  etichetta⇔JSON-LD (punto 8), zero falsi positivi su 583 tag (punto 10).
- **Un solo `npm run check` a valle, verde al primo colpo**: 918 piani
  cottura (con le validazioni nuove di `vale_per`/`numeri_citati`), 106
  pagine pre-renderizzate, 349 classi CSS, 30,1 MB. Gli unici avvisi sono gli
  8 WebP sorgente sopra la mediana, preesistenti.
- **Smoke test nel browser sul servito** (`npm run preview`): zero errori
  console su homepage, ricetta, categoria e piano di cottura; verificati dal
  vivo il fuoco e l'annuncio del calcolatore dosi, l'etichetta del peso nei
  due sensi, il disclaimer «per 100 g», il title stabile delle categorie, gli
  otto link del footer, la sezione approfondimento della fiorentina da 5 cm,
  `aria-pressed` sul pulsante «Fatta», il marcatore `data-ricetta` e il
  markup `srcset`/`sizes`/`width`/`height` delle schede.

Cosa resta da vedere su un browser fisico, perché il riquadro qui non
composita i frame (limite già dichiarato dalla seconda edizione):

- **le immagini lazy non caricano nel riquadro**, quindi la scelta effettiva
  delle varianti `-640` da parte del browser è verificata sul markup, non
  sulla rete: da confermare su un dispositivo con DevTools (attese `-640` sulle
  schede a ogni densità, originale sull'hero desktop);
- la **resa visiva delle emoji a 128 px** su schermi 2×/3× (possibile
  dithering da quantizzazione, atteso impercettibile);
- il **primo caricamento di una ricetta con rete lenta**: la statica deve
  restare ferma senza flash di spinner, e calcolatore/«Fatta»/grafico devono
  funzionare dopo la sostituzione;
- **NVDA vero** su: annuncio «Dosi ×N», i cambi di stato dei timer col fuoco
  che segue, i due stati del pulsante «Fatta»;
- la **tastiera vera** sui timer (anello di focus, scroll non strattonato);
- il **contrasto elevato reale di Windows**: le regole `forced-colors` sono
  misurate con l'emulazione nelle due palette (vedi la voce nella sezione
  sotto), non col tema HCM attivato dal sistema.

## Cosa questo checkup NON ha guardato

È la sezione più utile, come nella prima edizione. (Le voci barrate sono
state coperte dalla passata di chiusura.)

- **Il riquadro del browser non compositava i frame.** Due lenti su sette lo
  dichiarano: `innerWidth` tornava 0 e gli screenshot fallivano. Quindi
  **nessuna metrica di rendering reale** — niente LCP, niente CLS — e nessun
  `IntersectionObserver` è mai scattato là dentro. Le misure di peso sono
  buone (vengono dalla rete), quelle di layout no. *Ancora vero nella
  passata di chiusura: vedi «La chiusura, misurata».*
- ~~**Nessuno ha eseguito `npm run check` durante l'analisi**~~ — eseguito a
  valle della passata di chiusura, verde (e le misure su `dist/` di questo
  documento restano quelle della build delle 01:48 del 28/07).
- **Il repo della dashboard non è stato aperto**: non è qui. Tutta l'analisi
  dei dati assume che sia una sorgente semi-fidata. Se non lo fosse, i punti
  8, 9 e 10 varrebbero di più. *I punti 8, 9 e 10 ora sono chiusi lato sito;
  la fiducia nella dashboard resta un'assunzione.*
- **Il merito culinario resta fuori.** È stata verificata la coerenza interna
  dei numeri, non la loro correttezza: se 250 °C per 50 minuti siano giusti per
  quel pane non lo dice nessuno qui. *Vale anche per i testi nuovi del punto
  12: i numeri citati sono vincolati al motore dal cancello, il giudizio
  culinario no.*
- **Cosa Google abbia effettivamente deciso** non è visibile da qui: Search
  Console e il Rich Results Test non sono raggiungibili. Sul punto 12 la
  duplicazione è misurata, la conseguenza è inferita — e ora anche la
  de-duplicazione è misurata, la conseguenza resta da vedere in Search
  Console.
- ~~**La modalità a contrasto elevato di Windows** (`forced-colors`)~~ —
  **provata e corretta il 28/07/2026**, con l'emulazione forced-colors via
  protocollo di debug (Edge headless), in **entrambe le palette**. Tre difetti
  misurati e chiusi: le tre scritte col gradiente (`.testo-gradiente`: hero,
  footer, strumento in evidenza) erano **lettere trasparenti sopra niente** —
  il forced-colors toglie il gradiente di sfondo ma non il riempimento
  trasparente del testo — e ora tornano testo con `CanvasText` (bianco su
  palette scura, nero su chiara, misurate entrambe; la prima stesura usava
  `currentColor`, che segue il tema del sito e non la palette, ed era
  sbagliata proprio nel caso chiaro); l'opzione scelta del calcolatore restava
  distinta dalle altre solo da un velo d'alpha residuo (rgba(0,0,0,.15) su
  nero) e ora porta `SelectedItem`/`SelectedItemText`; punti di avanzamento e
  barra dei timer sparivano del tutto e ora hanno bordo `ButtonText` e
  riempimento `SelectedItem` — la barra misurata con un timer davvero avviato.
  Il cancello 9d non serviva toccarlo: guarda solo le media query di
  larghezza. **Resta non provato l'HCM reale di Windows** (attivato dal
  sistema, non emulato) e il comportamento su Firefox.
- ~~**`npm audit` non è stato eseguito**~~ — **eseguito il 28/07/2026**: nel
  repo del sito **4 vulnerabilità high**, tutte in vite ≤6.4.2 (path traversal
  e file read del dev server, NTLMv2 su Windows — roba del server di sviluppo,
  non del sito statico), chiuse con `npm audit fix` → **vite 6.4.3, zero
  vulnerabilità**, build verificata dopo l'aggiornamento. Versioni
  confrontate: vite 6.4.3 (il major 8.1.5 esiste e NON è stato preso: due
  major in un colpo si fanno a parte, con calma), chart.js 4.5.1 e gh-pages
  6.3.0 correnti. Fuori dal repo, `tools/` (non versionato qui) aveva
  basic-ftp critical e body-parser: ripuliti col fix non-breaking, più sharp
  0.34.5→0.35.3 (4 CVE ereditate da libvips, resize di prova verde). Restano
  lì 7 high che sono **un solo advisory** (brace-expansion, DoS) in fondo alla
  catena puppeteer-extra: si chiudono solo rompendo quella catena, e per
  tooling locale che lavora su input propri non vale il rischio oggi.

## Cosa è stato proposto e scartato

Nove difetti su ventiquattro non hanno superato lo scettico. Vale la pena
sapere quali, perché sono le ipotesi che il codice ha respinto: fra questi,
l'accusa che il pre-rendering producesse contenuto duplicato con le pagine
categoria (i testi sono diversi), che i moduli puri avessero import transitivi
sporchi (la chiusura degli import è pulita), e che il cancello sui link interni
avesse falsi negativi sulle query string (li gestisce).
