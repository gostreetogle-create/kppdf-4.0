import { describe, it, expect, beforeEach } from 'vitest';
import { RoleService } from './role.service';
import { firstValueFrom } from 'rxjs';

describe('RoleService', () => {
  let svc: RoleService;
  beforeEach(() => { svc = new RoleService(); svc['items'] = []; });

  it('содержит seed-данные при создании', () => {
    const s = new RoleService();
    expect(s['items'].length).toBe(8);
    expect(s['items'][0].name).toBe('Администратор');
  });

  it('CRUD: создание и чтение', async () => {
    const r = await firstValueFrom(svc.create({ name: 'Тест', sectionIds: ['sales'], isActive: true }));
    expect(r.data.name).toBe('Тест');
    expect(svc['items'].length).toBe(1);
  });
});
