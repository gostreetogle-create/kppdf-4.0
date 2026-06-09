import { describe, it, expect, beforeEach } from 'vitest';
import { Injector } from '@angular/core';
import { of } from 'rxjs';
import { firstValueFrom } from 'rxjs';
import { OrderTaskService } from './order-task.service';
import { WorkerService } from './worker.service';
import { ProductService } from './product.service';
import { ProductComponentService } from './product-component.service';
import type { Worker } from '../../../shared/types/index.js';

const SEED_WORKERS: Worker[] = [
  { id: 'wkr-1', lastName: 'Иванов', firstName: 'Иван', patronymic: 'Иванович', grade: 3, ratePerHour: 500, workTypeIds: ['wt-1'], isActive: true, createdAt: '', updatedAt: '' },
  { id: 'wkr-2', lastName: 'Петров', firstName: 'Пётр', patronymic: '', grade: 2, ratePerHour: 400, workTypeIds: ['wt-3'], isActive: true, createdAt: '', updatedAt: '' },
  { id: 'wkr-5', lastName: 'Сидоров', firstName: 'Семён', patronymic: '', grade: 2, ratePerHour: 350, workTypeIds: ['wt-9'], isActive: true, createdAt: '', updatedAt: '' },
];

function makeInjector() {
  return Injector.create({
    providers: [
      OrderTaskService,
      { provide: WorkerService, useValue: { getAll: () => of({ success: true, data: SEED_WORKERS }) } },
      { provide: ProductService, useValue: { getAll: () => of({ success: true, data: [{ id: 'prod-3', sku: 'MF0001', name: 'Скамейка СК-180', categoryId: 'cat-mf', productType: 'manufactured', unit: 'шт', weightKg: 30, hasPassport: true, hasDrawing: true, isActive: true, createdAt: '', updatedAt: '' }] }) } },
      { provide: ProductComponentService, useValue: { getRawItems: () => [] } },
    ],
  });
}

