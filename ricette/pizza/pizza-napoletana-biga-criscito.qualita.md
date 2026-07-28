# Qualità: Pizza Napoletana Antica Tradizione con Biga e Criscito

## 🟡 Score Finale: 65/100

| Layer | Score | Dettaglio |
|---|---|---|
| Schema | ❌ Fail | 2 errori, 10 warning |
| Gemini | 95/100 | 🟢 Buona |

Ricetta eccellente, redatta con altissima competenza tecnica. I calcoli dell'idratazione (2050g acqua / 3000g farina = 68.3%) confermano il dato dichiarato. Proporzioni di sale, biga e criscito perfette, così come le indicazioni termiche per i diversi forni. L'unico dettaglio è un disallineamento testuale sull'inserimento dell'acqua.

## 🔍 Schema Validation

- ❌ Idratazione dichiarata 68% ma calcolata 49% (1650g liquido / 3400g farina). Scarto: 19%
- ❌ totalFlour dichiarato 3000g ma somma farine = 3400g (differenza: 400g)
- ⚠️ Ingrediente "Farina Caputo Saccorosso" nel gruppo "Per la Biga" senza tokenId — il calcolatore dosi non funzionerà correttamente
- ⚠️ Ingrediente "Acqua" nel gruppo "Per la Biga" senza tokenId — il calcolatore dosi non funzionerà correttamente
- ⚠️ Ingrediente "Lievito Secco Caputo" nel gruppo "Per la Biga" senza tokenId — il calcolatore dosi non funzionerà correttamente
- ⚠️ Ingrediente "Biga di Saccorosso" nel gruppo "Per l'Impasto Finale" senza tokenId — il calcolatore dosi non funzionerà correttamente
- ⚠️ Ingrediente "Farina Caputo Saccorosso" nel gruppo "Per l'Impasto Finale" senza tokenId — il calcolatore dosi non funzionerà correttamente
- ⚠️ Ingrediente "Farina Caputo Nuvola Super" nel gruppo "Per l'Impasto Finale" senza tokenId — il calcolatore dosi non funzionerà correttamente
- ⚠️ Ingrediente "Acqua" nel gruppo "Per l'Impasto Finale" senza tokenId — il calcolatore dosi non funzionerà correttamente
- ⚠️ Ingrediente "Criscito Caputo" nel gruppo "Per l'Impasto Finale" senza tokenId — il calcolatore dosi non funzionerà correttamente
- ⚠️ Ingrediente "Estratto di Malto" nel gruppo "Per l'Impasto Finale" senza tokenId — il calcolatore dosi non funzionerà correttamente
- ⚠️ Ingrediente "Sale Marino Fino" nel gruppo "Per l'Impasto Finale" senza tokenId — il calcolatore dosi non funzionerà correttamente

## Problemi trovati

| Sev. | Area | Problema | Correzione |
|------|------|----------|------------|
| ⚠️ | Coerenza | Discrepanza nelle fasi di inserimento dell'acqua dell'impasto finale. Nelle note dell'ingrediente si indica di inserirla 'in 3 riprese: 50% iniziale, 30% durante incordatura, 20% finale'. Tuttavia, nel procedimento (Step 3 e 5) viene inserita in sole due fasi: il 60% (990g) per sciogliere la biga e il restante 40% (660g) in bassinage. | Allineare la nota dell'ingrediente al procedimento effettivo, modificandola in: '(inserita in 2 riprese: 60% iniziale, 40% finale in bassinage)'. |

---
*Generato: 2026-07-27T23:53:05.475Z | Pipeline: Schema → Gemini*
