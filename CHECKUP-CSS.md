# Checkup — CSS

> **27/07/2026.** Il [CHECKUP.md](./CHECKUP.md) generale elencava il CSS fra le
> cose non guardate: «19 fogli, di cui `cottura.css` da 33 KB e
> `recipe-detail.css` da 29 KB: non ho cercato regole morte né duplicazioni».
> Questo colma quel buco.
>
> **Sette punti. Chiusi 1, 2, 3, 4 e 5, restano aperti il 6 e il 7:** questo
> documento è nato come esame, non come intervento. Le correzioni sono quasi
> tutte da una riga, ma vanno decise una per una — e quattro volte su cinque la
> riga non è bastata: sotto quasi ognuno dei punti chiusi c'era qualcosa che
> l'esame non aveva visto. **Il punto 5 è l'unico che era esattamente come
> scritto:** una parola cambiata, `components` in `pages`, e le due pagine del
> calcolatore disegnate identiche.
>
> **Il punto 1 era il più grave, perché riguardava chi usa il sito e non chi
> legge il codice:** il pulsante «Fatta» e il bollino ✓ avevano un contrasto di
> **3,30:1**, sotto la soglia. Era sfuggito al checkup sull'accessibilità
> perché quel colore compare solo dopo che una ricetta è stata segnata: uno
> stato in cui quella misura non era mai entrata. Adesso è **5,17:1** in
> entrambi i temi, il verde è un token, il bordo che il pulsante dichiarava da
> marzo esiste davvero e il componente è rientrato nel suo layer.
>
> **Il punto 2 era il più vecchio, cinque mesi:** tre `var()` puntavano a token
> che **non sono mai esistiti** nella storia del repo, e con loro non hanno mai
> funzionato le sfumature ai bordi dei caroselli e l'ombra delle frecce. Adesso
> il progetto non ha più un solo `var()` che non risolve. Sotto quel punto c'era
> però anche un difetto in JavaScript, senza il quale la correzione del CSS
> sarebbe rimasta invisibile: il calcolo che accende il segnale girava una volta
> sola dentro un `requestAnimationFrame`, cioè troppo presto e mai più.
>
> **Il punto 4 era l'ultimo che si vedesse a occhio:** la riga di colore sotto
> la navbar non cambiava quando cambiavi tema, perché era un terzo colore
> scritto a mano. Adesso è l'accento, e segue il tema. Ma l'esame ne aveva
> contate sette occorrenze **perché guardava solo i fogli di stile**: lo stesso
> `#C2884D` stava anche in `index.html` e in `site.webmanifest`, cioè nel
> colore che il browser dà alla propria barra su mobile — l'unico dei tre posti
> che un lettore vede senza guardare il sito.
>
> **E l'avanzo che avevo dichiarato in fondo al punto era il pezzo peggiore.**
> L'ombra marrone della navbar, lasciata fuori perché «è un'ombra, non
> l'accento», in tema scuro **schiarisce**: quel marrone è più chiaro del fondo
> della pagina, quindi la navbar che scorre proiettava un alone, non un'ombra.
> Adesso `navbar.css` non ha più un colore scritto a mano.
>
> **Il punto 3 era il più grosso in byte e il meno urgente**, ed è stato
> l'unico chiuso cancellando invece che correggendo: 25 classi morte, un foglio
> intero e il componente `.recipe-card` originale, rimasto accanto ai suoi due
> successori. Erano 25 e non 23: **`.filter-bar` e `.recipe-card` si erano
> nascoste dentro la ricerca stessa** — la prima compare nella riga che importa
> il proprio foglio, la seconda dentro `recipe-card--compact`. Il sito, dopo,
> è disegnato identico: verificato proprietà per proprietà su 2 223 elementi.
>
> **Metodo:** analisi statica dei 19 fogli (163 KB) più misure nel browser sulle
> pagine vere. Le classi sospette non sono state dedotte: sono state contate nel
> DOM di homepage, ricetta e categoria. I contrasti sono calcolati secondo WCAG
> convertendo i colori in sRGB su un canvas. La storia dei token è verificata su
> git con `-S`, non a memoria. I limiti sono in fondo.

---

## Quello che è già a posto

Come negli altri due checkup, vale la pena dirlo prima: la lista dei problemi è
corta perché l'impianto è buono.

- **Cascade layer usati sul serio.** `tokens → reset → layout → components →
  pages → utilities`, dichiarati nell'ordine di import in `main.js`. Non è
  decorazione: è il motivo per cui in 163 KB di CSS ci sono **15 `!important`**
  in tutto, e quasi tutti legittimi — quattro nel blocco
  `prefers-reduced-motion`, uno sull'utility `.hidden`.
- **I token coprono davvero il progetto.** 64 custom property, ridefinite per
  tema in `tokens.css`, e 64 usate. Colori, spaziature, raggi, ombre, durate:
  quasi tutto passa di lì.
- **Nesting nativo, niente preprocessore.** `&:hover`, `&::before`, media query
  annidate: il CSS è leggibile per componente senza build extra.
- **Mobile-first rispettato quasi ovunque:** 34 media query `min-width` contro
  3 `max-width`.
- **`prefers-reduced-motion` in quattro fogli**, non solo in uno.
- **Nessun `@import` CSS.** I fogli li importa `main.js`, quindi Vite li unisce
  e li versiona: niente richieste a catena.
