import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { TableTemplateService } from './table-template.service';
import type { TableTemplate } from '../../../shared/types/index.js';

describe('TableTemplateService', () => {
  let service: TableTemplateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TableTemplateService);
    // Очищаем внутреннее состояние между тестами
    (service as unknown as { templates: TableTemplate[] }).templates = [];
  });

  it('должен создать шаблон', async () => {
    const result = await firstValueFrom(service.createTemplate({
      name: 'Тестовый шаблон',
      columns: [
        { tableName: 'products', fieldName: 'name', label: 'Название', order: 0 },
      ],
    }));
    expect(result.success).toBe(true);
    expect(result.data.name).toBe('Тестовый шаблон');
    expect(result.data.columns.length).toBe(1);
    expect(result.data.id).toBeDefined();
  });

  it('должен вернуть список шаблонов', async () => {
    await firstValueFrom(service.createTemplate({
      name: 'Шаблон 1',
      columns: [],
    }));
    await firstValueFrom(service.createTemplate({
      name: 'Шаблон 2',
      columns: [],
    }));

    const result = await firstValueFrom(service.getTemplates());
    expect(result.success).toBe(true);
    expect(result.data.length).toBe(2);
  });

  it('должен получить шаблон по id', async () => {
    const created = await firstValueFrom(service.createTemplate({
      name: 'Найти меня',
      columns: [],
    }));

    const result = await firstValueFrom(service.getTemplate(created.data.id));
    expect(result.success).toBe(true);
    expect(result.data!.name).toBe('Найти меня');
  });

  it('должен обновить шаблон', async () => {
    const created = await firstValueFrom(service.createTemplate({
      name: 'До обновления',
      columns: [],
    }));

    const result = await firstValueFrom(service.updateTemplate(created.data.id, {
      name: 'После обновления',
    }));
    expect(result.success).toBe(true);
    expect(result.data.name).toBe('После обновления');
  });

  it('должен удалить шаблон', async () => {
    const created = await firstValueFrom(service.createTemplate({
      name: 'Удалить',
      columns: [],
    }));

    const deleteResult = await firstValueFrom(service.deleteTemplate(created.data.id));
    expect(deleteResult.success).toBe(true);

    const listResult = await firstValueFrom(service.getTemplates());
    expect(listResult.data.length).toBe(0);
  });

  it('должен клонировать шаблон', async () => {
    const original = await firstValueFrom(service.createTemplate({
      name: 'Оригинал',
      columns: [
        { tableName: 'products', fieldName: 'price', label: 'Цена', order: 0 },
      ],
    }));

    const cloneResult = await firstValueFrom(service.cloneTemplate(original.data.id));
    expect(cloneResult.success).toBe(true);
    expect(cloneResult.data.name).toBe('Оригинал (копия)');
    expect(cloneResult.data.columns.length).toBe(1);
    expect(cloneResult.data.id).not.toBe(original.data.id);
  });

  it('должен вернуть ошибку для несуществующего шаблона', async () => {
    const result = await firstValueFrom(service.getTemplate('nonexistent-id'));
    expect(result.success).toBe(false);
  });
});
