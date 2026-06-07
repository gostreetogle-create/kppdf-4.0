import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { MessageService, ConfirmationService } from 'primeng/api';
import { firstValueFrom } from 'rxjs';
import { ContractEditorComponent } from './contract-editor.component';
import { ContractService } from '../../core/contract.service';
import { OrganizationService } from '../../core/organization.service';
import { ClientService } from '../../core/client.service';
import { NotificationService } from '../../core/notification.service';
import type { ContractItem } from '../../../../shared/types/index.js';

function makeItem(overrides?: Partial<ContractItem>): ContractItem {
  return { id: 'ci-1', sourceProductId: 'p1', productSku: 'SP0001', productName: 'Стойка', productUnit: 'шт', quantity: 2, ...overrides };
}

describe('ContractEditorComponent', () => {
  let notification: NotificationService;
  let contractService: ContractService;
  let router: Router;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          { path: 'sales/contracts', component: ContractEditorComponent },
          { path: 'sales/contracts/new', component: ContractEditorComponent },
          { path: 'sales/contracts/:id/edit', component: ContractEditorComponent },
        ]),
        provideNoopAnimations(),
        MessageService, ConfirmationService,
        NotificationService, ContractService, OrganizationService, ClientService,
      ],
    });
    await TestBed.compileComponents();
    notification = TestBed.inject(NotificationService);
    contractService = TestBed.inject(ContractService);
    router = TestBed.inject(Router);
  });

  afterEach(() => TestBed.resetTestingModule());

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
    await c.save();

    expect(notifySpy).toHaveBeenCalledWith('Договор создан');
    expect(navSpy).toHaveBeenCalledWith(['/sales/contracts']);

    const all = await firstValueFrom(contractService.getContracts());
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
