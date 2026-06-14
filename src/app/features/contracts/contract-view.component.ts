import { Component, inject, signal, computed, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { firstValueFrom } from 'rxjs';

import { KpButtonComponent } from '../../shared/ui/kp-button.component';
import { KpBreadcrumbComponent } from '../../shared/ui/kp-breadcrumb.component';
import { KpCardComponent } from '../../shared/ui/kp-card.component';
import { KpToastComponent } from '../../shared/ui/kp-toast.component';
import { KpBadgeComponent } from '../../shared/ui/kp-badge.component';
import { NotificationService } from '../../core/notification.service';
import { ContractService } from '../../core/contract.service';
import { OrganizationService } from '../../core/organization.service';
import { ClientService } from '../../core/client.service';
import type { Contract, Organization, Client } from '../../../../shared/types/index.js';

const STATUS_LABELS: Record<string, string> = {
  draft: 'Черновик',
  active: 'Действует',
  completed: 'Завершён',
  terminated: 'Расторгнут',
};

const STATUS_BADGE: Record<string, 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast'> = {
  draft: 'warn',
  active: 'success',
  completed: 'info',
  terminated: 'danger',
};

@Component({
  selector: 'app-contract-view',
  standalone: true,
  imports: [
    CommonModule,
    KpButtonComponent, KpBreadcrumbComponent, KpCardComponent,
    KpToastComponent, KpBadgeComponent,
  ],
  template: `
    <kp-toast />

    <div class="ct-view">
      <kp-breadcrumb [items]="breadcrumbs()" />

      <div class="ct-view__header">
        <h1 class="ct-view__title">Договор {{ contract()?.number }}</h1>
        <div class="ct-view__header-actions">
          <kp-button
            label="Редактировать"
            lucideIcon="pencil"
            (buttonClick)="edit()"
          />
          <kp-button
            label="К списку"
            lucideIcon="arrow-left"
            severity="secondary"
            (buttonClick)="back()"
          />
        </div>
      </div>

      <kp-card>
        <div class="ct-view__info">
          <div class="ct-view__info-row">
            <span class="ct-view__label">Статус:</span>
            <span class="ct-view__value">
              <kp-badge [value]="statusLabel()" [severity]="statusBadge()" />
            </span>
          </div>
          <div class="ct-view__info-row">
            <span class="ct-view__label">Организация:</span>
            <span class="ct-view__value">{{ orgName() }}</span>
          </div>
          <div class="ct-view__info-row">
            <span class="ct-view__label">Клиент:</span>
            <span class="ct-view__value">{{ clientName() }}</span>
          </div>
          <div class="ct-view__info-row">
            <span class="ct-view__label">Позиций:</span>
            <span class="ct-view__value">{{ itemCount() }} шт.</span>
          </div>
          @let c = contract();
          @if (c?.proposalId) {
            <div class="ct-view__info-row">
              <span class="ct-view__label">Создан из КП:</span>
              <span class="ct-view__value">{{ c?.proposalId }}</span>
            </div>
          }
          @if (c?.notes) {
            <div class="ct-view__info-row ct-view__info-row--notes">
              <span class="ct-view__label">Примечания:</span>
              <span class="ct-view__value ct-view__notes">{{ c?.notes }}</span>
            </div>
          }
          <div class="ct-view__info-row">
            <span class="ct-view__label">Создан:</span>
            <span class="ct-view__value">{{ createdAt() }}</span>
          </div>
          <div class="ct-view__info-row">
            <span class="ct-view__label">Обновлён:</span>
            <span class="ct-view__value">{{ updatedAt() }}</span>
          </div>
        </div>
      </kp-card>

      <!-- Позиции -->
      @if (itemCount() > 0) {
        <kp-card>
          <h3 class="ct-view__section-title">Позиции ({{ itemCount() }})</h3>
          <div class="ct-view__items">
            <div class="ct-view__items-header">
              <span class="ct-view__th ct-view__th--name">Товар</span>
              <span class="ct-view__th ct-view__th--sku">Артикул</span>
              <span class="ct-view__th ct-view__th--qty">Кол-во</span>
              <span class="ct-view__th ct-view__th--unit">Ед.</span>
            </div>
            @for (item of contract()?.items; track item.id) {
              <div class="ct-view__item-row">
                <div class="ct-view__td ct-view__td--name">{{ item.productName }}</div>
                <div class="ct-view__td ct-view__td--sku">
                  <span class="ct-view__sku-badge">{{ item.productSku }}</span>
                </div>
                <div class="ct-view__td ct-view__td--qty">{{ item.quantity }}</div>
                <div class="ct-view__td ct-view__td--unit">{{ item.productUnit }}</div>
              </div>
            }
          </div>
        </kp-card>
      }
    </div>
  `,
  styleUrl: './contract-view.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContractViewComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private contractService = inject(ContractService);
  private orgService = inject(OrganizationService);
  private clientService = inject(ClientService);
  private notification = inject(NotificationService);

  contract = signal<Contract | null>(null);
  organizations = signal<Organization[]>([]);
  clients = signal<Client[]>([]);
  loading = signal(true);

  statusLabel = computed(() => STATUS_LABELS[this.contract()?.status ?? 'draft']);
  statusBadge = computed(() => STATUS_BADGE[this.contract()?.status ?? 'draft']);
  itemCount = computed(() => this.contract()?.items.length ?? 0);

  orgName = computed(() => {
    const orgId = this.contract()?.organizationId;
    if (!orgId) return '—';
    const org = this.organizations().find(o => o.id === orgId);
    return org ? (org.shortName || org.name) : orgId;
  });

  clientName = computed(() => {
    const clientId = this.contract()?.clientId;
    if (!clientId) return '—';
    const client = this.clients().find(c => c.id === clientId);
    return client ? [client.lastName, client.firstName, client.patronymic].filter(Boolean).join(' ') : clientId;
  });

  createdAt = computed(() => {
    const c = this.contract();
    return c ? new Date(c.createdAt).toLocaleString('ru-RU') : '';
  });

  updatedAt = computed(() => {
    const c = this.contract();
    return c ? new Date(c.updatedAt).toLocaleString('ru-RU') : '';
  });

  breadcrumbs = computed<MenuItem[]>(() => {
    const c = this.contract();
    return [
      { label: 'Продажи' },
      { label: 'Договоры', routerLink: '/sales/contracts' },
      { label: c?.number ?? 'Просмотр' },
    ];
  });

  async ngOnInit() {
    this.loading.set(true);
    try {
      const id = this.route.snapshot.paramMap.get('id');
      if (!id) {
        this.notification.error('ID договора не указан');
        this.router.navigate(['/sales/contracts']);
        return;
      }

      const [ctRes, orgRes, clientRes] = await Promise.all([
        firstValueFrom(this.contractService.getContract(id)),
        firstValueFrom(this.orgService.getAll()),
        firstValueFrom(this.clientService.getClients()),
      ]);

      if (!ctRes.success || !ctRes.data) {
        this.notification.error('Договор не найден');
        this.router.navigate(['/sales/contracts']);
        return;
      }

      this.contract.set(ctRes.data);
      if (orgRes.success) this.organizations.set(orgRes.data);
      if (clientRes.success) this.clients.set(clientRes.data.filter(c => c.isActive));
    } finally {
      this.loading.set(false);
    }
  }

  edit() {
    const id = this.contract()?.id;
    if (id) this.router.navigate(['/sales/contracts', id, 'edit']);
  }

  back() {
    this.router.navigate(['/sales/contracts']);
  }
}
