// ========================================
// Модуль «Бухгалтерия» (Фаза 4)
// ========================================

// ─── Закрытие заказов ───

export type ClosingType = 'act' | 'invoice' | 'waybill';

/** Акт / счёт-фактура / накладная для закрытия заказа */
export interface OrderClosing {
  id: string;
  productionOrderId: string;
  orderNumber: string;
  closingType: ClosingType;
  number: string;
  date: string;
  /** Сумма документа */
  amount?: number;
  /** ID контрагента */
  organizationId?: string;
  organizationName?: string;
  /** Статус: draft → signed → closed */
  status: 'draft' | 'signed' | 'closed';
  /** Ссылка на файл документа */
  fileUrl?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Акты сверки ───

/** Акт сверки с контрагентом */
export interface ReconciliationAct {
  id: string;
  organizationId: string;
  organizationName: string;
  number: string;
  periodStart: string;
  periodEnd: string;
  /** Наша задолженность перед контрагентом */
  ourDebt?: number;
  /** Задолженность контрагента перед нами */
  theirDebt?: number;
  /** Сальдо (разница) */
  balance?: number;
  status: 'draft' | 'sent' | 'signed' | 'disputed';
  signDate?: string;
  fileUrl?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Финансовые отчёты ───

export type ReportType = 'profit_loss' | 'cashflow' | 'receivables' | 'payables';

/** Финансовый отчёт */
export interface FinancialReport {
  id: string;
  title: string;
  reportType: ReportType;
  periodStart: string;
  periodEnd: string;
  /** JSON с данными отчёта */
  data?: Record<string, unknown>;
  /** Итоговая сумма */
  totalAmount?: number;
  status: 'draft' | 'final';
  generatedAt?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
