import { Component, inject, signal, computed, viewChild, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { KpButtonComponent } from '../../shared/ui/kp-button.component';
import { KpInputComponent } from '../../shared/ui/kp-input.component';
import { KpSelectComponent, SelectOption } from '../../shared/ui/kp-select.component';
import { KpBreadcrumbComponent } from '../../shared/ui/kp-breadcrumb.component';
import { KpToastComponent } from '../../shared/ui/kp-toast.component';
import { KpDocCanvasComponent } from '../../shared/ui/kp-doc-canvas.component';
import { KpDocPreviewDialogComponent } from '../../shared/ui/kp-doc-preview-dialog.component';
import { KpDialogComponent } from '../../shared/ui/kp-dialog.component';
import { LucideDynamicIcon } from '@lucide/angular';
import { NotificationService } from '../../core/notification.service';
import { ProductService } from '../../core/product.service';
import { ProductCategoryService } from '../../core/product-category.service';
import { CartService } from '../../core/cart.service';
import { OrganizationService } from '../../core/organization.service';
import { ClientService } from '../../core/client.service';
import { DocumentTemplateService } from '../../core/document-template.service';
import { CommercialProposalService } from '../../core/commercial-proposal.service';
import type { Product, Organization, Client, DocumentTemplate, DocBlock, CartItem } from '../../../../shared/types/index.js';
import { generateId } from '../../core/crud-factory.js';

@Component({
  selector: 'app-proposal-showcase',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    KpButtonComponent, KpInputComponent, KpSelectComponent,
    KpBreadcrumbComponent, KpToastComponent,
    KpDocCanvasComponent, KpDocPreviewDialogComponent,
    KpDialogComponent, LucideDynamicIcon,
  ],
  template: `
    <kp-toast />

    <div class="showcase">
      <kp-breadcrumb [items]="breadcrumbs" />

      <!-- Header -->
      <div class="showcase__header">
        <h1 class="showcase__title">📋 Оформление КП</h1>
        <div class="showcase__header-actions">
          <kp-button
            label="Скачать PDF"
            lucideIcon="download"
            severity="success"
            [disabled]="docBlocks().length === 0"
            (buttonClick)="openPdfPreview()"
          />
          <kp-button
            label="Создать КП"
            lucideIcon="file-text"
            [disabled]="selectedItems().length === 0"
            [loading]="saving()"
            (buttonClick)="createProposal()"
          />
        </div>
      </div>

      <div class="showcase__layout">
        <!-- ===== LEFT: Product showcase ===== -->
        <div class="showcase__left">
          <!-- Search and filters -->
          <div class="showcase__filters">
            <kp-input
              placeholder="Поиск товаров..."
              lucideIcon="search"
              [(ngModel)]="searchQuery"
              styleClass="showcase__search"
            />
            <div class="showcase__filter-row">
              <kp-select
                placeholder="Все категории"
                [options]="categoryOptions()"
                [(ngModel)]="filterCategory"
                styleClass="showcase__filter-select"
              />
              <kp-select
                placeholder="Все типы"
                [options]="typeOptions"
                [(ngModel)]="filterType"
                styleClass="showcase__filter-select"
              />
            </div>
          </div>

          <!-- Product grid -->
          <div class="showcase__grid">
            @for (p of filteredProducts(); track p.id) {
              <div class="showcase__card" (click)="onAddProduct(p)">
                <div class="showcase__card-avatar">{{ p.name.charAt(0) }}</div>
                <div class="showcase__card-body">
                  <div class="showcase__card-name">{{ p.name }}</div>
                  <div class="showcase__card-meta">
                    <span class="showcase__card-sku">{{ p.sku }}</span>
                    <span class="showcase__card-unit">{{ p.unit }}</span>
                  </div>
                  <div class="showcase__card-price">
                    {{ (p.basePrice ?? 0).toLocaleString('ru-RU') }} ₽
                  </div>
                </div>
                <button
                  class="showcase__card-add"
                  title="Добавить в документ"
                  (click)="$event.stopPropagation(); onAddProduct(p)"
                >
                  <svg lucideIcon="plus" width="20" height="20"></svg>
                </button>
              </div>
            }
            @if (filteredProducts().length === 0) {
              <div class="showcase__grid-empty">
                Товары не найдены
              </div>
            }
          </div>
        </div>

        <!-- ===== RIGHT: Document preview ===== -->
        <div class="showcase__right">
          <!-- Document controls: сначала организация, потом шаблон (фильтруется по org), потом клиент -->
          <div class="showcase__doc-controls">
            <kp-select
              label="Организация"
              placeholder="Кто выставляет"
              [options]="orgOptions()"
              [(ngModel)]="selectedOrgId"
              styleClass="showcase__doc-select"
              (ngModelChange)="onOrgChange()"
            />
            <kp-select
              label="Шаблон"
              placeholder="Выберите шаблон"
              [options]="templateOptions()"
              [(ngModel)]="selectedTemplateId"
              styleClass="showcase__doc-select"
            />
            <kp-select
              label="Клиент"
              placeholder="Наценка клиента"
              [options]="clientOptions()"
              [(ngModel)]="selectedClientId"
              styleClass="showcase__doc-select"
            />
          </div>

          <!-- Selected items summary -->
          @let items = selectedItems();
          @if (items.length > 0) {
            <div class="showcase__items-bar">
              <span class="showcase__items-count">
                {{ items.length }} {{ plural(items.length, 'позиция', 'позиции', 'позиций') }} ·
                {{ totalUnits() }} {{ plural(totalUnits(), 'ед.', 'ед.', 'ед.') }} ·
                @let cm = clientMarkupPercent();
                @if (cm > 0) {
                  база {{ totalSum().toLocaleString('ru-RU') }} ₽ →
                }
                <strong>{{ totalWithMarkup().toLocaleString('ru-RU') }} ₽</strong>
                @if (cm > 0) {
                  (наценка {{ cm }}%)
                }
              </span>
              <kp-button
                label="Очистить"
                lucideIcon="trash-2"
                severity="danger"
                size="small"
                [text]="true"
                (buttonClick)="clearItems()"
              />
            </div>

            <!-- Per-item markup detail (collapsible via details/summary) -->
            <details class="showcase__items-detail" open>
              <summary class="showcase__items-detail-summary">Детали наценок</summary>
              <div class="showcase__items-detail-content">
                <div class="showcase__detail-header">
                  <span class="showcase__detail-th">Товар</span>
                  <span class="showcase__detail-th showcase__detail-th--num">Кол-во</span>
                  <span class="showcase__detail-th showcase__detail-th--num">Цена</span>
                  <span class="showcase__detail-th showcase__detail-th--num">Наценка</span>
                  <span class="showcase__detail-th showcase__detail-th--num">Сумма</span>
                </div>
                @for (item of items; track item.id) {
                  <div class="showcase__detail-row" (click)="openEditItem(item)">
                    <div class="showcase__detail-name">
                      <span>{{ item.name }}</span>
                      <span class="showcase__detail-sku">{{ item.sku }}</span>
                    </div>
                    <div class="showcase__detail-num">{{ item.quantity }} {{ item.unit }}</div>
                    <div class="showcase__detail-num">{{ item.price.toLocaleString('ru-RU') }} ₽</div>
                    <div class="showcase__detail-num">
                      <input
                        class="showcase__markup-input"
                        type="number"
                        [ngModel]="effectiveMarkup(item)"
                        (ngModelChange)="onItemMarkupChange(item.id, $event)"
                        (click)="$event.stopPropagation()"
                        min="0"
                      />%
                    </div>
                    <div class="showcase__detail-num showcase__detail-total">
                      {{ itemTotal(item).toLocaleString('ru-RU') }} ₽
                    </div>
                  </div>
                }
              </div>
            </details>
          }

          <!-- Диалог редактирования строки -->
          <kp-dialog
            header="Редактирование позиции"
            [(visible)]="editDialogVisible"
            width="400px"
          >
            @if (editItem(); as ei) {
              <div class="showcase__edit-form">
                <div class="showcase__edit-name">{{ ei.name }}</div>
                <div class="showcase__edit-sku">{{ ei.sku }}</div>
                <kp-input
                  label="Количество"
                  type="number"
                  [(ngModel)]="editQuantity"
                />
                <kp-input
                  label="Цена за ед."
                  type="number"
                  [(ngModel)]="editPrice"
                />
                <kp-input
                  label="Наценка, %"
                  type="number"
                  [(ngModel)]="editMarkup"
                />
                <div class="showcase__edit-total">
                  Итого: <strong>{{ (editPrice() * editQuantity() * (1 + editMarkup() / 100)).toLocaleString('ru-RU') }} ₽</strong>
                </div>
              </div>
              <div class="showcase__dialog-footer">
                <kp-button
                  label="Сохранить"
                  lucideIcon="check"
                  (buttonClick)="saveEditItem()"
                />
                <kp-button
                  label="Отмена"
                  lucideIcon="x"
                  severity="secondary"
                  (buttonClick)="editDialogVisible.set(false)"
                />
              </div>
            }
          </kp-dialog>

          <!-- A4 Canvas -->
          <div class="showcase__canvas">
            <kp-doc-canvas
              [blocks]="docBlocks()"
              [editable]="false"
              [backgroundImages]="selectedBackgroundImage() ? [selectedBackgroundImage()] : []"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- PDF preview dialog -->
    <kp-doc-preview-dialog />
  `,
  styles: [`
    :host { display: block; }
    .showcase {
      padding: var(--space-6);
    }

    /* ── Header ── */
    .showcase__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: var(--space-4);
      margin: var(--space-4) 0 var(--space-6);
    }
    .showcase__title {
      font-size: var(--font-size-2xl, 1.75rem);
      font-weight: 800;
      color: var(--color-text);
      margin: 0;
    }
    .showcase__header-actions {
      display: flex;
      gap: var(--space-3);
    }

    /* ── Main layout ── */
    .showcase__layout {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--space-6);
      align-items: start;
    }

    /* ── LEFT ── */
    .showcase__left {
      display: flex;
      flex-direction: column;
      gap: var(--space-4);
    }

    .showcase__filters {
      display: flex;
      flex-direction: column;
      gap: var(--space-3);
    }
    .showcase__search { width: 100%; }
    .showcase__filter-row {
      display: flex;
      gap: var(--space-3);
    }
    .showcase__filter-select { flex: 1; }

    /* Product grid */
    .showcase__grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      gap: var(--space-3);
      max-height: calc(100vh - 320px);
      overflow-y: auto;
      padding-right: var(--space-2);
    }

    .showcase__card {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      padding: var(--space-3);
      background: var(--color-surface);
      border: 1px solid var(--color-border-light);
      border-radius: var(--radius-md);
      cursor: pointer;
      transition: all var(--transition-fast);
      position: relative;
    }
    .showcase__card:hover {
      border-color: var(--color-primary);
      box-shadow: var(--shadow-md);
      transform: translateY(-1px);
    }
    .showcase__card:active {
      transform: translateY(0);
    }

    .showcase__card-avatar {
      width: 44px;
      height: 44px;
      border-radius: var(--radius-sm);
      background: linear-gradient(135deg, var(--color-primary), #818cf8);
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: var(--font-size-lg);
      flex-shrink: 0;
    }

    .showcase__card-body {
      flex: 1;
      min-width: 0;
    }
    .showcase__card-name {
      font-size: var(--font-size-sm);
      font-weight: 600;
      color: var(--color-text);
      line-height: 1.3;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .showcase__card-meta {
      display: flex;
      gap: var(--space-2);
      align-items: center;
      margin-top: 2px;
    }
    .showcase__card-sku {
      font-size: var(--font-size-xs);
      font-family: 'Courier New', monospace;
      color: var(--color-text-muted);
      letter-spacing: 0.02em;
    }
    .showcase__card-unit {
      font-size: var(--font-size-xs);
      color: var(--color-text-secondary);
    }
    .showcase__card-price {
      font-size: var(--font-size-sm);
      font-weight: 700;
      color: var(--color-primary);
      margin-top: 2px;
    }

    .showcase__card-add {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: var(--color-primary);
      color: #fff;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      transition: all var(--transition-fast);
      opacity: 0.7;
    }
    .showcase__card:hover .showcase__card-add {
      opacity: 1;
    }
    .showcase__card-add:hover {
      transform: scale(1.15);
      opacity: 1;
    }

    .showcase__grid-empty {
      grid-column: 1 / -1;
      text-align: center;
      padding: var(--space-8);
      color: var(--color-text-secondary);
      font-size: var(--font-size-sm);
    }

    /* ── RIGHT ── */
    .showcase__right {
      display: flex;
      flex-direction: column;
      gap: var(--space-4);
    }

    .showcase__doc-controls {
      display: flex;
      gap: var(--space-3);
    }
    .showcase__doc-select { flex: 1; }

    .showcase__items-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--space-3);
      padding: var(--space-3) var(--space-4);
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
    }
    .showcase__items-count {
      font-size: var(--font-size-sm);
      color: var(--color-text-secondary);
    }
    .showcase__items-count strong {
      color: var(--color-primary);
    }

    .showcase__canvas {
      border: 1px solid var(--color-border-light);
      border-radius: var(--radius-md);
      overflow: hidden;
    }

    /* ── Items detail (per-item markup) ── */
    .showcase__items-detail {
      border: 1px solid var(--color-border-light);
      border-radius: var(--radius-md);
      overflow: hidden;
    }
    .showcase__items-detail-summary {
      padding: var(--space-2) var(--space-3);
      font-size: var(--font-size-xs);
      font-weight: 600;
      color: var(--color-text-secondary);
      cursor: pointer;
      background: var(--color-surface);
      border-bottom: 1px solid var(--color-border-light);
      user-select: none;
    }
    .showcase__items-detail-summary:hover {
      color: var(--color-text);
    }
    .showcase__items-detail-content {
      padding: var(--space-2);
      font-size: var(--font-size-xs);
    }
    .showcase__detail-header {
      display: grid;
      grid-template-columns: 1fr 60px 70px 65px 85px;
      gap: var(--space-1);
      padding: var(--space-1) var(--space-2);
      font-weight: 600;
      color: var(--color-text-muted);
      border-bottom: 1px solid var(--color-border-light);
    }
    .showcase__detail-th--num { text-align: right; }
    .showcase__detail-row {
      display: grid;
      grid-template-columns: 1fr 60px 70px 65px 85px;
      gap: var(--space-1);
      padding: var(--space-1) var(--space-2);
      align-items: center;
      border-bottom: 1px solid var(--color-border-light);
    }
    .showcase__detail-row:last-child { border-bottom: none; }
    .showcase__detail-name {
      display: flex;
      flex-direction: column;
      min-width: 0;
    }
    .showcase__detail-name span:first-child {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .showcase__detail-sku {
      font-family: 'Courier New', monospace;
      font-size: 0.75em;
      color: var(--color-text-muted);
    }
    .showcase__detail-num {
      text-align: right;
      font-variant-numeric: tabular-nums;
    }
    .showcase__detail-total {
      font-weight: 700;
      color: var(--color-primary);
    }
    .showcase__markup-input {
      width: 48px;
      padding: 2px 4px;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-sm);
      font-size: var(--font-size-xs);
      text-align: right;
      background: var(--color-bg);
      color: var(--color-text);
    }
    .showcase__markup-input:focus {
      outline: none;
      border-color: var(--color-primary);
    }

    /* Row editing dialog */
    .showcase__edit-form {
      display: flex;
      flex-direction: column;
      gap: var(--space-4);
    }
    .showcase__edit-name {
      font-size: var(--font-size-lg);
      font-weight: 700;
      color: var(--color-text);
    }
    .showcase__edit-sku {
      font-family: 'Courier New', monospace;
      font-size: var(--font-size-sm);
      color: var(--color-text-muted);
      margin-top: -12px;
      margin-bottom: 8px;
    }
    .showcase__edit-total {
      padding: var(--space-3);
      background: var(--color-primary-subtle);
      border-radius: var(--radius-md);
      text-align: center;
      font-size: var(--font-size-lg);
      color: var(--color-text);
    }
    .showcase__edit-total strong {
      color: var(--color-primary);
    }
    .showcase__dialog-footer {
      display: flex;
      gap: var(--space-3);
      justify-content: flex-end;
      margin-top: var(--space-4);
    }

    /* ── Responsive ── */
    @media (max-width: 1100px) {
      .showcase__layout {
        grid-template-columns: 1fr;
      }
      .showcase__grid {
        max-height: 400px;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProposalShowcaseComponent {
  private router = inject(Router);
  private productService = inject(ProductService);
  private categoryService = inject(ProductCategoryService);
  private cartService = inject(CartService);
  private orgService = inject(OrganizationService);
  private clientService = inject(ClientService);
  private templateService = inject(DocumentTemplateService);
  private proposalService = inject(CommercialProposalService);
  private notification = inject(NotificationService);

  previewDialog = viewChild(KpDocPreviewDialogComponent);

  searchQuery = signal('');
  filterCategory = signal('');
  filterType = signal('');
  selectedTemplateId = signal('');
  selectedOrgId = signal('');
  selectedClientId = signal('');
  saving = signal(false);

  // Row editing dialog
  editDialogVisible = signal(false);
  editItem = signal<CartItem | null>(null);
  editQuantity = signal(1);
  editPrice = signal(0);
  editMarkup = signal(0);

  allProducts = signal<Product[]>([]);
  categories = signal<{ id: string; name: string }[]>([]);
  organizations = signal<Organization[]>([]);
  clients = signal<Client[]>([]);
  templates = signal<DocumentTemplate[]>([]);


  typeOptions: SelectOption[] = [
    { value: '', label: 'Все типы' },
    { value: 'purchased', label: 'Покупной' },
    { value: 'manufactured', label: 'Изготавливаемый' },
  ];

  breadcrumbs = [
    { label: 'Продажи' },
    { label: 'Оформление КП' },
  ];

  categoryOptions = computed<SelectOption[]>(() => [
    { value: '', label: 'Все категории' },
    ...this.categories().map(c => ({ value: c.id, label: c.name })),
  ]);

  /** Шаблоны, отфильтрованные по выбранной организации (если организация выбрана) */
  templateOptions = computed<SelectOption[]>(() => {
    const orgId = this.selectedOrgId();
    return [
      { value: '', label: 'Без шаблона' },
      ...this.templates()
        .filter(t => t.docType === 'quotation')
        .filter(t => !orgId || t.organizationId === orgId)
        .map(t => ({ value: t.id, label: t.name + (t.organizationId ? '' : ' (без организации)') })),
    ];
  });

  orgOptions = computed<SelectOption[]>(() => [
    { value: '', label: 'Не выбрана' },
    ...this.organizations()
      .filter(o => o.isActive)
      .map(o => ({ value: o.id, label: o.shortName || o.name })),
  ]);

  clientOptions = computed<SelectOption[]>(() => [
    { value: '', label: 'Без наценки клиента' },
    ...this.clients()
      .filter(c => c.isActive)
      .map(c => ({
        value: c.id,
        label: [c.lastName, c.firstName, c.patronymic].filter(Boolean).join(' ') + (c.personalMarkupPercent ? ` (наценка ${c.personalMarkupPercent}%)` : ''),
      })),
  ]);

  /** Наценка от выбранного клиента (0 если не выбран или нет наценки) */
  clientMarkupPercent = computed(() => {
    const id = this.selectedClientId();
    if (!id) return 0;
    const client = this.clients().find(c => c.id === id);
    return client?.personalMarkupPercent ?? 0;
  });

  /** Итоговая сумма с учётом наценки */
  totalWithMarkup = computed(() => {
    const clientMarkup = this.clientMarkupPercent();
    return this.selectedItems().reduce((sum, ci) => {
      const markup = clientMarkup > 0 ? clientMarkup : (ci.markupPercent ?? 0);
      return sum + ci.price * (1 + markup / 100) * ci.quantity;
    }, 0);
  });

  /** Filtered products based on search + filters */
  filteredProducts = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    const cat = this.filterCategory();
    const type = this.filterType();
    return this.allProducts().filter(p => {
      if (!p.isActive) return false;
      if (cat && p.categoryId !== cat) return false;
      if (type && p.productType !== type) return false;
      if (q && !p.name.toLowerCase().includes(q) && !p.sku.toLowerCase().includes(q)) return false;
      return true;
    });
  });

  /** Currently selected cart items */
  selectedItems = this.cartService.items;
  totalUnits = this.cartService.totalUnits;
  totalSum = this.cartService.totalSum;

  /** Generate document blocks from template + selected items */
  docBlocks = computed<DocBlock[]>(() => {
    const tmplId = this.selectedTemplateId();
    const items = this.selectedItems();
    const blocks: DocBlock[] = [];

    if (!tmplId) {
      // No template: show basic preview with selected items
      blocks.push({
        id: 'hdr',
        type: 'text',
        order: 0,
        title: 'Коммерческое предложение',
        content: 'Предварительный просмотр',
        settings: { fontSize: '18px', align: 'center' },
      });
      if (items.length > 0) {
        blocks.push({
          id: 'tbl',
          type: 'table',
          order: 1,
          title: `Товары (${items.length} позиций)`,
          _inlineRows: items.map(item => this.cartItemToRow(item)),
        });
      }
      return blocks;
    }

    // Use the selected template
    const tmpl = this.templates().find(t => t.id === tmplId);
    if (!tmpl) return blocks;

    // Resolve placeholder data
    const orgId = this.selectedOrgId();
    const org = orgId ? this.organizations().find(o => o.id === orgId) : null;
    const clientId = this.selectedClientId();
    const client = clientId ? this.clients().find(c => c.id === clientId) : null;
    const clientName = client ? [client.lastName, client.firstName, client.patronymic].filter(Boolean).join(' ') : 'Клиент';
    const orgName = org ? (org.shortName || org.name) : 'Организация';
    const total = this.totalWithMarkup();

    const placeholders: Record<string, string> = {
      '{{client.name}}': clientName,
      '{{org.shortName}}': orgName,
      '{{org.name}}': org ? org.name : 'Организация',
      '{{total}}': total.toLocaleString('ru-RU') + ' ₽',
      '{{date}}': new Date().toLocaleDateString('ru-RU'),
      '{{items.count}}': String(items.length),
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

    // If there are selected items, populate the FIRST table block with product data
    if (items.length > 0) {
      const clientMarkup = this.clientMarkupPercent();
      const grandTotal = this.totalWithMarkup();
      const baseTotal = this.totalSum();

      const tableBlock = blocks.find(b => b.type === 'table' && b.tableTemplateId);
      if (tableBlock) {
        // Заполняем table-блок инлайн-данными из корзины
        tableBlock._inlineRows = items.map(item => this.cartItemToRow(item));

        // Итоги по колонкам
        const summaries: Record<string, number> = {
          quantity: items.reduce((s, i) => s + i.quantity, 0),
          total: grandTotal,
          totalAmount: grandTotal,
          price: items.reduce((s, i) => s + i.price, 0) / items.length, // средняя цена
        };
        tableBlock._columnSummaries = summaries;

        // Footer строки
        const footerRows: { label: string; value: string }[] = [];
        footerRows.push({ label: 'Итого:', value: grandTotal.toLocaleString('ru-RU') + ' ₽' });
        if (clientMarkup > 0) {
          const markupAmount = grandTotal - baseTotal;
          footerRows.push({ label: 'Наценка (' + clientMarkup + '%):', value: '+' + markupAmount.toLocaleString('ru-RU') + ' ₽' });
        }
        tableBlock._footerRows = footerRows;
      } else {
        // Fallback: нет table-блоков в шаблоне → добавляем текстовый блок
        const itemLines = items.map(i =>
          `• ${i.name} (${i.sku}) — ${i.quantity} × ${i.price.toLocaleString('ru-RU')} ₽ = ${(i.price * i.quantity).toLocaleString('ru-RU')} ₽`
        );
        blocks.push({
          id: 'sel-items',
          type: 'text',
          order: blocks.length,
          title: `Выбрано товаров: ${items.length} на сумму ${total.toLocaleString('ru-RU')} ₽`,
          content: itemLines.join('\n'),
        });
      }
    }
    return blocks;
  });

  /** Сформировать строку таблицы из позиции корзины (поля под любые column.fieldName) */
  private cartItemToRow(item: CartItem): Record<string, unknown> {
    const total = this.itemTotal(item);
    return {
      name: item.name,
      sku: item.sku,
      price: item.price,
      unitPrice: item.price,
      quantity: item.quantity,
      unit: item.unit,
      total,
      totalAmount: total,
      productName: item.name,
      productSku: item.sku,
      productUnit: item.unit,
      markupPercent: item.markupPercent ?? 0,
    };
  }

  /** Background images from selected template (first image as default, with old-field fallback) */
  selectedBackgroundImage = computed(() => {
    const tmplId = this.selectedTemplateId();
    if (!tmplId) return '';
    const tmpl = this.templates().find(t => t.id === tmplId);
    const images = tmpl?.backgroundImages;
    if (images && images.length > 0) return images[0];
    // Fallback: старый формат (single backgroundImage)
    return (tmpl as unknown as Record<string, unknown>)['backgroundImage'] as string ?? '';
  });

  constructor() {
    this.loadData();
  }

  async loadData() {
    try {
      const [prodRes, orgRes, tmplRes, catRes, clientRes] = await Promise.all([
        firstValueFrom(this.productService.getAll()),
        firstValueFrom(this.orgService.getOrganizations()),
        firstValueFrom(this.templateService.getTemplates()),
        firstValueFrom(this.categoryService.getAll()),
        firstValueFrom(this.clientService.getClients()),
      ]);
      if (prodRes.success) this.allProducts.set(prodRes.data);
      if (orgRes.success) this.organizations.set(orgRes.data);
      if (tmplRes.success) this.templates.set(tmplRes.data);
      if (clientRes.success) this.clients.set(clientRes.data.filter(c => c.isActive));
      if (catRes.success) {
        this.categories.set(catRes.data.filter(c => c.isActive).map(c => ({
          id: c.id,
          name: c.name,
        })));
      }

      // Auto-select default template (quotation with isDefault or first quotation)
      const quotationTemplates = tmplRes.data.filter(t => t.docType === 'quotation');
      if (quotationTemplates.length > 0) {
        const defaultTmpl = quotationTemplates.find(t => t.isDefault) || quotationTemplates[0];
        if (defaultTmpl) this.selectedTemplateId.set(defaultTmpl.id);
      }
    } catch {
      this.notification.error('Ошибка загрузки данных');
    }
  }

  /** При смене организации — сбрасываем шаблон, если он не принадлежит этой организации */
  onOrgChange() {
    const orgId = this.selectedOrgId();
    const currentTmpl = this.selectedTemplateId();
    if (currentTmpl) {
      const tmpl = this.templates().find(t => t.id === currentTmpl);
      if (tmpl && tmpl.organizationId && tmpl.organizationId !== orgId) {
        this.selectedTemplateId.set('');
      }
    }
  }

  /** Открыть диалог редактирования строки */
  openEditItem(item: CartItem) {
    this.editItem.set(item);
    this.editQuantity.set(item.quantity);
    this.editPrice.set(item.price);
    this.editMarkup.set(this.effectiveMarkup(item));
    this.editDialogVisible.set(true);
  }

  /** Сохранить изменения в отредактированной строке */
  saveEditItem() {
    const item = this.editItem();
    if (!item) return;

    const qty = Math.max(1, Math.round(this.editQuantity()));
    const price = Math.max(0, this.editPrice());
    const markup = Math.max(0, this.editMarkup());

    this.cartService.updateQuantity(item.id, qty);
    // Price update - since CartService doesn't have updatePrice, we do it here
    this.cartService.updatePrice(item.id, price);
    this.cartService.updateMarkup(item.id, markup);

    this.editDialogVisible.set(false);
    this.notification.success('Позиция обновлена');
  }

  /** Изменить наценку для позиции */
  onItemMarkupChange(itemId: string, value: string | number) {
    const num = parseFloat(String(value));
    if (isNaN(num) || num < 0) return;
    this.cartService.updateMarkup(itemId, num);
  }

  /** Наценка для данной позиции (клиентская или из товара) */
  effectiveMarkup(item: CartItem): number {
    const clientMarkup = this.clientMarkupPercent();
    if (clientMarkup > 0) return clientMarkup;
    return item.markupPercent ?? 0;
  }

  /** Сумма позиции с наценкой */
  itemTotal(item: CartItem): number {
    const markup = this.effectiveMarkup(item);
    return Math.round(item.price * (1 + markup / 100) * item.quantity * 100) / 100;
  }

  /** Открыть диалог предпросмотра с PDF экспортом */
  openPdfPreview() {
    const blocks = this.docBlocks();
    if (blocks.length === 0) {
      this.notification.warn('Нет данных для экспорта. Добавьте товары и выберите шаблон.');
      return;
    }
    const tmplId = this.selectedTemplateId();
    const tmpl = tmplId ? this.templates().find(t => t.id === tmplId) : null;
    this.previewDialog()?.open(
      tmpl?.name || 'Коммерческое предложение',
      'quotation',
      blocks,
      tmpl?.backgroundImages || [],
      tmpl?.backgroundOpacity ?? 1,
    );
  }

  /** Add product to the document (via cart service) */
  onAddProduct(product: Product) {
    this.cartService.addItem(product);
    this.notification.success(`«${product.name}» добавлен в документ`);
  }

  /** Clear all selected items */
  clearItems() {
    this.cartService.clearCart();
    this.notification.success('Список товаров очищен');
  }

  plural(n: number, one: string, few: string, many: string): string {
    n = Math.abs(n) % 100;
    const n1 = n % 10;
    if (n > 10 && n < 20) return many;
    if (n1 > 1 && n1 < 5) return few;
    if (n1 === 1) return one;
    return many;
  }

  /** Create commercial proposal from selected items */
  async createProposal() {
    const items = this.selectedItems();
    if (items.length === 0) {
      this.notification.warn('Добавьте товары в документ');
      return;
    }

    this.saving.set(true);
    try {
      const proposalItems = items.map(ci => {
        const markup = this.effectiveMarkup(ci);
        const total = Math.round(ci.price * (1 + markup / 100) * ci.quantity * 100) / 100;
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
          total,
        };
      });

      const result = await firstValueFrom(this.proposalService.createWithItems(
        {
          organizationId: this.selectedOrgId() || undefined,
          templateId: this.selectedTemplateId() || undefined,
          status: 'draft' as const,
      
        },
        proposalItems,
      ));

      if (result.success) {
        this.cartService.clearCart();
        this.notification.success('Коммерческое предложение создано');
        this.router.navigate(['/sales/proposals']);
      } else {
        this.notification.error(result.message || 'Ошибка создания КП');
      }
    } catch {
      this.notification.error('Ошибка создания КП');
    } finally {
      this.saving.set(false);
    }
  }
}
