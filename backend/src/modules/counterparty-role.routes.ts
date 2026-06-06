// ========================================
// CounterpartyRole Routes — CRUD для видов контрагентов
// ========================================

import { createCrudRouter } from '../utils/crud-factory.js';
import { CounterpartyRole } from './counterparty-role.model.js';

const router = createCrudRouter(CounterpartyRole, {
  searchFields: ['name', 'description', 'slug'],
  sortFields: ['name', 'slug', 'createdAt', 'updatedAt'],
});

export default router;
