# Qualità: Cartocci alla Crema Siciliani

## 🟢 Score Finale: 85/100

| Layer | Score | Dettaglio |
|---|---|---|
| Schema | ✅ Pass | 0 errori, 16 warning |
| Gemini | 85/100 | 🟡 Da migliorare |

La ricetta è tecnicamente eccellente: dosi, idratazione (45.4%), temperature di impastamento e frittura sono perfette. Sono presenti però alcuni errori di assegnazione dei token nel testo e un palese copia-incolla nella sezione conservazione.

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
| ⚠️ | Setup | Al punto 7 del procedimento è presente un token errato: '40-{semola_impasto:50}g'. La semola non fa parte della ricetta. | Sostituire il token errato con il valore testuale '50' o con un token generico di peso. |
| ⚠️ | Setup | Al punto 12, per indicare la dose della ricotta, è stato usato per errore il token della farina: '{farina_media_impasto:500}g di ricotta'. | Sostituire con il token corretto per la ricotta, ad esempio '{ricotta_fresca:500}g', oppure usare il valore fisso '500g'. |
| 💡 | Coerenza | Nella sezione CONSERVAZIONE si parla di 'gusci fritti (le scorze)' e di preservare/ripristinare la loro 'croccantezza' rigenerandoli in forno. Questo testo appartiene chiaramente ai Cannoli. I Cartocci (o macallè) sono brioche fritte lievitate e devono essere soffici, non croccanti. | Riscrivere la sezione CONSERVAZIONE eliminando i riferimenti a 'scorze' e 'croccantezza'. Spiegare che, essendo un lievitato fritto, va consumato in giornata per godere della sua morbidezza. |

---
*Generato: 2026-07-27T23:49:50.938Z | Pipeline: Schema → Gemini*
