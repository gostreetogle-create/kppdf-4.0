import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { BaseCrudService, generateId, nowISO } from './crud-factory.js';
import type { ApiResponse, Tender, TenderDocument } from '../../../shared/types/index.js';

const SEED_TENDERS: Tender[] = [
  { id: 'tnd-1', number: 'Т-0001', title: 'Поставка МАФ для парка «Солнечный»', type: '44fz', status: 'published', customerOrgId: 'org-1', customerName: 'Администрация г. Краснодар', noticeNumber: '0318300012524000123', platformUrl: 'https://zakupki.gov.ru/epz/order/notice/ea44/view/common-info.html?regNumber=0318300012524000123', startPrice: 2500000, publishDate: '2026-05-10', submissionDeadline: '2026-06-15', documents: [], createdAt: '2026-05-10T08:00:00.000Z', updatedAt: '2026-05-10T08:00:00.000Z' },
  { id: 'tnd-2', number: 'Т-0002', title: 'Благоустройство школьного стадиона №42', type: '44fz', status: 'evaluation', customerOrgId: 'org-1', customerName: 'Администрация г. Краснодар', noticeNumber: '0318300012524000456', startPrice: 5800000, ourPrice: 5200000, publishDate: '2026-06-01', submissionDeadline: '2026-06-20', notes: 'Ждём результаты. Конкуренты: СтройПроект, ЮгСпорт', documents: [{ id: 'td-1', tenderId: 'tnd-2', name: 'Заявка_СпортИНЮг.pdf', type: 'request', createdAt: '2026-06-10T14:00:00.000Z' }], createdAt: '2026-06-01T09:00:00.000Z', updatedAt: '2026-06-10T14:00:00.000Z' },
  { id: 'tnd-3', number: 'Т-0003', title: 'Ограждение спортплощадки ЖК «Премьер»', type: 'commercial', status: 'won', customerOrgId: 'org-2', customerName: 'ООО «СтройИнвест»', startPrice: 1200000, ourPrice: 1150000, publishDate: '2026-04-15', resultDate: '2026-05-20', documents: [{ id: 'td-2', tenderId: 'tnd-3', name: 'Договор_СтройИнвест.pdf', type: 'contract', createdAt: '2026-05-25T10:00:00.000Z' }], createdAt: '2026-04-15T10:00:00.000Z', updatedAt: '2026-05-25T10:00:00.000Z' },
];

@Injectable({ providedIn: 'root' })
export class TenderService extends BaseCrudService<Tender> {
  constructor() { super(); this.items = SEED_TENDERS.map(t => ({ ...t, documents: t.documents.map(d => ({ ...d })) })); }

  protected override cloneItem(item: Tender): Tender {
    return { ...item, documents: item.documents.map(d => ({ ...d })) };
  }
}
