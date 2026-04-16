# Qualità: Pizza Napoletana Verace STG

## 🟢 Score Finale: 88/100

| Layer | Score | Dettaglio |
|---|---|---|
| Schema | ✅ Pass | 0 errori, 6 warning |
| Gemini | 88/100 | 🟢 Buona |

Ricetta complessivamente ben strutturata e tecnicamente solida. L'idratazione dichiarata del 65% è corretta (650g acqua / 1000g farina = 65.0%). I problemi principali sono di coerenza testuale: un token errato nel procedimento (token acqua usato per indicare la farina), un token ambiguo nella dose del sale per il pomodoro, e la leggera incoerenza tra il richiamo al disciplinare STG e l'inclusione di ingredienti non previsti. Le temperature, i tempi di lievitazione e le dosi di lievito (0.2% su farina per lievitazione lunga) sono tutti corretti e ben calibrati.

## 🔍 Schema Validation

- ⚠️ Ingrediente "Farina Tipo 0 o 00 Media-Alta Forza" nel gruppo "Per l'Impasto" senza tokenId — il calcolatore dosi non funzionerà correttamente
- ⚠️ Ingrediente "Acqua" nel gruppo "Per l'Impasto" senza tokenId — il calcolatore dosi non funzionerà correttamente
- ⚠️ Ingrediente "Sale Marino Fino" nel gruppo "Per l'Impasto" senza tokenId — il calcolatore dosi non funzionerà correttamente
- ⚠️ Ingrediente "Lievito di Birra Fresco" nel gruppo "Per l'Impasto" senza tokenId — il calcolatore dosi non funzionerà correttamente
- ⚠️ Ingrediente "Zucchero Semolato" nel gruppo "Per l'Impasto" senza tokenId — il calcolatore dosi non funzionerà correttamente
- ⚠️ Ingrediente "Olio Extravergine d'Oliva" nel gruppo "Per l'Impasto" senza tokenId — il calcolatore dosi non funzionerà correttamente

## Problemi trovati

| Sev. | Area | Problema | Correzione |
|------|------|----------|------------|
| ⚠️ | Coerenza | Nel procedimento Fase 1 il token {acqua_impasto:650}g è usato nel contesto '2/3 della farina (circa {acqua_impasto:650}g)' — il riferimento è chiaramente alla farina (dovrebbero essere circa 650g di farina, cioè 2/3 di 1000g), ma il token punta all'acqua dell'impasto. Il token corretto dovrebbe riferirsi alla farina, non all'acqua. Inoltre 2/3 di 1000g = 667g, non 650g. | Sostituire il token con uno riferito alla farina (es. {farina_impasto:667}g) oppure correggere il testo: 'Aggiungere circa 650g di farina (2/3 del totale)' senza token ambiguo. |
| ⚠️ | Coerenza | Nella sezione CONDIMENTO/SALSA (punto 10), il token {sale_impasto:28}g viene usato nel contesto '4-{sale_impasto:28}g di sale fino' per condire il pomodoro. L'uso del token del sale dell'impasto (28g) per il condimento del pomodoro è semanticamente errato e crea confusione: il range '4-28g di sale' per 400g di pomodoro è eccessivo (28g sarebbe il 7% di sale sul pomodoro). | Indicare una dose fissa e ragionevole per il sale del pomodoro: '4-5g di sale fino' (circa 1-1.2% sui pelati), usando un token dedicato al condimento o un valore esplicito. |
| ⚠️ | Coerenza | Il titolo richiama la 'Pizza Napoletana Verace STG' ma la ricetta include zucchero (5g) e olio EVO (15g) nell'impasto, ingredienti NON previsti dal disciplinare STG (che ammette solo farina, acqua, sale e lievito). La ricetta stessa nota che l'olio è 'non previsto dal disciplinare STG', ma anche lo zucchero non lo è. | Se si vuole mantenere il riferimento STG, spostare zucchero e olio come 'varianti opzionali non STG' chiaramente separate, oppure rinominare la ricetta 'Pizza Napoletana (ispirazione STG)' per evitare incoerenza con il disciplinare. |
| 💡 | Temperature | Nella sezione cottura si indica '280°C ventilato o 300°C statico se disponibile'. La maggior parte dei forni casalinghi ha come massimo 250°C ventilato e 250-280°C statico. 300°C statico è disponibile solo su modelli specifici. Il suggerimento è corretto ma potrebbe creare aspettative irrealistiche per molti utenti. | Aggiungere nota: 'Impostare la temperatura massima disponibile del proprio forno (tipicamente 250-280°C). Se il forno raggiunge 300°C statico, preferire questa modalità.' |
| 💡 | Tempi | Nella Fase 6 si indica che 'i panetti devono triplicare di volume', ma per pizza napoletana il raddoppio abbondante / quasi triplicazione è il target. Un triplicamento effettivo con 2g di lievito fresco su 1kg di farina in 6-8 ore a temperatura ambiente è difficile da raggiungere. Con la lievitazione in frigo 18-24h + 2-3h rinvenimento è più realistico ma comunque ambizioso. | Indicare 'raddoppiare abbondantemente di volume (2-2.5x)' come target più realistico, oppure specificare che il triplicamento si raggiunge più facilmente con il metodo frigo lungo. |
| 💡 | Dosi | Il sale è indicato come 28g (2.8% su 1kg di farina), coerente con il range 2.5-3% dichiarato. Tuttavia il disciplinare STG indica 40-60g di sale per litro d'acqua di impasto, che su 650ml corrisponde a 26-39g. La dose di 28g è nella parte bassa ma corretta. | Nessuna correzione necessaria, solo nota informativa. |

---
*Generato: 2026-04-16T20:21:40.966Z | Pipeline: Schema → Gemini*
