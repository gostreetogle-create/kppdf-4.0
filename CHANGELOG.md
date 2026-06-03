# CHANGELOG

Все значимые изменения в kppdf-4.0.

Формат основан на [Keep a Changelog](https://keepachangelog.com/).

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
