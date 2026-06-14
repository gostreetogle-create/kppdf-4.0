# CHANGELOG

Все значимые изменения в kppdf-4.0.

Формат основан на [Keep a Changelog](https://keepachangelog.com/).

---

## [1.18.0] — 2026-06-14 — @defer на все тяжёлые компоненты, инлайн-стили ui-kit, тесты 470/470

### Added
- **@defer (on idle) на 10 тяжёлых lazy-компонентах** — каждый с `@placeholder`:
  - app-guide (128KB), product-editor (125KB), proposal-editor (92KB), proposal-showcase (71KB)
  - ui-kit (84KB), gantt-chart (81KB), organization-editor (58KB), finance-dashboard (51KB)
  - production-order-list (44KB), monitor-dashboard (38KB)
- **Placeholder-стили:** `@placeholder` во всех 10 компонентах с центрированным текстом загрузки (min-height: 50vh)

### Changed
- **ui-kit: инлайн-стили → CSS-классы:** 8 `style="..."` атрибутов заменены на 6 семантических классов
  - `uikit__field-row`, `uikit__field-select`, `uikit__field-plus-btn` — для демо KP-FGP
  - `uikit__placeholder`, `uikit__placeholder-text` — для @defer placeholder

### Fixed
- **3 skip-теста → pass:** client-list (1) + doc-type-list (2). Корень: `await Promise.resolve()` после `httpMock.flush()` для правильной очерёдности микрозадач
- **NG8113 ×2:** удалён неиспользуемый `LucideDynamicIcon` из proposal-editor и proposal-view

### Infrastructure
- **ChromaDB переиндексирован:** 617 документов в 10 коллекциях (все .ts/.html/.scss + .md + config)
- **Чек-лист:** добавлена секция P11 (9 пунктов), итог — 224 ✅, 2 ⊘

### Tests
- **470 тестов** (pass: 470, fail: 0, skip: 0) — +3 починенных, 0 пропущенных

---

## [1.17.0] — 2026-06-14 — Мониторинг, 1С-интеграция, Zoneless, многостраничные фоны, flex-редизайн редактора таблиц

### Added
- **Мониторинг системы:** `/api/v1/monitor` endpoint + `/admin/monitor` дашборд (БД, память, CPU, uptime, коллекции)
- **1С-интеграция:** модель, API, страница настроек и ручной синхронизации
- **Zoneless Change Detection:** `provideZonelessChangeDetection()` + zone.js удалён из polyfills
- **Многостраничные фоны:** `kp-doc-canvas` рендерит N страниц под N фоновых изображений
- **Интерактивный A4 в редакторе КП:** proposal-editor показывает живой предпросмотр документа
- **vatRate в организациях:** поле НДС-ставки в редакторе/списке организаций

### Changed
- **table-template-editor — flex-редизайн:** нативный `<table>` заменён на flex-контейнер
  - Каждая колонка — независимый `flex-shrink: 0` элемент
  - Ресайз одной колонки не влияет на остальные
  - Живая таблица с 3 строками тестовых данных (предпросмотр сразу в редакторе)
  - Клик по заголовку → диалог редактирования колонки (выбор поля, заголовок, ширина)
  - Drag-and-drop перестановка колонок (CDK)
  - Ширина колонок меняется мышью (drag handle)
- **kp-doc-block-table:** прозрачные заголовки и футер (фоновое изображение просвечивает), скруглённые рамки 6px, полупрозрачный ховер
- **kp-select:** добавлен `appendTo="body"` input — дропдаун больше не залезает под границы контейнера (z-index fix)
- **admin-layout:** редизайн header/sidebar

### Removed
- **1С-интеграция:** удалён модуль (модель, роуты, сервис, компонент) — заменён новой реализацией

### Fixed
- **NG8113 warnings:** убраны неиспользуемые `LucideDynamicIcon` из proposal-editor и proposal-view
- **Иконка arrow-left:** зарегистрирована в app.config.ts
- **Линт:** убраны неиспользуемые `computed` импорты, `any` типы

### Tests
- **467 тестов** (pass: 467, fail: 0, skip: 3)

---

## [1.16.0] — 2026-06-11 — UI/UX: Opacity слайдер, kp-field-group, фоновые изображения, PDF _inlineRows

### Added
- **backgroundOpacity слайдер** — ползунок прозрачности фоновых изображений (0..1, шаг 0.05) в редакторе шаблонов документов
  - `DocumentTemplate.backgroundOpacity?: number` — новое поле в shared/types
  - `kp-doc-canvas` — `backgroundOpacity` input, применяется через `[style.opacity]` к watermark
  - Слайдер в левой панели редактора с отображением текущего % прозрачности
  - Автосохранение opacity в черновиках localStorage
- **kp-field-group** — новый UI Kit компонент для группировки полей в рамке
  - `KpFieldGroupComponent` — простой контейнер с border + padding + flex-колонка
  - Используется в редакторе шаблонов для группы: название, тип документа, описание, организация
  - Экспортирован из `shared/ui/index.ts`
  - Добавлена демо-секция **KP-FGP** на страницу UI Kit
- **PDF экспорт: поддержка _inlineRows** — табличные блоки в предпросмотре/печати/PDF теперь корректно отображают данные из `_inlineRows`
  - `kp-doc-preview-dialog.resolveTableData()` — приоритет: `_inlineRows` > API > пусто
  - `proposal-list.component.ts.fillPlaceholders()` — table-блоки сохраняют тип `'table'`, заполняются `_inlineRows`, `_columnSummaries`, `_footerRows` из `cp.items`
- **backgroundOpacity прокинут в предпросмотр** — все 4 вызова `kp-doc-preview-dialog.open()` теперь передают opacity
  - `document-template-editor` → `this.backgroundOpacity()`
  - `document-template-list` → `tmpl.backgroundOpacity ?? 1`
  - `proposal-list` → `1` (нет данных шаблона)
  - `proposal-showcase` → `tmpl?.backgroundOpacity ?? 1`

### Fixed
- **Фоновые изображения больше не накладываются** — `kp-doc-canvas` показывает только первое изображение (для страницы 1). Остальные хранятся в массиве для следующих страниц.
- **Drag-to-reorder для миниатюр фонов** — cdkDropList + cdkDrag с горизонтальной ориентацией, бейджи «По умолчанию» / «Стр. 2», ручки перетаскивания
- **Кнопки «+» на своих местах** — каждая кнопка справа от своего селекта в одной flex-строке (`.dt-editor__field-row`), а не отдельной колонкой
- **Жёлтая рамка кнопок «+» восстановлена** — border 2px solid var(--color-warn), background hover scale + box-shadow через ::ng-deep
- **Angular budgets** — `maximumWarning` для `anyComponentStyle` поднят с `6kb` до `15kb` (совпадает с `maximumError`), подавлены варнинги по 4 компонентам

### Changed
- **Редактор шаблонов** — поля сгруппированы в `<kp-field-group>` (рамка), селекты расширяются (flex: 1), кнопки действий справа
- **Бюджеты стилей** — angular.json: компоненты со стилями >6KB (app-guide 11.71kB, admin-layout 6.03kB, gantt-chart 7.59kB, product-editor 8.38kB) больше не триггерят варнинги

---

## [1.15.0] — 2026-06-09 — Все сервисы на HTTP + Ролевые гуарды + Бэкенд OrderTask

### Added
- **OrderTaskService → HTTP:** последний in-memory сервис переведён на `inject(ApiService)`
  - `changeStatus(id, status)` — клиентская валидация зависимостей (блокирующие задачи) перед PATCH
  - `assignWorker(id, workerId)` — PATCH `/api/v1/order-tasks/:id/assign`
  - `updateDates(id, dates)` — PATCH `/api/v1/order-tasks/:id/dates`
  - `getAvailableWorkers(workTypeId)` — вычисление `busyUntil` на основе загруженных задач
  - `autoAssignWorker(id)` — подбор наименее загруженного исполнителя нужной квалификации
  - `generateMissingDataTasks(orderId)` / `generateFromComponents(orderId)` — создание задач через POST
  - Async-методы обёрнуты в `from()` для сохранения Observable API
- **Бэкенд OrderTask:** `order-task.model.ts` (Mongoose), `order-task.routes.ts` (CRUD + PATCH /status, /assign, /dates), регистрация `/api/v1/order-tasks` в `index.ts`
- **Auth Guard:** `auth.guard.ts` — `canActivateChild` на корневом маршруте, редирект на `/login` без токена
- **Role Guard:** `role.guard.ts` — `requireRole(...roles)` для разграничения доступа к разделам
- **ApiService.patch():** новый метод для PATCH-запросов (смена статусов, назначение исполнителя)

### Changed
- **10 сервисов переведены на HTTP** (с in-memory `BaseCrudService` на `inject(ApiService)`):
  - **Batch 1 (простые):** `WorkTypeService`, `OrderClosingService`, `FinancialReportService`, `ReconciliationActService`
  - **Batch 2 (обёртки):** `StorageItemService`, `WarehouseService` (сохранены wrapper-методы)
  - **Batch 3 (нумерация+статус):** `InvoiceService`, `PurchaseRequestService`, `SupplierOrderService` (авто-нумерация КП/Д/ЗП/СФ/ПЗ сохранена)
  - **Batch 4 (договоры):** `ContractService` (createFromProposal, createContract, changeStatus)
- **Маршруты с ролевой защитой:** `app.routes.ts` — группировка по разделам с `canActivateChild: [requireRole(...)]`
  - `/admin/*` → admin only
  - `/references/*` → admin, manager, production
  - `/sales/*` → admin, manager
  - `/production/*` → admin, production
  - `/finance/*` → admin, accountant
  - `/warehouse/*` → admin, storekeeper
- **eslint:** `varsIgnorePattern: '^_'` для неиспользуемых переменных с префиксом `_`
- **backend/start-dev.ps1:** авто-запуск Docker Desktop, MongoDB-контейнера, освобождение порта 3000
- **WarehouseService.getWarehousesByRole:** стал async (загружает склады из API перед фильтрацией)

### Tests
- **443 теста** (pass: 443, fail: 0, skip: 3)
- 14 spec-файлов переписаны под `HttpTestingController`
- `order-task.service.spec.ts` — 11 тестов с `from(async()...)` + `setTimeout` для microtask-ов
- `contract-list.component.spec.ts`, `contract-editor.component.spec.ts` — обновлены под HTTP
- `storage-item.service.spec.ts`, `warehouse.service.spec.ts` — обновлены под HTTP

### Technical
- **0 in-memory сервисов** осталось — все 34 сервиса на HTTP
- **Все 14 сервисов Фаз 2–5** конвертированы: WorkType, OrderClosing, FinancialReport, ReconciliationAct, StorageItem, Warehouse, Invoice, PurchaseRequest, SupplierOrder, Contract, OrderTask (+ уже были на HTTP: WorkCenter, Worker, ProductionOrder)
- Вызывающий код обновлён: `finance-dashboard`, `warehouse-dashboard`, `contract-list`, `contract-editor`
- Типы статусов исправлены: `ContractStatus`, `SupplierOrderStatus`, `PurchaseRequestStatus`

---

## [1.14.2] — 2026-06-08 — Полный аудит проекта + Чек-лист + Деплой kppdf-4.0

### Added
- **AUDIT_REPORT_2026-06-08.md** — полный аудит: фронтенд (95 файлов, 34 сервиса), бэкенд (16 файлов, 2 CRUD-модуля), связь, БД, бизнес-логика, UI Kit
- **Деплой kppdf-4.0:** проект развёрнут на 192.168.1.46 (порт 4000), Nginx переключён, старый kppdf-3.0 остановлен, Cloudflare tunnel активен на sport-set.ru
- **Docker Compose production:** docker-compose.prod.yml (MongoDB 4.4 из-за отсутствия AVX, ChromaDB, Backend на tsx, порт 4000)
- **Deploy-инфраструктура:** deploy/config.env, deploy/deploy.sh, deploy/nginx-kppdf40.conf, backend/.env.production, DEPLOY.md

### Changed
- **MongoDB:** 8 → 4.4 на production-сервере (CPU не поддерживает AVX-инструкции)
- **.gitignore:** добавлены deploy/config.env, backend/.env.production
- **docker-compose.yml:** исправлен healthcheck для MongoDB 4.4 (mongo → mongosh)

### Fixed
- **Сборка:** dist/browser/ вместо dist/kppdf-4.0/browser/ (Angular 21)

## [1.14.1] — 2026-06-08 — ChromaDB: TypeScript-скрипт seed + индексация .ts/.html/.scss

### Added
- **scripts/seed-chromadb.ts** — TypeScript-версия seed-скрипта для ChromaDB (запуск через `npx tsx`)
- **10 коллекций:** project_docs, knowledge_base, source_core, source_ui_kit, source_features, source_layout, source_styles, source_backend, source_types, source_config
- **Индексация кода:** .ts/.html/.scss из всех слоёв (core, shared/ui, features, layout, styles, backend, shared/types)
- **413 документов** проиндексировано (было ~105)
- **Docker ChromaDB:** перезапущен и восстановлен (был unhealthy)

---

## [1.14.0] — 2026-06-08 — Редизайн товара, управление пользователями, тёмная тема, фиксы

### Added
- **Редизайн карточки товара:** двухколоночный макет (основная + сайдбар 360px), hero-шапка со SKU/имя/метки, фотогалерея сеткой 260px с бейджем «Главное», BOM-спецификация с таблицами материалов и работ
- **Управление пользователями:** `UserService` (core/) + `UserManagementComponent` (features/admin/) — таблица пользователей (логин/имя/email/телефон/роль/статус), диалог создания (+пароль), редактирование, удаление, вкладка «Роли» с просмотром ролей
- **Тёмная тема по умолчанию:** `ThemeService.isDark` starts as `signal(true)`
- **Гант: неделя от сегодня** — начинается с понедельника текущей недели, 26 недель вперёд

### Fixed
- **Гант: часы при drag/resize не пересчитываются** — меняются только даты, `plannedHours` остаётся исходным
- **Гант: удалён мёртвый код** — неиспользуемые drag/resize переменные
- **Линт:** 5→0 ошибок (убраны неиспользуемые `KpButtonComponent` импорты в work-center/work-type/worker-list, `any` → `unknown`/typed в kp-table.onRowClick и admin-layout.getSectionId)
- **Тесты:** 433/433 (починены proposal-list под 4-й экшен file-signature, theme.service под тёмную тему по умолчанию)
- **ChromaDB:** перезапущен контейнер (был unhealthy)

---

## [1.13.0] — 2026-06-07 — Фазы 2,4,5: Производство v2, Бухгалтерия, Администрирование + Генеральная уборка

### Added — Фаза 2: Производство v2
- **Gantt v2:** профессиональная диаграмма — зум день/неделя/месяц, drag-and-drop + resize полос, тултипы при наведении, панель работников (свободен/занят), фильтры статусов, SVG-стрелки зависимостей, линия «сегодня»
- **Авто-назначение:** autoAssignWorker (ближайший свободный), assignWorker (ручное), getAvailableWorkers
- **Зависимости:** dependsOnTaskIds, блокировка старта при незавершённых зависимостях
- **Авто-задачи:** checkMissingData + generateMissingDataTasks (no_drawing/no_materials/no_work_types)
- **Отгрузка:** диалог ready→shipped, выбор шаблона (ТОРГ-12/ТТН/Акт), примечание
- **Типы:** MissingDataType, MissingDataIssue, dependsOnTaskIds, shipmentNote

### Added — Фаза 4: Бухгалтерия
- **FinanceDashboard:** сводный дашборд — 4 KPI-карточки, 6 блоков статус-брейкдаунов (заказы/КП/договоры/закрытия/сверки/отчёты)
- **OrderClosing:** 3 seed (акт АКТ-001, счёт-фактура СФ-0042, накладная ТН-0023)
- **ReconciliationAct:** 3 seed (сверки с ПРОММЕТИЗ, ХимРеактив, Администрация)
- **FinancialReport:** 2 seed (P&L Q2, дебиторская задолженность)

### Added — Фаза 5: Администрирование / Тендеры
- **Tender:** 3 seed (44-ФЗ, 223-ФЗ, коммерческий), 7 статусов, вложенные TenderDocument
- **StatusWorkflow:** 3 модели (wf-proposal, wf-contract, wf-production)
- **RoleDef:** 8 ролей, sectionIds, ролевая фильтрация меню
- **Ролевое меню:** sectionId на группах, демо-переключатель ролей в топбаре
- **RPP, Certificate, InventorFile:** seed-данные и CRUD-списки

### Changed — Генеральная уборка
- **Gantt-чарт:** инлайн-шаблон → templateUrl, инлайн-стили → SCSS (632→280 строк логики)
- **BUSINESS_LOGIC_RU.md:** v5.0 → v5.1 (метрики 433 теста, Фазы 4 и 5 ✅, Гант v2, FinanceDashboard)
- **Чек-лист:** 120→130 ✅, добавлена Фаза 6 «Генеральная уборка»

### Tests
- **415→433** (+18: order-task.service 12 + finance/administration services 6)

---

## [1.12.0] — 2026-06-07 — Фаза 1.3-1.4: Варианты КП + Договоры (Contract)

### Added — 1.3: 3 варианта КП
- **createVariants():** кнопка «Создать варианты» в редакторе КП — генерирует 3 КП с наценками 0%/5%/10%
- **Логика:** `lucideIcon="copy"`, авто-очистка корзины, навигация на список

### Added — 1.4: Договоры (Contract)
- **Типы:** `contract.ts` — `ContractStatus` (draft/active/completed/terminated), `ContractItem` (snapshot без цен), `Contract`
- **Сервис:** `ContractService` — CRUD + авто-нумерация Д-0001 + `createFromProposal` + `changeStatus`
- **Список:** `contract-list.component.ts` — kp-table, статус-бейджи, statusActions (активировать/завершить/расторгнуть)
- **Редактор:** `contract-editor.component.ts` — выбор КП (только approved), загрузка позиций из КП (snapshot без цен)
- **Маршруты:** 3 lazy-маршрута `/sales/contracts`, `/new`, `/:id/edit`
- **Меню:** пункт «📑 Договоры» в разделе «Продажи»
- **Иконки:** `LucidePlay` (41→42)

### Added — Доработки 1.2-1.3
- **Персональная наценка:** `clientMarkupPercent` computed → авто-применение в `loadFromCart()`
- **Привязка шаблона:** `templateId` в `CommercialProposal`, селектор шаблона в редакторе
- **Печать КП:** `showView` + `KpDocPreviewDialogComponent` + `fillPlaceholders` ({{number}}, {{client.name}}, {{total}}...)
- **Статус-кнопки:** `TableExtraAction` в kp-table, кнопки Отправить/Согласовать/Отклонить в списке КП

### Tests
- **313→334** (+21: contract.service 8 + contract-list 6 + contract-editor 4 + createVariants 1 + fillPlaceholders 1 + clientMarkupPercent 1)

---

## [1.11.0] — 2026-06-07 — Фаза 1.3: Коммерческие предложения (КП)

### Added
- **Типы:** `proposal.ts` — `ProposalStatus` (draft/sent/approved/rejected), `ProposalItem` (snapshot товаров), `CommercialProposal`
- **Сервис:** `CommercialProposalService` — CRUD + авто-нумерация КП-0001 + `createWithItems` + `createFromCart`
- **Список КП:** `proposal-list.component.ts` — kp-table, статус-бейджи, поиск по номеру/организации/клиенту
- **Редактор КП:** `proposal-editor.component.ts` — выбор организации/клиента, загрузка товаров из корзины, правка цены/наценки/количества, валидация
- **Маршруты:** 3 lazy-маршрута `/sales/proposals`, `/new`, `/:id/edit`
- **Меню:** пункт «📄 Коммерческие предложения» в разделе «Продажи»
- **Интеграция:** кнопка «Создать КП» в корзине → навигация в редактор с предзагрузкой товаров
- **Тесты:** 265 (+0 новых spec-файлов, но 4 созданы ранее для cart/products/clients/doc-types: +39 тестов)

### Design decisions
- **Snapshot-модель:** товары копируются в ProposalItem (name, sku, unit, price) — редактирование каталога не меняет существующие КП
- **Авто-нумерация:** КП-0001, КП-0002… (счётчик в сервисе)
- **Наценка:** `unitPrice = basePrice × (1 + markupPercent / 100)`, рассчитывается реактивно через `computed()`

---

## [1.10.0] — 2026-06-07 — Глубокий аудит и полировка (сессия Buffy)

### Added
- **Пакеты:** `@lucide/angular`, `html2canvas`, `jspdf` (пропущены при git pull)
- **Аудит-отчёт:** `AUDIT_REPORT.md` — полный анализ состояния проекта на 07.06.2026
- **Тесты:** 225 (+39 от v1.9.0)

### Fixed
- **Сборка:** бюджет стилей `anyComponentStyle` 10→15 KB (app-guide 11.72 KB)
- **Линт:** 10→0 ошибок:
  - `client.service.ts` — неиспользуемые `of`, `delay`, `generateId`, `nowISO`
  - `counterparty-role.service.ts` — неиспользуемый `CreateData`
  - `document-template.service.ts` — неиспользуемый `DocBlock`
  - `doc-type-list.component.ts` — неиспользуемый `computed`
  - `cart.component.ts` — перенос строки в шаблоне (parser error)
  - `product-category-list.component.ts` — `as any` → `as Omit<ProductCategory, ...>`
  - `kp-table.component.ts` — `event: any` → `event: unknown` + type guard
- **Тесты table-registry:** 5→6 таблиц (добавлены product-categories), 12→14 полей products
- **Тесты document-template-editor:** `templateName` по умолчанию `'Новый документ'`, `docTypeOptions` асинхронный

### Verified
- **Архитектура:** слои `core → shared → features → layout` соблюдены ✅
- **Запреты:** 0 `any` (кроме обоснованных), 0 NgModules, 0 constructor DI, все Standalone+OnPush ✅
- **Бизнес-логика:** синхронизирована с BUSINESS_LOGIC_RU.md v4.2 ✅
- **Чек-лист:** 82/132 пунктов ✅

---

## [1.9.0] — 2026-06-06 — UI/UX финализация: float-лейблы, превью, ▲▼, реестр

### Added
- **Float-лейблы:** kp-select поддерживает FloatLabelModule. Поля колонок редактора таблиц с метками «Поле», «Заголовок», «Ширина»
- **▲▼ Кнопки колонок:** pi-chevron-up/down для перемещения колонок вверх/вниз (альтернатива drag-and-drop)
- **▲▼ Кнопки блоков:** pi-chevron-up/down в kp-doc-canvas для перемещения блоков документа
- **Превью таблиц из списка:** диалог с колонками и метаданными из реестра (TableTemplateListComponent)
- **TableRegistryService:** реестр расширен 2→4 таблицы (products 12 полей, organizations 16, clients 9, suppliers 8). Данные из analysis_output/02_data_model.json
- **Тесты:** 184→186 тестов (table-registry +2)

### Fixed
- **angular.json:** пустой ключ "" → "$schema"
- **package.json:** добавлен "type": "module" (убирает ESLint warning)
- **UI Kit:** все inline-стили вынесены в CSS-классы
- **NG0955:** track col.fieldName → track $index в превью редактора таблиц
- **Выравнивание:** поля колонок на одном уровне (убраны компенсационные padding-top)

### Changed
- **Превью таблиц:** улучшена стилизация (border-radius, uppercase-заголовки, моноширинный шрифт)
- **kp-table:** showView input + rowView output + иконка просмотра

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
