// ========================================
// Supplier Routes — CRUD для поставщиков
// ========================================

import { createCrudRouter } from '../utils/crud-factory.js';
import { Supplier } from './supplier.model.js';

const router = createCrudRouter(Supplier, {
  searchFields: ['name', 'contactPerson', 'inn'],
  sortFields: ['name', 'inn', 'createdAt', 'updatedAt'],
});

export default router;
