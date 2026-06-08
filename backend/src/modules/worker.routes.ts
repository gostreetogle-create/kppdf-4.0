// ========================================
// Worker Routes — CRUD для работников
// ========================================

import { createCrudRouter } from '../utils/crud-factory.js';
import { Worker } from './worker.model.js';

const router = createCrudRouter(Worker, {
  searchFields: ['lastName', 'firstName', 'workTypeIds'],
  sortFields: ['lastName', 'firstName', 'grade', 'createdAt', 'updatedAt'],
  listFilter: (req) => {
    const workTypeId = req.query.workTypeId;
    if (workTypeId) {
      const val = Array.isArray(workTypeId) ? workTypeId[0] : workTypeId;
      return { workTypeIds: { $in: [val] } };
    }
    return {};
  },
});

export default router;
