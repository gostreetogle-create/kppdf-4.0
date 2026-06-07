import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { MessageService, ConfirmationService } from 'primeng/api';
import { firstValueFrom } from 'rxjs';
import { ContractListComponent } from './contract-list.component';
import { ContractService } from '../../core/contract.service';
import { NotificationService } from '../../core/notification.service';
import type { Contract } from '../../../../shared/types/index.js';

describe('ContractListComponent', () => {
  let contractService: ContractService;
  let router: Router;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          { path: 'sales/contracts', component: ContractListComponent },
          { path: 'sales/contracts/new', component: ContractListComponent },
          { path: 'sales/contracts/:id/edit', component: ContractListComponent },
        ]),
        provideNoopAnimations(),
        MessageService, ConfirmationService,
        NotificationService, ContractService,
      ],
    });
    await TestBed.compileComponents();
    contractService = TestBed.inject(ContractService);
    router = TestBed.inject(Router);
  });

  afterEach(() => TestBed.resetTestingModule());

  function createComponent(): ContractListComponent {
    let c!: ContractListComponent;
    TestBed.runInInjectionContext(() => { c = new ContractListComponent(); });
    return c;
  }

  async function seedContract(status: 'draft' | 'active' = 'draft'): Promise<Contract> {
    const res = await firstValueFrom(contractService.createContract({
      organizationId: 'org-1', clientId: 'cli-1', status,
      items: [{ id: 'ci-1', sourceProductId: 'p1', productSku: 'SP0001', productName: 'Стойка', productUnit: 'шт', quantity: 2 }],
    }));
    return res.data!;
  }

  it('создаётся', () => { expect(createComponent()).toBeTruthy(); });

  it('значения по умолчанию', async () => {
    const c = createComponent();
    await c.load();
    expect(c.loading()).toBe(false);
    expect(c.breadcrumbs.length).toBe(2);
    expect(c.tableColumns.length).toBe(4);
    expect(c.statusActions.length).toBe(3);
  });

  it('load загружает договоры', async () => {
    await seedContract();
    const c = createComponent();
    await c.load();
    expect(c.rows().length).toBe(1);
    expect(c.rows()[0].statusLabel).toBe('Черновик');
  });

  it('statusActions: draft → только Активировать', () => {
    const c = createComponent();
    const row = { status: 'draft' } as Contract;
    expect(c.statusActions[0].visible!(row)).toBe(true);
    expect(c.statusActions[1].visible!(row)).toBe(false);
    expect(c.statusActions[2].visible!(row)).toBe(false);
  });

  it('statusActions: active → Завершить + Расторгнуть', () => {
    const c = createComponent();
    const row = { status: 'active' } as Contract;
    expect(c.statusActions[0].visible!(row)).toBe(false);
    expect(c.statusActions[1].visible!(row)).toBe(true);
    expect(c.statusActions[2].visible!(row)).toBe(true);
  });

  it('onEditRow навигирует', () => {
    const c = createComponent();
    const spy = vi.spyOn(router, 'navigate');
    c.onEditRow({ id: 'ct-1' } as Contract);
    expect(spy).toHaveBeenCalledWith(['/sales/contracts', 'ct-1', 'edit']);
  });

  it('changeStatus меняет статус', async () => {
    const draft = await seedContract('draft');
    const res = await firstValueFrom(contractService.changeStatus(draft.id, 'active'));
    expect(res.success).toBe(true);
    expect(res.data!.status).toBe('active');
  });
});
