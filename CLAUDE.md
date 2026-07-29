# CLAUDE.md — Ricettario Lab

Istruzioni di progetto per Claude Code (caricate a ogni sessione).
Per stack, comandi e schema delle ricette vedi [README.md](./README.md);
qui c'è solo quello che non si deduce leggendo il codice.

**Questo file è un indice, non un manuale.** Le regole di dettaglio stanno in
`.claude/rules/` e si caricano da sole quando apri un file dell'area
corrispondente. Se stai per lavorare in un'area e la sua regola non è comparsa,
aprila a mano.

| Se tocchi… | Si carica |
|---|---|
| `js/**`, `scripts/**`, `index.html` | `.claude/rules/moduli-condivisi-e-prerendering.md` |
| `ricette/**`, `scripts/build-recipes.js` | `.claude/rules/ricette-tag-e-sensoriale.md` |
| `js/cottura/**`, `dati/cottura/**` | `.claude/rules/calcolatore-cottura.md` |
| `css/**` | `.claude/rules/css-e-cancello.md` |

## Fonti uniche: non duplicarle

Alcune cose in questo progetto sono già state duplicate una volta, e le copie sono
divergute **in silenzio** — markup della homepage diverso a seconda di come ci si
arrivava, pagine statiche senza Pro Tips, tre messaggi di "non trovato" con tre
uscite diverse. Se ti serve un contenuto altrove, **leggilo dalla fonte, non
riscriverlo.**

È il principio da cui discendono quasi tutte le regole di dettaglio: quale sia la
fonte unica di che cosa è scritto nelle regole di `js/**` e di `dati/cottura/**`.

## Il pre-rendering è la ragione di metà dei vincoli

Le pagine di questo sito escono due volte dalle stesse funzioni: una nel browser e
una in Node, dentro `scripts/generate-og.js`. È da qui che viene la garanzia che i
dati strutturati corrispondano a contenuto visibile — e da qui il vincolo che certi
moduli restino **puri** (niente DOM, `window`, `localStorage`, `import.meta`).

Se stai per toccare `js/` o `scripts/`, leggi la regola: rompere quella purezza non
dà un errore chiaro, fa fallire il build in un punto lontano e invoglia a riscrivere
il markup a mano — cioè a creare la seconda copia che divergerà.

## Verifica prima di dire "fatto"

Il progetto **non ha test unitari, di proposito**: il rischio sta quasi tutto
nell'output statico, e lo copre `npm run check` (dati + build + pre-rendering +
controlli su `dist/` e sui fogli di stile).

**Fallo girare davvero prima di dichiarare che una modifica funziona.** Non basta
che il file sia stato scritto.

```bash
npm run check
```

Per verificare il comportamento nel browser usa `npm run preview`, che serve `dist/`
come sarà pubblicato. **`npm run dev` non esegue il pre-rendering**, quindi non
mostra quello che vedono i crawler.

## Deploy

Deploy = `npm run deploy`. **Il push su `main` non pubblica niente**: GitHub Pages
serve dal branch `gh-pages`, aggiornato solo da quel comando.

```bash
npm run deploy
```

Il deploy è preceduto da `npm run check` con `&&`: se i dati sono incoerenti la
pubblicazione si ferma prima di partire. È voluto, non aggirarlo.

**E non si pubblica ciò che non è su GitHub.** `deploy-ghpages.js` chiede al server —
non al riferimento locale, che può essere vecchio di ore — se il ramo corrente è
avanti al suo remoto, e in quel caso si ferma. Il motivo sta nel punto 5 di
[CHECKUP.md](./CHECKUP.md): pubblicare e versionare sono due gesti separati, e si è
arrivati a **diciassette commit esistenti solo sul portatile** mentre undici deploy
erano già partiti da lì — con la CI, che gira sul push a `main`, che non aveva mai
visto quel codice. Se serve pubblicare lo stesso (ramo di prova, macchina senza rete)
la via d'uscita è esplicita: `npm run deploy -- --comunque`.

**Pubblica senza chiedere, se `npm run check` passa.** È il cancello a decidere:
quando è verde, chiudi il lavoro con `npm run deploy` invece di fermarti a domandare.
Se fallisce, non forzare — riporta cosa si è rotto.
*(Indicazione esplicita di Domenico, 25/07/2026.)*

`public/pdf/` (~173 MB di materiale sorgente) è nel `.gitignore` ma Vite copia tutto
`public/` in `dist/`: un plugin in `vite.config.js` lo esclude esplicitamente. Se
tocchi quel plugin, controlla il peso di `dist/`.

## Identità git

Questo repo ha 132 commit storici fatti con `devdomenicotatone@gmail.com` (senza
punto), che **non è collegata all'account GitHub**: quei commit non risultano
attribuiti. L'indirizzo giusto è `dev.domenicotatone@gmail.com` ed è già configurato
in locale. Non cambiarlo, e non "uniformarlo" alla storia vecchia.

## Lingua

Codice, commenti, commit e interfaccia sono in italiano. Mantieni la convenzione,
inclusi i messaggi di commit in stile `tipo(ambito): descrizione`.

<!-- BEGIN:knowledge-base -->
## Knowledge base condivisa

8 file estratti da 4 progetti reali (questo compreso) e verificati contro la
documentazione ufficiale 2026. Ogni pattern porta: problema · snippet verbatim ·
provenienza `progetto file:riga` · quando NON usarlo.

Vive in un **repository separato e privato**, non in una cartella accanto a questa:
<https://github.com/devdomenicotatone/knowledge-base>

```bash
git clone https://github.com/devdomenicotatone/knowledge-base.git ../knowledge-base
```

```bash
claude --add-dir ../knowledge-base
```

I riferimenti qui sotto sono relativi a `../knowledge-base/`. Se l'hai clonata
altrove usa il tuo percorso: **non esiste un percorso valido su ogni macchina**, ed è
il motivo per cui questo blocco non ne indica uno assoluto.

**Non riassumerla a memoria: aprila.** Se stai per scrivere codice in una di queste
aree e non hai letto il file corrispondente in questa sessione, leggilo prima.

| Sto per... | Apri prima |
|---|---|
| Scaffold, app nuova, intervento strutturale | `07-STARTER-KIT.md` |
| Auth, sessioni, chiavi, upload, CSP, header | `01-SICUREZZA.md` |
| Confini di modulo, architettura, test | `02-ARCHITETTURA-E-CODICE.md` |
| CSS, token, breakpoint, modali, form, a11y, SEO | `03-UI-UX-DESIGN.md` |
| Viewport, gesti, PWA, performance | `04-MOBILE-E-PERFORMANCE.md` |
| Schema dati, gestione errori, logging | `05-DATI-E-RESILIENZA.md` |
| `CLAUDE.md`, README, docs, hook, CI, rituale di lavoro | `06-DX-E-AGENTI-AI.md` |
| Dire "fatto" | `00-INDICE.md` § DA NON RIPETERE MAI |

Se citi un pattern, cita la provenienza; se non sai citarla, non l'hai letto. Gli
snippet sono verbatim salvo dove compare `[...]`: copiali, non parafrasarli. Se la KB
e questo codice sono in disaccordo, fermati e dillo all'utente — uno dei due è
invecchiato.
<!-- END:knowledge-base -->
