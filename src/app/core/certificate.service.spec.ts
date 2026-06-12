import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { CertificateService } from './certificate.service';
import { API_URL } from './api-url.token';
import type { Certificate } from '../../../shared/types/index.js';

const MOCK_CERT: Certificate = {
  id: 'cert-1', productIds: ['prod-1'], productNames: 'Товар',
  number: 'ЕАЭС RU С-RU.АД07.В.01234/26', certType: 'certificate', status: 'valid',
  issuedBy: 'Орган', issueDate: '2026-01-20', expiryDate: '2028-01-20',
  createdAt: '2026-01-20T10:00:00.000Z', updatedAt: '2026-01-20T10:00:00.000Z',
};

describe('CertificateService', () => {
  let service: CertificateService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), { provide: API_URL, useValue: '/api/v1' }],
    });
    service = TestBed.inject(CertificateService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => { httpMock.verify(); });

  it('getAll возвращает список через GET', async () => {
    const p = firstValueFrom(service.getAll());
    httpMock.expectOne('/api/v1/certificates').flush({ success: true, data: [MOCK_CERT] });
    const res = await p;
    expect(res.data!.length).toBe(1);
    expect(res.data![0].number).toContain('ЕАЭС');
  });

  it('create создаёт через POST', async () => {
    const p = firstValueFrom(service.create({
      productIds: ['p1'], productNames: 'Новый', number: 'С-001',
      certType: 'declaration', status: 'valid',
    }));
    httpMock.expectOne('/api/v1/certificates').flush({ success: true, data: { ...MOCK_CERT, number: 'С-001' } });
    const res = await p;
    expect(res.data!.number).toBe('С-001');
  });

  it('delete удаляет через DELETE', async () => {
    const p = firstValueFrom(service.delete('cert-1'));
    httpMock.expectOne('/api/v1/certificates/cert-1').flush({ success: true, data: null });
    const res = await p;
    expect(res.success).toBe(true);
  });
});
