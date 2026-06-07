# Project Core — kppdf-4.0

**Универсальное ядро для создания веб-приложений.** Angular 21 + Express + MongoDB.

---

## Быстрый старт

### Требования
- **Node.js 22+**
- **Docker Desktop** — для MongoDB, ChromaDB и backend
- **Git**

### Запуск (одна команда)

```bash
docker compose up -d
```

> ⚠️ Папка `kppdf-4.0` содержит точку — невалидна для Docker Compose. В корне лежит `.env` с `COMPOSE_PROJECT_NAME=kppdf`, команды работают автоматически.

Три контейнера поднимутся автоматически:

| Контейнер | Порт | Описание |
|-----------|------|----------|
| `kppdf-mongodb` | 27017 | MongoDB 8 |
| `kppdf-chromadb` | 8000 | Векторная БД (семантический поиск) |
| `kppdf-backend` | 3000 | Express API |

Затем фронтенд:

```bash
npm install
npx ng serve
```

Открыть: **http://localhost:4200**

### Вход

| Логин | Пароль |
|-------|--------|
| `admin` | `admin123` |

---

## Стек

| Слой | Технология |
|------|-----------|
| **Frontend** | Angular 21 · Standalone · Signals · OnPush |
| **UI** | PrimeNG 21 (Aura theme) + @lucide/angular (33 иконки) |
| **Стили** | SCSS + CSS Custom Properties · светлая/тёмная темы |
| **Бэкенд** | Express 5 + TypeScript (tsx) |
| **БД** | MongoDB 8 + Mongoose 8 |
| **Аутентификация** | JWT access + refresh · HttpOnly cookies |
| **AI-инфраструктура** | ChromaDB (векторная БД, 3 557 документов) · AGENTS.md · ARCHITECTURE.md |
| **Тесты** | Vitest + jsdom · 433 теста |
| **CI/CD** | GitHub Actions (lint → test → build) |
| **Контейнеризация** | Docker Compose (3 сервиса) |

---

## Структура проекта

```
├── src/app/
│   ├── core/                     # Сервисы (API, auth, theme, CRUD-сервисы)
│   ├── shared/ui/               # UI Kit: 16 kp-* компонентов + документные блоки
│   ├── features/                # Страницы
│   │   ├── dashboard/           # Главная
│   │   ├── login/               # Вход
│   │   ├── ui-kit/              # Витрина компонентов
│   │   ├── document-templates/  # Конструктор документов (A4 canvas, drag-and-drop)
│   │   ├── table-templates/     # Конструктор таблиц
│   │   ├── organizations/       # CRUD-справочник организаций
│   │   └── suppliers/           # CRUD-справочник поставщиков
│   └── layout/                  # Оболочка (sidebar, topbar, theme toggle)
│
├── backend/                     # Express API
│   └── src/
│       ├── modules/             # Модели + CRUD-роутеры
│       ├── middleware/           # JWT auth, error handler
│       └── utils/               # CRUD Factory, Pino logger, API response
│
├── shared/types/                # Общие TypeScript-типы
├── src/styles/
│   ├── _tokens.scss             # Дизайн-токены (цвета, тени, радиусы, типографика)
│   └── _global.scss             # Глобальные стили, PrimeNG-оверрайды
│
├── docker-compose.yml           # MongoDB + ChromaDB + Backend
├── ARCHITECTURE.md              # Полная карта проекта
├── CONVENTIONS.md               # Правила разработки
└── ЧЕК-ЛИСТ-КОНСОЛИДИРОВАННЫЙ.md  # Живой чек-лист задач
```

---

## Архитектура

### Слои (строго!)

```
core → shared → features → layout
```

