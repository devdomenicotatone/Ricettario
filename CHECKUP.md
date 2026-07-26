# Checkup — Il Ricettario (repo del sito)

> **STATO — 27/07/2026.** Primo checkup di questo repo. Il gemello,
> `tools/CHECKUP.md`, copre la dashboard: là erano aperti 26 problemi, qui i
> conti tornano molto meglio.
>
> **Il difetto grave trovato è già chiuso** (commit `e4413e6`): i dati delle
> ricette entravano nella pagina come HTML. Non è stato dedotto, è stato
> **eseguito**: un titolo con `<img src=x onerror=...>` faceva partire codice.
>
> **RESTA APERTO:** i punti 2, 3, 4, 5, 6 qui sotto. Nessuno di questi rompe
> niente e nessuno è urgente. Il punto 6 è quello che conviene fare per primo,
> perché è ciò che impedisce ai punti 2 e 5 di tornare.
>
> **Metodo:** analisi statica più esecuzione reale — sito avviato, attacchi
> provati sul renderer vero, `npm run check` a ogni passo. Nessun agente
> parallelo, quindi la copertura è quella di una lettura attenta, non di un
> setaccio: se vuoi il trattamento multiagentico che ha avuto `tools/`, va
> chiesto a parte.

---

## La cosa che questo repo fa meglio della dashboard

Vale la pena metterlo prima dei problemi, perché è il motivo per cui la lista
qui sotto è corta.

**C'è un cancello, e funziona davvero.** `scripts/verifica-build.js` non è una
formalità: controlla il `canonical`, che non rientrino redirect JavaScript, che
il JSON-LD sia parsabile e non duplicato, che **i dati strutturati
corrispondano a contenuto visibile** (ingrediente per ingrediente, passo per
passo), che ci siano H1 e meta description e che non coincidano fra loro, che la
sitemap non elenchi URL inesistenti, che non sia rientrata la doppia codifica,
che i 173 MB di PDF sorgente restino fuori e che `dist/` non sfondi i 60 MB.

**E gira da solo.** `.github/workflows/ci.yml` esegue `npm run check` su ogni
push e ogni PR, più un hook `pre-push` locale. Gli ultimi run sono tutti verdi.
La dashboard non aveva niente di tutto questo.

**I vincoli scritti nel CLAUDE.md sono rispettati**, verificati uno per uno:
`js/cottura/motore.js` e `js/cottura/html-piano.js` sono ancora puri (le uniche
occorrenze di `document` e `window` sono nei commenti che spiegano perché non
devono esserci), e non è rientrato nessun redirect JavaScript.

**I dati sono in ordine:** 80 ricette, nessun campo obbligatorio mancante, ogni
`slug` allineato al nome del file, zero mojibake. Nessun segreto nel repo. I 151
report `.qualita.md` e `.validazione.md` restano nel repo e non finiscono
online. `chart.js` (207 KB) è caricato su richiesta, non nel bundle: una pagina
ricetta scarica 62 KB di JavaScript.

---

## 1. I dati delle ricette entravano nella pagina come HTML — CHIUSO

*Commit `e4413e6`. Documentato qui perché la forma del difetto conta più della
correzione, e perché può tornare esattamente allo stesso modo.*

`js/recipe-renderer.js` interpolava titolo, sottotitolo, categoria e badge
dentro `innerHTML` senza neutralizzarli, e `js/image-utils.js` metteva titolo e
percorso dentro gli attributi `alt` e `src` allo stesso modo.

Provato sul sito vero, facendo rendere al codice vero una ricetta con il titolo
modificato:

```
imgIniettata:      true    ← il tag <img> è diventato un elemento del DOM
onerrorEseguito:   true    ← è partito codice JavaScript arbitrario
fugaDaAttributo:   true    ← la categoria è uscita dall'attributo
```

**Da dove sarebbe entrato.** I titoli delle ricette li scrive l'AI leggendo
pagine scaricate dal web; i nomi degli autori delle foto arrivano da Pexels,
Unsplash, Pixabay e Wikimedia. Serve che una di quelle stringhe finisca in un
JSON, cioè il flusso normale della dashboard.

**L'effetto garantito c'era già.** 68 campi nelle ricette contengono `&`, `"`,
`<` o `>` grezzi: «Lea & Perrins», «W < 260», «(<14 °C)», «Ceneri <0.55». Non
rompevano la pagina solo perché l'HTML, per recupero d'errore, tollera `<`
seguito da una cifra o da uno spazio. Fortuna, non progetto: `<b` non sarebbe
stato perdonato.

**Perché era difficile da vedere.** Non mancava l'escape: c'era **a metà**.
`recipe-renderer.js` aveva già la sua `escHtml` e la usava in 22 punti su 42 —
ingredienti, passi, glossario, avvisi erano protetti; l'intestazione no. A colpo
d'occhio sembrava un file a posto.

**Il segnale che avrebbe dovuto insospettire.** La stessa ricetta,
pre-renderizzata da `scripts/generate-og.js`, era protetta **ovunque**. Quindi
la pagina che vede Google era sicura e quella che vede il lettore no: due strade
per lo stesso contenuto, con due comportamenti diversi. Ogni volta che in questo
progetto succede una cosa del genere, sotto c'è una copia divergente — ed era
così anche qui: **quattro** implementazioni quasi identiche della stessa
funzione, in `credito-foto.js`, `recipe-renderer.js`, `cottura/formato.js` e
`generate-og.js`. Adesso è una sola, `js/escape.js`, importata anche da Node.

**Un secondo punto, di forma diversa:** `js/main.js` metteva nella pagina la
categoria presa **dall'URL** («La categoria "x" non esiste»). È la forma
classica della XSS riflessa, e non dipendeva da nessun dato salvato.

