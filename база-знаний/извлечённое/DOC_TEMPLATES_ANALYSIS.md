# АНАЛИЗ: Шаблоны документов (Document Templates)

> **Дата:** 2026-06-03
> **Источники:** kppdf-3.0, portable_kits (document-canvas-kit, quotation-editor)
> **Цель:** Понять как реализованы шаблоны документов, чтобы построить своё в kppdf-4.0

---

## 1. ОБЩАЯ КОНЦЕПЦИЯ

**Шаблон документа** — это структура, описывающая A4-страницу с набором блоков (элементов). Из шаблона создаётся **экземпляр** — конкретный документ (КП, договор, счёт, накладная) с подставленными данными.

### Режимы работы
- **Шаблон (template)** — редактирование структуры, без реальных данных
- **Экземпляр (instance)** — заполненный документ с реальными данными из БД

---

## 2. АРХИТЕКТУРА ИЗ kppdf-3.0

### 2.1 Модель данных (Mongoose)

```
DocumentTemplate {
  name: string              // Название шаблона
  description: string       // Описание
  tags: string[]            // Теги для поиска
  organizationId: string    // Привязка к организации
  docType: enum             // 'quotation' | 'contract' | 'invoice' | 'shipping'
  isDefault: boolean        // Шаблон по умолчанию
  isActive: boolean         // Активен
  pageSize: 'A4'            // Пока только A4
  backgroundImage: string   // Фоновое изображение (base64/url)
  version: number           // Версия для оптимистичной блокировки (ETag)
  blocks: DocumentBlock[]   // Массив блоков
  createdAt, updatedAt      // Timestamps
}
```

### 2.2 Блоки (DocumentBlock)

```typescript
interface DocumentBlock {
  _id: string
  type: 'text' | 'header' | 'table' | 'separator' | 'image'
  order: number             // Порядок сверху вниз
  title?: string            // Заголовок блока
  content?: string          // Текстовое содержимое

  // Для таблиц
  tableKind?: string        // Какой тип таблицы (ссылка на DocumentTableType)
  tableItems?: TableItem[]  // Данные таблицы (в режиме instance)
  cells?: DocumentBlockCell[] // Ячейки (для text-блоков с колонками)

  // Настройки отображения
  settings: {
    fontSize?: number       // Размер шрифта
    fontWeight?: 'normal' | 'bold'
    textDecoration?: 'none' | 'underline' | 'line-through'
    align?: 'left' | 'center' | 'right' | 'justify'
    color?: string          // Цвет текста
    backgroundColor?: string // Цвет фона блока
    padding?: { top, right, bottom, left }  // Отступы внутри блока
    borderStyle?: 'solid' | 'dashed' | 'none'
    borderColor?: string
    borderSides?: ('top' | 'bottom')[]
    columns?: number        // Количество колонок (для text → 1-6)
    showLines?: boolean     // Для separator — показывать линии
  }
}
```

### 2.3 DocumentTableType (Типы таблиц)

Отдельная сущность — предварительно настроенные таблицы, которые можно вставлять в документы:

```
DocumentTableType {
  name: string              // Системное имя
  label: string             // Человеческое название
  title: string             // Заголовок таблицы в документе
  docType: string           // Для какого типа документа
  columns: [{               // Колонки таблицы
    field: string
    header: string
    type: 'text' | 'number' | 'select' | 'date' | 'image' | 'currency'
    width: string
    source: string          // Источник данных
    options: string
  }]
  dataSource: string        // Откуда брать данные
  productKind: 'ITEM' | 'SERVICE' | 'WORK'
  sortOrder: number
  fontSize: number
  isActive: boolean
}
```

> **Связь с нашими Шаблонами таблиц (kppdf-4.0):** `DocumentTableType` — это более высокоуровневая сущность чем `TableTemplate`. Наш `TableTemplate` говорит «какие колонки из какой таблицы БД показать». А `DocumentTableType` добавляет: «в каком контексте документа, с каким оформлением, откуда брать данные». В kppdf-4.0 мы можем либо объединить эти понятия, либо сделать `DocumentTableType` надстройкой над `TableTemplate`.

---

## 3. АРХИТЕКТУРА ИЗ portable_kits

### 3.1 DocumentCanvasComponent

