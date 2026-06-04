#!/usr/bin/env python3
"""seed_chromadb.py — Load база-знаний/извлечённое/*.md into ChromaDB.
   Uses per-book collections to avoid HNSW index corruption on Windows."""

import chromadb
from chromadb.config import Settings
import os
import re
import sys
from pathlib import Path

BASE = Path(__file__).resolve().parent.parent
EXTRACTED = BASE / "база-знаний" / "извлечённое"
CHROMA_DIR = Path(str(BASE / "база-знаний" / "chroma_db")).resolve()

client = chromadb.Client(Settings(
    persist_directory=str(CHROMA_DIR),
    anonymized_telemetry=False,
    is_persistent=True
))

# Delete all old collections
try:
    for c in client.list_collections():
        try:
            client.delete_collection(c.name)
            print(f"  Deleted old collection: {c.name}")
        except Exception:
            pass
except Exception:
    pass

def parse_md_sections(text: str) -> dict:
    sections = {}
    lines = text.split('\n')
    current_section = 'header'
    current_content = []
    for line in lines:
        if line.startswith('## '):
            if current_content:
                sections[current_section] = '\n'.join(current_content).strip()
            current_section = line[3:].strip()
            current_content = []
        else:
            current_content.append(line)
    if current_content:
        sections[current_section] = '\n'.join(current_content).strip()
    return sections

def safe_name(name: str, max_len: int = 58) -> str:
    cleaned = re.sub(r'[^a-zA-Z0-9_-]', '_', name)
    # Collapse consecutive underscores
    cleaned = re.sub(r'_{2,}', '_', cleaned)
    # Remove leading underscore
    cleaned = re.sub(r'^_+', '', cleaned)
    if len(cleaned) <= max_len:
        return cleaned or 'kb'
    # Use hash suffix for uniqueness when truncating
    import hashlib
    h = hashlib.md5(name.encode()).hexdigest()[:8]
    return cleaned[:max_len - 9] + '_' + h

# Index root-level markdown files too
root_md_files = [
    BASE / "AGENTS.md",
    BASE / "README.md",
    BASE / "CHANGELOG.md",
    BASE / "протокол-сессии.md",
]
root_md_files = [f for f in root_md_files if f.exists()]

md_files = sorted(EXTRACTED.glob("*.md")) + root_md_files

total_docs = 0
collections_created = []

# Process each md file into its own collection
for md_file in md_files:
    project_name = md_file.stem if md_file.parent == EXTRACTED else f"root__{md_file.stem}"
    collection_name = safe_name(f"kb__{project_name}", 55)
    
    # Skip if collection already exists
    existing = [c for c in client.list_collections() if c.name == collection_name]
    if existing:
        print(f"  [SKIP] Collection {collection_name} already exists")
        continue
    
    text = md_file.read_text(encoding="utf-8")
    sections = parse_md_sections(text)
    
    if not text or len(text) < 100:
        continue
    
    try:
        collection = client.create_collection(name=collection_name)
    except Exception as e:
        print(f"  [WARN] Could not create collection {collection_name}: {e}")
        continue
    
    id_counter = 0
    ids = []
    documents = []
    metadatas = []
    
    # Add full document
    id_counter += 1
    ids.append(safe_name(f"{collection_name}__full_{id_counter}"))
    documents.append(text[:5000])
    metadatas.append({
        "project": project_name,
        "type": "full",
        "language": "typescript",
        "tags": "project-brain,knowledge-base"
    })
    
    # Add sections
    for section_name, content in sections.items():
        if len(content) > 50:
            id_counter += 1
            sec_safe = safe_name(section_name[:30], 30)
            ids.append(safe_name(f"{collection_name}__{sec_safe}_{id_counter}"))
            documents.append(content[:2000])
            
            doc_type = "finding"
            sn = section_name.lower()
            if "технологи" in sn or "technology" in sn or "архитектур" in sn or "architecture" in sn:
                doc_type = "architecture"
            elif "цель" in sn or "намерени" in sn:
                doc_type = "intention"
            elif "слои" in sn or "стандарт" in sn or "правил" in sn:
                doc_type = "rule"
            elif "структур" in sn or "ui kit" in sn or "компонент" in sn:
                doc_type = "structure"
            elif "запуск" in sn or "деплой" in sn or "deploy" in sn:
                doc_type = "devops"
            elif "база" in sn or "chromadb" in sn or "векторн" in sn:
                doc_type = "vector_db"
            elif "создание" in sn or "нового" in sn:
                doc_type = "process"
            elif "бизнес" in sn or "logic" in sn:
                doc_type = "business"
            
            metadatas.append({
                "project": project_name,
                "type": doc_type,
                "language": "typescript",
                "tags": f"{project_name},{doc_type}"
            })
    
    # Add in small batches
    batch_size = 5
    for i in range(0, len(ids), batch_size):
        collection.add(
            ids=ids[i:i+batch_size],
            documents=documents[i:i+batch_size],
            metadatas=metadatas[i:i+batch_size]
        )
    
    total_docs += len(ids)
    collections_created.append(collection_name)
    print(f"  [OK] {collection_name}: {len(ids)} docs")

sys.stdout.reconfigure(encoding='utf-8')
print(f"\n[OK] ChromaDB seeded: {total_docs} documents across {len(collections_created)} collections")
print(f"     Location: {CHROMA_DIR}")
print(f"     Collections: {collections_created}")
