# Qualità: Burger Buns Professionali

## 🟡 Score Finale: 60/100

| Layer | Score | Dettaglio |
|---|---|---|
| Schema | ❌ Fail | 2 errori, 0 warning |
| Gemini | 80/100 | 🟡 Da migliorare |

La ricetta è formulata in modo eccellente, con procedure chiare per entrambi i setup e ottime note tecniche su temperature e gestione dei grassi. Necessita unicamente di una revisione matematica per l'idratazione dichiarata e il calcolo della pezzatura finale.

## 🔍 Schema Validation

- ❌ Idratazione dichiarata 62% ma calcolata 10% (50g acqua / 525g farina). Scarto: 52%
- ❌ totalFlour dichiarato 500g ma somma farine = 525g (differenza: 25g)

## Problemi trovati

| Sev. | Area | Problema | Correzione |
|------|------|----------|------------|
| ❌ | Dosi | L'idratazione dichiarata del 62% è errata. Calcolo farina totale: 100g (biga) + 150g + 250g = 500g. Calcolo liquidi base: 50g (acqua) + 220g (latte) = 270g. (270g/500g = 54%). Se si includono anche le uova (70g) nei liquidi, si ottengono 340g totali (340g/500g = 68% ≠ 62% dichiarato). | Correggere il valore dell'idratazione dichiarata al 54% (considerando solo acqua e latte) o 68% (includendo le uova), oppure ricalibrare i pesi dei liquidi per centrare il 62%. |
| ⚠️ | Dosi | Incongruenza matematica tra il peso totale dell'impasto e la pezzatura. La somma di tutti gli ingredienti genera un impasto di 935g. Nei punti 8 e 19 si indica di formare '8 porzioni da 95g', ma 8x95g = 760g, lasciando 175g di impasto non utilizzato. | Modificare il testo dello staglio: indicare 'circa 10 porzioni da 95g' oppure mantenere '8 porzioni' ma specificando 'da circa 116g ciascuna'. |

---
*Generato: 2026-04-01T01:51:15.231Z | Pipeline: Schema → Gemini*
