# Qualità: Migliaccio Napoletano

## 🟢 Score Finale: 90/100

| Layer | Score | Dettaglio |
|---|---|---|
| Schema | ✅ Pass | 0 errori, 11 warning |
| Gemini | 90/100 | 🟢 Buona |

La ricetta è di altissima qualità, tradizionale e ben spiegata. I tempi di cottura, il raffreddamento e le indicazioni tecniche (come evitare lo shock termico con le uova) sono perfetti. Le uniche sbavature riguardano il calcolo dell'idratazione teorica e la ripartizione del burro tra impasto e teglia.

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
| ❌ | Dosi | L'idratazione dichiarata è 0%, ma calcolando i liquidi totali (500g acqua + 500g latte = 1000g) rispetto alla parte farinacea (200g semolino), la formula corretta è: 1000g / 200g * 100 = 500% ≠ 0% dichiarato. | Aggiornare il valore dell'idratazione al 500%, oppure omettere il dato se non gestito dal sistema per i dolci tipo pastella. |
| ⚠️ | Coerenza | Nella lista ingredienti si specifica che i 40g di burro servono 'per l'impasto + imburro teglia'. Tuttavia, nel Procedimento (Punto 2), il token inserisce l'intera dose nella crema ({burro_composto:40}g). Al Punto 5 si chiede di 'Imburrare generosamente', ma tecnicamente non c'è più burro a disposizione. | Aumentare la dose totale di burro a 50g (usandone 40g per l'impasto e 10g per la teglia), oppure modificare il token al punto 2 indicando {burro_composto:30}g e tenendo 10g per lo stampo. |

---
*Generato: 2026-07-27T23:54:24.502Z | Pipeline: Schema → Gemini*
