// ========================================
// Contract Routes — CRUD для договоров
// ========================================

import { Router } from 'express';
import { createCrudRouter } from '../utils/crud-factory.js';
import { Contract } from './contract.model.js';
import { success } from '../utils/api-response.js';

const router = createCrudRouter(Contract, {
  searchFields: ['number', 'notes'],
  sortFields: ['number', 'status', 'createdAt', 'updatedAt'],
});

// PATCH /:id/status — смена статуса
router.patch('/:id/status', async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ['draft', 'active', 'completed', 'terminated'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, data: null, message: `Недопустимый статус: ${status}` });
    }
    const doc = await Contract.findByIdAndUpdate(
      req.params.id,
      { $set: { status } },
      { new: true }
    );
    if (!doc) return res.status(404).json({ success: false, data: null, message: 'Договор не найден' });
    res.json(success(doc, 'Статус обновлён'));
  } catch (err) {
    next(err);
  }
});

export default router;
