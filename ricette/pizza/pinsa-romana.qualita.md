# Qualità: Pinsa Romana

## 🟡 Score Finale: 72/100

| Layer | Score | Dettaglio |
|---|---|---|
| Schema | ✅ Pass | 0 errori, 1 warning |
| Claude | 92/100 | 🟢 Buona |
| Gemini | 🔴 Forte disaccordo (-20) | L'AI precedente ha elogiato la ricetta mancando due errori t |

Ricetta molto ben strutturata per pinsa romana autentica. Dosi e proporzioni corrette (idratazione 75%, lievito 0.2% per lunga lievitazione), setup adeguato, procedimento dettagliato e tecnicamente corretto. Temperature e tempi appropriati per forno casalingo. Solo piccoli miglioramenti suggeriti su dosaggio sale e chiarezza descrizioni.

## 🔍 Schema Validation

- ⚠️ Categoria "Pizza" senza sezione cottura (bakingSection/cookingSection)

## Problemi trovati

| Sev. | Area | Problema | Correzione | Fonte |
|------|------|----------|------------|-------|
| 💡 | Dosi | Sale al 1.8% su farina totale (18g su 1000g farine) - è al limite minimo per la pizza, tradizionalmente si usa 2-2.5% | Considerare 20-25g di sale per maggiore sapore e struttura | 🔵 Claude |
| 💡 | Coerenza | Nel procedimento al punto 3 si menziona '50g acqua fredda restante' ma l'acqua totale è già stata usata tutta (700g + 50g = 750g) | Chiarire che i 50g finali sono parte dei 750g totali, non aggiuntivi | 🔵 Claude |
| 💡 | Temperature | Range temperature forno 250-260°C ottimale, ma si potrebbe specificare che con pietra refrattaria si può arrivare a 270-280°C nei forni più performanti | Aggiungere nota: 'Con pietra refrattaria preriscaldata si può arrivare a 270-280°C nei forni più potenti' | 🔵 Claude |
| ❌ | Lievitazione / Tempi | Al punto 4 si richiede il raddoppio in 2 ore a 20-22°C con soli 2g di lievito fresco (0.2%). Questo è biologicamente impossibile. Inoltre, se l'impasto raddoppiasse prima di andare in frigo, nelle successive 48h collasserebbe per eccesso di fermentazione. | Modificare il punto 4: 'Lasciare a temperatura ambiente per 1-2 ore (partenza della fermentazione) prima di procedere allo staglio o al frigo, SENZA attendere il raddoppio'. | 🔴 Gemini |
| ❌ | Ingredienti / Forza Farina | La ricetta suggerisce farina tipo 0 con 'W 260-280'. Una farina di media forza non può assolutamente reggere il 75% di idratazione combinato a 48h di maturazione in frigo. La maglia glutinica cederebbe. | Sostituire l'indicazione con una farina di forza: 'W 320-350 (o superiore)' adatta a lunghe maturazioni e alte idratazioni. | 🔴 Gemini |
| ⚠️ | Dosi / Matematica | Il peso totale dell'impasto è circa 1790g. Dividendo per 6 panetti da 270-280g (max 1680g totali) avanzano oltre 100g di impasto non calcolati. | Dividere in 6 panetti da circa 295g, oppure in 7 panetti da circa 255g. | 🔴 Gemini |
| ⚠️ | Cottura / Setup | Contraddizione nel setup: al punto 7 si dice di mettere su teglia con carta forno, mentre nella Cottura si dice di usare la pietra refrattaria. Mettere carta forno o teglie fredde direttamente su una pietra a 260°C è pericoloso (carta) e inefficace (barriera termica). | Chiarire il metodo: o cottura in teglia (senza pietra), o infornare direttamente su pietra tramite una pala infarinata/carta forno sfilata subito. | 🔴 Gemini |

## 🔴 Revisione Gemini

**Verdetto**: 🔴 Forte disaccordo
**Adjustment**: -20

L'AI precedente ha elogiato la ricetta mancando due errori tecnici gravi che porterebbero al fallimento: la forza della farina (W260 è troppo debole per 75% idratazione/48h) e la pretesa di un raddoppio in 2 ore con pochissimo lievito, che rovinerebbe la maturazione a freddo.

### Issues contestate

| Problema | Verdetto | Motivo |
|---|---|---|
| Sale al 1.8% su farina totale al limite minimo | ✅ Confermo | 18g di sale su 1kg di farine è effettivamente basso, specialmente per impasti lunghi dove il sale aiuta anche la tenuta maglica. 20-25g è il target ideale. |
| Incoerenza acqua: al punto 3 menziona 50g ma è già stata usata | ❌ Falso positivo | Claude ha letto male. L'elenco ingredienti dice chiaramente '700g + 50g finali'. Al punto 2 vengono inseriti i primi 700g. Al punto 3 i restanti 50g. È perfettamente coerente. |
| Aggiungere nota su forno a 270-280°C con pietra | ⚠️ Parziale | Vero, ma è un suggerimento di ottimizzazione (Pro Tip), non un vero e proprio difetto della ricetta. |

---
*Generato: 2026-03-29T00:14:55.427Z | Pipeline: Schema → Claude → Gemini*
