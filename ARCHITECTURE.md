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
| **База данных** | MongoDB | 7.x |
| **Тесты** | Vitest + Angular TestBed | 2.x |
| **Линтер** | ESLint (angular-eslint) | 9.x |
| **CI/CD** | GitHub Actions | — |
| **Рантайм** | Node.js | 22 |

---

## 2. Структура папок

```
kppdf-4.0/
├── src/app/
│   ├── core/                    # Сервисы (НЕ знают о страницах)
│   │   ├── api.service.ts
│   │   ├── api-url.token.ts     # InjectionToken для URL API
│   │   ├── auth.service.ts
│   │   ├── auth.interceptor.ts
│   │   ├── cart.service.ts      # Корзина (snapshot товаров)
│   │   ├── client.service.ts    # Клиенты-физ.лица
│   │   ├── counterparty-role.service.ts  # Виды контрагентов
│   │   ├── crud-factory.ts      # Базовая in-memory CRUD-реализация
│   │   ├── doc-type.service.ts  # Типы документов
│   │   ├── document-template.service.ts
│   │   ├── feature-flag.service.ts  # Флаги возможностей
│   │   ├── notification.service.ts
│   │   ├── organization.service.ts   # Контрагенты (юр.лица/ИП)
│   │   ├── product-category.service.ts  # Категории товаров
│   │   ├── product.service.ts   # Товары (CRUD + авто-SKU)
│   │   ├── table-registry.service.ts
│   │   ├── table-template.service.ts
│   │   ├── theme.service.ts
│   │   └── global-error-handler.ts
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
│   ├── features/                # Страницы (НЕ зависят друг от друга)
│   │   ├── app-guide/           # 🗺️ Карта приложения (бизнес-логика)
│   │   ├── cart/                # 🛒 Корзина (snapshot товаров → КП)
│   │   ├── clients/             # 👤 Клиенты-физ.лица (CRUD)
│   │   ├── counterparty-roles/  # 🏷️ Виды контрагентов (CRUD)
│   │   ├── dashboard/
│   │   ├── doc-types/           # 📄 Типы документов (CRUD)
│   │   ├── document-templates/  # Шаблоны документов (список + редактор)
│   │   ├── feature-flags/       # 🚩 Флаги возможностей
│   │   ├── login/
│   │   ├── organizations/       # 🏢 Контрагенты (CRUD, замена suppliers)
│   │   ├── products/            # 🏪 Товары + категории (CRUD + витрина)
│   │   ├── table-templates/     # Шаблоны таблиц (список + редактор)
│   │   └── ui-kit/              # Демо-страница UI Kit
│   │
│   ├── layout/
│   │   └── admin-layout.component.*  # Оболочка (sidebar, topbar, theme toggle)
│   │
│   ├── app.config.ts            # provideLucideIcons, providePrimeNG, роутинг
│   └── app.routes.ts            # Lazy-loaded маршруты
│
├── shared/types/index.ts        # Общие типы (Organization, Client, Product, CartItem, CounterpartyRoleDef, DocTypeDef, FeatureFlagDef, DocBlock, DocumentTemplate, TableTemplate, ...)
├── backend/                     # Express API
│   └── src/
│       ├── modules/             # Модели Mongoose: user, organization, counterparty-role + CRUD-роутеры
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

### 4.1 CRUD-сущности (Организации, Клиенты, Товары, ...)
Образец: `features/organizations/` или `features/products/`
- `*-list.component.*` — список с kp-table + поиск
- `*-editor.component.*` — форма создания/редактирования (2-4 секции полей)
- `core/*.service.ts` — mock CRUD + seed-данные (позже заменить на HttpClient)
- Маршруты: `/references/<entity>`, `/references/<entity>/new`, `/references/<entity>/:id/edit`

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

## 5. Маршруты (lazy-loaded)

| Путь | Компонент | Модуль |
|------|-----------|--------|
| `/login` | LoginComponent | — |
| `/dashboard` | DashboardComponent | — |
| `/ui-kit` | UiKitComponent | — |
| `/admin/document-templates` | DocumentTemplateListComponent | features |
| `/admin/document-templates/new` | DocumentTemplateEditorComponent | features |
| `/admin/document-templates/:id/edit` | DocumentTemplateEditorComponent | features |
| `/admin/table-templates` | TableTemplateListComponent | features |
| `/admin/table-templates/new` | TableTemplateEditorComponent | features |
| `/admin/table-templates/:id/edit` | TableTemplateEditorComponent | features |
| `/references/organizations` | OrganizationListComponent | features |
| `/references/organizations/new` | OrganizationEditorComponent | features |
| `/references/organizations/:id/edit` | OrganizationEditorComponent | features |
| `/references/clients` | ClientListComponent | features |
| `/references/counterparty-roles` | CounterpartyRoleListComponent | features |
| `/references/counterparty-roles/new` | CounterpartyRoleEditorComponent | features |
| `/references/counterparty-roles/:id/edit` | CounterpartyRoleEditorComponent | features |
| `/references/doc-types` | DocTypeListComponent | features |
| `/references/product-categories` | ProductCategoryListComponent | features |
| `/sales/cart` | CartComponent | features |
| `/sales/products` | ProductListComponent | features |
| `/sales/products/new` | ProductEditorComponent | features |
| `/sales/products/:id/edit` | ProductEditorComponent | features |
| `/app-guide` | AppGuideComponent | features |
| `/admin/feature-flags` | FeatureFlagsComponent | features |

---

## 6. Зарегистрированные lucide-иконки (app.config.ts)

Всего **38 иконок**: Pencil, Trash2, Eye, Copy, GripVertical, ChevronUp, ChevronDown,
AlignLeft, Table, Minus, ArrowUpDown, Box, Check, Search, ExternalLink, TriangleAlert,
ChevronLeft, ChevronRight, Sun, Moon, Menu, Bell, Home, Palette, Book, Building, Cog, File,
EyeOff, X, Plus, Download, Printer, ShoppingCart, Tag, Flag, RotateCcw

---

*Обновлён: 2026-06-07 (Buffy — аудит: убраны supplier, добавлены cart/products/clients/app-guide/counterparty-roles/doc-types/feature-flags)*
