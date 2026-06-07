// ========================================
// Компоненты изготавливаемых товаров (Фаза 1.6)
// ========================================

/** Материал компонента (встроен в компонент, не отдельная сущность) */
export interface ComponentMaterial {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  notes?: string;
}

/** Вид работы для компонента (упрощённый, полный справочник WorkType — в Фазе 2) */
export interface ComponentWorkType {
  id: string;
  name: string;
  department: string;
  normHours: number;
  sortOrder: number;
}

/** Компонент изготавливаемого товара (BOM) */
export interface ProductComponent {
  id: string;
  productId: string;
  name: string;
  quantityPerProduct: number;
  description?: string;
  drawingUrl?: string;
  sortOrder: number;
  materials: ComponentMaterial[];
  workTypes: ComponentWorkType[];
  createdAt: string;
  updatedAt: string;
}
