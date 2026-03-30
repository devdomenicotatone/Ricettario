# Qualità: Focaccia Genovese Classica

## 🟡 Score Finale: 72/100

| Layer | Score | Dettaglio |
|---|---|---|
| Schema | ✅ Pass | 0 errori, 1 warning |
| Claude | 72/100 | 🟡 Da migliorare |

Ricetta di focaccia genovese tecnicamente valida ma con errori nei calcoli delle farine per la biga e presenza di riferimenti template non risolti. L'idratazione effettiva è 72% non 75%. Il contenuto di sale è al limite superiore. Setup e procedimento sono appropriati, temperature e tempi di cottura corretti per forno casalingo.

## 🔍 Schema Validation

- ⚠️ Categoria "Focaccia" senza sezione cottura (bakingSection/cookingSection)

## Problemi trovati

| Sev. | Area | Problema | Correzione | Fonte |
|------|------|----------|------------|-------|
| ❌ | Dosi | Errore grave nel calcolo delle farine per la biga: il testo indica '200g del mix farine (140g manitoba + 60g tipo 0)' ma 140+60=200g, mentre dovrebbe essere proporzionale a 700g+300g=1000g totali | Correggere: per 200g biga servono 140g manitoba + 60g tipo 0, quindi rimangono 560g manitoba + 240g tipo 0 per l'impasto finale | 🔵 Claude |
| ❌ | Coerenza | Riferimenti a variabili template nel testo: '{olio_evo_salamoia_e_fini:60}', '{acqua_biga:120}', '{lievito_fresco_biga:3}' ecc. dovrebbero essere sostituiti con i valori numerici | Sostituire tutti i riferimenti template con i valori effettivi degli ingredienti | 🔵 Claude |
| ⚠️ | Dosi | L'idratazione dichiarata 75% non corrisponde al calcolo: (120+600)g acqua / 1000g farina = 72% effettivo | Correggere l'idratazione dichiarata a 72% oppure aggiustare le dosi d'acqua a 750g totali | 🔵 Claude |
| ⚠️ | Dosi | Il sale totale è 18g+4g+8g=30g su 1000g farina = 3%, superiore al range tipico 2-2.5% | Considerare di ridurre il sale grosso di finitura a 5-6g per avere un totale di 2.7% | 🔵 Claude |
| ⚠️ | Coerenza | Nel punto 7, c'è un riferimento errato '{sale_salamoia_e_fini_2:8}' che dovrebbe essere semplicemente il sale grosso marino da 8g | Sostituire con il valore corretto '8g sale grosso marino' | 🔵 Claude |
| 💡 | Tempi | Il tempo totale dichiarato '5-6h' sembra sottostimato: biga 1,5-2h + puntata 3-4h + appretto 40min = 5,25-6,75h | Aggiornare a '5,5-7h totali' per maggiore precisione | 🔵 Claude |

---
*Generato: 2026-03-30T21:42:55.146Z | Pipeline: Schema → Claude → Gemini*
