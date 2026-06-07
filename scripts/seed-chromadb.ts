#!/usr/bin/env npx tsx
/**
 * seed-chromadb.ts — Index project docs, knowledge, and source code into ChromaDB (Docker).
 * Usage: npx tsx scripts/seed-chromadb.ts
 *
 * Connects to ChromaDB running in Docker at localhost:8000.
 * Indexes: .md docs, .ts/.html/.scss source files from core/shared/features/layout.
 */

import { ChromaClient } from 'chromadb';
import { readFileSync, existsSync, readdirSync, statSync } from 'fs';
import { extname, join, relative, resolve, basename, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createHash } from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const BASE = resolve(__dirname, '..');

const client = new ChromaClient({ path: 'http://localhost:8000' });

// ── Helpers ────────────────────────────────────────────────────────────────

function safeName(name: string, maxLen = 58): string {
  let cleaned = name.replace(/[^a-zA-Z0-9_-]/g, '_').replace(/_+/g, '_').replace(/^_+/, '');
  if (cleaned.length <= maxLen) return cleaned || 'unnamed';
  const hash = createHash('md5').update(name).digest('hex').slice(0, 8);
  return cleaned.slice(0, maxLen - 9) + '_' + hash;
}

function chunkText(text: string, maxChars = 2000): string[] {
  if (text.length <= maxChars) return [text];
  const chunks: string[] = [];
  const paragraphs = text.split('\n\n');
  let current = '';
  for (const p of paragraphs) {
    if ((current.length + p.length + 2) <= maxChars) {
      current = current ? current + '\n\n' + p : p;
    } else {
      if (current) chunks.push(current.trim());
      current = p.length <= maxChars ? p : p.slice(0, maxChars);
    }
  }
  if (current) chunks.push(current.trim());
  return chunks;
}

function walkFiles(dir: string, extFilter?: string[]): string[] {
  const files: string[] = [];
  if (!existsSync(dir)) return files;

  const walk = (d: string) => {
    for (const entry of readdirSync(d)) {
      const full = join(d, entry);
      const rel = relative(BASE, full);
      // Skip node_modules, .git, dist
      if (rel.includes('node_modules') || rel.includes('.git') || rel.includes('dist') || entry.startsWith('node_modules')) continue;
      try {
        const s = statSync(full);
        if (s.isDirectory()) {
          walk(full);
        } else if (!extFilter || extFilter.includes(extname(entry).toLowerCase())) {
          files.push(full);
        }
      } catch { /* skip */ }
    }
  };
  walk(dir);
  return files;
}

const ALLOWED_SRC_EXTS = ['.ts', '.html', '.scss'];

// ── Index files into a collection ──────────────────────────────────────────

async function indexFiles(
  collectionName: string,
  files: string[],
  docType: string,
): Promise<number> {
  if (files.length === 0) return 0;

  // Delete and recreate collection
  try {
    const existing = await client.listCollections();
    if (existing.find(c => c.name === collectionName)) {
      await client.deleteCollection({ name: collectionName });
    }
  } catch { /* first time */ }

  const collection = await client.createCollection({
    name: collectionName,
    metadata: { 'hnsw:space': 'cosine' },
  });

  const ids: string[] = [];
  const documents: string[] = [];
  const metadatas: Record<string, string>[] = [];

  for (const fpath of files) {
    if (!existsSync(fpath)) continue;
    const rel = relative(BASE, fpath);
    try {
      const text = readFileSync(fpath, 'utf-8');
      if (text.length < 20) continue;

      const chunks = chunkText(text, 2000);
      for (let i = 0; i < chunks.length; i++) {
        ids.push(safeName(`${rel}__chunk${i}`, 63));
        documents.push(chunks[i]);
        metadatas.push({
          file: rel,
          filename: basename(fpath),
          type: docType,
          ext: extname(fpath),
          chunk: String(i),
          total_chunks: String(chunks.length),
          char_count: String(chunks[i].length),
        });
      }
    } catch {
      process.stderr.write(`  [WARN] Cannot read: ${rel}\n`);
    }
  }

  // Add in batches of 20
  const batchSize = 20;
  let total = 0;
  for (let i = 0; i < ids.length; i += batchSize) {
    try {
      await collection.add({
        ids: ids.slice(i, i + batchSize),
        documents: documents.slice(i, i + batchSize),
        metadatas: metadatas.slice(i, i + batchSize),
      });
      total += Math.min(batchSize, ids.length - i);
    } catch (e) {
      process.stderr.write(`  [WARN] Batch add failed at ${i}: ${e}\n`);
    }
  }

  process.stdout.write(`  [OK] ${collectionName}: ${total} docs from ${files.length} files\n`);
  return total;
}

// ═════════════════════════════════════════════════════════════════════════════
// MAIN
// ═════════════════════════════════════════════════════════════════════════════

