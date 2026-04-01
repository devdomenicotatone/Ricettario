# Qualità: Ciabatta con Poolish

## 🟡 Score Finale: 60/100

| Layer | Score | Dettaglio |
|---|---|---|
| Schema | ❌ Fail | 2 errori, 0 warning |
| Gemini | 65/100 | 🔴 Problematica |

La ricetta ha basi tecniche eccellenti e l'idratazione matematica è perfettamente calcolata all'80% (480g acqua / 600g farina). Tuttavia, la stesura del procedimento contiene errori critici nelle dosi (es. 200g di lievito) e incongruenze importanti nei liquidi per l'impasto a mano che ne impediscono la corretta esecuzione.

## 🔍 Schema Validation

- ❌ Idratazione dichiarata 80% ma calcolata 40% (280g acqua / 700g farina). Scarto: 40%
- ❌ totalFlour dichiarato 600g ma somma farine = 700g (differenza: 100g)

## Problemi trovati

| Sev. | Area | Problema | Correzione |
|------|------|----------|------------|
| ❌ | Coerenza | Nello step 3 (Impastatrice Spirale), il testo indica di aggiungere '{acqua_poolish:200}g di lievito fresco'. Questo è un grave errore di battitura/assegnazione: la lista ingredienti prevede 5g di lievito per l'impasto finale. | Correggere il testo in '{lievito_impasto_finale:5}g di lievito fresco'. |
| ❌ | Dosi | Nello step 13 (Procedimento a mano), si indica di aggiungere 200g di acqua a 20-22°C. Tuttavia, la lista ingredienti prevede 280g di acqua per l'impasto finale. Questa discrepanza abbassa drasticamente l'idratazione reale dell'impasto a mano. | Allineare la quantità d'acqua nello step 13 ai 280g previsti dalla ricetta (riservandone una parte per le fasi finali, es. 230g subito e 50g dopo). |
| ⚠️ | Coerenza | Nello step 14 (Procedimento a mano), il testo recita 'Sciogliere 3g di lievito fresco'. La lista ingredienti ne prevede 5g per l'impasto finale. | Modificare il testo in 'Sciogliere 5g di lievito fresco' per coerenza con la lista ingredienti. |
| ⚠️ | Coerenza | Nello step 17 (Procedimento a mano), si dice 'Aggiungere gli ultimi 30g di acqua riservata'. La matematica dell'acqua nel procedimento a mano è confusa (200g totali - 50g riservati = 150g; poi si parla di 30g finali). | Riscrivere la gestione dell'acqua nel procedimento a mano basandosi sui 280g totali (es. inserire 230g in autolisi e i restanti 50g con lievito/sale). |
| 💡 | Coerenza | Nello step 3, le parole e i token sono invertiti: si legge '{olio_impasto_finale:15}g di sale e {sale_impasto_finale:15}g di olio EVO'. Le quantità (15g) sono corrette, ma la lettura risulta invertita. | Invertire i testi per farli combaciare con i token, scrivendo '15g di sale e 15g di olio EVO'. |

---
*Generato: 2026-04-01T01:45:21.094Z | Pipeline: Schema → Gemini*
