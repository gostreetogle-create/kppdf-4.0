# CONVENTIONS.md — Правила разработки

> **Назначение:** свод правил, которым следует Buffy при работе с проектом.
> Читать в начале каждой новой сессии.
> Нарушение любого правила = баг.

---

## 🔴 Железные правила (нарушать нельзя)

### Правило 0: Pre-commit пайплайн
Перед КАЖДЫМ коммитом выполнить (параллельно):
```bash
npx ng build          # сборка без ошибок
npx ng lint           # линтер без ошибок
npx vitest run        # все тесты зелены
```
+ запустить `code-reviewer-deepseek` для ревью изменений.

### Правило 1: Проверять импорты через grep
**Никогда не предполагать имена экспортов по памяти.**

Перед использованием ЛЮБОГО нового импорта из библиотеки:
```bash
grep "LucideИмя" node_modules/@lucide/angular/types/lucide-angular.d.ts
```
Или: `researcher-docs` с запросом точного API.

### Правило 2: Сигналы вместо свойств
- ✅ `input()`, `output()`, `model()`, `signal()`, `computed()`
- 🔴 Никаких `@Input()`, `@Output()`, class-properties для состояния
- ✅ `inject()` вместо constructor DI
- 🔴 Никаких `constructor(private service: X)`

### Правило 3: Standalone + OnPush
- ✅ Все компоненты standalone, без NgModules
- ✅ `changeDetection: ChangeDetectionStrategy.OnPush`
- ✅ `track` в каждом `@for`

### Правило 4: Никакого `any`
- `any` → `unknown` + type guard
- Исключение: когда значение действительно может быть чем угодно

### Правило 5: Стили через токены
- Цвета: `var(--color-*)` из `_tokens.scss`
- Тени: `var(--shadow-*)`
- Радиусы: `var(--radius-*)`
- Размеры: `var(--space-*)`
- Переходы: `var(--transition-*)`
- 🔴 Никаких хардкодных цветов/размеров (кроме canvas__page — A4 фиксирован)

---

## 🟡 Паттерны (стандартные приёмы)

### Новая CRUD-сущность — HTTP (ApiService)
Все сервисы используют HTTP через `inject(ApiService)`. Образец: `work-type.service.ts`.

1. Интерфейс в `shared/types/<module>.ts`
2. Сервис в `core/<name>.service.ts`:
   ```typescript
   @Injectable({ providedIn: 'root' })
   export class MyService {
     private api = inject(ApiService);
     private basePath = '/my-entity';

     getAll(): Observable<ApiResponse<MyType[]>> {
       return this.api.get<MyType[]>(this.basePath);
     }
     getById(id: string): Observable<ApiResponse<MyType>> {
       return this.api.getById<MyType>(this.basePath, id);
     }
     create(data: CreateMyData): Observable<ApiResponse<MyType>> {
       return this.api.post<MyType>(this.basePath, data);
     }
     update(id: string, data: Partial<MyType>): Observable<ApiResponse<MyType>> {
       return this.api.put<MyType>(`${this.basePath}/${id}`, data);
     }
     delete(id: string): Observable<ApiResponse<MyType>> {
       return this.api.delete<MyType>(this.basePath, id);
     }
   }
   ```
3. Бэкенд: модель Mongoose + CRUD-роутер через `createCrudRouter` в `backend/src/modules/`
4. Регистрация роута в `backend/src/index.ts`: `app.use('/api/v1/my-entity', myRoutes)`
5. `features/<name>/<name>-list.component.*` (список + поиск)
6. `features/<name>/<name>-editor.component.*` (форма)
7. 3 lazy-маршрута в `app.routes.ts` (с ролевым `canActivateChild`)
8. Пункт меню в `admin-layout.component.ts`
9. Тесты: `HttpTestingController` — образец в любом `*.service.spec.ts`

### Смена статуса / PATCH-запросы
```typescript
// Сервис
changeStatus(id: string, status: EntityStatus): Observable<ApiResponse<MyType>> {
  return this.api.patch<MyType>(`${this.basePath}/${id}/status`, { status });
}

// Бэкенд (в роутере)
router.patch('/:id/status', async (req, res) => {
  const doc = await MyModel.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
  res.json({ success: true, data: doc });
});
```

### Ролевой доступ к маршрутам
```typescript
// app.routes.ts
{
  path: 'sales',
  canActivateChild: [requireRole('admin', 'manager')],
  children: [ ... ]
}
```
Роли: `admin`, `manager`, `production`, `accountant`, `storekeeper`.

### Новая иконка lucide
1. `grep "LucideИмя" node_modules/@lucide/angular/types/lucide-angular.d.ts` — проверить существование
2. Добавить в `provideLucideIcons(...)` в `app.config.ts`
3. Использовать: `<svg [lucideIcon]="'icon-name'">` или `lucideIcon="icon-name"` на kp-button

### Новый UI-компонент (kp-*)
1. Standalone, OnPush, `input()` сигналы
2. Импортировать `LucideDynamicIcon` если нужны иконки
3. `[attr.aria-label]` на всех интерактивных элементах
4. Тесты: публичное API + default-значения + output emissions

---

## 🟢 Стиль кода

### Именование
- Компоненты: `kp-*` селектор, `Kp*Component` класс
- Сервисы: `*Service` класс
- Файлы: kebab-case для компонентов, dot-separated для сервисов
- Сигналы: `camelCase` (не `$signal`)

### SCSS
- Стили в компонентах — через `styles: [\`...\`]` (не отдельные файлы, кроме features)
- Features — отдельные SCSS файлы
- `::ng-deep` — только для стилизации дочерних PrimeNG-компонентов

### Русский язык
- Интерфейс: русский
- Комментарии: русский
- Код (переменные, функции): английский

---

## 📁 Файлы внешней памяти (читать в начале сессии)

| Файл | Что содержит |
|------|-------------|
| `ARCHITECTURE.md` | Карта проекта, структура, стек, маршруты |
| `CONVENTIONS.md` | Правила разработки (этот файл) |
| `ЧЕК-ЛИСТ-КОНСОЛИДИРОВАННЫЙ.md` | Живой чек-лист: что сделано и что ожидает |

---

## ⚠️ Известные ограничения

1. **JIT-тесты сигналов:** `componentRef.setInput()` и template-биндинги из TestHost не работают.
   Тестировать публичное API компонентов, не DOM-атрибуты.
2. **Фоновые процессы:** `&` не работает. Dev-сервер запускать вручную в отдельном терминале.
3. **Кэш дерева:** после `write_file`/`rm` делать `list_directory` или `git status`.
4. **track $index:** вызывает NG0955. Использовать `track item.id` или уникальное поле.

---

*Создан: 2026-06-06 · Обновлён: 2026-06-09 (v1.15 — все сервисы на HTTP, ролевые гуарды, PATCH-паттерн)*
