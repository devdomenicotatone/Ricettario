/**
 * Deploy su GitHub Pages via git subtree push
 * Metodo diretto e robusto — nessuna dipendenza npm
 */

import { execSync } from 'child_process';
import { existsSync, writeFileSync } from 'fs';
import { join } from 'path';

const DIST_DIR = join(process.cwd(), 'dist');
const COMMIT_MSG = process.argv[2] || 'deploy: aggiornamento GitHub Pages';

function run(cmd, opts = {}) {
    console.log(`   → ${cmd}`);
    return execSync(cmd, {
        cwd: process.cwd(),
        stdio: 'inherit',
        timeout: 300_000, // 5 min per push grossi
        env: { ...process.env, GIT_TERMINAL_PROMPT: '0' },
        ...opts
    });
}

function runSilent(cmd) {
    return execSync(cmd, {
        cwd: process.cwd(),
        stdio: 'pipe',
        encoding: 'utf8',
        timeout: 30_000,
        env: { ...process.env, GIT_TERMINAL_PROMPT: '0' }
    }).trim();
}

async function deploy() {
    console.log('🚀 Deploy su GitHub Pages...\n');

    // 1. Verifica dist/
    if (!existsSync(DIST_DIR)) {
        console.error('❌ Cartella dist/ non trovata. Esegui prima "vite build".');
        process.exit(1);
    }

    // 2. Assicurati che .nojekyll esista
    const nojekyll = join(DIST_DIR, '.nojekyll');
    if (!existsSync(nojekyll)) {
        writeFileSync(nojekyll, '');
    }

    // 3. Salva stato attuale (per ripristinare dopo)
    const hadChanges = runSilent('git status --porcelain').length > 0;
    if (hadChanges) {
        console.log('💾 Salvo modifiche locali (stash)...');
        run('git stash push -m "pre-deploy-stash"');
    }

    try {
        // 4. Aggiungi dist/ forzatamente al commit temporaneo
        console.log('📦 Preparo dist/ per il push...');
        run('git add dist -f');
        
        try {
            run('git commit -m "' + COMMIT_MSG + '"', { stdio: 'pipe' });
        } catch {
            console.log('   ℹ️  Nessuna modifica in dist/, procedo comunque...');
        }

        // 5. Elimina branch gh-pages remoto se esiste (per evitare conflitti)
        console.log('🧹 Pulizia branch gh-pages remoto...');
        try {
            run('git push origin --delete gh-pages', { stdio: 'pipe' });
            console.log('   ✅ Vecchio branch eliminato');
        } catch {
            console.log('   ℹ️  Branch gh-pages non esisteva');
        }

        // 6. Push con subtree
        console.log('🚀 Push dist/ → gh-pages...');
        run('git subtree push --prefix dist origin gh-pages');

        console.log('\n✅ Deploy completato con successo!');
        console.log('🌐 https://devdomenicotatone.github.io/Ricettario/');

    } finally {
        // 7. Ripristina: rimuovi il commit temporaneo di dist
        console.log('\n🧹 Ripristino stato locale...');
        try {
            run('git reset HEAD~1', { stdio: 'pipe' });
        } catch {}

        // 8. Ripristina stash se c'era
        if (hadChanges) {
            console.log('💾 Ripristino modifiche locali...');
            try {
                run('git stash pop', { stdio: 'pipe' });
            } catch {}
        }
    }
}

deploy();
