import { describe, it, expect, beforeEach } from 'vitest';
import { CertificateService } from './certificate.service';
import { firstValueFrom } from 'rxjs';

describe('CertificateService', () => {
  let svc: CertificateService;
  beforeEach(() => { svc = new CertificateService(); svc['items'] = []; });

  it('содержит seed-данные при создании', () => {
    const s = new CertificateService();
    expect(s['items'].length).toBe(3);
  });

  it('CRUD: создание и чтение', async () => {
    const r = await firstValueFrom(svc.create({ productIds: ['p1'], productNames: 'Товар', number: 'С-001', certType: 'declaration', status: 'valid' }));
    expect(r.data.number).toBe('С-001');
    expect(svc['items'].length).toBe(1);
  });
});
