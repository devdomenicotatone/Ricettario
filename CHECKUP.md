# Checkup — Il Ricettario (repo del sito)

> **STATO — 28/07/2026. Seconda edizione.** La prima si chiudeva dicendo:
> «nessun agente parallelo, quindi la copertura è quella di una lettura
> attenta, non di un setaccio: se vuoi il trattamento multiagentico va chiesto
> a parte». È stato chiesto. Questo è il setaccio.
>
> **Una cosa era da chiudere subito ed è chiusa** (commit `6bf1797`): **due XSS
> stored** nel calcolatore di cottura, con il payload che arrivava da
> `localStorage`. Non dedotte — **eseguite**, prima per dimostrarle e poi di
> nuovo per dimostrare che non eseguono più.
>
> **Restano 15 punti aperti**, nessuno dei quali blocca il sito. Il sedicesimo —
> diciassette commit che esistevano solo su questo portatile, mai visti dalla CI
> — è rientrato in giornata, ma per una coincidenza e non per una garanzia:
> vale la pena leggere il punto 5 lo stesso.
>
> **Metodo:** 24 agenti in parallelo su sette dimensioni — cancelli, sicurezza,
> dati, prestazioni, SEO, accessibilità, architettura — più un critico di
> completezza; ~1.000 chiamate a strumenti; ogni difetto passato da uno
> scettico incaricato di smontarlo. **Dei difetti proposti ne sono sopravvissuti
> 15 su 24**: quelli caduti sono elencati alla fine, perché sapere cosa è stato
> escluso vale quanto sapere cosa resta.
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

## 1. Le emoji pesano più di tutto il resto della pagina

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

## 2. Ogni foto è servita in una sola risoluzione

**Gravità 5.** `js/image-utils.js:29-43`, `js/html-categoria.js:108`

`buildPicture` emette due `<source>` per **formato** (AVIF, WebP) ma nessun
`srcset` per **larghezza**, nessun `sizes`, nessun `width`/`height`. La scheda
del carosello scarica lo stesso file dell'hero: `gnocchi-di-patate.avif` è
175.067 B a 1200×896 per uno slot di **290×160**, cioè 24 volte i pixel
necessari. Le 81 AVIF referenziate dalla homepage pesano **6,4 MB**.

Secondo problema, indipendente e a costo zero: lo sfondo della pagina categoria
usa `url(...webp)` ignorando l'AVIF che ha accanto.

## 3. Il calcolatore dosi si disabilita sotto le dita, e non annuncia niente

**Gravità 5.** `js/recipe-renderer.js:131`, `js/html-ricetta.js:201-211`

Con il fuoco su «Diminuisci dosi», tre clic: ×1 → ×0,75 → ×0,5 → ×0,25, e al
terzo `disabled` diventa `true` e **il fuoco cade sul `<body>`**. Da ×0,25
l'unico modo di risalire è ritraversare la pagina fino al «+».

Sullo stesso giro, la regione live `#annuncio-pagina` — che esiste e che router
e timer usano bene — **resta vuota**: il moltiplicatore, le dieci celle delle
quantità, il peso totale e i token dose dentro il procedimento cambiano tutti
in silenzio.

## 4. Il cancello «niente redirect JavaScript» riconosce una scrittura su quattro

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

## 5. Si pubblica senza passare da GitHub — RIENTRATO, ma la struttura resta

**Gravità 5 quando è stato misurato, 2 adesso.**
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

**Quello che resta è la forma, non l'istanza.** `npm run deploy` pubblica su
`gh-pages` senza chiedere niente a `main`: pubblicare e versionare sono due
gesti separati, quindi il codice online può restare per ore l'unico posto in cui
un lavoro esiste, e la CI vederlo dopo — o mai. Stavolta l'ha salvato una
coincidenza. Se serve una garanzia e non una fortuna, il posto giusto è
`deploy-ghpages.js`: rifiutare di pubblicare quando `main` è avanti al remoto,
come già rifiuta di pubblicare quando `npm run check` fallisce.

