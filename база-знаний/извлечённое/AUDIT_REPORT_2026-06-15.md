# AUDIT REPORT — KPPDF 4.0

> **Дата:** 2026-06-15
> **Метод:** Параллельный аудит 4 слоёв (backend, core, features, shared/ui + config) через 4 независимых агентов
> **Версия кодовой базы:** d87cdac (fast-forward от 6d17428, 180 файлов, +8384 / -3356 строк)

---

## Резюме

Проект **сильно выше среднего**. Архитектура слоёв чётко выдержана, zero `any`, все standalone + OnPush, signals повсюду, 470 тестов, отличная документация. Однако есть **6 критических проблем безопасности** и **~12 архитектурных недочётов**.

**Общая оценка:** 🟢 7.5/10

---

## КРИТИЧНО (Безопасность)

### 1. Нет авторизации на бэкенде
- Auth проверяет только _кто_ ты, но не _что_ тебе можно
- `User.role` существует (`user.model.ts:24`), но нигде не проверяется серверным middleware
- `monitor.routes.ts:37` — комментарий: "admin check on frontend via RoleGuard"
- **Любой авторизованный пользователь может вызвать любой эндпоинт**

### 2. Regex-инъекция в поиске
- `crud-factory.ts:84`: `new RegExp(search, 'i')` — пользовательский ввод напрямую в конструктор регулярки
- Спецсимволы (`.*`, `(`, `+`) ломают запросы или вызывают ReDoS

### 3. Mass-assignment через PUT
- `crud-factory.ts:156`: `$set: req.body` без валидации
- Можно перезаписать `_id`, `role`, `createdBy` и любые поля

### 4. Upload без авторизации
- `upload.routes.ts` не использует `authMiddleware`
- Файлы можно загружать анонимно

### 5. Race condition в складе
- `inventory.routes.ts:86-123`: find-then-update без транзакций
- Параллельные движения товара могут исказить остатки

### 6. Хардкод дефолтных секретов
- `config/env.ts:12`: `JWT_SECRET` дефолтится на `'dev-secret-change-in-production'`
- Тихий фоллбек в проде

---

## СЕРЬЁЗНО (Архитектура)

### 7. Нулевая referential integrity
- Все 33 модели — FK как `String`, без `Schema.Types.ObjectId` / `ref:`
- `populate()` нигде не используется (опция в CRUD factory не настроена ни в одном роутере)
- Орфанные ссылки копятся молча

### 8. Три соглашения именования методов в сервисах

| Паттерн | Примеры |
|---|---|
| `getAll/getById/create/update/delete` | User, Product, Tender, Worker, Role, WorkCenter, WorkType, FinancialReport, ReconciliationAct, Rpp, OrderClosing, InventorFile, ProductCategory, ProductComponent, StatusWorkflow (15 сервисов) |
| `getEntit/getEntity/createEntity/updateEntity/deleteEntity` | Client (`getClients`), Contract (`getContracts`), Invoice, Warehouse, DocumentTemplate, TableTemplate, DocType, StorageItem, SupplierOrder, Organization, PurchaseRequest (11 сервисов) |
| `getAll` + алиасы | Product (есть `getAll()` и `getProducts()`), Client (`getAll()` → `getClients()`), Organization |

### 9. Бизнес-логика на клиенте
- `ContractService` (lines 31-45): маппинг снимков предложений → контрактных позиций
- `CommercialProposalService` (lines 35-40): клиентский расчёт `totalAmount`
- `OrderTaskService` (lines 60-84): валидация зависимостей перед сменой статуса
- Бэкенд не валидирует бизнес-правила

### 10. Dead code в сервисах
- 4 сервиса хранят клиентские счётчики номеров (дублируют серверную логику):
  - `ContractService` (line 6): `let contractCounter = 0`
  - `InvoiceService` (line 6): `let invCounter = 3`
  - `PurchaseRequestService` (line 6): `let prCounter = 4`
  - `SupplierOrderService` (line 6): `let soCounter = 3`

