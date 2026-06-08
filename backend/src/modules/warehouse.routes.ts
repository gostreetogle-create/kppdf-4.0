// ========================================
// Warehouse Routes — CRUD для складов
// ========================================

import { createCrudRouter } from '../utils/crud-factory.js';
import { Warehouse } from './warehouse.model.js';

const router = createCrudRouter(Warehouse, {
  searchFields: ['name', 'address'],
  sortFields: ['name', 'createdAt', 'updatedAt'],
});

export default router;
