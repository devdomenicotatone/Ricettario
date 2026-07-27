# Checkup — Accessibilità

> **27/07/2026.** Il [CHECKUP.md](./CHECKUP.md) generale dichiarava di non aver
> guardato l'accessibilità oltre agli attributi `alt`. Questo colma quel buco.
>
> **Chiusi i punti dall'1 al 7.** Il cambio di rotta viene annunciato e il
> focus gestito, esiste il landmark principale, lo skip link porta da qualche
> parte, il contrasto è a norma ovunque — misurato **zero problemi** su
> homepage, ricetta, categoria e calcolatore, in entrambi i temi — il profilo
> sensoriale esiste anche in parole e non solo in pixel, e **tutti i 227
> controlli** delle quattro pagine mostrano dove sta il focus.
>
> **Restano aperti i punti 8 e 9.**
>
> Le voci sono in ordine di quanto pesano per chi le subisce, non di quanto
> costa sistemarle.
>
> **Metodo:** analisi statica più misure eseguite nel browser sulle pagine vere
> — homepage, ricetta, categoria, calcolatore di cottura — in **entrambi i
> temi**. Il contrasto è calcolato secondo WCAG convertendo i colori `oklch()`
> in sRGB disegnandoli su un canvas, non stimandoli. I limiti del metodo sono
> in fondo, e vanno letti: due misure su tre le ho dovute rifare perché la
> prima versione mentiva.

---

## Quello che è già a posto

Non è un contentino: è parecchio, ed è il motivo per cui la lista dei problemi
è corta e specifica.

- **`lang="it"`** sul documento, e il `viewport` non blocca lo zoom (niente
  `user-scalable=no`, niente `maximum-scale`).
- **Tutti i controlli hanno un nome accessibile.** Verificato su 129 elementi
  raggiungibili da tastiera nella sola homepage: zero senza nome. Non è
  scontato — i pulsanti a sola icona (tema, hamburger, frecce del carosello)
  hanno tutti il loro `aria-label`.
- **Tutte le immagini hanno `alt`**, e l'`alt` della foto di copertina è il
  titolo della ricetta, che è la cosa giusta.
- **Il focus si vede** su tutti i controlli: 227 misurati sulle quattro pagine,
  zero senza indicatore (punto 7, chiuso).
- **Nessun `tabindex` positivo.** L'ordine di tabulazione è quello del
  documento, che è il solo che non si rompe.
- **`prefers-reduced-motion` è rispettato** in quattro punti: animazioni
  generali, intro del logo, promo cottura, pagine del calcolatore. Il sito ha
  parecchio movimento e qualcuno ci ha pensato.
- **`aria-pressed` è mantenuto correttamente** sulle 13 opzioni del
  calcolatore: una sola a `true`, le altre a `false`.
- **Un solo bersaglio tattile** sotto i 24×24 px di WCAG 2.2.
- La tabella delle farine ha le sue intestazioni `<th>`.

---

## 1. La SPA cambiava pagina senza dirlo a nessuno — CHIUSO

**Com'era.** Cliccando una ricetta il contenuto veniva sostituito per intero e
il titolo del documento cambiava, ma per chi non vede non succedeva niente:

```
focus prima del clic:  BODY
focus dopo il clic:    BODY        ← non si era mosso
regioni live:          nessuna     ← niente da annunciare
```

Nessun indizio che il contenuto sotto fosse cambiato — e l'unico indizio era
che non c'era nessun indizio.

**Com'è adesso.** Il router fa due cose dopo ogni cambio di rotta, e nessuna
delle due basterebbe da sola:

- **sposta il focus su `main#contenuto`**, altrimenti il Tab successivo
  ripartirebbe dalla navbar a ogni navigazione;
- **scrive il titolo in una regione `aria-live="polite"`**, perché `<main>` da
  solo si annuncia come «principale» e non dice *dove* sei arrivato.

Tre dettagli che sono costati una correzione ciascuno:

