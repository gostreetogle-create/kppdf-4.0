// ========================================
// DocumentTemplate Routes — CRUD для шаблонов документов
// ========================================

import { createCrudRouter } from '../utils/crud-factory.js';
import { DocumentTemplate } from './document-template.model.js';

const router = createCrudRouter(DocumentTemplate, {
  searchFields: ['name', 'description'],
  sortFields: ['name', 'docType', 'createdAt', 'updatedAt'],
});

export default router;
