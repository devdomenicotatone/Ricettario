/**
 * Deploy su GitHub Pages — push incrementale con orphan branch
 * 
 * Strategia:
 * - Primo deploy: crea orphan branch gh-pages con solo il contenuto di dist/
 * - Deploy successivi: aggiorna il branch e pusha solo il delta
 * 
 * Usa un worktree separato in C:\tmp\ghp per:
 * 1. Non inquinare il repo principale
 * 2. Evitare "Filename too long" su Windows (path corto)
 */

import { execSync } from 'child_process';
import { existsSync, writeFileSync, mkdirSync, rmSync, cpSync, readdirSync } from 'fs';
import { join, resolve } from 'path';

const PROJECT_DIR = process.cwd();
const DIST_DIR = join(PROJECT_DIR, 'dist');
const ARGOMENTI = process.argv.slice(2);
// Le opzioni non sono il messaggio di commit: senza questo filtro
// `npm run deploy -- --comunque` finiva a fare `git commit -m "--comunque"`.
const COMMIT_MSG = ARGOMENTI.find(a => !a.startsWith('--')) || 'deploy: aggiornamento GitHub Pages';
const COMUNQUE = ARGOMENTI.includes('--comunque');
const DEPLOY_DIR = 'C:\\tmp\\ghp-ricettario';

function run(cmd, cwd = PROJECT_DIR) {
    console.log(`   → ${cmd}`);
    return execSync(cmd, {
        cwd,
        stdio: 'inherit',
        timeout: 600_000,
        env: { ...process.env, GIT_TERMINAL_PROMPT: '0' }
    });
}

function runSilent(cmd, cwd = PROJECT_DIR) {
    try {
        return execSync(cmd, {
            cwd,
            stdio: 'pipe',
            encoding: 'utf8',
            timeout: 30_000,
            env: { ...process.env, GIT_TERMINAL_PROMPT: '0' }
        }).trim();
    } catch {
        return '';
    }
}

/**
 * Non si pubblica quello che non è su GitHub.
 *
 * PERCHÉ ESISTE
 * `npm run deploy` scrive su `gh-pages` senza chiedere niente a `main`:
 * pubblicare e versionare sono due gesti separati, quindi il sito online può
 * restare l'unico posto al mondo in cui un lavoro esiste — e contiene il
 * *risultato*, non i sorgenti. Il 28/07/2026 sono arrivati a diciassette i
 * commit presenti solo sul portatile mentre undici deploy erano già partiti da
 * lì: la CI, che gira sul push a `main`, non aveva mai visto quel codice.
 * È rientrato per coincidenza — un'altra sessione aperta sullo stesso repo ha
 * spinto e se li è portati dietro — e un rischio che rientra per fortuna va
 * trasformato in un controllo. Punto 5 di CHECKUP.md.
 *
 * COSA CONTROLLA, E COSA NO
 * Solo che il ramo corrente non sia AVANTI al suo remoto. Non pretende che il
 * remoto sia avanti (succede in continuazione quando si lavora su due
 * sessioni), non guarda le modifiche non committate — quelle le vede
 * `npm run check`, che gira prima — e non blocca se il ramo non è `main`.
 *
 * La via d'uscita è esplicita: `npm run deploy -- --comunque`. Serve davvero
 * quando si pubblica da un ramo di prova o senza rete, e chiede di scriverlo
 * invece di aggirare il controllo commentandolo.
 */
function controllaAllineamentoColRemoto() {
    if (COMUNQUE) {
        console.log('⚠️  --comunque: salto il controllo di allineamento con GitHub.\n');
        return;
    }

    const ramo = runSilent('git rev-parse --abbrev-ref HEAD');
    if (!ramo || ramo === 'HEAD') {
        console.error('❌ HEAD staccato: non so quale ramo dovrei confrontare con GitHub.');
        console.error('   Torna su un ramo, o pubblica con: npm run deploy -- --comunque');
        process.exit(1);
    }

    // Il riferimento locale `origin/<ramo>` può essere vecchio di ore e
    // risponderebbe di sì con comodo: si chiede al server.
    const remoto = runSilent(`git ls-remote origin refs/heads/${ramo}`);
    if (!remoto) {
        console.error(`❌ Non riesco a leggere refs/heads/${ramo} da GitHub (rete assente, o il ramo là non esiste).`);
        console.error('   Senza quella risposta non posso garantire che il codice pubblicato esista anche altrove.');
        console.error(`   Spingi il ramo (git push -u origin ${ramo}), oppure: npm run deploy -- --comunque`);
        process.exit(1);
    }

    const hashRemoto = remoto.split(/\s+/)[0];
    const avanti = runSilent(`git rev-list --count ${hashRemoto}..HEAD`);

    if (avanti && Number(avanti) > 0) {
        const quanti = Number(avanti);
        console.error(`❌ ${quanti} commit ${quanti === 1 ? 'è' : 'sono'} solo su questa macchina: `
            + `«${ramo}» è avanti a origin/${ramo}.`);
        console.error('   Pubblicare adesso metterebbe online codice che non esiste su GitHub e che');
        console.error('   la CI non ha mai visto. Se il disco muore, quel lavoro non è da nessuna parte.');
        console.error(`\n   git push origin ${ramo}\n`);
        console.error('   Se è voluto (ramo di prova, deploy senza rete): npm run deploy -- --comunque');
        process.exit(1);
    }

    console.log(`✅ «${ramo}» è allineato con GitHub.`);
}

