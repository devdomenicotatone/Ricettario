# Qualità: Pane Pugliese con Biga

## 🟡 Score Finale: 60/100

| Layer | Score | Dettaglio |
|---|---|---|
| Schema | ❌ Fail | 1 errori, 1 warning |
| Claude | 88/100 | 🟢 Buona |

Ricetta tecnicamente solida con procedimenti dettagliati e ben strutturati per entrambi i metodi. L'unico problema significativo è lo scarto del 7.5% tra idratazione dichiarata e calcolata. Dosi di lievito e sale corrette, temperature appropriate per forno casalingo. Ottima descrizione delle tecniche specifiche per biga e semola rimacinata.

## 🔍 Schema Validation

- ❌ Idratazione dichiarata 70% ma calcolata 66% (330g acqua / 500g farina). Scarto: 4%
- ⚠️ Campo sconosciuto: "_generatedBy" — non presente nello schema

## Problemi trovati

| Sev. | Area | Problema | Correzione | Fonte |
|------|------|----------|------------|-------|
| ⚠️ | Dosi | Idratazione calcolata 62.5% vs 70% dichiarata - scarto significativo | Correggere idratazione dichiarata a 62-63% o aumentare acqua impasto a 375g per raggiungere 70% | 🔵 Claude |
| 💡 | Coerenza | Lievito biga 0.1% corretto ma molto basso per 18-24h a 20-22°C | Considerare 0.2-0.3g per maggiore sicurezza o specificare ambiente più fresco 16-18°C | 🔵 Claude |
| 💡 | Tempi | Tempo appretto diverso tra spirale (1.5-2h) e mano (2-2.5h) | Unificare i tempi o spiegare la differenza dovuta al diverso sviluppo glutinico | 🔵 Claude |

---
*Generato: 2026-04-01T00:07:04.592Z | Pipeline: Schema → Claude → Gemini*
