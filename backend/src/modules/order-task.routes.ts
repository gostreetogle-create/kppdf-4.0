// ========================================
// OrderTask Routes — CRUD + кастомные PATCH эндпоинты
// ========================================

import { Router, Request, Response, NextFunction } from 'express';
import { createCrudRouter } from '../utils/crud-factory.js';
import { OrderTask } from './order-task.model.js';
import { success } from '../utils/api-response.js';
import { AppError } from '../middleware/error-handler.js';

const router = createCrudRouter(OrderTask, {
  searchFields: ['componentName', 'workTypeName', 'notes'],
  sortFields: ['sortOrder', 'componentName', 'workTypeName', 'status', 'createdAt', 'updatedAt'],
  listFilter: (req) => {
    const filter: Record<string, unknown> = {};
    const orderId = req.query.productionOrderId;
    if (orderId) {
      filter.productionOrderId = Array.isArray(orderId) ? orderId[0] : orderId;
    }
    const status = req.query.status;
    if (status) {
      filter.status = Array.isArray(status) ? status[0] : status;
    }
    return filter;
  },
});

// ─── PATCH /:id/status — смена статуса задачи ───
router.patch('/:id/status', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status } = req.body;
    if (!status || !['pending', 'assigned', 'in_progress', 'done', 'cancelled'].includes(status)) {
      throw new AppError('Недопустимый статус', 400);
    }

    const update: Record<string, unknown> = { status };
    const now = new Date().toISOString().substring(0, 10);

    if (status === 'done') {
      update.actualEndDate = now;
    }
    if (status === 'in_progress') {
      // actualStartDate только если ещё не установлена
      const task = await OrderTask.findById(req.params.id);
      if (task && !task.actualStartDate) {
        update.actualStartDate = now;
      }
    }

    const doc = await OrderTask.findByIdAndUpdate(
      req.params.id,
      { $set: update },
      { new: true, runValidators: true }
    );

    if (!doc) throw new AppError('Задача не найдена', 404);
    res.json(success(doc, `Статус изменён на «${status}»`));
  } catch (err) {
    next(err);
  }
});

// ─── PATCH /:id/assign — назначение исполнителя ───
router.patch('/:id/assign', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { workerId } = req.body;
    if (!workerId) throw new AppError('workerId обязателен', 400);

    const doc = await OrderTask.findByIdAndUpdate(
      req.params.id,
      { $set: { workerId, status: 'assigned' } },
      { new: true, runValidators: true }
    );

    if (!doc) throw new AppError('Задача не найдена', 404);
    res.json(success(doc, 'Исполнитель назначен'));
  } catch (err) {
    next(err);
  }
});

// ─── PATCH /:id/dates — обновление плановых дат (drag-and-drop в Ганте) ───
router.patch('/:id/dates', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { plannedStartDate, plannedEndDate } = req.body;
    const update: Record<string, unknown> = {};
    if (plannedStartDate !== undefined) update.plannedStartDate = plannedStartDate;
    if (plannedEndDate !== undefined) update.plannedEndDate = plannedEndDate;

    const doc = await OrderTask.findByIdAndUpdate(
      req.params.id,
      { $set: update },
      { new: true, runValidators: true }
    );

    if (!doc) throw new AppError('Задача не найдена', 404);
    res.json(success(doc, 'Даты обновлены'));
  } catch (err) {
    next(err);
  }
});

export default router;
