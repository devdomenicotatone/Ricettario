# Qualità: Cantuccini di Prato

## 🟢 Score Finale: 90/100

| Layer | Score | Dettaglio |
|---|---|---|
| Schema | ✅ Pass | 0 errori, 11 warning |
| Gemini | 90/100 | 🟡 Da migliorare |

Ricetta eccellente, con tempi, temperature (doppia cottura) e proporzioni perfettamente calibrati per la biscotteria secca. Il calcolo dell'idratazione (0% acqua pura su 280g di farina) è matematicamente corretto. È presente solo un piccolo refuso di compilazione nel procedimento.

## 🔍 Schema Validation

- ⚠️ Ingrediente "Farina Tipo 00 Debole" nel gruppo "Per l'Impasto" senza tokenId — il calcolatore dosi non funzionerà correttamente
- ⚠️ Ingrediente "Zucchero Semolato" nel gruppo "Per l'Impasto" senza tokenId — il calcolatore dosi non funzionerà correttamente
- ⚠️ Ingrediente "Uova Intere" nel gruppo "Per l'Impasto" senza tokenId — il calcolatore dosi non funzionerà correttamente
- ⚠️ Ingrediente "Burro" nel gruppo "Per l'Impasto" senza tokenId — il calcolatore dosi non funzionerà correttamente
- ⚠️ Ingrediente "Mandorle con Pellicina" nel gruppo "Per l'Impasto" senza tokenId — il calcolatore dosi non funzionerà correttamente
- ⚠️ Ingrediente "Ammoniaca per Dolci" nel gruppo "Per l'Impasto" senza tokenId — il calcolatore dosi non funzionerà correttamente
- ⚠️ Ingrediente "Scorza di Arancia" nel gruppo "Per l'Impasto" senza tokenId — il calcolatore dosi non funzionerà correttamente
- ⚠️ Ingrediente "Scorza di Limone" nel gruppo "Per l'Impasto" senza tokenId — il calcolatore dosi non funzionerà correttamente
- ⚠️ Ingrediente "Sale Fino" nel gruppo "Per l'Impasto" senza tokenId — il calcolatore dosi non funzionerà correttamente
- ⚠️ Ingrediente "Marsala o Vin Santo" nel gruppo "Per l'Impasto" senza tokenId — il calcolatore dosi non funzionerà correttamente
- ⚠️ Ingrediente "Tuorlo d'Uovo" nel gruppo "Per la Finitura" senza tokenId — il calcolatore dosi non funzionerà correttamente

## Problemi trovati

| Sev. | Area | Problema | Correzione |
|------|------|----------|------------|
| ❌ | Coerenza | Nel Procedimento al Punto 2 c'è un errore di assegnazione: la scorza di limone è associata al token dell'ammoniaca ('limone ({ammoniaca_per_dolci_impasto:3}g)'). L'ammoniaca viene poi correttamente inserita al Punto 3 ('ammoniaca per dolci ({ammoniaca_per_dolci_impasto:3}g)'). Il token reale della scorza di limone risulta quindi mancante nel testo. | Modificare il Punto 2 sostituendo il token errato con quello corretto per il limone: 'scorza di limone ({scorza_di_limone_impasto:3}g)'. |
| 💡 | Dosi | La ricetta prevede 30g di burro. Sebbene garantisca una maggiore friabilità (tecnica moderna e diffusa), il disciplinare IGP dei classici 'Cantuccini di Prato' non prevede l'uso di burro né di altri grassi aggiunti, basando la struttura unicamente sulle uova. | Se si punta alla ricetta tradizionale filologica, rimuovere il burro. Se si preferisce la variante friabile, mantenere i 30g. |

---
*Generato: 2026-07-27T23:58:17.277Z | Pipeline: Schema → Gemini*
