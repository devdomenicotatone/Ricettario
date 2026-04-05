# Qualità: Pane Integrale con Biga di Saccorosso e Miele

## 🔴 Score Finale: 50/100

| Layer | Score | Dettaglio |
|---|---|---|
| Schema | ❌ Fail | 2 errori, 0 warning |
| Gemini | 80/100 | 🟡 Da migliorare |

Ricetta tecnicamente eccellente nella struttura, con un'ottima gestione della biga, dell'autolisi e descrizioni dettagliate della cottura. Presenta però un errore critico nel calcolo matematico dell'idratazione e dei refusi testuali nei passaggi di inserimento ingredienti che necessitano correzione.

## 🔍 Schema Validation

- ❌ Idratazione dichiarata 70% ma calcolata 47% (1861.84g acqua / 3960g farina). Scarto: 23%
- ❌ totalFlour dichiarato 2800g ma somma farine = 3960g (differenza: 1160g)

## Problemi trovati

| Sev. | Area | Problema | Correzione |
|------|------|----------|------------|
| ❌ | Dosi | Idratazione reale calcolata errata rispetto al dichiarato. Calcolo: Acqua totale (360g biga + 1500g impasto finale) = 1860g / Farina totale (800g biga + 1000g integrale + 1000g saccorosso) = 2800g. Il risultato è 1860/2800 = 66.4%, che differisce di oltre il 3% dal 70% dichiarato. | Per ottenere un'idratazione reale del 70%, l'acqua totale deve essere 1960g. L'acqua dell'impasto finale deve quindi essere portata a 1600g (invece di 1500g), ricalcolando di conseguenza anche le quote per autolisi e bassinage. |
| ⚠️ | Coerenza | Nei punti 3 (Spirale) e 13 (A mano), i nomi degli ingredienti e i token/quantità sono confusi e scambiati. Il testo riporta '{acqua_impasto_finale:1500}g Caputo Integrale, {farina_integrale_impasto_finale:1000}g Caputo Saccorosso e 975g di acqua', creando grande confusione su cosa inserire. | Correggere il testo abbinando correttamente token, quantità e nomi degli ingredienti (es: '{farina_integrale_impasto_finale:1000}g di Caputo Integrale, 1000g di Caputo Saccorosso' e specificare l'acqua in modo coerente). |

---
*Generato: 2026-04-05T00:00:48.920Z | Pipeline: Schema → Gemini*