## 6. Il manifest della PWA risponde 404, in produzione

**Gravità 4.** `site.webmanifest` + `index.html:12`

`site.webmanifest` sta nella **radice** del repo, non in `public/`. Vite lo
tratta come asset di `index.html` e lo emette hashato dentro `/assets/`, **senza
riscrivere gli URL relativi che contiene**. Sul sito pubblicato entrambi gli
indirizzi delle icone rispondono 404.

È l'unico file del sito che nessun cancello legge: `verifica-build` lo
considera «sempre lecito» e non ne apre il contenuto.

## 7. Numeri tarabili scritti dentro `js/cottura/`

**Gravità 4.** `js/cottura/regole.js:67,137,242`, `motore.js`, `kamado.js`

CLAUDE.md dice testualmente: «se scrivi un numero dentro `js/cottura/`, è un
bug». Ce ne sono almeno dieci. Il caso peggiore si dimostra in cinque righe:
`regole.js:67` scrive `ctx.spessore >= 4` come letterale, mentre venti righe
sotto la regola gemella legge `SOGLIE.rotazione_su_bordi_da_cm`, che in
`coefficienti.js:277` vale esattamente `4.0`. **Oggi coincidono, ma sono due
numeri e non uno**: chi ricalibra dopo una cottura reale ne sposta uno.

## 8. Cinquanta ricette che non sono impasti dicono «Peso Totale Impasto»

**Gravità 4.** `scripts/generate-og.js:150`, `js/html-ricetta.js:222`

Il README fissa la convenzione: `hydration: 0` significa «ciò che non è un
impasto: salse, conserve, condimenti». **Cinquanta ricette su 81 hanno
`hydration: 0`, e tutte e 50 stampano «Peso Totale Impasto»** nella tabella e
spediscono a Google `recipeYield: "circa N g di impasto"`. Dal JSON-LD
pubblicato: burro chiarificato «circa 500 g di impasto», spare ribs «circa 1836
g di impasto».

## 9. I valori nutrizionali dicono due basi diverse

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

## 10. Il cancello sulle promesse alimentari ignora il femminile

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

## 11. La pagina ricetta butta il pre-rendering e se lo riscarica

**Gravità 4.** `js/recipe-renderer.js:23-32`, `js/router.js:263`

L'HTML servito contiene già 26.820 caratteri di ricetta con 28 ingredienti e 11
passaggi. Al primo caricamento il router chiama comunque `navigateTo`, e
`renderRecipe` sostituisce subito tutto con lo spinner «Caricamento ricetta…»,
poi fa `fetch` del JSON e ricostruisce. Misurato: **122 ms** in cui una pagina
completa viene rimpiazzata da un segnaposto.

## 12. Le pagine del calcolatore sono cloni al 98,3%

**Gravità 3.** `dati/cottura/coefficienti.js:293-308`

`fiorentina-5cm` contro `fiorentina-6cm`: 834 parole ciascuna, **14 diverse — e
sono tutte numeri**, nessuna frase. Similarità Jaccard su shingle da 6 parole:
83%. Il commento accanto a `PAGINE_SEO` avverte proprio contro «pagine quasi
identiche che cambiano solo un numero»: la regola è scritta e non è rispettata.

## 13. Titolo e descrizione delle categorie sono scritti due volte

**Gravità 3.** `generate-og.js:552-553` contro `js/main.js:281-283`

Il refactoring ha unificato il markup ma non i metadati. Su `/ricette/pane/` il
file servito dice «Pane — 8 Ricette — Ricettario Lab»; appena la SPA parte il
titolo diventa «Pane Artigianale — Il Ricettario». **Già divergenti in
produzione.**

## 14. Otto link del footer non portano da nessuna parte

**Gravità 3.** `index.html:311-317` e `359-365`

