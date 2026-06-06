import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { TableRegistryService } from './table-registry.service';

describe('TableRegistryService', () => {
  let service: TableRegistryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TableRegistryService);
  });

  it('должен вернуть 5 таблиц', async () => {
    const tables = await firstValueFrom(service.getTables());
    expect(tables.length).toBe(5);
  });

  it('должен вернуть таблицу counterparties с 19 полями', async () => {
    const table = await firstValueFrom(service.getTable('counterparties'));
    expect(table).toBeDefined();
    expect(table!.name).toBe('counterparties');
    expect(table!.label).toBe('Контрагенты');
    expect(table!.fields.length).toBe(19);
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

  it('должен вернуть таблицу organizations с 19 полями', async () => {
    const table = await firstValueFrom(service.getTable('organizations'));
    expect(table).toBeDefined();
    expect(table!.name).toBe('organizations');
    expect(table!.label).toBe('Контрагенты');
    expect(table!.fields.length).toBe(19);
  });

  it('должен вернуть таблицу counterparty-role-types с 4 полями', async () => {
    const table = await firstValueFrom(service.getTable('counterparty-role-types'));
    expect(table).toBeDefined();
    expect(table!.name).toBe('counterparty-role-types');
    expect(table!.label).toBe('Виды контрагентов');
    expect(table!.fields.length).toBe(4);
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
