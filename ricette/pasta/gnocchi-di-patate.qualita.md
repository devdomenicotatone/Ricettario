# Qualità: Gnocchi di Patate

## 🟢 Score Finale: 85/100

| Layer | Score | Dettaglio |
|---|---|---|
| Schema | ✅ Pass | 0 errori, 5 warning |
| Gemini | 85/100 | 🟡 Da migliorare |

Ricetta tecnicamente molto valida: le proporzioni farina/patate sono perfette e le note tecniche sulla lavorazione a caldo sono corrette e professionali. Il punteggio è abbassato unicamente dalla mancanza dell'intero gruppo ingredienti dedicato ai condimenti e di alcune incongruenze testuali.

## 🔍 Schema Validation

- ⚠️ Ingrediente "Patate Rosse o Gialle" nel gruppo "Per l'Impasto" senza tokenId — il calcolatore dosi non funzionerà correttamente
- ⚠️ Ingrediente "Farina Tipo 00" nel gruppo "Per l'Impasto" senza tokenId — il calcolatore dosi non funzionerà correttamente
- ⚠️ Ingrediente "Uova Medie" nel gruppo "Per l'Impasto" senza tokenId — il calcolatore dosi non funzionerà correttamente
- ⚠️ Ingrediente "Sale Fino" nel gruppo "Per l'Impasto" senza tokenId — il calcolatore dosi non funzionerà correttamente
- ⚠️ Ingrediente "Semola Rimacinata" nel gruppo "Per l'Impasto" senza tokenId — il calcolatore dosi non funzionerà correttamente

## Problemi trovati

| Sev. | Area | Problema | Correzione |
|------|------|----------|------------|
| ❌ | Coerenza | Nel Procedimento (Step 3) viene richiesto l'inserimento della 'noce moscata (facoltativa)', ma questo ingrediente non è presente nella lista degli ingredienti. | Aggiungere 'Noce moscata q.b. (facoltativa)' nella lista degli ingredienti nel gruppo 'Per l'Impasto'. |
| ❌ | Gruppi | Il Procedimento descrive dettagliatamente due condimenti (Step 8 e 9) con grammature precise (es. 400g passata, 250g pancetta, 600g pomodorini, olio, aglio, parmigiano, basilico), ma l'intera lista degli ingredienti per le salse è assente all'inizio della ricetta. | Creare un nuovo gruppo '── Per i Condimenti ──' nella lista ingredienti e inserire tutti gli elementi citati negli Step 8 e 9 con le relative grammature. |
| 💡 | Coerenza | Nei PRO TIPS viene indicato: 'Se non trovi i marchi suggeriti, cerca qualsiasi farina con il valore W indicato'. Tuttavia, nella lista ingredienti non è suggerito alcun marchio per la farina, ma solo la tipologia (Tipo 00 W 200-220). | Rimuovere il riferimento ai 'marchi suggeriti' dal PRO TIP, oppure aggiungere dei marchi di esempio nella descrizione dell'ingrediente 'Farina Tipo 00'. |

---
*Generato: 2026-04-18T00:26:41.749Z | Pipeline: Schema → Gemini*
