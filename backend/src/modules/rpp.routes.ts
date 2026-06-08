// ========================================
// Rpp Routes — CRUD для реестра РПП
// ========================================

import { createCrudRouter } from '../utils/crud-factory.js';
import { Rpp } from './rpp.model.js';

const router = createCrudRouter(Rpp, {
  searchFields: ['productName', 'productSku', 'registryNumber'],
  sortFields: ['productName', 'status', 'createdAt', 'updatedAt'],
});

export default router;
