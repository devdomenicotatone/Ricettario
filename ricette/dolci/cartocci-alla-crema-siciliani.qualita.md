# Qualità: Cartocci alla Crema Siciliani

## 🟢 Score Finale: 90/100

| Layer | Score | Dettaglio |
|---|---|---|
| Schema | ✅ Pass | 0 errori, 16 warning |
| Gemini | 90/100 | 🟢 Buona |

Ricetta eccellente e tecnicamente ineccepibile sotto il profilo culinario. L'idratazione calcolata (250g acqua / 550g farina = 45.4%) conferma il valore dichiarato. Le temperature di frittura, la gestione degli amidi nella crema e le fasi di impastamento sono perfette. Piccole imprecisioni matematiche sulla divisione in pezzatura e nella mappatura dei placeholder.

## 🔍 Schema Validation

- ⚠️ Ingrediente "Farina Tipo 00 Media Forza" nel gruppo "Per l'Impasto" senza tokenId — il calcolatore dosi non funzionerà correttamente
- ⚠️ Ingrediente "Acqua" nel gruppo "Per l'Impasto" senza tokenId — il calcolatore dosi non funzionerà correttamente
- ⚠️ Ingrediente "Strutto" nel gruppo "Per l'Impasto" senza tokenId — il calcolatore dosi non funzionerà correttamente
- ⚠️ Ingrediente "Zucchero Semolato" nel gruppo "Per l'Impasto" senza tokenId — il calcolatore dosi non funzionerà correttamente
- ⚠️ Ingrediente "Sale Fino" nel gruppo "Per l'Impasto" senza tokenId — il calcolatore dosi non funzionerà correttamente
- ⚠️ Ingrediente "Lievito di Birra Fresco" nel gruppo "Per l'Impasto" senza tokenId — il calcolatore dosi non funzionerà correttamente
- ⚠️ Ingrediente "Uovo Intero Medio" nel gruppo "Per l'Impasto" senza tokenId — il calcolatore dosi non funzionerà correttamente
- ⚠️ Ingrediente "Latte Intero" nel gruppo "Per la Farcitura" senza tokenId — il calcolatore dosi non funzionerà correttamente
- ⚠️ Ingrediente "Scorza di Limone Grattugiata" nel gruppo "Per la Farcitura" senza tokenId — il calcolatore dosi non funzionerà correttamente
- ⚠️ Ingrediente "Tuorli d'Uovo" nel gruppo "Per la Farcitura" senza tokenId — il calcolatore dosi non funzionerà correttamente
- ⚠️ Ingrediente "Zucchero Semolato" nel gruppo "Per la Farcitura" senza tokenId — il calcolatore dosi non funzionerà correttamente
- ⚠️ Ingrediente "Maizena" nel gruppo "Per la Farcitura" senza tokenId — il calcolatore dosi non funzionerà correttamente
- ⚠️ Ingrediente "Ricotta Fresca" nel gruppo "Per la Farcitura" senza tokenId — il calcolatore dosi non funzionerà correttamente
- ⚠️ Ingrediente "Zucchero a Velo" nel gruppo "Per la Farcitura" senza tokenId — il calcolatore dosi non funzionerà correttamente
- ⚠️ Ingrediente "Gocce di Cioccolato Fondente" nel gruppo "Per la Farcitura" senza tokenId — il calcolatore dosi non funzionerà correttamente
- ⚠️ Ingrediente "Zucchero Semolato" nel gruppo "Per la Farcitura" senza tokenId — il calcolatore dosi non funzionerà correttamente

## Problemi trovati

| Sev. | Area | Problema | Correzione |
|------|------|----------|------------|
| 💡 | Dosi | Il peso totale dell'impasto generato dalle dosi è di circa 985g (550+250+70+50+8+7+50). Nel passaggio 7 si indica di dividere l'impasto in 'pezzi da 40-50g ciascuno (circa 16 pezzi)'. Matematicamente, 16 pezzi da 40-50g coprono solo 640-800g di impasto. Per ottenere 16 pezzi da 985g, ogni pezzo dovrebbe pesare circa 60-62g. | Modificare il passaggio 7 indicando 'Dividere in pezzi da circa 60g ciascuno (circa 16 pezzi)' oppure aggiornare il numero di pezzi previsti a 'circa 20-22 pezzi'. |
| ⚠️ | Coerenza | Nel procedimento sono presenti errori di associazione nei token dinamici: al passaggio 7 viene richiamato il token '{semola_impasto:50}g', ma non c'è semola negli ingredienti. Al passaggio 12 la ricotta viene associata al token della farina ('{farina_media_impasto:500}g di ricotta'). Questo corromperà il calcolo dinamico delle dosi nel sistema. | Correggere i nomi dei token per farli combaciare con gli ingredienti: usare un token di formato fisso per il peso al passaggio 7 (es. '{peso_pezzo:50!}') e il token corretto per la ricotta al passaggio 12 (es. '{ricotta_fresca:500}'). |

---
*Generato: 2026-04-16T19:31:40.981Z | Pipeline: Schema → Gemini*