Sono ancore (`#home`, `#ricette`, `#strumenti`, `#chi-sono`) a sezioni che
esistono **solo in homepage**. Su 105 pagine su 106 il bersaglio non esiste:
sono 840 link morti, e da nessuna pagina interna il footer porta alla home.
Verificato cliccando: l'URL guadagna `#home`, la pagina non si muove.

## 15. I timer di cottura strappano il fuoco a ogni comando

**Gravità 3.** `js/cottura/vista-timer.js:125-129`

Clic su «Avvia»: a +112 ms i comandi diventano «Pausa | Fatta» e
`document.activeElement` è `BODY`, e ci resta. Stessa cosa su Pausa e su
Riprendi. La causa è `contenitore.innerHTML = …`, che ricostruisce il pannello
a ogni cambio di forma senza rimettere il fuoco. Per tornare al pulsante
servono **12 Tab** su 41 elementi focalizzabili.

Il checkup accessibilità aveva chiuso il caso gemello sul *battito* del timer;
questo è il caso sui *comandi*, e non era stato provato.

## 16. Il pulsante «Fatta!» non dice mai il suo stato

**Gravità 3.** `js/html-ricetta.js:114`, `js/recipe-bookmarks.js:112-118`

Spento: testo «○ Segna come fatta», `aria-label` «Segna come fatta»,
`aria-pressed` assente. Acceso: testo «✓ Fatta!», `aria-label` **ancora**
«Segna come fatta», `aria-pressed` **ancora** assente. L'`aria-label` vince sul
contenuto, quindi per chi ascolta il nome è identico nei due stati: è un
interruttore senza valore.

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

## Cosa questo checkup NON ha guardato

È la sezione più utile, come nella prima edizione.

- **Il riquadro del browser non compositava i frame.** Due lenti su sette lo
  dichiarano: `innerWidth` tornava 0 e gli screenshot fallivano. Quindi
  **nessuna metrica di rendering reale** — niente LCP, niente CLS — e nessun
  `IntersectionObserver` è mai scattato là dentro. Le misure di peso sono
  buone (vengono dalla rete), quelle di layout no.
- **Nessuno ha eseguito `npm run check` durante l'analisi**, perché agli agenti
  era vietato scrivere file. Le misure su `dist/` valgono per la build delle
  01:48 del 28/07. *(Chi scrive l'ha eseguito dopo, ed è verde.)*
- **Il repo della dashboard non è stato aperto**: non è qui. Tutta l'analisi
  dei dati assume che sia una sorgente semi-fidata. Se non lo fosse, i punti
  8, 9 e 10 varrebbero di più.
- **Il merito culinario resta fuori.** È stata verificata la coerenza interna
  dei numeri, non la loro correttezza: se 250 °C per 50 minuti siano giusti per
  quel pane non lo dice nessuno qui.
- **Cosa Google abbia effettivamente deciso** non è visibile da qui: Search
  Console e il Rich Results Test non sono raggiungibili. Sul punto 12 la
  duplicazione è misurata, la conseguenza è inferita.
- **La modalità a contrasto elevato di Windows** (`forced-colors`) resta non
  provata, ed era già il primo dei «non provati» del checkup accessibilità. Nei
  19 fogli CSS non c'è una sola occorrenza di `forced-colors`,
  `forced-color-adjust` o `prefers-contrast`.
- **`npm audit` non è stato eseguito**, né confrontate le versioni installate
  delle tre dipendenze.

## Cosa è stato proposto e scartato

Nove difetti su ventiquattro non hanno superato lo scettico. Vale la pena
sapere quali, perché sono le ipotesi che il codice ha respinto: fra questi,
l'accusa che il pre-rendering producesse contenuto duplicato con le pagine
categoria (i testi sono diversi), che i moduli puri avessero import transitivi
sporchi (la chiusura degli import è pulita), e che il cancello sui link interni
avesse falsi negativi sulle query string (li gestisce).