- **core/** — сервисы. Не знает о страницах.
- **shared/** — общие компоненты. Не знает о страницах.
- **features/** — страницы. **Не зависят друг от друга.**
- **layout/** — оболочка. Знает всё.

### Правила разработки

| Правило | Описание |
|---------|----------|
| 🔴 Standalone | Все компоненты standalone, без NgModules |
| 🔴 Signals | `input()`, `output()`, `signal()`, `computed()` — без декораторов |
| 🔴 `inject()` | DI через inject(), без constructor |
| 🔴 OnPush | `ChangeDetectionStrategy.OnPush` везде |
| 🔴 `track` | Уникальный ключ в каждом `@for` |
| 🔴 kp-* | Только kp-компоненты на страницах, без прямого PrimeNG |
| 🔴 Токены | Цвета/тени/радиусы через `var(--*)`, без хардкода |
| 🟡 grep | Проверять имена экспортов в node_modules перед импортом |

Подробно: [`CONVENTIONS.md`](CONVENTIONS.md)

---

## UI Kit (22 компонента)

### Базовые (16 компонентов)

| Компонент | Селектор | Возможности |
|-----------|----------|-------------|
| **Кнопка** | `<kp-button>` | 6 severity, 2 size, outlined/raised/rounded/text, lucideIcon, loading |
| **Поле ввода** | `<kp-input>` | text/number/password/email, float-label, очистка, пароль (eye), ошибка |
| **Выпадающий список** | `<kp-select>` | ngModel, поиск/фильтр, очистка, float-label, ошибка |
| **Карточка** | `<kp-card>` | header/subheader, hover lift-эффект, loading skeleton |
| **Таблица** | `<kp-table>` | CRUD, пагинация, сортировка, поиск, бейджи, кнопки действий |
| **Диалог** | `<kp-dialog>` | Модальный, backdrop-blur, прокрутка длинного контента |
| **Уведомление** | `<kp-toast>` | 4 типа (success/info/warn/error), прогресс-бар |
| **Подтверждение** | `<kp-confirm-dialog>` | Диалог подтверждения действий |
| **Бейдж** | `<kp-badge>` | 6 severity, rounded, с иконкой |
| **Хлебные крошки** | `<kp-breadcrumb>` | Навигационный путь, кастомный разделитель |
| **Аватар** | `<kp-avatar>` | Инициалы/иконка/фото, 4 статуса (online/offline/busy/away) |
| **Переключатель** | `<kp-toggle>` | 3 размера, ngModel |
| **Выбор даты** | `<kp-datepicker>` | Русская локализация, с/без времени |
| **Загрузка файлов** | `<kp-file-upload>` | Drag-and-drop, basic/advanced режимы |
| **Боковая панель** | `<kp-drawer>` | Выдвижная панель |
| **Меню** | `<kp-tiered-menu>` | Многоуровневое меню |

### Документные (6 компонентов)

| Компонент | Селектор | Возможности |
|-----------|----------|-------------|
| **Холст A4** | `<kp-doc-canvas>` | Drag-and-drop блоков, превью, placeholder |
| **Текстовый блок** | `<kp-doc-block-text>` | Редактирование текста в диалоге |
| **Табличный блок** | `<kp-doc-block-table>` | Привязка к шаблону таблицы |
| **Разделитель** | `<kp-doc-block-separator>` | Настраиваемая высота и линия |
| **Редактор текста** | `<kp-doc-text-editor-dialog>` | Редактирование текстового блока |
| **Предпросмотр** | `<kp-doc-preview-dialog>` | Превью и печать документа |

---

## Скрипты

```bash
# Фронтенд
npm start              # ng serve (порт 4200)
npm run build          # production сборка
npx ng lint            # ESLint
npx vitest run         # 433 теста

# Docker
docker compose up -d            # Запустить все сервисы
docker compose down             # Остановить
docker compose logs -f backend  # Логи бэкенда
docker compose ps               # Статус контейнеров

# Бэкенд (локально, без Docker)
cd backend && npm run dev       # tsx --watch (порт 3000)
```

---

## API (Backend)

### Формат ответа

```json
{ "success": true, "data": { ... }, "message": "..." }
```

### Эндпоинты

| Метод | Путь | Описание |
|-------|------|----------|
| POST | `/api/v1/auth/login` | Вход |
| POST | `/api/v1/auth/refresh` | Обновление токена |
| GET | `/api/v1/auth/me` | Профиль (🔒) |
| GET/POST | `/api/v1/organizations` | Список / Создать организацию (🔒) |
| GET/PUT/DELETE | `/api/v1/organizations/:id` | Чтение / Обновление / Удаление (🔒) |

### CRUD Factory

```typescript
import { createCrudRouter } from '../utils/crud-factory.js';

// Пример: Organisation (backend/src/modules/organization.routes.ts)
router.use('/organizations', createCrudRouter(Organization, {
  searchFields: ['name', 'shortName', 'inn'],
  sortFields: ['name', 'inn', 'createdAt']
}));
```

Генерирует: `GET/POST /items`, `GET/PUT/DELETE /items/:id`  
Параметры: `?page=1&limit=20&sort=-createdAt&search=текст`

---

## Тёмная тема

Две полные темы через CSS Custom Properties:
- `:root` — светлая (по умолчанию)
- `[data-theme="dark"]` — тёмная (47 переопределённых токенов)

Переключение — кнопка ☀️/🌙 в топбаре.

Все токены в [`src/styles/_tokens.scss`](src/styles/_tokens.scss):
- **Цвета:** primary, text, surface, border, success/warning/error/info + семантические bg
- **Тени:** xs/sm/md/lg/xl + card/card-hover
- **Радиусы:** sm(6px) / md(8px) / lg(12px) / xl(16px)
- **Типографика:** Inter, 6 размеров, 4 веса
- **Переходы:** fast/normal/slow + spring-easing
- **Градиенты:** primary, sidebar, card-hover

---

## Инфраструктура для AI

Проект спроектирован для работы с AI-ассистентом (Codebuff/Cursor).

| Файл | Назначение |
|------|-----------|
| [`ARCHITECTURE.md`](ARCHITECTURE.md) | Полная карта проекта — читать в начале сессии |
| [`CONVENTIONS.md`](CONVENTIONS.md) | Железные правила разработки |
| [`AGENTS.md`](AGENTS.md) | Правила для AI-агентов |
| [`ЧЕК-ЛИСТ-КОНСОЛИДИРОВАННЫЙ.md`](ЧЕК-ЛИСТ-КОНСОЛИДИРОВАННЫЙ.md) | Живой список задач |
| `база-знаний/` | Извлечённые книги и документация (~30 .md файлов) |
| `kppdf-chromadb` | Векторная БД для семантического поиска (порт 8000, 3 557 документов) |

---

## Деплой

```bash
# Первичная настройка
git clone <repo> && cd kppdf-4.0
cp backend/.env.example backend/.env
# отредактировать .env: JWT_SECRET, пароли
docker compose up -d

# Обновление
git pull
docker compose up -d --build
```

Данные MongoDB и ChromaDB сохраняются в Docker volumes — не теряются при перезапуске.

---

## Лицензия

MIT