Ядро всей системы — A4-холст:

- **Вход:** `blocks` (сигнал), `mode` ('template' | 'instance'), `backgroundImage`
- **Функции:** добавление/удаление/перемещение блоков, drag-and-drop (через @sortable-kit)
- **Рендеринг:** для каждого блока — свой визуальный элемент
  - Text/Header: `<textarea>` с computed-стилями
  - Separator: `<hr>` с настраиваемыми линиями
  - Table: `<table>` с заголовками, строками, итогами
- **Фон:** drag-and-drop загрузка изображения на canvas

### 3.2 QuotationEditorComponent

Интеграция холста с пикерами:

- Заголовок документа (title input)
- DocumentCanvasComponent (холст)
- EntityPickerComponent (выбор товаров/услуг)
- PlaceholderPickerComponent (вставка плейсхолдеров {{...}})
- Подсчёт итоговой суммы

---

## 4. КЛЮЧЕВЫЕ КОМПОНЕНТЫ kppdf-3.0

### 4.1 Страница списка (DocumentTemplatesPageComponent)

- Таблица: Название, Тип, Организация, Описание, Теги, По умолч., Активен
- Действия: «Макет A4» (переход в редактор), «Дублировать»

### 4.2 Редактор (DocumentTemplateEditorComponent)

Трёхпанельный интерфейс:
- **Левая панель:** метаданные (название, описание, тип документа, организация, теги, active/default)
- **Центр:** KpDocumentBlockEditor — визуальный A4-холст с блоками
- **Правая панель:** плейсхолдеры (динамические переменные {{...}})

Функции редактора:
- Загрузка/сохранение через API
- Оптимистичная блокировка (ETag/version)
- Автосохранение черновиков в localStorage
- Undo/Redo (до 50 шагов)
- Предпросмотр (модалка + новая вкладка с print-стилями)
- Валидация названия (уникальность + недопустимые символы)

### 4.3 KpDocumentBlockEditorComponent

Визуальный редактор блоков на холсте:
- **Drag-and-drop** перестановка блоков
- **Выбор блока** (клик) → активация для редактирования
- **Тулбар активного блока:** alignment (left/center/right), bold, underline, font size, color, delete
- **Добавление блоков:** text, separator, table (из выпадающего меню)
- **Таблицы:** интеграция с DocumentTableType + данными
- **Фон:** drag-and-drop изображения на canvas

### 4.4 KpDocumentTextBlockEditComponent

Диалог редактирования текстового блока:
- Заголовок блока (title)
- Разбивка на колонки (columns: 1-6): добавление/удаление колонок
- Для каждой колонки (cell): текст + выравнивание (left/center/right)
- Размер шрифта
- Отступы (padding)

---

## 5. ЧТО ХОЧЕТ ПОЛЬЗОВАТЕЛЬ (из сообщения)

Пользователь описал своё видение шаблона документа:

1. **A4 белый лист** — визуально как страница
2. **Элементы на странице:**
   - **Таблицы** — выбираются из созданных шаблонов таблиц (TableTemplate)
   - **Текстовое поле** — общее поле с отступами 5 мм по бокам
     - Можно разделить по вертикали до ~6 частей
     - Каждую часть можно разделить слева/справа
     - У каждой части свой редактор текста (выравнивание, цвет, жирность, подчёркивание)
     - Может иметь заголовок (опционально)
   - **Разделитель** — пустое поле с настраиваемой высотой (межстрочный интервал)
     - Можно показать/скрыть линию разделителя
3. **Drag-and-drop** — перетаскивание блоков для изменения порядка
4. **Интуитивный интерфейс** — красиво, понятно, удобно
5. **Двойной клик** по текстовому блоку → редактирование содержимого

---

## 6. АРХИТЕКТУРНОЕ РЕШЕНИЕ ДЛЯ kppdf-4.0

### 6.1 Структура данных (фронтенд)

