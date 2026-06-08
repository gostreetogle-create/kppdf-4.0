// ========================================
// PurchaseRequest Routes — CRUD для заявок на закупку
// ========================================

import { Router } from 'express';
import { createCrudRouter } from '../utils/crud-factory.js';
import { PurchaseRequest } from './purchase-request.model.js';
import { success } from '../utils/api-response.js';

const router = createCrudRouter(PurchaseRequest, {
  searchFields: ['number', 'entityName', 'entitySku', 'notes'],
  sortFields: ['number', 'status', 'quantity', 'createdAt', 'updatedAt'],
});

// PATCH /:id/status — смена статуса
router.patch('/:id/status', async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ['draft', 'pending', 'approved', 'ordered', 'fulfilled', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, data: null, message: `Недопустимый статус: ${status}` });
    }
    const doc = await PurchaseRequest.findByIdAndUpdate(
      req.params.id,
      { $set: { status } },
      { new: true }
    );
    if (!doc) return res.status(404).json({ success: false, data: null, message: 'Заявка не найдена' });
    res.json(success(doc, 'Статус обновлён'));
  } catch (err) {
    next(err);
  }
});

export default router;
