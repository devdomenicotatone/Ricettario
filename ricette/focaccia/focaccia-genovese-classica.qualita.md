# Qualità: Focaccia Genovese Classica

## 🟡 Score Finale: 75/100

| Layer | Score | Dettaglio |
|---|---|---|
| Schema | ✅ Pass | 0 errori, 13 warning |
| Gemini | 75/100 | 🟡 Da migliorare |

Il procedimento tecnico, le temperature e i tempi sono descritti in modo eccellente e coerente con lo stile genovese. È tuttavia necessario correggere un grave errore di raggruppamento delle farine nella lista ingredienti che renderebbe impossibile la creazione della biga.

## 🔍 Schema Validation

- ⚠️ Ingrediente "Farina Manitoba Forte" nel gruppo "Per la Biga" senza tokenId — il calcolatore dosi non funzionerà correttamente
- ⚠️ Ingrediente "Acqua" nel gruppo "Per la Biga" senza tokenId — il calcolatore dosi non funzionerà correttamente
- ⚠️ Ingrediente "Lievito di Birra Fresco" nel gruppo "Per la Biga" senza tokenId — il calcolatore dosi non funzionerà correttamente
- ⚠️ Ingrediente "Farina Tipo 0 Media Forza" nel gruppo "Per l'Impasto Finale" senza tokenId — il calcolatore dosi non funzionerà correttamente
- ⚠️ Ingrediente "Acqua" nel gruppo "Per l'Impasto Finale" senza tokenId — il calcolatore dosi non funzionerà correttamente
- ⚠️ Ingrediente "Lievito di Birra Fresco" nel gruppo "Per l'Impasto Finale" senza tokenId — il calcolatore dosi non funzionerà correttamente
- ⚠️ Ingrediente "Olio Extravergine d'Oliva Ligure DOP" nel gruppo "Per l'Impasto Finale" senza tokenId — il calcolatore dosi non funzionerà correttamente
- ⚠️ Ingrediente "Miele o Zucchero" nel gruppo "Per l'Impasto Finale" senza tokenId — il calcolatore dosi non funzionerà correttamente
- ⚠️ Ingrediente "Sale Fino Marino" nel gruppo "Per l'Impasto Finale" senza tokenId — il calcolatore dosi non funzionerà correttamente
- ⚠️ Ingrediente "Acqua" nel gruppo "Per la Salamoia e Finitura" senza tokenId — il calcolatore dosi non funzionerà correttamente
- ⚠️ Ingrediente "Olio Extravergine d'Oliva" nel gruppo "Per la Salamoia e Finitura" senza tokenId — il calcolatore dosi non funzionerà correttamente
- ⚠️ Ingrediente "Sale Fino" nel gruppo "Per la Salamoia e Finitura" senza tokenId — il calcolatore dosi non funzionerà correttamente
- ⚠️ Ingrediente "Sale Grosso Marino" nel gruppo "Per la Salamoia e Finitura" senza tokenId — il calcolatore dosi non funzionerà correttamente

## Problemi trovati

| Sev. | Area | Problema | Correzione |
|------|------|----------|------------|
| ❌ | Gruppi | Errore critico nella ripartizione delle farine. L'elenco ingredienti assegna tutti i 700g di farina Manitoba alla Biga con soli 120g di acqua (creando un pre-impasto impossibile da formare al 17% di idratazione). Il procedimento (Step 2 e 3) indica correttamente di usare una porzione minore (140g Manitoba + 60g Tipo 0) per la Biga. | Allineare l'elenco ingredienti al procedimento: lasciare 140g di Manitoba e 60g di Tipo 0 nella sezione 'Per la Biga'. Spostare i restanti 560g di Manitoba e 240g di Tipo 0 nella sezione 'Per l'Impasto Finale'. |
| ⚠️ | Coerenza | Nello Step 7 del procedimento si richiede l'uso di 'abbondante olio EVO sul fondo (circa 20g per teglia)' per la stesura. Questo quantitativo di olio non è presente nella lista ingredienti, poiché i 50g sono destinati all'impasto e i 60g alla salamoia. | Aggiungere 'Olio Extravergine d'Oliva ((per ungere le teglie)) 20-40g' nella sezione 'Per la Salamoia e Finitura'. |

---
*Generato: 2026-07-27T23:54:05.785Z | Pipeline: Schema → Gemini*