- **Il primo caricamento non annuncia e non tocca il focus.** È la pagina che
  l'utente ha aperto, non un cambio di rotta: rubargli il focus lo
  disorienterebbe. Il router distingue i due casi con una bandierina.
- **La regione live sta fuori da `#app`.** Se il router la sostituisse a ogni
  navigazione, l'assistente smetterebbe di osservarla e l'annuncio andrebbe
  perso. Dev'essere sempre lo stesso elemento.
- **`setTimeout`, non `requestAnimationFrame`.** La regione va svuotata e poi
  riempita, o un titolo identico non verrebbe riannunciato. Avevo messo la
  pausa con `requestAnimationFrame`, che è legato al disegno: in una scheda che
  il browser non sta ridisegnando non scatta affatto, e l'annuncio restava
  vuoto. **Misurato** — è così che me ne sono accorto.

**Verificato** navigando davvero: clic su categoria → «Primi Piatti, pagina
caricata»; clic su ricetta → «Gnocchi di Patate, pagina caricata»; tasto
Indietro → annuncia la pagina di destinazione; ritorno sulla stessa pagina →
riannuncia. Il caricamento iniziale resta muto e lascia il focus dov'è. Dopo
ogni navigazione il Tab atterra dentro il contenuto, non sulla navbar.
Nell'albero di accessibilità compaiono ora `status`, `navigation`, `main` e
`contentinfo`.

**Cosa resta:** non l'ho ascoltato con uno screen reader vero. La struttura è
quella giusta e i valori sono misurati, ma come suoni NVDA non l'ho sentito.

---

## 2 e 3. Landmark principale e skip link — CHIUSI

Erano due facce dello stesso buco, e si sono risolti insieme.

**Com'era.** Il contenuto viveva dentro un `<div id="app">` senza `<main>`:
zero sulla homepage, sulle ricette e sul calcolatore, presente solo sulle
pagine categoria — un tipo su quattro. E lo skip link, che è il primo elemento
che si raggiunge premendo Tab, puntava a `#ricette`, un'ancora che **esiste
solo in homepage**: su 104 pagine su 105 il primo tasto premuto non faceva
niente. Peggio che non averlo, perché insegna a non usarlo.

**Com'è adesso.** Un `<main id="contenuto" tabindex="-1">` avvolge `#app` nel
guscio, quindi vale per tutte le pagine in un colpo solo, e lo skip link punta
lì.

Tre dettagli che non erano ovvi:

- **Il `<main>` avvolge `#app`, non lo sostituisce.** I marcatori del
  contenitore sono portanti in tre punti: `generate-og.js` li cerca per
  iniettare il contenuto pre-renderizzato e si ferma con «template
  incompatibile» se non li trova, e `verifica-build.js` ci estrae il testo
  visibile per confrontarlo con i dati strutturati. Rinominare quel tag li
  avrebbe rotti tutti e tre.
- **`tabindex="-1"` serve davvero.** Senza, lo skip link porta la pagina in
  fondo ma lascia il focus dov'era, e il Tab successivo riparte dalla navbar —
  cioè il salto non salta niente.
- **I due `<main>` che già c'erano sono diventati `<section>`.** Le pagine
  categoria ne emettevano uno (da `generate-og.js` e da `main.js`): annidato
  dentro quello nuovo sarebbe stato markup non valido.

**Verificato** su tutte e 105 le pagine generate: 105 con esattamente un
`<main>`, 105 con `id="contenuto"`, 105 con lo skip link che punta lì, **zero**
annidati. E provato a tastiera sul sito vero: Tab porta allo skip link, Invio
sposta il focus su `main#contenuto`, e il Tab dopo atterra dentro il contenuto
— sulle briciole di pane della ricetta, non di nuovo sulla navbar. Il landmark
sopravvive ai cambi di rotta della SPA (provati tre passaggi di fila).

