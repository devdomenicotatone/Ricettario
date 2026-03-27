import { resolve } from 'path';
import { defineConfig } from 'vite';
import { cpSync, existsSync } from 'fs';

export default defineConfig({
    // Base path per GitHub Pages — cambia col nome del tuo repo
    base: '/Ricettario/',

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
        {
            name: 'spa-fallback',
            configureServer(server) {
                server.middlewares.use((req, res, next) => {
                    const url = req.url || '';
                    if (url.includes('.') && !url.endsWith('.html')) return next();
                    if (url.startsWith('/@') || url.startsWith('/__')) return next();
                    if (url.startsWith('/Ricettario/ricette/') && !url.endsWith('.json')) {
                        req.url = '/index.html';
                    }
                    next();
                });
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
