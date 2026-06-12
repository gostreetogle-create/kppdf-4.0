import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { RoleService } from './role.service';
import { API_URL } from './api-url.token';
import type { RoleDef } from '../../../shared/types/index.js';

const MOCK_ROLE: RoleDef = {
  id: 'role-1', name: 'Администратор', description: 'Полный доступ',
  sectionIds: ['sales', 'production', 'warehouse', 'finance', 'references', 'admin'],
  isActive: true, createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z',
};

describe('RoleService', () => {
  let service: RoleService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), { provide: API_URL, useValue: '/api/v1' }],
    });
    service = TestBed.inject(RoleService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => { httpMock.verify(); });

  it('getAll возвращает список через GET', async () => {
    const p = firstValueFrom(service.getAll());
    httpMock.expectOne('/api/v1/roles').flush({ success: true, data: [MOCK_ROLE] });
    const res = await p;
    expect(res.data!.length).toBe(1);
    expect(res.data![0].name).toBe('Администратор');
  });

  it('create создаёт через POST', async () => {
    const p = firstValueFrom(service.create({ name: 'Тест', sectionIds: ['sales'], isActive: true }));
    httpMock.expectOne('/api/v1/roles').flush({ success: true, data: { ...MOCK_ROLE, name: 'Тест' } });
    const res = await p;
    expect(res.data!.name).toBe('Тест');
  });
});
