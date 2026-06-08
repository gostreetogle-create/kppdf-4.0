// ========================================
// Role Routes — CRUD для ролей
// ========================================

import { createCrudRouter } from '../utils/crud-factory.js';
import { Role } from './role.model.js';

const router = createCrudRouter(Role, {
  searchFields: ['name', 'description'],
  sortFields: ['name', 'createdAt', 'updatedAt'],
});

export default router;
