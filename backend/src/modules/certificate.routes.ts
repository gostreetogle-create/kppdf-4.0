// ========================================
// Certificate Routes — CRUD для сертификатов
// ========================================

import { createCrudRouter } from '../utils/crud-factory.js';
import { Certificate } from './certificate.model.js';

const router = createCrudRouter(Certificate, {
  searchFields: ['number', 'productNames', 'issuedBy'],
  sortFields: ['number', 'expiryDate', 'status', 'createdAt', 'updatedAt'],
});

export default router;
