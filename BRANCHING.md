# BRANCHING.md — Политика ветвления

> **Назначение:** единые правила именования веток, workflow разработки и защиты `main`.
> Все участники (люди и AI) следуют этим правилам.

---

## 1. Именование веток

```
<тип>/<краткое-описание>
```

| Тип | Назначение | Пример |
|-----|-----------|--------|
| `feature/` | Новая функциональность | `feature/auto-save-drafts` |
| `fix/` | Исправление бага | `fix/table-sort-null-error` |
| `chore/` | Технические работы (deps, конфиги, CI) | `chore/update-angular-21` |
| `refactor/` | Рефакторинг без изменения поведения | `refactor/kp-table-signals` |
| `docs/` | Документация | `docs/branching-workflow` |
| `release/` | Подготовка релиза | `release/v1.16.0` |

### Правила

- **Только латиница** (a-z, 0-9, дефис)
- **Нижний регистр**
- **Дефис** как разделитель слов (не camelCase, не snake_case)
- **Кратко** — 2–5 слов, отражающих суть

---

## 2. Workflow

```
main
  └── feature/xxx  (от main)
        └── Pull Request → main
```

### Жизненный цикл

1. **Создать ветку** от актуального `main`:
   ```bash
   git checkout main
   git pull
   git checkout -b feature/my-feature
   ```

2. **Работать** в ветке, коммитить часто:
   ```bash
   git add -A
   git commit -m "feat: add my feature"
   git push -u origin feature/my-feature
   ```

3. **Синхронизировать** с `main` перед PR:
   ```bash
   git fetch origin
   git rebase origin/main
   # или
   git merge origin/main
   ```

4. **Создать Pull Request** в GitHub:
   - Заголовок: `type: краткое описание` (как коммит)
   - Тело: что сделано, почему, как тестировалось
   - Labels: `enhancement` / `bug` / `documentation`

5. **Пройти CI** — все проверки должны быть зелёными

6. **Смержить** через **Squash & Merge** (один коммит в `main`):
   - Сообщение коммита формируется из заголовка PR
   - Тело PR → тело коммита

7. **Удалить ветку** после мержа (GitHub предлагает автоматически)

### Схема

```
feature/new-dashboard → PR (Squash & Merge) → main
     ↑                        ↑
   работа                  code review
                          + CI passes
```

---

## 3. Защита `main` (GitHub branch protection)

Настроить в **Settings → Branches → Branch protection rules**:

### Required: ✅

| Правило | Значение |
|---------|----------|
| **Require a pull request before merging** | Включено |
| Require approvals | **1** |
| Dismiss stale reviews | Включено |
| **Require status checks** | Включено |
| Status checks | `check` (CI job) |
| **Require branches to be up-to-date** | Включено |
| **Do not allow bypass** | Включено (даже админы через PR) |
| **Restrict deletions** | Включено |

### Optional: 🔶

| Правило | Зачем |
|---------|-------|
| **Lock branch** | Только для особо критичных репозиториев |
| **Allow force pushes** | Выключено (безопасность) |

---

## 4. Коммиты

Формат: [Conventional Commits](https://www.conventionalcommits.org/)

```
<type>(<scope>): <description>

[optional body]
```

### Типы

| Тип | Пример |
|-----|--------|
| `feat` | `feat: add auto-save drafts` |
| `fix` | `fix: table sort on null values` |
| `chore` | `chore: update dependencies` |
| `refactor` | `refactor: extract table pagination` |
| `docs` | `docs: add branching workflow` |
| `test` | `test: add kp-table edge cases` |
| `style` | `style: format with prettier` |

### Описание (subject)

- **Настоящее время**: `add` (не `added`), `fix` (не `fixed`)
- **Без точки** в конце
- **До 72 символов**
- На русском или английском — единообразие в рамках проекта

### Тело (body)

- Опционально для простых изменений
- Обязательно если коммит требует пояснения
- Пустая строка после subject

---

## 5. Локальные настройки git

Рекомендуется применить:

```bash
# Автоматически включить конфиг из .gitconfig.example:
git config --local include.path ../.gitconfig.example

# Или вручную настроить:
git config --local pull.rebase true
git config --local push.default current
git config --local core.autocrlf input
```

См. [`.gitconfig.example`](.gitconfig.example).

---

## 6. Pre-commit hook

Включён в `.husky/pre-commit`:

1. ✅ Валидация имени ветки (соответствие `<тип>/<описание>`)
2. ✅ Линтер («ng lint» — 0 ошибок)
3. ✅ Сборка («ng build» — без ошибок)
4. ✅ Тесты («vitest run» — все зелёные)

Если хоть одна проверка падает — коммит блокируется.

---

## 7. CI/CD (GitHub Actions)

Файл: `.github/workflows/ci.yml`

| Событие | Действие |
|---------|----------|
| Push в любую ветку | Линт → Сборка → Тесты (фронт + бэк) |
| PR в `main` | Линт → Сборка → Тесты (фронт + бэк) |
| Push в `main` | Линт → Сборка → Тесты → (опционально) деплой |

---

## 8. Быстрый старт

```bash
# Клонировать
git clone <url>
cd kppdf-4.0

# Настроить git
git config --local include.path ../.gitconfig.example

# Создать ветку
git checkout -b feature/my-task

# Работа, коммиты, пуш
git add -A
git commit -m "feat: implement my task"
git push -u origin feature/my-task

# Создать PR на GitHub → дождаться CI → Squash & Merge
```

---

*Создан: 2026-06-10*
