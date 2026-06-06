#!/usr/bin/env python3
"""seed_chromadb.py — Index project docs, knowledge base, and key sources into ChromaDB (Docker).
   Uses HTTP client to connect to ChromaDB running at localhost:8000."""

import chromadb
from chromadb.config import Settings
import os
import re
import sys
from pathlib import Path

BASE = Path(__file__).resolve().parent.parent

# Connect to Docker ChromaDB
client = chromadb.HttpClient(
    host="localhost",
    port=8000,
    settings=Settings(anonymized_telemetry=False)
)

# ── Helper: safe collection name ────────────────────────────────────────────
def safe_name(name: str, max_len: int = 58) -> str:
    cleaned = re.sub(r'[^a-zA-Z0-9_-]', '_', name)
    cleaned = re.sub(r'_{2,}', '_', cleaned)
    cleaned = re.sub(r'^_+', '', cleaned)
    if len(cleaned) <= max_len:
        return cleaned or 'unnamed'
    import hashlib
    h = hashlib.md5(name.encode()).hexdigest()[:8]
    return cleaned[:max_len - 9] + '_' + h

# ── Delete all old collections ──────────────────────────────────────────────
print("Cleaning old collections...")
try:
    for c in client.list_collections():
        try:
            client.delete_collection(c.name)
            print(f"  Deleted: {c.name}")
        except Exception:
            pass
except Exception:
    pass

# ── Chunk text for smaller documents ────────────────────────────────────────
def chunk_text(text: str, max_chars: int = 2000) -> list:
    """Split text into chunks of max_chars, trying to break at paragraph boundaries."""
    if len(text) <= max_chars:
        return [text]
    chunks = []
    paragraphs = text.split('\n\n')
    current = ""
    for p in paragraphs:
        if len(current) + len(p) + 2 <= max_chars:
            current = (current + '\n\n' + p) if current else p
        else:
            if current:
                chunks.append(current.strip())
            current = p if len(p) <= max_chars else p[:max_chars]
    if current:
        chunks.append(current.strip())
    return chunks

# ── Index a group of files into one collection ──────────────────────────────
def index_files(collection_name: str, files: list, doc_type: str):
    """Index all files into a single collection. Each file becomes one document (chunked if large)."""
    if not files:
        return 0

    try:
        collection = client.get_or_create_collection(name=collection_name)
    except Exception as e:
        print(f"  [ERROR] Cannot create collection {collection_name}: {e}")
        return 0

    ids = []
    documents = []
    metadatas = []

    for fpath in files:
        if not fpath.exists():
            continue
        try:
            text = fpath.read_text(encoding="utf-8")
        except Exception:
            print(f"  [WARN] Cannot read: {fpath}")
            continue

        if len(text) < 20:
            continue

        rel = str(fpath.relative_to(BASE))

        # Chunk large files
        chunks = chunk_text(text, max_chars=2000)
        for i, chunk in enumerate(chunks):
            chunk_id = safe_name(f"{rel}__chunk{i}", 63)
            ids.append(chunk_id)
            documents.append(chunk)
            metadatas.append({
                "file": rel,
                "filename": fpath.name,
                "type": doc_type,
                "chunk": i,
                "total_chunks": len(chunks),
                "char_count": len(chunk)
            })

    # Add in batches of 10
    batch_size = 10
    total = 0
    for i in range(0, len(ids), batch_size):
        try:
            collection.add(
                ids=ids[i:i+batch_size],
                documents=documents[i:i+batch_size],
                metadatas=metadatas[i:i+batch_size]
            )
            total += len(ids[i:i+batch_size])
        except Exception as e:
            print(f"  [WARN] Batch add failed at {i}: {e}")

    print(f"  [OK] {collection_name}: {total} docs from {len(files)} files")
    return total

# ═══════════════════════════════════════════════════════════════════════════════
# INDEXING
# ═══════════════════════════════════════════════════════════════════════════════

sys.stdout.reconfigure(encoding='utf-8')
total_docs = 0

# ── 1. Project documentation ────────────────────────────────────────────────
print("\n── Project docs ──")
project_docs = [
    BASE / "ARCHITECTURE.md",
    BASE / "CONVENTIONS.md",
    BASE / "AGENTS.md",
    BASE / "README.md",
    BASE / "CHANGELOG.md",
    BASE / "ЧЕК-ЛИСТ-КОНСОЛИДИРОВАННЫЙ.md",
    BASE / "протокол-сессии.md",
]
total_docs += index_files("project_docs", [f for f in project_docs if f.exists()], "project_doc")

# ── 2. Knowledge base (извлечённые книги) ───────────────────────────────────
print("\n── Knowledge base ──")
kb_dir = BASE / "база-знаний" / "извлечённое"
kb_files = sorted(kb_dir.glob("*.md")) if kb_dir.exists() else []
# Also index prompts
prompts_file = BASE / "база-знаний" / "prompts.md"
if prompts_file.exists():
    kb_files.append(prompts_file)
total_docs += index_files("knowledge_base", kb_files, "knowledge")

# ── 3. UI Kit components ────────────────────────────────────────────────────
print("\n── UI Kit components ──")
ui_files = sorted((BASE / "src" / "app" / "shared" / "ui").glob("kp-*.component.ts"))
# Also index the index.ts barrel file
index_ui = BASE / "src" / "app" / "shared" / "ui" / "index.ts"
if index_ui.exists():
    ui_files.append(index_ui)
total_docs += index_files("source_ui_kit", ui_files, "ui_component")

# ── 4. Core services ────────────────────────────────────────────────────────
print("\n── Core services ──")
core_dir = BASE / "src" / "app" / "core"
core_files = sorted(core_dir.glob("*.ts")) if core_dir.exists() else []
total_docs += index_files("source_core", core_files, "core_service")

# ── 5. Backend ──────────────────────────────────────────────────────────────
print("\n── Backend ──")
backend_files = [
    BASE / "backend" / "src" / "index.ts",
    BASE / "backend" / "src" / "utils" / "crud-factory.ts",
    BASE / "backend" / "src" / "utils" / "crud-factory.spec.ts",
    BASE / "backend" / "src" / "utils" / "api-response.ts",
    BASE / "backend" / "src" / "utils" / "logger.ts",
    BASE / "backend" / "src" / "middleware" / "auth.ts",
    BASE / "backend" / "src" / "middleware" / "error-handler.ts",
    BASE / "backend" / "src" / "config" / "db.ts",
    BASE / "backend" / "src" / "config" / "env.ts",
]
# Add model files
backend_modules = sorted((BASE / "backend" / "src" / "modules").glob("*.ts"))
backend_files.extend(backend_modules)
total_docs += index_files("source_backend", [f for f in backend_files if f.exists()], "backend")

# ── 6. Config & types ───────────────────────────────────────────────────────
print("\n── Config & types ──")
config_files = [
    BASE / "shared" / "types" / "index.ts",
    BASE / "src" / "app" / "app.config.ts",
    BASE / "src" / "app" / "app.routes.ts",
    BASE / "src" / "styles" / "_tokens.scss",
    BASE / "src" / "styles" / "_global.scss",
    BASE / "src" / "app" / "layout" / "admin-layout.component.ts",
]
total_docs += index_files("source_config", [f for f in config_files if f.exists()], "config")

print(f"\n{'='*60}")
print(f"  ChromaDB seeded: {total_docs} documents across all collections")
print(f"  URL: http://localhost:8000")
print(f"{'='*60}")
