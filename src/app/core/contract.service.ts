import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import type { ApiResponse, Contract, ContractItem, ContractStatus, CommercialProposal } from '../../../shared/types/index.js';
import { ApiService } from './api.service.js';

let contractCounter = 0;

function generateContractNumber(): string {
  contractCounter++;
  return `Д-${String(contractCounter).padStart(4, '0')}`;
}

@Injectable({ providedIn: 'root' })
export class ContractService {
  private api = inject(ApiService);
  private basePath = '/contracts';

  getContracts(): Observable<ApiResponse<Contract[]>> {
    return this.api.get<Contract[]>(this.basePath);
  }

  getContract(id: string): Observable<ApiResponse<Contract | undefined>> {
    return this.api.getById<Contract>(this.basePath, id);
  }

  /** Создать договор из КП (snapshot позиций без цен) */
  createFromProposal(
    data: Omit<Contract, 'id' | 'number' | 'items' | 'createdAt' | 'updatedAt'>,
    proposal: CommercialProposal,
  ): Observable<ApiResponse<Contract>> {
    const items: ContractItem[] = proposal.items.map(pi => ({
      id: pi.id,
      sourceProductId: pi.sourceProductId,
      productSku: pi.productSku,
      productName: pi.productName,
      productUnit: pi.productUnit,
      quantity: pi.quantity,
    }));

    return this.api.post<Contract>(this.basePath, {
      ...data,
      number: generateContractNumber(),
      status: 'draft',
      items,
    });
  }

  /** Создать договор вручную */
  createContract(
    data: Omit<Contract, 'id' | 'number' | 'items' | 'createdAt' | 'updatedAt'> & { items?: ContractItem[] },
  ): Observable<ApiResponse<Contract>> {
    return this.api.post<Contract>(this.basePath, {
      ...data,
      number: generateContractNumber(),
      status: 'draft',
      items: data.items || [],
    });
  }

  updateContract(id: string, data: Partial<Omit<Contract, 'id' | 'number' | 'createdAt'>>): Observable<ApiResponse<Contract>> {
    return this.api.put<Contract>(this.basePath, id, data);
  }

  deleteContract(id: string): Observable<ApiResponse<void>> {
    return this.api.delete<void>(this.basePath, id);
  }

  changeStatus(id: string, newStatus: ContractStatus): Observable<ApiResponse<Contract>> {
    const validStatuses: ContractStatus[] = ['draft', 'active', 'completed', 'terminated'];
    if (!validStatuses.includes(newStatus)) {
      return of({
        success: false,
        data: undefined as unknown as Contract,
        message: `Недопустимый статус: ${newStatus}`,
      });
    }
    return this.api.put<Contract>(this.basePath, id, { status: newStatus });
  }
}
