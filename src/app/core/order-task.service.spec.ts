import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { firstValueFrom, of } from 'rxjs';
import { OrderTaskService } from './order-task.service';
import { WorkerService } from './worker.service';
import { ProductService } from './product.service';
import { ProductComponentService } from './product-component.service';
import { API_URL } from './api-url.token';
import type { OrderTask, Worker } from '../../../shared/types/index.js';

const SEED_WORKERS: Worker[] = [
  { id: 'wkr-1', lastName: 'Иванов', firstName: 'Иван', patronymic: 'Иванович', grade: 3, ratePerHour: 500, workTypeIds: ['wt-1'], isActive: true, createdAt: '', updatedAt: '' },
  { id: 'wkr-2', lastName: 'Петров', firstName: 'Пётр', patronymic: '', grade: 2, ratePerHour: 400, workTypeIds: ['wt-3'], isActive: true, createdAt: '', updatedAt: '' },
  { id: 'wkr-5', lastName: 'Сидоров', firstName: 'Семён', patronymic: '', grade: 2, ratePerHour: 350, workTypeIds: ['wt-9'], isActive: true, createdAt: '', updatedAt: '' },
];

function makeTask(overrides?: Partial<OrderTask>): OrderTask {
  return {
    id: 'ot-1', productionOrderId: 'po-1', componentId: 'c1', componentName: 'Стойка',
    workTypeId: 'wt-1', workTypeName: 'Лазерная резка',
    status: 'pending', plannedHours: 1, dependsOnTaskIds: [], sortOrder: 1,
    createdAt: '2026-06-01T10:00:00.000Z', updatedAt: '2026-06-01T10:00:00.000Z',
    ...overrides,
  };
}

function flushWorkers(httpMock: HttpTestingController) {
  httpMock.expectOne('/api/v1/workers').flush({ success: true, data: SEED_WORKERS });
}

function flushGetTasks(httpMock: HttpTestingController, tasks: OrderTask[], orderId?: string) {
  const req = orderId
    ? httpMock.expectOne(r => r.url === '/api/v1/order-tasks' && r.params.get('productionOrderId') === orderId)
    : httpMock.expectOne('/api/v1/order-tasks');
  req.flush({ success: true, data: tasks });
}