**Cosa resta fuori:** manca ancora `<header>`. L'ho lasciato perché la navbar è
già un `<nav>`, che è il landmark che conta per saltarci dentro, e trasformarla
avrebbe tolto quello per aggiungere l'altro. Va fatto avvolgendo, non
rinominando.

---

## 4 e 5. Contrasto — CHIUSI, e il rimedio era più largo del sintomo

Erano tre difetti diversi che si presentavano come uno. Adesso la misura dà
**zero problemi** su homepage, pagina ricetta, pagina categoria e calcolatore
(piano di cottura compreso), in **entrambi i temi**.

### Il testo attenuato (punto 4)

Il token `--color-text-muted` non arrivava a 4,5:1 in nessuno dei due temi.
Colpiva le note degli ingredienti, le intestazioni della tabella farine, i
conteggi, il piè di pagina.

| | prima | dopo |
|---|---|---|
| tema scuro (opacità) | 42% → 3,37-3,48:1 | **55% → 4,74-5,15:1** |
| tema chiaro (lightness) | 0.55 → 3,74-4,50:1 | **0.48 → 4,99-6,32:1** |

Le percentuali non sono a occhio: ho cercato per tentativi il valore minimo che
passa su tutte e quattro le superfici del tema, e ho preso il primo con margine.

### Il badge delle dosi (punto 5) — era un refuso

Il caso peggiore del sito, 2,05:1, e la causa non era una scelta cromatica
sbagliata: `.dose-calculator__display` diceva `color: var(--color-surface)`, e
**quel token non esiste**. La dichiarazione non applicava niente, il badge
ereditava il testo chiaro della pagina e finiva su ambra chiara.

Lo stesso token inesistente era usato in altri due punti — uno rendeva
trasparente un riquadro che doveva avere uno sfondo.

| | prima | dopo |
|---|---|---|
| badge dosi, tema scuro | 2,05 | **7,58** |
| badge dosi, tema chiaro | 3,33 | **4,80** |

### Il difetto vero: nessuno aveva deciso cosa va sopra l'accento

Cercando gli altri usi del token inesistente è saltato fuori che ogni punto del
CSS aveva **indovinato** per conto suo cosa scrivere su uno sfondo accento:
`white` in tre posti, `--color-surface-0` in uno, `--color-surface-2` in
quattro, e il token inesistente in due. Alcuni azzeccavano per caso, altri no —
`white` su ambra chiara dà 2,60:1.

Adesso c'è **`--color-on-accent`**, definito una volta per tema e verificato
contro l'accento: 7,58:1 nel tema scuro, 4,80 nel chiaro (6,43 e 6,04 sugli
accenti in hover). Tutte le dichiarazioni lo usano.

### E l'accento come testo

Con quelli sistemati restava un residuo uniforme in tema chiaro: 4,38-4,39
ovunque comparisse l'accento come colore del **testo** — appena sotto la
soglia. Esisteva già un token per quel lavoro, `--color-text-accent`, ma era un
alias di `--color-accent`, quindi non serviva a niente. Adesso ha un valore suo
(0.50 invece di 0.55: da 4,97 a 6,29 su tutte le superfici), e lo usano tutte e
40 le dichiarazioni `color:` accentate del progetto.

### Il bug trovato mentre verificavo

Rimisurando è emerso qualcosa che **non era nella lista**: sulle pagine ricetta,
in tema chiaro, i link della navbar erano **bianchi su bianco — 1,16:1**.

Una regola in `recipe-detail.css` forzava logo e link a bianco quando la pagina
ha una foto di copertina, per farli leggere sopra l'immagine. Era rimasta
indietro: la navbar oggi non è più trasparente, ha sempre uno sfondo
semiopaco preso da `--color-surface-1`. In tema scuro quella superficie è scura
e il bianco reggeva (13,6:1), quindi il difetto era invisibile a chi sviluppa in
scuro — cioè al tema predefinito. Tolta la regola: **14,81:1**.

Non l'avevo trovato nel checkup perché avevo misurato la navbar solo sulla
homepage, dove sta sopra un fondo scuro.

