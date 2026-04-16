# Qualità: Migliaccio Napoletano

## 🟢 Score Finale: 95/100

| Layer | Score | Dettaglio |
|---|---|---|
| Schema | ✅ Pass | 0 errori, 11 warning |
| Gemini | 95/100 | 🟢 Buona |

Ricetta eccellente e impeccabile. I bilanciamenti, le istruzioni sui passaggi termici (raffreddamento del semolino) e i dettagli sulla cottura (craquelé superficiale) sono perfetti e rispettano in pieno la tradizione pasticcera napoletana.

## 🔍 Schema Validation

- ⚠️ Ingrediente "Semolino di Grano Duro" nel gruppo "Per il Composto" senza tokenId — il calcolatore dosi non funzionerà correttamente
- ⚠️ Ingrediente "Latte Intero" nel gruppo "Per il Composto" senza tokenId — il calcolatore dosi non funzionerà correttamente
- ⚠️ Ingrediente "Acqua" nel gruppo "Per il Composto" senza tokenId — il calcolatore dosi non funzionerà correttamente
- ⚠️ Ingrediente "Ricotta Vaccina" nel gruppo "Per il Composto" senza tokenId — il calcolatore dosi non funzionerà correttamente
- ⚠️ Ingrediente "Uova Medie" nel gruppo "Per il Composto" senza tokenId — il calcolatore dosi non funzionerà correttamente
- ⚠️ Ingrediente "Zucchero Semolato" nel gruppo "Per il Composto" senza tokenId — il calcolatore dosi non funzionerà correttamente
- ⚠️ Ingrediente "Burro" nel gruppo "Per il Composto" senza tokenId — il calcolatore dosi non funzionerà correttamente
- ⚠️ Ingrediente "Scorza di Arancia" nel gruppo "Per il Composto" senza tokenId — il calcolatore dosi non funzionerà correttamente
- ⚠️ Ingrediente "Baccello di Vaniglia" nel gruppo "Per il Composto" senza tokenId — il calcolatore dosi non funzionerà correttamente
- ⚠️ Ingrediente "Sale Fino" nel gruppo "Per il Composto" senza tokenId — il calcolatore dosi non funzionerà correttamente
- ⚠️ Ingrediente "Zucchero a Velo" nel gruppo "Per la Finitura" senza tokenId — il calcolatore dosi non funzionerà correttamente

## Problemi trovati

| Sev. | Area | Problema | Correzione |
|------|------|----------|------------|
| ❌ | Dosi | L'idratazione dichiarata è 0%, il che è matematicamente inesatto in base alla regola di verifica obbligatoria. Formula completa: (500g Acqua + 500g Latte) / 200g Semolino = 500% ≠ 0% dichiarato. (Considerando solo l'acqua pura: 500g / 200g = 250% ≠ 0%). | Per i dolci al cucchiaio o da pastella l'idratazione standard non è indicativa, ma per coerenza matematica con il sistema va impostata al 500% (liquidi su farina/semola) o disabilitata (N/A). |

---
*Generato: 2026-04-16T19:32:05.094Z | Pipeline: Schema → Gemini*
