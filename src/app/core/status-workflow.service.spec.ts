import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { StatusWorkflowService } from './status-workflow.service';
import { API_URL } from './api-url.token';
import type { StatusWorkflow } from '../../../shared/types/index.js';

const MOCK_WF: StatusWorkflow = {
  id: 'wf-1', entityType: 'proposal', name: 'КП',
  statuses: ['draft', 'sent', 'approved', 'rejected'],
  transitions: [{ from: 'draft', to: 'sent', label: 'Отправить', allowedRoleIds: ['sales-manager'] }],
  createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z',
};

describe('StatusWorkflowService', () => {
  let service: StatusWorkflowService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), { provide: API_URL, useValue: '/api/v1' }],
    });
    service = TestBed.inject(StatusWorkflowService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => { httpMock.verify(); });

  it('getAll возвращает список через GET', async () => {
    const p = firstValueFrom(service.getAll());
    httpMock.expectOne('/api/v1/status-workflows').flush({ success: true, data: [MOCK_WF] });
    const res = await p;
    expect(res.data!.length).toBe(1);
    expect(res.data![0].entityType).toBe('proposal');
  });

  it('create создаёт через POST', async () => {
    const p = firstValueFrom(service.create({
      entityType: 'test', name: 'Тест', statuses: ['a', 'b'], transitions: [],
    }));
    httpMock.expectOne('/api/v1/status-workflows').flush({ success: true, data: { ...MOCK_WF, name: 'Тест' } });
    const res = await p;
    expect(res.data!.name).toBe('Тест');
  });
});
