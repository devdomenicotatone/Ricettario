import { resolve } from 'path';
import { defineConfig } from 'vite';

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
        // Fallback per SPA: tutte le route servono index.html
        // (in dev mode, Vite gestisce automaticamente le route)
    },

    css: {
        devSourcemap: true,
    },

    // Plugin per SPA routing in dev
    plugins: [
        {
            name: 'spa-fallback',
            configureServer(server) {
                server.middlewares.use((req, res, next) => {
                    // Se la richiesta è per un file che esiste, servilo normalmente
                    // Altrimenti, servi index.html (SPA fallback)
                    const url = req.url || '';
                    // Skip asset files
                    if (url.includes('.') && !url.endsWith('.html')) {
                        return next();
                    }
                    // Skip Vite internal
                    if (url.startsWith('/@') || url.startsWith('/__')) {
                        return next();
                    }
                    // SPA fallback: serve index.html per tutte le route
                    if (url.startsWith('/Ricettario/ricette/') && !url.endsWith('.json')) {
                        req.url = '/index.html';
                    }
                    next();
                });
            },
        },
    ],
});
