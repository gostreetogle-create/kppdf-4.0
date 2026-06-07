// ========================================
// Модуль «Договоры» (Phase 1.4)
// ========================================

/** Статус договора */
export type ContractStatus = 'draft' | 'active' | 'completed' | 'terminated';

/** Позиция договора — копия из КП (snapshot, без цен) */
export interface ContractItem {
  id: string;
  sourceProductId: string;
  productSku: string;
  productName: string;
  productUnit: string;
  quantity: number;
}

/** Договор */
export interface Contract {
  id: string;
  /** Номер договора (авто: Д-0001) */
  number: string;
  /** ID коммерческого предложения, из которого создан */
  proposalId?: string;
  /** ID организации */
  organizationId?: string;
  /** ID контактного лица */
  clientId?: string;
  /** Статус */
  status: ContractStatus;
  /** Позиции договора (snapshot из КП) */
  items: ContractItem[];
  /** Примечания */
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
