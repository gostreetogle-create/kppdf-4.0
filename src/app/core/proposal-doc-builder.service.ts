import { Injectable } from '@angular/core';
import type { DocBlock, ProposalItem, Organization, Client, DocumentTemplate, CartItem } from '../../../shared/types/index.js';

/**
 * Параметры для построения DocBlock[] документа КП.
 * Единая точка входа — используется и в витрине, и в редакторе.
 */
export interface DocBlockBuildParams {
  templateId: string;
  templates: DocumentTemplate[];
  items: ProposalItem[] | CartItem[];
  organizationId: string;
  organizations: Organization[];
  clientId: string;
  clients: Client[];
  grandTotal: number;
  discountPercent: number;
  discountAmount: number;
  totalBeforeDiscount: number;
  vatRate: number;
  vatAmount: number;
  clientMarkup: number;
  /** Тип элемента: 'proposal' (ProposalItem[]) или 'cart' (CartItem[]) */
  itemType: 'proposal' | 'cart';
  /** Базовая сумма без наценки (только для cart) */
  baseTotal?: number;
}

/**
 * Сервис построения документов для коммерческих предложений.
 * Чистые функции без состояния — используется из computed() сигналов компонентов.
 */
@Injectable({ providedIn: 'root' })
export class ProposalDocBuilderService {

  // ═══════════════════════════════════════════════════
  //  Расчёты
  // ═══════════════════════════════════════════════════

  /** Сумма всех позиций (с учётом индивидуальных total) */
  calculateTotal(items: { total: number }[]): number {
    return items.reduce((sum, i) => sum + i.total, 0);
  }

  /** Наценка клиента (personalMarkupPercent из справочника) */
  getClientMarkup(clientId: string, clients: Client[]): number {
    if (!clientId) return 0;
    const client = clients.find(c => c.id === clientId);
    return client?.personalMarkupPercent ?? 0;
  }

  /** Ставка НДС из организации (по умолчанию 20%) */
  getVatRate(orgId: string, orgs: Organization[]): number {
    if (!orgId) return 20;
    const org = orgs.find(o => o.id === orgId);
    return org?.vatRate ?? 20;
  }

  /** Сумма скидки */
  calculateDiscount(total: number, discountPercent: number): number {
    if (discountPercent <= 0) return 0;
    return Math.round(total * discountPercent / 100 * 100) / 100;
  }

  /** Итого после скидки */
  calculateGrandTotal(total: number, discount: number): number {
    return total - discount;
  }

  /** НДС от итоговой суммы (выделение НДС) */
  calculateVat(grandTotal: number, vatRate: number): number {
    return Math.round(grandTotal * vatRate / (100 + vatRate) * 100) / 100;
  }

  /** Сумма позиции с наценкой */
  calculateItemTotal(price: number, markupPercent: number, quantity: number): number {
    return Math.round(price * (1 + markupPercent / 100) * quantity * 100) / 100;
  }

  // ═══════════════════════════════════════════════════
  //  Формирование строк таблицы
  // ═══════════════════════════════════════════════════

  /** ProposalItem → строка таблицы */
  proposalItemToRow(item: ProposalItem): Record<string, unknown> {
    return {
      name: item.productName,
      sku: item.productSku,
      price: item.unitPrice,
      unitPrice: item.unitPrice,
      quantity: item.quantity,
      unit: item.productUnit,
      total: item.total,
      totalAmount: item.total,
      productName: item.productName,
      productSku: item.productSku,
      productUnit: item.productUnit,
      markupPercent: item.markupPercent ?? 0,
    };
  }

  /** CartItem → строка таблицы (с расчётом total через наценку) */
  cartItemToRow(item: CartItem, clientMarkup: number): Record<string, unknown> {
    const effectiveMarkup = clientMarkup > 0 ? clientMarkup : (item.markupPercent ?? 0);
    const total = this.calculateItemTotal(item.price, effectiveMarkup, item.quantity);
    return {
      name: item.name,
      sku: item.sku,
      price: item.price,
      unitPrice: item.price,
      basePrice: item.price,
      quantity: item.quantity,
      unit: item.unit,
      total,
      totalAmount: total,
      productName: item.name,
      productSku: item.sku,
      productUnit: item.unit,
      markupPercent: effectiveMarkup,
      weightKg: item.weightKg,
      dimensions: item.dimensions,
      material: item.material,
    };
  }

