import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { BaseCrudService, generateId, nowISO } from './crud-factory.js';
import type { ApiResponse, IncomingInvoice, InvoiceStatus } from '../../../shared/types/index.js';

let invCounter = 3;
function generateInvoiceNumber(): string {
  invCounter++;
  return `СФ-${String(invCounter).padStart(4, '0')}`;
}

const SEED_INVOICES: IncomingInvoice[] = [
  {
    id: 'inv-1', number: 'СФ-0001', date: '2026-05-16',
    supplierOrgId: 'sup-1', supplierOrderId: 'so-1',
    amount: 91000, paid: 50000,
    status: 'pending',
    notes: 'ПРОММЕТИЗ — частичная оплата, остаток 41 000₽ до 20.06',
    createdAt: '2026-05-16T10:00:00.000Z', updatedAt: '2026-06-01T14:00:00.000Z',
  },
  {
    id: 'inv-2', number: 'СФ-0002', date: '2026-06-03',
    supplierOrgId: 'sup-2', supplierOrderId: 'so-2',
    amount: 64000, paid: 0,
    status: 'pending',
    notes: 'ХимРеактив — ожидается оплата после подтверждения заказа',
    createdAt: '2026-06-03T09:00:00.000Z', updatedAt: '2026-06-03T09:00:00.000Z',
  },
  {
    id: 'inv-3', number: 'СФ-0003', date: '2026-04-20',
    supplierOrgId: 'sup-1',
    amount: 35000, paid: 35000,
    status: 'paid',
    notes: 'ПРОММЕТИЗ — стальной прокат, полностью оплачено',
    createdAt: '2026-04-20T11:00:00.000Z', updatedAt: '2026-04-25T16:00:00.000Z',
  },
];

@Injectable({ providedIn: 'root' })
export class InvoiceService extends BaseCrudService<IncomingInvoice> {
  constructor() {
    super();
    this.items = SEED_INVOICES.map(inv => ({ ...inv }));
  }

  getInvoices(): Observable<ApiResponse<IncomingInvoice[]>> {
    return this.getAll();
  }

  getInvoice(id: string): Observable<ApiResponse<IncomingInvoice | undefined>> {
    return this.getById(id);
  }

  createInvoice(data: Omit<IncomingInvoice, 'id' | 'number' | 'createdAt' | 'updatedAt'>): Observable<ApiResponse<IncomingInvoice>> {
    const now = nowISO();
    const invoice: IncomingInvoice = {
      ...(data as IncomingInvoice),
      id: generateId(),
      number: generateInvoiceNumber(),
      createdAt: now,
      updatedAt: now,
    };
    this.items.push(invoice);
    return of({ success: true, data: this.cloneItem(invoice) }).pipe(delay(this.delayMs));
  }

  updateInvoice(id: string, data: Partial<Omit<IncomingInvoice, 'id' | 'number' | 'createdAt'>>): Observable<ApiResponse<IncomingInvoice>> {
    return this.update(id, data);
  }

  deleteInvoice(id: string): Observable<ApiResponse<void>> {
    return this.delete(id);
  }

  changeStatus(id: string, newStatus: InvoiceStatus): Observable<ApiResponse<IncomingInvoice>> {
    const invoice = this.items.find(inv => inv.id === id);
    if (!invoice) return of({ success: false, data: undefined as unknown as IncomingInvoice, message: 'Счёт не найден' }).pipe(delay(this.delayMs));
    const updated = { ...invoice, status: newStatus, updatedAt: nowISO() };
    this.items = this.items.map(inv => inv.id === id ? updated : inv);
    return of({ success: true, data: this.cloneItem(updated) }).pipe(delay(this.delayMs));
  }
}