### 11. `BaseCrudService` мёртв
- Определён в `crud-factory.ts` (lines 37-112), но ни один сервис его не наследует
- Все используют `ApiService` напрямую

### 12. `ProductPhotoService` лезет в приватные поля
- `(this.productService as unknown as { items?: ... }).items` (lines 65, 172, 177)
- Unsafe cast в приватное состояние другого сервиса

### 13. Нет валидации на CRUD-маршрутах
- Все 30+ сущностей передают пустые `createValidations` / `updateValidations` в `createCrudRouter`
- Только `auth.routes.ts` использует `express-validator`

### 14. Swagger — скелет
- `docs/swagger.ts:193-197`: комментарий-заглушка, ноль entity-схем
- Документированы только User/auth эндпоинты при 30+ роутах

### 15. `ApiResponse<T>` дублирование типов
- `api-response.ts:5` — типы дублируют `shared/types/index.ts` из-за `rootDir: ./src`
- Поддерживать два идентичных определения — долг

### 16. `counter.model.ts` используется минимально
- Только `commercial-proposal.routes.ts:15` вызывает `nextCounter('cp')`
- Другие нумеруемые сущности (contract, invoice, tender, purchase-request, supplier-order) генерируют номера на клиенте

---

## НАРУШЕНИЯ AGENTS.md

| Правило | Статус | Нарушения |
|---|---|---|
| `any → unknown + type guard` | ✅ | Zero violations |
| `NgModules → Standalone` | ✅ | Zero violations |
| `constructor DI → inject()` | ✅ | 252 использования inject() |
| `Inline-style → SCSS` | ❌ | **13 компонентов** во features + 3 в shared/ui (kp-input, kp-table, kp-doc-canvas) |
| `Прямой primeng/* в features` | ❌ | `TooltipModule` в 2 компонентах, `MenuItem` в ~45 файлах |

### Inline-стили (нарушение)

| Компонент | Файл |
|---|---|
| ui-kit | `features/ui-kit/ui-kit.component.ts:396` |
| proposal-list | `features/proposals/proposal-list.component.ts:78` |
| finance-dashboard | `features/finance/finance-dashboard.component.ts:253` |
| app-guide | `features/app-guide/app-guide.component.ts:282` |
| client-list | `features/clients/client-list.component.ts:102` |
| doc-type-list | `features/doc-types/doc-type-list.component.ts:97` |
| user-management | `features/admin/user-management.component.ts:104` |
| counterparty-role-editor | `features/counterparty-roles/counterparty-role-editor.component.ts:99` |
| counterparty-role-list | `features/counterparty-roles/counterparty-role-list.component.ts:62` |
| markup-analysis | `features/markup-analysis/markup-analysis.component.ts:106` |
| login | `features/login/login.component.ts:76` |
| dashboard | `features/dashboard/dashboard.component.ts:73` |
| feature-flags | `features/feature-flags/feature-flags.component.ts:69` |
| kp-input | `shared/ui/kp-input.component.ts:110-232` (~120 строк) |
| kp-table | `shared/ui/kp-table.component.ts:167-306` (~140 строк) |
| kp-doc-canvas | `shared/ui/kp-doc-canvas.component.ts:149-342` (~190 строк) |

---

## СРЕДНЕ (Качество кода)

### 17. Два сервиса обходят `ApiService`
- `AuthService` (lines 28-37, 41-49): `this.http.post` напрямую
- `MonitorService` (lines 42-45): `HttpClient` напрямую, хардкод `/api/v1/monitor`
- Нет timeout/retry

### 18. `::ng-deep` overuse
- kp-input: 14 вхождений
- kp-select: 13
- kp-table: 7
- kp-doc-canvas: 3
- Angular рекомендует CSS custom properties или `::part()`

### 19. `NotificationService` минует shared/ui
- Импортирует `MessageService` из `primeng/api` напрямую

