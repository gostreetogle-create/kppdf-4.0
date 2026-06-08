// ========================================
// StorageItem Routes — CRUD для инвентаря
// ========================================

import { createCrudRouter } from '../utils/crud-factory.js';
import { StorageItem } from './storage-item.model.js';

const router = createCrudRouter(StorageItem, {
  searchFields: ['name', 'description', 'notes'],
  sortFields: ['name', 'createdAt', 'updatedAt'],
});

export default router;
