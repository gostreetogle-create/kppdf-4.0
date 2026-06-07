import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { BaseCrudService, generateId, nowISO } from './crud-factory.js';
import type { ApiResponse, ProductComponent, ComponentMaterial, ComponentWorkType } from '../../../shared/types/index.js';

const SEED_COMPONENTS: ProductComponent[] = [
  // ─── Стойка баскетбольная БСФП-120 (prod-1) ───
  {
    id: 'comp-1', productId: 'prod-1', name: 'Стойка (колонна)',
    quantityPerProduct: 1, description: 'Основная несущая колонна',
    sortOrder: 1,
    materials: [
      { id: 'cm-1-1', name: 'Труба профильная 80×80×3', quantity: 3.5, unit: 'м.п', notes: 'Сталь Ст3' },
      { id: 'cm-1-2', name: 'Лист стальной 4 мм', quantity: 0.8, unit: 'кв.м' },
    ],
    workTypes: [
      { id: 'cw-1-1', name: 'Лазерная резка', department: 'Изготовление', normHours: 0.5, sortOrder: 1 },
      { id: 'cw-1-2', name: 'Сварка полуавтомат', department: 'Изготовление', normHours: 2.0, sortOrder: 2 },
      { id: 'cw-1-3', name: 'Порошковая покраска', department: 'Изготовление', normHours: 1.5, sortOrder: 3 },
    ],
    createdAt: '2026-02-01T10:00:00.000Z', updatedAt: '2026-02-01T10:00:00.000Z',
  },
  {
    id: 'comp-2', productId: 'prod-1', name: 'Щит баскетбольный',
    quantityPerProduct: 1, description: 'Щит из оргстекла 1200×900',
    sortOrder: 2,
    materials: [
      { id: 'cm-2-1', name: 'Оргстекло 10 мм', quantity: 1.2, unit: 'кв.м' },
      { id: 'cm-2-2', name: 'Профиль алюминиевый 25×25', quantity: 4.5, unit: 'м.п' },
    ],
    workTypes: [
      { id: 'cw-2-1', name: 'Лазерная резка', department: 'Изготовление', normHours: 1.0, sortOrder: 1 },
      { id: 'cw-2-2', name: 'Слесарные работы', department: 'Сборка', normHours: 1.5, sortOrder: 2 },
    ],
    createdAt: '2026-02-01T10:00:00.000Z', updatedAt: '2026-02-01T10:00:00.000Z',
  },
  {
    id: 'comp-3', productId: 'prod-1', name: 'Кольцо баскетбольное',
    quantityPerProduct: 1, description: 'Кольцо с амортизатором',
    sortOrder: 3,
    materials: [
      { id: 'cm-3-1', name: 'Пруток стальной ∅16', quantity: 1.5, unit: 'м.п' },
      { id: 'cm-3-2', name: 'Сетка нейлоновая', quantity: 1, unit: 'шт' },
    ],
    workTypes: [
      { id: 'cw-3-1', name: 'Гибка', department: 'Изготовление', normHours: 0.3, sortOrder: 1 },
      { id: 'cw-3-2', name: 'Сварка', department: 'Изготовление', normHours: 0.5, sortOrder: 2 },
    ],
    createdAt: '2026-02-01T10:00:00.000Z', updatedAt: '2026-02-01T10:00:00.000Z',
  },
  // ─── Турник уличный ТУ-2 (prod-2) ───
  {
    id: 'comp-4', productId: 'prod-2', name: 'Перекладина',
    quantityPerProduct: 2, description: 'Две перекладины на разной высоте',
    sortOrder: 1,
    materials: [
      { id: 'cm-4-1', name: 'Труба 48×3', quantity: 3.0, unit: 'м.п' },
    ],
    workTypes: [
      { id: 'cw-4-1', name: 'Труборез', department: 'Изготовление', normHours: 0.3, sortOrder: 1 },
      { id: 'cw-4-2', name: 'Сварка', department: 'Изготовление', normHours: 0.8, sortOrder: 2 },
      { id: 'cw-4-3', name: 'Порошковая покраска', department: 'Изготовление', normHours: 1.0, sortOrder: 3 },
    ],
    createdAt: '2026-03-01T10:00:00.000Z', updatedAt: '2026-03-01T10:00:00.000Z',
  },
  {
    id: 'comp-5', productId: 'prod-2', name: 'Стойки вертикальные',
    quantityPerProduct: 4, description: 'Опорные стойки турника',
    sortOrder: 2,
    materials: [
      { id: 'cm-5-1', name: 'Труба профильная 60×60×3', quantity: 10.0, unit: 'м.п' },
      { id: 'cm-5-2', name: 'Лист стальной 6 мм', quantity: 0.5, unit: 'кв.м', notes: 'Опорные пятаки' },
    ],
    workTypes: [
      { id: 'cw-5-1', name: 'Лазерная резка', department: 'Изготовление', normHours: 0.8, sortOrder: 1 },
      { id: 'cw-5-2', name: 'Сварка', department: 'Изготовление', normHours: 1.5, sortOrder: 2 },
      { id: 'cw-5-3', name: 'Порошковая покраска', department: 'Изготовление', normHours: 2.0, sortOrder: 3 },
    ],
    createdAt: '2026-03-01T10:00:00.000Z', updatedAt: '2026-03-01T10:00:00.000Z',
  },
  // ─── Скамейка парковая СК-180 (prod-3) ───
  {
    id: 'comp-6', productId: 'prod-3', name: 'Каркас металлический',
    quantityPerProduct: 1, description: 'Несущий каркас скамейки',
    sortOrder: 1,
    materials: [
      { id: 'cm-6-1', name: 'Труба профильная 40×25×2', quantity: 5.0, unit: 'м.п' },
    ],
    workTypes: [
      { id: 'cw-6-1', name: 'Лазерная резка', department: 'Изготовление', normHours: 0.5, sortOrder: 1 },
      { id: 'cw-6-2', name: 'Сварка', department: 'Изготовление', normHours: 1.0, sortOrder: 2 },
      { id: 'cw-6-3', name: 'Порошковая покраска', department: 'Изготовление', normHours: 1.0, sortOrder: 3 },
    ],
    createdAt: '2026-04-01T10:00:00.000Z', updatedAt: '2026-04-01T10:00:00.000Z',
  },
  {
    id: 'comp-7', productId: 'prod-3', name: 'Рейки деревянные',
    quantityPerProduct: 12, description: 'Рейки сидения и спинки',
    sortOrder: 2,
    materials: [
      { id: 'cm-7-1', name: 'Брусок лиственница 40×30', quantity: 21.6, unit: 'м.п' },
      { id: 'cm-7-2', name: 'Лак защитный', quantity: 0.5, unit: 'л' },
    ],
    workTypes: [
      { id: 'cw-7-1', name: 'Деревообработка', department: 'Изготовление', normHours: 2.0, sortOrder: 1 },
      { id: 'cw-7-2', name: 'Слесарные работы', department: 'Сборка', normHours: 1.5, sortOrder: 2 },
    ],
    createdAt: '2026-04-01T10:00:00.000Z', updatedAt: '2026-04-01T10:00:00.000Z',
  },
];

