import { describe, it, expect, beforeEach } from 'vitest';
import { StatusWorkflowService } from './status-workflow.service';
import { firstValueFrom } from 'rxjs';

describe('StatusWorkflowService', () => {
  let svc: StatusWorkflowService;
  beforeEach(() => { svc = new StatusWorkflowService(); svc['items'] = []; });

  it('содержит seed-данные при создании', () => {
    const s = new StatusWorkflowService();
    expect(s['items'].length).toBe(3);
    expect(s['items'][0].entityType).toBe('proposal');
  });

  it('CRUD: создание и чтение', async () => {
    const r = await firstValueFrom(svc.create({ entityType: 'test', name: 'Тест', statuses: ['a', 'b'], transitions: [] }));
    expect(r.data.name).toBe('Тест');
    expect(svc['items'].length).toBe(1);
  });
});
