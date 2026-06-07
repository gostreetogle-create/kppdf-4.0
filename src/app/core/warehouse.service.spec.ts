import { describe, it, expect, beforeEach } from 'vitest';
import { WarehouseService } from './warehouse.service';
import { firstValueFrom } from 'rxjs';
import type { Warehouse } from '../../../shared/types/index.js';

describe('WarehouseService', () => {
  let service: WarehouseService;

  beforeEach(() => {
    service = new WarehouseService();
    service['items'] = [];
  });

  function makeWh(overrides?: Partial<Warehouse>): Warehouse {
    return {
      id: 'wh-1',
      name: 'Основной склад',
      address: 'ул. Заводская, 15',
      zoneNames: ['Трубный', 'Листовой'],
      roleIds: ['role-1'],
      isActive: true,
      createdAt: '2026-06-07T00:00:00.000Z',
      updatedAt: '2026-06-07T00:00:00.000Z',
      ...overrides,
    };
  }

  describe('createWarehouse', () => {
    it('создаёт склад с авто-id и датами', async () => {
      const res = await firstValueFrom(service.createWarehouse({
        name: 'Тестовый склад',
        zoneNames: ['Зона А'],
        roleIds: ['role-1'],
        isActive: true,
      }));

      expect(res.success).toBe(true);
      expect(res.data!.id).toBeTruthy();
      expect(res.data!.name).toBe('Тестовый склад');
      expect(res.data!.zoneNames).toEqual(['Зона А']);
      expect(res.data!.roleIds).toEqual(['role-1']);
      expect(res.data!.createdAt).toBeTruthy();
      expect(res.data!.updatedAt).toBeTruthy();
    });

    it('создаёт склад с адресом', async () => {
      const res = await firstValueFrom(service.createWarehouse({
        name: 'Склад с адресом',
        address: 'ул. Ленина, 1',
        zoneNames: [],
        roleIds: [],
        isActive: true,
      }));

      expect(res.data!.address).toBe('ул. Ленина, 1');
    });
  });

  describe('getWarehouses', () => {
    it('возвращает пустой массив при инициализации', async () => {
      const res = await firstValueFrom(service.getWarehouses());
      expect(res.success).toBe(true);
      expect(res.data).toEqual([]);
    });

    it('возвращает все склады после создания', async () => {
      await firstValueFrom(service.createWarehouse({ name: 'Склад 1', zoneNames: [], roleIds: [], isActive: true }));
      await firstValueFrom(service.createWarehouse({ name: 'Склад 2', zoneNames: [], roleIds: [], isActive: true }));

      const res = await firstValueFrom(service.getWarehouses());
      expect(res.data.length).toBe(2);
    });
  });

  describe('getWarehouse', () => {
    it('возвращает склад по id', async () => {
      const createRes = await firstValueFrom(service.createWarehouse({ name: 'Склад', zoneNames: [], roleIds: [], isActive: true }));
      const res = await firstValueFrom(service.getWarehouse(createRes.data!.id));

      expect(res.success).toBe(true);
      expect(res.data!.name).toBe('Склад');
    });

    it('возвращает undefined для несуществующего id', async () => {
      const res = await firstValueFrom(service.getWarehouse('nonexistent'));
      expect(res.success).toBe(false);
      expect(res.data).toBeUndefined();
    });
  });

  describe('getWarehousesByRole', () => {
    it('фильтрует склады по роли', async () => {
      await firstValueFrom(service.createWarehouse({ name: 'Склад А', zoneNames: [], roleIds: ['role-admin', 'role-wh1'], isActive: true }));
      await firstValueFrom(service.createWarehouse({ name: 'Склад Б', zoneNames: [], roleIds: ['role-admin'], isActive: true }));

      const filtered = service.getWarehousesByRole('role-wh1');
      expect(filtered.length).toBe(1);
      expect(filtered[0].name).toBe('Склад А');
    });

    it('не возвращает неактивные склады', async () => {
      await firstValueFrom(service.createWarehouse({ name: 'Активный', zoneNames: [], roleIds: ['role-1'], isActive: true }));
      await firstValueFrom(service.createWarehouse({ name: 'Неактивный', zoneNames: [], roleIds: ['role-1'], isActive: false }));

      const filtered = service.getWarehousesByRole('role-1');
      expect(filtered.length).toBe(1);
      expect(filtered[0].name).toBe('Активный');
    });

    it('возвращает склады без ролей (пустые roleIds)', async () => {
      await firstValueFrom(service.createWarehouse({ name: 'Открытый склад', zoneNames: [], roleIds: [], isActive: true }));

      const filtered = service.getWarehousesByRole('any-role');
      expect(filtered.length).toBe(1);
    });
  });

  describe('updateWarehouse', () => {
    it('обновляет поля склада', async () => {
      const createRes = await firstValueFrom(service.createWarehouse({ name: 'Старое имя', address: 'Старый адрес', zoneNames: ['Старая'], roleIds: [], isActive: true }));
      const id = createRes.data!.id;

      const res = await firstValueFrom(service.updateWarehouse(id, { name: 'Новое имя', zoneNames: ['Новая'] }));
      expect(res.success).toBe(true);
      expect(res.data!.name).toBe('Новое имя');
      expect(res.data!.zoneNames).toEqual(['Новая']);
      expect(res.data!.address).toBe('Старый адрес');
    });
  });

  describe('deleteWarehouse', () => {
    it('удаляет склад', async () => {
      const createRes = await firstValueFrom(service.createWarehouse({ name: 'На удаление', zoneNames: [], roleIds: [], isActive: true }));
      const res = await firstValueFrom(service.deleteWarehouse(createRes.data!.id));
      expect(res.success).toBe(true);

      const all = await firstValueFrom(service.getWarehouses());
      expect(all.data.length).toBe(0);
    });
  });
});