@Injectable({ providedIn: 'root' })
export class ProductComponentService extends BaseCrudService<ProductComponent> {

  constructor() {
    super();
    this.items = SEED_COMPONENTS.map(c => ({
      ...c,
      materials: c.materials.map(m => ({ ...m })),
      workTypes: c.workTypes.map(w => ({ ...w })),
    }));
  }

  getByProduct(productId: string): Observable<ApiResponse<ProductComponent[]>> {
    const components = this.items
      .filter(c => c.productId === productId)
      .sort((a, b) => a.sortOrder - b.sortOrder);
    return of({
      success: true,
      data: components.map(c => this.cloneItem(c)),
    }).pipe(delay(this.delayMs));
  }

  createComponent(data: Omit<ProductComponent, 'id' | 'createdAt' | 'updatedAt'>): Observable<ApiResponse<ProductComponent>> {
    const now = nowISO();
    const component: ProductComponent = {
      ...data,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    };
    this.items.push(component);
    return of({ success: true, data: this.cloneItem(component) }).pipe(delay(this.delayMs));
  }

  updateComponent(id: string, data: Partial<Omit<ProductComponent, 'id' | 'productId' | 'createdAt'>>): Observable<ApiResponse<ProductComponent>> {
    return this.update(id, data);
  }

  deleteComponent(id: string): Observable<ApiResponse<void>> {
    return this.delete(id);
  }

  protected override cloneItem(item: ProductComponent): ProductComponent {
    return {
      ...item,
      materials: item.materials.map(m => ({ ...m })),
      workTypes: item.workTypes.map(w => ({ ...w })),
    };
  }
}
