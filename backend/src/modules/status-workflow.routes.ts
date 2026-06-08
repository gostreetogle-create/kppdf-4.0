// ========================================
// StatusWorkflow Routes — CRUD для статусных моделей
// ========================================

import { createCrudRouter } from '../utils/crud-factory.js';
import { StatusWorkflow } from './status-workflow.model.js';

const router = createCrudRouter(StatusWorkflow, {
  searchFields: ['name', 'entityType'],
  sortFields: ['name', 'entityType', 'createdAt', 'updatedAt'],
});

export default router;