- **Il CSS del calcolatore e quello dell'intro sono caricati a parte.** Una
  pagina ricetta scarica 56 KB di CSS, non i 163 KB del sorgente; `cottura.css`
  (19 KB compilati) arriva solo su `/cottura/`.

---

## 1. Il pulsante «Fatta» — tre difetti in dodici righe — CHIUSO

`recipe-detail.css`. È il pulsante «Segna come fatta» in cima a ogni ricetta,
più il bollino ✓ che compare sulle schede. Dodici righe di CSS con tre cose
sbagliate, di tre nature diverse.

### Il contrasto era sotto soglia

Misurato sulla pagina vera, con le transizioni disattivate perché il valore
calcolato non mentisse:

| | testo | sfondo | prima | dopo | soglia |
|---|---|---|---|---|---|
| «Fatta!» attivo | bianco caldo | verde | 3,30:1 | **5,17:1** | 4,5:1 |
| bollino ✓ sulle schede | bianco caldo | verde | 3,30:1 | **5,17:1** | 4,5:1 |
| verde contro la pagina, tema scuro | | | 3,03 | **3,51** | 3:1 |
| verde contro la pagina, tema chiaro | | | 3,03 | **5,17** | 3:1 |

Il bollino è un carattere da 13,6 px in grassetto: non è «testo grande», quindi
la soglia resta 4,5.

**Perché il checkup sull'accessibilità non l'aveva visto:** quella misura
passava in rassegna le pagine come si presentano, e questo colore esiste solo
**dopo** che l'utente ha segnato una ricetta. Uno stato in cui non è mai
entrata.

**Il verde adesso è un token**, `--color-success`, con il suo `--hover` e il suo
`--color-on-success`: prima era `#16a34a` scritto a mano in cinque punti, quindi
il «fatto» non aveva un colore nel sistema.

Un dettaglio deciso e non subìto: quei token stanno in `:root` e **non** nei due
blocchi per tema, al contrario di `--color-danger`. La ragione è nell'uso.
`danger` è un colore di *testo*, e in tema scuro va schiarito per restare
leggibile; questo è un colore di *riempimento* che porta sopra di sé del testo
chiaro, quindi schiarirlo romperebbe proprio la cosa che deve garantire. Un
unico valore scuro funziona in tutti e due i temi — ed è per questo che i numeri
qui sopra sono identici a destra.

### Il bordo dichiarato non esisteva

```css
border: 2px solid var(--color-border);   /* ← token mai definito */
```

`--color-border` non è mai esistito in questo repo. Quando un `var()` non
risolve, la dichiarazione è **invalida al momento del calcolo** e la proprietà
torna al valore iniziale: `border-style: none`. Misurato sul pulsante vero,
`0px none` **in tutti e due gli stati** — e quindi anche il `border-color` dello
stato attivo non disegnava niente, perché uno stile `none` non ha colore da
mostrare. Il pulsante è nato con un bordo da 2 px il **30 marzo 2026** e non
l'ha mai avuto.

Quel bordo non è decorativo, è portante: lo sfondo del pulsante e quello della
pagina stanno a **1,05:1**, cioè sono indistinguibili. Senza bordo il controllo
non ha contorno, e l'unica cosa che lo segnala è il testo.

Adesso è `2px solid var(--color-text-muted)` — lo stesso colore del testo che
c'è dentro, quindi il pulsante resta un oggetto solo. Misurato contro il proprio
sfondo: **5,04:1** in tema scuro, **5,46** in chiaro, sopra la soglia di 3 per
il contorno di un comando.

### Stava fuori dal layer

Il blocco `@layer pages` di `recipe-detail.css` chiudeva prima del componente:
`.made-toggle`, `.made-toggle--active` e `.made-badge` stavano **dopo**, quindi
in nessun layer — e le regole senza layer vincono su tutte quelle nei layer,
qualunque sia la specificità.

Non faceva danno perché nessuno provava a sovrascriverle. Era la trappola che
scatta fra sei mesi, quando qualcuno scrive una regola più specifica in
`@layer pages` e non capisce perché non si applica. Adesso il componente sta
dentro il layer; fuori restano solo i `@keyframes`, che la cascata non tocca, e
le `::view-transition`.

**Verificato** sul pulsante vero e su un bollino istanziato nella pagina, in
entrambi i temi: bordo `2px solid` (era `0px none`), testo su verde 5,17:1 in
tutti e due i temi, e l'ombra del bollino non è più un `rgba` scritto a mano ma
un `color-mix` sul token.

---

## 2. Tre token che non esistono, e tre cose che non si vedono — CHIUSO

Stessa forma del difetto trovato nel checkup sull'accessibilità — lì era
`--color-surface` sul badge delle dosi — e stessa causa: **nomi presi da un altro
schema di denominazione.** Questo progetto usa `--color-surface-0…3`,
`--border-subtle/medium`, `--shadow-md/lg`. Chi ha scritto queste righe ha usato
i nomi generici di un design system diverso.

| token | dove | dal | conseguenza misurata | ora |
|---|---|---|---|---|
| `--color-bg` | `category-carousel.css`, 2 volte | 20/02/2026 | `background-image: none` | `--color-surface-0` |
| `--shadow-card` | `category-carousel.css` | 20/02/2026 | `box-shadow: none` | `--shadow-md` |
| `--color-border` | `recipe-detail.css` | 30/03/2026 | nessun bordo | corretto nel punto 1 |

