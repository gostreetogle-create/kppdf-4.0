import { describe, it, expect, beforeEach } from 'vitest';
import { WorkerService } from './worker.service';
import { firstValueFrom } from 'rxjs';

describe('WorkerService', () => {
  let svc: WorkerService;
  beforeEach(() => { svc = new WorkerService(); svc['items'] = []; });
  it('содержит seed-данные', () => { expect(new WorkerService()['items'].length).toBe(5); });
  it('crud: создаёт', async () => {
    const r = await firstValueFrom(svc.create({ lastName: 'Т', firstName: 'Т', grade: 1, ratePerHour: 100, workTypeIds: [], isActive: true }));
    expect(r.success).toBe(true);
  });
});
