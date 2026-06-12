import { Component, inject, signal, computed, viewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
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
import { KpDialogComponent } from '../../shared/ui/kp-dialog.component';
import { KpDocCanvasComponent } from '../../shared/ui/kp-doc-canvas.component';
import { KpDocPreviewDialogComponent } from '../../shared/ui/kp-doc-preview-dialog.component';
import { LucideDynamicIcon } from '@lucide/angular';
import { NotificationService } from '../../core/notification.service';
import { CommercialProposalService } from '../../core/commercial-proposal.service';
import { CartService } from '../../core/cart.service';
import { OrganizationService } from '../../core/organization.service';
import { ClientService } from '../../core/client.service';
import { DocumentTemplateService } from '../../core/document-template.service';
import { generateId } from '../../core/crud-factory.js';

import type { CommercialProposal, ProposalItem, ProposalStatus, Organization, Client, DocumentTemplate, DocBlock } from '../../../../shared/types/index.js';

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
    KpDialogComponent, KpDocCanvasComponent, KpDocPreviewDialogComponent,
    LucideDynamicIcon,
  ],

  template: `
    <kp-toast />

    <div class="cp-editor">
      <kp-breadcrumb [items]="breadcrumbs" />

      @let isCreating = isNew();
      @let itemCount = items().length;

      <div class="cp-editor__header">
        <h1 class="cp-editor__title">
          {{ isCreating ? 'Новое коммерческое предложение' : 'Редактирование КП ' + proposalNumber() }}
        </h1>
        <div class="cp-editor__header-actions">
          @if (!isCreating) {
            <kp-select
              label="Статус"
              [options]="statusOptions"
              [(ngModel)]="editStatus"
            />
          }
          @if (isCreating && itemCount > 0) {
            <kp-button
              label="Создать варианты"
              lucideIcon="copy"
              severity="info"
              [loading]="saving()"
              (buttonClick)="createVariants()"
            />
          }
          <kp-button
            label="Скачать PDF"
            lucideIcon="download"
            severity="success"
            [disabled]="docBlocks().length === 0"
            (buttonClick)="openPdfPreview()"
          />
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
              (ngModelChange)="onOrgChange()"
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
            <h3 class="cp-editor__section-title">Позиции ({{ itemCount }})</h3>
            @if (isCreating && cartItemCount() > 0) {
              <kp-button
                label="Загрузить из корзины ({{ cartItemCount() }})"
                lucideIcon="shopping-cart"
                size="small"
                severity="secondary"
                (buttonClick)="loadFromCart()"
              />
            }
          </div>

          @if (itemCount === 0) {
            <div class="cp-editor__empty">
              <p>Нет позиций.</p>
              @if (isCreating) {
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
          @if (itemCount > 0) {
            <div class="cp-editor__summary">
              <span class="cp-editor__summary-label">Итого:</span>
              <span class="cp-editor__summary-value">{{ totalAmount().toLocaleString('ru-RU') }} ₽</span>
            </div>
          }
        </div>
      </kp-card>

      <!-- ===== A4 Preview with interactive features ===== -->
      @if (itemCount > 0) {
        <div class="cp-editor__preview-section">
          <h3 class="cp-editor__section-title">Предпросмотр</h3>
          <p class="cp-editor__preview-hint">
            Кликните по строке в таблице чтобы отредактировать позицию.
            Кликните по пустому месту для настроек таблицы.
          </p>
          <div class="cp-editor__canvas">
            <kp-doc-canvas
              [blocks]="docBlocks()"
              [editable]="false"
              [backgroundImages]="selectedBackgroundImage() ? [selectedBackgroundImage()] : []"
              (blockRowClick)="onCanvasRowClick($event)"
              (canvasClick)="onCanvasClick()"
            />
          </div>
        </div>
      }

      <!-- Диалог редактирования строки -->
      <kp-dialog
        header="✎ Редактирование позиции"
        [(visible)]="editDialogVisible"
        width="480px"
      >
        @if (editItem(); as ei) {
          <div class="cp-editor__edit-form">
            <div class="cp-editor__edit-header">
              <kp-input label="Название" [(ngModel)]="editName" />
              <kp-input label="Артикул" [(ngModel)]="editSku" placeholder="Артикул" />
            </div>
            <div class="cp-editor__edit-grid">
              <kp-input label="Количество" type="number" [(ngModel)]="editQuantity" />
              <kp-input label="Цена за ед." type="number" [(ngModel)]="editPrice" />
              <kp-input label="Наценка, %" type="number" [(ngModel)]="editMarkup" />
            </div>
            @let total = editPrice() * editQuantity() * (1 + editMarkup() / 100);
            <div class="cp-editor__edit-total">
              <span>Итого по позиции:</span>
              <strong>{{ total.toLocaleString('ru-RU') }} ₽</strong>
            </div>
          </div>
          <div class="cp-editor__dialog-footer">
            <kp-button
              label="💾 Сохранить"
              lucideIcon="check"
              severity="success"
              (buttonClick)="saveEditItem()"
            />
            @if (productChanged()) {
              <kp-button
                label="📋 Сохранить как копию"
                lucideIcon="copy"
                severity="info"
                (buttonClick)="saveEditItemAsCopy()"
              />
            }
            <kp-button
              label="Отмена"
              lucideIcon="x"
              severity="secondary"
              (buttonClick)="editDialogVisible.set(false)"
            />
          </div>
        }
      </kp-dialog>

      <!-- Диалог настроек таблицы -->
      <kp-dialog
        header="⚙ Настройки таблицы"
        [(visible)]="settingsDialogVisible"
        width="400px"
      >
        <div class="cp-editor__settings-form">
          <kp-input
            label="Общая скидка, %"
            type="number"
            [(ngModel)]="discountPercent"
            placeholder="0"
            min="0"
            max="100"
          />
          @if (items().length > 0) {
            <div class="cp-editor__settings-info">
              <span>Всего позиций:</span>
              <strong>{{ items().length }} шт.</strong>
            </div>
            <div class="cp-editor__settings-info">
              <span>Сумма до скидки:</span>
              <strong>{{ totalAmount().toLocaleString('ru-RU') }} ₽</strong>
            </div>
            @if (discountPercent() > 0) {
              <div class="cp-editor__settings-info cp-editor__settings-info--discount">
                <span>Скидка {{ discountPercent() }}%:</span>
                <strong>-{{ discountAmount().toLocaleString('ru-RU') }} ₽</strong>
              </div>
            }
          }
        </div>
        <div class="cp-editor__dialog-footer">
          <kp-button
            label="🗑 Очистить все товары"
            lucideIcon="trash-2"
            severity="danger"
            [disabled]="items().length === 0"
            (buttonClick)="clearItems(); settingsDialogVisible.set(false)"
          />
          <kp-button
            label="Закрыть"
            lucideIcon="x"
            severity="secondary"
            (buttonClick)="settingsDialogVisible.set(false)"
          />
        </div>
      </kp-dialog>

      <!-- PDF preview dialog -->
      <kp-doc-preview-dialog />
    </div>
  `,
  styles: [`
    :host { display: block; }
    .cp-editor {
      max-width: 1100px;
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

    /* A4 Preview section */
    .cp-editor__preview-section {
      margin-top: var(--space-6);
      padding-top: var(--space-6);
      border-top: 1px solid var(--color-border);
    }
    .cp-editor__preview-hint {
      font-size: var(--font-size-xs);
      color: var(--color-text-secondary);
      margin: var(--space-2) 0 var(--space-4);
    }
    .cp-editor__canvas {
      border: 1px solid var(--color-border-light);
      border-radius: var(--radius-md);
      overflow: hidden;
    }

    /* Settings dialog */
    .cp-editor__settings-form {
      display: flex;
      flex-direction: column;
      gap: var(--space-4);
    }
    .cp-editor__settings-info {
      display: flex;
      justify-content: space-between;
      padding: var(--space-2) 0;
      border-bottom: 1px solid var(--color-border-light);
      font-size: var(--font-size-sm);
    }
    .cp-editor__settings-info--discount {
      color: var(--color-error);
      font-weight: 600;
    }
    .cp-editor__settings-info strong {
      font-weight: 700;
    }

    /* Edit dialog */
    .cp-editor__edit-form {
      display: flex;
      flex-direction: column;
      gap: var(--space-4);
    }
    .cp-editor__edit-header {
      display: flex;
      gap: var(--space-3);
    }
    .cp-editor__edit-header > * { flex: 1; }
    .cp-editor__edit-grid {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: var(--space-3);
    }
    .cp-editor__edit-total {
      padding: var(--space-3);
      background: var(--color-primary-subtle);
      border-radius: var(--radius-md);
      text-align: center;
      font-size: var(--font-size-lg);
      color: var(--color-text);
      display: flex;
      justify-content: center;
      gap: var(--space-2);
      align-items: baseline;
    }
    .cp-editor__edit-total strong {
      color: var(--color-primary);
    }
    .cp-editor__dialog-footer {
      display: flex;
      gap: var(--space-3);
      justify-content: flex-end;
      flex-wrap: wrap;
      margin-top: var(--space-4);
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


  previewDialog = viewChild(KpDocPreviewDialogComponent);

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

  // Row editing dialog
  editDialogVisible = signal(false);
  editItem = signal<ProposalItem | null>(null);
  editName = signal('');
  editSku = signal('');
  editQuantity = signal(1);
  editPrice = signal(0);
  editMarkup = signal(0);

  // Table settings dialog
  settingsDialogVisible = signal(false);
  discountPercent = signal(0);

  /** true если пользователь изменил поля самого товара (name/sku) */
  productChanged = computed(() => {
    const item = this.editItem();
    if (!item) return false;
    return this.editName().trim() !== item.productName || this.editSku().trim() !== item.productSku;
  });

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

  /** Сумма глобальной скидки */
  discountAmount = computed(() => {
    const total = this.totalAmount();
    const pct = this.discountPercent();
    if (pct <= 0) return 0;
    return Math.round(total * pct / 100 * 100) / 100;
  });

  /** Итоговая сумма с учётом скидки */
  grandTotal = computed(() => {
    return this.totalAmount() - this.discountAmount();
  });

  /** Ставка НДС (%) из выбранной организации (по умолчанию 20%) */
  selectedVatRate = computed(() => {
    const orgId = this.editOrganizationId();
    if (!orgId) return 20;
    const org = this.organizations().find(o => o.id === orgId);
    return org?.vatRate ?? 20;
  });

  /** Сумма НДС от итоговой суммы (после скидки) */
  ndsAmount = computed(() => {
    const total = this.grandTotal();
    const rate = this.selectedVatRate();
    return Math.round(total * rate / (100 + rate) * 100) / 100;
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

  /** Generate document blocks from template + proposal items */
  docBlocks = computed<DocBlock[]>(() => {
    const tmplId = this.editTemplateId();
    const proposalItems = this.items();
    const blocks: DocBlock[] = [];

    if (proposalItems.length === 0) return blocks;

    if (!tmplId) {
      // No template: show basic preview
      blocks.push({
        id: 'hdr',
        type: 'text',
        order: 0,
        title: 'Коммерческое предложение',
        content: 'Предварительный просмотр',
        settings: { fontSize: '18px', align: 'center' },
      });
      blocks.push({
        id: 'tbl',
        type: 'table',
        order: 1,
        title: `Товары (${proposalItems.length} позиций)`,
        _inlineRows: proposalItems.map(item => this.proposalItemToRow(item)),
        _footerRows: [
          { label: 'Итого:', value: this.grandTotal().toLocaleString('ru-RU') + ' ₽' },
        ],
      });
      return blocks;
    }

    // Use the selected template
    const tmpl = this.templates().find(t => t.id === tmplId);
    if (!tmpl) return blocks;

    // Resolve placeholder data
    const orgId = this.editOrganizationId();
    const org = orgId ? this.organizations().find(o => o.id === orgId) : null;
    const clientId = this.editClientId();
    const client = clientId ? this.clients().find(c => c.id === clientId) : null;
    const clientName = client ? [client.lastName, client.firstName, client.patronymic].filter(Boolean).join(' ') : 'Клиент';
    const orgName = org ? (org.shortName || org.name) : 'Организация';
    const total = this.grandTotal();

    const placeholders: Record<string, string> = {
      '{{client.name}}': clientName,
      '{{org.shortName}}': orgName,
      '{{org.name}}': org ? org.name : 'Организация',
      '{{total}}': total.toLocaleString('ru-RU') + ' ₽',
      '{{date}}': new Date().toLocaleDateString('ru-RU'),
      '{{items.count}}': String(proposalItems.length),
    };

    const replace = (text?: string) => {
      if (!text) return text;
      let result = text;
      for (const [key, value] of Object.entries(placeholders)) {
        result = result.replaceAll(key, value);
      }
      return result;
    };

    // Deep clone all template blocks with placeholder replacement
    for (const b of tmpl.blocks) {
      const cloned: DocBlock = {
        ...b,
        id: b.id + '-inst',
        content: replace(b.content),
        columns: b.columns?.map(c => ({ ...c, content: replace(c.content) || c.content })),
      };
      blocks.push(cloned);
    }

    // Populate the FIRST table block with product data
    const tableBlock = blocks.find(b => b.type === 'table' && b.tableTemplateId);
    if (tableBlock) {
      tableBlock._inlineRows = proposalItems.map(item => this.proposalItemToRow(item));

      const summaries: Record<string, number> = {
        quantity: proposalItems.reduce((s, i) => s + i.quantity, 0),
        total: this.grandTotal(),
        totalAmount: this.grandTotal(),
        unitPrice: proposalItems.reduce((s, i) => s + i.unitPrice, 0) / proposalItems.length,
      };
      tableBlock._columnSummaries = summaries;

      // Footer строки: Итого, НДС, Всего к оплате
      const vatRate = this.selectedVatRate();
      const nds = this.ndsAmount();
      const clientMarkup = this.clientMarkupPercent();
      const beforeDiscount = this.totalAmount();
      const discount = this.discountAmount();
      const footerRows: { label: string; value: string }[] = [];

      if (discount > 0) {
        footerRows.push({ label: 'Итого (без скидки):', value: beforeDiscount.toLocaleString('ru-RU') + ' ₽' });
        footerRows.push({ label: `Скидка ${this.discountPercent()}%:`, value: '-' + discount.toLocaleString('ru-RU') + ' ₽' });
      }
      footerRows.push({ label: 'Итого:', value: this.grandTotal().toLocaleString('ru-RU') + ' ₽' });
      if (vatRate > 0) {
        footerRows.push({ label: `в том числе НДС ${vatRate}%:`, value: nds.toLocaleString('ru-RU') + ' ₽' });
        footerRows.push({ label: 'Всего к оплате:', value: this.grandTotal().toLocaleString('ru-RU') + ' ₽' });
      }
      if (clientMarkup > 0) {
        const baseTotal = proposalItems.reduce((s, i) => s + (i.unitPrice * i.quantity), 0);
        const markupAmount = beforeDiscount - baseTotal;
        footerRows.push({ label: 'Наценка (' + clientMarkup + '%):', value: '+' + markupAmount.toLocaleString('ru-RU') + ' ₽' });
      }
      tableBlock._footerRows = footerRows;
    }

    return blocks;
  });

  /** Сформировать строку таблицы из ProposalItem */
  private proposalItemToRow(item: ProposalItem): Record<string, unknown> {
    return {
      name: item.productName,
      sku: item.productSku,
      price: item.unitPrice,
      unitPrice: item.unitPrice,
      quantity: item.quantity,
      unit: item.productUnit,
      total: item.total,
      totalAmount: item.total,
      productName: item.productName,
      productSku: item.productSku,
      productUnit: item.productUnit,
      markupPercent: item.markupPercent ?? 0,
    };
  }

  /** Background images from selected template */
  selectedBackgroundImage = computed(() => {
    const tmplId = this.editTemplateId();
    if (!tmplId) return '';
    const tmpl = this.templates().find(t => t.id === tmplId);
    const images = tmpl?.backgroundImages;
    if (images && images.length > 0) return images[0];
    return (tmpl as unknown as Record<string, unknown>)['backgroundImage'] as string ?? '';
  });

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

  /** При смене организации — сбрасываем шаблон */
  onOrgChange() {
    const orgId = this.editOrganizationId();
    const currentTmpl = this.editTemplateId();
    if (currentTmpl) {
      const tmpl = this.templates().find(t => t.id === currentTmpl);
      if (tmpl && tmpl.organizationId && tmpl.organizationId !== orgId) {
        this.editTemplateId.set('');
      }
    }
  }

  /** Загрузить позиции из корзины (snapshot) */
  loadFromCart(silent = false) {
    const cartItems = this.cartService.items();
    if (cartItems.length === 0) {
      if (!silent) this.notification.warn('Корзина пуста');
      return;
    }

    const clientMarkup = this.clientMarkupPercent();
    let markedUpCount = 0;
    const newItems: ProposalItem[] = cartItems.map(ci => {
      const markup = clientMarkup > 0 ? clientMarkup : (ci.markupPercent ?? 0);
      if (markup > 0) markedUpCount++;
      return {
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
      };
    });

    this.items.update(prev => [...prev, ...newItems]);
    if (!silent) {
      const parts = [`Загружено ${newItems.length} позиций`];
      if (clientMarkup > 0) parts.push(`наценка клиента: ${clientMarkup}%`);
      else if (markedUpCount > 0) parts.push(`наценка из товара`);
      this.notification.success(parts.join(', '));
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

  /** Clear all items */
  clearItems() {
    this.items.set([]);
    this.notification.success('Список товаров очищен');
  }

  /** Открыть диалог редактирования строки */
  openEditItem(item: ProposalItem) {
    this.editItem.set(item);
    this.editName.set(item.productName);
    this.editSku.set(item.productSku);
    this.editQuantity.set(item.quantity);
    this.editPrice.set(item.unitPrice);
    this.editMarkup.set(item.markupPercent);
    this.editDialogVisible.set(true);
  }

  /** Сохранить изменения — заменить текущую строку */
  saveEditItem() {
    const item = this.editItem();
    if (!item) return;

    const qty = Math.max(1, Math.round(this.editQuantity()));
    const price = Math.max(0, this.editPrice());
    const markup = Math.max(0, this.editMarkup());
    const name = this.editName().trim() || item.productName;
    const sku = this.editSku().trim() || item.productSku;

    this.items.update(list => {
      const updated = [...list];
      const idx = updated.findIndex(i => i.id === item.id);
      if (idx === -1) return list;

      const priceWithMarkup = price * (1 + markup / 100);
      updated[idx] = {
        ...updated[idx],
        productName: name,
        productSku: sku,
        quantity: qty,
        unitPrice: price,
        markupPercent: markup,
        total: Math.round(priceWithMarkup * qty * 100) / 100,
      };
      return updated;
    });

    this.editDialogVisible.set(false);
    this.notification.success('Позиция обновлена');
  }

  /** Сохранить как копию — удалить старую, вставить новую на её место */
  saveEditItemAsCopy() {
    const item = this.editItem();
    if (!item) return;

    const qty = Math.max(1, Math.round(this.editQuantity()));
    const price = Math.max(0, this.editPrice());
    const markup = Math.max(0, this.editMarkup());
    const name = this.editName().trim() || item.productName;
    const sku = this.editSku().trim() || item.productSku;

    const priceWithMarkup = price * (1 + markup / 100);
    const copy: ProposalItem = {
      ...item,
      id: generateId(),
      productName: name,
      productSku: sku,
      quantity: qty,
      unitPrice: price,
      markupPercent: markup,
      total: Math.round(priceWithMarkup * qty * 100) / 100,
    };

    this.items.update(list => {
      const idx = list.findIndex(i => i.id === item.id);
      if (idx === -1) return [...list, copy];
      const updated = [...list];
      updated.splice(idx, 1, copy);
      return updated;
    });

    this.editDialogVisible.set(false);
    this.notification.success('Копия сохранена на место оригинала');
  }

  /** Клик по строке в A4-таблице — открыть редактор */
  onCanvasRowClick(event: { block: DocBlock; row: Record<string, unknown>; index: number }) {
    const proposalItems = this.items();
    const item = proposalItems[event.index];
    if (item) {
      this.openEditItem(item);
    }
  }

  /** Клик по пустому месту A4 — открыть настройки таблицы */
  onCanvasClick() {
    if (this.items().length > 0) {
      this.settingsDialogVisible.set(true);
    }
  }

  /** Открыть диалог предпросмотра с PDF экспортом */
  openPdfPreview() {
    const blocks = this.docBlocks();
    if (blocks.length === 0) {
      this.notification.warn('Нет данных для экспорта');
      return;
    }
    const tmplId = this.editTemplateId();
    const tmpl = tmplId ? this.templates().find(t => t.id === tmplId) : null;
    this.previewDialog()?.open(
      tmpl?.name || 'Коммерческое предложение',
      'quotation',
      blocks,
      tmpl?.backgroundImages || [],
      tmpl?.backgroundOpacity ?? 1,
    );
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

  /** Создать 3 варианта КП с разными наценками */
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

      const currentMarkups = this.items().map(i => i.markupPercent);
      const maxMarkup = Math.max(...currentMarkups, 10);
      const midMarkup = Math.round(maxMarkup / 2);
      const markups = [0, midMarkup, maxMarkup];
      const labels = ['без наценки', `рекомендуемая ${midMarkup}%`, `максимальная ${maxMarkup}%`];
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
            ? `${baseData.notes} (${labels[i]})`
            : `${labels[i]}`,
        };

        const res = await firstValueFrom(this.proposalService.createWithItems(variantData, variantItems));
        if (res.success) created++;
      }

      this.cartService.clearCart();
      this.notification.success(`Создано ${created} варианта КП (наценка: ${markups.join('%, ')})`);
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
