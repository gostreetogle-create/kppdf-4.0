import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { BaseCrudService, generateId, nowISO } from './crud-factory.js';
import type { ApiResponse, Contract, ContractItem, ContractStatus, CommercialProposal } from '../../../shared/types/index.js';

/** Счётчик номеров договоров */
let contractCounter = 0;

function generateContractNumber(): string {
  contractCounter++;
  return `Д-${String(contractCounter).padStart(4, '0')}`;
}

@Injectable({ providedIn: 'root' })
export class ContractService extends BaseCrudService<Contract> {
  constructor() {
    super();
    this.items = [];
  }

  getContracts(): Observable<ApiResponse<Contract[]>> {
    return this.getAll();
  }

  getContract(id: string): Observable<ApiResponse<Contract | undefined>> {
    return this.getById(id);
  }

  /** Создать договор из КП (snapshot позиций без цен) */
  createFromProposal(
    data: Omit<Contract, 'id' | 'number' | 'items' | 'createdAt' | 'updatedAt'>,
    proposal: CommercialProposal,
  ): Observable<ApiResponse<Contract>> {
    const now = nowISO();
    const items: ContractItem[] = proposal.items.map(pi => ({
      id: generateId(),
      sourceProductId: pi.sourceProductId,
      productSku: pi.productSku,
      productName: pi.productName,
      productUnit: pi.productUnit,
      quantity: pi.quantity,
    }));

    const contract: Contract = {
      ...data,
      id: generateId(),
      number: generateContractNumber(),
      status: 'draft',
      items,
      createdAt: now,
      updatedAt: now,
    };

    this.items.push(contract);
    return of({ success: true, data: this.cloneItem(contract) }).pipe(delay(this.delayMs));
  }

  /** Создать договор вручную */
  createContract(data: Omit<Contract, 'id' | 'number' | 'items' | 'createdAt' | 'updatedAt'> & { items?: ContractItem[] }): Observable<ApiResponse<Contract>> {
    const now = nowISO();
    const contract: Contract = {
      ...data,
      id: generateId(),
      number: generateContractNumber(),
      status: 'draft',
      items: data.items || [],
      createdAt: now,
      updatedAt: now,
    };

    this.items.push(contract);
    return of({ success: true, data: this.cloneItem(contract) }).pipe(delay(this.delayMs));
  }

  updateContract(id: string, data: Partial<Omit<Contract, 'id' | 'number' | 'createdAt'>>): Observable<ApiResponse<Contract>> {
    return this.update(id, data);
  }

  deleteContract(id: string): Observable<ApiResponse<void>> {
    return this.delete(id);
  }

  changeStatus(id: string, newStatus: ContractStatus): Observable<ApiResponse<Contract>> {
    const contract = this.items.find(c => c.id === id);
    if (!contract) {
      return of({ success: false, data: undefined as unknown as Contract, message: 'Договор не найден' }).pipe(delay(this.delayMs));
    }
    const updated = { ...contract, status: newStatus, updatedAt: nowISO() };
    this.items = this.items.map(c => c.id === id ? updated : c);
    return of({ success: true, data: this.cloneItem(updated) }).pipe(delay(this.delayMs));
  }

  protected override cloneItem(c: Contract): Contract {
    return { ...c, items: c.items.map(i => ({ ...i })) };
  }
}