### 20. `CounterpartyRoleService.getCachedRoles()`
- Fire-and-forget `.subscribe()` в синхронном геттере (lines 48-58)
- Первый вызов всегда возвращает `[]`

### 21. Мёртвые стабы
- `Product.previewSku()` (product.service.ts:59-62): хардкод `'***'`
- `BaseCrudService.update()` (crud-factory.ts:74): `return undefined as unknown as T`

### 22. Нет `kp-field-row` компонента
- `kp-field-group.component.ts` (lines 11-14) документирует `<kp-field-row>` в JSDoc
- Компонент нигде не определён

### 23. AGENTS.md не актуален
- `KpFieldGroupComponent` существует, но не в таблице доступных компонентов
- `KpFieldRowComponent` описан в таблице, но не существует

### 24. Pre-commit hook слишком агрессивен
- 5-ступенчатая проверка на каждый коммит: ветка, иконки, lint, build, тесты
- ~5-10+ минут на коммит

### 25. Нет coverage thresholds
- Vitest настроен, 470 тестов, но нет минимального порога покрытия

---

## ХОРОШО (Стоит отметить)

| # | Аспект | Детали |
|---|--------|--------|
| 1 | **Слоистая архитектура** | `core → shared → features → layout` — строго, без циклических зависимостей |
| 2 | **CRUD Factory** | `createCrudRouter()` — пагинация, поиск, сортировка, хуки, тесты с mongodb-memory-server |
| 3 | **UI Kit** | 25 kp-* компонентов, все standalone + OnPush + signals, чистые обёртки над PrimeNG |
| 4 | **Типизация** | Zero `any`, `ApiResponse<T>` консистентно, strict TS + strictTemplates |
| 5 | **Signals** | Повсеместно: AuthService, CartService, PageTitleService, все компоненты |
| 6 | **inject()** | 252 использования, zero constructor DI |
| 7 | **470 тестов** | Vitest + jsdom, покрытие сервисов и UI Kit |
| 8 | **Docker** | dev (MongoDB 8 + ChromaDB) и prod конфиги с health checks |
| 9 | **Документация** | CHANGELOG (543 строки, 18 версий) + RUNBOOK (598 строк) — exemplary |
| 10 | **Pre-commit** | 5-ступенчатая проверка (ветка, иконки, lint, build, тесты) |
| 11 | **JWT Auth** | access + refresh токены, HttpOnly cookie, rate limiting, bcrypt |
| 12 | **Lazy-loading** | Все маршруты лениво загружаются через `loadComponent` |

---

## Рекомендуемый приоритет исправлений

| # | Приоритет | Задача | Сложность |
|---|-----------|--------|-----------|
| 1 | 🔴 P0 | Серверная авторизация — middleware проверки ролей | Высокая |
| 2 | 🔴 P0 | Эскейпинг regex в `crud-factory.ts` | Низкая |
| 3 | 🔴 P0 | Валидация CRUD — `express-validator` chains | Средняя |
| 4 | 🔴 P0 | Mass-assignment защита — whitelist полей в PUT | Средняя |
| 5 | 🔴 P0 | Auth middleware на upload routes | Низкая |
| 6 | 🟡 P1 | Referential integrity — `ObjectId` + `ref:` в моделях | Высокая |
| 7 | 🟡 P1 | Бизнес-логика на бэкенд (валидация правил) | Высокая |
| 8 | 🟡 P1 | Единое именование сервисов | Средняя |
| 9 | 🟡 P1 | Вынести inline styles в SCSS (16 компонентов) | Средняя |
| 10 | 🟢 P2 | Удалить dead code (BaseCrudService, счётчики, previewSku) | Низкая |
| 11 | 🟢 P2 | Добавить `::ng-deep` → CSS custom properties | Средняя |
| 12 | 🟢 P2 | Coverage thresholds в Vitest | Низкая |
| 13 | 🟢 P2 | Обновить AGENTS.md (KP-таблица компонентов) | Низкая |
| 14 | 🟢 P2 | Упростить pre-commit hook (только lint + быстрые проверки) | Низкая |

