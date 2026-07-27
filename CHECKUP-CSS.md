# Checkup — CSS

> **27/07/2026.** Il [CHECKUP.md](./CHECKUP.md) generale elencava il CSS fra le
> cose non guardate: «19 fogli, di cui `cottura.css` da 33 KB e
> `recipe-detail.css` da 29 KB: non ho cercato regole morte né duplicazioni».
> Questo colma quel buco.
>
> **Sette punti aperti, nessuno ancora chiuso:** questo documento è un esame,
> non un intervento. Le correzioni sono quasi tutte da una riga, ma vanno
> decise una per una.
>
> **Il più grave riguarda chi usa il sito, non chi legge il codice:** il
> pulsante «Fatta» e il bollino ✓ sulle schede hanno un contrasto di
> **3,30:1**, sotto la soglia di 4,5:1. È sfuggito al checkup
> sull'accessibilità perché compare solo dopo che una ricetta è stata segnata:
> uno stato in cui quella misura non è mai entrata.
>
> **Il più vecchio ha cinque mesi:** tre `var()` puntano a token che **non sono
> mai esistiti** nella storia del repo. Le dichiarazioni che li usano non hanno
> mai applicato niente, e con loro non hanno mai funzionato le sfumature ai
> bordi dei caroselli e l'ombra delle frecce.
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

## 1. Il pulsante «Fatta» — tre difetti in dodici righe

`recipe-detail.css:1041-1073`. È il pulsante «Segna come fatta» in cima a ogni
ricetta, più il bollino ✓ che compare sulle schede. Dodici righe di CSS con tre
cose sbagliate, di tre nature diverse.

### Il contrasto è sotto soglia

Misurato sulla pagina vera, con le transizioni disattivate perché il valore
calcolato non mentisse:

| | testo | sfondo | contrasto | soglia |
|---|---|---|---|---|
| «Fatta!» attivo | `#fff` | `#16a34a` | **3,30:1** | 4,5:1 |
| bollino ✓ sulle schede | `#fff` | `#16a34a` | **3,30:1** | 4,5:1 |

Il bollino è un carattere da 13,6 px in grassetto: non è «testo grande», quindi
la soglia resta 4,5. Scurire il verde a circa `#137a37` porta il contrasto sopra
4,5 senza cambiare la tinta in modo percepibile.

**Perché il checkup sull'accessibilità non l'ha visto:** quella misura passava
in rassegna le pagine come si presentano, e questo colore esiste solo **dopo**
che l'utente ha segnato una ricetta. Uno stato in cui non è mai entrata. È lo
stesso limite di allora, scritto in fondo a quel documento — «un solo motore, e
solo gli stati che ho attraversato».

### Il bordo dichiarato non esiste

```css
border: 2px solid var(--color-border);   /* ← token mai definito */
```

`--color-border` non è mai esistito in questo repo. Quando un `var()` non
risolve, la dichiarazione è **invalida al momento del calcolo** e la proprietà
torna al valore iniziale: `border-style: none`. Misurato sul pulsante vero,
`0px none` **in tutti e due gli stati** — e quindi anche il `border-color:
#16a34a` dello stato attivo non disegna niente, perché uno stile `none` non ha
colore da mostrare.

Il pulsante è nato con un bordo da 2 px il **30 marzo 2026** e non l'ha mai
avuto.

### Sta fuori dal layer

Il blocco `@layer pages` di `recipe-detail.css` chiude a riga 1020. Tutto il
componente — `.made-toggle`, `.made-toggle--active`, `.made-badge` — sta **dopo**,
quindi non è in nessun layer. E le regole senza layer **vincono su tutte quelle
nei layer**, qualunque sia la specificità.

Oggi non fa danno perché nessuno prova a sovrascriverlo. È il tipo di trappola
che scatta fra sei mesi, quando qualcuno scriverà una regola più specifica in
`@layer pages` e non capirà perché non si applica.

---

## 2. Tre token che non esistono, e tre cose che non si vedono

Stessa forma del difetto trovato nel checkup sull'accessibilità — lì era
`--color-surface` sul badge delle dosi — e stessa causa: **nomi presi da un altro
schema di denominazione.** Questo progetto usa `--color-surface-0…3`,
`--border-subtle/medium`, `--shadow-md/lg`. Chi ha scritto queste righe ha usato
i nomi generici di un design system diverso.

| token | dove | dal | conseguenza misurata |
|---|---|---|---|
| `--color-bg` | `category-carousel.css:116` e `:121` | 20/02/2026 | `background-image: none` |
| `--shadow-card` | `category-carousel.css:148` | 20/02/2026 | `box-shadow: none` |
| `--color-border` | `recipe-detail.css:1046` | 30/03/2026 | nessun bordo (punto 1) |

Verificato su git con `-S`: **nessuno dei tre è mai stato definito**, in nessun
commit. Non si sono rotti, non hanno mai funzionato.

### Le sfumature ai bordi dei caroselli

```css
.category-row__carousel-wrapper::before {
    background: linear-gradient(to right, var(--color-bg), transparent);
}
```

Servono a dire «c'è altro, scorri». Il resto del meccanismo funziona: sulla
homepage ci sono 9 caroselli, il JavaScript applica `has-scroll-left` o
`has-scroll-right` a **6** di loro, e ci sono 18 frecce. Ma i due pseudo-elementi
esistono larghi 60 px e non dipingono niente: misurato,
`background-image: none`. Il segnale non è mai comparso.

La correzione è una parola: `--color-surface-0`, che è lo sfondo della pagina.

### L'ombra delle frecce

`.carousel-arrow` chiede `var(--shadow-card)` a riposo e `var(--shadow-card-hover)`
al passaggio del mouse. Il secondo esiste, il primo no. Risultato misurato:
`box-shadow: none` a riposo, ombra al passaggio. La freccia non ha un'ombra che
si accentua — ne fa comparire una dal nulla.

C'è anche un token `--shadow-lg`, definito per tutti e due i temi e **mai usato
da nessuno**: probabilmente è quello che cercava.

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

Nella stessa famiglia, di gravità minore: `#16a34a` e `#15803d` (il verde del
punto 1) non sono token, quindi il «fatto» non ha un colore nel sistema; e sei
`#fff` in `recipe-detail.css`, metà dei quali sono testo sopra la foto di
copertina — legittimi, perché lì sotto c'è un gradiente scuro — e metà sono
sopra il verde del punto 1.

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

**Il punto 1, il pulsante «Fatta».** È l'unico che qualcuno subisce davvero: il
contrasto sotto soglia lo vede chi ha una vista imperfetta, ed è l'ultimo
problema di accessibilità rimasto sul sito dopo tutto il lavoro dell'altro
checkup. La correzione è un colore.

Poi il **punto 2**, che costa tre parole — `--color-surface-0`, `--shadow-lg`,
un token per il bordo — e restituisce due funzionalità che nessuno ha mai visto
funzionare.

Il **punto 3** (7 KB di CSS morto) è il più grosso in byte e il meno urgente:
non si vede, costa solo banda.

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
