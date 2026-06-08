// ========================================
// User Routes — CRUD для пользователей
// ========================================

import { createCrudRouter } from '../utils/crud-factory.js';
import { User } from './user.model.js';

const router = createCrudRouter(User, {
  searchFields: ['username', 'displayName', 'email', 'phone'],
  sortFields: ['username', 'displayName', 'role', 'createdAt', 'updatedAt'],
});

export default router;
