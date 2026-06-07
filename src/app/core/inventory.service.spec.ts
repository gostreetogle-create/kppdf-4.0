import { describe, it, expect, beforeEach } from 'vitest';
import { InventoryService } from './inventory.service';
import { firstValueFrom } from 'rxjs';
import type { InventoryMovement } from '../../../shared/types/index.js';

function makeMovement(overrides?: Partial<InventoryMovement>): Omit<InventoryMovement, 'id' | 'createdAt'> {
  return {
    type: 'in',
    warehouseId: 'wh-1',
    zoneName: 'Зона А',
    entityType: 'product',
    entityId: 'prod-1',
    entityName: 'Тестовый товар',
    entitySku: 'SP0001',
    entityUnit: 'шт',
    quantity: 10,
    ...overrides,
  };
}

describe('InventoryService', () => {
  let service: InventoryService;

  beforeEach(() => {
    service = new InventoryService();
    service['items'] = [];
    service['movements'] = [];
  });

  describe('addMovement', () => {
    it('приход увеличивает остаток', async () => {
      await firstValueFrom(service.addMovement(makeMovement({ type: 'in', quantity: 10 })));

      const items = await firstValueFrom(service.getItems('wh-1'));
      expect(items.data.length).toBe(1);
      expect(items.data[0].quantity).toBe(10);
      expect(items.data[0].entityName).toBe('Тестовый товар');
    });

    it('расход уменьшает остаток', async () => {
      await firstValueFrom(service.addMovement(makeMovement({ type: 'in', quantity: 10 })));
      await firstValueFrom(service.addMovement(makeMovement({ type: 'out', quantity: 3 })));

      const items = await firstValueFrom(service.getItems('wh-1'));
      expect(items.data[0].quantity).toBe(7);
    });

    it('полный расход удаляет остаток', async () => {
      await firstValueFrom(service.addMovement(makeMovement({ type: 'in', quantity: 5 })));
      await firstValueFrom(service.addMovement(makeMovement({ type: 'out', quantity: 5 })));

      const items = await firstValueFrom(service.getItems('wh-1'));
      expect(items.data.length).toBe(0);
    });

    it('перемещение уменьшает в источнике и добавляет в цели', async () => {
      await firstValueFrom(service.addMovement(makeMovement({ type: 'in', quantity: 10 })));
      await firstValueFrom(service.addMovement(makeMovement({
        type: 'transfer',
        quantity: 4,
        toWarehouseId: 'wh-2',
        toZoneName: 'Зона Б',
      })));

      const src = await firstValueFrom(service.getItems('wh-1'));
      const dst = await firstValueFrom(service.getItems('wh-2'));

      expect(src.data[0].quantity).toBe(6);
      expect(dst.data.length).toBe(1);
      expect(dst.data[0].quantity).toBe(4);
      expect(dst.data[0].zoneName).toBe('Зона Б');
    });

    it('группирует одинаковые позиции', async () => {
      await firstValueFrom(service.addMovement(makeMovement({ type: 'in', quantity: 5 })));
      await firstValueFrom(service.addMovement(makeMovement({ type: 'in', quantity: 5 })));

      const items = await firstValueFrom(service.getItems('wh-1'));
      expect(items.data.length).toBe(1);
      expect(items.data[0].quantity).toBe(10);
    });
  });

  describe('getMovements', () => {
    it('возвращает движения в обратном хронологическом порядке', async () => {
      await firstValueFrom(service.addMovement(makeMovement({ type: 'in', quantity: 5 })));
      await firstValueFrom(service.addMovement(makeMovement({ type: 'out', quantity: 2 })));

      const mov = await firstValueFrom(service.getMovements('wh-1'));
      expect(mov.data.length).toBe(2);
      expect(mov.data[0].type).toBe('out');
    });

    it('фильтрует по складу', async () => {
      await firstValueFrom(service.addMovement(makeMovement({ type: 'in', quantity: 1, warehouseId: 'wh-1' })));
      await firstValueFrom(service.addMovement(makeMovement({ type: 'in', quantity: 2, warehouseId: 'wh-2' })));

      const wh1 = await firstValueFrom(service.getMovements('wh-1'));
      expect(wh1.data.length).toBe(1);
    });
  });

  describe('getItems', () => {
    it('фильтрует по складу', async () => {
      await firstValueFrom(service.addMovement(makeMovement({ type: 'in', quantity: 5, warehouseId: 'wh-1' })));
      await firstValueFrom(service.addMovement(makeMovement({ type: 'in', quantity: 3, warehouseId: 'wh-2', entityId: 'prod-2' })));

      const wh1 = await firstValueFrom(service.getItems('wh-1'));
      expect(wh1.data.length).toBe(1);
      expect(wh1.data[0].quantity).toBe(5);
    });

    it('возвращает все остатки без фильтра', async () => {
      await firstValueFrom(service.addMovement(makeMovement({ type: 'in', quantity: 1, warehouseId: 'wh-1' })));
      await firstValueFrom(service.addMovement(makeMovement({ type: 'in', quantity: 2, warehouseId: 'wh-2', entityId: 'prod-2' })));

      const all = await firstValueFrom(service.getItems());
      expect(all.data.length).toBe(2);
    });
  });
});
