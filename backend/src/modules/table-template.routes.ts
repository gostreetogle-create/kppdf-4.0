// ========================================
// TableTemplate Routes — CRUD для шаблонов таблиц
// ========================================

import { createCrudRouter } from '../utils/crud-factory.js';
import { TableTemplate } from './table-template.model.js';

const router = createCrudRouter(TableTemplate, {
  searchFields: ['name'],
  sortFields: ['name', 'createdAt', 'updatedAt'],
});

export default router;
