import { Observable, of, delay } from 'rxjs';
import type { ApiResponse } from '../../../shared/types/index.js';

/** Сгенерировать UUID-подобный ID */
export function generateId(): string {
  return crypto.randomUUID?.() ?? Math.random().toString(36).slice(2, 11);
}

/** Текущее время в ISO */
export function nowISO(): string {
  return new Date().toISOString();
}

/** Тип данных для создания сущности (все поля кроме id и дат) */
export type CreateData<T extends { id: string }> = Omit<T, 'id' | 'createdAt' | 'updatedAt'>;

/** Тип данных для обновления сущности (частичное обновление) */
export type UpdateData<T extends { id: string }> = Partial<Omit<T, 'id' | 'createdAt'>>;

/**
 * Базовая реализация in-memory CRUD-сервиса.
 *
 * Предоставляет стандартные методы getAll / getById / create / update / delete.
 * Наследуйтесь от этого класса и переопределяйте методы при необходимости.
 *
 * @example
 * ```typescript
 * @Injectable({ providedIn: 'root' })
 * export class MyService extends BaseCrudService<MyType> {
 *   constructor() {
 *     super();
 *     this.items = [...SEED_DATA];
 *   }
 * }
 * ```
 */
export class BaseCrudService<T extends { id: string }> {
  /** Внутреннее хранилище (in-memory) */
  protected items: T[] = [];

  /** Задержка для эмуляции асинхронности */
  protected delayMs = 100;

  // ─────────── CRUD методы ───────────

  /** Получить все сущности */
  getAll(): Observable<ApiResponse<T[]>> {
    return of({ success: true, data: this.cloneItems(this.items) }).pipe(delay(this.delayMs));
  }

  /** Получить сущность по ID */
  getById(id: string): Observable<ApiResponse<T | undefined>> {
    const item = this.items.find(i => i.id === id);
    return of({
      success: !!item,
      data: item ? this.cloneItem(item) : undefined,
    }).pipe(delay(this.delayMs));
  }

  /** Создать новую сущность */
  create(data: CreateData<T>): Observable<ApiResponse<T>> {
    const now = nowISO();
    const item = { ...data, id: generateId(), createdAt: now, updatedAt: now } as unknown as T;
    this.items.push(item);
    return of({ success: true, data: this.cloneItem(item) }).pipe(delay(this.delayMs));
  }

  /** Обновить сущность */
  update(id: string, data: UpdateData<T>): Observable<ApiResponse<T>> {
    const index = this.items.findIndex(i => i.id === id);
    if (index === -1) {
      return of({
        success: false,
        data: undefined as unknown as T,
        message: 'Сущность не найдена',
      }).pipe(delay(this.delayMs));
    }
    this.items[index] = { ...this.items[index], ...data, id, updatedAt: nowISO() };
    return of({ success: true, data: this.cloneItem(this.items[index]) }).pipe(delay(this.delayMs));
  }

  /** Удалить сущность */
  delete(id: string): Observable<ApiResponse<void>> {
    const index = this.items.findIndex(i => i.id === id);
    if (index === -1) {
      return of({
        success: false,
        data: undefined,
        message: 'Сущность не найдена',
      }).pipe(delay(this.delayMs));
    }
    this.items.splice(index, 1);
    return of({ success: true, data: undefined }).pipe(delay(this.delayMs));
  }

  /** Получить сырой массив (синхронно, для внутреннего использования сервисами) */
  getRawItems(): T[] {
    return this.items;
  }

  // ─────────── Защищённые хелперы ───────────

  /** Клонировать один элемент (переопределите для deep clone) */
  protected cloneItem(item: T): T {
    return { ...item };
  }

  /** Клонировать массив элементов */
  protected cloneItems(items: T[]): T[] {
    return items.map(i => this.cloneItem(i));
  }
}
