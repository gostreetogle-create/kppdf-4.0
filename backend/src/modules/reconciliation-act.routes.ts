// ========================================
// ReconciliationAct Routes — CRUD для актов сверки
// ========================================

import { createCrudRouter } from '../utils/crud-factory.js';
import { ReconciliationAct } from './reconciliation-act.model.js';

const router = createCrudRouter(ReconciliationAct, {
  searchFields: ['number', 'organizationName', 'notes'],
  sortFields: ['number', 'periodStart', 'status', 'createdAt', 'updatedAt'],
});

export default router;
