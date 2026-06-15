// ========================================
// Organization Routes — CRUD для организаций
// ========================================

import { Router } from 'express';
import { createCrudRouter } from '../utils/crud-factory.js';
import { Organization } from './organization.model.js';

const router = createCrudRouter(Organization, {
  searchFields: ['name', 'shortName', 'inn', 'contactPerson'],
  sortFields: ['name', 'shortName', 'inn', 'contactPerson', 'createdAt', 'updatedAt'],
  allowedFields: ['name', 'shortName', 'inn', 'contactPerson', 'phone', 'email', 'address', 'counterpartyRoleIds'],
  // Фильтр по slug роли контрагента: ?role=supplier
  listFilter: (req) => {
    const role = req.query.role;
    if (role) {
      const roleStr = Array.isArray(role) ? role[0] : role;
      return { counterpartyRoleIds: { $in: [roleStr] } };
    }
    return {};
  },
});

export default router;
