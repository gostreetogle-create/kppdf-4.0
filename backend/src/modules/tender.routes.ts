// ========================================
// Tender Routes — CRUD для тендеров
// ========================================

import { createCrudRouter } from '../utils/crud-factory.js';
import { Tender } from './tender.model.js';

const router = createCrudRouter(Tender, {
  searchFields: ['number', 'title', 'customerName', 'noticeNumber'],
  sortFields: ['number', 'title', 'status', 'startPrice', 'createdAt', 'updatedAt'],
});

export default router;
