# Qualità: Pinsa Romana

## 🟡 Score Finale: 60/100

| Layer | Score | Dettaglio |
|---|---|---|
| Schema | ❌ Fail | 2 errori, 0 warning |
| Gemini | 65/100 | 🔴 Problematica |

Il bilanciamento degli ingredienti e il calcolo dell'idratazione (750g acqua / 1000g farine totali = 75%) sono perfetti e aderenti allo stile della Pinsa. Purtroppo, il procedimento presenta errori critici nell'uso dei token dell'acqua che suggeriscono di versare l'intera dose di acqua (750g) come 'resto' a fine impasto, portando a una miscela impossibile da lavorare.

## 🔍 Schema Validation

- ❌ Idratazione dichiarata 75% ma calcolata 71% (750g acqua / 1050g farina). Scarto: 4%
- ❌ totalFlour dichiarato 1000g ma somma farine = 1050g (differenza: 50g)

## Problemi trovati

| Sev. | Area | Problema | Correzione |
|------|------|----------|------------|
| ❌ | Coerenza | Nel 'Procedimento (Impastatrice a Spirale)' al punto 4 viene richiesto di aggiungere '{acqua_impasto:750}g acqua fredda restante'. Avendone già inserita 700g al punto 3, questo porterebbe l'acqua totale a 1450g. La lista ingredienti specifica correttamente che l'aggiunta finale deve essere di 50g. | Sostituire '{acqua_impasto:750}g' con '50g' per l'inserimento dell'acqua finale. |
| ❌ | Coerenza | Nel 'Procedimento (A Mano)' al punto 13 viene richiesto di aggiungere '{acqua_impasto:750}g acqua finali'. Considerando i 500g del punto 12 e i 200g iniziali del punto 13, l'acqua totale risulterebbe eccessiva (1450g). | Sostituire '{acqua_impasto:750}g' con '50g' per completare l'assorbimento coerentemente con i 750g totali previsti. |
| ⚠️ | Coerenza | Nel 'Procedimento (A Mano)' al punto 12 si indica di sbriciolare '3g lievito fresco', ma la lista ingredienti e il procedimento a spirale prevedono 2g di lievito. | Correggere '3g lievito fresco' in '2g' (o utilizzare il token corrispondente) per allinearsi alla lista ingredienti. |

---
*Generato: 2026-04-01T01:47:06.218Z | Pipeline: Schema → Gemini*