**Una scelta da conoscere prima di toccarla:** `escHtml` **non** scappa
l'apostrofo. Servirebbe solo per attributi delimitati da apici singoli, che qui
non esistono, e costerebbe caro: `verifica-build.js` confronta i dati
strutturati con il testo visibile e sa togliere solo le entità con nome, quindi
un `&#39;` resterebbe nel testo — e in italiano l'apostrofo è ovunque. Il
cancello comincerebbe a bocciare build sane. Se un giorno serve, va cambiato
prima `testoVisibile`.

---

## 2. Ventisei immagini pubblicate che nessuno usa

`public/images/trafile/` contiene 26 file (324 KB) che nessun file del progetto
referenzia — verificato con `grep` su `js/`, `css/`, `index.html`, `ricette/`,
`dati/` e `scripts/`. Ma `public/` viene copiato per intero in `dist/`, quindi
finiscono online: verificato, ci sono tutti e 26 sul branch `gh-pages`.

Hanno anche nomi lunghissimi con spazi e `°` dentro, che nelle URL è un guaio a
parte.

Non fanno danni: sono 324 KB e nessuno ci arriva. Ma sono la prova che
`public/` non ha un guardiano, ed è il punto 6.

---

## 3. Tubatura interna della dashboard pubblicata nei JSON

`_originalImageUrl` compare in **43 ricette su 80** dentro `dist/`, quindi
online. È l'URL della foto sorgente, che serve alla dashboard per l'indice
anti-duplicati: non ha niente a che fare con un file pubblico.

Insieme viaggiano `_generatedBy` (`"claude"`) e `_createdAt`. Quelli però
potrebbero essere una scelta di trasparenza, non una svista: dichiarare che una
ricetta è generata da un modello è una posizione legittima. Va deciso, non
corretto d'ufficio.

La regola pulita sarebbe: i campi che iniziano con `_` sono interni e
`scripts/build-recipes.js` non li copia, tranne quelli esplicitamente
dichiarati pubblici.

---

## 4. Quattro ricette con la foto e senza credito

Da quando il sito mostra i crediti sotto le foto (commit `1f0e4ab`), l'assenza
di `imageAttribution` è diventata visibile per la sua assenza. Sono:

- `focaccia/focaccia-genovese-classica`
- `lievitati/panettone-pere-cioccolato`
- `pizza/pizza-contemporanea-canotto`
- `pizza/pizza-napoletana-biga-criscito`

Non è una violazione di licenza: probabilmente sono foto tue o generate. Ma sono
quattro immagini pubblicate di cui il repo non sa dire la provenienza, e questo
è esattamente il buco da cui è nato il punto 13 del checkup della dashboard.

---

## 5. Immagini pesanti

`pinsa-romana.webp` pesa 696 KB, `og/homepage.png` 825 KB, e `dist/images` in
totale 23 MB su 27 MB di sito. Su una pagina ricetta l'immagine di copertina è
quasi tutto il peso scaricato: il JavaScript è 62 KB, la foto dieci volte tanto.

La pipeline della dashboard le converte già in WebP e AVIF, quindi il formato è
giusto — manca un tetto sulle dimensioni.

---

## 6. Il cancello ha due punti ciechi, e sono i punti 2 e 5

`verifica-build.js` controlla molto, ma non:

- **le risorse pubblicate che nessuno referenzia** — per questo le 26 immagini
  di `trafile/` sono online da chissà quando senza che nessuno se ne accorgesse;
- **il peso delle singole immagini** — controlla il totale di `dist/` (soglia 60
  MB, oggi 27), quindi un file da 700 KB passa senza una parola.

È il punto da fare per primo, non perché sia il più grave, ma perché è quello
che impedisce agli altri due di tornare. Vale la stessa logica del `CLAUDE.md`
dei tools: il controllo che se ne accorge conta più della correzione singola.

---

## Cosa questo checkup NON ha guardato

Dichiararlo serve a non far credere che il resto sia stato approvato.

- **Accessibilità oltre il minimo.** Ho verificato che nessun `<img>` sia senza
  `alt`. Non ho guardato contrasto, ordine di tabulazione, ruoli ARIA, focus
  visibile, né il comportamento con uno screen reader.
- **Il CSS.** 19 fogli, di cui `cottura.css` da 33 KB e `recipe-detail.css` da
  29 KB: non ho cercato regole morte né duplicazioni.
- **Il calcolatore di cottura nel merito.** Ho verificato che sia integro (918
  piani generati, percorso completo fino al piano nel browser) e che i due file
  puri lo siano ancora, ma non ho messo in discussione i numeri: quelli hanno un
  loro controllo in `build-cottura.js` e ancore basate su cotture reali.
- **`js/logo-intro-v2b.js`** (20 KB) e l'animazione d'ingresso: mai aperti.
- **Prestazioni misurate.** Nessun Lighthouse, nessun tempo di caricamento
  reale: i pesi qui sopra sono byte su disco, non secondi.
- **La compatibilità fra browser.** Tutto provato su un solo motore.
- **`npm audit` e il lockfile.** Fatti sulla dashboard, non qui.
- **La storia git.** 148 commit, non ho cercato cosa possa esserci finito dentro
  in passato e poi tolto.

---

## Se hai tempo per una cosa sola

**Fai il punto 6: insegna al cancello a vedere le risorse orfane.**

Il punto 1 era il più grave ed è già chiuso. Fra quelli che restano, questo è
l'unico che si ripaga da solo: le 26 immagini pubblicate per sbaglio non le ha
notate nessuno per mesi, e non sarà l'ultima volta che qualcosa entra in
`public/` e non ne esce più. Un controllo che elenca i file pubblicati che
nessuno referenzia costa poche righe accanto a quelli che ci sono già, e da quel
momento il problema non torna in silenzio.
