# materiale/ — roba tenuta, non pubblicata

Qui stanno le immagini che il progetto conserva ma che **nessuna pagina usa**.

## Perché non stanno in `public/`

Vite copia `public/` per intero in `dist/`, e `dist/` è quello che finisce
online: basta appoggiare un file in `public/` perché venga pubblicato per
sempre, senza che una riga di codice lo nomini. È già successo — 34 file per
386 KB, online per mesi senza che se ne accorgesse nessuno.

Da `materiale/` invece non passa niente: la cartella non entra nella build.
I file restano nel repo e nella storia git, quindi non si perde nulla.

## Cosa c'è dentro

- **`trafile/`** — 26 foto delle trafile per la Philips Serie 7000. Materiale
  per una pagina sulle trafile che non esiste (ancora).
- **`strumenti/`** — le foto degli strumenti che la homepage non mostra. Oggi
  la sezione "Strumenti" ha un solo riquadro grande, con la Famag Grilletta: la
  sua foto è rimasta in `public/images/strumenti/` perché è l'unica usata. Qui
  ci sono la Fimar PF25E, la Philips Serie 7000 e le varianti `-detail`, pronte
  se un giorno la sezione diventa una griglia.

## Se ti servono

Spostale in `public/images/…` **e referenziale nella pagina**. Se le sposti e
basta, `npm run check` te lo dice: c'è un controllo che elenca le risorse
pubblicate che nessuno nomina, ed è nato proprio da questi file.
