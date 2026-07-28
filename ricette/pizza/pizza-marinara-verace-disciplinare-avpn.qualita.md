# Qualità: Pizza Marinara Verace — Disciplinare AVPN

## 🟢 Score Finale: 95/100

| Layer | Score | Dettaglio |
|---|---|---|
| Schema | ✅ Pass | 0 errori, 0 warning |
| Gemini | 95/100 | 🟢 Buona |

Ricetta formulata in modo eccellente, scientificamente ineccepibile e perfettamente allineata al disciplinare AVPN. Il check dell'idratazione conferma il 58.82% (1000g / 1700g), pienamente in tolleranza con il 58% dichiarato. L'unica sbavatura riguarda la scalatura asimmetrica tra l'impasto (per ~11 pizze) e il condimento (per 1 pizza).

## Problemi trovati

| Sev. | Area | Problema | Correzione |
|------|------|----------|------------|
| ⚠️ | Dosi | Discrepanza nelle rese: il totale degli ingredienti dell'impasto (2751g) produce circa 10-11 panetti da 250g, ma le dosi del 'Condimento Marinara' (85g di pelati, 7g di olio) sono calibrate per una sola pizza. | Allineare le dosi del condimento alla resa dell'impasto moltiplicandole per 10-11 (es. 850g di pelati, 70g di olio), oppure specificare chiaramente nell'intestazione del gruppo che le dosi fornite per il condimento valgono per un singolo disco. |
| 💡 | Coerenza | Al passaggio 13 viene indicato l'uso del basilico ('qualche foglia di basilico fresco') e nella lista ingredienti è presente a 2g, ma nel testo manca il token dinamico per farlo scalare nel frontend. | Modificare l'ultima frase del passaggio 13 in: 'È possibile aggiungere {basilico_condimento:2}g di foglie di basilico fresco.' |

---
*Generato: 2026-07-27T23:51:14.305Z | Pipeline: Schema → Gemini*
