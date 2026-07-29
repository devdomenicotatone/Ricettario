---
paths:
  - "css/**/*.css"
---

# CSS: i quattro controlli del cancello

Il CSS è **l'unica parte che si rompe senza dire niente**: nessun errore, nessun crash, solo
una pagina che sembra un po' storta. Per questo ha quattro controlli suoi nella sezione 9 di
`scripts/verifica-build.js`, eseguiti da `npm run check`.

1. **Ogni `var(--x)` deve avere una `--x` definita.**
2. **Ogni classe dichiarata deve comparire in qualche markup** (niente CSS morto).
3. **Ogni foglio deve dichiarare il layer della sua cartella** (`css/pages/` → `@layer pages`).
   `css/base/` è esente, perché ne ha due per scelta.
4. **Ogni breakpoint deve essere fra quelli elencati** nel blocco «── BREAKPOINT» in testa a
   `css/base/tokens.css`, tutti `min-width`. Quel blocco è l'unica fonte delle soglie: il
   cancello lo legge da lì invece di tenerne una copia. Se ti serve una soglia nuova,
   aggiungila lì **con il suo perché**.

## Quando uno dei quattro si lamenta

- Se aggiungi una classe che il JavaScript compone a runtime — come `piano--${percorso}` — il
  cancello non può vederla: va dichiarato il prefisso in `PREFISSI_A_RUNTIME`, **non silenziato
  il controllo**.
- Un foglio senza `@layer` è un errore, non una svista veniale: le regole fuori dai layer
  battono tutte quelle dentro, qualunque sia la specificità.
- `720px` sembra un `769px` scritto male e non lo è: il tablet in verticale è largo 768, quindi
  769 lo escluderebbe. **Le soglie non si «uniformano» a occhio.**
