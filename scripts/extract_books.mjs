#!/usr/bin/env node
/**
 * extract_books.mjs — Extract knowledge from Angular books into structured .md files
 * and seed ChromaDB.
 * 
 * Usage: node scripts/extract_books.mjs
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, statSync, renameSync, copyFileSync, unlinkSync } from 'fs';
import { join, dirname, basename, extname, relative } from 'path';
import { fileURLToPath } from 'url';
import { createHash } from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const BASE = join(__dirname, '..');
const ANGULAR_DIR = join(BASE, 'angular');
const EXTRACTED_DIR = join(BASE, 'база-знаний', 'извлечённое');
const ANALYZED_DIR = join(ANGULAR_DIR, 'проанализировано');

// Ensure directories exist
[EXTRACTED_DIR, ANALYZED_DIR].forEach(d => { if (!existsSync(d)) mkdirSync(d, { recursive: true }); });

// ============================================================================
// HTML Parser (simple, no dependencies)
// ============================================================================
function stripHtml(html) {
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#8217;/g, "'")
    .replace(/&#8216;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&#8230;/g, '...')
    .replace(/&#160;/g, ' ')
    .replace(/&#\d+;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractHtmlSections(html) {
  const sections = [];
  
  // Extract h2 sections
  const h2Regex = /<h2[^>]*id="([^"]*)"[^>]*>(.*?)<\/h2>/gi;
  let h2Match;
  let lastIndex = 0;
  const h2Positions = [];

  while ((h2Match = h2Regex.exec(html)) !== null) {
    h2Positions.push({
      index: h2Match.index,
      id: h2Match[1],
      title: stripHtml(h2Match[2]),
      level: 2
    });
  }

  // Extract h3 sections
  const h3Regex = /<h3[^>]*id="([^"]*)"[^>]*>(.*?)<\/h3>/gi;
  while ((h3Match = h3Regex.exec(html)) !== null) {
    h2Positions.push({
      index: h3Match.index,
      id: h3Match[1],
      title: stripHtml(h3Match[2]),
      level: 3
    });
  }
  
  h2Positions.sort((a, b) => a.index - b.index);

  for (let i = 0; i < h2Positions.length; i++) {
    const pos = h2Positions[i];
    const nextPos = h2Positions[i + 1];
    const startIdx = pos.index;
    const endIdx = nextPos ? nextPos.index : html.length;
    const content = stripHtml(html.slice(startIdx, endIdx));
    
    if (content.length > 100) {
      sections.push({
        level: pos.level,
        title: pos.title,
        id: pos.id,
        content: content.substring(0, 5000)
      });
    }
  }

  return sections;
}

// ============================================================================
// EPUB Extractor (EPUB is a ZIP file)
// ============================================================================
async function extractEpub(epubPath) {
  try {
    const AdmZip = (await import('adm-zip')).default;
    const zip = new AdmZip(epubPath);
    const entries = zip.getEntries();
    
    let allText = '';
    const htmlEntries = entries.filter(e => e.entryName.endsWith('.html') || e.entryName.endsWith('.xhtml'));
    
    for (const entry of htmlEntries) {
      const content = entry.getData().toString('utf-8');
      allText += stripHtml(content) + '\n\n';
    }
    
    return allText;
  } catch (e) {
    console.error(`  [WARN] EPUB extraction failed for ${basename(epubPath)}: ${e.message}`);
    return null;
  }
}

// ============================================================================
// PDF Extractor
// ============================================================================
async function extractPdf(pdfPath) {
  try {
    const { PDFParse } = await import('pdf-parse');
    const parser = new PDFParse({ url: pdfPath });
    const result = await parser.getText();
    return result.text;
  } catch (e) {
    console.error(`  [WARN] PDF extraction failed for ${basename(pdfPath)}: ${e.message}`);
    return null;
  }
}

// ============================================================================
// HTML File Extractor
// ============================================================================
async function extractHtmlFile(htmlPath) {
  try {
    const html = readFileSync(htmlPath, 'utf-8');
    // Get content between body tags
    const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    const bodyContent = bodyMatch ? bodyMatch[1] : html;
    return stripHtml(bodyContent);
  } catch (e) {
    console.error(`  [WARN] HTML extraction failed: ${e.message}`);
    return null;
  }
}

// ============================================================================
// Knowledge Analyzer — extracts key Angular concepts from raw text
// ============================================================================
function analyzeAngularKnowledge(text, sourceName) {
  const knowledge = {
    source: sourceName,
    sections: []
  };

  // Key Angular concepts to search for
  const concepts = [
    { pattern: /signal/gi, tag: 'signals' },
    { pattern: /computed\(/g, tag: 'computed-signals' },
    { pattern: /effect\(/g, tag: 'effects' },
    { pattern: /linkedSignal/g, tag: 'linked-signals' },
    { pattern: /resource\(|rxResource|httpResource/g, tag: 'async-resources' },
    { pattern: /Signal.?Form|signal.?form|form\(\)/gi, tag: 'signal-forms' },
    { pattern: /standalone.?component/gi, tag: 'standalone' },
    { pattern: /ChangeDetectionStrategy|OnPush|zoneless/gi, tag: 'change-detection' },
    { pattern: /@defer|Deferrable.?View/gi, tag: 'defer' },
    { pattern: /control.?flow|@if|@for|@switch/gi, tag: 'control-flow' },
    { pattern: /Dependency.?Injection|inject\(|Injectable/gi, tag: 'di' },
    { pattern: /Router|provideRouter|withComponentInputBinding/gi, tag: 'routing' },
    { pattern: /HttpClient|httpResource|provideHttpClient/gi, tag: 'http' },
    { pattern: /Observable|RxJS|BehaviorSubject/gi, tag: 'rxjs' },
    { pattern: /pipe|transform/gi, tag: 'pipes' },
    { pattern: /Directive|@Component|@Input|@Output/gi, tag: 'components' },
    { pattern: /template|interpolation|property.?binding/gi, tag: 'templates' },
    { pattern: /TestBed|ComponentFixture|unit.?test/gi, tag: 'testing' },
    { pattern: /i18n|internationalization|transloco/gi, tag: 'i18n' },
    { pattern: /animation|animate\.enter|transition/gi, tag: 'animations' },
    { pattern: /performance|lazy.?load|bundle/gi, tag: 'performance' },
    { pattern: /NgModules|NgModule/gi, tag: 'modules' },
    { pattern: /model\(\)|two.?way.?binding/gi, tag: 'model-inputs' },
    { pattern: /viewChild|contentChild|afterNextRender|afterRenderEffect/gi, tag: 'advanced-components' },
  ];

  const foundConcepts = [];
  for (const concept of concepts) {
    const matches = text.match(concept.pattern);
    if (matches && matches.length > 3) {
      foundConcepts.push(concept.tag);
    }
  }

  return {
    source: sourceName,
    concepts: [...new Set(foundConcepts)],
    codeBlockCount: codeBlocks.length,
    textLength: text.length,
    summary: text.substring(0, 2000).replace(/\s+/g, ' ').trim()
  };
}

// ============================================================================
// Create structured knowledge .md file
// ============================================================================
function createKnowledgeMd(sourceName, text, analysis) {
  const sections = [];
  const lines = text.split('\n');
  let currentSection = null;
  let currentContent = [];

  // Extract sections by looking for chapter/section patterns
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Detect chapter/section headers
    if (/^(Chapter|Глава|Раздел|Часть)\s+\d+/i.test(trimmed) ||
        /^\d+\.\s+[A-ZА-Я]/.test(trimmed) ||
        /^[A-Z][a-z]+(\s+[a-z]+){0,10}$/.test(trimmed) && trimmed.length < 80 && !trimmed.endsWith('.')) {
      if (currentSection && currentContent.length > 5) {
        sections.push({
          title: currentSection,
          content: currentContent.join('\n').substring(0, 3000)
        });
      }
      currentSection = trimmed;
      currentContent = [];
    } else if (currentSection) {
      currentContent.push(trimmed);
    }
  }

  if (currentSection && currentContent.length > 5) {
    sections.push({
      title: currentSection,
      content: currentContent.join('\n').substring(0, 3000)
    });
  }

  // Build markdown
  let md = `# ${sourceName}\n\n`;
  md += `> **Источник:** ${sourceName}\n`;
  md += `> **Дата извлечения:** ${new Date().toISOString().split('T')[0]}\n`;
  md += `> **Концепции:** ${analysis.concepts.join(', ')}\n`;
  md += `> **Размер текста:** ${analysis.textLength} символов\n\n`;
  md += `---\n\n`;

  if (sections.length > 0) {
    for (const section of sections) {
      md += `## ${section.title}\n\n${section.content}\n\n---\n\n`;
    }
  } else {
    // Fallback: chunk the text into reasonable sections
    const chunks = [];
    let remaining = text;
    while (remaining.length > 0) {
      chunks.push(remaining.substring(0, 4000));
      remaining = remaining.substring(4000);
    }
    
    for (let i = 0; i < Math.min(chunks.length, 20); i++) {
      md += `## Часть ${i + 1}\n\n${chunks[i]}\n\n---\n\n`;
    }
  }

  return md;
}

// ============================================================================
// Main processing function
// ============================================================================
async function processBook(filePath, sourceName) {
  const ext = extname(filePath).toLowerCase();
  console.log(`\n📖 Processing: ${sourceName} (${ext})`);
  
  let text = null;
  
  if (ext === '.html' || ext === '.htm') {
    text = await extractHtmlFile(filePath);
  } else if (ext === '.epub') {
    text = await extractEpub(filePath);
  } else if (ext === '.pdf') {
    text = await extractPdf(filePath);
  } else {
    console.log(`  [SKIP] Unsupported format: ${ext}`);
    return null;
  }
  
  if (!text || text.length < 500) {
    console.log(`  [SKIP] Not enough text extracted (${text ? text.length : 0} chars)`);
    return null;
  }

  console.log(`  ✅ Extracted ${text.length.toLocaleString()} chars`);
  
  // Analyze
  const analysis = analyzeAngularKnowledge(text, sourceName);
  console.log(`  🏷️  Concepts found: ${analysis.concepts.join(', ') || 'none'}`);
  
  // Create knowledge file
  const safeFileName = sourceName.replace(/[^a-zA-Zа-яА-Я0-9_-]/g, '_').substring(0, 60);
  const mdPath = join(EXTRACTED_DIR, `BOOK__${safeFileName}.md`);
  const knowledgeMd = createKnowledgeMd(sourceName, text, analysis);
  writeFileSync(mdPath, knowledgeMd, 'utf-8');
  console.log(`  📄 Knowledge saved: ${basename(mdPath)} (${knowledgeMd.length.toLocaleString()} chars)`);
  
  return { sourceName, analysis, mdPath };
}

// ============================================================================
// Find all book files
// ============================================================================
function findAllBooks(dir, books = []) {
  if (!existsSync(dir)) return books;
  
  const entries = readdirSync(dir);
  for (const entry of entries) {
    const fullPath = join(dir, entry);
    
    // Skip analyzed and non-book directories
    if (entry === 'проанализировано' || entry === 'node_modules') continue;
    
    try {
      const stat = statSync(fullPath);
      if (stat.isDirectory()) {
        findAllBooks(fullPath, books);
      } else {
        const ext = extname(entry).toLowerCase();
        if (['.epub', '.pdf', '.html', '.htm', '.mobi'].includes(ext)) {
          books.push({
            path: fullPath,
            name: entry.replace(ext, ''),
            ext,
            size: stat.size,
            dir: dirname(fullPath)
          });
        }
      }
    } catch (e) {
      // Skip inaccessible files
    }
  }
  return books;
}

// ============================================================================
// Priority scoring for books
// ============================================================================
function scoreBook(book) {
  const name = book.name.toLowerCase();
  let score = 0;
  
  // Angular-specific books (2024-2026): highest priority
  if (name.includes('angular') && (name.includes('2025') || name.includes('2026'))) score += 100;
  else if (name.includes('angular') && name.includes('2024')) score += 80;
  else if (name.includes('angular') && name.includes('2023')) score += 60;
  else if (name.includes('angular')) score += 40;
  
  // Angular-specific topics
  if (name.includes('ninja') && name.includes('angular')) score += 50;
  if (name.includes('signal')) score += 40;
  if (name.includes('reactive')) score += 30;
  if (name.includes('pattern') || name.includes('design')) score += 30;
  if (name.includes('typescript')) score += 25;
  if (name.includes('rxjs')) score += 20;
  if (name.includes('modern')) score += 20;
  if (name.includes('mastery') || name.includes('pro')) score += 15;
  if (name.includes('business')) score += 10;
  if (name.includes('web3')) score += 5;
  
  // Node.js, CSS, SQL, microservices: medium relevance
  if (name.includes('node')) score += 15;
  if (name.includes('css')) score += 10;
  if (name.includes('sql') || name.includes('mongodb')) score += 10;
  if (name.includes('микросервис')) score += 15;
  if (name.includes('алгоритм')) score += 10;
  if (name.includes('паттерн')) score += 15;
  
  // ECMAScript
  if (name.includes('ecmascript') || name.includes('es6') || name.includes('es2015')) score += 20;
  
  // Penalize very old books
  if (name.includes('2012') || name.includes('2013') || name.includes('2014')) score -= 20;
  if (name.includes('2015') || name.includes('2016') || name.includes('2017')) score -= 10;
  
  // Penalize non-web topics
  if (name.includes('c++') || name.includes('c#') || name.includes('.net') || name.includes('java')) score -= 50;
  if (name.includes('python') || name.includes('ruby') || name.includes('go ')) score -= 50;
  if (name.includes('android') || name.includes('ios') || name.includes('iphone')) score -= 50;
  if (name.includes('arduino') || name.includes('unity')) score -= 50;
  if (name.includes('хак') || name.includes('hack')) score -= 50;
  
  return score;
}

// ============================================================================
// Mark book as analyzed (move to analyzed folder)
// ============================================================================
function markAsAnalyzed(bookPath, originalDir) {
  const relPath = relative(ANGULAR_DIR, originalDir);
  const targetDir = join(ANALYZED_DIR, relPath);
  if (!existsSync(targetDir)) mkdirSync(targetDir, { recursive: true });
  
  const targetPath = join(targetDir, basename(bookPath));
  
  // Skip if already analyzed
  if (existsSync(targetPath)) {
    console.log(`  📁 Already analyzed: ${relative(BASE, targetPath)}`);
    // Remove original if it still exists
    try { unlinkSync(bookPath); } catch (e) {}
    return;
  }
  
  try {
    renameSync(bookPath, targetPath);
    console.log(`  📁 Moved to: ${relative(BASE, targetPath)}`);
  } catch (e) {
    // If rename fails (e.g. cross-device), try copy + delete
    try {
      copyFileSync(bookPath, targetPath);
      unlinkSync(bookPath);
      console.log(`  📁 Copied to: ${relative(BASE, targetPath)}`);
    } catch (e2) {
      console.error(`  [ERROR] Could not move/copy: ${e2.message}`);
    }
  }
}

// ============================================================================
// Seed ChromaDB via Node.js
// ============================================================================
async function seedChromaDB() {
  console.log('\n🗄️  Seeding ChromaDB...');
  
  try {
    const { ChromaClient } = await import('chromadb');
    const { DefaultEmbeddingFunction } = await import('@chroma-core/default-embed');
    const chromaPath = join(BASE, 'база-знаний', 'chroma_db');
    
    const client = new ChromaClient({ 
      path: chromaPath,
      embeddingFunction: new DefaultEmbeddingFunction()
    });
    
    // Try to delete old collection
    try { await client.deleteCollection({ name: 'project_brain' }); } catch (e) {}
    
    const collection = await client.createCollection({
      name: 'project_brain',
      metadata: { 'hnsw:space': 'cosine' }
    });
    
    // Collect all .md files
    const mdFiles = [];
    
    function collectMd(dir) {
      if (!existsSync(dir)) return;
      const entries = readdirSync(dir);
      for (const entry of entries) {
        const full = join(dir, entry);
        if (statSync(full).isDirectory()) {
          collectMd(full);
        } else if (entry.endsWith('.md')) {
          mdFiles.push(full);
        }
      }
    }
    
    collectMd(EXTRACTED_DIR);
    
    // Also add root md files
    const rootFiles = ['AGENTS.md', 'README.md', 'CHANGELOG.md'].map(f => join(BASE, f)).filter(f => existsSync(f));
    mdFiles.push(...rootFiles);
    
    console.log(`  Found ${mdFiles.length} markdown files to index`);
    
    let totalDocs = 0;
    const batchSize = 10;
    let ids = [], documents = [], metadatas = [];
    
    for (const mdFile of mdFiles) {
      const name = basename(mdFile, '.md').replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 55);
      const content = readFileSync(mdFile, 'utf-8');
      
      // Add full document
      const docId = `${name}__full_${totalDocs}`;
      ids.push(docId);
      documents.push(content.substring(0, 5000));
      metadatas.push({
        project: name,
        type: name.startsWith('BOOK__') ? 'book' : 'project',
        language: 'typescript',
        tags: name.startsWith('BOOK__') ? 'book,angular,knowledge' : 'project,core'
      });
      totalDocs++;
      
      // Split into sections
      const sections = content.split(/\n## /);
      for (const section of sections) {
        const secTitle = section.split('\n')[0].substring(0, 50).replace(/[^a-zA-Z0-9_-]/g, '_');
        const secContent = section.substring(0, 2000).trim();
        if (secContent.length > 100) {
          const secId = `${name}__${secTitle}_${totalDocs}`;
          ids.push(secId);
          documents.push(secContent);
          metadatas.push({
            project: name,
            type: 'section',
            language: 'typescript',
            tags: 'knowledge,section'
          });
          totalDocs++;
        }
      }
      
      // Flush batch
      if (ids.length >= batchSize) {
        await collection.add({ ids, documents, metadatas });
        ids = []; documents = []; metadatas = [];
      }
    }
    
    // Flush remaining
    if (ids.length > 0) {
      await collection.add({ ids, documents, metadatas });
    }
    
    console.log(`  ✅ ChromaDB seeded: ${totalDocs} documents`);
    const collections = await client.listCollections();
    console.log(`  Collections: ${collections.map(c => c.name).join(', ')}`);
    
  } catch (e) {
    console.error(`  [ERROR] ChromaDB seeding failed: ${e.message}`);
    console.error(e.stack);
  }
}

// ============================================================================
// MAIN
// ============================================================================
async function main() {
  console.log('🔍 Finding all books in angular/...');
  const allBooks = findAllBooks(ANGULAR_DIR);
  console.log(`Found ${allBooks.length} book files\n`);
  
  // Score and prioritize
  const scored = allBooks.map(b => ({ ...b, score: scoreBook(b) }));
  scored.sort((a, b) => b.score - a.score);
  
  // Show top priority books
  console.log('📊 Priority ranking (top 20):');
  scored.slice(0, 20).forEach((b, i) => {
    console.log(`  ${i + 1}. [${b.score}] ${b.name} (${b.ext})`);
  });
  
  // Process high priority books (score >= 30)
  const highPriority = scored.filter(b => b.score >= 30);
  console.log(`\n📚 Processing ${highPriority.length} high-priority books (score >= 30)...`);
  
  let processed = 0;
  for (const book of highPriority) {
    try {
      const result = await processBook(book.path, book.name);
      if (result) {
        processed++;
        // Mark as analyzed
        markAsAnalyzed(book.path, book.dir);
      }
    } catch (e) {
      console.error(`  [ERROR] Failed to process ${book.name}: ${e.message}`);
    }
  }
  
  // Process medium priority (score 10-29) - but skip if too many
  const mediumPriority = scored.filter(b => b.score >= 10 && b.score < 30);
  console.log(`\n📚 Processing ${mediumPriority.length} medium-priority books (score 10-29)...`);
  
  for (const book of mediumPriority.slice(0, 15)) { // Limit to 15
    try {
      const result = await processBook(book.path, book.name);
      if (result) {
        processed++;
        markAsAnalyzed(book.path, book.dir);
      }
    } catch (e) {
      console.error(`  [ERROR] Failed to process ${book.name}: ${e.message}`);
    }
  }
  
  console.log(`\n✅ Total books processed: ${processed}`);
  
  // Seed ChromaDB
  await seedChromaDB();
  
  console.log('\n🎉 Done!');
  console.log(`   Knowledge files: ${EXTRACTED_DIR}`);
  console.log(`   Analyzed books: ${ANALYZED_DIR}`);
}

main().catch(console.error);
