import { Component, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { firstValueFrom } from 'rxjs';

import { KpButtonComponent } from '../../shared/ui/kp-button.component';
import { KpBreadcrumbComponent } from '../../shared/ui/kp-breadcrumb.component';
import { KpCardComponent } from '../../shared/ui/kp-card.component';
import { KpInputComponent } from '../../shared/ui/kp-input.component';
import { KpSelectComponent } from '../../shared/ui/kp-select.component';
import { KpToggleComponent } from '../../shared/ui/kp-toggle.component';
import { KpToastComponent } from '../../shared/ui/kp-toast.component';
import { NotificationService } from '../../core/notification.service';
import { ProductService } from '../../core/product.service';
import { ProductCategoryService } from '../../core/product-category.service';
import type { ProductCategory } from '../../../../shared/types/index.js';

@Component({
  selector: 'app-product-editor',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    KpButtonComponent, KpBreadcrumbComponent, KpCardComponent,
    KpInputComponent, KpSelectComponent, KpToggleComponent, KpToastComponent,
  ],
  template: `
    <kp-toast />

    <kp-card>
      <kp-breadcrumb [items]="breadcrumbs()" />

      <h2 class="pe-title">{{ isNew() ? 'Новый товар' : 'Редактирование товара' }}</h2>

      <div class="pe-form">
        <!-- Основные поля -->
        <div class="pe-section">
          <h3 class="pe-section__title">Основное</h3>
          <kp-input label="Наименование" placeholder="Введите название товара" [(ngModel)]="name" [error]="nameError()" />
          <kp-input label="Артикул (SKU)" [(ngModel)]="sku" [disabled]="!isNew()" placeholder="Заполнится автоматически" />
          <kp-select
            label="Категория"
            [options]="categoryOptions()"
            [(ngModel)]="categoryId"
            (ngModelChange)="onCategoryChange()"
            [error]="categoryError()"
          />
          <kp-select
            label="Тип товара"
            [options]="typeOptions"
            [(ngModel)]="productType"
          />
          <kp-select
            label="Единица измерения"
            [options]="unitOptions"
            [(ngModel)]="unit"
            [error]="unitError()"
          />
        </div>

        <!-- Цены -->
        <div class="pe-section">
          <h3 class="pe-section__title">Цены</h3>
          <kp-input label="Базовая цена (₽)" type="number" placeholder="0" [(ngModel)]="basePrice" />
          <kp-input label="Наценка по умолчанию (%)" type="number" placeholder="0" [(ngModel)]="markupPercent" />
        </div>

        <!-- Характеристики -->
        <div class="pe-section">
          <h3 class="pe-section__title">Характеристики</h3>
          <kp-input label="Описание" placeholder="Характеристики товара" [(ngModel)]="description" />
          <kp-input label="Вес (кг)" type="number" placeholder="0" [(ngModel)]="weightKg" />
          <kp-input label="Габариты (Д×Ш×В мм)" placeholder="Например: 1800×600×800" [(ngModel)]="dimensions" />
          <kp-input label="Материал" placeholder="Основной материал" [(ngModel)]="material" />
        </div>

        <!-- Статусы -->
        <div class="pe-section">
          <h3 class="pe-section__title">Статус</h3>
          <kp-toggle label="Активен (показывать в витрине)" [(ngModel)]="isActive" />
          <kp-toggle label="Есть паспорт качества" [(ngModel)]="hasPassport" />
          <kp-toggle label="Есть чертёж (DWG)" [(ngModel)]="hasDrawing" />
        </div>

        <!-- Действия -->
        <div class="pe-actions">
          <kp-button label="Сохранить" lucideIcon="check" [loading]="saving()" (buttonClick)="save()" />
          <kp-button label="Отмена" lucideIcon="x" severity="secondary" (buttonClick)="cancel()" />
        </div>
      </div>
    </kp-card>
  `,
  styles: [`
    :host { display: block; max-width: 800px; margin: 0 auto; padding: var(--space-6); }
    .pe-title { font-size: var(--font-size-xl); font-weight: var(--font-weight-bold); color: var(--color-text); margin: var(--space-4) 0; }
    .pe-form { display: flex; flex-direction: column; gap: var(--space-6); }
    .pe-section { display: flex; flex-direction: column; gap: var(--space-4); }
    .pe-section__title { font-size: var(--font-size-base); font-weight: var(--font-weight-semibold); color: var(--color-text-secondary); margin: 0 0 var(--space-2); padding-bottom: var(--space-2); border-bottom: 1px solid var(--color-border); }
    .pe-actions { display: flex; gap: var(--space-3); justify-content: flex-end; padding-top: var(--space-4); border-top: 1px solid var(--color-border); }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductEditorComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productService = inject(ProductService);
  private categoryService = inject(ProductCategoryService);
  private notification = inject(NotificationService);

  categories = signal<ProductCategory[]>([]);
  saving = signal(false);
  loading = signal(false);
  isNew = signal(true);

  editId = signal<string | null>(null);
  name = signal('');
  sku = signal('');
  categoryId = signal('');
  productType = signal<'purchased' | 'manufactured'>('manufactured');
  unit = signal('шт');
  basePrice = signal<number | null>(null);
  markupPercent = signal<number | null>(null);
  description = signal('');
  weightKg = signal<number | null>(null);
  dimensions = signal('');
  material = signal('');
  isActive = signal(true);
  hasPassport = signal(false);
  hasDrawing = signal(false);

  nameError = signal('');
  categoryError = signal('');
  unitError = signal('');

  typeOptions = [
    { label: '🔧 Изготавливаемый', value: 'manufactured' },
    { label: '🛒 Покупной', value: 'purchased' },
  ];

  unitOptions = [
    { label: 'шт', value: 'шт' },
    { label: 'комплект', value: 'комплект' },
    { label: 'кв.м', value: 'кв.м' },
    { label: 'м.п.', value: 'м.п.' },
    { label: 'кг', value: 'кг' },
  ];

  categoryOptions = computed(() =>
    this.categories().filter(c => c.isActive).map(c => ({
      label: `${c.prefix} — ${c.name}`,
      value: c.id,
    }))
  );

  breadcrumbs = computed((): MenuItem[] => [
    { label: 'Продажи' },
    { label: 'Товары и услуги', routerLink: '/sales/products' },
    { label: this.isNew() ? 'Новый товар' : 'Редактирование' },
  ]);

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isNew.set(false);
      this.editId.set(id);
    }
    this.load();
  }

  async load() {
    this.loading.set(true);
    try {
      const catRes = await firstValueFrom(this.categoryService.getAll());
      this.categories.set(catRes.data);

      if (!this.isNew()) {
        const prodRes = await firstValueFrom(this.productService.getProduct(this.editId()!));
        if (prodRes.success && prodRes.data) {
          const p = prodRes.data;
          this.name.set(p.name);
          this.sku.set(p.sku);
          this.categoryId.set(p.categoryId);
          this.productType.set(p.productType);
          this.unit.set(p.unit);
          this.basePrice.set(p.basePrice ?? null);
          this.markupPercent.set(p.defaultMarkupPercent ?? null);
          this.description.set(p.description ?? '');
          this.weightKg.set(p.weightKg ?? null);
          this.dimensions.set(p.dimensions ?? '');
          this.material.set(p.material ?? '');
          this.isActive.set(p.isActive);
          this.hasPassport.set(p.hasPassport);
          this.hasDrawing.set(p.hasDrawing);
        }
      } else if (this.categoryOptions().length > 0) {
        this.categoryId.set(this.categoryOptions()[0].value);
        this.onCategoryChange();
      }
    } finally {
      this.loading.set(false);
    }
  }

  onCategoryChange() {
    if (this.isNew() && this.categoryId()) {
      this.sku.set(this.productService.previewSku(this.categoryId()));
    }
  }

  async save() {
    this.nameError.set('');
    this.categoryError.set('');
    this.unitError.set('');

    let hasError = false;
    if (!this.name().trim()) { this.nameError.set('Название обязательно'); hasError = true; }
    if (!this.categoryId()) { this.categoryError.set('Выберите категорию'); hasError = true; }
    if (!this.unit()) { this.unitError.set('Выберите единицу измерения'); hasError = true; }
    if (hasError) return;

    this.saving.set(true);
    try {
      const data = {
        name: this.name().trim(),
        categoryId: this.categoryId(),
        productType: this.productType(),
        unit: this.unit(),
        basePrice: this.basePrice() ?? undefined,
        defaultMarkupPercent: this.markupPercent() ?? undefined,
        description: this.description().trim() || undefined,
        weightKg: this.weightKg() ?? undefined,
        dimensions: this.dimensions().trim() || undefined,
        material: this.material().trim() || undefined,
        isActive: this.isActive(),
        hasPassport: this.hasPassport(),
        hasDrawing: this.hasDrawing(),
      };

      if (this.isNew()) {
        await firstValueFrom(this.productService.createProduct(data));
        this.notification.success('Товар создан');
      } else {
        await firstValueFrom(this.productService.updateProduct(this.editId()!, data));
        this.notification.success('Товар обновлён');
      }
      this.router.navigate(['/sales/products']);
    } catch {
      this.notification.error('Ошибка сохранения');
    } finally {
      this.saving.set(false);
    }
  }

  cancel() {
    this.router.navigate(['/sales/products']);
  }
}
