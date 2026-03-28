/**
 * Deploy personalizzato su GitHub Pages
 * Sostituisce il modulo 'gh-pages' che ha un bug su Windows (ENAMETOOLONG)
 * quando il branch gh-pages contiene troppi file.
 * 
 * Funzionamento:
 * 1. Clona il branch gh-pages in una cartella temporanea
 * 2. Pulisce tutto tranne .git
 * 3. Copia il contenuto di dist/
 * 4. Crea .nojekyll
 * 5. Committa e pusha
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
    return execSync(cmd, { cwd, stdio: 'pipe', encoding: 'utf8' });
  } catch (e) {
    // git commit ritorna exit code 1 se non ci sono cambiamenti
    if (e.stdout) return e.stdout;
    throw e;
  }
}

function getRemoteUrl() {
  return run('git remote get-url origin', process.cwd()).trim();
}

async function deploy() {
  console.log('🚀 Deploy su GitHub Pages...\n');

  // 1. Verifica che dist/ esista
  if (!existsSync(DIST_DIR)) {
    console.error('❌ Cartella dist/ non trovata. Esegui prima "vite build".');
    process.exit(1);
  }

  // 2. Ottieni URL remoto
  const remoteUrl = getRemoteUrl();
  console.log(`📦 Remote: ${remoteUrl}`);

  // 3. Pulisci temp
  if (existsSync(TEMP_DIR)) {
    rmSync(TEMP_DIR, { recursive: true, force: true });
  }

  // 4. Clona branch gh-pages (shallow)
  console.log('📥 Clono branch gh-pages...');
  try {
    run(`git clone --branch gh-pages --single-branch --depth 1 "${remoteUrl}" "${TEMP_DIR}"`);
  } catch {
    // Se il branch non esiste, crea un repo vuoto con branch orfano
    console.log('⚠️  Branch gh-pages non trovato, ne creo uno nuovo...');
    mkdirSync(TEMP_DIR, { recursive: true });
    run('git init', TEMP_DIR);
    run('git checkout --orphan gh-pages', TEMP_DIR);
    run(`git remote add origin "${remoteUrl}"`, TEMP_DIR);
  }

  // 5. Pulisci tutto tranne .git
  console.log('🧹 Pulizia vecchi file...');
  const items = readdirSync(TEMP_DIR);
  for (const item of items) {
    if (item === '.git') continue;
    rmSync(join(TEMP_DIR, item), { recursive: true, force: true });
  }

  // 6. Copia dist/ → temp
  console.log('📋 Copio file da dist/...');
  cpSync(DIST_DIR, TEMP_DIR, { recursive: true });

  // 7. Crea .nojekyll
  writeFileSync(join(TEMP_DIR, '.nojekyll'), '');

  // 8. Conta file copiati
  const fileCount = run('git ls-files --others --exclude-standard', TEMP_DIR)
    .split('\n').filter(Boolean).length;
  const modifiedCount = run('git diff --name-only', TEMP_DIR)
    .split('\n').filter(Boolean).length;

  // 9. Commit e push
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
  run('git push origin gh-pages', TEMP_DIR);

  // 10. Cleanup
  cleanup();
  console.log('\n✅ Deploy completato con successo!');
}

function cleanup() {
  try {
    rmSync(TEMP_DIR, { recursive: true, force: true });
  } catch {
    // Ignora errori di cleanup
  }
}

deploy().catch(err => {
  console.error('❌ Errore durante il deploy:', err.message);
  cleanup();
  process.exit(1);
});
