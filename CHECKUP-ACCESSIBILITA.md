# Checkup — Accessibilità

> **27/07/2026.** Il [CHECKUP.md](./CHECKUP.md) generale dichiarava di non aver
> guardato l'accessibilità oltre agli attributi `alt`. Questo colma quel buco.
>
> **Chiusi i punti 1, 2 e 3** — le tre voci che riguardavano tutte le 105
> pagine: il cambio di rotta adesso viene annunciato e il focus gestito, esiste
> il landmark principale, e lo skip link porta da qualche parte. Le altre
> cinque sono ancora aperte.
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
- **Il focus si vede**, con l'anello del browser, su tutti i controlli tranne
  due (punto 7).
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

## 4. Il testo attenuato non arriva al contrasto minimo

**Chi ne soffre:** chi ha una vista ridotta, chi legge al sole, tutti su uno
schermo scadente. Serve **4,5:1**; il token `--color-text-muted` (42% di
opacità) non ci arriva in nessuno dei due temi.

| dove | scuro | chiaro |
|---|---|---|
| «2 ricette» (conteggio categoria) | **3,44** | 4,50 |
| note degli ingredienti | **3,46** | — |
| intestazioni tabella farine | **3,46** | — |
| «Riposo 20-40 min» | **3,46** | 3,55 |
| «Segna come fatta» | **3,48** | 4,10 |
| «© Ricettario Lab» | **3,48** | 4,10 |
| «Il mio setup» (etichetta sezione) | — | 4,38 |

Il tema scuro sta peggio, ed è il tema predefinito per chi ha il sistema in
scuro. Non è un caso limite: le note degli ingredienti sono contenuto della
ricetta, non decorazione.

Si corregge in un posto solo — `css/base/tokens.css`, alzando l'opacità del
token da 42% a circa 60% nel tema scuro.

---

## 5. Il badge delle dosi: 2,05:1

**Il caso peggiore trovato.** Il riquadro `×1` del calcolatore delle dosi, nella
pagina ricetta, in tema scuro:

```
testo:   oklch(0.92 0.01 75)   (chiaro)
sfondo:  oklch(0.72 0.16 55)   (ambra)
rapporto: 2,05:1   — ne servono 4,5
```

Testo chiaro su ambra chiara. In tema chiaro va meglio ma non basta (3,33:1).
È il numero che dice quante dosi stai calcolando: se non si legge, il
calcolatore non si usa.

---

## 6. Il grafico sensoriale non esiste, per chi non vede

Il pannello «Dati Tecnici & Sensoriali» disegna un radar su `<canvas>`:

```
role:            nessuno
aria-label:      nessuno
testo di ripiego: 0 caratteri
```

Un `<canvas>` senza alternativa testuale è un buco nero. Per uno screen reader
quel pannello non contiene niente.

È il difetto più facile da correggere bene, perché **i dati esistono già in
forma testuale**: `sensoryProfile.axes` è un elenco di etichette e valori da 1 a
10, e `summary` è già una descrizione scritta. Basta metterli dentro il
`<canvas>` come contenuto di ripiego, o accanto in una tabella visivamente
nascosta.

---

## 7. Due controlli senza indicatore di focus

**Chi ne soffre:** chi naviga da tastiera.

- **`.hero__search-input`** — `css/components/hero.css:148`: `outline: none`
  senza niente al suo posto, e il campo non ha nemmeno un bordo
  (`border: none`, sfondo trasparente). Ci si finisce col Tab e non si capisce
  di esserci.
- **`.nutrition-toggle__btn`** — `css/pages/recipe-detail.css:811`: è il
  `<summary>` di «Analisi Nutrizionale», quindi un controllo azionabile da
  tastiera. Ha solo uno stato `:hover`, niente per il focus.

Il terzo `outline: none` del progetto, in `category-page.css:122`, è invece
fatto bene: toglie l'anello del browser ma mette un bordo colorato più
`box-shadow`. È il modello da copiare negli altri due.

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

**I punti 4 e 5: il contrasto.**

Sono quelli che restano più gravi, e si correggono quasi tutti in un file solo,
`css/base/tokens.css`: alzare l'opacità del token del testo attenuato (oggi 42%,
sotto soglia in entrambi i temi) e scurire il fondo del badge delle dosi, che a
2,05:1 è il numero meno leggibile del sito.

Poi il punto 6, il grafico sensoriale: costa poco perché i dati esistono già in
forma testuale, e vale molto perché oggi quel pannello, per chi ascolta, non
contiene niente.

Nota su come sono andate le prime tre: la chiusura dei punti 2 e 3 ha reso il
punto 1 molto più economico di com'era stimato — il `main#contenuto` con
`tabindex="-1"` era esattamente il bersaglio che serviva al router. Vale la pena
guardare se anche fra le voci rimaste qualcuna ne sblocca un'altra.
