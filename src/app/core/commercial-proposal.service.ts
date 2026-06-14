import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import type { ApiResponse, CommercialProposal, ProposalItem, ProposalStatus } from '../../../shared/types/index.js';
import { ApiService } from './api.service.js';

/**
 * Сервис коммерческих предложений.
 * Все операции — через HTTP (ApiService → реальный бэкенд).
 * Номер КП генерируется на бэкенде (Counter model).
 */
@Injectable({ providedIn: 'root' })
export class CommercialProposalService {
  private api = inject(ApiService);
  private basePath = '/commercial-proposals';

  /** Получить все КП */
  getProposals(): Observable<ApiResponse<CommercialProposal[]>> {
    return this.api.get<CommercialProposal[]>(this.basePath);
  }

  /** Получить КП по id */
  getProposal(id: string): Observable<ApiResponse<CommercialProposal | undefined>> {
    return this.api.getById<CommercialProposal>(this.basePath, id);
  }

  /**
   * Создать КП с готовыми позициями (из редактора / витрины).
   * @param data Данные КП (без number, items, totalAmount — они вычисляются)
   * @param items Позиции КП (snapshot товаров)
   */
  createWithItems(
    data: Omit<CommercialProposal, 'id' | 'number' | 'items' | 'totalAmount' | 'createdAt' | 'updatedAt'>,
    items: ProposalItem[],
  ): Observable<ApiResponse<CommercialProposal>> {
    const totalAmount = items.reduce((sum, i) => sum + i.total, 0);
    return this.api.post<CommercialProposal>(this.basePath, {
      ...data,
      items,
      totalAmount,
    });
  }

  /** Создать пустой КП (без позиций) */
  createProposal(
    data: Omit<CommercialProposal, 'id' | 'number' | 'items' | 'totalAmount' | 'createdAt' | 'updatedAt'>,
  ): Observable<ApiResponse<CommercialProposal>> {
    return this.createWithItems(data, []);
  }

  /** Обновить КП (включая позиции) */
  updateProposal(
    id: string,
    data: Partial<Omit<CommercialProposal, 'id' | 'number' | 'createdAt'>>,
  ): Observable<ApiResponse<CommercialProposal>> {
    return this.api.put<CommercialProposal>(this.basePath, id, data);
  }

  /** Удалить КП */
  deleteProposal(id: string): Observable<ApiResponse<void>> {
    return this.api.delete<void>(this.basePath, id);
  }

  /** Изменить статус КП (PATCH /commercial-proposals/:id/status) */
  changeStatus(id: string, newStatus: ProposalStatus): Observable<ApiResponse<CommercialProposal>> {
    const validStatuses: ProposalStatus[] = ['draft', 'sent', 'approved', 'rejected'];
    if (!validStatuses.includes(newStatus)) {
      return of({
        success: false,
        data: undefined as unknown as CommercialProposal,
        message: `Недопустимый статус: ${newStatus}`,
      });
    }
    return this.api.patch<CommercialProposal>(
      `${this.basePath}/${id}/status`,
      { status: newStatus },
    );
  }
}
