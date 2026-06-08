// ========================================
// SupplierOrder Routes — CRUD для заказов поставщикам
// ========================================

import { Router } from 'express';
import { createCrudRouter } from '../utils/crud-factory.js';
import { SupplierOrder } from './supplier-order.model.js';
import { success } from '../utils/api-response.js';

const router = createCrudRouter(SupplierOrder, {
  searchFields: ['number', 'notes'],
  sortFields: ['number', 'status', 'totalAmount', 'expectedDate', 'createdAt', 'updatedAt'],
});

// PATCH /:id/status — смена статуса
router.patch('/:id/status', async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ['draft', 'sent', 'confirmed', 'partial', 'received', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, data: null, message: `Недопустимый статус: ${status}` });
    }
    const doc = await SupplierOrder.findByIdAndUpdate(
      req.params.id,
      { $set: { status } },
      { new: true }
    );
    if (!doc) return res.status(404).json({ success: false, data: null, message: 'Заказ не найден' });
    res.json(success(doc, 'Статус обновлён'));
  } catch (err) {
    next(err);
  }
});

export default router;
