# Qualità: Focaccia Barese

## 🟡 Score Finale: 70/100

| Layer | Score | Dettaglio |
|---|---|---|
| Schema | ✅ Pass | 0 errori, 1 warning |
| Claude | 88/100 | 🟢 Buona |
| Gemini | 🟡 Parziale disaccordo (-18) | Claude ha ignorato un errore critico: 1 kg di impasto in una |

Ricetta tecnicamente molto solida per focaccia barese. Idratazione 80% corretta, uso appropriato di semola e patate, lievitazione ben calibrata (8g lievito per 3-4h). Temperature e tempi di cottura adeguati per forno casalingo. Setup corretto per il prodotto. Procedimento dettagliato e professionale con ottime indicazioni tecniche.

## 🔍 Schema Validation

- ⚠️ Categoria "Focaccia" senza sezione cottura (bakingSection/cookingSection)

## Problemi trovati

| Sev. | Area | Problema | Correzione | Fonte |
|------|------|----------|------------|-------|
| 💡 | Dosi | Sale leggermente basso: 12g su 500g farine = 2.4%. Standard pugliese per focaccia è 2.5-3% | Portare a 13-15g per sapidità tipica barese | 🔵 Claude |
| 💡 | Coerenza | Nel procedimento si indica 'teglia tonda da 30-32cm o rettangolare 35x25cm' ma non si specifica quale formato privilegiare per la tradizione | Specificare che la teglia rettangolare è più tradizionale per la focaccia barese | 🔵 Claude |
| 💡 | Tempi | Tempo totale spirale indicato 12-15 min ma dalla somma dei singoli step risulta 12-15 min effettivi - coerente ma al limite superiore per impasto così idratato | Precisare che con impasti molto idratati bastano spesso 10-12 min totali | 🔵 Claude |
| ❌ | Proporzioni Impasto/Teglia | Il peso totale dell'impasto è di circa 1055g. Inserire 1 kg di impasto in una singola teglia tonda da 30-32cm (o 35x25) genererà uno spessore enorme (oltre 3-4 cm), creando un prodotto simile a un panettone, non a una focaccia barese. | Dividere l'impasto in due teglie tonde da 28-30 cm (circa 500-550g l'una), oppure utilizzare la dose per la classica 'ruota' gigante da 40 cm. | 🔴 Gemini |
| ⚠️ | Bilanciamento Farine/Idratazione | Gestire un 80% di idratazione + 100g di patate lesse usando per metà semola Senatore Cappelli (nota per avere un glutine molto debole) e una farina 0 di media forza (W240-260) è estremamente rischioso. L'impasto faticherà moltissimo a incordare. | Sostituire la farina 0 con una farina di forza (W300-320) per compensare la debolezza della semola Senatore Cappelli, oppure abbassare l'idratazione iniziale al 70-75%. | 🔴 Gemini |

## 🔴 Revisione Gemini

**Verdetto**: 🟡 Parziale disaccordo
**Adjustment**: -18

Claude ha ignorato un errore critico: 1 kg di impasto in una teglia da 30 cm è il doppio del necessario e rovinerà il prodotto finale. Inoltre, l'IA ha fornito un'informazione storicamente falsa sostenendo che la teglia rettangolare sia più tradizionale di quella tonda.

### Issues contestate

| Problema | Verdetto | Motivo |
|---|---|---|
| Sale leggermente basso: 12g su 500g farine = 2.4%. | ⚠️ Parziale | Vero che la focaccia barese è sapida (spesso al 2.5-3%), ma 2.4% nell'impasto è corretto considerando che ci sono ben 5g di sale grosso aggiunti in superficie. Alzare troppo il sale nell'impasto rischierebbe di renderla salata. |
| Specificare che la teglia rettangolare è più tradizionale per la focaccia barese | ❌ Falso positivo | Totalmente errato. La focaccia barese tradizionale si cuoce rigorosamente nei 'ruoti' tondi di ferro (solitamente dai 30 ai 40 cm di diametro). La teglia rettangolare è un adattamento casalingo moderno. |
| Tempo totale spirale indicato 12-15 min [...] al limite superiore per impasto così idratato | ❌ Falso positivo | 12-15 minuti in una spirale casalinga per incordare un impasto all'80% di idratazione, contenente il 50% di semola e purea di patate, è un tempo assolutamente normale e congruo, non eccessivo. |

---
*Generato: 2026-03-29T00:24:50.783Z | Pipeline: Schema → Claude → Gemini*