async function deploy() {
    console.log('🚀 Deploy su GitHub Pages...\n');

    // Per primo, perché è l'unico che decide SE pubblicare: gli altri
    // controllano che la build sia completa, questo che il lavoro esista anche
    // fuori da questa macchina. Vuole `origin`, e basta quello.
    if (!runSilent('git remote get-url origin')) {
        console.error('❌ Nessun remote "origin" configurato.');
        process.exit(1);
    }
    controllaAllineamentoColRemoto();

    if (!existsSync(DIST_DIR)) {
        console.error('❌ Cartella dist/ non trovata. Esegui prima "vite build".');
        process.exit(1);
    }

    // Prepara file speciali in dist/
    const nojekyll = join(DIST_DIR, '.nojekyll');
    if (!existsSync(nojekyll)) writeFileSync(nojekyll, '');

    // Qui, se mancava il 404, si copiava index.html. Il risultato era la
    // homepage intera servita sotto qualunque indirizzo sbagliato: contenuto
    // buono con status 404 addosso, cioè il soft 404 che il sito ha già avuto,
    // stampato su disco. Il file giusto è public/404.html — lo shim che
    // rimanda alla SPA — e Vite lo copia in dist/: se non c'è, è la build a
    // essere incompleta, e fabbricarne uno finto nasconde il problema.
    const notFoundPath = join(DIST_DIR, '404.html');
    if (!existsSync(notFoundPath)) {
        console.error('❌ dist/404.html non trovato: deve arrivare da public/404.html. Esegui `npm run check`.');
        process.exit(1);
    }

    // Già validato in testa: qui serve solo il valore.
    const remoteUrl = runSilent('git remote get-url origin');

    // Identità da propagare al repo di deploy: è un repo a sé e non eredita
    // nulla da questo. Senza, `git commit` fallisce quando la macchina non ha
    // una config globale — ed è così che si finisce per committare con
    // un'email non collegata all'account GitHub.
    const authorName = runSilent('git config user.name');
    const authorEmail = runSilent('git config user.email');
    if (!authorName || !authorEmail) {
        console.error('❌ Identità git non configurata in questo repo. Imposta:');
        console.error('   git config user.name "..." && git config user.email "..."');
        process.exit(1);
    }

    // Strategia: repo separato dedicato solo a gh-pages
    const repoReady = existsSync(join(DEPLOY_DIR, '.git'));

    if (!repoReady) {
        console.log('📦 Primo deploy: inizializzo repo dedicato...');
        
        // Pulisci eventuale cartella residua
        if (existsSync(DEPLOY_DIR)) {
            rmSync(DEPLOY_DIR, { recursive: true, force: true });
        }
        mkdirSync(DEPLOY_DIR, { recursive: true });

        // Inizializza repo vuoto con orphan branch
        run('git init', DEPLOY_DIR);
        run('git config core.longpaths true', DEPLOY_DIR);
        run(`git remote add origin ${remoteUrl}`, DEPLOY_DIR);
        run('git checkout --orphan gh-pages', DEPLOY_DIR);
    } else {
        console.log('📦 Push incrementale su gh-pages (solo delta)...');
    }

    // Riallineata a ogni deploy, non solo alla creazione del repo.
    run(`git config user.name "${authorName}"`, DEPLOY_DIR);
    run(`git config user.email "${authorEmail}"`, DEPLOY_DIR);

    // Pulisci contenuto vecchio del deploy dir (tranne .git)
    const entries = readdirSync(DEPLOY_DIR);
    for (const entry of entries) {
        if (entry === '.git') continue;
        rmSync(join(DEPLOY_DIR, entry), { recursive: true, force: true });
    }

    // Copia dist/ nel deploy dir
    console.log('📋 Copio dist/ nel repo di deploy...');
    cpSync(DIST_DIR, DEPLOY_DIR, { recursive: true });

    // Committa e pusha
    run('git add -A', DEPLOY_DIR);

    const status = runSilent('git status --porcelain', DEPLOY_DIR);
    if (!status) {
        console.log('\n✅ Nessuna modifica. Il sito è già aggiornato.');
        return;
    }

    run(`git commit -m "${COMMIT_MSG}"`, DEPLOY_DIR);
    
    console.log('🚀 Push su gh-pages...');
    run('git push origin gh-pages --force', DEPLOY_DIR);

    console.log('\n✅ Deploy completato!');
    console.log('🌐 https://devdomenicotatone.github.io/Ricettario/');
}

deploy();
