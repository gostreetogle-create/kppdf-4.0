# Чек-лист: Диаграмма Ганта — аудит и улучшения

> Дата: 2026-06-07
> Статус: в работе
> Контекст: Сессия с пользователем, полный редизайн и фикс Gantt Chart

---

## 🔴 Найдено багов (критично)

### 1. Zoom-кнопки не работают
- **Причина**: В шаблоне `(clicked)="zoom.set('day')"`, но компонент `kp-button` эмитит `(buttonClick)`, не `(clicked)`.
- **Где**: `gantt-chart.component.html`, строки 9-11
- **Фикс**: `(clicked)` → `(buttonClick)`

### 2. plannedHours не обновляется при drag/resize
- **Причина**: При изменении дат через drag/resize `plannedHours` остаётся старым.
- **Где**: `gantt-chart.component.ts`, `onMouseMove`
- **Фикс**: Хранить `dragOrigHours`, при каждом муве считать `newHours = origHours * (newDuration / origDuration)`

### 3. colDate — хардкод года 2026
- **Причина**: `colDate` всегда возвращает `2026-${label}`. Для 2026 года норм, но ломается в других годах.
- **Фикс**: Использовать дату из первой колонки.

### 4. weekIndex / monthIndex — потенциально нестабильны
- **Причина**: `weekIndex` парсит `"06-02-06-08"` и конструирует `new Date("2026-06-02")`. `monthIndex` полагается на `toLocaleString('ru')` для сравнения.
- **Фикс**: Убедиться, что все index-методы корректно работают при смене зума.

---

## 🟡 Редизайн левой колонки

### 5. Группировка по видам работ
**Текущее**: Каждая строка = одна задача. Показывает "Компонент / Работа"
**Нужно**: Группировать задачи по `workTypeName`. Показывать:
- Заголовок группы с названием вида работы (жирный, с цветной полосой)
- Внутри группы: [Компонент] — [Работник] (фамилия с инициалами)

**Пример:**
```
════ Лазерная резка ════
  Стойка (колонна) — Сергеев А.П.
  Щит баскетбольный — Сергеев А.П.
════ Полуавтоматическая сварка ════
  Стойка (колонна) — Морозов Д.
════ Порошковая покраска ════
  Стойка (колонна) — (не назначен)
```

### 6. Работники — из горизонтальной панели в левую колонку
**Текущее**: Панель `.gantt-workers` над диаграммой
**Нужно**: Убрать горизонтальную панель, показывать работника в каждой строке левой колонки

### 7. Формат имени работника: Фамилия + Инициалы
**Текущее**: `workerName()` возвращает только `lastName`
**Нужно**: `Сергеев А.П.` или `Сергеев А.`

---

## 🟢 Улучшения

### 8. Минимальная длительность полосы — 1 день (1 час)
**Текущее**: `Math.max(width, 4)` — 4px minimum. В днях это 0.1 колонки.
**Нужно**: Минимум 1 колонка (1 день). `Math.max(durationInCols, 1) * colWidth`

### 9. plannedHours на полосе — обновляется в реальном времени
**Текущее**: Показывает `bar.task.plannedHours`
**Нужно**: Показывать обновлённые часы при drag/resize

### 10. Ширина левой колонки: 240px → 320px
Для вмещения группы + компонента + работника.

---

## 🔵 Функционал (новый)

### 11. Быстрое создание заказа
Форма/диалог на странице Gantt:
- Номер заказа (авто)
- Выбор поставщика (из справочника контрагентов)
- Выбор товара (из справочника)
- Количество
- Статус: "Принят"

### 12. Импорт заказов из Excel/вручную
Отложено — требуется уточнение с пользователем.

---

## 📐 Архитектурные заметки

**Поток данных:**
```
OrderTaskService.items (seed data, in-memory)
  → getTasks() → taskSvc
    → GanttChartComponent.allTasks
      → filter by selectedOrderId → tasks
        → bars (computed, позиции на шкале)
          → visibleBars (фильтр по статусам)
```

**Зависимости:**
- `OrderTaskService` — сид-данные, CRUD, авто-назначение
- `ProductionOrderService` — заказы (BaseCrudService)
- `WorkerService` — работники (BaseCrudService)

**Типы:**
- `OrderTask` — production.ts: id, productionOrderId, componentId, componentName, workTypeId, workTypeName, workerId, status, plannedHours, actualHours, plannedStartDate, plannedEndDate, dependsOnTaskIds, sortOrder
- `ProductionOrder` — production.ts: id, number, productId, productName, status, plannedStartDate, plannedEndDate
- `Worker` — production.ts: id, lastName, firstName, patronymic, grade, ratePerHour, workTypeIds, isActive

---

## ✅ Выполнено (предыдущая сессия)
- [x] Пофикшен resize (`resizeOrigEnd` — не улетает на +10 колонок)
- [x] Убраны пунктирные SVG-стрелки
- [x] "Все заказы" по умолчанию
- [x] kp-select: text-overflow ellipsis
