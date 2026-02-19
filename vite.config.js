import { resolve } from 'path';
import { defineConfig } from 'vite';
import { globSync } from 'fs';

// Auto-discovery: ogni .html in ricette/**/ diventa un entry point
function getRecipePages() {
    try {
        const files = globSync('ricette/**/*.html', { cwd: __dirname });
        return Object.fromEntries(
            files.map(f => {
                // Normalizza separatori Windows → Unix per le chiavi Rollup
                const key = f.replace(/\\/g, '/').replace('.html', '');
                return [key, resolve(__dirname, f)];
            })
        );
    } catch {
        return {};
    }
}

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
                ...getRecipePages(), // Auto-aggiunge nuove ricette!
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
});
