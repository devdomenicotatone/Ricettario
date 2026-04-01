# Qualità: Focaccia Genovese (Fügassa)

## 🟡 Score Finale: 60/100

| Layer | Score | Dettaglio |
|---|---|---|
| Schema | ❌ Fail | 1 errori, 0 warning |
| Gemini | 60/100 | 🔴 Problematica |

La ricetta presenta un grave errore matematico sull'idratazione dichiarata e un bug critico nel procedimento a mano, dove l'acqua della salamoia viene erroneamente inserita nell'impasto. Le fasi di formatura e cottura sono invece descritte in modo eccellente.

## 🔍 Schema Validation

- ❌ Idratazione dichiarata 67% ma calcolata 82% (535g acqua / 650g farina). Scarto: 15%

## Problemi trovati

| Sev. | Area | Problema | Correzione |
|------|------|----------|------------|
| ❌ | Dosi | L'idratazione dichiarata del 67% è matematicamente errata rispetto alle dosi fornite. Farina totale: 400g (00) + 250g (Manitoba) = 650g. Acqua nell'impasto: 335g. Calcolo reale: 335g / 650g = 51.5% ≠ 67%. (Il valore del 51.5%-55% è peraltro quello corretto per la vera Genovese, poiché l'umidità viene aggiunta dopo con la salamoia). | Correggere l'idratazione dichiarata portandola al 51.5%. |
| ❌ | Coerenza | Errore critico nelle dosi di acqua del PROCEDIMENTO (A Mano). Al Punto 13 si inseriscono 300g di acqua. Al Punto 14 si dice di 'Versare altri {acqua_condimento:200} g di acqua' usando erroneamente l'acqua della salamoia. Al Punto 15 'Versare gli ultimi 5 g'. Il totale dell'acqua inserita a mano arriva così a 505g (idratazione >77%), sballando completamente la ricetta. | Al Punto 14 rimuovere l'inserimento dei 200g di acqua della salamoia e correggere i dosaggi affinché la somma (Punto 13 + 14 + 15) dia esattamente i 335g previsti per l'impasto (es: 300g base + 30g con il sale + 5g finali). |
| ⚠️ | Coerenza | Nei Punti 11 e 23 (Foratura e Condimento), il testo recita 'Versare al centro {olio_evo_impasto:30} g olio'. Viene richiamato il token dell'olio dell'impasto invece di quello dedicato al condimento superficiale (ingrediente 11: 60g totali, ovvero 30g per teglia). | Sostituire il token nei punti 11 e 23 per puntare all'olio destinato alla superficie, non a quello dell'impasto. |

---
*Generato: 2026-04-01T01:56:55.769Z | Pipeline: Schema → Gemini*
