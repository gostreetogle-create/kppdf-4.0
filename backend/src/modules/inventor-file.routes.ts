// ========================================
// InventorFile Routes — CRUD для CAD-файлов
// ========================================

import { createCrudRouter } from '../utils/crud-factory.js';
import { InventorFile } from './inventor-file.model.js';

const router = createCrudRouter(InventorFile, {
  searchFields: ['fileName', 'productName', 'productSku', 'author'],
  sortFields: ['fileName', 'productName', 'createdAt', 'updatedAt'],
});

export default router;
