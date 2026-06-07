import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { BaseCrudService, generateId, nowISO } from './crud-factory.js';
import type { ApiResponse, CartItem, CommercialProposal, ProposalItem, ProposalStatus } from '../../../shared/types/index.js';

/** Счётчик номеров КП */
let cpCounter = 0;

function generateCpNumber(): string {
  cpCounter++;
  return `КП-${String(cpCounter).padStart(4, '0')}`;
}

/**
 * Сервис коммерческих предложений.
 * Расширяет BaseCrudService для in-memory CRUD.
 * При переходе на реальный бэкенд — заменить на HttpClient.
 */
@Injectable({ providedIn: 'root' })
export class CommercialProposalService extends BaseCrudService<CommercialProposal> {
  constructor() {
    super();
    this.items = [];
  }

  // ─── CRUD методы ───

  getProposals(): Observable<ApiResponse<CommercialProposal[]>> {
    return this.getAll();
  }

  getProposal(id: string): Observable<ApiResponse<CommercialProposal | undefined>> {
    return this.getById(id);
  }

  /**
   * Создать КП из позиций корзины (snapshot).
   * Используется при создании КП напрямую из корзины без редактора.
   * @param data Данные КП без id, number, createdAt, updatedAt
   * @param cartItems Позиции корзины для создания snapshot
   * @deprecated Используйте createWithItems с готовыми ProposalItem[] из редактора
   */
  createFromCart(
    data: Omit<CommercialProposal, 'id' | 'number' | 'items' | 'totalAmount' | 'createdAt' | 'updatedAt'>,
    cartItems: CartItem[],
  ): Observable<ApiResponse<CommercialProposal>> {
    const now = nowISO();
    const items: ProposalItem[] = cartItems.map(ci => ({
      id: generateId(),
      sourceProductId: ci.productId,
      productSku: ci.sku,
      productName: ci.name,
      productUnit: ci.unit,
      productDescription: undefined,
      quantity: ci.quantity,
      unitPrice: ci.price,
      markupPercent: 0,
      total: ci.price * ci.quantity,
    }));

    const totalAmount = items.reduce((sum, i) => sum + i.total, 0);

    const proposal: CommercialProposal = {
      ...data,
      id: generateId(),
      number: generateCpNumber(),
      status: 'draft',
      items,
      totalAmount,
      createdAt: now,
      updatedAt: now,
    };

    this.items.push(proposal);
    return of({ success: true, data: this.cloneItem(proposal) }).pipe(delay(this.delayMs));
  }

  /** Создать пустой КП (без позиций) */
  createProposal(data: Omit<CommercialProposal, 'id' | 'number' | 'items' | 'totalAmount' | 'createdAt' | 'updatedAt'>): Observable<ApiResponse<CommercialProposal>> {
    return this.createFromCart(data, []);
  }

  /**
   * Создать КП с готовыми позициями (из редактора).
   * Используется когда редактор уже сформировал ProposalItem[].
   */
  createWithItems(
    data: Omit<CommercialProposal, 'id' | 'number' | 'items' | 'totalAmount' | 'createdAt' | 'updatedAt'>,
    items: ProposalItem[],
  ): Observable<ApiResponse<CommercialProposal>> {
    const now = nowISO();
    const totalAmount = items.reduce((sum, i) => sum + i.total, 0);

    const proposal: CommercialProposal = {
      ...data,
      id: generateId(),
      number: generateCpNumber(),
      status: 'draft',
      items: items.map(i => ({ ...i, id: i.id || generateId() })),
      totalAmount,
      createdAt: now,
      updatedAt: now,
    };

    this.items.push(proposal);
    return of({ success: true, data: this.cloneItem(proposal) }).pipe(delay(this.delayMs));
  }

  /** Обновить КП (включая позиции) */
  updateProposal(id: string, data: Partial<Omit<CommercialProposal, 'id' | 'number' | 'createdAt'>>): Observable<ApiResponse<CommercialProposal>> {
    return this.update(id, data);
  }

  /** Удалить КП */
  deleteProposal(id: string): Observable<ApiResponse<void>> {
    return this.delete(id);
  }

  /** Изменить статус КП (используется в UI через updateProposal) */
  changeStatus(id: string, newStatus: ProposalStatus): Observable<ApiResponse<CommercialProposal>> {
    const proposal = this.items.find(p => p.id === id);
    if (!proposal) {
      return of({ success: false, data: undefined as unknown as CommercialProposal, message: 'КП не найдено' }).pipe(delay(this.delayMs));
    }
    const updated = { ...proposal, status: newStatus, updatedAt: nowISO() };
    this.items = this.items.map(p => p.id === id ? updated : p);
    return of({ success: true, data: this.cloneItem(updated) }).pipe(delay(this.delayMs));
  }

  protected override cloneItem(p: CommercialProposal): CommercialProposal {
    return {
      ...p,
      items: p.items.map(i => ({ ...i })),
    };
  }
}
