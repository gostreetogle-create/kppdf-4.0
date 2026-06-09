import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { WarehouseService } from './warehouse.service';
import { API_URL } from './api-url.token';
import type { Warehouse } from '../../../shared/types/index.js';

const MOCK_WH: Warehouse = {
  id: 'wh-1', name: 'Основной склад', address: 'ул. Заводская, 15',
  zoneNames: ['Зона А'], roleIds: ['role-1'], isActive: true,
  createdAt: '2026-06-01T00:00:00.000Z', updatedAt: '2026-06-01T00:00:00.000Z',
};

function flushGet(httpMock: HttpTestingController, data: Warehouse[]) {
  httpMock.expectOne('/api/v1/warehouses').flush({ success: true, data });
}

describe('WarehouseService', () => {
  let service: WarehouseService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), { provide: API_URL, useValue: '/api/v1' }],
    });
    service = TestBed.inject(WarehouseService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => { httpMock.verify(); TestBed.resetTestingModule(); });

  it('getWarehouses возвращает пустой массив', async () => {
    const p = firstValueFrom(service.getWarehouses());
    flushGet(httpMock, []);
    expect((await p).data).toEqual([]);
  });

  it('createWarehouse создаёт через POST', async () => {
    const p = firstValueFrom(service.createWarehouse({ name: 'Тестовый', zoneNames: ['A'], roleIds: ['r1'], isActive: true }));
    const req = httpMock.expectOne('/api/v1/warehouses');
    expect(req.request.method).toBe('POST');
    req.flush({ success: true, data: MOCK_WH });
    expect((await p).data!.name).toBe('Основной склад');
  });

  it('getWarehouse возвращает по id', async () => {
    const p = firstValueFrom(service.getWarehouse('wh-1'));
    httpMock.expectOne('/api/v1/warehouses/wh-1').flush({ success: true, data: MOCK_WH });
    expect((await p).data!.id).toBe('wh-1');
  });

  it('getWarehousesByRole фильтрует по роли (async)', async () => {
    const p = service.getWarehousesByRole('role-1');
    flushGet(httpMock, [
      { ...MOCK_WH, id: 'wh-1', name: 'Склад А', roleIds: ['role-1'] },
      { ...MOCK_WH, id: 'wh-2', name: 'Склад Б', roleIds: ['role-admin'] },
    ]);
    const result = await p;
    expect(result.length).toBe(1);
    expect(result[0].name).toBe('Склад А');
  });

  it('updateWarehouse обновляет через PUT', async () => {
    const p = firstValueFrom(service.updateWarehouse('wh-1', { name: 'Новое' }));
    const req = httpMock.expectOne('/api/v1/warehouses/wh-1');
    expect(req.request.method).toBe('PUT');
    req.flush({ success: true, data: { ...MOCK_WH, name: 'Новое' } });
    expect((await p).data!.name).toBe('Новое');
  });

  it('deleteWarehouse удаляет через DELETE', async () => {
    const p = firstValueFrom(service.deleteWarehouse('wh-1'));
    httpMock.expectOne('/api/v1/warehouses/wh-1').flush({ success: true, data: null });
    expect((await p).success).toBe(true);
  });
});
