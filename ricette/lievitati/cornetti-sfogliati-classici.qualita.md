# Qualità: Cornetti Sfogliati Classici

## 🟢 Score Finale: 80/100

| Layer | Score | Dettaglio |
|---|---|---|
| Schema | ✅ Pass | 0 errori, 0 warning |
| Claude | 88/100 | 🟢 Buona |
| Gemini | 🟡 Parziale disaccordo (-8) | Claude ha penalizzato la ricetta per falsi problemi di matem |

Ricetta tecnicamente molto solida per cornetti sfogliati. Setup corretto, temperature adeguate, procedimento dettagliato e professionale. Lievi ottimizzazioni possibili su lievito e sale. Eccellente gestione della sfogliatura e parametri di cottura appropriati per forno casalingo.

## Problemi trovati

| Sev. | Area | Problema | Correzione | Fonte |
|------|------|----------|------------|-------|
| 💡 | Dosi | Percentuale lievito (3.6%) alta per lievitazione lunga 18-24h - tipicamente si usa 1-2% | Considerare riduzione a 12-15g per maturazione più equilibrata | 🔵 Claude |
| ⚠️ | Coerenza | Nel step 1 si usano 150g di latte, restanti 50g al step 2, ma ingredienti indicano 200g totali | Verificare: 150g+50g=200g è corretto, ma chiarire meglio la suddivisione | 🔵 Claude |
| 💡 | Dosi | Sale al 2% - considerare aumento al 2.2-2.5% per bilanciare la dolcezza | Portare sale a 11-12g per equilibrio gustativo ottimale | 🔵 Claude |
| ❌ | Sfogliatura | Numero di pieghe insufficiente. La ricetta indica 2 pieghe semplici (9 strati) definendo la terza 'opzionale'. 9 strati non formano un cornetto sfogliato, ma una pasta brioche burrosa. Ne servono 3 obbligatorie (27 strati). | Rendere la terza piega semplice obbligatoria (o usare 1 doppia + 1 semplice). | 🔴 Gemini |
| ❌ | Lievitazione | Temperatura di appretto troppo alta (26-28°C al punto 12). A 28°C il burro bavarese (che fonde intorno ai 28-30°C) inizierà a trasudare, rovinando la sfogliatura. | Abbassare la temperatura di appretto a 24-26°C massimo (idealmente 25°C). | 🔴 Gemini |
| ⚠️ | Gestione Impasto | Maturazione lunga (12h) *dopo* le pieghe (Punto 9). Riposare 12h dopo l'ultima piega renderà la stesura finale quasi impossibile per via del glutine tenace e del burro pietrificato. | La maturazione lunga va fatta sul pastello *prima* della sfogliatura, oppure i cornetti vanno formati subito e messi a lievitare. | 🔴 Gemini |
| 💡 | Intestazione | Idratazione dichiarata al 52%. Nei lievitati si calcola [Liquidi totali / Farina]. Qui abbiamo 200g latte + 110g uova = 310g liquidi su 500g farina (62% di idratazione). Il 52% considera solo l'acqua pura, non standard in pasticceria. | Correggere l'idratazione in intestazione a 62%. | 🔴 Gemini |

## 🔴 Revisione Gemini

**Verdetto**: 🟡 Parziale disaccordo
**Adjustment**: -8

Claude ha penalizzato la ricetta per falsi problemi di matematica e percentuali di sale, mancando invece gli errori tecnici più gravi: 2 pieghe semplici non bastano per sfogliare un cornetto e lievitare a 28°C farà sciogliere il burro.

### Issues contestate

| Problema | Verdetto | Motivo |
|---|---|---|
| Nel step 1 si usano 150g di latte, restanti 50g al step 2, ma ingredienti indicano 200g totali | ❌ Falso positivo | La ricetta è cristallina: al punto 1 dice chiaramente '150g dei 200g totali' e al punto 2 'il latte restante (50g)'. Non c'è alcuna incoerenza da sistemare. |
| Sale al 2% - considerare aumento al 2.2-2.5% per bilanciare la dolcezza | ❌ Falso positivo | Il 2% di sale (10g su 500g di farina) è il gold standard assoluto per i grandi lievitati e la viennoiserie dolce. Portarlo al 2.5% renderebbe il cornetto sapido. |
| Percentuale lievito (3.6%) alta per lievitazione lunga 18-24h | ⚠️ Parziale | È vero che per 24h il lievito può sembrare alto, ma nella viennoiserie sfogliata gran parte del tempo è a 4°C (dove il lievito si ferma) e i grassi rallentano l'attività. 15-18g è una dose standard. |

---
*Generato: 2026-03-29T00:19:50.228Z | Pipeline: Schema → Claude → Gemini*
