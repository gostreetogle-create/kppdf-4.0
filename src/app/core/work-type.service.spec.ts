import { describe, it, expect, beforeEach } from 'vitest';
import { WorkTypeService } from './work-type.service';
import { firstValueFrom } from 'rxjs';

describe('WorkTypeService', () => {
  let svc: WorkTypeService;
  beforeEach(() => { svc = new WorkTypeService(); svc['items'] = []; });
  it('содержит seed-данные', () => { expect(new WorkTypeService()['items'].length).toBe(9); });
  it('crud: создаёт и возвращает', async () => {
    const r = await firstValueFrom(svc.create({ name: 'Test', department: 'D', defaultDurationHours: 1, isActive: true }));
    expect(r.success).toBe(true);
    expect(r.data.name).toBe('Test');
  });
  it('crud: удаляет', async () => {
    const r = await firstValueFrom(svc.create({ name: 'X', department: 'D', defaultDurationHours: 1, isActive: true }));
    await firstValueFrom(svc.delete(r.data.id));
    const all = await firstValueFrom(svc.getAll());
    expect(all.data.length).toBe(0);
  });
});
