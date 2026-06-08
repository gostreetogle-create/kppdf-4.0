/**
 * UndoRedoStack — универсальный стек для Undo/Redo.
 *
 * Хранит снапшоты состояния T. При push() — добавляет новый снапшот
 * и очищает redo-стек (новая ветка истории).
 *
 * @example
 *   const stack = new UndoRedoStack<DocBlock[]>(10);
 *   stack.push(blocks());           // сохранить перед мутацией
 *   const prev = stack.undo();      // вернуть предыдущее состояние
 *   const next = stack.redo();      // вернуть отменённое
 */
export class UndoRedoStack<T> {
  private stack: T[] = [];
  private index = -1;

  constructor(private maxSize = 50) {}

  /** Может ли выполнить undo */
  get canUndo(): boolean {
    return this.index > 0;
  }

  /** Может ли выполнить redo */
  get canRedo(): boolean {
    return this.index < this.stack.length - 1;
  }

  /** Количество шагов undo от текущей позиции */
  get undoSteps(): number {
    return this.index;
  }

  /** Количество шагов redo от текущей позиции */
  get redoSteps(): number {
    return this.stack.length - 1 - this.index;
  }

  /**
   * Добавить новый снапшот в историю.
   * Если текущая позиция не в конце — очищаем redo-ветку.
   */
  push(state: T): void {
    // Удаляем всё, что было после текущей позиции (redo-ветка)
    this.stack.length = this.index + 1;

    this.stack.push(state);
    this.index++;

    // Лимит: если превышен — удаляем самые старые записи
    if (this.stack.length > this.maxSize) {
      this.stack.shift();
      this.index--;
    }
  }

  /** Откатиться на один шаг назад. Возвращает предыдущее состояние или null. */
  undo(): T | null {
    if (!this.canUndo) return null;
    this.index--;
    return this.cloneState(this.stack[this.index]);
  }

  /** Вернуть отменённый шаг. Возвращает следующее состояние или null. */
  redo(): T | null {
    if (!this.canRedo) return null;
    this.index++;
    return this.cloneState(this.stack[this.index]);
  }

  /** Посмотреть текущее состояние (без изменения позиции) */
  peekCurrent(): T | null {
    return this.index >= 0 && this.index < this.stack.length
      ? this.cloneState(this.stack[this.index])
      : null;
  }

  /** Очистить всю историю */
  clear(): void {
    this.stack = [];
    this.index = -1;
  }

  /** Deep clone через JSON (для простых сериализуемых объектов) */
  private cloneState(state: T): T {
    return JSON.parse(JSON.stringify(state));
  }
}
