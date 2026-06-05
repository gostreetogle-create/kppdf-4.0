import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { TableRegistryService } from './table-registry.service';

describe('TableRegistryService', () => {
  let service: TableRegistryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TableRegistryService);
  });

  it('должен вернуть 4 таблицы', async () => {
    const tables = await firstValueFrom(service.getTables());
    expect(tables.length).toBe(4);
  });

  it('должен вернуть таблицу products с 12 полями', async () => {
    const table = await firstValueFrom(service.getTable('products'));
    expect(table).toBeDefined();
    expect(table!.name).toBe('products');
    expect(table!.label).toBe('Товары');
    expect(table!.fields.length).toBe(12);
  });

  it('должен вернуть поля таблицы clients', async () => {
    const fields = await firstValueFrom(service.getFields('clients'));
    expect(fields.length).toBe(9);
    expect(fields[0].name).toBe('lastName');
  });

  it('должен вернуть таблицу organizations с 16 полями', async () => {
    const table = await firstValueFrom(service.getTable('organizations'));
    expect(table).toBeDefined();
    expect(table!.name).toBe('organizations');
    expect(table!.label).toBe('Организации');
    expect(table!.fields.length).toBe(16);
  });

  it('должен вернуть таблицу suppliers с 8 полями', async () => {
    const table = await firstValueFrom(service.getTable('suppliers'));
    expect(table).toBeDefined();
    expect(table!.name).toBe('suppliers');
    expect(table!.label).toBe('Поставщики');
    expect(table!.fields.length).toBe(8);
  });

  it('должен вернуть undefined для несуществующей таблицы', async () => {
    const table = await firstValueFrom(service.getTable('nonexistent'));
    expect(table).toBeUndefined();
  });

  it('должен вернуть пустой массив полей для несуществующей таблицы', async () => {
    const fields = await firstValueFrom(service.getFields('nonexistent'));
    expect(fields).toEqual([]);
  });
});