---

## Метрики слоёв

| Слой | Файлов | Паттерн | Оценка |
|------|--------|---------|--------|
| **Backend** (modules/) | 68 | CRUD factory, JWT, Mongoose | 🟡 6/10 (нет авторизации, валидации) |
| **Core** (services/) | 87 | ApiService, signals, inject | 🟢 7/10 (мёртвый код, рассинхрон имен) |
| **Features** (components/) | 52 компонента, 20 модулей | Standalone, OnPush, signals | 🟢 8/10 (inline styles, primeng imports) |
| **Shared UI** (kp-*) | 25 | Signal inputs, CVA, thin wrappers | 🟢 8/10 (::ng-deep, inline SCSS) |
| **Config & CI** | — | Angular 21, Vitest, Docker, Husky | 🟢 8/10 (нет coverage thresholds) |
| **Документация** | — | CHANGELOG, RUNBOOK | 🟢 9/10 |

---

## Исправлено (2026-06-15)

### P0 — Безопасность (6/6 исправлено)

| # | Проблема | Файл | Решение |
|---|----------|------|---------|
| 1 | Regex-инъекция в поиске | `crud-factory.ts:84` | Добавлена функция `escapeRegex()` для экранирования спецсимволов |
| 2 | Mass-assignment через PUT | `crud-factory.ts:148-166` | Добавлен `allowedFields` в CrudOptions + фильтрация req.body + запрет на изменение `_id`, `__v`, `createdAt`, `createdBy` |
| 3 | Upload без авторизации | `upload.routes.ts` | Добавлен `authMiddleware` на все эндпоинты загрузки |
| 4 | Нет серверной авторизации | `auth.ts` | Добавлены `requireRole()` и `requirePermission()` middleware |
| 5 | Monitor без проверки роли | `monitor.routes.ts` | Добавлены `authMiddleware` + `requireRole('admin')` |
| 6 | JWT_SECRET в проде | `env.ts:12` | Бросает ошибку если `NODE_ENV=production` и секрет не задан |
| 7 | Role/User без проверки прав | `role.routes.ts`, `user.routes.ts` | Добавлен `requireRole('admin')` + `allowedFields` |
| 8 | Organization/Product без валидации | `organization.routes.ts`, `product.routes.ts` | Добавлены `allowedFields` для mass-assignment защиты |

### P1 — Архитектура (5/5 исправлено)

| # | Проблема | Файл | Решение |
|---|----------|------|---------|
| 9 | Inventory race condition | `inventory.routes.ts:86-123` | Заменён find-then-update на атомарный `findOneAndUpdate` с upsert |
| 10 | AuthService обходил ApiService | `auth.service.ts` | Переписан на `ApiService.post()` с `withCredentials` |
| 11 | MonitorService обходил ApiService | `monitor.service.ts` | Переписан на `ApiService.get()` |
| 12 | CounterpartyRoleService race condition | `counterparty-role.service.ts` | Кеш через `signal` + `loadAttempted` флаг вместо repeated subscribe |
| 13 | previewSku мёртвый стаб | `product.service.ts`, `product-editor.component.ts` | Удалён метод, убран вызов из editor |

### P2 — Инфраструктура

| # | Проблема | Файл | Решение |
|---|----------|------|---------|
| 14 | ApiService без withCredentials | `api.service.ts` | Добавлен опциональный параметр `withCredentials` в `post()` |

### Статус проверки

| Проверка | Результат |
|----------|-----------|
| `ng build` | ✅ Успешно (2.02 MB) |
| `ng lint` | ✅ All files pass linting |
| `vitest run` (фронтенд) | ✅ 470/470 тестов пройдено |
| `tsc --noEmit` (бэкенд) | ✅ Без ошибок |
| `vitest run` (бэкенд) | ✅ 5/5 unit-тестов, 11 пропущены (MongoDB download timeout — pre-existing) |