  // ═══════════════════════════════════════════════════
  //  Подстановка плейсхолдеров
  // ═══════════════════════════════════════════════════

  /** Формирует карту плейсхолдеров */
  buildPlaceholders(params: {
    clientName: string;
    orgShortName: string;
    orgFullName: string;
    grandTotal: number;
    itemsCount: number;
  }): Record<string, string> {
    return {
      '{{client.name}}': params.clientName,
      '{{org.shortName}}': params.orgShortName,
      '{{org.name}}': params.orgFullName,
      '{{total}}': params.grandTotal.toLocaleString('ru-RU') + ' ₽',
      '{{date}}': new Date().toLocaleDateString('ru-RU'),
      '{{items.count}}': String(params.itemsCount),
    };
  }

  /** Заменяет плейсхолдеры в строке */
  replacePlaceholders(text: string | undefined, placeholders: Record<string, string>): string | undefined {
    if (!text) return text;
    let result = text;
    for (const [key, value] of Object.entries(placeholders)) {
      result = result.replaceAll(key, value);
    }
    return result;
  }

  /** Клонирует блоки шаблона с заменой плейсхолдеров */
  cloneBlocksWithPlaceholders(
    blocks: DocBlock[],
    placeholders: Record<string, string>,
  ): DocBlock[] {
    return blocks.map(b => ({
      ...b,
      id: b.id + '-inst',
      content: this.replacePlaceholders(b.content, placeholders),
      columns: b.columns?.map(c => ({
        ...c,
        content: this.replacePlaceholders(c.content, placeholders) || c.content,
      })),
    }));
  }

  // ═══════════════════════════════════════════════════
  //  Построение DocBlock[]
  // ═══════════════════════════════════════════════════

  /** Главный метод: строит массив DocBlock из шаблона + позиций */
  buildDocBlocks(params: DocBlockBuildParams): DocBlock[] {
    const { templateId, templates, items, organizationId, organizations, clientId, clients,
      grandTotal, discountPercent, discountAmount, totalBeforeDiscount,
      vatRate, vatAmount, clientMarkup, itemType } = params;

    const blocks: DocBlock[] = [];

    if (items.length === 0) return blocks;

    // ── Без шаблона: базовый предпросмотр ──
    if (!templateId) {
      blocks.push({
        id: 'hdr', type: 'text', order: 0,
        title: 'Коммерческое предложение',
        content: 'Предварительный просмотр',
        settings: { fontSize: '18px', align: 'center' },
      });

      const toRow = itemType === 'proposal'
        ? (i: ProposalItem | CartItem) => this.proposalItemToRow(i as ProposalItem)
        : (i: ProposalItem | CartItem) => this.cartItemToRow(i as CartItem, clientMarkup);

      blocks.push({
        id: 'tbl', type: 'table', order: 1,
        title: `Товары (${items.length} позиций)`,
        _inlineRows: items.map(toRow),
        _footerRows: [
          { label: 'Итого:', value: grandTotal.toLocaleString('ru-RU') + ' ₽' },
        ],
      });
      return blocks;
    }

    // ── С шаблоном ──
    const tmpl = templates.find(t => t.id === templateId);
    if (!tmpl) return blocks;

    // Имена
    const org = organizationId ? organizations.find(o => o.id === organizationId) : null;
    const client = clientId ? clients.find(c => c.id === clientId) : null;
    const clientName = client
      ? [client.lastName, client.firstName, client.patronymic].filter(Boolean).join(' ')
      : 'Клиент';
    const orgName = org ? (org.shortName || org.name) : 'Организация';

    // Плейсхолдеры
    const placeholders = this.buildPlaceholders({
      clientName,
      orgShortName: orgName,
      orgFullName: org ? org.name : 'Организация',
      grandTotal,
      itemsCount: items.length,
    });

    // Клонируем блоки шаблона
    const cloned = this.cloneBlocksWithPlaceholders(tmpl.blocks, placeholders);
    blocks.push(...cloned);      // Заполняем табличный блок данными
      if (items.length > 0) {
        const toRow = itemType === 'proposal'
          ? (i: ProposalItem | CartItem) => this.proposalItemToRow(i as ProposalItem)
          : (i: ProposalItem | CartItem) => this.cartItemToRow(i as CartItem, clientMarkup);

        const tableBlock = blocks.find(b => b.type === 'table' && b.tableTemplateId);
        if (tableBlock) {
          tableBlock._inlineRows = items.map(toRow);

          // Итоги по колонкам
          const summaries: Record<string, number> = {
            quantity: items.reduce((s, i) => s + ('quantity' in i ? (i as { quantity: number }).quantity : 0), 0),
            total: grandTotal,
            totalAmount: grandTotal,
          };
          tableBlock._columnSummaries = summaries;

          // Footer-строки (передаём предвычисленный baseTotal)
          const effectiveBaseTotal = itemType === 'proposal'
            ? (items as ProposalItem[]).reduce((s, i) => s + (i.unitPrice * i.quantity), 0)
            : (params.baseTotal ?? 0);

          tableBlock._footerRows = this.buildFooterRows({
            grandTotal,
            discountPercent,
            discountAmount,
            totalBeforeDiscount,
            vatRate,
            vatAmount,
            clientMarkup,
            baseTotal: effectiveBaseTotal,
          });
      } else {
        // Fallback: нет табличных блоков → текстовый блок
        const itemLines = items.map(it => {
          const i = it as ProposalItem;
          const name = i.productName || (it as CartItem).name;
          const sku = i.productSku || (it as CartItem).sku;
          const price = i.unitPrice || (it as CartItem).price;
          const qty = i.quantity || (it as CartItem).quantity;
          return `• ${name} (${sku}) — ${qty} × ${price.toLocaleString('ru-RU')} ₽ = ${(price * qty).toLocaleString('ru-RU')} ₽`;
        });
        blocks.push({
          id: 'sel-items', type: 'text', order: blocks.length,
          title: `Выбрано товаров: ${items.length} на сумму ${grandTotal.toLocaleString('ru-RU')} ₽`,
          content: itemLines.join('\n'),
        });
      }
    }

    return blocks;
  }

