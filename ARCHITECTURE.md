# ARCHITECTURE.md — Карта проекта kppdf-4.0

> **Назначение:** единый источник правды о структуре проекта.
> Читать в начале каждой новой сессии.
> Обновлять при добавлении модулей.

---

## 1. Стек технологий

| Слой | Технология | Версия |
|------|-----------|--------|
| **Фронтенд** | Angular (standalone, signals, OnPush) | ^21.0.0 |
| **UI-библиотека** | PrimeNG + @primeuix/themes/Aura | 21.x |
| **Иконки** | @lucide/angular | ^1.17.0 |
| **Стилизация** | SCSS + CSS Custom Properties (токены) | — |
| **Drag & Drop** | @angular/cdk/drag-drop | ^21.0.0 |
| **Бэкенд** | Express + Mongoose + TypeScript | 5.x / 8.x |
| **База данных** | MongoDB | 8.x (4.4 на production – CPU без AVX) |
| **Тесты** | Vitest + Angular TestBed | 2.x |
| **Линтер** | ESLint (angular-eslint) | 9.x |
| **CI/CD** | GitHub Actions | — |
| **Рантайм** | Node.js | 22 |

---

## 2. Структура папок

```
kppdf-4.0/
├── src/app/
│   ├── core/                    # Сервисы (HTTP через ApiService, 0 in-memory)
│   │   ├── api.service.ts       # HTTP-клиент (get/post/put/patch/delete)
│   │   ├── api-url.token.ts     # InjectionToken для URL API
│   │   ├── auth.service.ts      # JWT-аутентификация
│   │   ├── auth.interceptor.ts  # HttpInterceptorFn (токен + рефреш)
│   │   ├── auth.guard.ts        # canActivateChild (редирект на /login)
│   │   ├── role.guard.ts        # requireRole(...) для разделов
│   │   ├── cart.service.ts      # Корзина товаров
│   │   ├── certificate.service.ts  # Сертификаты
│   │   ├── client.service.ts    # Клиенты-физ.лица
│   │   ├── commercial-proposal.service.ts  # КП (создание, наценка, статусы)
│   │   ├── contract.service.ts  # Договоры (createFromProposal, changeStatus)
│   │   ├── counterparty-role.service.ts  # Виды контрагентов
│   │   ├── crud-factory.ts      # Базовая in-memory CRUD-реализация (deprecated → см. ApiService)
│   │   ├── doc-type.service.ts  # Типы документов
│   │   ├── document-template.service.ts
│   │   ├── feature-flag.service.ts  # Флаги возможностей
│   │   ├── financial-report.service.ts  # Финансовые отчёты
│   │   ├── global-error-handler.ts
│   │   ├── inventor-file.service.ts  # CAD-файлы
│   │   ├── inventory.service.ts  # Инвентаризация
│   │   ├── invoice.service.ts   # Входящие счета (авто-СФ нумерация)
│   │   ├── notification.service.ts
│   │   ├── order-closing.service.ts  # Закрытия заказов
│   │   ├── order-task.service.ts  # Задачи производства (статусы, назначение, авто-задачи)
│   │   ├── organization.service.ts   # Контрагенты
│   │   ├── product-category.service.ts
│   │   ├── product-component.service.ts  # BOM-компоненты
│   │   ├── product-photo.service.ts
│   │   ├── product.service.ts   # Товары
│   │   ├── production-order.service.ts  # Производственные заказы
│   │   ├── purchase-request.service.ts  # Заявки на закупку
│   │   ├── reconciliation-act.service.ts  # Акты сверки
│   │   ├── role.service.ts      # Роли пользователей
│   │   ├── rpp.service.ts       # RPP
│   │   ├── status-workflow.service.ts  # Воркфлоу статусов
│   │   ├── storage-item.service.ts  # Складские позиции
│   │   ├── supplier-order.service.ts  # Заказы поставщикам
│   │   ├── table-registry.service.ts
│   │   ├── table-template.service.ts
│   │   ├── tender.service.ts    # Тендеры
│   │   ├── theme.service.ts
│   │   ├── undo-redo-stack.ts
│   │   ├── user.service.ts      # Пользователи
│   │   ├── warehouse.service.ts  # Склады
│   │   ├── work-center.service.ts  # Рабочие центры
│   │   ├── work-type.service.ts  # Типы работ
│   │   └── worker.service.ts    # Исполнители
│   │
│   │   Итого: 34 сервиса, все на HTTP через inject(ApiService)
│   │
│   ├── shared/ui/               # UI Kit — обёртки над PrimeNG (kp-*)
│   │   ├── kp-button.component.ts       # Кнопка (label, icon, lucideIcon, severity, size)
│   │   ├── kp-input.component.ts        # Поле ввода (ControlValueAccessor)
│   │   ├── kp-select.component.ts       # Выпадающий список (ControlValueAccessor)
│   │   ├── kp-card.component.ts         # Карточка (header, subheader, loading)
│   │   ├── kp-table.component.ts        # Таблица (data, columns, actions, paginator)
│   │   ├── kp-dialog.component.ts       # Диалог (header, visible, modal)
│   │   ├── kp-badge.component.ts        # Бейдж (статус)
│   │   ├── kp-breadcrumb.component.ts   # Хлебные крошки
│   │   ├── kp-toast.component.ts        # Уведомления
│   │   ├── kp-confirm-dialog.component.ts
│   │   ├── kp-avatar.component.ts       # Аватар + статус
│   │   ├── kp-toggle.component.ts       # Переключатель
│   │   ├── kp-datepicker.component.ts   # Выбор даты
│   │   ├── kp-file-upload.component.ts  # Загрузка файлов
│   │   ├── kp-drawer.component.ts       # Боковая панель
│   │   ├── kp-tiered-menu.component.ts  # Меню
│   │   ├── kp-doc-canvas.component.ts   # Холст A4 (drag-and-drop блоков)
│   │   ├── kp-doc-block-text.component.ts
│   │   ├── kp-doc-block-table.component.ts
│   │   ├── kp-doc-block-separator.component.ts
│   │   ├── kp-doc-text-editor-dialog.component.ts
│   │   └── kp-doc-preview-dialog.component.ts
│   │
│   ├── features/                # Страницы (ролевой доступ, НЕ зависят друг от друга)
│   │   ├── admin/               # Администрирование: тендеры, статусы, пользователи, RPP, сертификаты, CAD
│   │   ├── app-guide/           # 🗺 Карта приложения
│   │   ├── cart/                # 🛒 Корзина → КП
│   │   ├── clients/             # 👤 Клиенты-физ.лица
│   │   ├── contracts/           # 📑 Договоры (список + редактор)
│   │   ├── counterparty-roles/  # 🏷 Виды контрагентов
│   │   ├── dashboard/
│   │   ├── doc-types/           # 📄 Типы документов
│   │   ├── document-templates/  # Шаблоны документов
│   │   ├── feature-flags/       # 🚩 Флаги
│   │   ├── finance/             # 💰 Бухгалтерия: дашборд, закрытия, сверки, отчёты
│   │   ├── login/
│   │   ├── markup-analysis/     # 📊 Анализ наценки
│   │   ├── organizations/       # 🏢 Контрагенты
│   │   ├── production/          # 🏭 Производство: заказы, задачи, Гант, работники, центры, типы работ
│   │   ├── products/            # 🏪 Товары + категории + фотогалерея + BOM
│   │   ├── proposal-showcase/   # 🛍 Витрина КП
│   │   ├── proposals/           # 📄 Коммерческие предложения
│   │   ├── table-templates/     # Шаблоны таблиц
│   │   ├── ui-kit/              # Демо UI Kit
│   │   └── warehouse/           # 📦 Склад: dashboard, поставки, закупки, счета, позиции
│   │
│   ├── layout/
│   │   └── admin-layout.component.*  # Оболочка (sidebar, topbar, theme toggle)
│   │
│   ├── app.config.ts            # provideLucideIcons, providePrimeNG, роутинг
│   └── app.routes.ts            # Lazy-loaded маршруты
│
├── shared/types/index.ts        # Общие типы (Organization, Client, Product, CartItem, CounterpartyRoleDef, DocTypeDef, FeatureFlagDef, DocBlock, DocumentTemplate, TableTemplate, ...)
├── backend/                     # Express API (~20 CRUD-модулей)
│   └── src/
│       ├── modules/             # Модели Mongoose: user, organization, counterparty-role, product,
│       │                       #   client, contract, commercial-proposal, work-type, work-center,
│       │                       #   worker, production-order, order-task, warehouse, storage-item,
│       │                       #   purchase-request, supplier-order, invoice, order-closing,
│       │                       #   reconciliation-act, financial-report, tender, table-template,
│       │                       #   document-template + CRUD-роутеры
│       ├── middleware/           # auth.ts, error-handler.ts
│       └── utils/               # crud-factory.ts, logger.ts, api-response.ts
├── src/styles/
│   ├── _tokens.scss             # CSS Custom Properties (цвета, тени, радиусы)
│   ├── _global.scss             # Глобальные стили (focus-visible, скроллбары, PrimeNG overrides)
│   └── styles.scss              # Точка входа
├── .github/workflows/ci.yml     # CI: lint → build → test (фронт + бэк)
└── vitest.config.ts             # Конфигурация тестов
```

