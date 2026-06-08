// ========================================
// Product Routes — CRUD для товаров
// ========================================

import { Router } from 'express';
import { createCrudRouter } from '../utils/crud-factory.js';
import { Product } from './product.model.js';

const router = createCrudRouter(Product, {
  searchFields: ['name', 'sku', 'description', 'material'],
  sortFields: ['name', 'sku', 'createdAt', 'updatedAt', 'basePrice', 'unit'],
});

export default router;
