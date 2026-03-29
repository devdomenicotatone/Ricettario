# Qualità: Pane di Altamura DOP

## 🔴 Score Finale: 47/100

| Layer | Score | Dettaglio |
|---|---|---|
| Schema | ✅ Pass | 0 errori, 1 warning |
| Claude | 92/100 | 🟢 Buona |
| Gemini | 🔴 Forte disaccordo (-45) | Claude ha dato un voto eccellente ignorando che la ricetta v |

Ricetta tecnicamente eccellente per il Pane di Altamura DOP. Dosi corrette, metodo tradizionale rispettato, setup appropriato. Temperature e tempi ben calibrati per la semola rimacinata. Procedimento dettagliato e professionale con indicazioni precise per ogni fase. Gli alert e pro tips sono pertinenti e utili. Solo piccoli affinamenti suggeriti per ottimizzare precisione e chiarezza.

## 🔍 Schema Validation

- ⚠️ Categoria "Pane" senza sezione cottura (bakingSection/cookingSection)

## Problemi trovati

| Sev. | Area | Problema | Correzione | Fonte |
|------|------|----------|------------|-------|
| 💡 | Dosi | Sale al 1.8% su farina (18g su 1000g): conforme alla tradizione pugliese ma al limite inferiore dello standard italiano (2-2.5%) | Considerare 20-25g per sapidità più marcata, tipica del territorio | 🔵 Claude |
| 💡 | Coerenza | Nel procedimento si cita 'marchi suggeriti' nei PRO TIPS ma non sono elencati ingredienti con marchi specifici | Rimuovere riferimento ai marchi o specificare esempi nell'elenco ingredienti | 🔵 Claude |
| 💡 | Tempi | Lievitazione totale indicata ~24h ma la somma effettiva è 20-26h (8-10h puntata + 12-16h appretto) | Aggiornare indicazione iniziale a 'Lievitazione: 20-26h' per maggiore precisione | 🔵 Claude |
| ❌ | Ingredienti / Falso DOP | La ricetta si intitola 'Pane di Altamura DOP' ma utilizza Lievito di Birra e Miele. Il disciplinare DOP vieta categoricamente entrambi: esige ESCLUSIVAMENTE Lievito Madre (pasta acida), semola, acqua e sale. | Sostituire il lievito di birra con Lievito Madre (es. 200g) e rimuovere il miele, oppure togliere 'DOP' dal titolo. | 🔴 Gemini |
| ❌ | Lievitazione / Rischio fallimento | 3g di lievito di birra fresco (0.3%) lasciati a 18-24°C per un totale di 20-26 ore porteranno l'impasto a una sovralievitazione estrema (collasso della maglia glutinica). Queste tempistiche a TA sono possibili solo col lievito madre, non col LdB. | Se si usa LdB, inserire un passaggio in frigorifero a 4°C per la maturazione lunga, oppure ridurre drasticamente i tempi a temperatura ambiente (es. max 4-6 ore totali). | 🔴 Gemini |
| ❌ | Formatura / Taglio | Si indica di fare un 'taglio a croce profondo'. Il vero Pane di Altamura (forma accavallata) NON prevede alcun taglio con lametta: la forma caratteristica si ottiene per ripiegamento dell'impasto su se stesso. | Rimuovere l'istruzione di incidere la superficie a croce e spiegare la corretta piega 'accavallata'. | 🔴 Gemini |
| 💡 | Pro Tips | Si consiglia di guardare la 'forza (W)' della farina. Questo parametro si usa per il grano tenero. La semola di grano duro si valuta per percentuale di proteine e Indice di Glutine, quasi mai per W. | Sostituire il riferimento al 'W' con 'percentuale proteica (almeno 12.5-13%)'. | 🔴 Gemini |

## 🔴 Revisione Gemini

**Verdetto**: 🔴 Forte disaccordo
**Adjustment**: -45

Claude ha dato un voto eccellente ignorando che la ricetta viola clamorosamente il disciplinare DOP (usa lievito di birra e miele e prevede un taglio a croce inesistente ad Altamura). Inoltre, tecnicamente, la gestione di 3g di lievito di birra a temperatura ambiente per 24h porterà al collasso totale dell'impasto.

### Issues contestate

| Problema | Verdetto | Motivo |
|---|---|---|
| Sale al 1.8% su farina (18g su 1000g): conforme alla tradizione pugliese ma al limite inferiore dello standard italiano (2-2.5%) | ✅ Confermo | Corretto, inoltre il disciplinare del Pane di Altamura DOP prevede esattamente il 2% di sale (20g). |
| Nel procedimento si cita 'marchi suggeriti' nei PRO TIPS ma non sono elencati ingredienti con marchi specifici | ⚠️ Parziale | Vero che c'è un refuso nel testo, ma è un problema editoriale minore rispetto agli errori tecnici madornali presenti nella ricetta. |
| Lievitazione totale indicata ~24h ma la somma effettiva è 20-26h (8-10h puntata + 12-16h appretto) | ❌ Falso positivo | La tilde (~) indica proprio un'approssimazione. Il vero problema delle tempistiche non è la somma matematica, ma la fermentazione. |

---
*Generato: 2026-03-29T00:12:57.276Z | Pipeline: Schema → Claude → Gemini*
