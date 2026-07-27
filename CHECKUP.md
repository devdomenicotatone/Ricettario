# Checkup — Il Ricettario (repo del sito)

> **STATO — 27/07/2026.** Primo checkup di questo repo. Il gemello,
> `tools/CHECKUP.md`, copre la dashboard: là erano aperti 26 problemi, qui i
> conti tornano molto meglio.
>
> **Il difetto grave trovato è già chiuso** (commit `e4413e6`): i dati delle
> ricette entravano nella pagina come HTML. Non è stato dedotto, è stato
> **eseguito**: un titolo con `<img src=x onerror=...>` faceva partire codice.
>
> **Chiusi anche i punti 2, 3, 5 e 6** (commit successivi). Il cancello adesso
> vede le risorse orfane, le immagini troppo pesanti e i metadati di produzione
> pubblicati — ed è stato lui a trovare 34 file inutili invece dei 26 che avevo
> contato a mano.
>
> **Il punto 3 era scritto male**, e la correzione che proponevo avrebbe rotto i
> crediti Creative Commons. Vedi lì: è il caso più istruttivo di tutto il
> documento.
>
> **Chiuso anche il punto 4**, per quanto si poteva: la provenienza di quattro
> foto è stata cercata ovunque e non esiste più. Il dato adesso lo dice invece
> di tacerlo, e il cancello non accetta più una foto senza credito.
>
> **Non resta aperto nessun punto.** Quel che manca è nella sezione "Cosa
> questo checkup NON ha guardato", che è il posto più utile del documento.
>
> **La voce più grossa di quella sezione è stata tolta.** L'accessibilità aveva
> un solo controllo qui — gli attributi `alt` — e adesso ha un checkup suo,
> [CHECKUP-ACCESSIBILITA.md](./CHECKUP-ACCESSIBILITA.md), **chiuso su tutti e
> nove i punti** più i tre avanzi. Vale la pena leggerlo per il punto 8, dove la
> diagnosi che avevo scritto era sbagliata pur avendo il numero giusto.
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
Da luglio guarda anche il CSS, che è l'unica cosa qui capace di rompersi senza
dirlo: ogni `var()` deve puntare a un token che esiste, ogni classe dichiarata
deve comparire in qualche markup, e ogni foglio deve dichiarare il layer della
sua cartella.

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

## 2. Immagini pubblicate che nessuno usa — CHIUSO

Avevo contato 26 file in `public/images/trafile/`. Quando il controllo del
punto 6 è entrato in funzione ne ha trovati **34**, per 386 KB: agli 8 che mi
erano sfuggiti — le foto degli strumenti in `public/images/strumenti/` — non
ci ero arrivato perché avevo cercato solo la cartella che già sospettavo. È
esattamente la ragione per cui un controllo automatico batte una lettura
attenta.

`public/` viene copiato per intero in `dist/`, quindi basta appoggiarci un file
perché finisca online per sempre senza che nessuno lo nomini.

Non sono stati cancellati: sono materiale preparato per pagine che non
esistono ancora (le trafile della Philips, gli strumenti che la homepage non
mostra). Sono stati spostati in **`materiale/`**, che è fuori da `public/` e
quindi non entra nella build — restano nel repo e in git. Vedi
`materiale/README.md`.

---

## 3. Metadati di produzione pubblicati — CHIUSO, ma non come avevo scritto

**Questo punto era sbagliato, ed è utile sapere perché.** Nella prima stesura
avevo scritto che `_originalImageUrl` «serve alla dashboard per l'indice
anti-duplicati: non ha niente a che fare con un file pubblico», e avevo
proposto come «regola pulita» di non copiare i campi che iniziano con `_`.

Applicare quella regola avrebbe rotto i crediti Creative Commons messi tre
commit prima. `_originalImageUrl` lo legge `js/credito-foto.js` — sia nella
pagina interattiva sia nel pre-rendering — per collegare il credito alla pagina
d'origine della foto. È un requisito di licenza, non tubatura. Stessa cosa per
`_createdAt`: regge le date, `datePublished` nel JSON-LD e `lastmod` nella
sitemap, e per 17 ricette la data vera **esiste solo nell'indice**.

Il difetto vero era un altro, e più insidioso: **l'underscore mente.** Marca
come "interni" tre campi di cui due sono contratto pubblico. È una trappola che
scatta esattamente quando qualcuno fa pulizia in buona fede — ci sono cascato
io scrivendo questo documento.

Cosa è stato fatto:

