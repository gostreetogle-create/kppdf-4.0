# ЧЕК-ЛИСТ: Шаблоны документов (Document Templates)

> **Дата:** 2026-06-03
> **Основа:** DOC_TEMPLATES_ANALYSIS.md + анализ kppdf-3.0 + portable_kits
> **Цель:** Пошаговый план реализации шаблонов документов для kppdf-4.0

---

## ЭТАП 1: КОНТРАКТЫ И ТИПЫ

### 1.1 Базовые типы в shared/types/index.ts

- [ ] `DocBlockType` — `'text' | 'table' | 'separator'`
- [ ] `DocBlockSettings` — padding, fontSize, align
- [ ] `DocTextColumn` — id, content, width, textAlign, fontWeight, fontStyle, textDecoration, color
- [ ] `DocBlock` — id, type, order, title?, content?, columns? (для text), tableTemplateId? (для table), height?/showLine? (для separator), settings
- [ ] `DocumentTemplate` — id, name, description?, docType, pageSize, backgroundImage?, blocks[]
- [ ] `DocType` — `'quotation' | 'contract' | 'invoice' | 'shipping'`

### 1.2 Меню (уже добавлено)

- [x] Пункт «Шаблоны документов» в Администрировании (pi pi-file, /admin/document-templates)

---

## ЭТАП 2: СЕРВИС ШАБЛОНОВ ДОКУМЕНТОВ

### 2.1 DocTemplateService

- [ ] Создать `src/app/core/document-template.service.ts`
- [ ] Методы (CRUD, in-memory):
  - `getTemplates(): Observable<ApiResponse<DocumentTemplate[]>>`
  - `getTemplate(id): Observable<ApiResponse<DocumentTemplate>>`
  - `createTemplate(data): Observable<ApiResponse<DocumentTemplate>>`
  - `updateTemplate(id, data): Observable<ApiResponse<DocumentTemplate>>`
  - `deleteTemplate(id): Observable<ApiResponse<void>>`
  - `cloneTemplate(id): Observable<ApiResponse<DocumentTemplate>>`
- [ ] Мок-данные: 1-2 примера шаблонов (пустой КП, шаблон договора)

### 2.2 Тесты

- [ ] `document-template.service.spec.ts`
- [ ] CRUD операции, клонирование, ошибки для несуществующих

---

## ЭТАП 3: СТРАНИЦА СПИСКА

### 3.1 Компонент

- [ ] `src/app/features/document-templates/document-template-list.component.ts`
- [ ] Колонки таблицы: Название, Тип документа, Блоков, Изменён, Действия
- [ ] Действия: Редактировать, Клонировать, Удалить
- [ ] Кнопка «Создать шаблон»
- [ ] Хлебные крошки: Администрирование → Шаблоны документов

### 3.2 Маршрут

- [ ] `/admin/document-templates` → DocumentTemplateListComponent

---

## ЭТАП 4: A4-ХОЛСТ (DOC-CANVAS)

> Сердце системы — визуальный редактор A4-страницы

### 4.1 Компонент холста

- [ ] `src/app/shared/ui/kp-doc-canvas.component.ts`
- [ ] Входы: `blocks` (signal), `mode` ('template' | 'instance'), `backgroundImage`
- [ ] Выходы: `blockAdded`, `blockRemoved`, `blockMoved`, `blockUpdated`
- [ ] Рендеринг:
  - Белый фон A4 (794×1123px — масштабированный A4)
  - Отображение каждого блока согласно его типу
  - Drag-and-drop перестановка (CDK Drag & Drop)

### 4.2 Стили холста

- [ ] Белая карточка с тенью (имитация бумаги)
- [ ] Серый фон вокруг (рабочая область)
- [ ] Плавные анимации при добавлении/удалении блоков

---

## ЭТАП 5: ТЕКСТОВЫЙ БЛОК

### 5.1 Компонент блока

- [ ] `src/app/shared/ui/kp-doc-block-text.component.ts`
- [ ] Отображение на холсте:
  - Заголовок блока (если есть)
  - Колонки (1-6) с текстом
  - Отступы 5 мм
