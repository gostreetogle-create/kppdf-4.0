// ========================================
// WorkCenter Routes — CRUD для рабочих центров
// ========================================

import { createCrudRouter } from '../utils/crud-factory.js';
import { WorkCenter } from './work-center.model.js';

const router = createCrudRouter(WorkCenter, {
  searchFields: ['name', 'type', 'description'],
  sortFields: ['name', 'type', 'createdAt', 'updatedAt'],
});

export default router;
