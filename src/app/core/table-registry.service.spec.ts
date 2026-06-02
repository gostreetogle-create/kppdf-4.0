import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { TableRegistryService } from './table-registry.service';

describe('TableRegistryService', () => {
  let service: TableRegistryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TableRegistryService);
  });

  it('должен вернуть 2 таблицы', async () => {
    const tables = await firstValueFrom(service.getTables());
    expect(tables.length).toBe(2);
  });

  it('должен вернуть таблицу products с 7 полями', async () => {
    const table = await firstValueFrom(service.getTable('products'));
    expect(table).toBeDefined();
    expect(table!.name).toBe('products');
    expect(table!.label).toBe('Товары');
    expect(table!.fields.length).toBe(7);
  });

  it('должен вернуть поля таблицы clients', async () => {
    const fields = await firstValueFrom(service.getFields('clients'));
    expect(fields.length).toBe(8);
    expect(fields[0].name).toBe('name');
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