- **`_generatedBy` non viene più pubblicato.** Era in 70 ricette su 80 e non lo
  mostrava nessuna pagina: pubblicato e invisibile insieme. Resta nei file del
  repo, dove serve davvero — la dashboard lo usa per la pastiglia AI nella lista
  "Le mie Ricette" — e sparisce da `public/recipes.json` e dalle copie in
  `dist/`.
- **La regola è scritta in `vite.config.js`** (`CAMPI_INTERNI`), con accanto
  l'elenco dei due campi `_` che sono pubblici apposta e il motivo di ciascuno.
- **Il cancello la fa rispettare al contrario**: `verifica-build.js` non ha una
  lista di ciò che è vietato, ma di ciò che è **ammesso**
  (`CAMPI_INTERNI_AMMESSI`). Così un campo interno nuovo — che nasce nell'altro
  repo e che qui nessuno può prevedere — viene fermato al primo deploy invece
  che al prossimo checkup. Provato: iniettando un campo finto, il cancello lo
  nomina e spiega le due strade possibili.

---

## 4. Quattro foto senza credito — CHIUSO come si poteva

Quattro immagini pubblicate di cui il repo non sapeva dire la provenienza:
`focaccia-genovese-classica`, `panettone-pere-cioccolato`,
`pizza-contemporanea-canotto`, `pizza-napoletana-biga-criscito`.

### L'indagine, e perché è finita in nulla

Cercate in ogni posto dove poteva esserci una traccia:

| dove | esito |
|---|---|
| storia git dei JSON, versione per versione | il campo non è **mai** esistito |
| EXIF/IPTC/XMP dei JPEG originali (recuperati da git) | ripuliti: restano solo JFIF e un profilo ICC |
| `used-images.json` della dashboard (61 voci) | nessuna traccia |
| `image-cache.json` (84 voci) | le ricerche sono di **un mese dopo** il commit delle foto: non c'entrano |
| firma dimensionale (1880×1253) | condivisa con `focaccia-barese`, che è Openverse CC… |
| …ma `focaccia-barese` ha `_originalImageUrl` e `_generatedBy` | quindi è passata dalla pipeline: **non è lo stesso lotto** |
| messaggi dei commit d'origine | `panettone` arriva da «batch v2 + immagini Pexels»… |
| …ma il batch v3 «19 immagini rigenerate» **sostituisce** quella foto | quindi neanche quello vale |

Due piste sembravano solide e sono cadute entrambe al controllo successivo. È
il motivo per cui nei quattro campi non c'è scritto «Pexels»: un credito
inventato è peggio di un credito assente, perché smette di far cercare.

### Cosa è stato fatto

I quattro campi adesso dicono **`📷 Foto: provenienza non documentata`**. Non è
un modo elegante di dire "vuoto": dice che la fonte è stata cercata e non
trovata, e chi legge il file non ricomincia da capo. In pagina non compare —
`credito-foto.js` tratta i crediti che non citano nessuno come già faceva per
«Immagine esistente» e «Caricata manualmente»: un credito che non cita nessuno
non è un credito.

E soprattutto: **il cancello non accetta più il silenzio.** Una ricetta con una
foto e nessun `imageAttribution` blocca la pubblicazione. Provato togliendo il
credito alla maionese: si ferma e spiega cosa scrivere.

### Cosa resta a te

Se ti ricordi da dove vengono quelle quattro foto, sostituisci la frase con il
credito vero. Se erano tue o generate, scrivilo lo stesso: `📷 Foto:
dell'autore` o `📷 Foto: Generata da AI (…)`, come nelle altre. Finché la
provenienza è ignota resta un rischio di licenza teorico — piccolo, perché le
banche immagini che il progetto usa di più non chiedono attribuzione, ma non
azzerabile senza saperlo.

---

## 5. Immagini pesanti — CHIUSO le due sopra soglia

Il tetto adesso c'è (punto 6). Due foto lo sfondavano: `pinsa-romana.webp`
(696 KB) e `pane-pugliese-con-biga.webp` (594 KB).

**La compressione non era la leva.** Misurato: a 1800 px, anche scendendo a
qualità 70 — già visibilmente peggio — la pinsa restava a 590 KB. Sono foto con
molta texture, e ricomprimere lossy su lossy rende poco. La leva era la
dimensione: a **1500 px con qualità piena (82)** scendono a 391 e 369 KB.

Rifatti entrambi i formati per tenere la coppia coerente. Risparmio: 809 KB.

