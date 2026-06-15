// ========================================
// Inventory Routes — остатки и движения
// ========================================

import { Router, Request, Response, NextFunction } from 'express';
import { InventoryItem, InventoryMovement } from './inventory.model.js';
import { success, error } from '../utils/api-response.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

// Все endpoints требуют аутентификации (согласовано с другими CRUD-роутами)
router.use(authMiddleware);

// GET /items — список остатков (фильтр по warehouseId)
router.get('/items', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filter: Record<string, unknown> = {};
    if (req.query.warehouseId) filter.warehouseId = req.query.warehouseId;
    const items = await InventoryItem.find(filter).sort({ entityName: 1 }).lean();
    res.json(success(items));
  } catch (err) {
    next(err);
  }
});

// GET /items/:id — один остаток
router.get('/items/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const item = await InventoryItem.findById(req.params.id).lean();
    if (!item) return res.status(404).json(error('Остаток не найден'));
    res.json(success(item));
  } catch (err) {
    next(err);
  }
});

// GET /movements — список движений
router.get('/movements', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filter: Record<string, unknown> = {};
    if (req.query.warehouseId) {
      filter.$or = [
        { warehouseId: req.query.warehouseId },
        { toWarehouseId: req.query.warehouseId },
      ];
    }
    const limit = Math.min(100, parseInt(req.query.limit as string) || 50);
    const movements = await InventoryMovement.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
    res.json(success(movements));
  } catch (err) {
    next(err);
  }
});

// POST /movements — создать движение (автоматически обновляет остаток)
router.post('/movements', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = req.body;
    const movement = await InventoryMovement.create(data);

    // Обновляем остаток
    if (data.type === 'in' || data.type === 'adjustment') {
      await upsertItem(data.warehouseId, data.zoneName, data.entityType, data.entityId,
        data.entityName, data.entitySku, data.entityUnit, data.quantity);
    } else if (data.type === 'out' || data.type === 'write_off') {
      await upsertItem(data.warehouseId, data.zoneName, data.entityType, data.entityId,
        data.entityName, data.entitySku, data.entityUnit, -data.quantity);
    } else if (data.type === 'transfer' && data.toWarehouseId) {
      await upsertItem(data.warehouseId, data.zoneName, data.entityType, data.entityId,
        data.entityName, data.entitySku, data.entityUnit, -data.quantity);
      await upsertItem(data.toWarehouseId, data.toZoneName, data.entityType, data.entityId,
        data.entityName, data.entitySku, data.entityUnit, data.quantity);
    }

    res.status(201).json(success(movement, 'Движение зарегистрировано'));
  } catch (err) {
    next(err);
  }
});

// Вспомогательная функция: обновить или создать остаток (атомарная операция)
async function upsertItem(
  warehouseId: string, zoneName: string | undefined,
  entityType: string, entityId: string,
  entityName: string, entitySku: string | undefined,
  entityUnit: string, delta: number,
): Promise<void> {
  const filter = {
    warehouseId,
    zoneName: zoneName || '',
    entityType,
    entityId,
  };

  const now = new Date().toISOString();

  if (delta > 0) {
    // Приход или положительная корректировка — создаём или увеличиваем
    const result = await InventoryItem.findOneAndUpdate(
      filter,
      {
        $inc: { quantity: delta },
        $set: { entityName, entitySku: entitySku || '', entityUnit, updatedAt: now },
        $setOnInsert: { ...filter },
      },
      { upsert: true, new: true }
    );

    // Если после корректировки количество <= 0 — удаляем
    if (result && result.quantity <= 0) {
      await InventoryItem.findByIdAndDelete(result._id);
    }
  } else {
    // Расход или отрицательная корректировка
    const existing = await InventoryItem.findOne(filter);
    if (!existing) return;

    const newQty = existing.quantity + delta;
    if (newQty <= 0) {
      await InventoryItem.findByIdAndDelete(existing._id);
    } else {
      await InventoryItem.findByIdAndUpdate(existing._id, {
        $set: { quantity: newQty, entityName, entitySku: entitySku || '', entityUnit, updatedAt: now }
      });
    }
  }
}

export default router;
