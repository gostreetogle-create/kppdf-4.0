// ========================================
// CommercialProposal Routes — CRUD для КП
// ========================================

import { Router } from 'express';
import { createCrudRouter } from '../utils/crud-factory.js';
import { CommercialProposal } from './commercial-proposal.model.js';
import { success } from '../utils/api-response.js';

const router = createCrudRouter(CommercialProposal, {
  searchFields: ['number', 'notes'],
  sortFields: ['number', 'status', 'totalAmount', 'createdAt', 'updatedAt'],
});

// PATCH /:id/status — смена статуса
router.patch('/:id/status', async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ['draft', 'sent', 'approved', 'rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, data: null, message: `Недопустимый статус: ${status}` });
    }
    const doc = await CommercialProposal.findByIdAndUpdate(
      req.params.id,
      { $set: { status } },
      { new: true }
    );
    if (!doc) return res.status(404).json({ success: false, data: null, message: 'КП не найдено' });
    res.json(success(doc, 'Статус обновлён'));
  } catch (err) {
    next(err);
  }
});

export default router;
