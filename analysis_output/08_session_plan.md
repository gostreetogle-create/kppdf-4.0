# План сессии — 2026-06-07

## ✅ Выполнено

## 🔧 Очередь

### 1. Левое меню — секции свёрнуты по умолчанию
- [ ] `admin-layout.component.ts`: инициализировать `collapsedSections` со всеми sectionId
- Файл: `src/app/layout/admin-layout.component.ts`

### 2. kp-select — текст налезает (FloatLabel)
- [ ] Проблема: FloatLabel размещает label поверх поля. Когда поле пустое — label и placeholder могут перекрываться
- [ ] Решение: убрать FloatLabel, сделать label над полем (как обычный лейбл)
- Файл: `src/app/shared/ui/kp-select.component.ts`

### 3. КП — авто-выбор шаблона по умолчанию
- [ ] При создании нового КП — если есть шаблон типа quotation, выбрать его по умолчанию
- [ ] Авто-загрузка товаров из корзины (если корзина не пуста)
- Файл: `src/app/features/proposals/proposal-editor.component.ts`

### 4. КП — кнопка «Создать договор»
- [ ] Добавить кнопку в proposal-list (строке) или в деталях
- [ ] Использовать `ContractService.createFromProposal()`
- Файл: `src/app/features/proposals/proposal-list.component.ts`

### 5. Предпросмотр документа — стабилизация
- [ ] Проверить kp-doc-preview-dialog — дёрганье при открытии
- Файл: `src/app/shared/ui/kp-doc-preview-dialog.component.ts`

### 6. Выбор шаблона в договоре
- [ ] При создании договора — выбор шаблона типа contract
- Файл: `src/app/features/contracts/contract-list.component.ts`

### 7. Таблицы шире
- [ ] Проверить max-width у страниц, убрать ограничения где нужно
