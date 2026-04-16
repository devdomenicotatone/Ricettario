# Qualità: Focaccia Genovese Classica

## 🟢 Score Finale: 85/100

| Layer | Score | Dettaglio |
|---|---|---|
| Schema | ✅ Pass | 0 errori, 14 warning |
| Gemini | 85/100 | 🟡 Da migliorare |

La ricetta ha un'ottima struttura tecnica su tempistiche e temperature. Tuttavia, è presente un'incoerenza critica tra i raggruppamenti degli ingredienti e il procedimento reale che rende la biga inattuabile se si legge solo la lista. L'idratazione reale calcolata è del 72% (720g acqua / 1000g farina), ma rientra nel margine di tolleranza rispetto al 75% dichiarato.

## 🔍 Schema Validation

- ⚠️ Idratazione dichiarata 75% vs calcolata 73% (scarto 2%)
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
| ❌ | Gruppi | La sezione 'Per la Biga' negli ingredienti elenca tutti i 700g di Farina Manitoba assieme a soli 120g di acqua, indicando un pre-impasto con un'idratazione impossibile del 17%. Questo contraddice il Punto 2 del procedimento, che richiede di usare solo 200g di un mix di farine. | Ristrutturare i gruppi ingredienti: dividere le farine in modo coerente col procedimento (es. 140g Manitoba + 60g Tipo 0 nella Biga, e 560g Manitoba + 240g Tipo 0 nell'Impasto) oppure creare un gruppo unico 'Mix Farine'. |
| ⚠️ | Coerenza | Nel Punto 2 del procedimento, per indicare i 60g di farina Tipo 0 da inserire nella biga, è stato inserito per errore il token relativo all'olio della salamoia: '{olio_evo_salamoia_e_fini:60}g tipo 0'. | Correggere il testo rimuovendo il token errato e inserendo '60g' (o un token dedicato alla farina Tipo 0) per evitare che il calcolatore sballi le dosi della farina scalando l'olio. |

---
*Generato: 2026-04-16T19:45:59.378Z | Pipeline: Schema → Gemini*
