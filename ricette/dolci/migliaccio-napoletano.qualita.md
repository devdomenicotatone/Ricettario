# Qualità: Migliaccio Napoletano

## 🟡 Score Finale: 60/100

| Layer | Score | Dettaglio |
|---|---|---|
| Schema | ❌ Fail | 4 errori, 0 warning |
| Gemini | 90/100 | 🟢 Buona |

Ricetta eccellente e perfettamente bilanciata. Dosi, temperature (200°C per 60 min) e procedimento rispecchiano fedelmente la tradizione del Migliaccio Napoletano. L'idratazione non è stata calcolata in quanto non applicabile (si tratta di una pastella dolce). Necessaria solo la correzione di alcuni errori di mappatura nei token del testo.

## 🔍 Schema Validation

- ❌ Campo obbligatorio mancante: "hydration" — Idratazione % (0 per dolci/pasta senza calcolo)
- ❌ Campo obbligatorio mancante: "targetTemp" — Temperatura target impasto (es. "24-26°C")
- ❌ Campo obbligatorio mancante: "fermentation" — Descrizione tempi fermentazione
- ❌ Campo obbligatorio mancante: "totalFlour" — Farina totale in grammi (base per ricalcolo dosi)

## Problemi trovati

| Sev. | Area | Problema | Correzione |
|------|------|----------|------------|
| ⚠️ | Coerenza | Nel punto 2 del procedimento, il token associato all'acqua fa riferimento al latte: 'acqua ({latte_composto:500}g)'. Questo sballerà il calcolatore delle dosi nel frontend. | Modificare il token in {acqua_composto:500}g. |
| ⚠️ | Coerenza | Nel punto 2 del procedimento, il token associato al sale fa riferimento alla vaniglia: 'sale ({baccello_di_vaniglia_composto:2}g)'. | Modificare il token in {sale_fino_composto:2}g. |
| ⚠️ | Coerenza | Nel punto 3 del procedimento, il token associato allo zucchero fa riferimento alla semola: 'zucchero ({semola_composto:250}g)'. | Modificare il token in {zucchero_semolato_composto:250}g. |

---
*Generato: 2026-04-01T01:55:22.638Z | Pipeline: Schema → Gemini*
