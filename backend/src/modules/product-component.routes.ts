// ========================================
// ProductComponent Routes — CRUD для компонентов товаров
// ========================================

import { Router } from 'express';
import { createCrudRouter } from '../utils/crud-factory.js';
import { ProductComponent } from './product-component.model.js';
import { success } from '../utils/api-response.js';

const router = createCrudRouter(ProductComponent, {
  searchFields: ['name', 'description'],
  sortFields: ['name', 'sortOrder', 'createdAt', 'updatedAt'],
});

// GET /by-product/:productId — компоненты по товару
router.get('/by-product/:productId', async (req, res, next) => {
  try {
    const components = await ProductComponent.find({ productId: req.params.productId })
      .sort({ sortOrder: 1 })
      .lean();
    res.json(success(components));
  } catch (err) {
    next(err);
  }
});

export default router;