describe('OrderTaskService', () => {
  let service: OrderTaskService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: API_URL, useValue: '/api/v1' },
        { provide: ProductService, useValue: { getAll: () => of({ success: true, data: [{ id: 'prod-3', sku: 'MF0001', name: 'Скамейка', categoryId: 'cat-mf', productType: 'manufactured', unit: 'шт', weightKg: 30, hasPassport: true, hasDrawing: true, isActive: true, createdAt: '', updatedAt: '' }] }) } },
        { provide: ProductComponentService, useValue: { getRawItems: () => [] } },
        WorkerService,
        OrderTaskService,
      ],
    });
    service = TestBed.inject(OrderTaskService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => { httpMock.verify(); TestBed.resetTestingModule(); });

  it('getTasks возвращает все задачи через GET', async () => {
    const p = firstValueFrom(service.getTasks());
    flushGetTasks(httpMock, [makeTask()]);
    expect((await p).data!.length).toBe(1);
  });

  it('getTasks фильтрует по productionOrderId', async () => {
    const p = firstValueFrom(service.getTasks('po-1'));
    flushGetTasks(httpMock, [makeTask()], 'po-1');
    expect((await p).data!.length).toBe(1);
  });

  it('changeStatus меняет статус через PATCH', async () => {
    const p = firstValueFrom(service.changeStatus('ot-1', 'done'));
    httpMock.expectOne('/api/v1/order-tasks/ot-1/status').flush({ success: true, data: makeTask({ status: 'done' }) });
    const res = await p;
    expect(res.success).toBe(true);
    expect(res.data!.status).toBe('done');
  });

  it('changeStatus блокирует in_progress если есть незавершённые зависимости', async () => {
    const blocker = makeTask({ id: 'ot-block', status: 'pending', dependsOnTaskIds: [] });
    const dependent = makeTask({ id: 'ot-dep', status: 'pending', dependsOnTaskIds: ['ot-block'] });

    const p = firstValueFrom(service.changeStatus('ot-dep', 'in_progress'));
    httpMock.expectOne('/api/v1/order-tasks/ot-dep').flush({ success: true, data: dependent });
    await Promise.resolve(); // microtask: async-функция возобновляется и делает getTasks()
    flushGetTasks(httpMock, [blocker, dependent], 'po-1');

    const res = await p;
    expect(res.success).toBe(false);
    expect(res.message).toContain('Блокирующие');
  });

  it('changeStatus ошибка для невалидного статуса', async () => {
    const res = await firstValueFrom(service.changeStatus('ot-1', 'invalid' as unknown as 'pending'));
    expect(res.success).toBe(false);
  });

  it('assignWorker назначает исполнителя через PATCH', async () => {
    const p = firstValueFrom(service.assignWorker('ot-1', 'wkr-2'));
    httpMock.expectOne('/api/v1/order-tasks/ot-1/assign').flush({ success: true, data: makeTask({ workerId: 'wkr-2', status: 'assigned' }) });
    const res = await p;
    expect(res.data!.workerId).toBe('wkr-2');
    expect(res.data!.status).toBe('assigned');
  });

  it('updateDates обновляет плановые даты через PATCH', async () => {
    const p = firstValueFrom(service.updateDates('ot-1', '2026-07-01', '2026-07-05'));
    httpMock.expectOne('/api/v1/order-tasks/ot-1/dates').flush({ success: true, data: makeTask({ plannedStartDate: '2026-07-01', plannedEndDate: '2026-07-05' }) });
    const res = await p;
    expect(res.success).toBe(true);
  });

  it('getAvailableWorkers возвращает подходящих работников', async () => {
    const p = firstValueFrom(service.getAvailableWorkers('wt-1'));
    flushWorkers(httpMock);
    await new Promise(r => setTimeout(r, 5));
    flushGetTasks(httpMock, []);
    const res = await p;
    expect(res.success).toBe(true);
    expect(res.data!.length).toBeGreaterThanOrEqual(1);
    expect(res.data![0]!.fullName).toBeDefined();
  });

  it('autoAssignWorker назначает свободного', async () => {
    const p = firstValueFrom(service.autoAssignWorker('ot-1'));
    httpMock.expectOne('/api/v1/order-tasks/ot-1').flush({ success: true, data: makeTask() });
    await new Promise(r => setTimeout(r, 5));
    flushWorkers(httpMock);
    await new Promise(r => setTimeout(r, 5));
    flushGetTasks(httpMock, []);
    await new Promise(r => setTimeout(r, 5));
    httpMock.expectOne('/api/v1/order-tasks/ot-1/assign').flush({ success: true, data: makeTask({ workerId: 'wkr-1', status: 'assigned' }) });
    const res = await p;
    expect(res.success).toBe(true);
    expect(res.data!.workerId).toBe('wkr-1');
    expect(res.data!.status).toBe('assigned');
  });

  it('generateMissingDataTasks создаёт задачи через POST', async () => {
    const p = firstValueFrom(service.generateMissingDataTasks('po-1', [{ type: 'no_drawing', componentId: 'comp-1', componentName: 'Стойка', detail: 'Нет чертежа' }]));
    flushGetTasks(httpMock, [], 'po-1');
    await new Promise(r => setTimeout(r, 5));
    httpMock.expectOne('/api/v1/order-tasks').flush({ success: true, data: makeTask({ id: 'ot-new', workTypeName: '🧠 Разработка чертежа', notes: 'auto:no_drawing:comp-1' }) });
    const res = await p;
    expect(res.success).toBe(true);
    expect(res.data!.length).toBe(1);
    expect(res.data![0]!.workTypeName).toContain('чертежа');
  });

  it('generateFromComponents создаёт задачи с зависимостями', async () => {
    const components = [{
      id: 'comp-test', productId: 'prod-1', name: 'Тест', quantityPerProduct: 1, sortOrder: 1,
      materials: [], workTypes: [
        { id: 'cw-1', name: 'Резка', department: 'Цех', normHours: 0.5, sortOrder: 1 },
        { id: 'cw-2', name: 'Сварка', department: 'Цех', normHours: 1.0, sortOrder: 2 },
      ],
      createdAt: '', updatedAt: '',
    }];

    const p = firstValueFrom(service.generateFromComponents('po-test', components as Parameters<typeof service.generateFromComponents>[1]));
    flushGetTasks(httpMock, [], 'po-test');
    await new Promise(r => setTimeout(r, 5));
    httpMock.expectOne('/api/v1/order-tasks').flush({ success: true, data: makeTask({ id: 'ot-a', workTypeName: 'Резка', plannedHours: 0.5 }) });
    await new Promise(r => setTimeout(r, 5));
    httpMock.expectOne('/api/v1/order-tasks').flush({ success: true, data: makeTask({ id: 'ot-b', workTypeName: 'Сварка', plannedHours: 1, dependsOnTaskIds: ['ot-a'] }) });
    const res = await p;
    expect(res.success).toBe(true);
    expect(res.data!.length).toBe(2);
  });
});
