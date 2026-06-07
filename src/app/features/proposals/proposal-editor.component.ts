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
import { CommercialProposalService } from '../../core/commercial-proposal.service';
import { CartService } from '../../core/cart.service';
import { OrganizationService } from '../../core/organization.service';
import { ClientService } from '../../core/client.service';
import { DocumentTemplateService } from '../../core/document-template.service';
import { generateId } from '../../core/crud-factory.js';
import { ConfirmationService } from 'primeng/api';
import type { CommercialProposal, ProposalItem, ProposalStatus, Organization, Client, DocumentTemplate } from '../../../../shared/types/index.js';

const STATUS_OPTIONS: SelectOption[] = [
  { value: 'draft', label: 'Черновик' },
  { value: 'sent', label: 'Отправлено' },
  { value: 'approved', label: 'Согласовано' },
  { value: 'rejected', label: 'Отклонено' },
];

@Component({
  selector: 'app-proposal-editor',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    KpInputComponent, KpSelectComponent, KpButtonComponent,
    KpBreadcrumbComponent, KpCardComponent, KpToastComponent,
  ],
  providers: [ConfirmationService],
  template: `
    <kp-toast />

    <div class="cp-editor">
      <kp-breadcrumb [items]="breadcrumbs" />

      <div class="cp-editor__header">
        <h1 class="cp-editor__title">
          {{ isNew() ? 'Новое коммерческое предложение' : 'Редактирование КП ' + proposalNumber() }}
        </h1>
        <div class="cp-editor__header-actions">
          @if (!isNew()) {
            <kp-select
              label="Статус"
              [options]="statusOptions"
              [(ngModel)]="editStatus"
            />
          }
          @if (isNew() && items().length > 0) {
            <kp-button
              label="Создать варианты"
              lucideIcon="copy"
              severity="info"
              [loading]="saving()"
              (buttonClick)="createVariants()"
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
        <!-- Выбор организации и клиента -->
        <div class="cp-editor__section">
          <h3 class="cp-editor__section-title">Контрагент</h3>
          <div class="cp-editor__row">
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
          <div class="cp-editor__row cp-editor__row--mt">
            <kp-select
              label="Шаблон для печати"
              [options]="templateOptions()"
              [(ngModel)]="editTemplateId"
              placeholder="Без шаблона"
            />
          </div>
        </div>

        <!-- Примечания -->
        <div class="cp-editor__section">
          <h3 class="cp-editor__section-title">Примечания</h3>
          <kp-input
            placeholder="Условия, комментарии..."
            [(ngModel)]="editNotes"
          />
        </div>

        <!-- Позиции КП (snapshot) -->
        <div class="cp-editor__section">
          <div class="cp-editor__section-header">
            <h3 class="cp-editor__section-title">Позиции ({{ items().length }})</h3>
            @if (isNew() && cartItemCount() > 0) {
              <kp-button
                label="Загрузить из корзины ({{ cartItemCount() }})"
                lucideIcon="shopping-cart"
                size="small"
                severity="secondary"
                (buttonClick)="loadFromCart()"
              />
            }
          </div>

          @if (items().length === 0) {
            <div class="cp-editor__empty">
              <p>Нет позиций.</p>
              @if (isNew()) {
                <p>Нажмите «Загрузить из корзины» или добавьте товары в корзину через витрину.</p>
              }
            </div>
          } @else {
            <div class="cp-editor__items">
              <!-- Заголовок таблицы -->
              <div class="cp-editor__items-header">
                <span class="cp-editor__th cp-editor__th--name">Товар</span>
                <span class="cp-editor__th cp-editor__th--sku">Артикул</span>
                <span class="cp-editor__th cp-editor__th--price">Цена</span>
                <span class="cp-editor__th cp-editor__th--markup">Наценка</span>
                <span class="cp-editor__th cp-editor__th--qty">Кол-во</span>
                <span class="cp-editor__th cp-editor__th--total">Сумма</span>
                <span class="cp-editor__th cp-editor__th--action"></span>
              </div>

              @for (item of items(); track item.id; let i = $index) {
                <div class="cp-editor__item-row">
                  <div class="cp-editor__td cp-editor__td--name">
                    <div class="cp-editor__product-name">{{ item.productName }}</div>
                    <div class="cp-editor__product-unit">{{ item.productUnit }}</div>
                  </div>
                  <div class="cp-editor__td cp-editor__td--sku">
                    <span class="cp-editor__sku-badge">{{ item.productSku }}</span>
                  </div>
                  <div class="cp-editor__td cp-editor__td--price">
                    <input
                      class="cp-editor__input-num"
                      type="number"
                      [ngModel]="item.unitPrice"
                      (ngModelChange)="onItemFieldChange(i, 'unitPrice', $event)"
                    />
                  </div>
                  <div class="cp-editor__td cp-editor__td--markup">
                    <input
                      class="cp-editor__input-num cp-editor__input-num--small"
                      type="number"
                      [ngModel]="item.markupPercent"
                      (ngModelChange)="onItemFieldChange(i, 'markupPercent', $event)"
                    />%
                  </div>
                  <div class="cp-editor__td cp-editor__td--qty">
                    <input
                      class="cp-editor__input-num cp-editor__input-num--small"
                      type="number"
                      [ngModel]="item.quantity"
                      (ngModelChange)="onItemFieldChange(i, 'quantity', $event)"
                      min="1"
                    />
                  </div>
                  <div class="cp-editor__td cp-editor__td--total">
                    <span class="cp-editor__total">{{ item.total.toLocaleString('ru-RU') }} ₽</span>
                  </div>
                  <div class="cp-editor__td cp-editor__td--action">
                    <button
                      class="cp-editor__remove-btn"
                      (click)="removeItem(i)"
                      title="Удалить позицию"
                    >✕</button>
                  </div>
                </div>
              }
            </div>
          }

          <!-- Итого -->
          @if (items().length > 0) {
            <div class="cp-editor__summary">
              <span class="cp-editor__summary-label">Итого:</span>
              <span class="cp-editor__summary-value">{{ totalAmount().toLocaleString('ru-RU') }} ₽</span>
            </div>
          }
        </div>
      </kp-card>
    </div>
  `,
  styles: [`
    :host { display: block; }
    .cp-editor {
      max-width: 1000px;
      margin: 0 auto;
      padding: var(--space-6);
    }
    .cp-editor__header {
      display: flex; align-items: center; justify-content: space-between;
      flex-wrap: wrap; gap: var(--space-3); margin: var(--space-4) 0;
    }
    .cp-editor__title {
      font-size: var(--font-size-xl); font-weight: var(--font-weight-bold);
      color: var(--color-text); margin: 0;
    }
    .cp-editor__header-actions {
      display: flex; align-items: center; gap: var(--space-3);
    }

    .cp-editor__section {
      margin-bottom: var(--space-5);
      padding-bottom: var(--space-5);
      border-bottom: 1px solid var(--color-border);
    }
    .cp-editor__section:last-child { border-bottom: none; margin-bottom: 0; }
    .cp-editor__section-header {
      display: flex; align-items: center; justify-content: space-between;
      margin-bottom: var(--space-3);
    }
    .cp-editor__section-title {
      font-size: var(--font-size-base); font-weight: var(--font-weight-semibold);
      color: var(--color-text); margin: 0;
    }
    .cp-editor__row {
      display: flex; gap: var(--space-3); flex-wrap: wrap;
    }
    .cp-editor__row > * { flex: 1; min-width: 200px; }
    .cp-editor__row--mt { margin-top: var(--space-3); }

    .cp-editor__empty {
      text-align: center; padding: var(--space-6);
      color: var(--color-text-secondary); font-size: var(--font-size-sm);
    }

    /* Items table */
    .cp-editor__items {
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      overflow: hidden;
    }
    .cp-editor__items-header {
      display: grid;
      grid-template-columns: 1fr 100px 100px 70px 80px 110px 40px;
      padding: var(--space-2) var(--space-3);
      background: var(--color-bg-secondary);
      border-bottom: 1px solid var(--color-border);
      font-size: var(--font-size-xs); font-weight: 700;
      text-transform: uppercase; letter-spacing: 0.05em;
      color: var(--color-text-secondary);
    }
    .cp-editor__th--price, .cp-editor__th--markup,
    .cp-editor__th--qty, .cp-editor__th--total { text-align: right; }

    .cp-editor__item-row {
      display: grid;
      grid-template-columns: 1fr 100px 100px 70px 80px 110px 40px;
      padding: var(--space-2) var(--space-3);
      border-bottom: 1px solid var(--color-border);
      transition: background 0.15s;
    }
    .cp-editor__item-row:last-child { border-bottom: none; }
    .cp-editor__item-row:hover { background: var(--color-bg-secondary); }

    .cp-editor__td { display: flex; align-items: center; }
    .cp-editor__td--price, .cp-editor__td--markup,
    .cp-editor__td--qty, .cp-editor__td--total { justify-content: flex-end; }

    .cp-editor__product-name {
      font-size: var(--font-size-sm); font-weight: 600;
      color: var(--color-text); line-height: 1.3;
    }
    .cp-editor__product-unit {
      font-size: var(--font-size-xs); color: var(--color-text-secondary); margin-top: 1px;
    }
    .cp-editor__sku-badge {
      padding: 2px 6px; border-radius: 4px;
      background: var(--color-bg); border: 1px solid var(--color-border);
      font-family: 'Courier New', monospace;
      font-size: var(--font-size-xs); color: var(--color-text-secondary);
    }
    .cp-editor__input-num {
      width: 80px; padding: 4px 6px;
      border: 1px solid var(--color-border); border-radius: var(--radius-sm);
      font-size: var(--font-size-sm); text-align: right;
      color: var(--color-text); background: var(--color-bg);
      transition: border-color 0.15s;
    }
    .cp-editor__input-num--small { width: 55px; }
    .cp-editor__input-num:focus {
      outline: none; border-color: var(--color-primary);
      box-shadow: 0 0 0 2px color-mix(in srgb, var(--color-primary) 20%, transparent);
    }
    .cp-editor__total {
      font-size: var(--font-size-sm); font-weight: 700; color: var(--color-text);
    }
    .cp-editor__remove-btn {
      width: 28px; height: 28px; border: none; border-radius: var(--radius-sm);
      background: transparent; cursor: pointer;
      font-size: 0.85rem; color: var(--color-text-secondary);
      display: flex; align-items: center; justify-content: center;
      transition: all 0.15s;
    }
    .cp-editor__remove-btn:hover { background: rgba(239,68,68,0.1); color: #ef4444; }

    .cp-editor__summary {
      display: flex; justify-content: flex-end; align-items: baseline;
      gap: var(--space-3); margin-top: var(--space-3);
      padding-top: var(--space-3); border-top: 2px solid var(--color-border);
    }
    .cp-editor__summary-label {
      font-size: var(--font-size-base); font-weight: 600; color: var(--color-text-secondary);
    }
    .cp-editor__summary-value {
      font-size: var(--font-size-xl); font-weight: 800; color: var(--color-primary);
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProposalEditorComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private proposalService = inject(CommercialProposalService);
  private cartService = inject(CartService);
  private orgService = inject(OrganizationService);
  private clientService = inject(ClientService);
  private templateService = inject(DocumentTemplateService);
  private notification = inject(NotificationService);
  private confirmationService = inject(ConfirmationService);

  isNew = signal(true);
  proposalId = signal<string | null>(null);
  proposalNumber = signal('');
  loading = signal(false);
  saving = signal(false);

  editStatus = signal<ProposalStatus>('draft');
  editOrganizationId = signal('');
  editClientId = signal('');
  editTemplateId = signal('');
  editNotes = signal('');

  items = signal<ProposalItem[]>([]);

  organizations = signal<Organization[]>([]);
  clients = signal<Client[]>([]);
  templates = signal<DocumentTemplate[]>([]);

  statusOptions = STATUS_OPTIONS;

  totalAmount = computed(() =>
    this.items().reduce((sum, i) => sum + i.total, 0)
  );

  cartItemCount = computed(() => this.cartService.items().length);

  /** Персональная наценка выбранного клиента (из справочника) */
  clientMarkupPercent = computed(() => {
    const id = this.editClientId();
    if (!id) return 0;
    const client = this.clients().find(c => c.id === id);
    return client?.personalMarkupPercent ?? 0;
  });

  breadcrumbs: MenuItem[] = [
    { label: 'Продажи' },
    { label: 'Коммерческие предложения', routerLink: '/sales/proposals' },
    { label: 'Новое КП' },
  ];

  orgOptions = computed<SelectOption[]>(() => [
    { label: 'Не выбрана', value: '' },
    ...this.organizations().filter(o => o.isActive).map(o => ({
      label: o.shortName,
      value: o.id,
    })),
  ]);

  clientOptions = computed<SelectOption[]>(() => [
    { label: 'Не выбран', value: '' },
    ...this.clients().filter(c => c.isActive).map(c => ({
      label: [c.lastName, c.firstName, c.patronymic].filter(Boolean).join(' '),
      value: c.id,
    })),
  ]);

  templateOptions = computed<SelectOption[]>(() => [
    { label: 'Без шаблона', value: '' },
    ...this.templates().map(t => ({
      label: t.name,
      value: t.id,
    })),
  ]);

  async ngOnInit() {
    this.loading.set(true);
    try {
      // Загружаем справочники
      const [orgRes, clientRes, tmplRes] = await Promise.all([
        firstValueFrom(this.orgService.getAll()),
        firstValueFrom(this.clientService.getClients()),
        firstValueFrom(this.templateService.getTemplates()),
      ]);
      this.organizations.set(orgRes.data.filter(o => o.isActive));
      this.clients.set(clientRes.data.filter(c => c.isActive));
      // Фильтруем шаблоны типа КП (quotation)
      this.templates.set(tmplRes.data.filter(t => t.docType === 'quotation'));

      const id = this.route.snapshot.paramMap.get('id');
      if (id) {
        this.isNew.set(false);
        this.proposalId.set(id);
        const res = await firstValueFrom(this.proposalService.getProposal(id));
        if (res.success && res.data) {
          this.patchForm(res.data);
          this.breadcrumbs[2] = { label: res.data.number };
        } else {
          this.notification.error('КП не найдено');
          this.router.navigate(['/sales/proposals']);
        }
      }
      // Для нового КП — авто-выбор первого шаблона quotation и загрузка из корзины
      if (this.isNew()) {
        // Выбрать первый шаблон по умолчанию
        const tmpls = this.templates();
        if (tmpls.length > 0) {
          this.editTemplateId.set(tmpls[0]!.id);
        }
        // Авто-загрузить из корзины
        if (this.cartService.items().length > 0) {
          this.loadFromCart(true); // тихий режим при авто-загрузке
        }
      }
    } finally {
      this.loading.set(false);
    }
  }

  private patchForm(p: CommercialProposal) {
    this.proposalNumber.set(p.number);
    this.editStatus.set(p.status);
    this.editOrganizationId.set(p.organizationId || '');
    this.editClientId.set(p.clientId || '');
    this.editTemplateId.set(p.templateId || '');
    this.editNotes.set(p.notes || '');
    this.items.set(p.items.map(i => ({ ...i })));
  }

  /** Загрузить позиции из корзины (snapshot) */
  loadFromCart(silent = false) {
    const cartItems = this.cartService.items();
    if (cartItems.length === 0) {
      if (!silent) this.notification.warn('Корзина пуста');
      return;
    }

    const markup = this.clientMarkupPercent();
    const newItems: ProposalItem[] = cartItems.map(ci => ({
      id: generateId(),
      sourceProductId: ci.productId,
      productSku: ci.sku,
      productName: ci.name,
      productUnit: ci.unit,
      productDescription: undefined,
      quantity: ci.quantity,
      unitPrice: ci.price,
      markupPercent: markup,
      total: Math.round(ci.price * (1 + markup / 100) * ci.quantity * 100) / 100,
    }));

    this.items.update(prev => [...prev, ...newItems]);
    if (!silent) {
      const msg = markup > 0
        ? `Загружено ${newItems.length} позиций (наценка клиента: ${markup}%)`
        : `Загружено ${newItems.length} позиций из корзины`;
      this.notification.success(msg);
    }
  }

  /** Обновить поле позиции и пересчитать total */
  onItemFieldChange(index: number, field: 'unitPrice' | 'markupPercent' | 'quantity', rawValue: string | number) {
    const value = parseFloat(String(rawValue));
    if (isNaN(value) || value < 0) return;
    if (field === 'quantity' && value < 1) return;

    this.items.update(list => {
      const updated = [...list];
      const item = { ...updated[index] };

      if (field === 'unitPrice') {
        item.unitPrice = value;
      } else if (field === 'markupPercent') {
        item.markupPercent = value;
      } else if (field === 'quantity') {
        item.quantity = value;
      }

      // Пересчёт total с учётом наценки
      const priceWithMarkup = item.unitPrice * (1 + item.markupPercent / 100);
      item.total = Math.round(priceWithMarkup * item.quantity * 100) / 100;

      updated[index] = item;
      return updated;
    });
  }

  /** Удалить позицию */
  removeItem(index: number) {
    this.items.update(list => {
      const updated = [...list];
      updated.splice(index, 1);
      return updated;
    });
  }

  async save() {
    if (this.items().length === 0) {
      this.notification.error('Добавьте хотя бы одну позицию');
      return;
    }

    this.saving.set(true);
    try {
      const data = {
        organizationId: this.editOrganizationId() || undefined,
        clientId: this.editClientId() || undefined,
        templateId: this.editTemplateId() || undefined,
        status: this.editStatus(),
        notes: this.editNotes().trim() || undefined,
      };

      if (this.isNew()) {
        await firstValueFrom(this.proposalService.createWithItems(data, this.items()));
        this.cartService.clearCart();
        this.notification.success('Коммерческое предложение создано');
      } else {
        await firstValueFrom(this.proposalService.updateProposal(this.proposalId()!, {
          ...data,
          items: this.items(),
          totalAmount: this.totalAmount(),
        }));
        this.notification.success('Коммерческое предложение сохранено');
      }

      this.router.navigate(['/sales/proposals']);
    } catch {
      this.notification.error('Ошибка сохранения');
    } finally {
      this.saving.set(false);
    }
  }

  /** Создать 3 варианта КП с разными наценками (0% / 5% / 10%) */
  async createVariants() {
    if (this.items().length === 0) {
      this.notification.error('Добавьте хотя бы одну позицию');
      return;
    }

    this.saving.set(true);
    try {
      const baseData = {
        organizationId: this.editOrganizationId() || undefined,
        clientId: this.editClientId() || undefined,
        templateId: this.editTemplateId() || undefined,
        status: 'draft' as const,
        notes: this.editNotes().trim() || undefined,
      };

      const markups = [0, 5, 10];
      const labels = ['базовая', 'средняя', 'максимальная'];
      let created = 0;

      for (let i = 0; i < markups.length; i++) {
        const variantItems = this.items().map(item => {
          const markup = markups[i];
          const priceWithMarkup = item.unitPrice * (1 + markup / 100);
          return {
            ...item,
            id: generateId(),
            markupPercent: markup,
            total: Math.round(priceWithMarkup * item.quantity * 100) / 100,
          };
        });

        const variantData = {
          ...baseData,
          notes: baseData.notes
            ? `${baseData.notes} (наценка ${markups[i]}% — ${labels[i]})`
            : `Наценка ${markups[i]}% (${labels[i]})`,
        };

        const res = await firstValueFrom(this.proposalService.createWithItems(variantData, variantItems));
        if (res.success) created++;
      }

      this.cartService.clearCart();
      this.notification.success(`Создано ${created} варианта КП (наценка: 0%, 5%, 10%)`);
      this.router.navigate(['/sales/proposals']);
    } catch {
      this.notification.error('Ошибка создания вариантов');
    } finally {
      this.saving.set(false);
    }
  }

  cancel() {
    this.router.navigate(['/sales/proposals']);
  }
}
