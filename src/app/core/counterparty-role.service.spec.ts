import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { CounterpartyRoleService } from './counterparty-role.service';

describe('CounterpartyRoleService', () => {
  let service: CounterpartyRoleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CounterpartyRoleService);
  });

  it('должен вернуть предустановленные роли (Поставщик, Покупатель)', async () => {
    const result = await firstValueFrom(service.getRoles());
    expect(result.success).toBe(true);
    expect(result.data.length).toBe(2);
    expect(result.data[0].name).toBe('Поставщик');
    expect(result.data[1].name).toBe('Покупатель');
  });

  it('должен получить роль по ID', async () => {
    const roles = await firstValueFrom(service.getRoles());
    const firstRole = roles.data[0];

    const result = await firstValueFrom(service.getRole(firstRole.id));
    expect(result.success).toBe(true);
    expect(result.data?.name).toBe(firstRole.name);
  });

  it('должен вернуть undefined для несуществующей роли', async () => {
    const result = await firstValueFrom(service.getRole('nonexistent-id'));
    expect(result.success).toBe(false);
    expect(result.data).toBeUndefined();
  });

  it('должен создать новую роль', async () => {
    const result = await firstValueFrom(service.createRole({
      name: 'Перевозчик',
      description: 'Организация, осуществляющая перевозку грузов',
      isActive: true,
    }));
    expect(result.success).toBe(true);
    expect(result.data.name).toBe('Перевозчик');
    expect(result.data.slug).toBe('перевозчик');
    expect(result.data.id).toBeDefined();
  });

  it('должен обновить роль', async () => {
    const roles = await firstValueFrom(service.getRoles());
    const firstRole = roles.data[0];

    const result = await firstValueFrom(service.updateRole(firstRole.id, {
      description: 'Обновлённое описание',
    }));
    expect(result.success).toBe(true);
    expect(result.data.description).toBe('Обновлённое описание');
  });

  it('должен удалить роль', async () => {
    const created = await firstValueFrom(service.createRole({
      name: 'Тестовая роль',
      description: 'Будет удалена',
      isActive: true,
    }));

    const deleteResult = await firstValueFrom(service.deleteRole(created.data.id));
    expect(deleteResult.success).toBe(true);

    const listResult = await firstValueFrom(service.getRoles());
    expect(listResult.data.length).toBe(2); // Только предустановленные
  });

  it('должен найти роль по slug', () => {
    const role = service.getRoleBySlug('supplier');
    expect(role).toBeDefined();
    expect(role?.name).toBe('Поставщик');
  });

  it('должен вернуть ID роли по slug', () => {
    const id = service.getRoleIdBySlug('buyer');
    expect(id).toBeDefined();
    expect(typeof id).toBe('string');
  });

  it('должен вернуть undefined для несуществующего slug', () => {
    const role = service.getRoleBySlug('nonexistent');
    expect(role).toBeUndefined();
  });
});