describe('OrderTaskService', () => {
  let svc: OrderTaskService;

  beforeEach(() => {
    svc = makeInjector().get(OrderTaskService);
  });

  it('содержит seed-данные при создании', () => {
    expect(svc.items.length).toBe(8);
    expect(svc.items[0]!.dependsOnTaskIds).toEqual([]);
    expect(svc.items[1]!.dependsOnTaskIds).toEqual(['ot-1']);
  });

  it('возвращает задачи с клонированием', async () => {
    svc.items = [];
    const r = await firstValueFrom(svc.getTasks());
    expect(r.success).toBe(true);
    expect(Array.isArray(r.data)).toBe(true);
  });

  it('фильтрует по заказу', async () => {
    svc.items = [
      { id: 't1', productionOrderId: 'po-1', componentId: 'c1', componentName: 'A', workTypeId: 'wt1', workTypeName: 'W', status: 'pending', plannedHours: 1, dependsOnTaskIds: [], sortOrder: 1, createdAt: '', updatedAt: '' },
      { id: 't2', productionOrderId: 'po-2', componentId: 'c2', componentName: 'B', workTypeId: 'wt2', workTypeName: 'X', status: 'pending', plannedHours: 2, dependsOnTaskIds: [], sortOrder: 2, createdAt: '', updatedAt: '' },
    ];
    const r = await firstValueFrom(svc.getTasks('po-1'));
    expect(r.success).toBe(true);
    expect(r.data.length).toBe(1);
    expect(r.data[0]!.componentName).toBe('A');
  });

  it('changeStatus: нельзя начать, если есть незавершённые зависимости', async () => {
    svc.items = [
      { id: 't1', productionOrderId: 'po-1', componentId: 'c1', componentName: 'A', workTypeId: 'wt1', workTypeName: 'W', status: 'pending', plannedHours: 1, dependsOnTaskIds: [], sortOrder: 1, createdAt: '', updatedAt: '' },
      { id: 't2', productionOrderId: 'po-1', componentId: 'c2', componentName: 'B', workTypeId: 'wt2', workTypeName: 'X', status: 'pending', plannedHours: 2, dependsOnTaskIds: ['t1'], sortOrder: 2, createdAt: '', updatedAt: '' },
    ];
    const r = await firstValueFrom(svc.changeStatus('t2', 'in_progress'));
    expect(r.success).toBe(false);
    expect(r.message).toContain('Блокирующие');
  });

  it('changeStatus: можно начать, если все зависимости done', async () => {
    svc.items = [
      { id: 't1', productionOrderId: 'po-1', componentId: 'c1', componentName: 'A', workTypeId: 'wt1', workTypeName: 'W', status: 'done', plannedHours: 1, actualHours: 1, dependsOnTaskIds: [], sortOrder: 1, createdAt: '', updatedAt: '' },
      { id: 't2', productionOrderId: 'po-1', componentId: 'c2', componentName: 'B', workTypeId: 'wt2', workTypeName: 'X', status: 'pending', plannedHours: 2, dependsOnTaskIds: ['t1'], sortOrder: 2, createdAt: '', updatedAt: '' },
    ];
    const r = await firstValueFrom(svc.changeStatus('t2', 'in_progress'));
    expect(r.success).toBe(true);
    expect(r.data.status).toBe('in_progress');
  });

  it('autoAssignWorker: находит свободного и назначает', async () => {
    svc.items = [
      { id: 't1', productionOrderId: 'po-1', componentId: 'c1', componentName: 'A', workTypeId: 'wt-1', workTypeName: 'Лазерная резка', status: 'pending', plannedHours: 1, dependsOnTaskIds: [], sortOrder: 1, createdAt: '', updatedAt: '' },
    ];
    const r = await firstValueFrom(svc.autoAssignWorker('t1'));
    expect(r.success).toBe(true);
    expect(r.data.workerId).toBe('wkr-1');
    expect(r.data.status).toBe('assigned');
  });

  it('autoAssignWorker: ошибка если уже назначен', async () => {
    svc.items = [
      { id: 't1', productionOrderId: 'po-1', componentId: 'c1', componentName: 'A', workTypeId: 'wt-1', workTypeName: 'W', workerId: 'wkr-1', status: 'assigned', plannedHours: 1, dependsOnTaskIds: [], sortOrder: 1, createdAt: '', updatedAt: '' },
    ];
    svc.delayMs = 0; // ускоряем
    const r = await firstValueFrom(svc.autoAssignWorker('t1'));
    expect(r.success).toBe(false);
    expect(r.message).toContain('уже назначен');
  });

  it('assignWorker: ручное назначение', async () => {
    svc.items = [
      { id: 't1', productionOrderId: 'po-1', componentId: 'c1', componentName: 'A', workTypeId: 'wt-1', workTypeName: 'W', status: 'pending', plannedHours: 1, dependsOnTaskIds: [], sortOrder: 1, createdAt: '', updatedAt: '' },
    ];
    const r = await firstValueFrom(svc.assignWorker('t1', 'wkr-2'));
    expect(r.success).toBe(true);
    expect(r.data.workerId).toBe('wkr-2');
    expect(r.data.status).toBe('assigned');
  });

  it('getAvailableWorkers: возвращает подходящих работников', async () => {
    const r = await firstValueFrom(svc.getAvailableWorkers('wt-1'));
    expect(r.success).toBe(true);
    expect(r.data.length).toBeGreaterThanOrEqual(1);
    expect(r.data[0]!.fullName).toBeDefined();
  });

  it('checkMissingData: находит проблемы для prod-3', async () => {
    const issues = await firstValueFrom(svc.checkMissingData('po-2', {
      id: 'po-2', number: 'ПЗ-0002', contractId: 'ctr-2', productId: 'prod-3', productName: 'Скамейка СК-180', productSku: 'MF0001', quantity: 20,
      status: 'accepted', plannedStartDate: '', plannedEndDate: '', createdAt: '', updatedAt: '',
    }));
    expect(issues.success).toBe(true);
  });

  it('generateMissingDataTasks: создаёт задачи', async () => {
    svc.items = [];
    const issues = [{ type: 'no_drawing' as const, componentId: 'comp-1', componentName: 'Стойка', detail: 'Нет чертежа' }];
    const r = await firstValueFrom(svc.generateMissingDataTasks('po-1', issues));
    expect(r.success).toBe(true);
    expect(r.data.length).toBe(1);
    expect(r.data[0]!.workTypeName).toContain('чертежа');
    expect(r.data[0]!.notes).toBe('auto:no_drawing:comp-1');
  });

  it('generateFromComponents: добавляет зависимости между задачами', async () => {
    svc.items = [];
    const components = [{
      id: 'comp-test', productId: 'prod-1', name: 'Тест', quantityPerProduct: 1, sortOrder: 1,
      materials: [], workTypes: [
        { id: 'cw-1', name: 'Резка', department: 'Цех', normHours: 0.5, sortOrder: 1 },
        { id: 'cw-2', name: 'Сварка', department: 'Цех', normHours: 1.0, sortOrder: 2 },
      ],
      createdAt: '', updatedAt: '',
    }    ] as Parameters<typeof svc.generateFromComponents>[1];
    const r = await firstValueFrom(svc.generateFromComponents('po-test', components));
    expect(r.success).toBe(true);
    expect(r.data.length).toBe(2);
    expect(r.data[1]!.dependsOnTaskIds).toEqual([r.data[0]!.id]);
  });
});
