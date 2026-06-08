// ========================================
// ProductCategory Routes — CRUD для категорий товаров
// ========================================

import { createCrudRouter } from '../utils/crud-factory.js';
import { ProductCategory } from './product-category.model.js';

const router = createCrudRouter(ProductCategory, {
  searchFields: ['name', 'prefix', 'description'],
  sortFields: ['sortOrder', 'name', 'prefix', 'createdAt'],
});

export default router;
