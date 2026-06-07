// ========================================
// Модуль «Коммерческие предложения» (Phase 1.3)
// ========================================

/** Статус коммерческого предложения */
export type ProposalStatus = 'draft' | 'sent' | 'approved' | 'rejected';

/**
 * Позиция КП — snapshot товара на момент создания.
 * Редактирование справочника товаров НЕ меняет уже созданные КП.
 */
export interface ProposalItem {
  id: string;
  /** ID товара из справочника (для информации) */
  sourceProductId: string;
  /** Артикул (копия) */
  productSku: string;
  /** Наименование (копия) */
  productName: string;
  /** Единица измерения */
  productUnit: string;
  /** Описание (копия) */
  productDescription?: string;
  /** Количество */
  quantity: number;
  /** Цена за единицу */
  unitPrice: number;
  /** Процент наценки */
  markupPercent: number;
  /** Сумма по позиции (quantity * unitPrice) */
  total: number;
}

/** Коммерческое предложение */
export interface CommercialProposal {
  id: string;
  /** Номер КП (авто: КП-0001) */
  number: string;
  /** ID организации-клиента (юр.лицо) */
  organizationId?: string;
  /** ID контактного лица (физ.лицо) */
  clientId?: string;
  /** Статус */
  status: ProposalStatus;
  /** Позиции КП (snapshot) */
  items: ProposalItem[];
  /** Общая сумма */
  totalAmount: number;
  /** Примечания */
  notes?: string;
  /** ID шаблона документа для печати */
  templateId?: string;
  createdAt: string;
  updatedAt: string;
}
