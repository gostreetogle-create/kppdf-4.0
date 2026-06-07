import { describe, it, expect, beforeEach } from 'vitest';
import { InventorFileService } from './inventor-file.service';
import { firstValueFrom } from 'rxjs';

describe('InventorFileService', () => {
  let svc: InventorFileService;
  beforeEach(() => { svc = new InventorFileService(); svc['items'] = []; });

  it('содержит seed-данные при создании', () => {
    const s = new InventorFileService();
    expect(s['items'].length).toBe(4);
  });

  it('CRUD: создание и чтение', async () => {
    const r = await firstValueFrom(svc.create({ productId: 'p1', productName: 'Товар', productSku: 'SKU', fileName: 'file.dwg', fileType: 'dwg' }));
    expect(r.data.fileName).toBe('file.dwg');
    expect(svc['items'].length).toBe(1);
  });
});
