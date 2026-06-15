// ========================================
// Role Routes — CRUD для ролей (только admin)
// ========================================

import { createCrudRouter } from '../utils/crud-factory.js';
import { requireRole } from '../middleware/auth.js';
import { Role } from './role.model.js';

const router = createCrudRouter(Role, {
  searchFields: ['name', 'description'],
  sortFields: ['name', 'createdAt', 'updatedAt'],
  allowedFields: ['name', 'description', 'permissions'],
});

// Дополнительная проверка: только admin может изменять роли
router.use(requireRole('admin'));

export default router;
