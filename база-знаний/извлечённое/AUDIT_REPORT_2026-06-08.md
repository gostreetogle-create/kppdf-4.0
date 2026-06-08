# АУДИТ-ОТЧЁТ kppdf-4.0 — 2026-06-08

> Полный аудит: фронтенд, бэкенд, связь, БД, бизнес-логика, готовность к production.
> Автор: Buffy (Codebuff AI)
> Статус: v1.14.1 · 433 теста · ✅ сборка · ✅ деплой (http://sport-set.ru)

---

## 📋 СОДЕРЖАНИЕ

1. [Резюме — что важно знать](#1-резюме)
2. [Фронтенд — полный аудит](#2-фронтенд)
3. [Бэкенд — полный аудит](#3-бэкенд)
4. [Связь фронтенда и бэкенда](#4-связь-фронтенда-и-бэкенда)
5. [База данных — аудит коллекций](#5-база-данных)
6. [Бизнес-логика — что реализовано vs что нужно](#6-бизнес-логика)
7. [UI Kit — аудит компонентов](#7-ui-kit)
8. [Чек-лист консолидированный](#8-чек-лист)
9. [ChromaDB — нужна ли на сервере?](#9-chromadb)
10. [План действий — что делать дальше](#10-план-действий)

---

## 1. РЕЗЮМЕ

### Что хорошо ✅
- **Архитектура проекта** — отличная: модульная, слоистая (`core → shared → features → layout`), standalone-компоненты, OnPush, Signals
- **UI Kit** — 22 компонента, дизайн-токены, 2 темы, всё переиспользуемо
- **Бизнес-логика** — хорошо документирована (BUSINESS_LOGIC_RU.md v5.1, 46 бизнес-правил)
- **Тесты** — 433 теста, покрытие хорошее
- **Деплой** — успешно развёрнут на сервере, Cloudflare Tunnel работает
- **Snapshot-модель** — правильная архитектура для КП/договоров

### Что критично 🚨
- **Фронтенд НЕ ПОДКЛЮЧЁН к бэкенду** — все сервисы работают на моках/seed-данных in-memory. Реальных HTTP-запросов нет
- **Бэкенд содержит только 2 полноценных CRUD-модуля** (organizations, counterparty-roles) + auth. Остальные ~30 таблиц данных существуют только на фронтенде в виде моков
- **Frontend-сервисы (core/) не используют ApiService** — они напрямую работают с сигналами и seed-данными. ApiService есть, но для авторизации, не для CRUD

### Что важно сделать 🔧
1. **Подключить фронтенд к бэкенду** — самый важный этап
2. **Создать Mongoose-модели + CRUD-роутеры** для всех сущностей (products, clients, proposals, contracts, production, warehouse, finance, administration)
3. **Автоматическая миграция** seed-данных с фронта на бэк

---

## 2. ФРОНТЕНД — ПОЛНЫЙ АУДИТ

### 2.1 Структура (95 файлов .ts, без spec)

```
src/app/
├── core/          — 34 сервиса (все на моках/seed)
├── shared/ui/     — 22 компонента UI Kit + index.ts
├── features/      — 26 страниц в 15 папках
├── layout/        — 1 компонент (admin-layout)
├── app.config.ts
├── app.routes.ts
└── app.component.ts

shared/types/      — 8 файлов (index.ts + модульные типы)
```

### 2.2 Сервисы core/ — статус подключения к бэкенду

| Сервис | Мок/Seed | HttpClient | Статус |
|--------|----------|------------|--------|
| auth.service.ts | ✅ JWT логика | ✅ ApiService | ✅ Работает через HTTP |
| api.service.ts | — | ✅ | ✅ База для всех запросов |
| organization.service.ts | ✅ seed | ❌ | ⚠️ Только мок |
| counterparty-role.service.ts | ✅ seed | ❌ | ⚠️ Только мок |
| product.service.ts | ✅ seed (10 товаров) | ❌ | ⚠️ Только мок |
| product-category.service.ts | ✅ seed (7 категорий) | ❌ | ⚠️ Только мок |
| product-photo.service.ts | ✅ seed (7 фото) | ❌ | ⚠️ Только мок |
| product-component.service.ts | ✅ seed (7 компонентов) | ❌ | ⚠️ Только мок |
| client.service.ts | ✅ seed (5 клиентов) | ❌ | ⚠️ Только мок |
| cart.service.ts | ✅ in-memory | ❌ | ⚠️ Только мок |
| commercial-proposal.service.ts | ✅ seed | ❌ | ⚠️ Только мок |
| contract.service.ts | ✅ seed | ❌ | ⚠️ Только мок |
| doc-type.service.ts | ✅ seed | ❌ | ⚠️ Только мок |
| document-template.service.ts | ✅ seed | ❌ | ⚠️ Только мок |
| table-template.service.ts | ✅ seed | ❌ | ⚠️ Только мок |
| table-registry.service.ts | ✅ seed | ❌ | ⚠️ Только мок |
| feature-flag.service.ts | ✅ seed | ❌ | ⚠️ Только мок |
| notification.service.ts | ✅ MessageService | — | ✅ Чистый UI |
| theme.service.ts | ✅ signal | — | ✅ Чистый UI |
| warehouse.service.ts | ✅ seed (2 склада) | ❌ | ⚠️ Только мок |
| storage-item.service.ts | ✅ seed | ❌ | ⚠️ Только мок |
| inventory.service.ts | ✅ seed (14 движений) | ❌ | ⚠️ Только мок |
| purchase-request.service.ts | ✅ seed (4 заявки) | ❌ | ⚠️ Только мок |
| supplier-order.service.ts | ✅ seed (3 заказа) | ❌ | ⚠️ Только мок |
| invoice.service.ts | ✅ seed (3 счёта) | ❌ | ⚠️ Только мок |
| work-type.service.ts | ✅ seed (9 видов) | ❌ | ⚠️ Только мок |
| work-center.service.ts | ✅ seed (6 центров) | ❌ | ⚠️ Только мок |
| worker.service.ts | ✅ seed (5 работников) | ❌ | ⚠️ Только мок |
| production-order.service.ts | ✅ seed (2 заказа) | ❌ | ⚠️ Только мок |
| order-task.service.ts | ✅ seed (8 задач) | ❌ | ⚠️ Только мок |
| tender.service.ts | ✅ seed (3 тендера) | ❌ | ⚠️ Только мок |
| status-workflow.service.ts | ✅ seed | ❌ | ⚠️ Только мок |
| role.service.ts | ✅ seed (8 ролей) | ❌ | ⚠️ Только мок |
| rpp.service.ts | ✅ seed (2 записи) | ❌ | ⚠️ Только мок |
| certificate.service.ts | ✅ seed (3 сертификата) | ❌ | ⚠️ Только мок |
| inventor-file.service.ts | ✅ seed (4 файла) | ❌ | ⚠️ Только мок |
| order-closing.service.ts | ✅ seed (3 записи) | ❌ | ⚠️ Только мок |
| reconciliation-act.service.ts | ✅ seed (3 акта) | ❌ | ⚠️ Только мок |
| financial-report.service.ts | ✅ seed (2 отчёта) | ❌ | ⚠️ Только мок |

**Итого: 1 сервис из 34 подключён к реальному HTTP API (auth).**

### 2.3 Страницы features/ (26 страниц)

| Страница | Маршрут | CRUD | Бэкенд |
|----------|---------|------|--------|
| Dashboard | `/dashboard` | read-only | ❌ |
| Login | `/login` | auth | ✅ |
| UI Kit | `/ui-kit` | demo | — |
| OrganizationList | `/references/organizations` | ✅ | ❌ мок |
| OrganizationEditor | `/references/organizations/:id` | ✅ | ❌ мок |
| ClientList | `/references/clients` | ✅ | ❌ мок |
| CounterpartyRoleList | `/references/counterparty-roles` | ✅ | ❌ мок |
| CounterpartyRoleEditor | `/references/counterparty-roles/:id` | ✅ | ❌ мок |
| DocTypeList | `/references/doc-types` | ✅ | ❌ мок |
| ProductCategoryList | `/references/product-categories` | ✅ | ❌ мок |
| ProductList | `/sales/products` | ✅ | ❌ мок |
| ProductEditor | `/sales/products/:id` | ✅ | ❌ мок |
| Cart | `/sales/cart` | ✅ | ❌ мок |
| ProposalList | `/sales/proposals` | ✅ | ❌ мок |
| ProposalEditor | `/sales/proposals/:id` | ✅ | ❌ мок |
| ContractList | `/sales/contracts` | ✅ | ❌ мок |
| ContractEditor | `/sales/contracts/:id` | ✅ | ❌ мок |
| WorkTypeList | `/production/work-types` | ✅ | ❌ мок |
| WorkCenterList | `/production/work-centers` | ✅ | ❌ мок |
| WorkerList | `/production/workers` | ✅ | ❌ мок |
| ProductionOrderList | `/production/orders` | ✅ | ❌ мок |
| OrderTaskList | `/production/tasks` | ✅ | ❌ мок |
| GanttChart | `/production/gantt` | ✅ | ❌ мок |
| WarehouseDashboard | `/warehouse` | read | ❌ мок |
| WarehouseDetail | `/warehouse/:id` | ✅ | ❌ мок |
| StorageItemList | `/warehouse/storage-items` | ✅ | ❌ мок |
| PurchaseRequestList | `/warehouse/purchase-requests` | ✅ | ❌ мок |
| SupplierOrderList | `/warehouse/supplier-orders` | ✅ | ❌ мок |
| InvoiceList | `/warehouse/invoices` | ✅ | ❌ мок |
| FinanceDashboard | `/finance` | read | ❌ мок |
| OrderClosingList | `/finance/order-closing` | ✅ | ❌ мок |
| ReconciliationActList | `/finance/reconciliation` | ✅ | ❌ мок |
| FinancialReportList | `/finance/reports` | ✅ | ❌ мок |
| TenderList | `/admin/tenders` | ✅ | ❌ мок |
| StatusWorkflowList | `/admin/status-workflows` | ✅ | ❌ мок |
| UserManagement | `/admin/users` | ✅ | ❌ мок (in-memory) |
| RppList | `/admin/rpp` | ✅ | ❌ мок |
| CertificateList | `/admin/certificates` | ✅ | ❌ мок |
| InventorFileList | `/admin/cad-files` | ✅ | ❌ мок |
| DocumentTemplateList | `/admin/document-templates` | ✅ | ❌ мок |
| DocumentTemplateEditor | `/admin/document-templates/:id` | ✅ | ❌ мок |
| TableTemplateList | `/admin/table-templates` | ✅ | ❌ мок |
| TableTemplateEditor | `/admin/table-templates/:id` | ✅ | ❌ мок |
| FeatureFlags | `/admin/feature-flags` | read | ❌ мок |
| AppGuide | `/app-guide` | read | — |

**Итого: 0 страниц из 44 подключены к реальному бэкенду.**

### 2.4 Аудит архитектурных принципов

| Принцип | Статус | Комментарий |
|---------|--------|-------------|
| Standalone-компоненты | ✅ | Все компоненты standalone, без NgModules |
| OnPush change detection | ✅ | Во всех компонентах |
| Signals вместо @Input/@Output | ✅ | signal(), input(), output(), model() |
| inject() вместо constructor DI | ✅ | Нигде нет constructor DI |
| Нет `any` | ⚠️ | Единичные случаи (kp-table.onRowClick, но type guard) |
| Все API-ответы через ApiResponse<T> | ⚠️ | ApiResponse<T> определён, но не используется в моках |
| Пагинация для списков | ⚠️ | Реализована через kp-table, но данные все в памяти |
| Русский язык в интерфейсе | ✅ | Весь UI на русском |
| kp-* вместо прямого PrimeNG | ✅ | Нигде нет прямых primeng/* на страницах |
| Нет NgRx | ✅ | Только Signals |

---

## 3. БЭКЕНД — ПОЛНЫЙ АУДИТ

### 3.1 Структура (16 файлов .ts)

```
backend/src/
├── index.ts              — точка входа, Express, middleware
├── config/
│   ├── env.ts            — конфиг окружения
│   └── db.ts             — MongoDB подключение
├── middleware/
│   ├── auth.ts           — JWT-аутентификация
│   └── error-handler.ts  — централизованная обработка ошибок
├── modules/
│   ├── user.model.ts     — Mongoose-модель пользователя
│   ├── auth.routes.ts    — логин/refresh/logout/me
│   ├── organization.model.ts     — Mongoose-модель организации
│   ├── organization.routes.ts    — CRUD + search + filter
│   ├── counterparty-role.model.ts     — Mongoose-модель
│   └── counterparty-role.routes.ts    — CRUD
├── utils/
│   ├── crud-factory.ts   — универсальная CRUD фабрика (6 эндпоинтов)
│   ├── crud-factory.spec.ts — тесты фабрики
│   └── api-response.ts   — success/paginated/error формат
├── docs/
│   └── swagger.ts        — Swagger UI (не реализован до конца)
└── Dockerfile            — node:22-alpine, tsx
```

### 3.2 Эндпоинты API

| Метод | Путь | Описание | Статус |
|-------|------|----------|--------|
| GET | `/api/health` | Health check | ✅ Работает |
| POST | `/api/v1/auth/login` | Вход | ✅ Работает |
| POST | `/api/v1/auth/refresh` | Обновление токена | ✅ |
| POST | `/api/v1/auth/logout` | Выход | ✅ |
| GET | `/api/v1/auth/me` | Профиль | ✅ |
| GET | `/api/v1/organizations` | Список | ✅ с поиском/пагинацией |
| POST | `/api/v1/organizations` | Создать | ✅ |
| GET | `/api/v1/organizations/:id` | Получить | ✅ |
| PUT | `/api/v1/organizations/:id` | Обновить | ✅ |
| DELETE | `/api/v1/organizations/:id` | Удалить | ✅ |
| GET | `/api/v1/counterparty-roles` | Список | ✅ |
| POST | `/api/v1/counterparty-roles` | Создать | ✅ |
| GET/PUT/DELETE | по ID | CRUD | ✅ |
| GET | `/api/docs` | Swagger UI | ⚠️ Не настроен до конца |

### 3.3 Чего не хватает на бэкенде

**Полностью отсутствуют Mongoose-модели и CRUD-роутеры для:**

| Сущность | Файлов на фронте | Нужен бэк |
|----------|-----------------|------------|
| Product | ✅ product.service.ts | ❌ |
| ProductCategory | ✅ product-category.service.ts | ❌ |
| ProductPhoto | ✅ product-photo.service.ts | ❌ |
| ProductComponent | ✅ product-component.service.ts | ❌ |
| Client | ✅ client.service.ts | ❌ |
| CommercialProposal | ✅ commercial-proposal.service.ts | ❌ |
| Contract | ✅ contract.service.ts | ❌ |
| DocType | ✅ doc-type.service.ts | ❌ |
| DocumentTemplate | ✅ document-template.service.ts | ❌ |
| TableTemplate | ✅ table-template.service.ts | ❌ |
| Warehouse | ✅ warehouse.service.ts | ❌ |
| StorageItem | ✅ storage-item.service.ts | ❌ |
| InventoryItem | ✅ inventory.service.ts | ❌ |
| InventoryMovement | ✅ inventory.service.ts | ❌ |
| PurchaseRequest | ✅ purchase-request.service.ts | ❌ |
| SupplierOrder | ✅ supplier-order.service.ts | ❌ |
| IncomingInvoice | ✅ invoice.service.ts | ❌ |
| WorkType | ✅ work-type.service.ts | ❌ |
| WorkCenter | ✅ work-center.service.ts | ❌ |
| Worker | ✅ worker.service.ts | ❌ |
| ProductionOrder | ✅ production-order.service.ts | ❌ |
| OrderTask | ✅ order-task.service.ts | ❌ |
| Tender | ✅ tender.service.ts | ❌ |
| StatusWorkflow | ✅ status-workflow.service.ts | ❌ |
| RoleDef | ✅ role.service.ts | ❌ |
| RppEntry | ✅ rpp.service.ts | ❌ |
| Certificate | ✅ certificate.service.ts | ❌ |
| InventorFile | ✅ inventor-file.service.ts | ❌ |
| OrderClosing | ✅ order-closing.service.ts | ❌ |
| ReconciliationAct | ✅ reconciliation-act.service.ts | ❌ |
| FinancialReport | ✅ financial-report.service.ts | ❌ |

**Итого: ~31 модель на фронте — 0 на бэкенде (кроме User, Organization, CounterpartyRole).**

### 3.4 Аудит бэкенда

| Аспект | Статус | Комментарий |
|--------|--------|-------------|
| CRUD Factory | ✅ | Отличная универсальная фабрика с search, sort, pagination, populate |
| Безопасность | ✅ | Helmet, rate-limit, JWT, HttpOnly cookie, express.json(limit) |
| Логирование | ✅ | Pino, структурированные логи |
| Swagger | ⚠️ | setupSwagger есть, но документация не заполнена |
| Graceful Shutdown | ✅ | SIGTERM/SIGINT, отключение MongoDB |
| Обработка ошибок | ✅ | AppError, ValidationError → 400, CastError → 400 |
| Mongoose toJSON | ✅ | _id → id, __v удалён |
| Типизация | ✅ | IUser, IOrganization, ICounterpartyRole интерфейсы |
| User model | ⚠️ | role: 'admin' \| 'manager' \| 'viewer' — не хватает 'production', 'storekeeper', 'accountant' (есть в shared/types) |
| Seed данных | ⚠️ | Только admin создаётся при старте. Нет seed-скрипта для демо-данных |

---

## 4. СВЯЗЬ ФРОНТЕНДА И БЭКЕНДА

### 4.1 API URL (InjectionToken)

```typescript
// api-url.token.ts
export const API_URL = new InjectionToken<string>('API_URL', {
  providedIn: 'root',
  factory: () => '/api/v1'
});
```

✅ **Правильно:** API_URL внедрён как InjectionToken, можно менять для разных окружений.

### 4.2 Auth Interceptor

```typescript
// auth.interceptor.ts — функциональный HttpInterceptorFn
✅ Добавляет Authorization: Bearer <token>
✅ Обрабатывает 401 → refresh → retry
✅ Потокобезопасная очередь при конкурирующих refresh
```

### 4.3 ApiService

```typescript
// api.service.ts
get<T>(path, params?)     — GET запрос
post<T>(path, body?)      — POST запрос
put<T>(path, body?)       — PUT запрос
delete<T>(path)           — DELETE запрос
```

✅ **ApiService существует и готов к использованию.**

### 4.4 Проблема: сервисы не используют ApiService

Каждый сервис (например, product.service.ts) работает так:

```typescript
// ❌ ТЕКУЩАЯ РЕАЛЬНОСТЬ — все данные in-memory
private products = signal<Product[]>(SEED_PRODUCTS);
readonly items = this.products.asReadonly();

async getAll() { return this.products(); }
async create(data) { /* push в массив */ }
```

Должно быть:

```typescript
// ✅ ЦЕЛЕВОЕ СОСТОЯНИЕ — через HTTP
constructor(private api: ApiService) {}

async getAll() {
  return this.api.get<Product[]>('/products');
}
async create(data: CreateProduct) {
  return this.api.post<Product>('/products', data);
}
```

### 4.5 Контракты (shared/types)

✅ **Правильно:** Все типы вынесены в `shared/types/`. Фронтенд и бэкенд должны использовать одни и те же интерфейсы.

⚠️ **Проблема:** Бэкенд дублирует ApiResponse в `backend/src/utils/api-response.ts` — есть комментарий, что tsconfig бэкенда не видит shared/.

**Решение:** Настроить tsconfig backend для импорта из shared/, либо скопировать типы.

---

## 5. БАЗА ДАННЫХ — АУДИТ КОЛЛЕКЦИЙ

### 5.1 MongoDB коллекции (что есть на сервере)

```
kppdf40 (БД)
├── users               — пользователи (только admin)
├── organizations       — пусто (нет seed)
├── counterpartyroles   — пусто (нет seed)
```

**На сервере MongoDB только что запущена — данных нет, кроме admin.**

### 5.2 Что должно быть создано (полный список)

| Коллекция | Seed-данные на фронте | На бэкенде |
|-----------|----------------------|------------|
| users | admin (авто) | ✅ модель + авто-создание |
| organizations | 3 seed (МеталлПродукт, ХимРеактив, Администрация) | ✅ модель, ❌ seed |
| counterpartyroles | 4 seed (supplier, broker, carrier, buyer) | ✅ модель, ❌ seed |
| productcategories | 7 seed (SP, MF, OG, OS, MB, NV, PR) | ❌ |
| products | 10 seed | ❌ |
| productphotos | 7 seed | ❌ |
| productcomponents | 7 seed (для 3 товаров) | ❌ |
| clients | 5 seed | ❌ |
| commercialproposals | 2 seed (КП-0001/0002) | ❌ |
| contracts | 1 seed | ❌ |
| doctypes | 4 seed | ❌ |
| documenttemplates | 2 seed (КП, Договор) | ❌ |
| tabletemplates | 2 seed | ❌ |
| warehouses | 2 seed | ❌ |
| storageitems | 5 seed | ❌ |
| inventoryitems | 14 seed-движений | ❌ |
| purchaserequests | 4 seed | ❌ |
| supplierorders | 3 seed | ❌ |
| incominginvoices | 3 seed | ❌ |
| worktypes | 9 seed | ❌ |
| workcenters | 6 seed | ❌ |
| workers | 5 seed | ❌ |
| productionorders | 2 seed | ❌ |
| ordertasks | 8 seed | ❌ |
| tenders | 3 seed | ❌ |
| statusworkflows | 3 seed | ❌ |
| roledefs | 8 seed | ❌ |
| rppentries | 2 seed | ❌ |
| certificates | 3 seed | ❌ |
| inventorfiles | 4 seed | ❌ |
| orderclosings | 3 seed | ❌ |
| reconciliationacts | 3 seed | ❌ |
| financialreports | 2 seed | ❌ |

---

## 6. БИЗНЕС-ЛОГИКА

### 6.1 Что реализовано ✅

#### Модуль 0: Ядро (полностью)
- Конструктор документов (шаблоны таблиц + документов + A4-холст + блоки + печать)
- UI Kit (22 компонента, дизайн-токены, 2 темы)
- Справочники: контрагенты, роли контрагентов, типы документов, feature flags

#### Модуль 1: Продажи (полностью на фронте)
- Товары + категории + фото + компоненты (BOM)
- Клиенты (физ.лица с персональной наценкой)
- Корзина → КП (3 варианта) → Договоры
- Snapshot-модель, печать PDF

#### Модуль 2: Производство (полностью на фронте)
- WorkType, WorkCenter, Worker
- ProductionOrder, OrderTask, generateFromBom
- GanttChart v2 (зум, drag-drop, тултипы, зависимости, линия сегодня)
- Авто-назначение, авто-задачи на недостающие данные
- Диалог отгрузки

#### Модуль 3: Склад (полностью на фронте)
- Склады (ролевая изоляция, зоны)
- StorageItem, InventoryItem (полиморфные), InventoryMovement
- PurchaseRequest, SupplierOrder, IncomingInvoice

#### Модуль 4: Бухгалтерия (полностью на фронте)
- FinanceDashboard (KPI, статус-брейкдауны)
- OrderClosing, ReconciliationAct, FinancialReport

#### Модуль 5: Администрирование (полностью на фронте)
- Tender, StatusWorkflow, User/Role management
- RPP, Certificate, InventorFile

### 6.2 Что не реализовано (требует внимания) ❌

| Пункт | Важность | Комментарий |
|-------|----------|-------------|
| 1С-интеграция | 🟡 Средняя | Отложено до уточнения формата обмена |
| Отправка КП по email | 🟡 Средняя | Нужен email-сервис (SendGrid и т.п.) |
| Учёт брака/переделок | 🟢 Низкая | Можно добавить статус в OrderTask |
| Иерархия категорий | 🟢 Низкая | Пока плоский список |
| Авто-заявки на закупку при нехватке на складе | 🟡 Средняя | Логика описана, не реализована интеграция |
| Поиск по нескольким полям (advancedSearch) | 🟢 Низкая | Feature flag есть, реализация нет |

### 6.3 Проблемные места ⚠️

1. **User.role — несовпадение типов**
   - Во фронтенде (shared/types): `'admin' | 'manager' | 'production' | 'storekeeper' | 'accountant' | 'viewer'`
   - В бэкенде (user.model.ts): `'admin' | 'manager' | 'viewer'`
   - **Нужно синхронизировать — на бэке не хватает 'production', 'storekeeper', 'accountant'**

2. **Supplier-ы — редирект, но не фильтрация**
   - Маршруты `/references/suppliers` → редирект на `/references/organizations?role=supplier`
   - Но фильтр по роли не работает, т.к. бэкенд не резолвит slug → ID

3. **Seed-данные на бэкенде отсутствуют**
   - При старте сервера создаётся только admin
   - Нет seed-скрипта для наполнения БД демо-данными

---

## 7. UI KIT — АУДИТ КОМПОНЕНТОВ

| Компонент | Селектор | Тесты | Используется | Проблемы |
|-----------|----------|-------|-------------|----------|
| kp-button | `<kp-button>` | ✅ | 30+ страниц | — |
| kp-input | `<kp-input>` | ✅ | 15+ страниц | — |
| kp-select | `<kp-select>` | ✅ | 15+ страниц | — |
| kp-card | `<kp-card>` | ✅ | 10+ страниц | — |
| kp-table | `<kp-table>` | ✅ | 30+ страниц | showView, showClone |
| kp-dialog | `<kp-dialog>` | ✅ | 10+ страниц | — |
| kp-badge | `<kp-badge>` | ✅ | 15+ страниц | — |
| kp-breadcrumb | `<kp-breadcrumb>` | ✅ | 5+ страниц | — |
| kp-toast | `<kp-toast>` | ✅ | Глобально | — |
| kp-confirm-dialog | `<kp-confirm-dialog>` | ✅ | 5+ страниц | — |
| kp-avatar | `<kp-avatar>` | ✅ | admin-layout | — |
| kp-toggle | `<kp-toggle>` | ✅ | 3 страницы | — |
| kp-datepicker | `<kp-datepicker>` | ✅ | 1 страница | — |
| kp-file-upload | `<kp-file-upload>` | ✅ | 0 (не используется) | ⚠️ |
| kp-drawer | `<kp-drawer>` | ✅ | admin-layout | — |
| kp-tiered-menu | `<kp-tiered-menu>` | ✅ | admin-layout | — |
| kp-doc-canvas | `<kp-doc-canvas>` | ✅ | document-editor | — |
| kp-doc-block-text | `<kp-doc-block-text>` | ✅ | document-editor | — |
| kp-doc-block-table | `<kp-doc-block-table>` | ✅ | document-editor | — |
| kp-doc-block-separator | `<kp-doc-block-separator>` | ✅ | document-editor | — |
| kp-doc-text-editor-dialog | `<kp-doc-text-editor-dialog>` | ✅ | document-editor | — |
| kp-doc-preview-dialog | `<kp-doc-preview-dialog>` | ✅ | document-editor | — |

✅ Все 22 компонента имеют тесты.
⚠️ `kp-file-upload` не используется ни на одной странице (создан, но функциональность загрузки файлов не внедрена).
⚠️ В сборке есть warning'и о неиспользуемых импортах `KpBadgeComponent`, `KpConfirmDialogComponent`, `KpCardComponent` на некоторых страницах.

---

## 8. ЧЕК-ЛИСТ КОНСОЛИДИРОВАННЫЙ

> Полный список задач по проекту с статусами.

### 8.1 ИНФРАСТРУКТУРА ✅

- [x] Angular 21, Standalone, OnPush, Signals
- [x] Docker Compose (MongoDB 4.4 + ChromaDB + Backend)
- [x] CI/CD (GitHub Actions)
- [x] ARCHITECTURE.md, CONVENTIONS.md, AGENTS.md, README.md
- [x] BUSINESS_LOGIC_RU.md v5.1 (46 бизнес-правил)
- [x] Деплой на сервер 192.168.1.46, порт 4000
- [x] Cloudflare Tunnel → sport-set.ru

### 8.2 UI KIT ✅

- [x] 22 компонента (16 базовых + 6 документных)
- [x] Все с тестами
- [x] Дизайн-токены, 2 темы (светлая/тёмная)
- [x] 46+ lucide-иконок

### 8.3 ФРОНТЕНД (СТРАНИЦЫ) ✅

- [x] 44 страницы (26 features + 18 admin/references/production/warehouse/finance)
- [x] Все CRUD-страницы работают на моках
- [x] 433 теста

### 8.4 ФРОНТЕНД → БЭКЕНД ⛔️ САМОЕ ВАЖНОЕ

- [ ] Создать Mongoose-модели для всех 31 сущности
- [ ] Создать CRUD-роутеры для всех сущностей (через CRUD Factory)
- [ ] Создать seed-скрипт для заполнения БД демо-данными
- [ ] Подключить frontend-сервисы к ApiService (HTTP)
- [ ] Синхронизировать User.role на бэкенде с фронтендом
- [ ] Исправить фильтрацию supplier по role slug
- [ ] Настроить tsconfig backend для shared/types

### 8.5 БЭКЕНД ⚠️

- [x] CRUD Factory (универсальная, переиспользуемая)
- [x] JWT auth + HttpOnly cookie + refresh
- [x] Helmet, rate-limit, pino logger
- [ ] Swagger (заполнить документацию)
- [ ] Seed-скрипт для демо-данных
- [ ] User model — добавить 'production', 'storekeeper', 'accountant' роли

### 8.6 БИЗНЕС-ЛОГИКА (нереализованное)

- [ ] 1С-интеграция
- [ ] Отправка КП по email
- [ ] Авто-заявки на закупку при нехватке
- [ ] Учёт брака/переделок

### 8.7 ТЕХНИЧЕСКИЙ ДОЛГ

- [ ] linkedSignal, @let в шаблонах
- [ ] model() inputs (где уместно)
- [ ] Undo/Redo в редакторе документов
- [ ] Автосохранение черновиков
- [ ] Git-ветки для фич

---

## 9. CHROMADB

### Что такое ChromaDB в проекте?
ChromaDB — это векторная база данных для семантического поиска. В проекте она используется для индексации кода и документации:

- **Локально (на dev-машине):** Хранит векторизованные знания из 35 книг (~3 557 документов) + индексация кода (413 док. в 10 коллекциях)
- **Скрипты:** `scripts/seed-chromadb.ts` (TypeScript, актуальный), `scripts/seed_chromadb.py` (Python, deprecated)

### Нужна ли ChromaDB на сервере?

**Ответ: НЕТ, на данный момент не нужна.**

Причины:
1. ChromaDB используется **исключительно для AI-агента** (Codebuff/Cursor) — чтобы семантически искать по коду и знаниям
2. На production-сервере AI-агент не работает — там работают люди через браузер
3. ChromaDB потребляет ~300MB RAM, что критично для сервера с 2GB RAM
4. Если в будущем понадобится семантический поиск для пользователей (например, «найти похожие товары»), тогда можно будет подключить

**Рекомендация:** Убрать ChromaDB из docker-compose.prod.yml (уже сделано — её там нет). Оставить только локально для разработки.

---

## 10. ПЛАН ДЕЙСТВИЙ

### Этап 1: Подключение фронтенда к бэкенду (самое важное!)

1. Создать Mongoose-модели для всех сущностей (по одной за раз)
2. Создать CRUD-роутеры через `createCrudRouter()`
3. Зарегистрировать роутеры в `backend/src/index.ts`
4. Создать seed-скрипт с демо-данными
5. Переписать frontend-сервисы на HTTP через ApiService

**Приоритет подключения:**
```
1. Auth (уже работает) → 2. Организации (уже работает)
→ 3. Продукты и категории → 4. Клиенты → 5. КП и Договоры
→ 6. Справочники (doc-types, counterparty-roles, feature-flags)
→ 7. Производство → 8. Склад → 9. Бухгалтерия → 10. Администрирование
```

### Этап 2: Доработки

- Исправить User.role (добавить 'production', 'storekeeper', 'accountant')
- Исправить фильтрацию supplier по role slug
- Добавить Swagger-документацию для всех эндпоинтов
- Настроить alias в tsconfig для shared/types

### Этап 3: Бизнес-логика

- Реализовать авто-заявки на закупку (интеграция Склад → Закупки)
- Email-уведомления (SendGrid или аналоги)
- 1С-интеграция (после уточнения формата)

---

*Дата: 2026-06-08 | Автор: Buffy | Версия: 1.0*