---

## 6. Il grafico sensoriale non esisteva, per chi non vede — CHIUSO

**Com'era.** Il pannello «Dati Tecnici & Sensoriali» disegna un radar su
`<canvas>`:

```
role:            nessuno
aria-label:      nessuno
testo di ripiego: 0 caratteri
```

Un `<canvas>` senza alternativa testuale è un buco nero. Per uno screen reader
quel pannello non conteneva niente.

**Com'è adesso.** Accanto al radar c'è una tabella con gli stessi cinque assi,
marcata `solo-lettore`: invisibile agli occhi, presente nell'albero di
accessibilità. Il `<canvas>` è passato ad `aria-hidden`, o il grafico verrebbe
annunciato come elemento vuoto accanto alla sua stessa alternativa. Non è
costato una riga di dati nuovi: `sensoryProfile.axes` è già un elenco di
etichette e valori da 1 a 10.

**E il pannello adesso si può aprire.** Questa è la parte che il checkup non
aveva visto, e senza la quale il resto non serviva a niente: la testata che apre
e chiude il pannello era un `<h2>` con un gestore di clic. Non compare nella
tabulazione, quindi **il Tab non ci arriva e Invio non lo aziona**. Chi naviga
da tastiera non poteva aprire quel pannello affatto — l'alternativa testuale
sarebbe finita dietro una porta senza maniglia, perché il contenuto chiuso è
`display: none` e per gli assistenti non esiste. Adesso è un `<button>` dentro
l'`<h2>`: il titolo resta un heading, che è come chi ascolta salta di sezione in
sezione, e il pulsante porta `aria-expanded`, che è l'unico modo di sapere se il
pannello è aperto — il chevron ruotato lo dice solo a chi guarda.

**E il chevron non ruotava.** Terzo difetto, trovato mentre sistemavo il
secondo. `initSensoryChart()` prendeva il riferimento alla freccia, e subito
dopo `refreshIcons()` sostituiva ogni `<i data-lucide>` con l'`<svg>`
corrispondente: il riferimento restava appeso a un elemento staccato dal
documento, e la rotazione veniva scritta su un nodo che non era più nella
pagina. Visibile a chiunque, da mesi, e invisibile a chi legge il codice: le due
righe erano corrette, era il loro ordine a non esserlo. Adesso la freccia si
cerca al momento del clic.

**Verificato** sulla pagina vera: il Tab porta il focus sul pulsante (posizione
15 su 30 elementi tabulabili) con l'anello del browser visibile; il pannello si
apre, `aria-expanded` passa a `true` e torna a `false` alla chiusura; il radar
si disegna; nell'albero di accessibilità il canvas non compare più e al suo
posto c'è una `table` con le cinque righe («Tenuta al Morso = 5 su 10» e
compagnia) e la sua didascalia. La freccia riceve davvero `rotate(180deg)`,
questa volta sull'`<svg>` vivo.

**Cosa resta:** anche qui, nessuno screen reader vero.

Il caso non si ripete altrove: ho passato i 19 gestori di clic del progetto e i
bersagli sono tutti `<button>` veri, comprese le tredici opzioni del
calcolatore e i comandi dei timer. L'unica altra eccezione è la barra fissa del
timer, un `<div>` il cui clic serve solo a scorrere fino alla fase — i comandi
dentro sono pulsanti, quindi non si perde niente da tastiera.

---

## 7. Due controlli senza indicatore di focus — CHIUSO

**Chi ne soffriva:** chi naviga da tastiera.

**Com'era.** Due `outline: none` senza niente al loro posto.

- **`.hero__search-input`** — il campo di ricerca della homepage. Nessun bordo
  proprio (`border: none`, sfondo trasparente) e nessun contorno: ci si
  arrivava col Tab e niente diceva di esserci arrivati. C'era un
  `:focus-within` sulla pillola che lo contiene, ma diceva troppo poco — un
  alone all'**8% di opacità** sopra un fondo che ha già un'ombra accentata.
