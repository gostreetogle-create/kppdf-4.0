import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { CounterpartyRoleService } from './counterparty-role.service';
import { API_URL } from './api-url.token';

const SEED_ROLES = [
  { id: 'role-1', name: 'Поставщик', slug: 'supplier', description: 'Поставщик товаров', isActive: true, createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z' },
  { id: 'role-2', name: 'Покупатель', slug: 'buyer', description: 'Покупатель товаров', isActive: true, createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z' },
];

describe('CounterpartyRoleService', () => {
  let service: CounterpartyRoleService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: API_URL, useValue: '/api/v1' },
      ],
    });
    service = TestBed.inject(CounterpartyRoleService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    TestBed.resetTestingModule();
  });

  it('должен вернуть предустановленные роли (Поставщик, Покупатель)', async () => {
    const promise = firstValueFrom(service.getRoles());
    const req = httpMock.expectOne('/api/v1/counterparty-roles');
    req.flush({ success: true, data: SEED_ROLES });
    const result = await promise;
    expect(result.success).toBe(true);
    expect(result.data.length).toBe(2);
    expect(result.data[0].name).toBe('Поставщик');
    expect(result.data[1].name).toBe('Покупатель');
  });

  it('должен получить роль по ID', async () => {
    const promise = firstValueFrom(service.getRole('role-1'));
    const req = httpMock.expectOne('/api/v1/counterparty-roles/role-1');
    req.flush({ success: true, data: SEED_ROLES[0] });
    const result = await promise;
    expect(result.success).toBe(true);
    expect(result.data?.name).toBe('Поставщик');
  });

  it('должен вернуть undefined для несуществующей роли', async () => {
    const promise = firstValueFrom(service.getRole('nonexistent-id'));
    httpMock.expectOne('/api/v1/counterparty-roles/nonexistent-id').flush({ success: false, data: undefined });
    const result = await promise;
    expect(result.success).toBe(false);
    expect(result.data).toBeUndefined();
  });

  it('должен создать новую роль', async () => {
    const promise = firstValueFrom(service.createRole({
      name: 'Перевозчик',
      description: 'Организация, осуществляющая перевозку грузов',
      isActive: true,
    }));
    const req = httpMock.expectOne('/api/v1/counterparty-roles');
    expect(req.request.method).toBe('POST');
    req.flush({ success: true, data: { id: 'role-3', name: 'Перевозчик', slug: 'перевозчик', description: 'Организация, осуществляющая перевозку грузов', isActive: true, createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z' } });
    const result = await promise;
    expect(result.success).toBe(true);
    expect(result.data.name).toBe('Перевозчик');
    expect(result.data.slug).toBe('перевозчик');
    expect(result.data.id).toBeDefined();
  });

  it('должен обновить роль', async () => {
    const promise = firstValueFrom(service.updateRole('role-1', { description: 'Обновлённое описание' }));
    const req = httpMock.expectOne('/api/v1/counterparty-roles/role-1');
    expect(req.request.method).toBe('PUT');
    req.flush({ success: true, data: { ...SEED_ROLES[0], description: 'Обновлённое описание' } });
    const result = await promise;
    expect(result.success).toBe(true);
    expect(result.data.description).toBe('Обновлённое описание');
  });

  it('должен удалить роль', async () => {
    // create → delete → list
    const createPromise = firstValueFrom(service.createRole({ name: 'Тестовая роль', description: 'Будет удалена', isActive: true }));
    const createReq = httpMock.expectOne('/api/v1/counterparty-roles');
    createReq.flush({ success: true, data: { id: 'role-tmp', name: 'Тестовая роль', slug: 'тестовая-роль', description: 'Будет удалена', isActive: true, createdAt: '', updatedAt: '' } });
    const created = await createPromise;

    const delPromise = firstValueFrom(service.deleteRole(created.data.id));
    const delReq = httpMock.expectOne(`/api/v1/counterparty-roles/${created.data.id}`);
    delReq.flush({ success: true, data: null });
    await delPromise;

    const listPromise = firstValueFrom(service.getRoles());
    const listReq = httpMock.expectOne('/api/v1/counterparty-roles');
    listReq.flush({ success: true, data: SEED_ROLES });
    const listResult = await listPromise;
    expect(listResult.data.length).toBe(2);
  });

  it('должен найти роль по slug', async () => {
    service.getRoleBySlug('supplier'); // триггерит HTTP
    const apiReq = httpMock.expectOne('/api/v1/counterparty-roles');
    apiReq.flush({ success: true, data: SEED_ROLES });
    await new Promise(r => setTimeout(r, 50));
    const role = service.getRoleBySlug('supplier');
    expect(role).toBeDefined();
    expect(role?.name).toBe('Поставщик');
  });

  it('должен вернуть ID роли по slug', async () => {
    service.getRoleIdBySlug('buyer'); // триггерит HTTP
    const apiReq = httpMock.expectOne('/api/v1/counterparty-roles');
    apiReq.flush({ success: true, data: SEED_ROLES });
    await new Promise(r => setTimeout(r, 50));
    const id = service.getRoleIdBySlug('buyer');
    expect(id).toBeDefined();
    expect(typeof id).toBe('string');
  });

  it('должен вернуть undefined для несуществующего slug', async () => {
    service.getRoleBySlug('nonexistent'); // триггерит HTTP
    const apiReq = httpMock.expectOne('/api/v1/counterparty-roles');
    apiReq.flush({ success: true, data: SEED_ROLES });
    await new Promise(r => setTimeout(r, 50));
    const role = service.getRoleBySlug('nonexistent');
    expect(role).toBeUndefined();
  });
});
