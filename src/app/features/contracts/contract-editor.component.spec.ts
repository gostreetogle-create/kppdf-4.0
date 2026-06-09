import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { MessageService, ConfirmationService } from 'primeng/api';
import { firstValueFrom } from 'rxjs';
import { ContractEditorComponent } from './contract-editor.component';
import { ContractService } from '../../core/contract.service';
import { OrganizationService } from '../../core/organization.service';
import { ClientService } from '../../core/client.service';
import { NotificationService } from '../../core/notification.service';
import type { ContractItem, Contract } from '../../../../shared/types/index.js';

function makeItem(overrides?: Partial<ContractItem>): ContractItem {
  return { id: 'ci-1', sourceProductId: 'p1', productSku: 'SP0001', productName: 'Стойка', productUnit: 'шт', quantity: 2, ...overrides };
}

const MOCK_CONTRACT: Contract = {
  id: 'c-1', number: 'Д-0001', organizationId: 'org-1', clientId: 'cli-1',
  status: 'draft', items: [makeItem()],
  notes: '', createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z',
};

describe('ContractEditorComponent', () => {
  let notification: NotificationService;
  let contractService: ContractService;
  let router: Router;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          { path: 'sales/contracts', component: ContractEditorComponent },
          { path: 'sales/contracts/new', component: ContractEditorComponent },
          { path: 'sales/contracts/:id/edit', component: ContractEditorComponent },
        ]),
        provideNoopAnimations(),
        provideHttpClient(),
        provideHttpClientTesting(),
        MessageService, ConfirmationService,
        NotificationService, ContractService, OrganizationService, ClientService,
      ],
    });
    await TestBed.compileComponents();
    notification = TestBed.inject(NotificationService);
    contractService = TestBed.inject(ContractService);
    router = TestBed.inject(Router);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => { httpMock.verify(); TestBed.resetTestingModule(); });

  function createComponent(): ContractEditorComponent {
    let c!: ContractEditorComponent;
    TestBed.runInInjectionContext(() => { c = new ContractEditorComponent(); });
    return c;
  }

  it('создаётся', () => { expect(createComponent()).toBeTruthy(); });

  it('значения по умолчанию', () => {
    const c = createComponent();
    expect(c.isNew()).toBe(true);
    expect(c.editStatus()).toBe('draft');
    expect(c.editOrganizationId()).toBe('');
    expect(c.editClientId()).toBe('');
    expect(c.editProposalId()).toBe('');
    expect(c.items().length).toBe(0);
    expect(c.statusOptions.length).toBe(4);
  });

  it('save создаёт договор', async () => {
    const c = createComponent();
    c.items.set([makeItem()]);
    c.editOrganizationId.set('org-1');
    c.editNotes.set('Тест');

    const navSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    const notifySpy = vi.spyOn(notification, 'success');

    const sp = c.save();
    httpMock.expectOne('/api/v1/contracts').flush({ success: true, data: MOCK_CONTRACT });
    await sp;

    expect(notifySpy).toHaveBeenCalledWith('Договор создан');
    expect(navSpy).toHaveBeenCalledWith(['/sales/contracts']);

    const gp = firstValueFrom(contractService.getContracts());
    httpMock.expectOne('/api/v1/contracts').flush({ success: true, data: [MOCK_CONTRACT] });
    const all = await gp;
    expect(all.data!.length).toBe(1);
    expect(all.data![0].number).toMatch(/^Д-\d{4}$/);
  });

  it('cancel навигирует обратно', () => {
    const c = createComponent();
    const spy = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    c.cancel();
    expect(spy).toHaveBeenCalledWith(['/sales/contracts']);
  });
});
