// ========================================
// Organization Routes — CRUD для организаций
// ========================================

import { createCrudRouter } from '../utils/crud-factory.js';
import { Organization } from './organization.model.js';

const router = createCrudRouter(Organization, {
  searchFields: ['name', 'shortName', 'inn'],
  sortFields: ['name', 'shortName', 'inn', 'createdAt', 'updatedAt'],
});

export default router;
