# Qualità: Impasto Rosticceria Siciliana

## 🟢 Score Finale: 85/100

| Layer | Score | Dettaglio |
|---|---|---|
| Schema | ✅ Pass | 0 errori, 17 warning |
| Gemini | 85/100 | 🟡 Da migliorare |

La ricetta è strutturata molto bene e le temperature/tempi sono corretti per la tipologia di impasto. Tuttavia, c'è un errore matematico nel testo del procedimento che fa perdere 50g di acqua rispetto alla lista ingredienti, abbassando un'idratazione già di per sé molto rigida (50%).

## 🔍 Schema Validation

- ⚠️ Ingrediente "Farina Tipo 0 o 00" nel gruppo "Per l'Impasto" senza tokenId — il calcolatore dosi non funzionerà correttamente
- ⚠️ Ingrediente "Farina Manitoba" nel gruppo "Per l'Impasto" senza tokenId — il calcolatore dosi non funzionerà correttamente
- ⚠️ Ingrediente "Acqua" nel gruppo "Per l'Impasto" senza tokenId — il calcolatore dosi non funzionerà correttamente
- ⚠️ Ingrediente "Lievito di Birra Fresco" nel gruppo "Per l'Impasto" senza tokenId — il calcolatore dosi non funzionerà correttamente
- ⚠️ Ingrediente "Strutto" nel gruppo "Per l'Impasto" senza tokenId — il calcolatore dosi non funzionerà correttamente
- ⚠️ Ingrediente "Zucchero Semolato" nel gruppo "Per l'Impasto" senza tokenId — il calcolatore dosi non funzionerà correttamente
- ⚠️ Ingrediente "Sale Fino" nel gruppo "Per l'Impasto" senza tokenId — il calcolatore dosi non funzionerà correttamente
- ⚠️ Ingrediente "Miele" nel gruppo "Per l'Impasto" senza tokenId — il calcolatore dosi non funzionerà correttamente
- ⚠️ Ingrediente "Prosciutto Cotto" nel gruppo "Per la Farcitura" senza tokenId — il calcolatore dosi non funzionerà correttamente
- ⚠️ Ingrediente "Mozzarella" nel gruppo "Per la Farcitura" senza tokenId — il calcolatore dosi non funzionerà correttamente
- ⚠️ Ingrediente "Passata di Pomodoro" nel gruppo "Per la Farcitura" senza tokenId — il calcolatore dosi non funzionerà correttamente
- ⚠️ Ingrediente "Olio Extravergine" nel gruppo "Per la Farcitura" senza tokenId — il calcolatore dosi non funzionerà correttamente
- ⚠️ Ingrediente "Origano Secco" nel gruppo "Per la Farcitura" senza tokenId — il calcolatore dosi non funzionerà correttamente
- ⚠️ Ingrediente "Tuorlo d'Uovo" nel gruppo "Per la Finitura" senza tokenId — il calcolatore dosi non funzionerà correttamente
- ⚠️ Ingrediente "Latte Intero" nel gruppo "Per la Finitura" senza tokenId — il calcolatore dosi non funzionerà correttamente
- ⚠️ Ingrediente "Semi di Sesamo" nel gruppo "Per la Finitura" senza tokenId — il calcolatore dosi non funzionerà correttamente
- ⚠️ Nessun token {id:base} trovato negli step — le dosi nel procedimento non saranno dinamiche

## Problemi trovati

| Sev. | Area | Problema | Correzione |
|------|------|----------|------------|
| ❌ | Coerenza | Incongruenza sulla quantità totale di acqua. Negli ingredienti sono indicati 550g totali. Nel procedimento (Punto 2) si usano 100g, e al Punto 3 si dice di aggiungere 'i restanti 400g'. 100g + 400g = 500g. Mancano 50g all'appello nel testo. | Modificare il Punto 3 del procedimento scrivendo 'aggiungere gradualmente i restanti 450g di acqua'. |
| ⚠️ | Coerenza | Al Punto 8 si indica di condire la passata di pomodoro con '(olio, sale, origano)'. Tuttavia, il sale non è presente nel gruppo ingredienti 'Per la Farcitura' (è presente solo quello per l'impasto). | Aggiungere 'Sale fino q.b.' nel gruppo ingredienti 'Per la Farcitura', oppure rimuovere la dicitura 'sale' dal Punto 8. |
| 💡 | Dosi | Le percentuali indicate tra parentesi negli ingredienti non corrispondono matematicamente alla farina totale (1100g). Il lievito (25g) è il 2.27% e non il 2.5%; lo zucchero (100g) è il 9% e non il 10%; il sale (20g) è l'1.8% e non il 2%. | Correggere le note tra parentesi per riflettere le percentuali reali, oppure adeguare i grammi (es. 22g di sale per avere esattamente il 2%, 110g di zucchero per il 10%). |

---
*Generato: 2026-07-27T23:50:13.314Z | Pipeline: Schema → Gemini*
