// ========================================
// User Routes — CRUD для пользователей (admin только)
// ========================================

import { createCrudRouter } from '../utils/crud-factory.js';
import { requireRole } from '../middleware/auth.js';
import { User } from './user.model.js';

const router = createCrudRouter(User, {
  searchFields: ['username', 'displayName', 'email', 'phone'],
  sortFields: ['username', 'displayName', 'role', 'createdAt', 'updatedAt'],
  allowedFields: ['username', 'displayName', 'email', 'role', 'permissions', 'isActive'],
});

// Только admin может управлять пользователями
router.use(requireRole('admin'));

export default router;
