# Qualità: Focaccia Genovese (Fügassa)

## 🔴 Score Finale: 57/100

| Layer | Score | Dettaglio |
|---|---|---|
| Schema | ✅ Pass | 0 errori, 1 warning |
| Claude | 92/100 | 🟢 Buona |
| Gemini | 🔴 Forte disaccordo (-35) | Claude ha assegnato un punteggio altissimo mancando errori s |

Ricetta tecnicamente solida con dosi equilibrate e procedimento dettagliato. L'idratazione al 67% è appropriata, le temperature sono corrette per forno casalingo, e il setup impastatrice spirale + a mano è adeguato. Il procedimento è molto preciso con ottimi dettagli tecnici sulla manipolazione dell'impasto e la salamoia finale. Solo piccole ottimizzazioni suggerite per perfezionare ulteriormente la ricetta.

## 🔍 Schema Validation

- ⚠️ Categoria "Focaccia" senza sezione cottura (bakingSection/cookingSection)

## Problemi trovati

| Sev. | Area | Problema | Correzione | Fonte |
|------|------|----------|------------|-------|
| 💡 | Dosi | Sale nell'impasto al 2% (13g su 650g farina totale) - nella norma ma al limite inferiore per focaccia | Considerare 15-16g per sapore più marcato tipico della tradizione ligure | 🔵 Claude |
| 💡 | Coerenza | Malto diastasico 10g citato negli ingredienti ma nel procedimento non si specifica se è in polvere o liquido | Specificare nel procedimento se malto in polvere o liquido per dosaggio corretto | 🔵 Claude |
| 💡 | Tempi | Lievitazione totale dichiarata 3-4 ore ma sommando i tempi del procedimento risulta circa 3 ore e 20 minuti | Aggiustare dichiarazione iniziale a '3-3.5 ore' per coerenza | 🔵 Claude |
| ❌ | Idratazione e Matematica | L'intestazione dichiara 67% di idratazione, ma 335g di acqua su 650g di farina danno un'idratazione del 51.5%. È un errore grave e un impasto al 51.5% sarà troppo duro per una focaccia. | Aumentare l'acqua nell'impasto a 435g per raggiungere il 67% dichiarato, oppure correggere il valore (ma 51.5% resta troppo basso). | 🔴 Gemini |
| ❌ | Salamoia e Cottura | 200g di acqua per la salamoia su 2 teglie è una quantità abnorme. 100g di acqua a teglia, cotti per soli 15 minuti a 230°C, bolliranno l'impasto invece di cuocerlo, lasciandolo crudo e molliccio sul fondo. | Ridurre l'acqua della salamoia a 60-80g TOTALI (30-40g per teglia) per consentire la corretta evaporazione e caramellizzazione. | 🔴 Gemini |
| ❌ | Procedimento (Inserimento Lievito) | Nello step 3 si fa sbriciolare il lievito DOPO che l'acqua (poca) è stata assorbita e il sale inserito. In un impasto al 51% è impossibile distribuire omogeneamente il lievito fresco sbriciolato in questa fase. | Inserire il lievito all'inizio insieme alle farine e alla prima acqua, tenendo il sale alla fine. | 🔴 Gemini |
| ⚠️ | Scelta Farine | 250g di Manitoba (W400) + 400g di farina media è un blend estremamente forte per una Focaccia Genovese, che per tradizione richiede farine deboli (W260-280 max) per risultare friabile e non gommosa. | Sostituire la Manitoba usando solo farina W260-280 per l'intero impasto. | 🔴 Gemini |

## 🔴 Revisione Gemini

**Verdetto**: 🔴 Forte disaccordo
**Adjustment**: -35

Claude ha assegnato un punteggio altissimo mancando errori strutturali fatali. L'idratazione reale (51.5%) smentisce quella dichiarata (67%), la sequenza di impastamento è tecnicamente errata e la quantità d'acqua nella salamoia garantisce una focaccia letteralmente bollita e cruda. Ricetta da rivedere pesantemente.

### Issues contestate

| Problema | Verdetto | Motivo |
|---|---|---|
| Sale nell'impasto al 2% (13g su 650g farina totale) - nella norma ma al limite inferiore per focaccia | ❌ Falso positivo | 13g (2%) di sale nell'impasto è giustissimo: la salamoia ne aggiunge altri 10g sulla superficie. Aumentare il sale nell'impasto renderebbe il prodotto finale immangiabile. |
| Malto diastasico 10g citato negli ingredienti ma nel procedimento non si specifica se è in polvere o liquido | ✅ Confermo | Osservazione corretta, 10g di malto in polvere (circa 1.5%) sarebbero eccessivi, probabile si intenda quello liquido. |
| Lievitazione totale dichiarata 3-4 ore ma sommando i tempi del procedimento risulta circa 3 ore e 20 minuti | ❌ Falso positivo | 3 ore e 20 minuti rientrano letteralmente e perfettamente nell'intervallo '3-4 ore'. Segnalazione pedante e inutile. |

---
*Generato: 2026-03-29T00:26:12.194Z | Pipeline: Schema → Claude → Gemini*
