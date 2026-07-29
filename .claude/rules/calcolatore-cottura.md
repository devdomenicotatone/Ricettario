---
paths:
  - "js/cottura/**"
  - "dati/cottura/**"
  - "scripts/build-cottura.js"
---

# Calcolatore di cottura

## I numeri stanno nei dati, mai nel codice

- **`dati/cottura/coefficienti.js` è l'unica fonte dei numeri.** I tagli puntano una curva per
  nome (`curva_tempo`), non se ne portano una copia: se ogni taglio di manzo avesse la sua
  tabella, ricalibrare dopo una cottura reale vorrebbe dire modificarne sei. **Se scrivi un
  numero dentro `js/cottura/`, è un bug.**
- **`dati/cottura/dispositivi.json` è il registry degli apparecchi.** Il comportamento della
  famiglia kamado sta in `js/cottura/kamado.js`; i numeri dei singoli modelli stanno nel JSON.
  Aggiungere un kamado è una voce di dati; aggiungere un tipo di barbecue è un modulo accanto a
  `kamado.js`.
- **`dati/cottura/` non finisce in `dist/`.** Non è in `public/`: viene importato dal codice,
  quindi entra nel bundle del calcolatore, che è un chunk caricato solo su `/cottura/`.

## Cose che sembrano bug e non lo sono

- **La temperatura di estrazione non scende sotto `soglia_sicurezza`.** La regola generale è
  `target − carryover`, ma sul pollo la soglia vince sull'aritmetica: su un patogeno non si
  scommette su una stima. Sta in `estrazione()` dentro `motore.js`, ed è una scelta concordata.
- **L'allarme dei timer suona al tempo MINIMO della finestra**, non al massimo. «35-45 minuti»
  vuol dire «da 35 comincia a controllare», non «pronto a 45»: un allarme sul massimo
  arriverebbe quando la carne è già oltre.
- **La curva del manzo cresce con circa s^1,45, non con s².** Applicando il quadrato
  dall'ancora dei 2,5 cm, a 6,5 cm uscirebbero 118 minuti invece dei 60-80 osservati. Le ancore
  sono esperienza reale e vincono sulla formula.
- **La stagnola è vietata nel riposo delle bistecche e corretta sul brisket.** La regola in
  `regole.js` è vincolata a `famiglia`: non «uniformarla».

## Il cancello dei dati

`npm run build:cottura` (incluso in `npm run check`) oltre a validare **genera 918 piani** —
ogni taglio per ogni dispositivo, cottura, metodo e temperatura di partenza — e controlla
monotonìe (più spesso deve voler dire più tempo), intervalli rovesciati e avvisi agganciati a
fasi inesistenti. Ha già intercettato un avviso di sicurezza che spariva su un intero metodo di
cottura: se aggiungi regole o fasi, quel controllo è ciò che se ne accorge.

Per vedere un piano senza aprire il browser:

```bash
node scripts/build-cottura.js --piano fiorentina 4.5 media_al_sangue kamado_piccolo
```
