import { describe, it, expect, beforeEach } from 'vitest';
import { StorageItemService } from './storage-item.service';
import { firstValueFrom } from 'rxjs';

describe('StorageItemService', () => {
  let service: StorageItemService;

  beforeEach(() => {
    service = new StorageItemService();
    service['items'] = [];
  });

  describe('createStorageItem', () => {
    it('создаёт инвентарь с авто-id и датами', async () => {
      const res = await firstValueFrom(service.createStorageItem({
        name: 'Сварочный аппарат TIG-200',
        isActive: true,
      }));

      expect(res.success).toBe(true);
      expect(res.data!.id).toBeTruthy();
      expect(res.data!.name).toBe('Сварочный аппарат TIG-200');
      expect(res.data!.createdAt).toBeTruthy();
    });

    it('создаёт инвентарь с полными данными', async () => {
      const res = await firstValueFrom(service.createStorageItem({
        name: 'Токарный станок',
        description: 'Настольный токарный станок по металлу',
        weightKg: 45,
        dimensions: '600×300×300',
        notes: 'Серийный № TS-2024-001',
        isActive: true,
      }));

      expect(res.data!.description).toBe('Настольный токарный станок по металлу');
      expect(res.data!.weightKg).toBe(45);
      expect(res.data!.dimensions).toBe('600×300×300');
      expect(res.data!.notes).toBe('Серийный № TS-2024-001');
    });
  });

  describe('getStorageItems', () => {
    it('возвращает пустой массив при инициализации', async () => {
      const res = await firstValueFrom(service.getStorageItems());
      expect(res.data).toEqual([]);
    });

    it('возвращает все позиции после создания', async () => {
      await firstValueFrom(service.createStorageItem({ name: 'Позиция 1', isActive: true }));
      await firstValueFrom(service.createStorageItem({ name: 'Позиция 2', isActive: true }));

      const res = await firstValueFrom(service.getStorageItems());
      expect(res.data.length).toBe(2);
    });
  });

  describe('getStorageItem', () => {
    it('возвращает позицию по id', async () => {
      const cr = await firstValueFrom(service.createStorageItem({ name: 'Дрель', isActive: true }));
      const res = await firstValueFrom(service.getStorageItem(cr.data!.id));

      expect(res.success).toBe(true);
      expect(res.data!.name).toBe('Дрель');
    });
  });

  describe('updateStorageItem', () => {
    it('обновляет поля', async () => {
      const cr = await firstValueFrom(service.createStorageItem({ name: 'Старое', isActive: true }));
      const res = await firstValueFrom(service.updateStorageItem(cr.data!.id, {
        name: 'Новое',
        notes: 'Заметка',
      }));

      expect(res.data!.name).toBe('Новое');
      expect(res.data!.notes).toBe('Заметка');
    });
  });

  describe('deleteStorageItem', () => {
    it('удаляет позицию', async () => {
      const cr = await firstValueFrom(service.createStorageItem({ name: 'На удаление', isActive: true }));
      await firstValueFrom(service.deleteStorageItem(cr.data!.id));

      const all = await firstValueFrom(service.getStorageItems());
      expect(all.data.length).toBe(0);
    });
  });
});
