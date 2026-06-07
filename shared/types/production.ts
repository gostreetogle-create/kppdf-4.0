// ========================================
// Модуль «Производство» (Фаза 2)
// ========================================

// ─── Справочники ───

/** Вид работы (справочник) */
export interface WorkType {
  id: string;
  name: string;
  department: string;
  defaultDurationHours: number;
  workCenterId?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/** Рабочий центр / станок */
export interface WorkCenter {
  id: string;
  name: string;
  type: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/** Работник */
export interface Worker {
  id: string;
  lastName: string;
  firstName: string;
  patronymic?: string;
  grade: number;
  ratePerHour: number;
  workTypeIds: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// ─── Производственный заказ ───

export type ProductionOrderStatus = 'accepted' | 'in_design' | 'in_production' | 'ready' | 'shipped' | 'closed';

/** Производственный заказ (создаётся из Договора) */
export interface ProductionOrder {
  id: string;
  number: string;
  contractId: string;
  productId: string;
  productName: string;
  productSku: string;
  quantity: number;
  status: ProductionOrderStatus;
  plannedStartDate?: string;
  plannedEndDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Задачи ───

export type TaskStatus = 'pending' | 'assigned' | 'in_progress' | 'done' | 'cancelled';

/** Задача по производственному заказу */
export interface OrderTask {
  id: string;
  productionOrderId: string;
  componentId: string;
  componentName: string;
  workTypeId: string;
  workTypeName: string;
  workerId?: string;
  status: TaskStatus;
  plannedHours: number;
  actualHours?: number;
  plannedStartDate?: string;
  plannedEndDate?: string;
  actualStartDate?: string;
  actualEndDate?: string;
  dependsOnTaskIds: string[];
  sortOrder: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Проблема комплектации ───

/** Тип недостающих данных для авто-задачи */
export type MissingDataType = 'no_drawing' | 'no_materials' | 'no_work_types' | 'incomplete_spec';

/** Результат проверки готовности к производству */
export interface MissingDataIssue {
  type: MissingDataType;
  componentId: string;
  componentName: string;
  detail: string;
}
