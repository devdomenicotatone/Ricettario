/**
 * Deploy su GitHub Pages via pacchetto gh-pages
 * Mantiene la storia del branch gh-pages → push incrementale (solo delta)
 */

import ghpages from 'gh-pages';
import { existsSync, writeFileSync } from 'fs';
import { join } from 'path';

const DIST_DIR = join(process.cwd(), 'dist');
const COMMIT_MSG = process.argv[2] || 'deploy: aggiornamento GitHub Pages';

async function deploy() {
    console.log('🚀 Deploy su GitHub Pages...\n');

    if (!existsSync(DIST_DIR)) {
        console.error('❌ Cartella dist/ non trovata. Esegui prima "vite build".');
        process.exit(1);
    }

    // .nojekyll per evitare che GitHub Pages ignori file con underscore
    const nojekyll = join(DIST_DIR, '.nojekyll');
    if (!existsSync(nojekyll)) writeFileSync(nojekyll, '');

    // 404.html per SPA routing su GitHub Pages
    const indexPath = join(DIST_DIR, 'index.html');
    const notFoundPath = join(DIST_DIR, '404.html');
    if (existsSync(indexPath) && !existsSync(notFoundPath)) {
        const indexContent = await import('fs').then(fs => fs.readFileSync(indexPath, 'utf8'));
        writeFileSync(notFoundPath, indexContent);
    }

    console.log('📦 Push incrementale su gh-pages...');

    ghpages.publish(
        DIST_DIR,
        {
            branch: 'gh-pages',
            message: COMMIT_MSG,
            dotfiles: true,      // include .nojekyll
            history: true,       // mantieni storia → push incrementale
            silent: false,
        },
        (err) => {
            if (err) {
                console.error('❌ Deploy fallito:', err.message);
                process.exit(1);
            }
            console.log('\n✅ Deploy completato!');
            console.log('🌐 https://devdomenicotatone.github.io/Ricettario/');
        }
    );
}

deploy();