- **`.nutrition-toggle__btn`** — il `<summary>` di «Analisi Nutrizionale»,
  quindi un controllo che si apre da tastiera. Aveva solo uno stato `:hover`,
  che è l'informazione per il mouse.

**Com'è adesso.** Tutti e due usano la stessa convenzione del resto del
progetto — `outline: 2px solid var(--color-accent)` con uno scostamento — che
era già applicata in undici punti fra calcolatore, barra dei filtri e promo.

Una scelta da spiegare: sul campo di ricerca **l'anello sta sulla pillola, non
sul campo**. Il campo non ha né bordo né sfondo, quindi il suo riquadro è una
striscia dentro la pillola e un contorno lì sembrerebbe un errore di disegno.
Il bersaglio che si vede è la pillola, ed è la pillola che si illumina; il suo
bordo passa contemporaneamente da `oklch(1 0 0 / 0.06)` — praticamente
invisibile — all'accento pieno. L'`outline: none` sul campo resta, ma adesso è
legittimo: c'è un altro indicatore al suo posto, che è la sola condizione a cui
si può togliere quello del browser.

Sul `<summary>` la regola è `:focus-visible` e non `:focus`, così il contorno
non compare a chi ha appena cliccato — che sa già dov'è.

**Verificato** misurando: l'anello è `solid 2px` nel colore d'accento su
entrambi i controlli, e il contrasto contro quello che ha intorno è **7,58:1
nel tema scuro e 4,80:1 nel chiaro** — la soglia per gli elementi non testuali
è 3:1, quindi c'è margine in tutti e due i temi.

Poi ho ripassato **tutti** i controlli delle quattro pagine, non solo i due:
focus su ciascuno e confronto dello stile prima e dopo, contando come valido
anche un cambiamento su un antenato (è il caso della pillola di ricerca).

| pagina | controlli | senza indicatore |
|---|---|---|
| homepage | 129 | **0** |
| ricetta | 28 | **0** |
| categoria | 35 | **0** |
| calcolatore | 35 | **0** |

Il terzo `outline: none` del progetto, in `category-page.css:122`, era già fatto
bene e l'ho lasciato com'era: toglie l'anello del browser ma mette un bordo
colorato più `box-shadow`.

**Cosa resta fuori:** la misura del contrasto usa lo sfondo pieno che sta dietro
la pillola. Sopra ci sono due gradienti decorativi dell'hero — un alone
all'8% e delle particelle da un pixel — che il metodo non compone. Spostano il
colore di pochissimo e il margine sulla soglia è ampio, ma non è una misura sui
pixel veri.

---

## 8. A 320 px la pagina scorre in orizzontale

WCAG chiede che il contenuto stia in 320 px senza scorrimento laterale. Qui ne
servono 341:

```
logo "RicettarioLab"   199 px
pulsante tema           40 px
hamburger               40 px
due spaziature          30 px
margini laterali        32 px
                       ─────
                       341 px   in un contenuto da 320
```

Il colpevole è il logo. A 360 px rientra tutto, quindi il difetto riguarda solo
i telefoni più stretti e chi ingrandisce molto la pagina — ma 320 px è
esattamente la soglia che lo standard fissa.

---

## 9. Minori

- **La tabella degli ingredienti non ha intestazioni.** 9 righe, 2 colonne
  (nome e quantità), zero `<th>`. Uno screen reader legge i numeri senza dire di
  che colonna sono. La tabella delle farine, due riquadri più sotto, ce le ha.
- **Salti di livello nei titoli.** `h2 → h4` in homepage e nelle ricette,
  `h1 → h4` nel calcolatore. La causa è sempre la stessa: i titoli del footer
  sono `h4` senza che ci sia un `h3` prima.
- **Le 13 opzioni del calcolatore non sono un gruppo.** Nessun `fieldset`,
  nessun `role="radiogroup"`, e la domanda «Che cosa cuoci?» non è legata alle
  opzioni. Chi arriva col Tab sente tredici pulsanti e nessuna domanda.
