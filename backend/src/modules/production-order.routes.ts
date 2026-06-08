// ========================================
// ProductionOrder Routes — CRUD для производственных заказов
// ========================================

import { createCrudRouter } from '../utils/crud-factory.js';
import { ProductionOrder } from './production-order.model.js';

const router = createCrudRouter(ProductionOrder, {
  searchFields: ['number', 'productName', 'productSku'],
  sortFields: ['number', 'productName', 'status', 'createdAt', 'updatedAt', 'plannedStartDate'],
  listFilter: (req) => {
    const status = req.query.status;
    if (status) {
      const val = Array.isArray(status) ? status[0] : status;
      return { status: val };
    }
    return {};
  },
});

export default router;
