---
paths:
  - "ricette/**/*.json"
  - "scripts/build-recipes.js"
---

# Ricette: tag, profilo sensoriale, codifica

## I tag che promettono qualcosa a chi mangia

I `tags` non li scrive questo repo: arrivano dalla dashboard, cambiano modello nel tempo, e da
qui finiscono nelle `keywords` dei dati strutturati — cioè a Google. «coreano» sbagliato è un
fastidio; **«senza glutine» sbagliato è un'informazione su cui una persona celiaca decide se
può mangiare una cosa**. È già successo: la Mayak Gyeran è stata pubblicata con quel tag ed è
costruita sulla salsa di soia, che il grano ce l'ha.

`controllaPromesse` in `scripts/build-recipes.js` boccia la build quando un tag promette
**«senza glutine», «senza lattosio», «vegano» o «vegetariano»** e fra gli ingredienti c'è
qualcosa che lo smentisce. Le liste delle fonti sono tre e si compongono: carne e pesce
smentiscono sia vegano sia vegetariano, uova e latticini solo vegano.

- **Per una promessa condizionata si usa la parentesi**: `senza glutine (con tamari)`, come fa
  `condimenti/salsa-teriyaki-originale`. Un tag con parentesi passa, perché dice al lettore a
  quale condizione la promessa vale. È quella la via d'uscita, **non allargare le esenzioni**.
- **Le esenzioni guardano il NOME dell'ingrediente, mai la nota**, ed è una cicatrice: la prima
  versione leggeva anche le note, e la nota che spiega «per la versione senza glutine usa
  tamari» bastava ad assolvere una ricetta che monta salsa di soia normale. Un cancello che si
  disinnesca leggendo la prosa che descrive il problema non protegge niente.
- **Quello che sta FUORI dalle liste è deciso quanto quello che sta dentro.** Il parmigiano e
  gli altri stagionati non sono fra le fonti di lattosio (tracce sotto la soglia dichiarabile:
  una ricetta «senza lattosio» col parmigiano è corretta), uova e latticini non smentiscono
  «vegetariano», e `salam[ei]` è scritto stretto perché `salam\w*` prenderebbe la «salamoia».
  Le radici invece vogliono `\w*`: scritto `\b(acciugh)\b` il plurale «Acciughe» non combacia,
  e una ricetta con le alici passava per vegetariana — l'ha trovato il test negativo, non
  l'occhio.

L'analisi qualità della dashboard **non** copre questo: nei suoi 83 referti le aree sono
Coerenza, Dosi, Setup, Tempi, Temperature. Di allergeni non parla mai.

## Gli assi del profilo sensoriale: il set della famiglia, con deroga

Il profilo ha **cinque assi**, e sono tutto il profilo. La regola ha due metà, servono entrambe:

1. **Si parte dagli assi che la famiglia usa già.** I 40 condimenti hanno gli stessi cinque
   (*Sapidità / Acidità / Cremosità / Dolcezza / Intensità Aromatica*), il pane i suoi, pizza e
   focaccia ne condividono un terzo. Non è pigrizia: assi uguali sono **ciò che rende
   confrontabili due ricette**. Guardando due radar sai che la maionese sta a 9 di cremosità e
   il chimichurri a 2, e quel 2 è informazione, non un difetto.
2. **Si sostituisce un asse solo quando la ricetta non può esprimerlo affatto**, cioè quando
   varrebbe 0 o 1. Lì non stai posizionando la ricetta rispetto a nessuno: stai buttando un
   quinto del profilo per dire «non si applica», e sul radar disegni una punta schiacciata.

**Un valore basso su un asse condiviso colloca la ricetta; un valore a zero dice che l'asse non
parla di quel cibo.**

Da dove nasce: gli assi venivano da una tabella `categoria → cinque assi` nella dashboard, e
«Secondi Piatti», non avendo la sua, usava quella del **pane** — delle costine di maiale sono
state valutate su «Alveolatura Mollica» (zero) per tre mesi in produzione. Aggiungere righe
alla tabella non basta, perché quella categoria tiene insieme costine e uova marinate. Ma
nemmeno «assi su misura per ogni ricetta» va bene: si perde la confrontabilità dentro la
famiglia più numerosa del sito. La misura ha deciso: **3 ricette su 80 violavano la regola, il
62% era a posto** — rigenerare tutto avrebbe riscritto 46.000 caratteri di note di degustazione
per sistemare quattro assi.

Quando sostituisci un asse, **scegli il tratto leggendo le note di degustazione della
ricetta**: nelle tre sistemate a mano il tratto giusto era già descritto lì dentro — «priva di
dolcezza propria» sulla pasta madre, «dominato da note di nocciola tostata» sul burro
chiarificato — e mancava solo l'asse che lo rappresentasse. Così grafico e testo dicono la
stessa cosa. Riusa un'etichetta già in uso nel sito quando esiste.

`build-recipes.js` **avvisa** (non blocca: una ricetta con un asse fiacco si pubblica) quando
un asse è ≤1. Se ne vedi uno, la correzione è **cambiare l'asse, non alzare il numero**.

## Codifica

I JSON delle ricette sono **UTF-8 senza BOM**. Sette file sono già stati salvati una volta come
Latin-1 e ri-codificati, producendo `metÃ ` al posto di `metà` — testo corrotto visibile sul
sito per mesi. `npm run verifica` ora lo intercetta.
