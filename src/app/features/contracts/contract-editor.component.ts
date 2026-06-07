import { Component, inject, signal, computed, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { firstValueFrom } from 'rxjs';

import { KpInputComponent } from '../../shared/ui/kp-input.component';
import { KpSelectComponent, SelectOption } from '../../shared/ui/kp-select.component';
import { KpButtonComponent } from '../../shared/ui/kp-button.component';
import { KpBreadcrumbComponent } from '../../shared/ui/kp-breadcrumb.component';
import { KpCardComponent } from '../../shared/ui/kp-card.component';
import { KpToastComponent } from '../../shared/ui/kp-toast.component';
import { NotificationService } from '../../core/notification.service';
import { ContractService } from '../../core/contract.service';
import { CommercialProposalService } from '../../core/commercial-proposal.service';
import { OrganizationService } from '../../core/organization.service';
import { ClientService } from '../../core/client.service';
import type { Contract, ContractStatus, ContractItem, CommercialProposal, Organization, Client } from '../../../../shared/types/index.js';

const STATUS_OPTIONS: SelectOption[] = [
  { value: 'draft', label: 'Черновик' },
  { value: 'active', label: 'Действует' },
  { value: 'completed', label: 'Завершён' },
  { value: 'terminated', label: 'Расторгнут' },
];

@Component({
  selector: 'app-contract-editor',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    KpInputComponent, KpSelectComponent, KpButtonComponent,
    KpBreadcrumbComponent, KpCardComponent, KpToastComponent,
  ],

  template: `
    <kp-toast />

    <div class="ct-editor">
      <kp-breadcrumb [items]="breadcrumbs" />

      <div class="ct-editor__header">
        <h1 class="ct-editor__title">
          {{ isNew() ? 'Новый договор' : 'Редактирование ' + contractNumber() }}
        </h1>
        <div class="ct-editor__header-actions">
          @if (!isNew()) {
            <kp-select
              label="Статус"
              [options]="statusOptions"
              [(ngModel)]="editStatus"
            />
          }
          <kp-button
            label="Сохранить"
            lucideIcon="check"
            [loading]="saving()"
            (buttonClick)="save()"
          />
          <kp-button
            label="Отмена"
            lucideIcon="x"
            severity="secondary"
            (buttonClick)="cancel()"
          />
        </div>
      </div>

      <kp-card>
        <!-- Связь с КП и контрагенты -->
        <div class="ct-editor__section">
          <h3 class="ct-editor__section-title">Основание</h3>
          <div class="ct-editor__row">
            <kp-select
              label="Создать из КП"
              [options]="proposalOptions()"
              [(ngModel)]="editProposalId"
              placeholder="Без привязки к КП"
            />
          </div>
          <div class="ct-editor__row ct-editor__row--mt">
            <kp-select
              label="Организация"
              [options]="orgOptions()"
              [(ngModel)]="editOrganizationId"
              placeholder="Выберите организацию"
            />
            <kp-select
              label="Контактное лицо"
              [options]="clientOptions()"
              [(ngModel)]="editClientId"
              placeholder="Выберите клиента"
            />
          </div>
        </div>

        <div class="ct-editor__section">
          <h3 class="ct-editor__section-title">Примечания</h3>
          <kp-input
            placeholder="Условия договора..."
            [(ngModel)]="editNotes"
          />
        </div>

        <!-- Позиции -->
        <div class="ct-editor__section">
          <div class="ct-editor__section-header">
            <h3 class="ct-editor__section-title">Позиции ({{ items().length }})</h3>
            @if (isNew() && editProposalId()) {
              <kp-button
                label="Загрузить позиции из КП"
                lucideIcon="file-text"
                size="small"
                severity="secondary"
                (buttonClick)="loadFromProposal()"
              />
            }
          </div>

          @if (items().length === 0) {
            <div class="ct-editor__empty">
              <p>Нет позиций.</p>
              @if (isNew()) {
                <p>Выберите КП и нажмите «Загрузить позиции из КП».</p>
              }
            </div>
          } @else {
            <div class="ct-editor__items">
              <div class="ct-editor__items-header">
                <span class="ct-editor__th ct-editor__th--name">Товар</span>
                <span class="ct-editor__th ct-editor__th--sku">Артикул</span>
                <span class="ct-editor__th ct-editor__th--qty">Кол-во</span>
                <span class="ct-editor__th ct-editor__th--unit">Ед.</span>
              </div>
              @for (item of items(); track item.id) {
                <div class="ct-editor__item-row">
                  <div class="ct-editor__td ct-editor__td--name">{{ item.productName }}</div>
                  <div class="ct-editor__td ct-editor__td--sku">
                    <span class="ct-editor__sku-badge">{{ item.productSku }}</span>
                  </div>
                  <div class="ct-editor__td ct-editor__td--qty">{{ item.quantity }}</div>
                  <div class="ct-editor__td ct-editor__td--unit">{{ item.productUnit }}</div>
                </div>
              }
            </div>
          }
        </div>
      </kp-card>
    </div>
  `,
  styles: [`
    :host { display: block; }
    .ct-editor { max-width: 1000px; margin: 0 auto; padding: var(--space-6); }
    .ct-editor__header {
      display: flex; align-items: center; justify-content: space-between;
      flex-wrap: wrap; gap: var(--space-3); margin: var(--space-4) 0;
    }
    .ct-editor__title { font-size: var(--font-size-xl); font-weight: var(--font-weight-bold); color: var(--color-text); margin: 0; }
    .ct-editor__header-actions { display: flex; align-items: center; gap: var(--space-3); }
    .ct-editor__section { margin-bottom: var(--space-5); padding-bottom: var(--space-5); border-bottom: 1px solid var(--color-border); }
    .ct-editor__section:last-child { border-bottom: none; margin-bottom: 0; }
    .ct-editor__section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: var(--space-3); }
    .ct-editor__section-title { font-size: var(--font-size-base); font-weight: var(--font-weight-semibold); color: var(--color-text); margin: 0; }
    .ct-editor__row { display: flex; gap: var(--space-3); flex-wrap: wrap; }
    .ct-editor__row > * { flex: 1; min-width: 200px; }
    .ct-editor__row--mt { margin-top: var(--space-3); }
    .ct-editor__empty { text-align: center; padding: var(--space-6); color: var(--color-text-secondary); font-size: var(--font-size-sm); }

    .ct-editor__items { border: 1px solid var(--color-border); border-radius: var(--radius-md); overflow: hidden; }
    .ct-editor__items-header {
      display: grid; grid-template-columns: 1fr 100px 80px 60px;
      padding: var(--space-2) var(--space-3); background: var(--color-bg-secondary);
      border-bottom: 1px solid var(--color-border); font-size: var(--font-size-xs); font-weight: 700;
      text-transform: uppercase; letter-spacing: 0.05em; color: var(--color-text-secondary);
    }
    .ct-editor__th--qty { text-align: right; }
    .ct-editor__item-row {
      display: grid; grid-template-columns: 1fr 100px 80px 60px;
      padding: var(--space-2) var(--space-3); border-bottom: 1px solid var(--color-border);
      transition: background 0.15s;
    }
    .ct-editor__item-row:last-child { border-bottom: none; }
    .ct-editor__item-row:hover { background: var(--color-bg-secondary); }
    .ct-editor__td { display: flex; align-items: center; font-size: var(--font-size-sm); }
    .ct-editor__td--qty { justify-content: flex-end; font-weight: 600; }
    .ct-editor__td--unit { color: var(--color-text-secondary); }
    .ct-editor__sku-badge {
      padding: 2px 6px; border-radius: 4px; background: var(--color-bg);
      border: 1px solid var(--color-border); font-family: 'Courier New', monospace;
      font-size: var(--font-size-xs); color: var(--color-text-secondary);
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContractEditorComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private contractService = inject(ContractService);
  private proposalService = inject(CommercialProposalService);
  private orgService = inject(OrganizationService);
  private clientService = inject(ClientService);
  private notification = inject(NotificationService);

  isNew = signal(true);
  contractId = signal<string | null>(null);
  contractNumber = signal('');
  loading = signal(false);
  saving = signal(false);

  editStatus = signal<ContractStatus>('draft');
  editOrganizationId = signal('');
  editClientId = signal('');
  editProposalId = signal('');
  editNotes = signal('');

  items = signal<ContractItem[]>([]);

  organizations = signal<Organization[]>([]);
  clients = signal<Client[]>([]);
  proposals = signal<CommercialProposal[]>([]);

  statusOptions = STATUS_OPTIONS;

  breadcrumbs: MenuItem[] = [
    { label: 'Продажи' },
    { label: 'Договоры', routerLink: '/sales/contracts' },
    { label: 'Новый договор' },
  ];

  orgOptions = computed<SelectOption[]>(() => [
    { label: 'Не выбрана', value: '' },
    ...this.organizations().filter(o => o.isActive).map(o => ({ label: o.shortName, value: o.id })),
  ]);

  clientOptions = computed<SelectOption[]>(() => [
    { label: 'Не выбран', value: '' },
    ...this.clients().filter(c => c.isActive).map(c => ({
      label: [c.lastName, c.firstName, c.patronymic].filter(Boolean).join(' '),
      value: c.id,
    })),
  ]);

  proposalOptions = computed<SelectOption[]>(() => [
    { label: 'Без КП', value: '' },
    ...this.proposals().filter(p => p.status === 'approved').map(p => ({
      label: `${p.number} (${p.totalAmount.toLocaleString('ru-RU')} ₽)`,
      value: p.id,
    })),
  ]);

  async ngOnInit() {
    this.loading.set(true);
    try {
      const [orgRes, clientRes, propRes] = await Promise.all([
        firstValueFrom(this.orgService.getAll()),
        firstValueFrom(this.clientService.getClients()),
        firstValueFrom(this.proposalService.getProposals()),
      ]);
      this.organizations.set(orgRes.data.filter(o => o.isActive));
      this.clients.set(clientRes.data.filter(c => c.isActive));
      this.proposals.set(propRes.data.filter(p => p.status === 'approved'));

      const id = this.route.snapshot.paramMap.get('id');
      if (id) {
        this.isNew.set(false);
        this.contractId.set(id);
        const res = await firstValueFrom(this.contractService.getContract(id));
        if (res.success && res.data) {
          this.patchForm(res.data);
          this.breadcrumbs[2] = { label: res.data.number };
        } else {
          this.notification.error('Договор не найден');
          this.router.navigate(['/sales/contracts']);
        }
      }
    } finally {
      this.loading.set(false);
    }
  }

  private patchForm(c: Contract) {
    this.contractNumber.set(c.number);
    this.editStatus.set(c.status);
    this.editProposalId.set(c.proposalId || '');
    this.editOrganizationId.set(c.organizationId || '');
    this.editClientId.set(c.clientId || '');
    this.editNotes.set(c.notes || '');
    this.items.set(c.items.map(i => ({ ...i })));
  }

  loadFromProposal() {
    if (!this.editProposalId()) {
      this.notification.warn('КП не выбрано');
      return;
    }
    const proposal = this.proposals().find(p => p.id === this.editProposalId());
    if (!proposal) {
      this.notification.warn('Выбранное КП не найдено в списке согласованных');
      return;
    }

    const newItems: ContractItem[] = proposal.items.map(pi => ({
      id: pi.id,
      sourceProductId: pi.sourceProductId,
      productSku: pi.productSku,
      productName: pi.productName,
      productUnit: pi.productUnit,
      quantity: pi.quantity,
    }));

    this.items.set(newItems);
    this.notification.success(`Загружено ${newItems.length} позиций из КП «${proposal.number}»`);
  }

  async save() {
    this.saving.set(true);
    try {
      const data = {
        organizationId: this.editOrganizationId() || undefined,
        clientId: this.editClientId() || undefined,
        proposalId: this.editProposalId() || undefined,
        status: this.editStatus(),
        notes: this.editNotes().trim() || undefined,
      };

      if (this.isNew()) {
        await firstValueFrom(this.contractService.createContract({ ...data, items: this.items() }));
        this.notification.success('Договор создан');
      } else {
        await firstValueFrom(this.contractService.updateContract(this.contractId()!, {
          ...data,
          items: this.items(),
        }));
        this.notification.success('Договор сохранён');
      }

      this.router.navigate(['/sales/contracts']);
    } catch {
      this.notification.error('Ошибка сохранения');
    } finally {
      this.saving.set(false);
    }
  }

  cancel() {
    this.router.navigate(['/sales/contracts']);
  }
}
