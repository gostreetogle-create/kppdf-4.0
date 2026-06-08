// ========================================
// DocType Routes — CRUD для типов документов
// ========================================

import { createCrudRouter } from '../utils/crud-factory.js';
import { DocTypeDef } from './doc-type.model.js';

const router = createCrudRouter(DocTypeDef, {
  searchFields: ['name', 'slug', 'description'],
  sortFields: ['name', 'slug', 'createdAt', 'updatedAt'],
});

export default router;
