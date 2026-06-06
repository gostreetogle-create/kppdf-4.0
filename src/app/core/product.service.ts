import { Injectable, inject } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { BaseCrudService, generateId, nowISO } from './crud-factory.js';
import { ProductCategoryService } from './product-category.service.js';
import type { ApiResponse, Product } from '../../../shared/types/index.js';

/** Счётчики артикулов по префиксам категорий */
/** Счётчики артикулов по префиксам категорий */
const skuCounters: Record<string, number> = {
  SP: 2, MF: 2, OG: 2, OS: 1, MB: 1, NV: 2, PR: 1,
};

/** Сгенерировать артикул: префикс + 4 цифры */
function generateSku(prefix: string): string {
  if (!skuCounters[prefix]) skuCounters[prefix] = 0;
  skuCounters[prefix]++;
  const num = String(skuCounters[prefix]).padStart(4, '0');
  return `${prefix}${num}`;
}

const SEED_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    sku: 'SP0001',
    name: 'Стойка баскетбольная БСФП-120',
    categoryId: 'cat-sp',
    productType: 'manufactured',
    description: 'Профессиональная баскетбольная стойка с кольцом и щитом',
    basePrice: 85000,
    defaultMarkupPercent: 25,
    unit: 'шт',
    weightKg: 120,
    dimensions: '3050×1800×120',
    material: 'Сталь Ст3, профильная труба 80×80',
    hasPassport: true,
    hasDrawing: true,
    isActive: true,
    createdAt: '2026-01-15T10:00:00.000Z',
    updatedAt: '2026-03-01T12:00:00.000Z',
  },
  {
    id: 'prod-2',
    sku: 'SP0002',
    name: 'Турник уличный ТУ-2',
    categoryId: 'cat-sp',
    productType: 'manufactured',
    description: 'Двухсекционный турник для воркаут-площадок',
    basePrice: 32000,
    defaultMarkupPercent: 30,
    unit: 'шт',
    weightKg: 45,
    dimensions: '2500×1200×2200',
    material: 'Сталь Ст3, труба 48×3',
    hasPassport: true,
    hasDrawing: true,
    isActive: true,
    createdAt: '2026-01-20T10:00:00.000Z',
    updatedAt: '2026-02-15T12:00:00.000Z',
  },
  {
    id: 'prod-3',
    sku: 'MF0001',
    name: 'Скамейка парковая СК-180',
    categoryId: 'cat-mf',
    productType: 'manufactured',
    description: 'Парковая скамейка со спинкой, деревянные рейки',
    basePrice: 12500,
    defaultMarkupPercent: 30,
    unit: 'шт',
    weightKg: 35,
    dimensions: '1800×600×800',
    material: 'Сталь + дерево (лиственница)',
    hasPassport: false,
    hasDrawing: true,
    isActive: true,
    createdAt: '2026-02-01T10:00:00.000Z',
    updatedAt: '2026-02-10T12:00:00.000Z',
  },
  {
    id: 'prod-4',
    sku: 'MF0002',
    name: 'Урна уличная У-50',
    categoryId: 'cat-mf',
    productType: 'manufactured',
    description: 'Металлическая урна для мусора 50л',
    basePrice: 4500,
    defaultMarkupPercent: 35,
    unit: 'шт',
    weightKg: 8,
    dimensions: '300×300×600',
    material: 'Сталь, порошковая покраска',
    hasPassport: false,
    hasDrawing: true,
    isActive: true,
    createdAt: '2026-02-05T10:00:00.000Z',
    updatedAt: '2026-02-10T12:00:00.000Z',
  },
  {
    id: 'prod-5',
    sku: 'MB0001',
    name: 'Комплект крепежа М10 (100 шт)',
    categoryId: 'cat-pr',
    productType: 'purchased',
    description: 'Болт М10 + гайка + шайба, оцинкованные',
    basePrice: 850,
    defaultMarkupPercent: 20,
    unit: 'комплект',
    weightKg: 2.5,
    material: 'Сталь оцинкованная',
    hasPassport: false,
    hasDrawing: false,
    isActive: true,
    createdAt: '2026-03-01T10:00:00.000Z',
    updatedAt: '2026-03-01T10:00:00.000Z',
  },
  // ─── Тестовые товары для всех категорий ───
  {
    id: 'prod-6',
    sku: 'OG0001',
    name: 'Забор спортивный ЗС-200 (секция 2м)',
    categoryId: 'cat-og',
    productType: 'manufactured',
    description: 'Секция ограждения для спортплощадок 2000×1200мм',
    basePrice: 8500,
    defaultMarkupPercent: 25,
    unit: 'шт',
    weightKg: 25,
    dimensions: '2000×1200',
    material: 'Сталь Ст3, сетка сварная',
    hasPassport: false,
    hasDrawing: true,
    isActive: true,
    createdAt: '2026-03-10T10:00:00.000Z',
    updatedAt: '2026-03-10T10:00:00.000Z',
  },
  {
    id: 'prod-7',
    sku: 'OG0002',
    name: 'Калитка К-1000',
    categoryId: 'cat-og',
    productType: 'manufactured',
    description: 'Металлическая калитка 1000×1500мм',
    basePrice: 12000,
    defaultMarkupPercent: 25,
    unit: 'шт',
    weightKg: 30,
    dimensions: '1000×1500',
    material: 'Сталь профильная 40×20',
    hasPassport: false,
    hasDrawing: true,
    isActive: true,
    createdAt: '2026-03-15T10:00:00.000Z',
    updatedAt: '2026-03-15T10:00:00.000Z',
  },
  {
    id: 'prod-8',
    sku: 'OS0001',
    name: 'Прожектор светодиодный 100Вт',
    categoryId: 'cat-os',
    productType: 'purchased',
    description: 'Светодиодный прожектор для освещения спортплощадок',
    basePrice: 4500,
    defaultMarkupPercent: 20,
    unit: 'шт',
    weightKg: 3.2,
    dimensions: '300×200×150',
    material: 'Алюминий, стекло',
    hasPassport: true,
    hasDrawing: false,
    isActive: true,
    createdAt: '2026-04-01T10:00:00.000Z',
    updatedAt: '2026-04-01T10:00:00.000Z',
  },
  {
    id: 'prod-9',
    sku: 'NV0001',
    name: 'Мяч баскетбольный Club 500',
    categoryId: 'cat-nv',
    productType: 'purchased',
    description: 'Баскетбольный мяч, размер 7, резина',
    basePrice: 1500,
    defaultMarkupPercent: 30,
    unit: 'шт',
    weightKg: 0.6,
    dimensions: 'D=240',
    material: 'Резина',
    hasPassport: false,
    hasDrawing: false,
    isActive: true,
    createdAt: '2026-04-10T10:00:00.000Z',
    updatedAt: '2026-04-10T10:00:00.000Z',
  },
  {
    id: 'prod-10',
    sku: 'NV0002',
    name: 'Сетка волейбольная ВС-9',
    categoryId: 'cat-nv',
    productType: 'purchased',
    description: 'Волейбольная сетка 9×1м, профессиональная',
    basePrice: 3200,
    defaultMarkupPercent: 25,
    unit: 'шт',
    weightKg: 1.8,
    dimensions: '9000×1000',
    material: 'Полипропилен',
    hasPassport: false,
    hasDrawing: false,
    isActive: true,
    createdAt: '2026-04-15T10:00:00.000Z',
    updatedAt: '2026-04-15T10:00:00.000Z',
  },
];

