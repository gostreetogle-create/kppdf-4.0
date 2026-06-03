import { describe, it, expect, beforeEach } from 'vitest';
import { DocumentTemplateService } from './document-template.service';
import { firstValueFrom } from 'rxjs';

describe('DocumentTemplateService', () => {
  let service: DocumentTemplateService;

  beforeEach(() => {
    service = new DocumentTemplateService();
  });

  it('создаётся', () => {
    expect(service).toBeTruthy();
  });

  it('getTemplates — возвращает мок-данные (2 шаблона)', async () => {
    const res = await firstValueFrom(service.getTemplates());
    expect(res.success).toBe(true);
    expect(res.data.length).toBe(2);
    expect(res.data[0].name).toBe('Коммерческое предложение');
    expect(res.data[1].name).toBe('Договор поставки');
  });

  it('getTemplate — возвращает шаблон по id', async () => {
    const res = await firstValueFrom(service.getTemplate('mock-quotation-001'));
    expect(res.success).toBe(true);
    expect(res.data?.name).toBe('Коммерческое предложение');
    expect(res.data?.blocks.length).toBe(5);
  });

  it('getTemplate — возвращает undefined для несуществующего id', async () => {
    const res = await firstValueFrom(service.getTemplate('nonexistent'));
    expect(res.success).toBe(false);
    expect(res.data).toBeUndefined();
  });

  it('createTemplate — создаёт новый шаблон', async () => {
    const res = await firstValueFrom(service.createTemplate({
      name: 'Новый шаблон',
      docType: 'invoice',
      blocks: [],
    }));
    expect(res.success).toBe(true);
    expect(res.data.name).toBe('Новый шаблон');
    expect(res.data.docType).toBe('invoice');
    expect(res.data.id).toBeTruthy();
    expect(res.data.createdAt).toBeTruthy();

    // Проверяем что шаблон появился в списке
    const list = await firstValueFrom(service.getTemplates());
    expect(list.data.length).toBe(3);
  });

  it('updateTemplate — обновляет существующий шаблон', async () => {
    const res = await firstValueFrom(service.updateTemplate('mock-quotation-001', {
      name: 'Обновлённое КП',
    }));
    expect(res.success).toBe(true);
    expect(res.data.name).toBe('Обновлённое КП');

    // Проверяем что changes сохранились
    const check = await firstValueFrom(service.getTemplate('mock-quotation-001'));
    expect(check.data?.name).toBe('Обновлённое КП');
  });

  it('updateTemplate — возвращает ошибку для несуществующего id', async () => {
    const res = await firstValueFrom(service.updateTemplate('nonexistent', { name: 'Test' }));
    expect(res.success).toBe(false);
    expect(res.message).toBe('Шаблон не найден');
  });

  it('deleteTemplate — удаляет шаблон', async () => {
    const res = await firstValueFrom(service.deleteTemplate('mock-contract-001'));
    expect(res.success).toBe(true);

    const list = await firstValueFrom(service.getTemplates());
    expect(list.data.length).toBe(1);
    expect(list.data[0].name).toBe('Коммерческое предложение');
  });

  it('deleteTemplate — возвращает ошибку для несуществующего id', async () => {
    const res = await firstValueFrom(service.deleteTemplate('nonexistent'));
    expect(res.success).toBe(false);
    expect(res.message).toBe('Шаблон не найден');
  });

  it('cloneTemplate — клонирует шаблон с суффиксом (копия)', async () => {
    const res = await firstValueFrom(service.cloneTemplate('mock-quotation-001'));
    expect(res.success).toBe(true);
    expect(res.data.name).toBe('Коммерческое предложение (копия)');
    expect(res.data.id).not.toBe('mock-quotation-001');
    expect(res.data.blocks.length).toBe(5);
    expect(res.data.docType).toBe('quotation');

    const list = await firstValueFrom(service.getTemplates());
    expect(list.data.length).toBe(3);
  });

  it('cloneTemplate — возвращает ошибку для несуществующего id', async () => {
    const res = await firstValueFrom(service.cloneTemplate('nonexistent'));
    expect(res.success).toBe(false);
    expect(res.message).toBe('Шаблон не найден');
  });
});
