/**
 * Deploy personalizzato su GitHub Pages
 * 
 * Strategia:
 *   1. PRIMA: usa `gh-pages` (veloce, push diretto)
 *   2. FALLBACK: clone manuale del branch gh-pages (lento ma robusto)
 *      Necessario quando gh-pages ha bug ENAMETOOLONG su Windows
 */

import { execSync } from 'child_process';
import { cpSync, existsSync, mkdirSync, rmSync, readdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';

const DIST_DIR = join(process.cwd(), 'dist');
const TEMP_DIR = join(tmpdir(), 'gh-pages-deploy');
const COMMIT_MSG = process.argv[2] || 'deploy: aggiornamento GitHub Pages';

function run(cmd, cwd) {
    try {
        return execSync(cmd, {
            cwd,
            stdio: 'pipe',
            encoding: 'utf8',
            timeout: 60_000,
            env: { ...process.env, GIT_TERMINAL_PROMPT: '0' }
        });
    } catch (e) {
        if (e.stdout) return e.stdout;
        throw e;
    }
}

function runVisible(cmd, cwd) {
    execSync(cmd, {
        cwd,
        stdio: 'inherit',
        timeout: 120_000,
        env: { ...process.env, GIT_TERMINAL_PROMPT: '0' }
    });
}

function getRemoteUrl() {
    return run('git remote get-url origin', process.cwd()).trim();
}

// ═══════════════════════════════════════════════════
// METODO 1: gh-pages (veloce)
// ═══════════════════════════════════════════════════
async function deployFast() {
    console.log('⚡ Metodo veloce: gh-pages...');
    
    const ghpages = await import('gh-pages');
    const { publish } = ghpages;
    
    // Pulisci cache stale (causa "local changes would be overwritten")
    console.log('   🧹 Pulizia cache gh-pages...');
    try { ghpages.clean(); } catch {}
    
    return new Promise((resolve, reject) => {
        publish('dist', {
            branch: 'gh-pages',
            message: COMMIT_MSG,
            dotfiles: true,  // include .nojekyll
            add: false,      // sostituisci tutto, non aggiungere
            force: true,     // forza push
        }, (err) => {
            if (err) reject(err);
            else resolve();
        });
    });
}

// ═══════════════════════════════════════════════════
// METODO 2: Clone manuale (fallback robusto)
// ═══════════════════════════════════════════════════
async function deployClone() {
    console.log('🔧 Fallback: clone manuale...\n');
    
    const remoteUrl = getRemoteUrl();
    console.log(`📦 Remote: ${remoteUrl}`);

    // Pulisci temp
    if (existsSync(TEMP_DIR)) {
        rmSync(TEMP_DIR, { recursive: true, force: true });
    }

    // Clona branch gh-pages (shallow)
    console.log('📥 Clono branch gh-pages...');
    try {
        runVisible(`git clone --branch gh-pages --single-branch --depth 1 "${remoteUrl}" "${TEMP_DIR}"`);
    } catch {
        console.log('⚠️  Branch gh-pages non trovato, ne creo uno nuovo...');
        mkdirSync(TEMP_DIR, { recursive: true });
        run('git init', TEMP_DIR);
        run('git checkout --orphan gh-pages', TEMP_DIR);
        run(`git remote add origin "${remoteUrl}"`, TEMP_DIR);
    }

    // Pulisci tutto tranne .git
    console.log('🧹 Pulizia vecchi file...');
    for (const item of readdirSync(TEMP_DIR)) {
        if (item === '.git') continue;
        rmSync(join(TEMP_DIR, item), { recursive: true, force: true });
    }

    // Copia dist/ → temp
    console.log('📋 Copio file da dist/...');
    cpSync(DIST_DIR, TEMP_DIR, { recursive: true });

    // Crea .nojekyll
    writeFileSync(join(TEMP_DIR, '.nojekyll'), '');

    // Conteggio
    const fileCount = run('git ls-files --others --exclude-standard', TEMP_DIR)
        .split('\n').filter(Boolean).length;
    const modifiedCount = run('git diff --name-only', TEMP_DIR)
        .split('\n').filter(Boolean).length;

    console.log(`📝 Commit (${fileCount} nuovi, ${modifiedCount} modificati)...`);
    run('git add -A', TEMP_DIR);

    const status = run('git status --porcelain', TEMP_DIR).trim();
    if (!status) {
        console.log('✅ Nessuna modifica da pubblicare. Il sito è già aggiornato.');
        cleanup();
        return;
    }

    run(`git commit -m "${COMMIT_MSG}"`, TEMP_DIR);

    console.log('🚀 Push su gh-pages...');
    runVisible('git push origin gh-pages', TEMP_DIR);
    cleanup();
}

function cleanup() {
    try { rmSync(TEMP_DIR, { recursive: true, force: true }); } catch {}
}

// ═══════════════════════════════════════════════════
// MAIN: prova veloce, poi fallback
// ═══════════════════════════════════════════════════
async function deploy() {
    console.log('🚀 Deploy su GitHub Pages...\n');

    if (!existsSync(DIST_DIR)) {
        console.error('❌ Cartella dist/ non trovata. Esegui prima "vite build".');
        process.exit(1);
    }

    try {
        await deployFast();
        console.log('\n✅ Deploy completato con successo! (metodo veloce)');
    } catch (err) {
        console.warn(`\n⚠️  gh-pages fallito: ${err.message}`);
        console.log('📦 Provo con il metodo clone...\n');
        
        try {
            await deployClone();
            console.log('\n✅ Deploy completato con successo! (metodo clone)');
        } catch (err2) {
            console.error('❌ Errore durante il deploy:', err2.message);
            cleanup();
            process.exit(1);
        }
    }
}

deploy();
