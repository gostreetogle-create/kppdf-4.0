# CHANGELOG

Все значимые изменения в kppdf-4.0.

Формат основан на [Keep a Changelog](https://keepachangelog.com/).

---

## [1.8.0] — 2026-06-04 — Фазы 4, 7, 8 (Тестирование, UI/UX, DevOps)

### Added
- **Фаза 7.1 (a11y):** aria-label на sidebar-навигации, кнопках (toggle/тема/меню), role="navigation"
- **Фаза 8.3 (retry):** `DEFAULT_RETRIES 0→1` для GET-запросов в `api.service.ts`

### Verified (без изменений)
- **Фаза 8.1:** CI/CD `.github/workflows/ci.yml` — lint, build, frontend+backend tests ✅
- **Фаза 8.2:** `GlobalErrorHandler` + `NotificationService` ✅
- **Фаза 7.2:** transition-токены, анимации sidebar ✅
- **Фаза 7.3:** весь UI на русском ✅
- **Фаза 4:** [⊘] отложено — Vitest browser/e2e требуют тяжёлой инфраструктуры

### Итого по чек-листу (35 пунктов)
7/9 фаз выполнено (18/35 пунктов ✅). Фаза 1 отложена (только стабильное), Фаза 4 отложена (инфраструктура).

---

## [1.7.0] — 2026-06-04 — Фазы 2, 3, 6 (Архитектура, Производительность, Бэкенд)

### Added
- **Фаза 2.4:** `api-url.token.ts` — `API_URL` InjectionToken, внедрён в `ApiService` вместо хардкода

### Verified (без изменений — всё уже было на месте)
- **Фаза 2.1:** 31/31 компонентов Standalone, 0 NgModules ✅
- **Фаза 2.2:** `authInterceptor` — функциональный `HttpInterceptorFn` ✅
- **Фаза 2.3:** `provideHttpClient(withInterceptors([...]))` ✅
- **Фаза 3.1:** 30/30 компонентов с `OnPush` ChangeDetection ✅
- **Фаза 3.2:** 0 `*ngFor`, 5 `@for` с `track` ✅
- **Фаза 3.3:** 0 кастомных pipes ✅
- **Фаза 3.4:** 10/10 маршрутов с `loadComponent()` (lazy) ✅
- **Фаза 3.5:** 0 `<img>` в шаблонах (не требуется) ✅
- **Фаза 6.1:** Pino logger с `pino-pretty`, `logger.child()` ✅
- **Фаза 6.2:** Swagger `/api/docs`, `crudPaths()` helper ✅
- **Фаза 6.3:** Dockerfile с `CMD ["npx", "tsx", "src/index.ts"]` ✅

---

## [1.6.0] — 2026-06-04 — База знаний, ChromaDB, безопасность

### Added
- **Извлечение знаний из книг:** `scripts/extract_books.mjs` — Node.js-скрипт извлечения знаний из 35 Angular/TypeScript/Node.js книг (EPUB/PDF/HTML). Создано **35 структурированных .md файлов** в `база-знаний/извлечённое/`
- **ChromaDB индексация:** `scripts/seed_chromadb.py` — Python-скрипт векторизации знаний. **2 560 документов** в **35 коллекциях** (по одной на книгу). Установлен Python 3.12.3 embeddable (`C:/python312/`)
- **Чек-лист улучшений:** `CHECKLIST_IMPROVEMENTS_v2.md` — **35 пунктов** по 9 фазам на основе анализа книг (Ninja Squad 2026, Vardanyan 2025, etc.)
- **Python:** Установлен Python 3.12.3 embeddable (портативный, без прав админа) + chromadb 1.5.9

### Changed
- **Rate-limit:** `10→5 запросов/15 мин`, применяется только к `/api/v1/auth/login` (не на весь `/auth`)
- **.gitignore:** добавлены `angular/` (книги), `база-знаний/chroma_db/` (бинарные файлы ChromaDB)

### Fixed
- **seed_chromadb.py:** HNSW index error на >2000 документов → разбивка на коллекции по книгам (~70 док/коллекцию). Путь к chroma_db через `Path.resolve()`
- **seed_chromadb.py:** имя коллекции экранирует недопустимые символы (кириллица, пробелы)

---

## [0.1.0] — 2026-06-03

### Added
- **Шаблоны таблиц (Этап 0-5):** конструктор шаблонов таблиц — основа для всех документов
  - `TableRegistryService` — реестр таблиц с мок-данными (Товары, Клиенты)
  - `TableTemplateService` — CRUD сервис шаблонов с хранением в памяти
  - Страница списка шаблонов (`/admin/table-templates`) — редактировать, клонировать, удалить
  - Страница редактора шаблона — выбор таблицы → поля → заголовок → ширина → порядок
  - Валидация: название обязательно, минимум 1 колонка, таблица и поле обязательны
- **Типы:** `TableMeta`, `TableField`, `TableTemplate`, `TemplateColumn` в `shared/types/index.ts`
- **Боковое меню:** группа «Администрирование» с вложенным пунктом «Шаблоны таблиц»
- **Маршруты:** lazy loading для `/admin/table-templates`, `/new`, `/:id/edit`
- **Тесты:** 12 новых тестов (table-registry 5 + table-template 7)

### Changed
- `.env`: обновлён c `project-core` на `kppdf-4.0`
- `backend/.env.example`: `MONGODB_URI` → `kppdf-4.0`
- `admin-layout`: sidebar поддерживает вложенные группы пунктов
- `BUSINESS_LOGIC_RU.md`: v2.0 — добавлена Часть 0 (Шаблоны таблиц, Реестр, Контракты, Mock Data)

---

## [1.5.0] — 2026-06-03 — Тесты компонентов документов

### Added
- **kp-doc-block-separator.spec.ts:** 6 тестов (создание, дефолты, DOM)
- **kp-doc-block-text.spec.ts:** 4 теста (создание, columnsGrid, outputs, inputs)
- **kp-doc-block-table.spec.ts:** 4 теста (создание, tmpl, outputs, mock-сервис)
- **kp-doc-canvas.spec.ts:** 7 тестов (создание, дефолты всех inputs, outputs)
- **kp-doc-text-editor-dialog.spec.ts:** 12 тестов (open, columns, save, форматирование)
- **document-template-editor.spec.ts:** 17 тестов (addBlock, removeBlock, moveBlock, validate, onTextBlockSave)
- Итого 50 новых тестов (134→184)
- Паттерн `runInInjectionContext` для компонентов с `input.required` (обход JIT-бага Angular 21)

---

## [1.4.0] — 2026-06-03 — Предпросмотр и печать документов

### Added
- **kp-doc-preview-dialog:** диалог предпросмотра документа — read-only A4-холст, кнопка «Печать» с `@media print` стилями для чистого вывода на принтер
- **Редактор:** кнопка «Предпросмотр» в панели инструментов (disabled если нет блоков)
- **Print-стили:** скрытый print-only шаблон с A4-размерами (210×297mm), serif-шрифт, page-break-inside: avoid
- **ChangeDetectorRef:** гарантирует рендер print-шаблона перед `window.print()` в OnPush

### Fixed
- **Lint:** удалена неиспользуемая переменная `service` в `document-template-list.component.spec.ts`

---

## [1.3.0] — 2026-06-03 — Шаблоны документов (Этапы 4-8: холст, блоки, редактор)

### Added
- **kp-doc-canvas:** A4-холст (794×1123px) для рендеринга блоков документов с hover-кнопками перемещения/удаления
- **kp-doc-block-text:** текстовый блок с поддержкой 1-4 колонок, выравниванием, начертанием
- **kp-doc-block-table:** табличный блок — загружает шаблон таблицы из TableTemplateService, предпросмотр заголовков
- **kp-doc-block-separator:** разделитель с настраиваемой высотой и опциональной линией
- **kp-doc-text-editor-dialog:** диалог редактирования текстового блока — заголовок, колонки, форматирование
- **DocumentTemplateEditorComponent:** полная страница редактора — название, тип, описание, панель инструментов (+ Текст / + Таблица / + Разделитель), A4-холст, сохранение/отмена
- **Маршруты:** `/admin/document-templates/new` и `/:id/edit` → DocumentTemplateEditorComponent
- **Экспорты:** 5 новых компонентов в `shared/ui/index.ts`

---

## [1.2.0] — 2026-06-03 — Шаблоны документов (Этапы 1-3)

### Added
- **Типы документов:** `DocType`, `DocBlockType`, `DocBlockSettings`, `DocTextColumn`, `DocBlock`, `DocumentTemplate` в `shared/types/index.ts`
- **DocumentTemplateService:** CRUD + клонирование с глубоким копированием блоков. 2 мок-шаблона (КП и Договор)
- **document-template.service.spec.ts:** 10 тестов (CRUD, клонирование, ошибки для несуществующих)
- **DocumentTemplateListComponent:** страница списка шаблонов документов с kp-table, хлебными крошками, clone/delete
- **Маршрут:** `/admin/document-templates` → DocumentTemplateListComponent (замена заглушки)

---

## [1.1.0] — 2026-06-03 — Аудит, очистка и дизайн

### Fixed
- **Dashboard:** добавлен `changeDetection: OnPush` (нарушение AGENTS.md)
- **UiKit:** добавлен `changeDetection: OnPush` (нарушение AGENTS.md)
- **Table template list:** raw HTML `<table>` заменён на `<kp-table>` компонент (нарушение AGENTS.md)
- **Login:** добавлен `takeUntilDestroyed()` — устранена утечка Observable
- **CSS токены:** `kp-datepicker`, `kp-file-upload`, `kp-toggle` использовали несуществующий `--kp-color-text-secondary` → заменён на `--color-text-secondary`
- **package.json:** имя `project-core` → `kppdf-4.0`
- **docker-compose:** container names `project-core-*` → `kppdf-*`
- **Backend start:backend:** скрипт ссылался на несуществующий `dev.js` → `npm run dev`

### Added
- **kp-table:** `showClone` input + `rowClone` output — кнопка клонирования в таблице
- **Дизайн-токены:** градиенты (`--gradient-primary`, `--gradient-sidebar`), усиленные тени, transition-токены, `--radius-xl`, `--space-12`
- **Sidebar:** тёмный градиентный фон, индикатор активного пункта (синяя полоска слева)
- **Dashboard:** hero-секция с градиентным фоном, карточки с цветными иконками, блок статистики (16 компонентов / 108 тестов / 0 ошибок)
- **Login:** радиальный градиентный фон, логотип-иконка, подсказка логина/пароля
- **Глобальные стили:** улучшены PrimeNG компоненты (p-card, p-dialog, p-toast, p-tag, p-breadcrumb)

### Changed
- Радиусы увеличены: `--radius-sm` 4→6px, `--radius-md` 6→8px, `--radius-lg` 8→12px
- Фон страницы: `#f8f9fa` → `#f0f2f5`
- Sidebar: 240px → 256px, 56px collapsed → 60px
- Topbar: 52px → 56px

---

## [1.0.1] — 2026-06-03

### Added
- **Тесты kp-*:** 3 новых spec-файла — kp-datepicker, kp-file-upload, kp-toggle (создание, рендер, значения по умолчанию, outputs)
- **ANGULAR_21_FEATURES.md:** компактный справочник фич Angular 21 (сигналы, control flow, zoneless, отличия от 19/20)
- **SIGNAL_FORMS_RESEARCH.md:** разведка экспериментальных Signal Forms — API, сравнение, рекомендации для ядра
- **KNOWLEDGE_BASE.md:** ссылка на ANGULAR_21_FEATURES.md в разделе «Технологический стек»

### Fixed
- **NG0303 в kp-dialog.spec.ts:** тест переписан без `componentRef.setInput()` — JIT-компилятор Angular 21 не обрабатывает метаданные signal inputs (баг задокументирован в ANGULAR_21_FEATURES.md)
- **seed_chromadb.py:** DuplicateIDError исправлен добавлением уникальных счётчиков ID
- **Backend:** `npm install` в `backend/` после git pull — пропущенный `helmet` и другие пакеты

### Changed
- Тесты: 92→100, 18→21 spec-файл
- ChromaDB: 26→105 документов, 5→11 файлов знаний

### Technical
- Исследована совместимость `@analogjs/vite-plugin-angular` — несовместим с Angular 21 (требует `@angular/build/private`)
- Исследован статус Angular 22 — RC-стадия, стабильного релиза нет
- Signal Forms: рекомендовано не использовать до стабилизации API

### Added
- **Безопасность:** helmet, express-rate-limit, express.json(limit), HttpOnly cookie для refresh-токена
- **Логирование:** структурированные логи через pino (JSON в production, pretty в dev)
- **Graceful Shutdown:** корректное завершение при SIGTERM/SIGINT, отключение от MongoDB
- **401-авторефреш:** автоматическое обновление токена при ошибке 401, очередь конкурирующих запросов
- **Проверка exp:** загрузка пользователя из токена с проверкой срока действия
- **Mongoose-ошибки:** ValidationError → 400, CastError → 400 в CRUD Factory
- **Swagger:** интерактивная документация API на `/api/docs`
- **UI Kit:** 10 kp-* компонентов (button, input, select, card, table, dialog, badge, toast, confirm-dialog, breadcrumb)
- **Новые kp-компоненты:** drawer, avatar, tiered-menu
- **Витрина UI Kit:** страница `/ui-kit` с примерами всех компонентов
- **OnPush:** во всех компонентах (включая login, admin-layout)
- **Тесты:** 108 unit/интеграционных тестов (фронтенд 92 + бэкенд 16)

### Changed
- Refresh-токен: из localStorage → HttpOnly cookie (безопасность)
- Dockerfile: tsc → tsx (исправлена production-сборка)
- Admin-layout: прямые PrimeNG-импорты заменены на kp-*
- Login: ToastModule+MessageService → KpToast+NotificationService
- ApiService: унифицированы типы ApiResponse через shared/types

### Fixed
- JWT sign: TS2769 исправлен через `as jwt.SignOptions`
- user.model.ts: TS2790 (delete в strict mode) заменён на деструктуризацию
- angular.json: добавлен lint target
- start.ps1: 3 бага (InvalidVariableReference, раскрытие переменных, NG_CLI_ANALYTICS)
- Lint: 14→0 ошибок (*ngIf→@if, output-ы переименованы, неиспользуемые переменные)

### Technical
- Node.js v24.15.0, Angular (latest), Express 4, MongoDB/Mongoose 8
- Vitest (фронтенд + бэкенд), pino, helmet, express-rate-limit
- Docker Compose (MongoDB + backend)
- ChromaDB (векторная БД знаний, 26 документов)
