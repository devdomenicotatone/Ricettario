# Qualità: Focaccia Barese

## 🟡 Score Finale: 75/100

| Layer | Score | Dettaglio |
|---|---|---|
| Schema | ✅ Pass | 0 errori, 1 warning |
| Claude | 75/100 | 🟡 Da migliorare |

Ricetta ben strutturata con buona tecnica per focaccia barese tradizionale. Problemi principali nei placeholder del procedimento che creano confusione nelle quantità. Lievito leggermente alto per i tempi indicati. Sezione SOSPENSIONI ridondante da rivedere.

## 🔍 Schema Validation

- ⚠️ Categoria "Focaccia" senza sezione cottura (bakingSection/cookingSection)

## Problemi trovati

| Sev. | Area | Problema | Correzione | Fonte |
|------|------|----------|------------|-------|
| ❌ | Coerenza | Errori nei placeholder: '{patate_impasto:100}g di acqua' e '{acqua_impasto:400}g semola' e '{farina_media_impasto:250}g di acqua' - i valori non corrispondono agli ingredienti corretti | Correggere: '100g di patate', '250g semola', '150g di acqua' | 🔵 Claude |
| ❌ | Coerenza | Nel procedimento si parla di '150g tipo 0 + 250g semola' ma gli ingredienti prevedono 250g + 250g di ciascuna farina | Correggere le quantità: dopo aver usato 100g di tipo 0 nel lievitino, rimangono 150g tipo 0 + 250g semola | 🔵 Claude |
| ⚠️ | Dosi | Lievito 8g su 500g farine (1.6%) con lievitazione 4-5h totali - potrebbe essere eccessivo per tempi così lunghi | Ridurre a 5-6g per fermentazione più controllata o aumentare i tempi | 🔵 Claude |
| ⚠️ | Coerenza | SOSPENSIONI duplica identicamente il condimento già presente negli ingredienti | Rimuovere la sezione SOSPENSIONI ridondante o chiarire se serve per automatismo ricette | 🔵 Claude |
| 💡 | Temperature | Temperature ambiente 26-28°C per lievitazione potrebbero essere difficili da mantenere in casa | Aggiungere alternative: 'o 20-22°C con tempi proporzionalmente più lunghi' | 🔵 Claude |

---
*Generato: 2026-03-30T21:42:09.894Z | Pipeline: Schema → Claude → Gemini*
