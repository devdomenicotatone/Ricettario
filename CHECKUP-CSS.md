# Checkup — CSS

> **27/07/2026.** Il [CHECKUP.md](./CHECKUP.md) generale elencava il CSS fra le
> cose non guardate: «19 fogli, di cui `cottura.css` da 33 KB e
> `recipe-detail.css` da 29 KB: non ho cercato regole morte né duplicazioni».
> Questo colma quel buco.
>
> **Sette punti. Chiusi i primi due, restano aperti gli altri cinque:** questo
> documento è nato come esame, non come intervento. Le correzioni sono quasi
> tutte da una riga, ma vanno decise una per una — e due volte su due la riga
> non è bastata: sotto ognuno dei primi due punti c'era un secondo difetto che
> l'esame non aveva visto.
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

## 3. Il 4,2% del CSS non tocca nessun elemento

Ho estratto le 373 classi dichiarate nei fogli e cercato ognuna in tutto il
codice — JS, HTML, JSON — tenendo conto dei quattro prefissi che il JavaScript
costruisce a runtime (`cottura-opzioni--`, `piano--`, `avviso--`,
`storico__esito--`). **23 classi non compaiono da nessuna parte.**

Non mi sono fermato all'analisi statica: le ho contate nel DOM delle pagine vere.
Su homepage, ricetta e categoria, **tutte e 23 corrispondono a zero elementi**.

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

---

## 4. Colori scritti a mano che non seguono il tema

51 colori letterali fuori da `tokens.css`. La maggior parte sono neri e bianchi
in ombre e gradienti, dove è legittimo. Ma sette sono **l'accento del sito
scritto a mano**, e non corrispondono a nessuno dei due temi:

```
scritto nel CSS   rgb(194, 136, 77)   ← in navbar.css, 7 volte
accento vero, tema scuro    rgb(239, 133, 46)
accento vero, tema chiaro   rgb(188,  69, 39)
```

È un terzo colore, avanzo di una palette precedente. Sta nel bordo inferiore
della navbar (un gradiente in tre tappe, che si ripete per lo stato `.scrolled`)
e nell'alone che il logo prende al passaggio del mouse. Conseguenza: quella
riga di colore sotto la navbar **non cambia** quando cambi tema, e in tema
chiaro è una tinta che non appartiene alla pagina.

Non è un problema di contrasto — è un bordo decorativo — ma è esattamente il
tipo di copia che questo progetto ha già pagato altrove: il valore vive in due
posti e uno dei due non segue più l'altro.

Nella stessa famiglia c'erano `#16a34a` e `#15803d`, il verde del «fatto», e tre
dei sei `#fff` di `recipe-detail.css`: **corretti nel punto 1**, adesso sono
`--color-success` e `--color-on-success`. Gli altri tre `#fff` sono testo sopra
la foto di copertina e restano legittimi — lì sotto c'è un gradiente scuro
apposta.

---

## 5. `cottura.css` sta in `pages/` ma dichiara `@layer components`

`css/pages/cottura.css` (34 KB, il foglio più grosso del progetto) apre con
`@layer components`, mentre il suo gemello `css/pages/recipe-detail.css` apre
con `@layer pages`. Due file nella stessa cartella, due layer diversi.

Oggi non produce niente di visibile: le pagine ricetta e il calcolatore non
compaiono mai insieme, quindi le due serie di regole non si incontrano. Ma
`components` viene **prima** di `pages` nell'ordine, quindi qualunque regola del
layer `pages` batterebbe una regola del calcolatore a parità di specificità — e
chi apre un file dentro `pages/` dà per scontato il contrario.

---

## 6. Sette blocchi di dichiarazioni identici

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
dimenticarne uno.

Gli altri sei sono coincidenze innocue fra componenti diversi
(`display: flex; align-items: center; gap`), tranne uno che vale la pena
guardare: `.recipe-card--compact__image` e `.category-card__image` hanno le
stesse quattro proprietà, cioè due schede diverse che si comportano già
identiche sull'immagine.

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

**Il punto 4**, l'accento scritto a mano nella navbar: adesso che i primi due
sono chiusi, è l'unico rimasto che si veda a occhio — quella riga di colore
sotto la navbar non cambia quando cambi tema.

Il **punto 3** (7 KB di CSS morto) è il più grosso in byte e il meno urgente:
non si vede, costa solo banda. Il **5** e il **6** sono debito da manutenzione,
non difetti: nessuno oggi ci inciampa.

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
- **`dist/`.** Ho guardato i sorgenti. Quanto di quel 4,2% sopravviva alla
  minificazione non l'ho misurato.

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
immagini e le risorse orfane. Non controlla il CSS. I due controlli che
servirebbero sono meccanici e si scrivono in poche righe: *ogni `var(--x)` deve
avere una `--x` definita*, e *ogni classe dichiarata deve comparire da qualche
parte nel codice*. Sarebbero bastati a intercettare i punti 1, 2 e 3 il giorno
in cui sono nati, invece che cinque mesi dopo.

**Un corollario venuto fuori chiudendo i primi due punti.** Tutte e due le volte
la correzione scritta qui era giusta e insufficiente: sotto il contrasto del
punto 1 c'erano un bordo che non esisteva e un componente fuori dal layer, e
sotto i token del punto 2 c'era un `requestAnimationFrame` che rendeva
invisibile la correzione appena fatta. Un esame statico vede la riga sbagliata;
non vede se, riparata quella riga, la cosa funziona davvero. **La verifica dopo
la correzione non è una formalità: è dove si trova la metà del difetto.**
