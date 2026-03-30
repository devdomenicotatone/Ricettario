# Qualità: Burger Buns Professionali

## 🟡 Score Finale: 75/100

| Layer | Score | Dettaglio |
|---|---|---|
| Schema | ✅ Pass | 0 errori, 0 warning |
| Claude | 75/100 | 🟡 Da migliorare |

Ricetta con buona struttura tecnica ma presenta diversi errori nei riferimenti delle variabili del procedimento e incongruenze nelle quantità. Le dosi di lievito sono eccessive per i tempi indicati e l'idratazione reale non corrisponde a quella dichiarata. Correggendo questi aspetti, la ricetta può funzionare bene per burger buns professionali.

## Problemi trovati

| Sev. | Area | Problema | Correzione | Fonte |
|------|------|----------|------------|-------|
| ❌ | Coerenza | Nel punto 1 del procedimento si riferisce a '{burro_impasto_finale:50}g di acqua' invece di 290g di acqua per la biga | Correggere con '{acqua_biga:290}g di acqua' | 🔵 Claude |
| ❌ | Coerenza | Nel punto 1 si usa solo 100g di Manitoba invece dei 300g previsti negli ingredienti per la biga | Correggere con '{farina_manitoba_biga:300}g di Manitoba' | 🔵 Claude |
| ❌ | Coerenza | Nel punto 2 si indicano quantità sbagliate: '{farina_media_impasto_finale:200}g Manitoba' ma la Manitoba nell'impasto finale non esiste negli ingredienti | Usare '{farina_manitoba_rimanente:200}g Manitoba rimanente dalla biga + {farina_00_impasto_finale:200}g farina 00' | 🔵 Claude |
| ❌ | Coerenza | Nel punto 7 riferimento errato '{semi_di_sesamo_finitura:30}g latte' invece di '{latte_spennellatura:30}g latte' | Correggere il riferimento alla variabile del latte per spennellatura | 🔵 Claude |
| ⚠️ | Dosi | Idratazione totale reale 62.4% (585g liquidi/935g farine totali), non 58% dichiarata | Correggere l'idratazione dichiarata a 62% o ridurre i liquidi | 🔵 Claude |
| ⚠️ | Dosi | Lievito totale 2% su farina, alto per lievitazione di 4h30 con biga | Ridurre lievito totale a 6-7g per evitare sovralievitazione | 🔵 Claude |
| 💡 | Coerenza | Manca {zucchero_impasto_finale:40} nel procedimento, ingrediente non utilizzato | Aggiungere lo zucchero insieme al miele nel punto 2 | 🔵 Claude |

---
*Generato: 2026-03-30T20:06:01.717Z | Pipeline: Schema → Claude → Gemini*
