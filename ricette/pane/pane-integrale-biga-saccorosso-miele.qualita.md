# Qualità: Pane Integrale con Biga di Saccorosso e Miele

## 🟡 Score Finale: 60/100

| Layer | Score | Dettaglio |
|---|---|---|
| Schema | ❌ Fail | 1 errori, 0 warning |
| Gemini | 75/100 | 🟡 Da migliorare |

Ricetta tecnicamente molto ben strutturata (ottima gestione di biga, autolisi e bassinage per le farine integrali). Presenta però un errore matematico sull'idratazione e un fastidioso refuso testuale nell'assegnazione degli ingredienti nei passaggi chiave.

## 🔍 Schema Validation

- ❌ Idratazione dichiarata 70% ma calcolata 66% (1860g acqua / 2800g farina). Scarto: 4%

## Problemi trovati

| Sev. | Area | Problema | Correzione |
|------|------|----------|------------|
| ❌ | Dosi | L'idratazione dichiarata del 70% è errata. Calcolo reale: 1860g acqua totale (360g in biga + 1500g in impasto) / 2800g farina totale (800g in biga + 1000g integrale + 1000g saccorosso) = 66.4% ≠ 70%. | Modificare l'idratazione dichiarata al 66.4% oppure aumentare l'acqua dell'impasto finale da 1500g a 1600g per raggiungere il 70% reale. |
| ❌ | Coerenza | Nei punti 3 (Spirale) e 13 (A mano) i token e i nomi degli ingredienti sono gravemente invertiti: si legge '{acqua_impasto_finale:1500}g Caputo Integrale, {farina_integrale_impasto_finale:1000}g Caputo Saccorosso e 975g di acqua'. Questo genera enorme confusione per chi legge e omette la farina Saccorosso dal testo. | Riscrivere le frasi assegnando correttamente i token: '{farina_integrale_impasto_finale:1000}g di Caputo Integrale, {farina_caputo_saccorosso_impasto_finale:1000}g di Caputo Saccorosso e 975g di acqua (65% del totale)'. |

---
*Generato: 2026-04-01T01:46:36.874Z | Pipeline: Schema → Gemini*