Verificato su git con `-S`: **nessuno dei tre era mai stato definito**, in nessun
commit. Non si erano rotti, non avevano mai funzionato. Adesso il progetto non
ha più un solo `var()` che non risolve.

### Le sfumature ai bordi dei caroselli

```css
.category-row__carousel-wrapper::before {
    background: linear-gradient(to right, var(--color-bg), transparent);
}
```

Servono a dire «c'è altro, scorri». I due pseudo-elementi esistevano larghi
60 px e non dipingevano niente.

Il colore giusto è `--color-surface-0`, e non è una scelta a occhio: risalendo
dal carosello tutti i contenitori sono trasparenti e il primo fondo opaco è
quello del `body`, che è esattamente quel token. La sfumatura deve sparire in
quello, o si vedrebbe il bordo dove finisce.

### E il segnale non compariva lo stesso

Qui la correzione del token non bastava, e me ne sono accorto solo perché ho
guardato la pagina invece di fidarmi del CSS. Con la sfumatura riparata, sulle
righe che sborda*vano* davvero il segnale restava spento.

La causa è in `main.js`, ed è una vecchia conoscenza di questo progetto:

```js
requestAnimationFrame(updateScrollState);   // una volta sola, e mai più
```

Due difetti sommati. **`requestAnimationFrame` è legato al disegno**: in una
scheda che il browser non sta ridisegnando non scatta affatto — la stessa
trappola già pagata sulla regione live in `router.js`, annotata nel checkup
sull'accessibilità. E anche quando scatta, **un frame solo arriva prima che le
immagini delle schede abbiano fatto assestare la larghezza**, quindi la misura
cade su `scrollWidth === clientWidth` e conclude «non c'è niente da scorrere».
In più non ricalcolava niente al ridimensionamento della finestra, che è proprio
la cosa che decide se il carosello sborda.

Misurato prima: tre righe su quattro avevano **2208 px di contenuto in 844 di
spazio** — da scorrere eccome — e nessuna delle tre aveva la classe. Le frecce
restavano disabilitate.

Adesso c'è una misura sincrona più un `ResizeObserver` sul carosello, che copre
tutti e tre i casi: primo calcolo, immagini che arrivano, finestra
ridimensionata.

### L'ombra delle frecce

`.carousel-arrow` chiedeva `var(--shadow-card)` a riposo e
`var(--shadow-card-hover)` al passaggio del mouse: il secondo esiste, il primo
no. La freccia non aveva un'ombra che si accentua — ne faceva comparire una dal
nulla.

**Qui il checkup aveva tirato a indovinare, e aveva indovinato male.** Avevo
scritto che il token cercato era probabilmente `--shadow-lg`, definito e mai
usato. Guardando la scala, `--shadow-lg` (`0 20px 60px / 0.45` in tema scuro) è
**più grande** di `--shadow-card-hover` (`0 20px 50px / 0.4`): come stato di
riposo andrebbe al contrario. Quello giusto è `--shadow-md`, il gradino di
mezzo, che il progetto usa già in cinque punti. `--shadow-lg` resta orfano.

Una scelta da spiegare: le schede qui accanto **non** hanno ombra a riposo e la
prendono solo in hover, quindi la freccia sembrerebbe l'eccezione. Non lo è: le
schede stanno nel flusso e hanno un bordo che le delimita, la freccia è un
comando che galleggia sopra le immagini e sconfina di 12 px fuori dal carosello.
Se non si stacca dal fondo, non si legge.

**Verificato** sulla homepage vera, a 892 px e poi a 1392 senza ricaricare:
6 caroselli su 9 accendono il segnale — e i 3 che non lo accendono sono
esattamente quelli il cui contenuto ci sta — la sfumatura è opaca al 100% e larga
60 px, il colore segue il tema (`oklch(0.15 …)` in scuro, `oklch(0.97 …)` in
chiaro) e la freccia ha `0 8px 30px` a riposo contro l'ombra più grande in hover.

---

## 3. Il 4,2% del CSS non tocca nessun elemento — CHIUSO

Ho estratto le 373 classi dichiarate nei fogli e cercato ognuna in tutto il
codice — JS, HTML, JSON — tenendo conto dei quattro prefissi che il JavaScript
costruisce a runtime (`cottura-opzioni--`, `piano--`, `avviso--`,
`storico__esito--`). **23 classi non compaiono da nessuna parte.**

Non mi sono fermato all'analisi statica: le ho contate nel DOM delle pagine vere.
Su homepage, ricetta e categoria, **tutte e 23 corrispondono a zero elementi**.

> **Erano 25.** Rifacendo il conto per cancellarle, con la ricerca a confine di
> parola invece che per sottostringa, ne sono saltate fuori altre due — e sono
> le due più grosse. `.filter-bar` risultava viva perché il suo nome compare in
> `import '.../filter-bar.css'`, cioè **nella riga che carica il foglio morto**:
> si giustificava da sola. `.recipe-card` risultava viva perché è un prefisso di
> `recipe-card--compact`, che è una classe diversa. Due modi opposti di
> sbagliare la stessa ricerca, tutti e due dentro il perimetro che credevo di
> aver coperto.

