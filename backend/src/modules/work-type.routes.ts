// ========================================
// WorkType Routes — CRUD для видов работ
// ========================================

import { createCrudRouter } from '../utils/crud-factory.js';
import { WorkType } from './work-type.model.js';

const router = createCrudRouter(WorkType, {
  searchFields: ['name', 'department'],
  sortFields: ['name', 'department', 'createdAt', 'updatedAt'],
});

export default router;