---

## 3. Слои и зависимости (строго!)

```
core ← shared ← features ← layout
```

| Слой | Знает о | Не знает о |
|------|---------|------------|
| **core/** | shared/types | features, layout |
| **shared/ui/** | core (сервисы), shared/types | features, layout |
| **features/** | core, shared/ui, shared/types | другие features |
| **layout/** | core, shared, features | — |

---

## 4. Ключевые паттерны

### 4.1 CRUD-сущности — HTTP (ApiService)
Все сервисы используют HTTP через `inject(ApiService)`. Образец: `core/work-type.service.ts`.

```typescript
@Injectable({ providedIn: 'root' })
export class MyService {
  private api = inject(ApiService);
  private basePath = '/my-entity';

  getAll(): Observable<ApiResponse<MyType[]>> {
    return this.api.get<MyType[]>(this.basePath);
  }
  // ... getById, create, update, delete, patch
}
```

- **Фронтенд:** `core/*.service.ts` — `inject(ApiService)` + HTTP-методы
- **Бэкенд:** `backend/src/modules/` — Mongoose-модель + роутер через `createCrudRouter`
- **PATCH:** для смены статуса, назначения, обновления дат
- **Маршруты:** с ролевым `canActivateChild` (admin, manager, production, accountant, storekeeper)
- **Тесты:** `HttpTestingController` — образец в любом `*.service.spec.ts`

### 4.2 UI-компоненты (kp-*)
Образец: `shared/ui/kp-button.component.ts`
- Все — Standalone, OnPush
- `input()` сигналы для входов, `output()` для событий
- Импорт: `LucideDynamicIcon` для SVG-иконок, PrimeNG-модули для обёрток
- `[attr.aria-label]` на всех интерактивных элементах

### 4.3 Стилизация
- Все цвета через `var(--color-*)` из `_tokens.scss`
- Две темы: `:root` (светлая) и `[data-theme="dark"]`
- Тени, радиусы, переходы — через токены

---

## 5. Маршруты (lazy-loaded, ролевой доступ)

| Раздел | Роли | Пути |
|--------|------|------|
| `/login` | — | Вход |
| `/dashboard` | auth | Главная |
| `/ui-kit` | auth | Витрина UI Kit |
| `/app-guide` | auth | Карта приложения |
| **`/admin/*`** | admin | Тендеры, статусы, пользователи, RPP, сертификаты, CAD, шаблоны |
| **`/references/*`** | admin, manager, production | Организации, клиенты, роли, типы документов, категории |
| **`/sales/*`** | admin, manager | Корзина, КП, договоры, товары, анализ наценки |
| **`/production/*`** | admin, production | Типы работ, центры, исполнители, заказы, задачи, Гант |
| **`/finance/*`** | admin, accountant | Дашборд, закрытия, сверки, отчёты |
| **`/warehouse/*`** | admin, storekeeper | Дашборд, склады, позиции, закупки, поставщики, счета |

Ролевой доступ реализован через `requireRole(...roles)` guard на `canActivateChild`.

---

## 6. Зарегистрированные lucide-иконки (app.config.ts)

Всего **42 иконки**: Pencil, Trash2, Eye, Copy, GripVertical, ChevronUp, ChevronDown,
AlignLeft, Table, Minus, ArrowUpDown, Box, Check, Search, ExternalLink, TriangleAlert,
ChevronLeft, ChevronRight, Sun, Moon, Menu, Bell, Home, Palette, Book, Building, Cog, File,
EyeOff, X, Plus, Download, Printer, ShoppingCart, Tag, Flag, RotateCcw, FileSignature,
Stamp, ClipboardCheck, Package, Truck

---

*Обновлён: 2026-06-09 (v1.15 — все 34 сервиса на HTTP, 0 in-memory, ролевые маршруты, PATCH-эндпоинты, 443 теста)*
