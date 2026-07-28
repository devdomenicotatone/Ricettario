# Qualità: Focaccia Genovese (Fügassa)

## 🟢 Score Finale: 80/100

| Layer | Score | Dettaglio |
|---|---|---|
| Schema | ❌ Fail | 1 errori, 0 warning |
| Gemini | 95/100 | 🟢 Buona |

Ricetta eccellente e fedelissima al vero metodo ligure (tempi di riposo, stesura in più fasi e salamoia finale sono perfetti). La verifica matematica dell'idratazione conferma il 51.5% dichiarato (335g acqua / 650g farina). Segnalata solo un'ottimizzazione per il parsing dei token.

## 🔍 Schema Validation

- ❌ Mismatch dosi per token "olio_superficie": nel testo c'è {olio_superficie:30}, ma negli ingredienti grams = 60

## Problemi trovati

| Sev. | Area | Problema | Correzione |
|------|------|----------|------------|
| 💡 | Coerenza | Al punto 11 del procedimento viene usato il token {olio_superficie:30} g accompagnato da '100 g salamoia'. Sebbene matematicamente corretto per una singola teglia (essendocene 2), l'ingrediente in lista è da 60 g. L'uso di un token con valore dimezzato rispetto alla lista ingredienti potrebbe causare errori di scalabilità nel calcolatore del frontend. | Modificare la frase al punto 11 riferendosi al totale: 'Versare al centro di ogni teglia metà dell'olio ({olio_superficie:60} g in totale) e metà della salamoia.' |

---
*Generato: 2026-07-27T23:54:49.550Z | Pipeline: Schema → Gemini*