| dove | byte | cosa |
|---|---|---|
| `filter-bar.css` | 1 825 | **il file intero**: `.filter-bar`, `.filter-chip`, `.recipe-card--filtered` |
| `recipe-card.css:6-140` | 3 529 | `.recipes-grid` e tutto il componente `.recipe-card*` |
| `category-page.css:323-347` | 582 | la barra delle statistiche `.category-stats*` |
| `recipe-card.css:202-212` | 472 | `.tag--time`, `.tag--difficulty` |
| `category-carousel.css:295-300` | 168 | `.category-row__empty` |
| `category-page.css:45-49` | 124 | `.category-hero__emoji` |
| `logo-intro.css:166-167` | 105 | i rami 3 e 4, che l'SVG non disegna più |
| `hero.css:189-191` | 69 | `.recipe-card--hidden` |
| `animations.css:32-34` | 62 | `.reveal-delay-4` |
| | **6 936** | **4,2% dei 163 KB** |

Tre cose meritano una parola.

**`filter-bar.css` è vivo solo nella riga che lo importa.** `main.js:14` lo
carica, e da lì in poi nessuna di quelle classi compare più. È 1,8 KB che ogni
visitatore scarica per non usarli.

**Il componente `.recipe-card` è stato sostituito senza essere rimosso.** Le
schede oggi sono `.recipe-card--compact` (sulla homepage) e `.category-card`
(nelle categorie). Il `.recipe-card` originale — immagine, corpo, titolo,
descrizione, meta, tag — è rimasto intero accanto ai suoi successori. Nota il
dettaglio: `.recipe-card--compact` non è un *modificatore* di `.recipe-card`,
è una classe a sé che comincia con lo stesso nome. Il BEM dice il contrario di
quello che succede.

**`.category-hero__emoji` si spiega da sola:**

```css
.category-hero__emoji {
    display: none;
    /* Nascosto perché rimpiazzato dall'immagine reale */
}
```

Una regola che nasconde un elemento che non esiste più, con accanto il commento
che spiega perché era stata scritta. È il fossile perfetto.

### Cancellate, e come si dimostra che non è cambiato niente

`filter-bar.css` è stato eliminato insieme alla riga che lo importava; le altre
regole sono uscite dai sei fogli che le ospitavano. Il conto dopo: **349 classi
dichiarate, zero mai usate.**

| | prima | dopo |
|---|---|---|
| sorgenti CSS | 169 851 byte | 163 553 byte |
| CSS pubblicato (i tre bundle) | 85,79 kB | **81,74 kB** |

I 6 936 byte del conto iniziale diventano 6 298 di sorgente perché al posto
delle regole ho lasciato tre commenti che spiegano cosa non c'è più. E si
risponde qui alla domanda che questo documento aveva lasciato aperta in fondo —
*quanto di quel 4,2% sopravvive alla minificazione*: **4,05 kB, il 4,7% del CSS
che ogni visitatore scarica.** Il CSS morto si comprime bene ma non sparisce.

**La verifica.** Cancellare CSS è la modifica che si nota di meno quando va
male, quindi non basta guardare le pagine. Ho preso l'impronta di come il
browser le disegna — per ogni elemento tutte le proprietà calcolate, più
`::before` e `::after`, in tutti e due i temi — prima e dopo:

| pagina | elementi | esito |
|---|---|---|
| homepage | 1 157 | identica |
| ricetta | 465 | identica |
| categoria | 304 | identica |
| piano di cottura | 297 | identica |

**2 223 elementi, nessuna differenza.**

Il metodo ha avuto un difetto suo, e si è visto solo perché il risultato era
troppo bello: la prima impronta usava `getComputedStyle(el).cssText`, che in
Blink **restituisce stringa vuota**. Confrontava soltanto tag e classi, e infatti
dava lo stesso identico numero per il tema chiaro e per quello scuro — due temi
con colori diversi non possono avere la stessa impronta. Le proprietà vanno
enumerate una per una.

**Gli stati che non si vedono standosene fermi** li ho provati a parte, perché è
lì che si nascondeva il difetto del punto 1. La ricerca in homepage: 80 schede,
«pizza» ne lascia 8 in 1 riga, una parola inesistente le nasconde tutte, e
svuotando il campo tornano 80 su 9 righe. Nasconde con l'utility `.hidden`, non
con le due classi che ho cancellato — e questo lo si sapeva già dal codice, che
è l'unica prova possibile per uno stato che nessuno scrive mai.

Una cosa notata provando: **con zero risultati la homepage non dice niente.**
Le righe spariscono e resta il vuoto. Lo stato vuoto esiste (`.category-empty`,
con «Nessuna ricetta trovata») ma lo usa solo la pagina categoria. Non c'entra
con questo punto — è un buco della ricerca, non del CSS.

**Un file che adesso mente.** In `recipe-card.css` non c'è più nessuna scheda
ricetta: restano l'intestazione di sezione e le pastiglie. Ho messo il perché in
testa al file invece di rinominarlo — un rename tocca l'import e non aggiunge
niente a chi legge — ma il nome resta una piccola trappola, della stessa
famiglia dell'underscore che marcava come «interni» due campi pubblici.

---

## 4. Colori scritti a mano che non seguono il tema — CHIUSO

