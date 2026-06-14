import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { ProposalDocBuilderService } from './proposal-doc-builder.service';
import type { ProposalItem, Organization, Client, DocumentTemplate, CartItem } from '../../../shared/types/index.js';

function makeOrg(overrides?: Partial<Organization>): Organization {
  return {
    id: 'org-1', name: 'ООО СпортИН-ЮГ', shortName: 'СпортИН-ЮГ', fullName: 'ООО СпортИН-ЮГ',
    inn: '1234567890', kpp: '123456789', ogrn: '1234567890123',
    legalAddress: '', actualAddress: '',
    counterpartyRoleIds: [], isActive: true,
    vatRate: 20,
    createdAt: '', updatedAt: '',
    ...overrides,
  };
}

function makeClient(overrides?: Partial<Client>): Client {
  return {
    id: 'cli-1', lastName: 'Иванов', firstName: 'Иван',
    phone: '+79000000001', isActive: true,
    createdAt: '', updatedAt: '',
    ...overrides,
  };
}

function makeTemplate(overrides?: Partial<DocumentTemplate>): DocumentTemplate {
  return {
    id: 'tmpl-1',
    name: 'Шаблон КП',
    docType: 'quotation',
    blocks: [
      { id: 'b1', type: 'text', order: 0, title: 'Заголовок', content: 'КП от {{date}}' },
      { id: 'b2', type: 'table', order: 1, title: 'Товары', tableTemplateId: 'tt-1' },
    ],
    isDefault: false,
    backgroundImages: ['bg.png'],
    backgroundOpacity: 0.5,
    createdAt: '', updatedAt: '',
    ...overrides,
  };
}

function makeProposalItem(overrides?: Partial<ProposalItem>): ProposalItem {
  return {
    id: 'pi-1', sourceProductId: 'prod-1',
    productSku: 'SP0001', productName: 'Стойка', productUnit: 'шт',
    quantity: 2, unitPrice: 85000, markupPercent: 5, total: 178500,
    ...overrides,
  };
}

function makeCartItem(overrides?: Partial<CartItem>): CartItem {
  return {
    id: 'ci-1', productId: 'prod-1',
    sku: 'SP0001', name: 'Стойка', unit: 'шт',
    quantity: 2, price: 85000, markupPercent: 5,
    ...overrides,
  };
}

const DEFAULTS = {
  discountPercent: 0, discountAmount: 0,
  vatRate: 0, vatAmount: 0,
  clientMarkup: 0, itemType: 'proposal' as const,
  organizationId: '' as string, organizations: [] as Organization[],
  clientId: '' as string, clients: [] as Client[],
};

