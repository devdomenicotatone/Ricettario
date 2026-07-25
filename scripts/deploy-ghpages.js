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
import { existsSync, writeFileSync, readFileSync, mkdirSync, rmSync, cpSync, readdirSync } from 'fs';
import { join, resolve } from 'path';

const PROJECT_DIR = process.cwd();
const DIST_DIR = join(PROJECT_DIR, 'dist');
const COMMIT_MSG = process.argv[2] || 'deploy: aggiornamento GitHub Pages';
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

async function deploy() {
    console.log('🚀 Deploy su GitHub Pages...\n');

    if (!existsSync(DIST_DIR)) {
        console.error('❌ Cartella dist/ non trovata. Esegui prima "vite build".');
        process.exit(1);
    }

    // Prepara file speciali in dist/
    const nojekyll = join(DIST_DIR, '.nojekyll');
    if (!existsSync(nojekyll)) writeFileSync(nojekyll, '');

    const indexPath = join(DIST_DIR, 'index.html');
    const notFoundPath = join(DIST_DIR, '404.html');
    if (existsSync(indexPath) && !existsSync(notFoundPath)) {
        writeFileSync(notFoundPath, readFileSync(indexPath, 'utf8'));
    }

    // Ottieni URL remoto
    const remoteUrl = runSilent('git remote get-url origin');
    if (!remoteUrl) {
        console.error('❌ Nessun remote "origin" configurato.');
        process.exit(1);
    }

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
