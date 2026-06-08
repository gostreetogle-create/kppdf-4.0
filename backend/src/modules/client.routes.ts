// ========================================
// Client Routes — CRUD для клиентов
// ========================================

import { createCrudRouter } from '../utils/crud-factory.js';
import { Client } from './client.model.js';

const router = createCrudRouter(Client, {
  searchFields: ['lastName', 'firstName', 'phone', 'email', 'inn'],
  sortFields: ['lastName', 'firstName', 'createdAt', 'updatedAt'],
});

export default router;
