#!/usr/bin/env node

/**
 * Валидатор иконок Lucide.
 *
 * Сканирует все .ts и .html файлы в src/ на предмет использования lucideIcon="..."
 * и сверяет с реестром зарегистрированных иконок в app.config.ts.
 *
 * Использование:
 *   node scripts/validate-icons.mjs
 *
 * Возвращает exit code 0 если всё ок, 1 если есть ошибки.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

// === 1. Парсим app.config.ts — извлекаем зарегистрированные иконки ===
const configPath = path.join(ROOT, 'src', 'app', 'app.config.ts');
const configContent = fs.readFileSync(configPath, 'utf8');

// Извлекаем LucideIconName → kebab-case name
const lucideImportRegex = /import\s*\{[^}]*\b(Lucide[A-Za-z0-9]+)\b[^}]*\}\s*from\s*['"]@lucide\/angular['"]/s;
const importMatch = configContent.match(lucideImportRegex);

if (!importMatch) {
  console.error('❌ Не удалось найти import { ... } from \'@lucide/angular\' в app.config.ts');
  process.exit(1);
}

// Извлекаем все LucideXXX имена из импорта
const allImported = [...configContent.matchAll(/\bLucide[A-Za-z0-9]+\b/g)].map(m => m[0]);
const registeredNames = new Set(allImported.map(name => {
  // LucideIconName → icon-name
  const withoutPrefix = name.replace('Lucide', '');
  return withoutPrefix
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
    .toLowerCase();
}));

// Также иконки registered в provideLucideIcons()
const provideCall = configContent.match(/provideLucideIcons\(([\s\S]*?)\)\s*,?\s*\n\s*\]/s);
const provideIcons = provideCall
  ? [...provideCall[1].matchAll(/\bLucide[A-Za-z0-9]+\b/g)].map(m => m[0])
  : [];

const providedNames = new Set(provideIcons.map(name => {
  const withoutPrefix = name.replace('Lucide', '');
  return withoutPrefix
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
    .replace(/([a-z])(\d+)$/i, '$1-$2') // Trash2 → trash-2
    .toLowerCase();
}));

console.log(`📋 Зарегистрировано иконок в provideLucideIcons: ${providedNames.size}`);

// === 2. Сканируем src/ на предмет lucideIcon="..." ===
const SRC_DIR = path.join(ROOT, 'src');
const exts = new Set(['.ts', '.html']);

function* walkDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
      yield* walkDir(fullPath);
    } else if (entry.isFile() && exts.has(path.extname(entry.name))) {
      yield fullPath;
    }
  }
}

// Регулярка для поиска lucideIcon="..." в шаблонах/компонентах
// Также ищет icon: '...' в массивах action-колонок
const iconRegex = /lucideIcon\s*=\s*["']([a-z][-a-z0-9]*)["']/g;
const iconPropRegex = /icon:\s*['"]([a-z][-a-z0-9]*)['"]/g;

const usedIcons = new Map(); // iconName → [file1, file2, ...]

for (const filePath of walkDir(SRC_DIR)) {
  const content = fs.readFileSync(filePath, 'utf8');
  const relPath = path.relative(ROOT, filePath);

  // Поиск lucideIcon="..."
  let match;
  while ((match = iconRegex.exec(content)) !== null) {
    const iconName = match[1];
    if (!usedIcons.has(iconName)) usedIcons.set(iconName, []);
    usedIcons.get(iconName).push(relPath);
  }

  // Поиск icon: '...' в контексте action columns / menu items
  while ((match = iconPropRegex.exec(content)) !== null) {
    const iconName = match[1];
    // Пропускаем emoji (они не Lucide)
    if (iconName.length > 1 && /^[a-z]/.test(iconName)) {
      if (!usedIcons.has(iconName)) usedIcons.set(iconName, []);
      usedIcons.get(iconName).push(relPath);
    }
  }
}

console.log(`🔍 Найдено уникальных иконок в коде: ${usedIcons.size}`);

// === 3. Сверяем ===
let hasErrors = false;
const registeredOnly = new Set([...providedNames]);
const unused = [...registeredOnly].filter(icon => {
  // Специальные иконки, которые могут быть зарегистрированы "на будущее"
  return !usedIcons.has(icon);
});

for (const [icon, files] of usedIcons) {
  if (registeredOnly.has(icon)) {
    // OK
  } else if (icon.startsWith('pi-') || icon === 'pi') {
    // PrimeNG иконки — пропускаем
  } else if (icon.length <= 1) {
    // Слишком короткое имя — скорее всего не Lucide
  } else {
    console.error(`❌ Иконка "${icon}" ИСПОЛЬЗУЕТСЯ в коде, но НЕ ЗАРЕГИСТРИРОВАНА:`);
    for (const f of files.slice(0, 5)) {
      console.error(`     ${f}`);
    }
    hasErrors = true;
  }
}

// === 4. Вывод ===
console.log('\n=== РЕЗУЛЬТАТ ===');
if (hasErrors) {
  console.error('❌ Есть НЕЗАРЕГИСТРИРОВАННЫЕ иконки!');
  console.error('   Добавьте их в provideLucideIcons() в app.config.ts');
  process.exit(1);
} else {
  console.log('✅ Все используемые иконки зарегистрированы!');
  if (unused.length > 0) {
    console.log(`\n📌 Зарегистрированы, но не используются (можно удалить):`);
    for (const icon of unused.sort()) {
      console.log(`   ${icon}`);
    }
  }
  process.exit(0);
}