  /** Формирует footer-строки для табличного блока */
  buildFooterRows(params: {
    grandTotal: number;
    discountPercent: number;
    discountAmount: number;
    totalBeforeDiscount: number;
    vatRate: number;
    vatAmount: number;
    clientMarkup: number;
    baseTotal: number;
  }): { label: string; value: string }[] {
    const { grandTotal, discountPercent, discountAmount, totalBeforeDiscount,
      vatRate, vatAmount, clientMarkup, baseTotal } = params;

    const rows: { label: string; value: string }[] = [];

    if (discountAmount > 0) {
      rows.push({ label: 'Итого (без скидки):', value: totalBeforeDiscount.toLocaleString('ru-RU') + ' ₽' });
      rows.push({ label: `Скидка ${discountPercent}%:`, value: '-' + discountAmount.toLocaleString('ru-RU') + ' ₽' });
    }
    rows.push({ label: 'Итого:', value: grandTotal.toLocaleString('ru-RU') + ' ₽' });

    if (vatRate > 0) {
      rows.push({ label: `в том числе НДС ${vatRate}%:`, value: vatAmount.toLocaleString('ru-RU') + ' ₽' });
      rows.push({ label: 'Всего к оплате:', value: grandTotal.toLocaleString('ru-RU') + ' ₽' });
    }

    if (clientMarkup > 0) {
      const markupAmount = totalBeforeDiscount - baseTotal;
      rows.push({ label: 'Наценка (' + clientMarkup + '%):', value: '+' + markupAmount.toLocaleString('ru-RU') + ' ₽' });
    }

    return rows;
  }

  // ═══════════════════════════════════════════════════
  //  Фоновые изображения
  // ═══════════════════════════════════════════════════

  /** Первое фоновое изображение из шаблона */
  getBackgroundImage(templateId: string, templates: DocumentTemplate[]): string {
    if (!templateId) return '';
    const tmpl = templates.find(t => t.id === templateId);
    const images = tmpl?.backgroundImages;
    if (images && images.length > 0) return images[0];
    return (tmpl as unknown as Record<string, unknown>)['backgroundImage'] as string ?? '';
  }
}