@Injectable({ providedIn: 'root' })
export class ProductService extends BaseCrudService<Product> {
  private categoryService = inject(ProductCategoryService);

  constructor() {
    super();
    this.items = SEED_PRODUCTS.map(p => ({ ...p }));
  }

  /** Получить все товары */
  getProducts(): Observable<ApiResponse<Product[]>> {
    return this.getAll();
  }

  /** Получить товар по ID */
  getProduct(id: string): Observable<ApiResponse<Product | undefined>> {
    return this.getById(id);
  }

  /** Создать товар с авто-генерацией артикула */
  createProduct(data: Omit<Product, 'id' | 'sku' | 'createdAt' | 'updatedAt'>): Observable<ApiResponse<Product>> {
    const prefix = this.categoryService.getCategoryPrefix(data.categoryId) || 'PR';
    const sku = generateSku(prefix);
    const now = nowISO();
    const product: Product = {
      ...data,
      id: generateId(),
      sku,
      createdAt: now,
      updatedAt: now,
    };
    this.items.push(product);
    return of({ success: true, data: { ...product } }).pipe(delay(this.delayMs));
  }

  /** Обновить товар */
  updateProduct(id: string, data: Partial<Omit<Product, 'id' | 'sku' | 'createdAt'>>): Observable<ApiResponse<Product>> {
    return this.update(id, { ...data, sku: undefined });
  }

  /** Удалить товар */
  deleteProduct(id: string): Observable<ApiResponse<void>> {
    return this.delete(id);
  }

  /** Получить следующий артикул для категории (для предпросмотра) */
  previewSku(categoryId: string): string {
    const prefix = this.categoryService.getCategoryPrefix(categoryId) || 'PR';
    const nextNum = (skuCounters[prefix] || 0) + 1;
    return `${prefix}${String(nextNum).padStart(4, '0')}`;
  }
}
