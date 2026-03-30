# Qualità: Cartocci alla Crema Siciliani

## 🟡 Score Finale: 60/100

| Layer | Score | Dettaglio |
|---|---|---|
| Schema | ❌ Fail | 1 errori, 0 warning |
| Claude | 75/100 | 🟡 Da migliorare |

Ricetta con buone basi tecniche per i cartocci siciliani ma presenta errori di template e coerenza. La sezione farcitura è vuota e ci sono riferimenti errati a ingredienti non presenti. Il dosaggio del lievito potrebbe essere insufficiente per questo tipo di dolce fritto.

## 🔍 Schema Validation

- ❌ Gruppo "Per la Farcitura" senza ingredienti

## Problemi trovati

| Sev. | Area | Problema | Correzione | Fonte |
|------|------|----------|------------|-------|
| ❌ | Coerenza | Nel step 6 si riferisce a '{semola_impasto:50}g' ma negli ingredienti non è presente semola - sembra un errore di template | Correggere con il peso corretto (presumibilmente 50g) e rimuovere il riferimento alla semola | 🔵 Claude |
| ❌ | Coerenza | Nel step 1 si fa riferimento a '{acqua_impasto:250}g' con sintassi di template invece del semplice '250g di acqua' | Sostituire con '250g di acqua' per chiarezza | 🔵 Claude |
| ❌ | Gruppi | La sezione 'Per la Farcitura' è completamente vuota ma dovrebbe contenere gli ingredienti per la crema siciliana | Aggiungere gli ingredienti per la crema (ricotta, zucchero a velo, canditi, pistacchi, ecc.) o rimuovere la sezione | 🔵 Claude |
| ⚠️ | Dosi | Percentuale lievito molto bassa (1.4% su farina) per un dolce lievitato che deve gonfiare in frittura | Considerare di aumentare a 10-12g (2-2.4%) per garantire migliore lievitazione | 🔵 Claude |
| ⚠️ | Coerenza | Nel step 2 si menziona 'acqua rimanente' ma tutto il quantitativo (250g) è già stato usato nel step 1 per sciogliere il lievito | Specificare che si usa tutta l'acqua con il lievito sciolto, non 'acqua rimanente' | 🔵 Claude |
| 💡 | Setup | Setup 'Impastatrice a spirale + A mano' corretto per dolci lievitati, coerente con il procedimento descritto | Nessuna correzione necessaria | 🔵 Claude |

---
*Generato: 2026-03-30T21:41:41.417Z | Pipeline: Schema → Claude → Gemini*