- [ ] Двойной клик → открыть редактор

### 5.2 Диалог редактирования

- [ ] `src/app/shared/ui/kp-doc-text-editor-dialog.component.ts`
- [ ] Поля:
  - Заголовок блока (kp-input)
  - Количество колонок (1-6, kp-select)
  - Для каждой колонки:
    - Текстовое поле (textarea / contenteditable div)
    - Выравнивание: left/center/right (кнопки-переключатели)
    - Bold (жирный)
    - Underline (подчёркивание)
    - Цвет текста (color picker или preset)
  - Размер шрифта
- [ ] Кнопки: Сохранить, Отмена

### 5.3 Редактор текста колонки

- [ ] contenteditable div с `document.execCommand` для форматирования
- [ ] Либо простой textarea + тулбар (если contenteditable слишком сложно)
- [ ] Bold, underline, align, color — через кнопки тулбара

---

## ЭТАП 6: ТАБЛИЧНЫЙ БЛОК

### 6.1 Компонент блока

- [ ] `src/app/shared/ui/kp-doc-block-table.component.ts`
- [ ] Выпадающий список «Выбрать шаблон таблицы» (из TableTemplateService)
- [ ] Предпросмотр структуры таблицы (заголовки колонок)
- [ ] В режиме instance — строки с данными

### 6.2 Интеграция

- [ ] При выборе TableTemplate → сохраняется `tableTemplateId`
- [ ] При рендеринге в документе → колонки из шаблона

---

## ЭТАП 7: РАЗДЕЛИТЕЛЬ

### 7.1 Компонент

- [ ] `src/app/shared/ui/kp-doc-block-separator.component.ts`
- [ ] Регулятор высоты (kp-input number или range)
- [ ] Чекбокс «Показывать линию»
- [ ] Визуал: пустое пространство + опциональная горизонтальная линия

---

## ЭТАП 8: СТРАНИЦА РЕДАКТОРА

### 8.1 Компонент

- [ ] `src/app/features/document-templates/document-template-editor.component.ts`
- [ ] Layout: левая панель + центр (холст)
  - Левая панель:
    - Название шаблона (kp-input)
    - Тип документа (kp-select: КП/Договор/Счёт/Отгрузка)
    - Описание (kp-input)
  - Центр:
    - Toolbar: кнопки «+ Текст», «+ Таблица», «+ Разделитель»
    - DocCanvasComponent
- [ ] Кнопки: Сохранить, Отмена
- [ ] Валидация: название + минимум 1 блок

### 8.2 Маршруты

- [ ] `/admin/document-templates/new` → создание
- [ ] `/admin/document-templates/:id/edit` → редактирование

### 8.3 Функции (будущие улучшения)

- [ ] Undo/Redo
- [ ] Автосохранение черновиков в localStorage
- [ ] Предпросмотр (print-friendly)
- [ ] Плейсхолдеры {{...}}
- [ ] Фоновое изображение

---

## ЭТАП 9: СБОРКА, ТЕСТЫ, ФИНАЛИЗАЦИЯ

- [ ] `ng build` — без ошибок
- [ ] `npx vitest run` — все тесты зелёные
- [ ] Код-ревью
- [ ] Обновить ChromaDB
- [ ] Обновить CHANGELOG.md, KNOWLEDGE_BASE.md
- [ ] git commit + push

---

## ВОПРОСЫ НА УТОЧНЕНИЕ [?]

- [?] contenteditable div или простой textarea для редактирования текста?
- [?] CDK Drag&Drop или готовый sortable-kit?
- [?] Нужно ли фоновое изображение на старте или потом?
- [?] Нужны ли плейсхолдеры {{...}} на старте или потом?
- [?] Размеры колонок текстового блока: жёсткие (50%/50%) или резиновые (drag)?
- [?] Разделитель: высота в мм или в пикселях?

---

*Конец чек-листа. Начинать с Этапа 1 завтра.*