| | prima | dopo |
|---|---|---|
| pinsa-romana | 696 KB webp · 403 KB avif · 1800 px | 391 · 231 KB · 1500 px |
| pane-pugliese | 594 KB webp · 302 KB avif · 1800 px | 369 · 195 KB · 1500 px |

**Il compromesso, detto per intero:** su uno schermo ad alta densità l'immagine
di copertina passa da 1,42× a 1,18× i pixel dello spazio che occupa. Su uno
schermo normale non cambia niente; su un 1.5× o 2× è leggermente meno nitida di
prima, in cambio del 43% di byte in meno. È una scelta reversibile: gli
originali sono nella storia git.

Restano otto foto fra i 300 e i 433 KB, che il cancello segnala come avvisi
senza bloccare: sopra la mediana del sito (181 KB) ma non abbastanza da
giustificare di ritoccarle.

`og/homepage.png` resta a 825 KB ed è voluto: le immagini Open Graph le scarica
un crawler quando qualcuno condivide un link, mai un lettore che naviga. Hanno
una soglia loro, più larga.

---

## 6. I due punti ciechi del cancello — CHIUSO

`verifica-build.js` controllava molto, ma non le risorse pubblicate che nessuno
referenzia, né il peso delle singole immagini: il totale di `dist/` ha una
soglia di 60 MB, quindi una foto da 700 KB passava senza una parola.

**Risorse orfane.** Il controllo mette insieme tutto il testo pubblicato
(html, css, js, json, sitemap) e per ogni risorsa cerca il percorso, il nome
del file o il nome senza estensione. Il nome nudo serve perché i percorsi delle
foto ricetta non sono mai scritti per esteso: nascono da
`images/ricette/${cartella}/${slug}.webp`, quindi in `dist/` compare lo slug e
non il percorso. Le uniche eccezioni sono le risorse che il browser chiede da
sé — favicon, apple-touch-icon, robots, webmanifest.

**Peso delle immagini.** Avviso sopra 300 KB, errore sopra 500 KB. Le soglie
non sono inventate: alla dimensione standard del sito (1800 px) la mediana
delle 38 foto è **181 KB**, quindi 500 KB è già il triplo della norma. Le
immagini Open Graph hanno una soglia loro a 1 MB, perché le scarica solo un
crawler.

Il controllo ha giustificato sé stesso al primo giro: cercava 26 file orfani e
ne ha trovati 34.

**Una cosa che non fa, di proposito:** non guarda l'HTML *sorgente*, solo
`dist/`. Una risorsa referenziata da un file che la build non pubblica
risulterebbe orfana — non succede oggi, ma se un domani qualcosa referenzia le
immagini da fuori la build, il controllo va allargato invece che silenziato.

---

## Cosa questo checkup NON ha guardato

Dichiararlo serve a non far credere che il resto sia stato approvato.

- ~~**Accessibilità oltre il minimo.**~~ **Fatto e chiuso**, in un checkup a
  parte: [CHECKUP-ACCESSIBILITA.md](./CHECKUP-ACCESSIBILITA.md). Nove punti
  aperti, **nove chiusi**, più i tre avanzi dichiarati in fondo alle voci. La
  più grave era che la SPA cambiava pagina senza dirlo a chi usa uno screen
  reader; le più insidiose erano un pannello con l'alternativa testuale dietro
  una porta che la tastiera non apriva, e i pulsanti dei timer distrutti una
  volta al secondo mentre il conto alla rovescia correva.
  **Resta fuori la prova con un lettore vero**, e non è un dettaglio: tutto
  quello che c'è scritto lì viene dall'albero di accessibilità e dal DOM
  misurato. È il modo giusto per sapere se una struttura c'è; non è il modo per
  sapere come suona.
- ~~**Il CSS.**~~ **Fatto**, in un checkup a parte:
  [CHECKUP-CSS.md](./CHECKUP-CSS.md). Sette punti, **chiusi 1, 2 e 4** — cioè
  tutti quelli che si vedevano. Il primo era il più grave perché riguardava chi
  usa il sito: il pulsante «Fatta» e il bollino ✓ avevano un contrasto di
  3,30:1, sotto la soglia, ed erano sfuggiti al checkup sull'accessibilità
  perché quel colore compare solo dopo che una ricetta è stata segnata. Adesso è
  5,17:1. Il secondo era il più vecchio: tre `var()` puntavano a token **mai
  esistiti**, e con loro non avevano mai funzionato le sfumature dei caroselli e
  l'ombra delle frecce — oggi il progetto non ha più un `var()` che non risolve.
  Il quarto era l'ultimo visibile: la riga di colore sotto la navbar non
  cambiava con il tema, e lo stesso colore stava in altri due file fuori dal
  CSS, compreso quello che tinge la barra del browser su mobile. Il terzo era il
  più grosso in byte: 25 classi morte, un foglio intero e la scheda ricetta
  originale rimasta accanto ai suoi successori — 4,05 kB che ogni visitatore
  scaricava per non usarli, e il sito dopo è disegnato identico, verificato
  proprietà per proprietà su 2 223 elementi. Il quinto era una parola:
  `cottura.css` sta in `pages/` e dichiarava `@layer components`, cioè il layer
  che perde. Restano due punti aperti, tutti e due debito da manutenzione.
  Resta fuori anche quello che è scritto nei limiti di
  quel documento: le regole sovrascritte, le prestazioni di disegno e gli stili
  inline che i renderer scrivono da JavaScript.
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

