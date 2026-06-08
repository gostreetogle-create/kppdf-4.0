// ========================================
// Invoice Routes — CRUD для входящих счетов
// ========================================

import { Router } from 'express';
import { createCrudRouter } from '../utils/crud-factory.js';
import { Invoice } from './invoice.model.js';
import { success } from '../utils/api-response.js';

const router = createCrudRouter(Invoice, {
  searchFields: ['number', 'notes'],
  sortFields: ['number', 'date', 'status', 'amount', 'createdAt', 'updatedAt'],
});

// PATCH /:id/status — смена статуса
router.patch('/:id/status', async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'paid', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, data: null, message: `Недопустимый статус: ${status}` });
    }
    const doc = await Invoice.findByIdAndUpdate(
      req.params.id,
      { $set: { status } },
      { new: true }
    );
    if (!doc) return res.status(404).json({ success: false, data: null, message: 'Счёт не найден' });
    res.json(success(doc, 'Статус обновлён'));
  } catch (err) {
    next(err);
  }
});

export default router;
