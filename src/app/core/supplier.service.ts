import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import type { ApiResponse, Supplier } from '../../../shared/types/index.js';

function generateId(): string {
  return crypto.randomUUID?.() ?? Math.random().toString(36).slice(2, 11);
}

function nowISO(): string {
  return new Date().toISOString();
}

const SEED_SUPPLIERS: Supplier[] = [
  {
    id: 'sup-1',
    name: 'ООО «МеталлПродукт»',
    contactPerson: 'Кузнецов Андрей Викторович',
    phone: '+7 (343) 222-33-44',
    email: 'sale@metallproduct.ru',
    inn: '6671234567',
    bankAccount: '40702810700000012345',
    paymentTermDays: 30,
    isActive: true,
    createdAt: '2025-02-10T09:00:00.000Z',
    updatedAt: '2026-04-15T11:00:00.000Z',
  },
  {
    id: 'sup-2',
    name: 'АО «ХимРеактив»',
    contactPerson: 'Смирнова Елена Игоревна',
    phone: '+7 (495) 777-88-99',
    email: 'info@chemreactive.ru',
    inn: '7709876543',
    bankAccount: '40702810500000067890',
    paymentTermDays: 15,
    isActive: true,
    createdAt: '2025-05-20T14:00:00.000Z',
    updatedAt: '2026-03-01T16:30:00.000Z',
  },
  {
    id: 'sup-3',
    name: 'ИП Григорьев Дмитрий Сергеевич',
    contactPerson: 'Григорьев Дмитрий Сергеевич',
    phone: '+7 (926) 333-22-11',
    email: 'grigoriev@parts-msk.ru',
    inn: '503456789012',
    bankAccount: '40802810300000054321',
    paymentTermDays: 0,
    isActive: false,
    createdAt: '2024-11-01T10:00:00.000Z',
    updatedAt: '2026-01-20T09:00:00.000Z',
  },
];

@Injectable({ providedIn: 'root' })
export class SupplierService {
  private suppliers: Supplier[] = [...SEED_SUPPLIERS];

  getSuppliers(): Observable<ApiResponse<Supplier[]>> {
    return of({ success: true, data: [...this.suppliers] }).pipe(delay(100));
  }

  getSupplier(id: string): Observable<ApiResponse<Supplier | undefined>> {
    const s = this.suppliers.find(o => o.id === id);
    return of({ success: !!s, data: s ? { ...s } : undefined }).pipe(delay(100));
  }

  createSupplier(data: Omit<Supplier, 'id' | 'createdAt' | 'updatedAt'>): Observable<ApiResponse<Supplier>> {
    const now = nowISO();
    const supplier: Supplier = { ...data, id: generateId(), createdAt: now, updatedAt: now };
    this.suppliers.push(supplier);
    return of({ success: true, data: { ...supplier } }).pipe(delay(100));
  }

  updateSupplier(id: string, data: Partial<Omit<Supplier, 'id' | 'createdAt'>>): Observable<ApiResponse<Supplier>> {
    const index = this.suppliers.findIndex(o => o.id === id);
    if (index === -1) return of({ success: false, data: undefined as unknown as Supplier, message: 'Поставщик не найден' }).pipe(delay(100));
    this.suppliers[index] = { ...this.suppliers[index], ...data, id, updatedAt: nowISO() };
    return of({ success: true, data: { ...this.suppliers[index] } }).pipe(delay(100));
  }

  deleteSupplier(id: string): Observable<ApiResponse<void>> {
    const index = this.suppliers.findIndex(o => o.id === id);
    if (index === -1) return of({ success: false, data: undefined, message: 'Поставщик не найден' }).pipe(delay(100));
    this.suppliers.splice(index, 1);
    return of({ success: true, data: undefined }).pipe(delay(100));
  }
}
