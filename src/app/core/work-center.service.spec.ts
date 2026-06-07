import { describe, it, expect, beforeEach } from 'vitest';
import { WorkCenterService } from './work-center.service';
import { firstValueFrom } from 'rxjs';

describe('WorkCenterService', () => {
  let svc: WorkCenterService;
  beforeEach(() => { svc = new WorkCenterService(); svc['items'] = []; });
  it('содержит seed-данные', () => { expect(new WorkCenterService()['items'].length).toBe(6); });
  it('crud: создаёт', async () => {
    const r = await firstValueFrom(svc.create({ name: 'C', type: 'T', isActive: true }));
    expect(r.success).toBe(true);
    expect(r.data.name).toBe('C');
  });
});
