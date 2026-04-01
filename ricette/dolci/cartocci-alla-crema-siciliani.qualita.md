# Qualità: Cartocci alla Crema Siciliani

## 🟡 Score Finale: 60/100

| Layer | Score | Dettaglio |
|---|---|---|
| Schema | ❌ Fail | 3 errori, 0 warning |
| Gemini | 85/100 | 🟡 Da migliorare |

Ricetta tecnicamente molto solida. Le dosi dell'impasto, le temperature di frittura, i tempi e il calcolo dell'idratazione (250g/500g = 50%) sono perfetti. Manca solo l'inserimento degli ingredienti della farcitura nell'elenco principale.

## 🔍 Schema Validation

- ❌ "ingredientGroups": Gruppo "Per la Farcitura" senza items
- ❌ Idratazione dichiarata 50% ma calcolata 45% (250g acqua / 550g farina). Scarto: 5%
- ❌ totalFlour dichiarato 500g ma somma farine = 550g (differenza: 50g)

## Problemi trovati

| Sev. | Area | Problema | Correzione |
|------|------|----------|------------|
| ❌ | Coerenza | Il gruppo ingredienti 'Per la Farcitura' è completamente vuoto, ma la sezione 'CONDIMENTO/SALSA' del procedimento (step 19, 20 e 21) richiede numerosi ingredienti con grammature specifiche per le creme. | Aggiungere nell'elenco ingredienti sotto 'Per la Farcitura' le due opzioni citate nel testo: per la crema pasticcera (1 litro di latte, scorza di limone, 8 tuorli, 200g zucchero, 90g maizena) e per la crema di ricotta (500g ricotta, 150g zucchero a velo, 80g gocce di cioccolato), oltre allo zucchero semolato/a velo per la finitura. |

---
*Generato: 2026-04-01T01:54:56.616Z | Pipeline: Schema → Gemini*
