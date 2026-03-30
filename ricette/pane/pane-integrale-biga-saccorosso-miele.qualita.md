# Qualità: Pane Integrale con Biga di Saccorosso e Miele

## 🟡 Score Finale: 75/100

| Layer | Score | Dettaglio |
|---|---|---|
| Schema | ✅ Pass | 0 errori, 1 warning |
| Claude | 75/100 | 🟡 Da migliorare |

Ricetta tecnicamente valida con biga e gestione corretta dell'integrale, ma presenta errori significativi nei calcoli di idratazione e percentuali sale. Il procedimento è ben strutturato con ottimi consigli tecnici, ma necessita correzioni matematiche per essere affidabile.

## 🔍 Schema Validation

- ⚠️ Categoria "Pane" senza sezione cottura (bakingSection/cookingSection)

## Problemi trovati

| Sev. | Area | Problema | Correzione | Fonte |
|------|------|----------|------------|-------|
| ❌ | Dosi | Errore grave nel calcolo dell'idratazione: con 2800g farine totali e 1860g acqua (360+1500), l'idratazione è 66.4%, NON 70% come dichiarato | Correggere l'idratazione dichiarata a 66% oppure aumentare l'acqua dell'impasto finale a 1600g per raggiungere il 70% | 🔵 Claude |
| ❌ | Dosi | Percentuale di sale errata: 58g su 2800g di farine = 2.07%, non 2.1% come dichiarato | Correggere il sale a 59g per ottenere il 2.1% dichiarato | 🔵 Claude |
| ❌ | Coerenza | Nel punto 2 si cita {acqua_impasto_finale:1500}g ma poi si specifica 'SOLO 975g' per l'autolisi, creando confusione sui dosaggi | Chiarire che nell'autolisi si usano 975g dei 1500g totali di acqua | 🔵 Claude |
| ⚠️ | Coerenza | Nel punto 8 si indica peso formatura '600-{farina_caputo_saccor_biga:800}g' usando una variabile invece di un valore numerico | Sostituire con un range numerico corretto, es. '600-700g' per pezzi singoli | 🔵 Claude |
| ⚠️ | Dosi | Lievito in biga molto basso: 0.25% su farina biga per 18-24h può essere insufficiente, specialmente a 18-20°C | Considerare 3-4g di lievito per garantire fermentazione adeguata in 18-24h | 🔵 Claude |
| 💡 | Temperature | Range temperatura forno 240-270°C corretto per forno domestico, ma l'opzione B suggerisce 260°C che è al limite massimo | Specificare che 260°C richiede forno domestico di fascia alta | 🔵 Claude |

---
*Generato: 2026-03-30T21:36:52.754Z | Pipeline: Schema → Claude → Gemini*
