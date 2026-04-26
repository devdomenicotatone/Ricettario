import { resolve } from 'path';
import { defineConfig } from 'vite';
import { cpSync, existsSync, readFileSync, readdirSync, statSync } from 'fs';
import { createHash } from 'crypto';

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

        // Plugin 2: Copia i JSON delle ricette in dist/ durante la build
        {
            name: 'copy-recipe-json',
            closeBundle() {
                const src = resolve(__dirname, 'ricette');
                const dest = resolve(__dirname, 'dist', 'ricette');
                if (existsSync(src)) {
                    cpSync(src, dest, {
                        recursive: true,
                        filter: (source) => {
                            // Copia solo le directory e i file .json
                            if (source.includes('.') && !source.endsWith('.json')) return false;
                            return true;
                        },
                    });
                    console.log('📋 Copiati JSON ricette in dist/ricette/');
                }
            },
        },
    ],
});
