# Qualità: Pane di Altamura DOP

## 🔴 Score Finale: 52/100

| Layer | Score | Dettaglio |
|---|---|---|
| Schema | ✅ Pass | 0 errori, 2 warning |
| Claude | 92/100 | 🟢 Buona |
| Gemini | 🔴 Forte disaccordo (-40) | Claude ha fallito nel riconoscere i vincoli basilari di una  |

Ricetta tecnicamente molto solida con dosi equilibrate, tempi appropriati per la fermentazione lunga e setup corretto. L'idratazione al 68% è perfetta per la semola rimacinata. Temperature e tempi sono ben calibrati per il prodotto DOP. Le uniche migliorie riguardano il sale (leggermente basso per tradizione) e la specifica del valore W della semola.

## 🔍 Schema Validation

- ⚠️ Categoria "Pane" senza sezione cottura (bakingSection/cookingSection)
- ⚠️ Nessun token {id:base} trovato negli step — le dosi nel procedimento non saranno dinamiche

## Problemi trovati

| Sev. | Area | Problema | Correzione | Fonte |
|------|------|----------|------------|-------|
| 💡 | Dosi | Sale al 1.8% (18g su 1000g farina): corretto per legge ma al limite inferiore per il gusto tradizionale del Pane di Altamura | Considerare 20-22g (2-2.2%) per sapidità più marcata tipica del prodotto DOP | 🔵 Claude |
| 💡 | Coerenza | Nel procedimento si parla di 'forza (W)' nei PRO TIPS ma non viene specificato il valore W della semola rimacinata negli ingredienti | Aggiungere il valore W suggerito per la semola rimacinata (es. W280-320) nella descrizione ingrediente | 🔵 Claude |
| ❌ | Ingredienti / Autenticità | Uso di Lievito di Birra in un prodotto denominato 'DOP'. Il disciplinare del Pane di Altamura DOP impone TASSATIVAMENTE l'uso esclusivo di Lievito Madre (pasta acida). | Sostituire il lievito di birra con Lievito Madre (circa 200g), oppure rimuovere la dicitura 'DOP' dal titolo. | 🔴 Gemini |
| ❌ | Ingredienti / Autenticità | Presenza di Miele di Acacia. Il disciplinare DOP ammette unicamente: semola rimacinata, acqua, lievito madre e sale. | Rimuovere completamente il miele dalla ricetta. | 🔴 Gemini |
| ❌ | PRO TIPS | Il consiglio finale indica di cercare la forza (W) per la farina. Come detto, la semola non riporta il parametro W. | Modificare il tip suggerendo di cercare una semola rimacinata con almeno il 12.5% - 13% di proteine. | 🔴 Gemini |
| ⚠️ | Formatura e Tagli | Il taglio 'a croce' o 'obliquo' non appartiene alla tradizione di Altamura. Le forme ufficiali sono 'U sckuanète' (pane accavallato/alto) e 'a cappidde de prèvete' (basso). | Descrivere la formatura tradizionale accavallata invece del generico taglio a croce con lametta. | 🔴 Gemini |

## 🔴 Revisione Gemini

**Verdetto**: 🔴 Forte disaccordo
**Adjustment**: -40

Claude ha fallito nel riconoscere i vincoli basilari di una ricetta 'DOP', ignorando che il Pane di Altamura vieta miele e lievito di birra (richiede lievito madre). Inoltre, ha commesso un errore grossolano confermando l'uso dell'indice 'W' per la semola di grano duro. La ricetta va fortemente penalizzata se mantiene la dicitura DOP.

### Issues contestate

| Problema | Verdetto | Motivo |
|---|---|---|
| Sale al 1.8% (18g su 1000g farina): corretto per legge ma al limite inferiore... | ❌ Falso positivo | Il disciplinare DOP prevede circa 20g di sale per kg di semola. 18g (1.8%) è una quantità eccellente e corretta; suggerire di alzarlo fino al 2.2% rischia di rendere il pane eccessivamente sapido. |
| Nel procedimento si parla di 'forza (W)'... Aggiungere il valore W suggerito per la semola rimacinata | ❌ Falso positivo | Claude ha avallato e aggravato un grave errore tecnico della ricetta. La semola di grano duro (Triticum durum) NON si classifica commercialmente con la forza 'W' (Alveografo di Chopin, usato per il grano tenero), ma tramite percentuale proteica (minimo 12.5%) e Indice di Glutine. Suggerire un 'W280-320' per la semola è un'inesattezza tecnica. |

---
*Generato: 2026-03-30T19:46:05.960Z | Pipeline: Schema → Claude → Gemini*
