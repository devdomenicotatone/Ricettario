# Qualità: Focaccia Genovese Classica

## 🔴 Score Finale: 57/100

| Layer | Score | Dettaglio |
|---|---|---|
| Schema | ✅ Pass | 0 errori, 1 warning |
| Claude | 72/100 | 🟡 Da migliorare |
| Gemini | 🟡 Parziale disaccordo (-15) | Claude ha individuato ottime discrepanze matematiche e difet |

Ricetta con procedimento dettagliato e tradizionale ma presenta errori gravi nei calcoli delle dosi di farina e riferimenti a variabili non definite. L'idratazione dichiarata non corrisponde ai calcoli reali. Eccesso di sale e lievito per i tempi di lievitazione. Setup e metodo sono appropriati per focaccia genovese.

## 🔍 Schema Validation

- ⚠️ Categoria "Focaccia" senza sezione cottura (bakingSection/cookingSection)

## Problemi trovati

| Sev. | Area | Problema | Correzione | Fonte |
|------|------|----------|------------|-------|
| ❌ | Dosi | Errore grave nei calcoli delle farine: procedimento indica 200g per biga (140g manitoba + 60g tipo 0), ma ingredienti dichiarano 700g manitoba + 300g tipo 0 = 1000g totali. Impossibile ottenere 200g da queste proporzioni | Correggere le dosi: per biga servono circa 140g manitoba + 60g tipo 0, per impasto finale 560g manitoba + 240g tipo 0 come indicato nel procedimento | 🔵 Claude |
| ❌ | Coerenza | Riferimenti a variabili inesistenti nel procedimento: {olio_evo_salamoia_e_fini:60}, {acqua_biga:120}, {lievito_fresco_biga:3}, etc. che non corrispondono ai nomi degli ingredienti | Sostituire tutti i riferimenti con i valori numerici corretti o correggere la nomenclatura delle variabili | 🔵 Claude |
| ❌ | Dosi | Idratazione dichiarata 75% non corrisponde ai calcoli: con 1000g farina totale e 720g acqua totale (120+600) = 72% idratazione | Correggere l'idratazione dichiarata a 72% o aggiustare le dosi d'acqua a 750g totali | 🔵 Claude |
| ⚠️ | Dosi | Sale totale 30g (18g + 4g + 8g) su 1000g farina = 3%: eccessivo per focaccia, standard è 2-2.5% | Ridurre sale impasto a 15g e salamoia a 2-3g per restare entro 2.5% totale | 🔵 Claude |
| ⚠️ | Dosi | Lievito totale 15g su 1000g farina = 1.5% con lievitazione 5-6h: percentuale alta per tempi lunghi, rischio sovralievitazione | Ridurre lievito totale a 10-12g (1-1.2%) per i tempi di lievitazione indicati | 🔵 Claude |
| 💡 | Temperature | Forno 220°C corretto per focaccia casalinga, ma potrebbe beneficiare di 230-240°C per migliore doratura | Considerare temperature 230-240°C riducendo tempo a 18-22 minuti | 🔵 Claude |
| ❌ | Ingredienti / Tempi | Forza della farina (W350-380) completamente incompatibile con i tempi brevi di lievitazione (5-6h totali). L'impasto risulterà estremamente tenace, gommoso e impossibile da stendere senza un forte effetto elastico (ritiro). | Sostituire le farine con una farina unica di forza medio-debole (W220-260) adatta a lievitazioni dirette o brevi. | 🔴 Gemini |
| ❌ | Procedimento (Salamoia) | Errore tecnico gravissimo sulla tradizione della Genovese: si indica di far riposare la focaccia solo 5 minuti dopo aver fatto le fossette e versato la salamoia. | La vera Genovese deve lievitare CON la salamoia nelle fossette per almeno 45-60 minuti prima di essere infornata, affinché il fondo dei buchi diventi cremoso e bianco. | 🔴 Gemini |
| ⚠️ | Procedimento | Nel punto 1 c'è un errore di compilazione palese nel testo: '(140g manitoba + {olio_evo_salamoia_e_fini:60}g tipo 0)'. Chiama la farina come se fosse olio evo. | Riscrivere la stringa inserendo semplicemente '60g'. | 🔴 Gemini |

## 🔴 Revisione Gemini

**Verdetto**: 🟡 Parziale disaccordo
**Adjustment**: -15

Claude ha individuato ottime discrepanze matematiche e difetti di formattazione (variabili non parsate). Ha però mancato errori di panificazione fatali: usare quasi tutta farina di forza estrema (W380) per sole 5 ore produrrà un blocco di gomma inestensibile, e il riposo di soli 5 minuti della salamoia uccide la reazione chimica alla base della vera Genovese. Score ridotto per l'inattuabilità della ricetta così scritta.

### Issues contestate

| Problema | Verdetto | Motivo |
|---|---|---|
| Sale totale 30g (18g + 4g + 8g) su 1000g farina = 3%: eccessivo per focaccia, standard è 2-2.5% | ❌ Falso positivo | 18g di sale nell'impasto (1.8%) è una dose perfetta. Il sale della salamoia e il sale grosso superficiale non vanno sommati matematicamente all'impasto: la Genovese si basa esattamente sul contrasto tra un impasto moderatamente sapido e una superficie molto saporita. Ridurre il sale cambierebbe l'identità del prodotto. |
| Forno 220°C corretto... potrebbe beneficiare di 230-240°C per migliore doratura | ❌ Falso positivo | 220°C è la temperatura ideale per la Genovese. A 240°C l'olio in superficie brucerebbe prima che la focaccia si asciughi internamente e prima che la base 'frigga' correttamente nell'olio della teglia. |
| Errore grave nei calcoli delle farine: procedimento indica 200g per biga... | ✅ Confermo | Correttissimo. La lista ingredienti è strutturata in modo insensato, assegnando tutta la Manitoba alla biga e tutto il Tipo 0 all'impasto finale, rendendo la biga una polvere secca (700g farina / 120g acqua = 17% idratazione). |

---
*Generato: 2026-03-30T20:01:32.973Z | Pipeline: Schema → Claude → Gemini*
