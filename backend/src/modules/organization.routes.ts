// ========================================
// Organization Routes — CRUD для организаций
// ========================================

import { Router } from 'express';
import { createCrudRouter } from '../utils/crud-factory.js';
import { Organization } from './organization.model.js';

const router = createCrudRouter(Organization, {
  searchFields: ['name', 'shortName', 'inn', 'contactPerson'],
  sortFields: ['name', 'shortName', 'inn', 'contactPerson', 'createdAt', 'updatedAt'],
  // Фильтр по slug роли контрагента: ?role=supplier
  // NOTE: для реальной работы нужно резолвить slug → ID через CounterpartyRole модель
  listFilter: (req) => {
    const role = req.query.role;
    if (role) {
      const roleStr = Array.isArray(role) ? role[0] : role;
      // Фильтр по slug роли: ищем организации, у которых массив counterpartyRoleIds содержит значение
      return { counterpartyRoleIds: { $in: [roleStr] } };
    }
    return {};
  },
});

export default router;
