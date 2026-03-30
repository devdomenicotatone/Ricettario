# Qualità: Focaccia Genovese Classica

## 🟡 Score Finale: 72/100

| Layer | Score | Dettaglio |
|---|---|---|
| Schema | ✅ Pass | 0 errori, 1 warning |
| Claude | 72/100 | 🟡 Da migliorare |

La ricetta presenta errori critici nella referenziazione degli ingredienti che la rendono praticamente inutilizzabile. Le dosi sono tecnicamente valide ma l'idratazione dichiarata non corrisponde ai calcoli. Il setup è corretto per focaccia, temperature e tempi sono appropriati per forno casalingo.

## 🔍 Schema Validation

- ⚠️ Categoria "Focaccia" senza sezione cottura (bakingSection/cookingSection)

## Problemi trovati

| Sev. | Area | Problema | Correzione | Fonte |
|------|------|----------|------------|-------|
| ❌ | Dosi | Errore grave nei riferimenti ingredienti: '{olio_evo_salamoia_e_fini:60}g tipo 0' invece di '60g tipo 0'. Questo pattern si ripete in tutto il procedimento rendendo la ricetta inutilizzabile | Correggere tutti i riferimenti: usare i valori numerici diretti invece delle variabili malformate | 🔵 Claude |
| ❌ | Dosi | Errore nel calcolo farine biga: procedimento indica '140g manitoba + 60g tipo 0 = 200g' ma gli ingredienti sono 700g Manitoba + 300g Tipo 0 | Correggere le proporzioni: per 200g totali servono 140g Manitoba (700g × 0.2) e 60g Tipo 0 (300g × 0.2) | 🔵 Claude |
| ❌ | Dosi | Idratazione dichiarata 75% non corrisponde al calcolo: 720g acqua totale / 1000g farina totale = 72% | Correggere l'idratazione dichiarata da 75% a 72% oppure adeguare le dosi d'acqua | 🔵 Claude |
| ⚠️ | Dosi | Lievito totale 15g (1.5%) è alto per una lievitazione di 5-6h totali, rischio di sovralievitazione | Ridurre il lievito totale a 8-10g (0.8-1%) per i tempi indicati | 🔵 Claude |
| ⚠️ | Coerenza | Ingrediente 'Olio Extravergine d'Oliva ((per salamoia ed emulsione)) 60g' non trova corrispondenza nel procedimento a causa degli errori di referenziazione | Verificare che tutti gli ingredienti siano correttamente utilizzati nel procedimento | 🔵 Claude |
| 💡 | Tempi | Biga 1,5-2h con solo 3g di lievito su 200g di farina potrebbe richiedere più tempo per svilupparsi adeguatamente | Considerare di aumentare il tempo a 2-3h o il lievito a 4-5g per la biga | 🔵 Claude |

---
*Generato: 2026-03-30T20:24:35.716Z | Pipeline: Schema → Claude → Gemini*