51 colori letterali fuori da `tokens.css`. La maggior parte sono neri e bianchi
in ombre e gradienti, dove è legittimo. Ma sette erano **l'accento del sito
scritto a mano**, e non corrispondevano a nessuno dei due temi:

```
scritto nel CSS   rgb(194, 136, 77)   ← in navbar.css, 7 volte
accento vero, tema scuro    rgb(239, 133, 46)
accento vero, tema chiaro   rgb(188,  69, 39)
```

Un terzo colore, avanzo di una palette precedente. Stava nel bordo inferiore
della navbar (un gradiente in tre tappe, che si ripete per lo stato `.scrolled`)
e nell'alone che il logo prende al passaggio del mouse. Conseguenza: quella riga
di colore sotto la navbar **non cambiava** quando cambiavi tema, e in tema chiaro
era una tinta che non apparteneva alla pagina.

Adesso le sette tappe sono `color-mix(in oklch, var(--color-accent) N%,
transparent)`, **con le alfa di prima invariate**: 15/30/15 a riposo, 25/45/25
per `.scrolled`, 45 nell'alone del logo. Cambia il colore, non l'intensità.

### Cosa cambia davvero, misurato

Colori compositi della tappa centrale sopra il fondo vero della navbar, con le
transizioni spente, e contrasto contro quel fondo:

| | fondo navbar | bordo prima | bordo dopo | `.scrolled` dopo |
|---|---|---|---|---|
| chiaro | `#F2ECE4` | 228,206,182 · 1,30:1 | 226,186,171 · **1,51:1** | 218,160,143 · 1,90:1 |
| scuro | `#170E0A` | 75,50,29 · 1,61:1 | 88,49,20 · **1,69:1** | 120,67,26 · 2,37:1 |

Il tema scuro si muove poco: il tan di prima era già vicino all'ambra. **La
differenza si vede in chiaro**, dove la riga passa da un beige sbiadito quasi
invisibile a terracotta, ed è la stessa terracotta di tutto il resto della
pagina. Non è un requisito di contrasto — è un bordo decorativo, nessuna soglia
lo governa — ma prima non apparteneva a niente.

Verificato anche il modo in cui poteva rompersi: se `--color-accent` non
risolvesse, `border-image-source` calcolerebbe `none` e il bordo sparirebbe
senza un errore, che è precisamente il difetto del punto 2. Letto sul vero
elemento: `linear-gradient(90deg, …, oklch(0.55 0.16 35 / 0.3) 50%, …)` in
chiaro e `oklch(0.72 0.16 55 / 0.3)` in scuro, con `border-bottom: solid 2px`.

### L'ottava e la nona copia stavano fuori dal CSS

Questo esame contava le occorrenze **nei fogli di stile**, e lì erano sette. Lo
stesso `#C2884D` — `rgb(194, 136, 77)`, identico — stava anche in:

| file | campo | chi lo legge |
|---|---|---|
| `index.html` | `<meta name="theme-color">` | la barra del browser su mobile |
| `site.webmanifest` | `theme_color` | la barra del titolo della PWA installata |

È l'unico dei tre posti che un utente vede **senza guardare il sito**, ed era
anche il più inerte: un attributo statico non può seguire un tema che si cambia
con un pulsante.