- **Il calcolatore non ha regioni live.** È una procedura a passi: scegli,
  premi Avanti, il pannello cambia. Nessun annuncio. Vale anche per i timer,
  che contano alla rovescia in silenzio.

---

## I limiti di questo checkup

Vanno letti, perché due misure su tre le ho dovute rifare.

- **Nessuno screen reader vero.** Ho letto l'albero di accessibilità e misurato
  il DOM; non ho ascoltato NVDA, JAWS o VoiceOver. Le conclusioni sul punto 1 e
  sul punto 6 sono solide perché riguardano strutture assenti, non sfumature di
  pronuncia — ma "provato con un lettore vero" sarebbe un'altra cosa.
- **Il contrasto del testo sopra le foto non è misurabile così.** L'intestazione
  della ricetta è testo bianco sopra l'immagine, con un gradiente scuro
  sovrapposto — che è la tecnica corretta. Il mio metodo legge il colore di
  sfondo dell'elemento, non i pixel della foto, e su quei sei casi produceva
  falsi allarmi: li ho scartati, ma non posso nemmeno dichiararli a posto.
- **Due errori di misura, corretti.** La prima versione leggeva `oklch(0.72
  0.16 55)` come se fosse `rgb(0.72, 0.16, 55)` e produceva 29 problemi
  inesistenti. La seconda cambiava tema e misurava subito, catturando i colori a
  metà transizione — e il pannello del browser non componeva i frame, quindi la
  transizione non finiva mai. I numeri qui sopra vengono dalla terza versione,
  con le transizioni disattivate e un controllo di sanità sul colore di sfondo
  del `body`.
- **Un solo motore di rendering.**
- **Non provati:** zoom al 200% (è un requisito diverso dal reflow a 320 px),
  modalità a contrasto elevato di Windows (`forced-colors`), navigazione a
  comandi vocali, e il comportamento reale dei timer del calcolatore con un
  lettore attivo.

---

## Se hai tempo per una cosa sola

**Il punto 9: le voci minori.**

Sono quattro cose piccole e indipendenti — le intestazioni della tabella
ingredienti, i salti di livello nei titoli, le tredici opzioni del calcolatore
che non sono un gruppo, e il calcolatore che non annuncia i cambi di passo.
Nessuna richiede di ripensare niente, e la terza e la quarta pesano parecchio
su chi usa il calcolatore ascoltandolo.

Il punto 8, i 21 px di scorrimento a 320 px, è l'ultimo perché è il più
fastidioso da sistemare: tocca il logo della navbar.

## Una cosa che si è ripetuta quattro volte

Chiudere un punto ha reso più economico o più visibile quello dopo:

- i punti 2 e 3 hanno consegnato al punto 1 il bersaglio che gli serviva
  (`main#contenuto` focalizzabile);
- il punto 5 non era un colore sbagliato ma **un token inesistente**, e
  cercarne gli altri usi ha fatto emergere che nessuno aveva mai deciso cosa
  scrivere sopra l'accento — otto punti che tiravano a indovinare;
- rimisurare dopo la correzione ha fatto saltare fuori la navbar bianca su
  bianco, che nel checkup non c'era perché l'avevo misurata solo dove il fondo
  era scuro;
- il punto 6 sembrava un canvas senza alternativa testuale, e lo era: ma
  andando a metterla è emerso che **quel pannello non si apriva da tastiera**,
  quindi l'alternativa sarebbe finita dietro una porta senza maniglia. Avevo
  misurato il contenuto e non la strada per arrivarci. Nella stessa manciata di
  righe si nascondeva anche una freccia che non ruotava da mesi.

Morale operativa: dopo ogni correzione conviene **rimisurare tutto**, non solo
la cosa corretta — e prima di aggiungere contenuto a un pannello, controllare
che il pannello si apra.
