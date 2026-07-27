import { resolve } from 'path';
import { defineConfig } from 'vite';
import { existsSync, readFileSync, writeFileSync, readdirSync, mkdirSync, statSync, rmSync } from 'fs';
import { createHash } from 'crypto';

/**
 * Metadati che la dashboard scrive nel JSON della ricetta e che NON devono
 * finire online: li legge lei, dai file del repo, non dal sito.
 *
 * `_generatedBy` (quale modello ha scritto la ricetta) era pubblicato in 70
 * ricette su 80 senza che nessuna pagina lo mostrasse: pubblicato e invisibile
 * insieme. Nella dashboard resta, ed è dove serve: la pastiglia AI nella lista
 * "Le mie Ricette".
 *
 * ATTENZIONE — due campi cominciano con `_` ma sono CONTRATTO PUBBLICO, e
 * toglierli rompe il sito in silenzio:
 *
 *   `_createdAt`        date delle ricette, `datePublished` nel JSON-LD e
 *                       `lastmod` nella sitemap. Per 17 ricette la data vera
 *                       esiste solo nell'indice.
 *   `_originalImageUrl` lo legge `js/credito-foto.js` per collegare il credito
 *                       alla pagina d'origine della foto. Senza, le immagini
 *                       Creative Commons perdono il link che la licenza
 *                       richiede.
 *
 * `scripts/verifica-build.js` fa rispettare l'elenco in tutte e due le
 * direzioni: se un campo interno nuovo comincia a essere pubblicato, il
 * cancello lo intercetta.
 */
const CAMPI_INTERNI = ['_generatedBy', '_validation', '_imageData', '_sourcesUsed'];

// Calcola hash dei JSON ricette per cache busting
function hashRecipeDir(dir) {
    if (!existsSync(dir)) return 'dev';
    const hash = createHash('md5');
    const walk = (d) => {
        for (const f of readdirSync(d)) {
            const p = resolve(d, f);
            if (statSync(p).isDirectory()) walk(p);
            else if (f.endsWith('.json')) hash.update(readFileSync(p));
        }
    };
    walk(dir);
    return hash.digest('hex').slice(0, 8);
}

const recipesHash = hashRecipeDir(resolve(__dirname, 'ricette'));

export default defineConfig({
    // Base path per GitHub Pages — cambia col nome del tuo repo
    base: '/Ricettario/',

    // Cache busting: hash dei JSON ricette esposto come costante globale
    define: {
        __RECIPES_HASH__: JSON.stringify(recipesHash),
    },

    build: {
        outDir: 'dist',
        target: 'esnext',
        minify: 'esbuild',
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                // SPA: un solo entry point! I JSON vengono caricati dinamicamente
            },
        },
    },

    server: {
        open: true,
        port: 5173,
    },

    css: {
        devSourcemap: true,
    },

    plugins: [
        // Plugin 1: SPA fallback per dev server
        // Usa return() per aggiungere middleware DOPO quelli interni di Vite
        {
            name: 'spa-fallback',
            configureServer(server) {
                return () => {
                    server.middlewares.use((req, res, next) => {
                        const url = req.url || '';
                        // Skip file statici (con estensione) tranne .html
                        if (url.includes('.') && !url.endsWith('.html')) return next();
                        // Skip Vite internals
                        if (url.startsWith('/@') || url.startsWith('/__')) return next();
                        // SPA fallback: tutte le route /Ricettario/ricette/* → index.html
                        if (url.startsWith('/Ricettario/ricette/') && !url.endsWith('.json')) {
                            req.url = '/Ricettario/index.html';
                        }
                        next();
                    });
                };
            },
        },

        // Plugin 2: Tiene i PDF fuori dal deploy
        // public/pdf/ è materiale sorgente (~173 MB), è nel .gitignore proprio
        // perché non deve finire su GitHub, e nessuna pagina lo referenzia.
        // Ma Vite copia tutto public/ in dist/, e deploy-ghpages.js pubblica
        // dist/: senza questo, i PDF finivano online a ogni deploy.
        {
            name: 'exclude-public-pdf',
            closeBundle() {
                const pdfDir = resolve(__dirname, 'dist', 'pdf');
                if (existsSync(pdfDir)) {
                    rmSync(pdfDir, { recursive: true, force: true });
                    console.log('🚫 Esclusi i PDF sorgente da dist/');
                }
            },
        },

        // Plugin 3: Copia i JSON delle ricette in dist/ durante la build
        //
        // Non è una copia secca: i JSON delle ricette contengono anche metadati
        // di produzione della dashboard, che non hanno motivo di finire online.
        // Vedi CAMPI_INTERNI qui sotto per quali, e perché due campi che
        // cominciano con `_` restano invece pubblicati apposta.
        {
            name: 'copy-recipe-json',
            closeBundle() {
                const src = resolve(__dirname, 'ricette');
                const dest = resolve(__dirname, 'dist', 'ricette');
                if (!existsSync(src)) return;

                let copiati = 0;
                let ripuliti = 0;

                const copiaCartella = (da, a) => {
                    mkdirSync(a, { recursive: true });
                    for (const e of readdirSync(da, { withFileTypes: true })) {
                        const origine = resolve(da, e.name);
                        const destinazione = resolve(a, e.name);
                        if (e.isDirectory()) { copiaCartella(origine, destinazione); continue; }
                        if (!e.name.endsWith('.json')) continue;
                        // Backup e sidecar: sono file di lavoro, e finivano
                        // pubblicati a URL raggiungibili (~914 KB).
                        if (/\.(backup|pre-edit|pre-gen)\.json$/.test(e.name)) continue;

                        const ricetta = JSON.parse(readFileSync(origine, 'utf8'));
                        let tolto = false;
                        for (const campo of CAMPI_INTERNI) {
                            if (campo in ricetta) { delete ricetta[campo]; tolto = true; }
                        }
                        if (tolto) ripuliti++;
                        writeFileSync(destinazione, JSON.stringify(ricetta, null, 2), 'utf-8');
                        copiati++;
                    }
                };

                copiaCartella(src, dest);
                console.log(`📋 Copiati ${copiati} JSON ricette in dist/ricette/`
                    + (ripuliti ? ` (${ripuliti} ripuliti dai metadati di produzione)` : ''));
            },
        },
    ],
});
