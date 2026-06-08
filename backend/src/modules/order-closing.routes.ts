// ========================================
// OrderClosing Routes — CRUD для закрытия заказов
// ========================================

import { createCrudRouter } from '../utils/crud-factory.js';
import { OrderClosing } from './order-closing.model.js';

const router = createCrudRouter(OrderClosing, {
  searchFields: ['number', 'orderNumber', 'notes'],
  sortFields: ['number', 'date', 'status', 'createdAt', 'updatedAt'],
});

export default router;
