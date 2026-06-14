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
import { ProposalDocBuilderService } from '../../core/proposal-doc-builder.service';
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

    @defer (on idle) {
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

          <!-- Selected items summary — скрыто, настройки таблицы при клике на A4 -->

          <!-- Диалог редактирования строки -->
          <kp-dialog
            header="✎ Редактирование позиции"
            [(visible)]="editDialogVisible"
            width="480px"
          >
            @if (editItem(); as ei) {
              <div class="showcase__edit-form">
                <!-- Инфо блок: что редактируем -->
                <div class="showcase__edit-header">
                  <kp-input label="Название" [(ngModel)]="editName" />
                  <kp-input label="Артикул" [(ngModel)]="editSku" placeholder="Артикул" />
                </div>
                <div class="showcase__edit-grid">
                  <kp-input label="Количество" type="number" [(ngModel)]="editQuantity" />
                  <kp-input label="Цена за ед." type="number" [(ngModel)]="editPrice" />
                  <kp-input label="Наценка, %" type="number" [(ngModel)]="editMarkup" />
                </div>
                @let total = editPrice() * editQuantity() * (1 + editMarkup() / 100);
                <div class="showcase__edit-total">
                  <span>Итого по позиции:</span>
                  <strong>{{ total.toLocaleString('ru-RU') }} ₽</strong>
                </div>
              </div>
              <div class="showcase__dialog-footer">
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
            <div class="showcase__settings-form">
              <kp-input
                label="Общая скидка, %"
                type="number"
                [(ngModel)]="discountPercent"
                placeholder="0"
                min="0"
                max="100"
              />
              @if (selectedItems().length > 0) {
                <div class="showcase__settings-info">
                  <span>Всего позиций:</span>
                  <strong>{{ selectedItems().length }} шт.</strong>
                </div>
                <div class="showcase__settings-info">
                  <span>Сумма до скидки:</span>
                  <strong>{{ totalWithMarkup().toLocaleString('ru-RU') }} ₽</strong>
                </div>
                @if (discountPercent() > 0) {
                  <div class="showcase__settings-info showcase__settings-info--discount">
                    <span>Скидка {{ discountPercent() }}%:</span>
                    <strong>-{{ discountAmount().toLocaleString('ru-RU') }} ₽</strong>
                  </div>
                }
              }
            </div>
            <div class="showcase__dialog-footer">
              <kp-button
                label="🗑 Очистить все товары"
                lucideIcon="trash-2"
                severity="danger"
                [disabled]="selectedItems().length === 0"
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

          <!-- A4 Canvas -->
          <div class="showcase__canvas">
            <kp-doc-canvas
              [blocks]="docBlocks()"
              [editable]="false"
              [backgroundImages]="selectedBackgroundImage() ? [selectedBackgroundImage()] : []"
              (blockRowClick)="onCanvasRowClick($event)"
              (canvasClick)="onCanvasClick()"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- PDF preview dialog -->
    <kp-doc-preview-dialog />
    } @placeholder {
      <div style="display:flex;align-items:center;justify-content:center;min-height:60vh">
        <p style="color:var(--color-text-secondary);font-size:var(--font-size-lg)">📋 Загрузка оформления КП...</p>
      </div>
    }
  `,
  styleUrl: './proposal-showcase.component.scss',
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
  private docBuilder = inject(ProposalDocBuilderService);
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
    return this.editName().trim() !== item.name || this.editSku().trim() !== item.sku;
  });

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

  /** Итоговая сумма с учётом наценки (без учёта глобальной скидки) */
  totalWithMarkup = computed(() => {
    const clientMarkup = this.clientMarkupPercent();
    return this.selectedItems().reduce((sum, ci) => {
      const markup = clientMarkup > 0 ? clientMarkup : (ci.markupPercent ?? 0);
      return sum + ci.price * (1 + markup / 100) * ci.quantity;
    }, 0);
  });

  /** Сумма глобальной скидки */
  discountAmount = computed(() => {
    const total = this.totalWithMarkup();
    const pct = this.discountPercent();
    if (pct <= 0) return 0;
    return Math.round(total * pct / 100 * 100) / 100;
  });

  /** Итоговая сумма с учётом наценки И глобальной скидки */
  grandTotal = computed(() => {
    return this.totalWithMarkup() - this.discountAmount();
  });

  /** Ставка НДС (%) из выбранной организации (по умолчанию 20%) */
  selectedVatRate = computed(() => {
    const orgId = this.selectedOrgId();
    if (!orgId) return 20;
    const org = this.organizations().find(o => o.id === orgId);
    return org?.vatRate ?? 20;
  });

  /** Сумма НДС от итоговой суммы (после скидки) */
  ndsAmount = computed(() => {
    const total = this.grandTotal();
    const rate = this.selectedVatRate();
    // НДС = total * rate / (100 + rate) — выделение НДС из суммы
    return Math.round(total * rate / (100 + rate) * 100) / 100;
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
    return this.docBuilder.buildDocBlocks({
      templateId: this.selectedTemplateId(),
      templates: this.templates(),
      items: this.selectedItems(),
      organizationId: this.selectedOrgId(),
      organizations: this.organizations(),
      clientId: this.selectedClientId(),
      clients: this.clients(),
      grandTotal: this.grandTotal(),
      discountPercent: this.discountPercent(),
      discountAmount: this.discountAmount(),
      totalBeforeDiscount: this.totalWithMarkup(),
      vatRate: this.selectedVatRate(),
      vatAmount: this.ndsAmount(),
      clientMarkup: this.clientMarkupPercent(),
      itemType: 'cart',
      baseTotal: this.totalSum(),
    });
  });

  /** Сформировать строку таблицы из позиции корзины */
  private cartItemToRow(item: CartItem): Record<string, unknown> {
    return this.docBuilder.cartItemToRow(item, this.clientMarkupPercent());
  }

  /** Background images from selected template */
  selectedBackgroundImage = computed(() =>
    this.docBuilder.getBackgroundImage(this.selectedTemplateId(), this.templates())
  );

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
    this.editName.set(item.name);
    this.editSku.set(item.sku);
    this.editQuantity.set(item.quantity);
    this.editPrice.set(item.price);
    this.editMarkup.set(this.effectiveMarkup(item));
    this.editDialogVisible.set(true);
  }

  /** Сохранить изменения — заменить текущую строку */
  saveEditItem() {
    const item = this.editItem();
    if (!item) return;

    const qty = Math.max(1, Math.round(this.editQuantity()));
    const price = Math.max(0, this.editPrice());
    const markup = Math.max(0, this.editMarkup());
    const name = this.editName().trim() || item.name;
    const sku = this.editSku().trim() || item.sku;

    const updated: CartItem = {
      ...item,
      name,
      sku,
      quantity: qty,
      price,
      markupPercent: markup,
    };

    this.cartService.replaceItem(item.id, updated);
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
    const name = this.editName().trim() || item.name;
    const sku = this.editSku().trim() || item.sku;

    const copy: CartItem = {
      ...item,
      id: generateId(), // новый id
      name,
      sku,
      quantity: qty,
      price,
      markupPercent: markup,
    };

    this.cartService.replaceWithCopy(item.id, copy);
    this.editDialogVisible.set(false);
    this.notification.success('Копия сохранена на место оригинала');
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

  /** Клик по строке в A4-таблице — открыть редактор */
  onCanvasRowClick(event: { block: DocBlock; row: Record<string, unknown>; index: number }) {
    const items = this.selectedItems();
    const item = items[event.index];
    if (item) {
      this.openEditItem(item);
    }
  }

  /** Клик по пустому месту A4 — открыть настройки таблицы */
  onCanvasClick() {
    if (this.selectedItems().length > 0) {
      this.settingsDialogVisible.set(true);
    }
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
          clientId: this.selectedClientId() || undefined,
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
