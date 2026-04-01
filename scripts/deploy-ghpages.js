/**
 * Deploy su GitHub Pages via git subtree split + force push
 * Manda SOLO i file modificati, non ri-carica tutto ogni volta
 */

import { execSync } from 'child_process';
import { existsSync, writeFileSync } from 'fs';
import { join } from 'path';

const DIST_DIR = join(process.cwd(), 'dist');
const COMMIT_MSG = process.argv[2] || 'deploy: aggiornamento GitHub Pages';
const TEMP_BRANCH = 'gh-pages-deploy-tmp';

function run(cmd, opts = {}) {
    console.log(`   → ${cmd}`);
    return execSync(cmd, {
        cwd: process.cwd(),
        stdio: 'inherit',
        timeout: 600_000,
        env: { ...process.env, GIT_TERMINAL_PROMPT: '0' },
        ...opts
    });
}

function runSilent(cmd) {
    try {
        return execSync(cmd, {
            cwd: process.cwd(),
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

    // .nojekyll
    const nojekyll = join(DIST_DIR, '.nojekyll');
    if (!existsSync(nojekyll)) writeFileSync(nojekyll, '');

    // Salva stato
    const hadChanges = runSilent('git status --porcelain').length > 0;
    if (hadChanges) {
        console.log('💾 Salvo modifiche locali (stash)...');
        run('git stash push -m "pre-deploy-stash"');
    }

    try {
        // Aggiungi dist/ e committa
        console.log('📦 Preparo dist/ per il push...');
        run('git add dist -f');

        const status = runSilent('git diff --cached --name-only');
        if (!status) {
            console.log('✅ Nessuna modifica in dist/. Il sito è già aggiornato.');
            return;
        }

        run('git commit -m "' + COMMIT_MSG + '"', { stdio: 'pipe' });

        // Pulisci branch temporaneo locale se esiste
        try { runSilent(`git branch -D ${TEMP_BRANCH}`); } catch {}

        // Split: estrai dist/ in un branch temporaneo
        console.log('🔀 Estraggo subtree dist/...');
        run(`git subtree split --prefix dist -b ${TEMP_BRANCH}`);

        // Force push: manda SOLO le differenze rispetto al gh-pages esistente
        console.log('🚀 Push modifiche su gh-pages (solo delta)...');
        run(`git push origin ${TEMP_BRANCH}:gh-pages --force`);

        console.log('\n✅ Deploy completato!');
        console.log('🌐 https://devdomenicotatone.github.io/Ricettario/');

    } finally {
        // Cleanup
        console.log('\n🧹 Pulizia...');
        try { runSilent(`git branch -D ${TEMP_BRANCH}`); } catch {}
        try { run('git reset HEAD~1', { stdio: 'pipe' }); } catch {}

        if (hadChanges) {
            try { run('git stash pop', { stdio: 'pipe' }); } catch {}
        }
    }
}

deploy();
