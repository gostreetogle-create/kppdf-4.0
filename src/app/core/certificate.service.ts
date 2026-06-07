import { Injectable } from '@angular/core';
import { BaseCrudService } from './crud-factory.js';
import type { Certificate } from '../../../shared/types/index.js';

const SEED_CERTS: Certificate[] = [
  { id: 'cert-1', productIds: ['prod-1'], productNames: 'Стойка баскетбольная БСФП-120', number: 'ЕАЭС RU С-RU.АД07.В.01234/26', certType: 'certificate', status: 'valid', issuedBy: 'Орган по сертификации «ЮгТест»', issueDate: '2026-01-20', expiryDate: '2028-01-20', notes: 'Соответствие ТР ЕАЭС 042/2017', createdAt: '2026-01-20T10:00:00.000Z', updatedAt: '2026-01-20T10:00:00.000Z' },
  { id: 'cert-2', productIds: ['prod-2', 'prod-3'], productNames: 'Турник ТУ-2 / Скамейка СК-180', number: 'ЕАЭС RU Д-RU.АД07.В.05678/26', certType: 'declaration', status: 'expiring', issuedBy: 'Испытательная лаборатория «СпортБезопасность»', issueDate: '2026-02-10', expiryDate: '2026-08-10', createdAt: '2026-02-10T10:00:00.000Z', updatedAt: '2026-02-10T10:00:00.000Z' },
  { id: 'cert-3', productIds: ['prod-7'], productNames: 'Калитка К-1000', number: 'ЕАЭС RU С-RU.АД07.В.09123/25', certType: 'certificate', status: 'expired', issueDate: '2023-05-10', expiryDate: '2026-05-10', createdAt: '2023-05-10T10:00:00.000Z', updatedAt: '2026-05-10T10:00:00.000Z' },
];

@Injectable({ providedIn: 'root' })
export class CertificateService extends BaseCrudService<Certificate> {
  constructor() { super(); this.items = SEED_CERTS.map(c => ({ ...c, productIds: [...c.productIds] })); }
}
