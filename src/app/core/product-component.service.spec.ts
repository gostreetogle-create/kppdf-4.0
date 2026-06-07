import { describe, it, expect, beforeEach } from 'vitest';
import { ProductComponentService } from './product-component.service';
import { firstValueFrom } from 'rxjs';
import type { ProductComponent } from '../../../shared/types/index.js';

describe('ProductComponentService', () => {
  let svc: ProductComponentService;

  beforeEach(() => {
    svc = new ProductComponentService();
    svc['items'] = [];
  });

  it('создаёт компонент с материалами и работами', async () => {
    const res = await firstValueFrom(svc.createComponent({
      productId: 'prod-test',
      name: 'Стойка',
      quantityPerProduct: 2,
      sortOrder: 1,
      materials: [{ id: 'm1', name: 'Труба 40×40', quantity: 3, unit: 'м.п' }],
      workTypes: [{ id: 'w1', name: 'Резка', department: 'Изготовление', normHours: 0.5, sortOrder: 1 }],
    }));
    expect(res.success).toBe(true);
    expect(res.data!.name).toBe('Стойка');
    expect(res.data!.materials.length).toBe(1);
    expect(res.data!.workTypes.length).toBe(1);
  });

  it('getByProduct возвращает компоненты отсортированными', async () => {
    await firstValueFrom(svc.createComponent({ productId: 'prod-test', name: 'B', quantityPerProduct: 1, sortOrder: 2, materials: [], workTypes: [] }));
    await firstValueFrom(svc.createComponent({ productId: 'prod-test', name: 'A', quantityPerProduct: 1, sortOrder: 1, materials: [], workTypes: [] }));
    const res = await firstValueFrom(svc.getByProduct('prod-test'));
    expect(res.data!.length).toBe(2);
    expect(res.data![0].name).toBe('A');
    expect(res.data![1].name).toBe('B');
  });

  it('getByProduct возвращает пустой массив для товара без компонентов', async () => {
    const res = await firstValueFrom(svc.getByProduct('no-comps'));
    expect(res.success).toBe(true);
    expect(res.data!).toEqual([]);
  });

  it('обновляет компонент', async () => {
    const cr = await firstValueFrom(svc.createComponent({ productId: 'prod-test', name: 'Старое', quantityPerProduct: 1, sortOrder: 1, materials: [], workTypes: [] }));
    const res = await firstValueFrom(svc.updateComponent(cr.data!.id, { name: 'Новое', quantityPerProduct: 3 }));
    expect(res.data!.name).toBe('Новое');
    expect(res.data!.quantityPerProduct).toBe(3);
  });

  it('удаляет компонент', async () => {
    const cr = await firstValueFrom(svc.createComponent({ productId: 'prod-test', name: 'X', quantityPerProduct: 1, sortOrder: 1, materials: [], workTypes: [] }));
    await firstValueFrom(svc.deleteComponent(cr.data!.id));
    const all = await firstValueFrom(svc.getByProduct('prod-test'));
    expect(all.data!.length).toBe(0);
  });

  it('seed-компоненты содержат материалы и работы', () => {
    // Создаём новый экземпляр с seed-данными
    const seedSvc = new ProductComponentService();
    const items = seedSvc['items'] as ProductComponent[];
    expect(items.length).toBeGreaterThanOrEqual(5);
    const first = items[0];
    expect(first.materials.length).toBeGreaterThan(0);
    expect(first.workTypes.length).toBeGreaterThan(0);
  });
});
