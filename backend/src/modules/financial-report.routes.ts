// ========================================
// FinancialReport Routes — CRUD для отчётов
// ========================================

import { createCrudRouter } from '../utils/crud-factory.js';
import { FinancialReport } from './financial-report.model.js';

const router = createCrudRouter(FinancialReport, {
  searchFields: ['title', 'reportType', 'notes'],
  sortFields: ['title', 'periodStart', 'createdAt', 'updatedAt'],
});

export default router;
