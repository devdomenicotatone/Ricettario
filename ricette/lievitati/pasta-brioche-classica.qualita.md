# Qualità: Pasta Brioche Classica

## 🟢 Score Finale: 88/100

| Layer | Score | Dettaglio |
|---|---|---|
| Schema | ✅ Pass | 0 errori, 1 warning |
| Gemini | 88/100 | 🟢 Buona |

Ricetta ben strutturata con procedimento dettagliato e professionale, ottimi consigli tecnici (beurrage progressivo, marinatura aromi, temperatura burro). Le criticità principali: il burro al 18% sulla farina è basso per una 'brioche classica' (tipicamente 40-60%), il lievito al 2% andrebbe differenziato tra opzione T.A. e frigo, e il conteggio dei panetti presenta un piccolo scarto. L'idratazione dichiarata del 54% è corretta con la convenzione standard di contare le uova come liquido al 100%. Nel complesso una ricetta funzionale e ben spiegata, con margine di miglioramento sulla denominazione e sul bilanciamento burro/lievito.

## 🔍 Schema Validation

- ⚠️ Idratazione dichiarata 54% vs calcolata 56% (liquidi non pesati, es. brioche) (scarto 2%)

## Problemi trovati

| Sev. | Area | Problema | Correzione |
|------|------|----------|------------|
| ❌ | Dosi | Idratazione dichiarata 54% NON corrisponde al calcolo reale. Farina totale = 300g + 200g = 500g. Liquidi: latte 90g + uova 180g (circa 75% acqua = 135g) + rum 18g + miele 15g (circa 20% acqua = 3g) = 246g circa. Anche considerando solo i liquidi 'classici' (latte + acqua delle uova): (90 + 135) / 500 = 45%. Considerando TUTTE le uova intere (180g) + latte (90g) come liquidi totali: (180 + 90) / 500 = 54%. Quindi il 54% è calcolato contando le uova intere come liquido al 100%, il che è una convenzione diffusa ma tecnicamente imprecisa. In pasticceria professionale le uova intere contengono circa 74-75% di acqua, quindi l'idratazione reale effettiva sarebbe circa (90 + 135 + 18) / 500 = 48.6%. Tuttavia, poiché la convenzione di contare le uova al 100% è molto comune nelle ricette di brioche, lo scarto dipende dalla convenzione adottata. Con la convenzione uova=100% liquido: (90+180)/500 = 54% ✓ confermato. Il valore è coerente con la convenzione usata. | Nessuna correzione necessaria se si adotta la convenzione uova=100% liquido (diffusissima nei ricettari di brioche). Eventualmente specificare nella ricetta: 'idratazione 54% calcolata considerando le uova intere come liquido'. |
| ⚠️ | Dosi | Sale al 2% sulla farina (10g/500g = 2%). Per un lievitato dolce tipo brioche il sale è solitamente tra 1.5-2%, quindi 2% è al limite alto. Non è un errore, ma considerando che ci sono già 80g di zucchero (16%), il sale potrebbe risultare leggermente percepibile in negativo per palati sensibili. | Valutare di ridurre a 8-9g (1.6-1.8%) per un equilibrio dolce/salato più delicato, oppure mantenere 10g se si preferisce un contrasto sapido più marcato (stile brioche francese tradizionale dove 2% è standard). |
| ⚠️ | Dosi | Lievito di birra fresco al 2% sulla farina (10g/500g). Per una brioche con maturazione lunga in frigo (12-16h, opzione B), il 2% è eccessivo e potrebbe causare sovra-lievitazione e sapore di lievito. Per l'opzione A (3-5h a T.A.) il 2% è appropriato. | Se si usa prevalentemente l'opzione B (frigo 12-16h), ridurre il lievito a 5-7g (1-1.4%). Altrimenti, specificare chiaramente che i 10g sono calibrati per la lievitazione a T.A. e suggerire di dimezzare per la versione con retard in frigo. |
| ⚠️ | Coerenza | Il peso dei panetti è indicato come {panetto_peso:50!}g ciascuno × 18 pezzi = 900g. Ma sommando tutti gli ingredienti dell'impasto: farine 500g + latte 90g + uova 180g + zucchero 80g + sale 10g + burro 90g + lievito 10g + marinatura (15+18+5+5+5 = 48g) = 1008g. Considerando un calo fisiologico durante l'impastamento (evaporazione, residui in ciotola) di circa 3-5%, si ottengono circa 960-980g. Dividendo per 18 panetti: circa 53-54g ciascuno, non 50g. Lo scarto è modesto (~7%) ma 18 pezzi da 50g = 900g, mentre l'impasto reale è circa 980g — avanzano ~80g di impasto. | Correggere a 18 pezzi da circa 54-55g, oppure indicare 'circa 50-55g ciascuno, regolando il numero di pezzi in base al peso effettivo dell'impasto'. In alternativa, portare a 19-20 pezzi da 50g. |
| 💡 | Coerenza | Il titolo e l'introduzione parlano di 'Pasta Brioche Classica' al singolare (come impasto base), ma il procedimento descrive la formatura specifica in palline da 50g e la cottura completa. Sarebbe utile chiarire se è una ricetta per brioche à tête, panini brioche, o un impasto base adattabile. | Aggiungere una breve nota iniziale: 'Questa ricetta produce circa 18 brioche rotonde (panini brioche). L'impasto è adattabile anche a trecce, brioche à tête, o pan brioche in cassetta regolando formatura e tempi di cottura.' |
| 💡 | Dosi | Burro al 18% sulla farina (90g/500g). Per una brioche 'classica', il range tipico è 30-60% sulla farina. Con il 18% siamo nel territorio di un pane arricchito/pan brioche leggero piuttosto che di una vera brioche classica francese (che prevede minimo 40-50% di burro). Il risultato sarà comunque buono ma meno ricco e fondente della brioche tradizionale. | Se si desidera una brioche più fedele alla tradizione francese, aumentare il burro a 150-200g (30-40% sulla farina). Se l'intento è una versione più leggera e gestibile, mantenere 90g ma considerare di rinominare come 'Pan Brioche Leggero' o 'Brioche Light'. |

---
*Generato: 2026-04-16T20:20:17.854Z | Pipeline: Schema → Gemini*