describe('ProposalDocBuilderService', () => {
  let service: ProposalDocBuilderService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [ProposalDocBuilderService] });
    service = TestBed.inject(ProposalDocBuilderService);
  });

  // ─────── Расчёты ───────

  describe('calculateTotal', () => {
    it('суммирует позиции', () => {
      expect(service.calculateTotal([{ total: 100 }, { total: 200 }])).toBe(300);
    });
    it('возвращает 0 для пустого массива', () => {
      expect(service.calculateTotal([])).toBe(0);
    });
  });

  describe('getClientMarkup', () => {
    it('возвращает 0 если клиент не выбран', () => {
      expect(service.getClientMarkup('', [makeClient()])).toBe(0);
    });
    it('возвращает personalMarkupPercent клиента', () => {
      const client = makeClient({ personalMarkupPercent: 10 });
      expect(service.getClientMarkup('cli-1', [client])).toBe(10);
    });
    it('возвращает 0 если у клиента нет наценки', () => {
      expect(service.getClientMarkup('cli-1', [makeClient()])).toBe(0);
    });
  });

  describe('getVatRate', () => {
    it('возвращает 20 по умолчанию', () => {
      expect(service.getVatRate('', [])).toBe(20);
    });
    it('возвращает vatRate организации', () => {
      expect(service.getVatRate('org-1', [makeOrg({ vatRate: 10 })])).toBe(10);
    });
  });

  describe('calculateDiscount', () => {
    it('считает скидку', () => {
      expect(service.calculateDiscount(100000, 10)).toBe(10000);
    });
    it('возвращает 0 при нулевой скидке', () => {
      expect(service.calculateDiscount(100000, 0)).toBe(0);
    });
  });

  describe('calculateGrandTotal', () => {
    it('вычитает скидку', () => {
      expect(service.calculateGrandTotal(100000, 10000)).toBe(90000);
    });
  });

  describe('calculateVat', () => {
    it('выделяет НДС 20%', () => {
      const vat = service.calculateVat(120000, 20);
      expect(vat).toBe(20000);
    });
  });

  describe('calculateItemTotal', () => {
    it('считает сумму с наценкой', () => {
      // 85000 * 1.05 * 2 = 178500
      expect(service.calculateItemTotal(85000, 5, 2)).toBe(178500);
    });
  });

  // ─────── Строки таблицы ───────

  describe('proposalItemToRow', () => {
    it('формирует строку из ProposalItem', () => {
      const item = makeProposalItem();
      const row = service.proposalItemToRow(item);
      expect(row['name']).toBe('Стойка');
      expect(row['sku']).toBe('SP0001');
      expect(row['price']).toBe(85000);
      expect(row['quantity']).toBe(2);
      expect(row['total']).toBe(178500);
    });
  });

  describe('cartItemToRow', () => {
    it('формирует строку из CartItem с клиентской наценкой', () => {
      const item = makeCartItem({ markupPercent: 25 });
      const row = service.cartItemToRow(item, 10);
      // clientMarkup 10% имеет приоритет над товарным 25%
      expect(row['markupPercent']).toBe(10);
      expect(row['price']).toBe(85000);
      expect(row['quantity']).toBe(2);
      // total = 85000 * 1.10 * 2 = 187000
      expect(row['total']).toBe(187000);
    });

    it('использует наценку товара если нет клиентской', () => {
      const item = makeCartItem({ markupPercent: 25 });
      const row = service.cartItemToRow(item, 0);
      expect(row['markupPercent']).toBe(25);
    });
  });

  // ─────── Плейсхолдеры ───────

  describe('buildPlaceholders', () => {
    it('формирует карту плейсхолдеров', () => {
      const ph = service.buildPlaceholders({
        clientName: 'Иванов Иван',
        orgShortName: 'СпортИН-ЮГ',
        orgFullName: 'ООО СпортИН-ЮГ',
        grandTotal: 500000,
        itemsCount: 3,
      });
      expect(ph['{{client.name}}']).toBe('Иванов Иван');
      expect(ph['{{org.shortName}}']).toBe('СпортИН-ЮГ');
      expect(ph['{{items.count}}']).toBe('3');
      expect(ph['{{total}}']).toContain('500');
    });
  });

  describe('replacePlaceholders', () => {
    it('заменяет плейсхолдеры в строке', () => {
      const ph = { '{{name}}': 'Иван', '{{date}}': '01.01.2026' };
      expect(service.replacePlaceholders('Привет, {{name}}!', ph)).toBe('Привет, Иван!');
    });
    it('возвращает undefined для пустого входа', () => {
      expect(service.replacePlaceholders(undefined, {})).toBeUndefined();
    });
  });

  // ─────── buildDocBlocks ───────

  describe('buildDocBlocks', () => {
    it('возвращает пустой массив если нет позиций', () => {
      const blocks = service.buildDocBlocks({
        templateId: '', templates: [], items: [],
        grandTotal: 0, totalBeforeDiscount: 0,
        ...DEFAULTS,
      });
      expect(blocks.length).toBe(0);
    });

    it('создаёт базовый предпросмотр без шаблона (proposal items)', () => {
      const blocks = service.buildDocBlocks({
        ...DEFAULTS,
        templateId: '', templates: [],
        items: [makeProposalItem()],
        grandTotal: 178500,
        totalBeforeDiscount: 178500,
      });
      expect(blocks.length).toBe(2);
      expect(blocks[0].type).toBe('text');
      expect(blocks[1].type).toBe('table');
      expect(blocks[1]._inlineRows).toBeDefined();
    });

    it('создаёт базовый предпросмотр без шаблона (cart items)', () => {
      const blocks = service.buildDocBlocks({
        ...DEFAULTS,
        itemType: 'cart',
        templateId: '', templates: [],
        items: [makeCartItem()],
        grandTotal: 178500,
        totalBeforeDiscount: 178500,
      });
      expect(blocks.length).toBe(2);
      expect(blocks[1]._inlineRows!.length).toBe(1);
    });

    it('клонирует блоки шаблона и заменяет плейсхолдеры', () => {
      const tmpl = makeTemplate({
        blocks: [
          { id: 'b1', type: 'text', order: 0, content: 'Клиент: {{client.name}}' },
        ],
      });
      const client = makeClient({ lastName: 'Петров', firstName: 'Пётр' });
      const org = makeOrg();

      const blocks = service.buildDocBlocks({
        ...DEFAULTS,
        templateId: 'tmpl-1', templates: [tmpl],
        items: [makeProposalItem()],
        grandTotal: 178500,
        totalBeforeDiscount: 178500,
        organizationId: 'org-1', organizations: [org],
        clientId: 'cli-1', clients: [client],
      });

      expect(blocks.length).toBeGreaterThan(0);
      const textBlock = blocks.find(b => b.id === 'b1-inst');
      expect(textBlock).toBeDefined();
      expect(textBlock!.content).toBe('Клиент: Петров Пётр');
    });

    it('заполняет табличный блок данными позиций', () => {
      const tmpl = makeTemplate();
      const item = makeProposalItem();

      const blocks = service.buildDocBlocks({
        templateId: 'tmpl-1', templates: [tmpl],
        items: [item],
        grandTotal: 178500,
        totalBeforeDiscount: 178500,
        discountPercent: 0, discountAmount: 0,
        vatRate: 0, vatAmount: 0,
        clientMarkup: 0,
        itemType: 'proposal',
        organizationId: '', organizations: [],
        clientId: '', clients: [],
      });

      // Ищем любой табличный блок
      const tableBlock = blocks.find(b => b.type === 'table' && b.tableTemplateId);
      expect(tableBlock).toBeDefined();
      expect(tableBlock!._inlineRows).toBeDefined();
      expect(tableBlock!._inlineRows!.length).toBe(1);
      expect(tableBlock!._footerRows).toBeDefined();
    });

    it('добавляет НДС и скидку в footer-строки', () => {
      const tmpl = makeTemplate();
      const blocks = service.buildDocBlocks({
        templateId: 'tmpl-1', templates: [tmpl],
        items: [makeProposalItem({ unitPrice: 100000, quantity: 1, markupPercent: 0, total: 100000 })],
        grandTotal: 90000,
        totalBeforeDiscount: 100000,
        discountPercent: 10, discountAmount: 10000,
        vatRate: 20, vatAmount: 15000,
        clientMarkup: 0,
        itemType: 'proposal',
        organizationId: '', organizations: [],
        clientId: '', clients: [],
      });

      const tableBlock = blocks.find(b => b.type === 'table' && b.tableTemplateId);
      expect(tableBlock).toBeDefined();
      const footer = tableBlock!._footerRows!;
      const labels = footer.map(f => f.label);
      expect(labels).toContain('Итого (без скидки):');
      expect(labels).toContain('Итого:');
      expect(labels.some(l => l.includes('НДС'))).toBe(true);
    });

    it('показывает наценку клиента в footer если есть', () => {
      const tmpl = makeTemplate();
      const blocks = service.buildDocBlocks({
        templateId: 'tmpl-1', templates: [tmpl],
        items: [makeProposalItem({ unitPrice: 1000, quantity: 10, markupPercent: 0, total: 10000 })],
        grandTotal: 11000,
        totalBeforeDiscount: 11000,
        discountPercent: 0, discountAmount: 0,
        vatRate: 0, vatAmount: 0,
        clientMarkup: 10,
        itemType: 'proposal',
        baseTotal: 10000,
        organizationId: '', organizations: [],
        clientId: '', clients: [],
      });

      const tableBlock = blocks.find(b => b.type === 'table' && b.tableTemplateId);
      expect(tableBlock).toBeDefined();
      const footer = tableBlock!._footerRows!;
      expect(footer.some(f => f.label.includes('Наценка'))).toBe(true);
    });
  });

  // ─────── buildFooterRows ───────

  describe('buildFooterRows', () => {
    it('возвращает только Итого без НДС и скидки', () => {
      const rows = service.buildFooterRows({
        grandTotal: 100000, discountPercent: 0, discountAmount: 0,
        totalBeforeDiscount: 100000, vatRate: 0, vatAmount: 0,
        clientMarkup: 0, baseTotal: 100000,
      });
      expect(rows.length).toBe(1);
      expect(rows[0].label).toBe('Итого:');
    });

    it('добавляет строки со скидкой', () => {
      const rows = service.buildFooterRows({
        grandTotal: 90000, discountPercent: 10, discountAmount: 10000,
        totalBeforeDiscount: 100000, vatRate: 0, vatAmount: 0,
        clientMarkup: 0, baseTotal: 100000,
      });
      expect(rows[0].label).toBe('Итого (без скидки):');
      expect(rows[1].label).toContain('Скидка');
      expect(rows[2].label).toBe('Итого:');
    });

    it('добавляет НДС', () => {
      const rows = service.buildFooterRows({
        grandTotal: 120000, discountPercent: 0, discountAmount: 0,
        totalBeforeDiscount: 120000, vatRate: 20, vatAmount: 20000,
        clientMarkup: 0, baseTotal: 100000,
      });
      expect(rows.some(r => r.label.includes('НДС'))).toBe(true);
      expect(rows.some(r => r.label === 'Всего к оплате:')).toBe(true);
    });

    it('добавляет наценку', () => {
      const rows = service.buildFooterRows({
        grandTotal: 11000, discountPercent: 0, discountAmount: 0,
        totalBeforeDiscount: 11000, vatRate: 0, vatAmount: 0,
        clientMarkup: 10, baseTotal: 10000,
      });
      expect(rows.some(r => r.label.includes('Наценка'))).toBe(true);
      // toLocaleString('ru-RU') добавляет пробел-разделитель: 1000 → "1 000"
      expect(rows.some(r => r.value.includes('1') && r.value.includes('000'))).toBe(true);
    });
  });

  // ─────── getBackgroundImage ───────

  describe('getBackgroundImage', () => {
    it('возвращает пустую строку без шаблона', () => {
      expect(service.getBackgroundImage('', [])).toBe('');
    });
    it('возвращает первое изображение шаблона', () => {
      const tmpl = makeTemplate({ backgroundImages: ['img1.png', 'img2.png'] });
      expect(service.getBackgroundImage('tmpl-1', [tmpl])).toBe('img1.png');
    });
  });
});