## Cosa resta

Dei sei punti, nessuno. Ma "chiuso" non vuol dire "risolto" dappertutto: la
provenienza di quattro foto **non è stata recuperata**, è stata dichiarata
irrecuperabile dopo averla cercata in sette posti. Se un giorno te la ricordi,
sono quattro stringhe da sostituire.

Il resto del lavoro possibile su questo repo è nella sezione "Cosa questo
checkup NON ha guardato" qui sopra: prestazioni misurate davvero, compatibilità
fra browser, l'animazione d'ingresso mai aperta, `npm audit`.

Fuori da qui restano invece **due punti aperti nel checkup del CSS**: tre
blocchi duplicati e nove breakpoint. Sono debito da manutenzione, non difetti —
**nessuno dei due si vede e nessuno ci inciampa oggi**. I cinque chiusi erano il
contrasto del pulsante «Fatta» (l'ultimo problema di accessibilità rimasto sul
sito), i token che non esistevano, il colore della navbar che non seguiva il
tema, i 4 kB di CSS che non toccava nessun elemento e il layer sbagliato del
calcolatore.

La cosa più utile non era nessuno dei due, ed **è stata fatta**: i controlli
meccanici sul CSS sono nel cancello (sezione 9 di `verifica-build.js`). Ogni
`var()` deve puntare a un token definito, ogni classe dichiarata deve comparire
da qualche parte, ogni foglio deve dichiarare il layer della sua cartella — le
famiglie di difetti che qui sono nate morte e ci sono rimaste per mesi, perché
nessuno strumento del progetto era in grado di accorgersene.

L'accessibilità non è più in quella lista: ha avuto il suo checkup ed è chiusa
su tutti e nove i punti. L'unica cosa che le resta è una verifica, non una
correzione — ascoltarla con NVDA o VoiceOver.

## La lezione, che vale più della lista

Il guadagno più grande di questo giro non è venuto da una correzione, ma dal
**controllo che se ne accorge**. Cercavo 26 file inutili, il cancello ne ha
trovati 34. Le due foto pesanti le ho ricompresse solo perché lui le ha
nominate. E il campo `_generatedBy` era online da mesi senza che nessuno lo
mostrasse.

Il corollario scomodo è il punto 3: **avevo scritto io la correzione sbagliata**,
e avrebbe rotto in silenzio una conformità di licenza sistemata tre commit
prima. Non l'ha evitata la mia attenzione — l'ha evitata l'aver controllato chi
leggeva quel campo prima di toglierlo.

Quando qui qualcosa si rompe in silenzio, la domanda giusta non è «come lo
aggiusto» ma «cosa avrebbe dovuto gridare». E prima di togliere qualcosa che
sembra inutile, la domanda è «chi lo legge?», non «a cosa sembra servire».

Il checkup sull'accessibilità, che è venuto dopo, ha aggiunto il rovescio della
stessa medaglia: là il guaio non era che mancasse un controllo, era che ce
n'era uno **al contrario**. `body { overflow-x: hidden }` sembrava una rete di
sicurezza ed era una benda: teneva nascosti due pezzi di contenuto che finivano
fuori pagina, e li teneva nascosti così bene che non comparivano nemmeno come
barra di scorrimento. Toglierla ne ha fatti emergere altri due nello stesso
giorno.

E la scoperta più scomoda è arrivata dalle note «non provato». In un documento
onesto sono la parte che si legge come una formalità — invece dentro c'erano i
difetti peggiori: i pulsanti dei timer che sparivano ogni secondo stavano
dietro un «il pannello dei timer non è stato provato mentre conta». Un «non
provato» non è una nota a piè di pagina: è lavoro non fatto, e va aperto come
si apre un punto.
