# Qualità: Impasto Rosticceria Siciliana

## 🟢 Score Finale: 85/100

| Layer | Score | Dettaglio |
|---|---|---|
| Schema | ✅ Pass | 0 errori, 17 warning |
| Gemini | 85/100 | 🟡 Da migliorare |

Ricetta tecnicamente molto valida e spiegata in modo eccellente. L'idratazione (550g su 1100g di farine = 50%) è dichiarata correttamente. Tempi, temperature e bilanciamento dei grassi rispecchiano fedelmente la vera rosticceria siciliana. Unico neo un refuso matematico sull'inserimento dell'acqua nel procedimento.

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
| ❌ | Coerenza | Incongruenza nella quantità d'acqua: negli ingredienti sono indicati 550g totali, ma nel procedimento se ne utilizzano solo 500g (100g al punto 2 + 'i restanti 400g' al punto 3). All'appello mancano 50g. | Modificare il punto 3 del procedimento scrivendo 'aggiungere gradualmente i restanti 450g di acqua fresca'. |
| 💡 | Gruppi | Al punto 8 del procedimento si richiede di usare 'passata di pomodoro condita (olio, sale, origano)'. Tuttavia, il sale non è presente nel gruppo ingredienti 'Per la Farcitura' (i 20g indicati sono pesati millimetricamente per il solo impasto). | Aggiungere 'Sale fino (q.b. per la passata)' nel gruppo 'Per la Farcitura'. |

---
*Generato: 2026-04-16T19:30:24.846Z | Pipeline: Schema → Gemini*
