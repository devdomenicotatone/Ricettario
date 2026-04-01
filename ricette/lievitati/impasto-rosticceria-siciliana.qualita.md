# Qualità: Impasto Rosticceria Siciliana

## 🟡 Score Finale: 60/100

| Layer | Score | Dettaglio |
|---|---|---|
| Schema | ❌ Fail | 2 errori, 0 warning |
| Gemini | 65/100 | 🔴 Problematica |

L'idratazione base (50%) e i parametri di cottura sono ideali per la rosticceria siciliana. Tuttavia, la ricetta contiene un grave refuso testuale nel procedimento che porterebbe l'utente ad aggiungere 400g di acqua in eccesso, rovinando irrimediabilmente l'impasto.

## 🔍 Schema Validation

- ❌ Idratazione dichiarata 50% ma calcolata 45% (500g acqua / 1100g farina). Scarto: 5%
- ❌ totalFlour dichiarato 1000g ma somma farine = 1100g (differenza: 100g)

## Problemi trovati

| Sev. | Area | Problema | Correzione |
|------|------|----------|------------|
| ❌ | Dosi | Grave discrepanza sull'acqua tra ingredienti e procedimento. Negli ingredienti sono previsti 500g (Idratazione calcolata: 500g / 1000g = 50%, che è corretta per questo prodotto). Tuttavia, ai punti 3 e 12 del procedimento si chiede di usare prima 500g per il lievito e poi di 'aggiungere gradualmente i restanti 400g di acqua'. Questo porterebbe l'acqua totale a 900g (90% di idratazione), rendendo l'impasto completamente ingestibile per la rosticceria. | Modificare i punti 3 e 12 rimuovendo la frase sull'aggiunta dei 'restanti 400g di acqua', oppure correggere i punti 2 e 11 specificando di sciogliere il lievito solo in 100g di acqua (e aggiungere i restanti 400g dopo). |
| ⚠️ | Coerenza | Nei passaggi 8 e 17 (Farcitura e Modellatura) il procedimento fa uso di ingredienti totalmente assenti nella lista principale: prosciutto cotto, mozzarella, passata di pomodoro, olio e origano. | Aggiungere un nuovo gruppo 'Per la Farcitura' nella lista degli ingredienti elencando i prodotti necessari per riempire rollò, calzoncini e pizzette. |
| 💡 | Gruppi | Tuorlo d'uovo, latte e semi di sesamo sono stati erroneamente inseriti nella categoria 'SOSPENSIONI'. In panificazione le sospensioni sono inclusioni da inglobare all'interno della maglia glutinica (es. uvetta, gocce di cioccolato). | Rimuovere il blocco 'SOSPENSIONI'. Gli ingredienti sono già presenti e correttamente categorizzati nel gruppo 'Per la Finitura'. |

---
*Generato: 2026-04-01T01:52:24.788Z | Pipeline: Schema → Gemini*