```typescript
interface DocumentTemplate {
  id: string
  name: string
  description?: string
  docType: 'quotation' | 'contract' | 'invoice' | 'shipping'
  pageSize: 'A4'
  backgroundImage?: string
  blocks: DocBlock[]
}

interface DocBlock {
  id: string
  type: 'text' | 'table' | 'separator'
  order: number
  title?: string

  // Текстовый блок
  content?: string
  columns?: DocTextColumn[]

  // Таблица
  tableTemplateId?: string    // Ссылка на TableTemplate

  // Разделитель
  height?: number             // Высота в мм
  showLine?: boolean          // Показывать линию

  // Общие настройки
  settings: {
    padding?: { top, right, bottom, left }
    fontSize?: number
    align?: 'left' | 'center' | 'right' | 'justify'
  }
}

interface DocTextColumn {
  id: string
  content: string
  width: string               // '50%', '33%' и т.д.
  textAlign: 'left' | 'center' | 'right'
  fontWeight: 'normal' | 'bold'
  fontStyle: 'normal' | 'italic'
  textDecoration: 'none' | 'underline'
  color?: string
}
```

### 6.2 Компоненты (план)

| Компонент | Назначение |
|-----------|------------|
| `DocTemplateListPage` | Список шаблонов документов |
| `DocTemplateEditorPage` | Страница редактора: левая панель (мета) + центр (холст) |
| `DocCanvasComponent` | A4-холст: рендерит блоки, drag-and-drop |
| `DocBlockTextComponent` | Текстовый блок на холсте |
| `DocBlockTableComponent` | Табличный блок на холсте |
| `DocBlockSeparatorComponent` | Разделитель на холсте |
| `DocTextEditorDialog` | Диалог редактирования текстового блока |

### 6.3 Этапы реализации

1. **Типы и контракты** — `DocBlock`, `DocumentTemplate` в shared/types
2. **Сервис шаблонов документов** — CRUD (in-memory → HTTP)
3. **Страница списка** — таблица шаблонов документов
4. **A4-холст (DocCanvas)** — пустая белая страница, добавление блоков
5. **Текстовый блок** — колонки, редактирование текста, форматирование
6. **Табличный блок** — вставка таблицы из TableTemplate
7. **Разделитель** — настраиваемая высота, линия
8. **Drag-and-drop** — перестановка блоков
9. **Страница редактора** — трёхпанельный интерфейс
10. **Сохранение/загрузка** — API + черновики + undo/redo

---

## 7. ЗАФИКСИРОВАННЫЕ РЕШЕНИЯ

### Текстовый редактор → contenteditable div

**Решение:** contenteditable div + `document.execCommand` + кастомный тулбар.
- Даёт WYSIWYG (жирность, подчёркивание, цвет — прямо в тексте)
- Легковесный, без зависимостей (не нужен Quill/TinyMCE)
- Тулбар: bold, underline, align (left/center/right), color picker, font size

### Отступы текстового поля → 5 мм по умолчанию

**Константа:** `DEFAULT_TEXT_PADDING_MM = 5`
- Применяется ко всем текстовым блокам при создании
- Можно изменить в настройках блока
- Конвертация: 5 мм ≈ 19px (при 96 DPI)

### Drag-and-drop → CDK Drag & Drop

**Решение:** `@angular/cdk/drag-drop` (DragDropModule)
- Уже в составе Angular, не требует доп. зависимостей
- `cdkDropList` + `cdkDrag` для перестановки блоков
- Анимации через CSS transition

---

## 8. ТЕХНИЧЕСКИЕ ЗАМЕТКИ

### Drag-and-drop
В portable_kits используется `@sortable-kit/angular`. Для kppdf-4.0 можно:
- Использовать CDK Drag & Drop (@angular/cdk/drag-drop)
- Использовать готовый sortable-kit

### Текстовый редактор
Пользователь хочет простое форматирование (bold, underline, align, color). Варианты:
- **contenteditable div** — лёгкий, без зависимостей
- **Quill.js** — полноценный rich text, но тяжелее
- **Простой textarea + тулбар** — самый лёгкий, но нет inline-форматирования

**Рекомендация:** contenteditable div с тулбаром — даёт WYSIWYG, легковесный, не тянет зависимости.

### Размеры
- A4: 210 × 297 мм
- Отступы текстового поля: 5 мм
- Масштабирование: CSS `@media print` + экранное отображение ≈ 794px × 1123px (96 DPI)

---

*Конец анализа. Следующий шаг — CHECKLIST_DOC_TEMPLATES.md с детальным планом.*