async function main() {
  process.stdout.write('🧹 Cleaning old collections...\n');
  try {
    const existing = await client.listCollections();
    for (const c of existing) {
      try {
        await client.deleteCollection({ name: c.name });
        process.stdout.write(`  Deleted: ${c.name}\n`);
      } catch { /* ignore */ }
    }
  } catch { /* ignore */ }

  let totalDocs = 0;

  // ── 1. Project documentation ─────────────────────────────────────────────
  process.stdout.write('\n── Project docs ──\n');
  const projectDocs = [
    'ARCHITECTURE.md', 'CONVENTIONS.md', 'AGENTS.md', 'README.md',
    'CHANGELOG.md', 'ЧЕК-ЛИСТ-КОНСОЛИДИРОВАННЫЙ.md', 'протокол-сессии.md',
  ].map(f => join(BASE, f)).filter(existsSync);
  totalDocs += await indexFiles('project_docs', projectDocs, 'project_doc');

  // ── 2. Knowledge base ────────────────────────────────────────────────────
  process.stdout.write('\n── Knowledge base ──\n');
  const kbDir = join(BASE, 'база-знаний', 'извлечённое');
  const kbFiles: string[] = [];
  if (existsSync(kbDir)) {
    for (const f of readdirSync(kbDir)) {
      if (f.endsWith('.md')) kbFiles.push(join(kbDir, f));
    }
  }
  const promptsFile = join(BASE, 'база-знаний', 'prompts.md');
  if (existsSync(promptsFile)) kbFiles.push(promptsFile);
  totalDocs += await indexFiles('knowledge_base', kbFiles, 'knowledge');

  // ── 3. Source code: core services ────────────────────────────────────────
  process.stdout.write('\n── Core services (src/app/core/) ──\n');
  const coreDir = join(BASE, 'src', 'app', 'core');
  const coreFiles = walkFiles(coreDir, ALLOWED_SRC_EXTS);
  totalDocs += await indexFiles('source_core', coreFiles, 'core_service');

  // ── 4. UI Kit components ─────────────────────────────────────────────────
  process.stdout.write('\n── UI Kit (src/app/shared/ui/) ──\n');
  const uiDir = join(BASE, 'src', 'app', 'shared', 'ui');
  const uiFiles = walkFiles(uiDir, ALLOWED_SRC_EXTS);
  totalDocs += await indexFiles('source_ui_kit', uiFiles, 'ui_component');

  // ── 5. Feature pages ─────────────────────────────────────────────────────
  process.stdout.write('\n── Feature pages (src/app/features/) ──\n');
  const featuresDir = join(BASE, 'src', 'app', 'features');
  const featureFiles = walkFiles(featuresDir, ALLOWED_SRC_EXTS);
  totalDocs += await indexFiles('source_features', featureFiles, 'feature');

  // ── 6. Layout ────────────────────────────────────────────────────────────
  process.stdout.write('\n── Layout (src/app/layout/) ──\n');
  const layoutDir = join(BASE, 'src', 'app', 'layout');
  const layoutFiles = walkFiles(layoutDir, ALLOWED_SRC_EXTS);
  totalDocs += await indexFiles('source_layout', layoutFiles, 'layout');

  // ── 7. Styles & tokens ───────────────────────────────────────────────────
  process.stdout.write('\n── Styles (src/styles/) ──\n');
  const stylesDir = join(BASE, 'src', 'styles');
  const styleFiles = walkFiles(stylesDir, ALLOWED_SRC_EXTS);
  totalDocs += await indexFiles('source_styles', styleFiles, 'style');

  // ── 8. Backend ────────────────────────────────────────────────────────────
  process.stdout.write('\n── Backend (backend/src/) ──\n');
  const backendDir = join(BASE, 'backend', 'src');
  const backendFiles = walkFiles(backendDir, ALLOWED_SRC_EXTS);
  totalDocs += await indexFiles('source_backend', backendFiles, 'backend');

  // ── 9. Shared types ──────────────────────────────────────────────────────
  process.stdout.write('\n── Shared types (shared/types/) ──\n');
  const typesDir = join(BASE, 'shared', 'types');
  const typeFiles = walkFiles(typesDir, ALLOWED_SRC_EXTS);
  totalDocs += await indexFiles('source_types', typeFiles, 'config');

  // ── 10. Config (app.config.ts, app.routes.ts, docker-compose) ────────────
  process.stdout.write('\n── Config files ──\n');
  const configFiles = [
    join(BASE, 'src', 'app', 'app.config.ts'),
    join(BASE, 'src', 'app', 'app.routes.ts'),
    join(BASE, 'docker-compose.yml'),
  ].filter(existsSync);
  totalDocs += await indexFiles('source_config', configFiles, 'config');

  // ── Summary ──────────────────────────────────────────────────────────────
  process.stdout.write('\n' + '='.repeat(60) + '\n');
  process.stdout.write(`  ChromaDB seeded: ${totalDocs} documents across all collections\n`);
  process.stdout.write(`  URL: http://localhost:8000\n`);
  process.stdout.write('='.repeat(60) + '\n');
}

main().catch((err) => {
  process.stderr.write(`\n[FATAL] ${err.message}\n`);
  process.stderr.write(`${err.stack}\n`);
  process.exit(1);
});
