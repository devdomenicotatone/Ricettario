# Qualità: Focaccia Genovese Classica

## 🟡 Score Finale: 63/100

| Layer | Score | Dettaglio |
|---|---|---|
| Schema | ✅ Pass | 0 errori, 1 warning |
| Claude | 88/100 | 🟢 Buona |
| Gemini | 🔴 Forte disaccordo (-25) | Claude ha premiato una ricetta con errori strutturali gravi. |

Ricetta tecnicamente valida con buona struttura e dettagli accurati. L'idratazione 75% è corretta per focaccia genovese, il setup spirale+mano è appropriato, temperature e tempi sono realistici. Le dosi di lievito (1.5% totale) e la doppia lievitazione sono coerenti con la tradizione. Procedimento ben dettagliato con tecniche professionali corrette. Solo piccoli aggiustamenti suggeriti per ottimizzare sapidità e chiarezza espositiva.

## 🔍 Schema Validation

- ⚠️ Categoria "Focaccia" senza sezione cottura (bakingSection/cookingSection)

## Problemi trovati

| Sev. | Area | Problema | Correzione | Fonte |
|------|------|----------|------------|-------|
| 💡 | Dosi | Sale totale 30g su 1kg farina = 3%: al limite superiore per focaccia (standard 2-2.5%) | Considerare riduzione a 24-26g totali per equilibrare meglio sapidità | 🔵 Claude |
| 💡 | Coerenza | Nel punto 1 menziona 'mix farine' ma gli ingredienti separano chiaramente Manitoba e Tipo 0 | Specificare le quantità esatte: '140g Manitoba + 60g Tipo 0' invece di riferirsi a 'mix farine' | 🔵 Claude |
| 💡 | Temperature | Range temperatura ambiente 24-26°C vs temperatura controllata 26°C nel procedimento | Unificare indicando 'temperatura ambiente 24-26°C (ideale 26°C)' | 🔵 Claude |
| ❌ | Proporzioni Impasto/Teglia | La ricetta genera circa 1,8 kg di impasto. Mettere tutto in una teglia 30x40 (o due 30x30) è un errore gravissimo: verrebbe un panettone alto 5 cm. La dose corretta per una 30x40 è circa 600-700g di impasto (0,5-0,6 g/cm2). | Dividere l'impasto in almeno 3 teglie 30x40, oppure ridurre gli ingredienti a un terzo. | 🔴 Gemini |
| ❌ | Autenticità e Scelta Farine | Una 'Focaccia Genovese Classica' non usa MAI il 70% di Manitoba. La Genovese richiede farine deboli/medie (W220-280) per avere la tipica friabilità e il morso corto. Tanta Manitoba darà una consistenza gommosa e panosa. | Invertire le proporzioni (es. 100% farina W260-280) o cambiare il titolo in 'Focaccia ad alta idratazione'. | 🔴 Gemini |
| ❌ | Terminologia Tecnica (Biga) | Un pre-impasto che lievita per 1,5 - 2 ore NON è una biga (che richiede 16-24h a 18°C). È un lievitino o uno sponge. | Chiamarlo 'Lievitino' o 'Poolish/Sponge' (data l'idratazione al 60%), non Biga. | 🔴 Gemini |
| ⚠️ | Matematica (Idratazione) | L'idratazione dichiarata è 75%, ma 720g di acqua su 1000g di farina equivalgono al 72%. | Correggere l'idratazione dichiarata al 72% (che tra l'altro è già altissima per una vera genovese, solitamente al 55-60%). | 🔴 Gemini |

## 🔴 Revisione Gemini

**Verdetto**: 🔴 Forte disaccordo
**Adjustment**: -25

Claude ha premiato una ricetta con errori strutturali gravi. La quantità di impasto (1.8kg) è quasi il triplo di quanto ne possa contenere una teglia 30x40. Inoltre, l'uso del 70% di Manitoba, l'idratazione errata e l'uso improprio del termine 'biga' la allontanano totalmente da una vera 'Genovese Classica'.

### Issues contestate

| Problema | Verdetto | Motivo |
|---|---|---|
| Sale totale 30g su 1kg farina = 3% | ⚠️ Parziale | Vero che 3% è al limite, ma 8g sono di sale grosso in superficie, che non si scioglie completamente nell'impasto. È comunque una nota valida per la sapidità generale. |
| Nel punto 1 menziona 'mix farine' ma gli ingredienti separano... | ❌ Falso positivo | Claude non ha letto bene: il punto 1 dice esplicitamente 'Prelevare 200g del mix farine (140g manitoba + 60g tipo 0)'. Il dettaglio c'è già. |
| Range temperatura ambiente 24-26°C vs temperatura controllata 26°C | ❌ Falso positivo | Un appunto pignolo e inutile. La temperatura target dell'impasto (24-26°C) e quella della cella di lievitazione (26°C) sono concetti diversi ma qui perfettamente coerenti. |

---
*Generato: 2026-03-29T00:26:57.152Z | Pipeline: Schema → Claude → Gemini*