**Che colore devono avere.** Non l'accento: `theme-color` serve a far continuare
la pagina dentro la cornice del browser, e la cornice sta sopra la navbar. Il
valore giusto è il fondo della navbar, misurato invece che dedotto (è
`--color-surface-1` all'88% sopra `--color-surface-0`): **`#F2ECE4`** in chiaro,
**`#170E0A`** in scuro.

**E adesso segue il tema.** I due valori stanno solo nello script anti-FOUC in
testa a `index.html`, che già decide il tema prima del primo disegno; `main.js`
chiama quella funzione quando si preme il pulsante, invece di portarsi dietro
una copia — sarebbe stato lo stesso difetto una riga più in là. Il manifest
resta a un valore solo perché è un file statico: quello chiaro, coerente con il
`background_color: #F5EDE3` che già dichiara.

Verificato cliccando il pulsante vero, non chiamando la funzione: in homepage e
su una pagina ricetta pre-renderizzata il `content` passa da `#170E0A` a
`#F2ECE4` e torna indietro, e in tutti e due i temi coincide con il fondo della
navbar misurato nello stesso istante.

### L'ombra della navbar era un'ombra al contrario

L'avevo lasciata fuori — «non è l'accento, ed è un'ombra» — e mi sbagliavo sulla
gravità, non sulla categoria. `rgba(107, 66, 38, 0.12)` in `.scrolled`, l'ultimo
colore letterale del file, **in tema scuro non è un'ombra debole: schiarisce.**
Quel marrone è più chiaro del fondo della pagina, quindi la navbar che scorre
non proiettava un'ombra, proiettava un alone.

Misurato al colmo dell'ombra, sopra il fondo della pagina:

| | pagina | prima | dopo |
|---|---|---|---|
| chiaro | 248,245,239 | 230,223,215 (scurisce) | 228,225,220 (scurisce) |
| scuro | 16,9,6 | 27,15,10 — **schiarisce** | 10,5,3 (scurisce) |

In tema chiaro non cambia quasi niente: il token fa lo stesso lavoro, neutro
invece che virato al marrone. In tema scuro cambia il segno.

Adesso è `var(--shadow-md)`, il gradino che il progetto usa già per gli elementi
che galleggiano — `oklch(0 0 0 / 0.08)` in chiaro, `/ 0.35` in scuro. **Un token
solo e non due strati sovrapposti**: nel progetto le ombre si scrivono con un
token (`--shadow-md` compare in cinque punti, sempre da solo), e lo strato di
contatto nero al 6% che c'era sotto faceva un lavoro di stacco che il bordo da
2 px qui sopra fa già.

Con questo, `navbar.css` non ha più un colore scritto a mano.

**Quello che non ho potuto provare:** la classe `.scrolled` la mette lo scroll, e
nel pannello del browser che uso la pagina non scorre — non compone i fotogrammi,
quindi `scrollTop` torna a 0. Ho misurato la regola con la classe applicata a
mano. Il codice che la accende (`navbar.classList.toggle('scrolled',
window.scrollY > 50)`) non l'ho toccato, ma «non l'ho toccato» non è «l'ho
visto funzionare».

Nella stessa famiglia c'erano `#16a34a` e `#15803d`, il verde del «fatto», e tre
dei sei `#fff` di `recipe-detail.css`: **corretti nel punto 1**, adesso sono
`--color-success` e `--color-on-success`. Gli altri tre `#fff` sono testo sopra
la foto di copertina e restano legittimi — lì sotto c'è un gradiente scuro
apposta.

---

## 5. `cottura.css` sta in `pages/` ma dichiara `@layer components` — CHIUSO

`css/pages/cottura.css` (34 KB, il foglio più grosso del progetto) apriva con
`@layer components`, mentre il suo gemello `css/pages/recipe-detail.css` apre
con `@layer pages`. Due file nella stessa cartella, due layer diversi.

Non produceva niente di visibile: le pagine ricetta e il calcolatore non
compaiono mai insieme, quindi le due serie di regole non si incontrano. Ma
`components` viene **prima** di `pages` nell'ordine, quindi qualunque regola del
layer `pages` avrebbe battuto una regola del calcolatore a parità di specificità
— e chi apre un file dentro `pages/` dà per scontato il contrario.

### Perché era davvero innocuo, misurato invece che dedotto

La prima stesura diceva «oggi non produce niente di visibile» ragionando sulle
pagine. La ragione vera è più forte e sta nei fogli:

- **Zero classi in comune.** Le 106 classi di `cottura.css` non compaiono in
  nessuno degli altri 17 fogli.
- **In `@layer pages` non c'è un solo selettore che possa toccare un elemento
  del calcolatore.** `recipe-detail.css` non ha nemmeno una regola su un
  elemento nudo: gli unici selettori senza classe sono le tappe dei
  `@keyframes` e due `::view-transition`. Non è che le regole non si
  incontrino per fortuna — non esiste proprio la regola che potrebbe vincere.
- **E `cottura.css` era comunque l'ultimo del suo layer**, perché il suo chunk
  si carica dopo `main.css`: dentro `components` vinceva già su tutti. Lo
  spostamento cambia solo il confronto con `pages`.

L'ordine dei layer non è dichiarato da nessuna parte: nasce dall'ordine di
apparizione. Letto dal CSSOM sulla pagina vera, `main.css` li apre in questa
sequenza — `tokens`, `reset`, `layout`, `components` (otto volte), `pages`,
`components`, `utilities` — e il foglio del calcolatore arriva dopo, adesso
dichiarando `pages`.

### Verifica

Stessa impronta usata per il punto 3, sulle due pagine dove `cottura.css` esiste:

| pagina | elementi | esito |
|---|---|---|
| `/cottura/` (il form) | 205 | identica |
| `/cottura/fiorentina-4cm-kamado/` (piano pre-renderizzato) | 297 | identica |

Più il percorso interattivo, che l'impronta non copre perché nasce dai clic: il
form percorso fino in fondo genera il piano (`piano piano--temperature`), il
titolo esce in Playfair Display e i pulsanti hanno i loro 56 px di altezza
minima — cioè le regole del foglio si applicano ancora tutte. Nessun errore in
console.

### E adesso non può tornare

Questo è l'unico punto che, chiudendosi, ha suggerito un controllo che nessuno
aveva chiesto: **ogni foglio deve dichiarare il layer della sua cartella**. È il
terzo della sezione 9 del cancello, e prende anche il caso peggiore della stessa
famiglia — un foglio senza nessun `@layer`, che vincerebbe su tutto. Provato al
contrario in tutti e due i modi: un file in `css/pages/` che dichiara
`components` e uno in `css/components/` che non dichiara niente fermano il
deploy, nominando il file, la riga e il layer che ci vuole.

---

## 6. Sette blocchi di dichiarazioni identici — CHIUSO

Cercati i blocchi con almeno tre proprietà uguali. Il più interessante è la
ricetta del testo con gradiente, ripetuta **in tre fogli** — `hero.css:87`,
`footer.css:37`, `tool-spotlight.css:80`:

```css
& span {
    background: var(--gradient-hero);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
}
```

Le tre copie usano lo stesso token e sono ancora identiche: qui la duplicazione
non ha ancora fatto danno. Ma sono quattro proprietà che vanno insieme o non
funzionano — se un giorno ne serve una quinta (`color` di ripiego per i browser
che non fanno il clip, per dirne una) va aggiunta in tre punti, e basta
dimenticarne uno perché quel titolo diventi invisibile: `-webkit-text-fill-color:
transparent` senza il clip che lo riempie è testo trasparente su niente.

**Adesso è una sola**, l'utility `.testo-gradiente` in `css/utilities/testo.css`,
e i tre `<span>` la portano nel markup. Sta fra le utility e non fra i componenti
perché non appartiene a nessuno dei tre: è un modo di dipingere il testo, non una
parte dell'hero. I tre span stavano tutti in `index.html`, quindi non c'è stato
niente da cambiare nel JavaScript.

**Gli altri sei restano dove sono, ed è una decisione.** Sono coincidenze fra
componenti diversi (`display: flex; align-items: center; gap`): unificarle
vorrebbe dire legare due componenti che oggi si somigliano per caso, e la prima
volta che uno dei due deve cambiare si scopre che la somiglianza non era un
contratto. Vale anche per il più sospetto,
`.recipe-card--compact__image` e `.category-card__image` con le stesse quattro
proprietà: due schede diverse che si comportano già identiche sull'immagine, non
una scheda sola scritta due volte. La differenza con il gradiente è che lì le
quattro proprietà **non funzionano separate** — è una ricetta, non una
coincidenza.

**Verifica:** homepage, 1 157 elementi in tutti e due i temi, impronta identica
prima e dopo. I tre span hanno `background-clip: text`, riempimento trasparente e
lo stesso `--gradient-hero` di prima; il footer, che compare su tutte e 105 le
pagine, porta la classe anche in quelle pre-renderizzate.

---

## 7. Tredici breakpoint diversi

```
11 × min-width: 769px      2 × min-width: 720px      1 × max-width: 768px
11 × min-width: 640px      2 × min-width: 1200px     1 × max-width: 640px
 4 × min-width: 480px      2 × min-width: 1024px     1 × max-width: 480px
                           1 × min-width: 1600px
                           1 × min-width: 2000px
```

Il progetto dichiara «Mobile-First (min-width)» in `style.css`, e per 34 media
query su 37 lo rispetta. Le tre `max-width` sono l'eccezione, e producono la
sovrapposizione classica: `max-width: 768px` e `min-width: 769px` descrivono lo
stesso confine da due lati, e `640` e `720` sono due soglie a 80 px di distanza
senza un motivo scritto da nessuna parte.

Non è un difetto, è debito: nessuno può dire a memoria quali siano i breakpoint
di questo progetto, perché non sono tre, sono nove.

---

## Se hai tempo per una cosa sola

**Non è un punto di questa lista.** I due rimasti — 6 e 7 — sono debito da
manutenzione: tre copie di una ricetta di quattro proprietà, nove breakpoint che
nessuno ricorda a memoria. Nessuno ci inciampa oggi.

Quello che valeva davvero — i **due controlli meccanici** della sezione «La
lezione» — **è stato fatto**: sono nel cancello, sezione 9 di
`verifica-build.js`. Da adesso un token che non esiste e una classe che non usa
nessuno fermano il deploy invece di aspettare il prossimo checkup.

---

## Cosa questo checkup NON ha guardato

Dichiararlo serve a non far credere che il resto sia stato approvato.

- **Le proprietà, una per una.** Ho cercato token che non risolvono, classi che
  non esistono e duplicazioni: **non** ho verificato che ogni regola faccia
  quello che dice. Una regola può essere viva, ben scritta e comunque
  sbagliata.
- **Le regole sovrascritte.** Non ho cercato dichiarazioni che vengono annullate
  da una regola successiva — cioè CSS vivo ma inutile. È un'analisi diversa,
  che ha bisogno del browser su ogni elemento, non del testo dei fogli.
- **`logo-intro.css` nel merito** (17 KB, il secondo file più grosso). Ne ho
  verificato i token e le classi, ma l'animazione d'ingresso non l'ho guardata
  girare: parte una volta per sessione e il pannello del browser che ho usato
  non compone i fotogrammi.
- **Le prestazioni del CSS.** Nessuna misura di quanto costa dipingere queste
  pagine: niente sul `backdrop-filter` della navbar, sui `color-mix()` calcolati
  a ogni regola, sui gradienti dell'hero. Byte, non millisecondi.
- **La compatibilità.** Il progetto usa nesting nativo, `@layer`, `:has()`,
  `color-mix()`, `oklch()` e container query. Sono tutte cose recenti e tutte
  provate su **un solo motore di rendering**.
- **Il CSS dentro il JavaScript.** Ci sono stili inline scritti dai renderer —
  `style="display:none"`, larghezze delle barre, `transform` dei chevron — che
  vincono su tutto il resto e che questo esame non ha inventariato.
- ~~**`dist/`.**~~ Misurato chiudendo il punto 3: dei 6 936 byte di sorgente,
  **4,05 kB arrivavano davvero al visitatore** (85,79 → 81,74 kB sui tre bundle).
- **Gli altri 50 colori letterali fuori dai fogli.** Chiudendo il punto 4 ho
  cercato `#C2884D` in tutto il repo e ho trovato le due copie in `index.html` e
  `site.webmanifest`. La stessa ricerca **non** l'ho ripetuta per gli altri
  valori scritti a mano: se un altro di quei 50 ha un gemello fuori dal CSS, non
  lo so.

---

## La lezione

Nei due checkup precedenti il filo era: quello che si rompe in silenzio ha
bisogno di qualcosa che gridi. Qui il filo è più stretto, ed è una proprietà
specifica del CSS.

**Il CSS non ha errori.** Un `var()` che punta a un token inesistente non è un
errore di sintassi: il foglio si carica, la pagina si disegna, la console tace,
e la dichiarazione semplicemente non fa niente. Una classe che non esiste più
nel markup non produce nemmeno un avviso. Sono tre le cose trovate qui che sono
nate morte e sono rimaste tali per mesi — non per disattenzione, ma perché
**nessuno strumento di questo progetto era in grado di accorgersene.**

Il cancello (`npm run check`) controlla i dati, i link, i JSON-LD, il peso delle
immagini e le risorse orfane. **Adesso controlla anche il CSS**, con i due
controlli meccanici che questa sezione chiedeva — sezione 9 di
`verifica-build.js`: *ogni `var(--x)` deve avere una `--x` definita*, e *ogni
classe dichiarata deve comparire da qualche parte nel codice*. Sarebbero bastati
a intercettare i punti 1, 2 e 3 il giorno in cui sono nati, invece che cinque
mesi dopo.

**Ce n'è un terzo, che questa sezione non aveva previsto:** *ogni foglio deve
dichiarare il layer della sua cartella*. Lo ha suggerito il punto 5 chiudendosi
— `css/pages/cottura.css` che apriva con `@layer components` — e copre anche il
caso peggiore della stessa famiglia, un foglio che non dichiara **nessun** layer:
le regole fuori dai layer battono tutte quelle dentro qualunque sia la
specificità, ed è esattamente quello che era successo al pulsante «Fatta» nel
punto 1. `css/base/` resta fuori dall'elenco perché è l'unica cartella con due
layer per scelta.

Guardano i sorgenti in `css/`, non `dist/`: il problema si vede prima della
build e il messaggio nomina il file e la riga veri invece di un bundle con
l'hash nel nome. Tre cose che hanno richiesto una riga in più, e senza le quali
il controllo mentiva:

- **Commenti, stringhe e `url()` neutralizzati prima di leggere.** I commenti di
  questo progetto nominano di proposito i token e le classi che sono stati
  tolti — è così che si spiega perché non ci sono più — e un
  `url(../images/x.png)` fa sembrare `.png` un selettore di classe. Vengono
  sostituiti con spazi e non a vuoto, perché i numeri di riga devono restare
  quelli veri.
- **Confine di parola, non sottostringa.** È l'errore che aveva nascosto le due
  voci più grosse del punto 3.
- **Le righe di `import` di un foglio non contano come uso.** Era l'altro.

Provati al contrario, iniettando un token inesistente, uno con valore di
ripiego e una classe morta: il primo è un errore che ferma il deploy, il secondo
un avviso (il ripiego vince sempre, quindi la pagina è giusta ma il token è
sbagliato), la terza un errore con file e riga. Un token nominato dentro un
commento non conta, e `url(...)` non produce più classi finte.

**Un corollario venuto fuori chiudendo i punti.** Tutte e tre le volte la
correzione scritta qui era giusta e insufficiente: sotto il contrasto del punto 1
c'erano un bordo che non esisteva e un componente fuori dal layer, sotto i token
del punto 2 c'era un `requestAnimationFrame` che rendeva invisibile la correzione
appena fatta, e sotto le sette occorrenze del punto 4 ce n'erano altre due.
Un esame statico vede la riga sbagliata; non vede se, riparata quella riga, la
cosa funziona davvero. **La verifica dopo la correzione non è una formalità: è
dove si trova la metà del difetto.**

**E il punto 4 aggiunge una variante.** Lì la correzione era completa — dentro il
perimetro dell'esame. Le altre due copie di quel colore non erano nascoste: erano
in `index.html` e in `site.webmanifest`, cioè fuori dai file `.css`, e questo
documento aveva contato solo dentro. Un numero preciso — «sette volte» — suona
come una misura completa, e invece è completa solo rispetto a dove hai guardato.
**Quando un valore è un colore, un URL o un nome, il perimetro giusto non è mai
un'estensione di file: è il repo.** Cercarlo dappertutto costa un comando.

**Il punto 3 ha dato la stessa lezione dall'altro capo.** Lì il perimetro era
giusto — tutto il repo — ed era sbagliato il modo di cercare: una ricerca per
sottostringa fa passare per viva una classe che compare solo nella riga che
importa il proprio foglio, e una che è il prefisso di un'altra. Due entrate su
25, cioè il 60% dei byte, invisibili **dentro la misura stessa**. Quando il
numero che esce da un controllo è la ragione per cui non guardi oltre, quel
controllo va provato su un caso di cui conosci la risposta.

**Poi il punto 4 ha ripetuto una lezione del checkup sull'accessibilità**, quella
che dice che un «non provato» non è una nota a piè di pagina ma lavoro non fatto.
Qui la nota era anche più rassicurante: avevo scritto io, chiudendo il punto, che
l'ombra marrone restava fuori perché «non è l'accento ed è un'ombra» — cioè
l'avevo guardata e archiviata. Bastava misurarla per vedere che in tema scuro
schiarisce invece di scurire. **Le righe che ti scrivi da solo per giustificare
un'esclusione vanno riaperte come si riapre un punto:** sono il posto dove
l'attenzione si è fermata di proposito.
