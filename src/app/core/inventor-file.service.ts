import { Injectable } from '@angular/core';
import { BaseCrudService } from './crud-factory.js';
import type { InventorFile } from '../../../shared/types/index.js';

const SEED_CAD: InventorFile[] = [
  { id: 'cad-1', productId: 'prod-1', productName: 'Стойка БСФП-120', productSku: 'SP0001', fileName: 'BSFP120_Стойка.dwg', fileType: 'dwg', sizeKb: 3450, version: '2.5', author: 'Иванов И.И.', notes: 'Последняя ревизия от 2026-03-01', createdAt: '2026-01-15T10:00:00.000Z', updatedAt: '2026-03-01T10:00:00.000Z' },
  { id: 'cad-2', productId: 'prod-1', productName: 'Стойка БСФП-120', productSku: 'SP0001', fileName: 'BSFP120_Щит.idw', fileType: 'idw', sizeKb: 1200, author: 'Иванов И.И.', createdAt: '2026-01-20T10:00:00.000Z', updatedAt: '2026-01-20T10:00:00.000Z' },
  { id: 'cad-3', productId: 'prod-2', productName: 'Турник ТУ-2', productSku: 'SP0002', fileName: 'TU2_Сборка.step', fileType: 'step', sizeKb: 890, author: 'Петров П.С.', createdAt: '2026-04-05T10:00:00.000Z', updatedAt: '2026-04-05T10:00:00.000Z' },
  { id: 'cad-4', productId: 'prod-3', productName: 'Скамейка СК-180', productSku: 'MF0001', fileName: 'SK180_Каркас.dwg', fileType: 'dwg', sizeKb: 2200, version: '1.2', author: 'Сидоров А.В.', createdAt: '2026-03-10T10:00:00.000Z', updatedAt: '2026-05-15T10:00:00.000Z' },
];

@Injectable({ providedIn: 'root' })
export class InventorFileService extends BaseCrudService<InventorFile> {
  constructor() { super(); this.items = SEED_CAD.map(f => ({ ...f })); }
}
