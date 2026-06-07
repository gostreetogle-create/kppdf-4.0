import { Component, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { firstValueFrom } from 'rxjs';

import { generateId } from '../../core/crud-factory';

import { KpButtonComponent } from '../../shared/ui/kp-button.component';
import { KpBreadcrumbComponent } from '../../shared/ui/kp-breadcrumb.component';
import { KpCardComponent } from '../../shared/ui/kp-card.component';
import { KpInputComponent } from '../../shared/ui/kp-input.component';
import { KpSelectComponent } from '../../shared/ui/kp-select.component';
import { KpToggleComponent } from '../../shared/ui/kp-toggle.component';
import { KpToastComponent } from '../../shared/ui/kp-toast.component';
import { KpDialogComponent } from '../../shared/ui/kp-dialog.component';
import { NotificationService } from '../../core/notification.service';
import { ProductService } from '../../core/product.service';
import { ProductCategoryService } from '../../core/product-category.service';
import { ProductPhotoService } from '../../core/product-photo.service';
import { ProductComponentService } from '../../core/product-component.service';
import type { ProductCategory, ProductPhoto, ProductComponent, ComponentMaterial, ComponentWorkType } from '../../../../shared/types/index.js';

@Component({
  selector: 'app-product-editor',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    KpButtonComponent, KpBreadcrumbComponent, KpCardComponent,
    KpInputComponent, KpSelectComponent, KpToggleComponent, KpToastComponent,
    KpDialogComponent,
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

        <!-- Фотографии -->
        <div class="pe-section">
          <h3 class="pe-section__title">
            📷 Фотографии <span class="pe-section__badge">{{ photos().length }}</span>
          </h3>

          @if (!isNew()) {
            <div class="pe-photo-grid">
              @for (photo of photos(); track photo.id) {
                <div class="pe-photo-card" [class.pe-photo-card--main]="photo.isMain">
                  <div class="pe-photo-card__image">
                    <img [src]="photo.url" [alt]="photo.caption || 'Фото товара'" loading="lazy" />
                    @if (photo.isMain) {
                      <span class="pe-photo-card__main-badge" title="Главное фото">⭐</span>
                    }
                  </div>
                  <div class="pe-photo-card__caption">
                    @if (editingCaptionId() === photo.id) {
                      <kp-input
                        [(ngModel)]="editCaption"
                        placeholder="Подпись к фото..."
                        (keyup.enter)="saveCaption(photo.id)"
                      />
                      <div class="pe-photo-card__caption-actions">
                        <kp-button label="✓" severity="success" (buttonClick)="saveCaption(photo.id)" />
                        <kp-button label="✕" severity="secondary" (buttonClick)="editingCaptionId.set(null)" />
                      </div>
                    } @else {
                      <span class="pe-photo-card__caption-text"
                        [class.pe-photo-card__caption-text--empty]="!photo.caption"
                        (dblclick)="startEditCaption(photo)">
                        {{ photo.caption || 'Двойной клик — добавить подпись' }}
                      </span>
                    }
                  </div>
                  <div class="pe-photo-card__actions">
                    @if (!photo.isMain) {
                      <kp-button title="Сделать главным" lucideIcon="star" severity="info" (buttonClick)="setMainPhoto(photo.id)" />
                    }
                    <kp-button title="Редактировать подпись" lucideIcon="pencil" severity="secondary" (buttonClick)="startEditCaption(photo)" />
                    @if (photos().length > 1) {
                      <kp-button
                        title="Переместить вверх"
                        lucideIcon="chevron-up"
                        severity="secondary"
                        [disabled]="photo.sortOrder <= 1"
                        (buttonClick)="movePhoto(photo.id, -1)"
                      />
                      <kp-button
                        title="Переместить вниз"
                        lucideIcon="chevron-down"
                        severity="secondary"
                        [disabled]="photo.sortOrder >= photos().length"
                        (buttonClick)="movePhoto(photo.id, 1)"
                      />
                    }
                    <kp-button title="Удалить фото" lucideIcon="trash-2" severity="danger" (buttonClick)="deletePhoto(photo.id)" />
                  </div>
                </div>
              }
            </div>
          } @else {
            <p class="pe-section__hint">Сохраните товар, чтобы добавить фотографии.</p>
          }

          @if (!isNew()) {
            <kp-button label="Добавить фото" lucideIcon="camera" (buttonClick)="openAddPhotoDialog()" />
          }
        </div>

        <!-- Компоненты (только для изготавливаемых) -->
        @if (productType() === 'manufactured') {
          <div class="pe-section">
            <h3 class="pe-section__title">
              🔩 Компоненты <span class="pe-section__badge">{{ components().length }}</span>
            </h3>

            @if (!isNew()) {
              @for (comp of components(); track comp.id) {
                <div class="pe-comp-card">
                  <div class="pe-comp-card__header">
                    <span class="pe-comp-card__name">{{ comp.name }}</span>
                    <span class="pe-comp-card__qty">×{{ comp.quantityPerProduct }} шт/товар</span>
                  </div>
                  @if (comp.description) {
                    <p class="pe-comp-card__desc">{{ comp.description }}</p>
                  }

                  <!-- Материалы -->
                  @if (comp.materials.length > 0) {
                    <div class="pe-comp-card__materials">
                      <span class="pe-comp-card__label">Материалы:</span>
                      @for (m of comp.materials; track m.id) {
                        <span class="pe-comp-card__tag">{{ m.name }} — {{ m.quantity }} {{ m.unit }}</span>
                      }
                    </div>
                  }

                  <!-- Виды работ -->
                  @if (comp.workTypes.length > 0) {
                    <div class="pe-comp-card__work-types">
                      <span class="pe-comp-card__label">Работы:</span>
                      @for (w of comp.workTypes; track w.id) {
                        <span class="pe-comp-card__tag pe-comp-card__tag--work">{{ w.name }} ({{ w.normHours }}ч)</span>
                      }
                    </div>
                  }

                  <div class="pe-comp-card__actions">
                    <kp-button lucideIcon="pencil" severity="secondary" [text]="true" [rounded]="true" title="Редактировать" (buttonClick)="editComponent(comp)" />
                    <kp-button lucideIcon="trash-2" severity="danger" [text]="true" [rounded]="true" title="Удалить" (buttonClick)="deleteComponent(comp.id)" />
                  </div>
                </div>
              } @empty {
                <p class="pe-section__hint">Компоненты не заданы. Добавьте составляющие части товара.</p>
              }

              <kp-button label="Добавить компонент" lucideIcon="plus" (buttonClick)="openCompDialog()" />
            } @else {
              <p class="pe-section__hint">Сохраните товар, чтобы добавить компоненты.</p>
            }
          </div>
        }

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

    <!-- Диалог добавления фото -->
    <kp-dialog
      header="Добавить фотографию"
      [visible]="addPhotoDialogVisible()"
      (visibleChange)="addPhotoDialogVisible.set($event)"
      width="500px"
    >
      <div class="pe-photo-add">
        <kp-input
          label="URL изображения"
          placeholder="https://example.com/photo.jpg"
          [(ngModel)]="newPhotoUrl"
        />
        <p class="pe-photo-add__hint">
          Вставьте прямую ссылку на изображение (jpg, png, webp). Загрузка файлов будет доступна при подключении бэкенда.
        </p>
        @if (newPhotoUrl()) {
          <div class="pe-photo-add__preview">
            <img [src]="newPhotoUrl()" alt="Предпросмотр" (error)="$any($event.target).style.display='none'" />
          </div>
        }
      </div>
      <div class="pe-photo-add__actions">
        <kp-button label="Добавить" lucideIcon="check" [disabled]="!newPhotoUrl().trim()" (buttonClick)="addPhoto()" />
        <kp-button label="Отмена" lucideIcon="x" severity="secondary" (buttonClick)="addPhotoDialogVisible.set(false)" />
      </div>
    </kp-dialog>

    <!-- Диалог добавления/редактирования компонента -->
    <kp-dialog
      [header]="editingCompId() ? 'Редактировать компонент' : 'Добавить компонент'"
      [visible]="compDialogVisible()"
      (visibleChange)="compDialogVisible.set($event)"
      width="650px"
    >
      <div class="pe-comp-dialog">
        <kp-input label="Название компонента" placeholder="Например: Стойка, Перекладина, Сидушка" [(ngModel)]="compName" />
        <div class="pe-comp-dialog__row">
          <kp-input label="Кол-во на товар" type="number" [(ngModel)]="compQtyPerProduct" />
          <kp-input label="Порядок" type="number" [(ngModel)]="compSortOrder" />
        </div>
        <kp-input label="Описание" placeholder="Необязательно" [(ngModel)]="compDesc" />

        <!-- Материалы -->
        <fieldset class="pe-comp-dialog__fieldset">
          <legend>Материалы</legend>
          @for (m of compMaterials(); track m.id) {
            <div class="pe-comp-dialog__chip-row">
              <span class="pe-comp-dialog__chip">{{ m.name }} — {{ m.quantity }} {{ m.unit }}</span>
              <kp-button lucideIcon="x" severity="danger" [text]="true" [rounded]="true" (buttonClick)="removeMaterial(m.id)" />
            </div>
          }
          <div class="pe-comp-dialog__add-row">
            <kp-input placeholder="Материал" [(ngModel)]="matName" styleClass="pe-comp-dialog__input-sm" />
            <kp-input placeholder="Кол-во" type="number" [(ngModel)]="matQty" styleClass="pe-comp-dialog__input-xs" />
            <kp-input placeholder="Ед." [(ngModel)]="matUnit" styleClass="pe-comp-dialog__input-xs" />
            <kp-input placeholder="Прим." [(ngModel)]="matNotes" styleClass="pe-comp-dialog__input-sm" />
            <kp-button label="+" severity="success" [text]="true" (buttonClick)="addMaterial()" />
          </div>
        </fieldset>

        <!-- Виды работ -->
        <fieldset class="pe-comp-dialog__fieldset">
          <legend>Виды работ</legend>
          @for (w of compWorkTypes(); track w.id) {
            <div class="pe-comp-dialog__chip-row">
              <span class="pe-comp-dialog__chip pe-comp-dialog__chip--work">{{ w.name }} ({{ w.department }}, {{ w.normHours }}ч)</span>
              <kp-button lucideIcon="x" severity="danger" [text]="true" [rounded]="true" (buttonClick)="removeWorkType(w.id)" />
            </div>
          }
          <div class="pe-comp-dialog__add-row">
            <kp-input placeholder="Работа" [(ngModel)]="wtName" styleClass="pe-comp-dialog__input-sm" />
            <kp-select [options]="deptOptions" [(ngModel)]="wtDept" styleClass="pe-comp-dialog__input-sm" />
            <kp-input placeholder="Часы" type="number" [(ngModel)]="wtHours" styleClass="pe-comp-dialog__input-xs" />
            <kp-button label="+" severity="success" [text]="true" (buttonClick)="addWorkType()" />
          </div>
        </fieldset>
      </div>
      <div class="pe-comp-dialog__footer">
        <kp-button label="Сохранить" lucideIcon="check" (buttonClick)="saveComponent()" />
        <kp-button label="Отмена" lucideIcon="x" severity="secondary" (buttonClick)="compDialogVisible.set(false)" />
      </div>
    </kp-dialog>
  `,
  styles: [`
    :host { display: block; max-width: 800px; margin: 0 auto; padding: var(--space-6); }
    .pe-title { font-size: var(--font-size-xl); font-weight: var(--font-weight-bold); color: var(--color-text); margin: var(--space-4) 0; }
    .pe-form { display: flex; flex-direction: column; gap: var(--space-6); }
    .pe-section { display: flex; flex-direction: column; gap: var(--space-4); }
    .pe-section__title { font-size: var(--font-size-base); font-weight: var(--font-weight-semibold); color: var(--color-text-secondary); margin: 0 0 var(--space-2); padding-bottom: var(--space-2); border-bottom: 1px solid var(--color-border); }
    .pe-actions { display: flex; gap: var(--space-3); justify-content: flex-end; padding-top: var(--space-4); border-top: 1px solid var(--color-border); }

    /* ── Фотогалерея ── */
    .pe-section__badge {
      display: inline-flex; align-items: center; justify-content: center;
      background: var(--color-primary); color: #fff;
      font-size: var(--font-size-xs); font-weight: var(--font-weight-bold);
      width: 22px; height: 22px; border-radius: 50%; margin-left: var(--space-2);
    }
    .pe-section__hint {
      color: var(--color-text-secondary); font-size: var(--font-size-sm);
      font-style: italic; margin: var(--space-2) 0;
    }
    .pe-photo-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: var(--space-4);
      margin-bottom: var(--space-4);
    }
    .pe-photo-card {
      border: 1px solid var(--color-border);
      border-radius: var(--border-radius-lg);
      overflow: hidden;
      background: var(--color-surface);
      transition: box-shadow var(--transition-fast), border-color var(--transition-fast);
    }
    .pe-photo-card:hover {
      box-shadow: var(--shadow-md);
    }
    .pe-photo-card--main {
      border-color: var(--color-primary);
      box-shadow: var(--shadow-sm);
    }
    .pe-photo-card__image {
      position: relative;
      width: 100%; height: 160px;
      background: var(--color-border);
      overflow: hidden;
    }
    .pe-photo-card__image img {
      width: 100%; height: 100%;
      object-fit: cover;
      transition: transform var(--transition-fast);
    }
    .pe-photo-card:hover .pe-photo-card__image img {
      transform: scale(1.05);
    }
    .pe-photo-card__main-badge {
      position: absolute; top: var(--space-2); right: var(--space-2);
      font-size: var(--font-size-lg);
      filter: drop-shadow(0 0 3px rgba(0,0,0,.3));
    }
    .pe-photo-card__caption {
      padding: var(--space-2) var(--space-3);
    }
    .pe-photo-card__caption-text {
      font-size: var(--font-size-sm);
      color: var(--color-text-secondary);
      cursor: pointer;
      display: block;
      min-height: 1.4em;
      line-height: 1.4;
    }
    .pe-photo-card__caption-text:hover {
      color: var(--color-primary);
    }
    .pe-photo-card__caption-text--empty {
      color: var(--color-text-muted);
      font-style: italic;
      font-size: var(--font-size-xs);
    }
    .pe-photo-card__caption-actions {
      display: flex; gap: var(--space-1); margin-top: var(--space-1);
    }
    .pe-photo-card__actions {
      display: flex; gap: var(--space-1);
      padding: var(--space-2); border-top: 1px solid var(--color-border);
      flex-wrap: wrap;
    }

    /* ── Диалог добавления фото ── */
    .pe-photo-add {
      display: flex; flex-direction: column; gap: var(--space-3);
    }
    .pe-photo-add__hint {
      font-size: var(--font-size-xs); color: var(--color-text-secondary);
      margin: 0; line-height: 1.5;
    }
    .pe-photo-add__preview {
      border: 1px solid var(--color-border); border-radius: var(--border-radius-md);
      width: 100%; max-height: 250px; overflow: hidden;
      background: var(--color-border);
    }
    .pe-photo-add__preview img {
      width: 100%; height: 100%; max-height: 250px;
      object-fit: contain;
    }
    .pe-photo-add__actions {
      display: flex; gap: var(--space-3); justify-content: flex-end;
      margin-top: var(--space-4);
    }

    /* ── Компоненты ── */
    .pe-comp-card {
      border: 1px solid var(--color-border);
      border-radius: var(--border-radius-md);
      padding: var(--space-3);
      background: var(--color-surface);
    }
    .pe-comp-card__header {
      display: flex; justify-content: space-between; align-items: center;
      margin-bottom: var(--space-1);
    }
    .pe-comp-card__name {
      font-weight: var(--font-weight-semibold);
      color: var(--color-text);
    }
    .pe-comp-card__qty {
      font-size: var(--font-size-sm); color: var(--color-primary);
      font-weight: var(--font-weight-medium);
    }
    .pe-comp-card__desc {
      font-size: var(--font-size-sm); color: var(--color-text-secondary);
      margin: 0 0 var(--space-2);
    }
    .pe-comp-card__label {
      font-size: var(--font-size-xs); font-weight: var(--font-weight-semibold);
      color: var(--color-text-secondary); margin-right: var(--space-1);
    }
    .pe-comp-card__materials, .pe-comp-card__work-types {
      display: flex; flex-wrap: wrap; align-items: baseline; gap: var(--space-1);
      margin-bottom: var(--space-1);
    }
    .pe-comp-card__tag {
      display: inline-block;
      padding: 0 6px; font-size: var(--font-size-xs);
      background: var(--color-surface-alt);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-sm);
      color: var(--color-text-secondary);
    }
    .pe-comp-card__tag--work {
      background: var(--color-primary-subtle);
      border-color: var(--color-primary);
      color: var(--color-primary);
    }
    .pe-comp-card__actions {
      display: flex; gap: var(--space-1); justify-content: flex-end;
      margin-top: var(--space-2);
    }

    /* ── Диалог компонента ── */
    .pe-comp-dialog {
      display: flex; flex-direction: column; gap: var(--space-4);
    }
    .pe-comp-dialog__row {
      display: grid; grid-template-columns: 120px 120px; gap: var(--space-3);
    }
    .pe-comp-dialog__fieldset {
      border: 1px solid var(--color-border); border-radius: var(--border-radius-md);
      padding: var(--space-3);
    }
    .pe-comp-dialog__fieldset legend {
      font-size: var(--font-size-sm); font-weight: var(--font-weight-semibold);
      color: var(--color-text-secondary); padding: 0 var(--space-2);
    }
    .pe-comp-dialog__chip-row {
      display: flex; align-items: center; gap: var(--space-1);
      margin-bottom: var(--space-1);
    }
    .pe-comp-dialog__chip {
      font-size: var(--font-size-xs);
      padding: 2px 8px;
      background: var(--color-surface-alt);
      border-radius: var(--radius-sm);
      color: var(--color-text-secondary);
      flex: 1;
    }
    .pe-comp-dialog__chip--work {
      background: var(--color-primary-subtle);
      color: var(--color-primary);
    }
    .pe-comp-dialog__add-row {
      display: flex; gap: var(--space-2); align-items: flex-end;
    }
    .pe-comp-dialog__input-sm { width: 130px; }
    .pe-comp-dialog__input-xs { width: 80px; }
    .pe-comp-dialog__footer {
      display: flex; gap: var(--space-3); justify-content: flex-end;
      margin-top: var(--space-4);
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductEditorComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productService = inject(ProductService);
  private categoryService = inject(ProductCategoryService);
  private photoService = inject(ProductPhotoService);
  private componentService = inject(ProductComponentService);
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

  // ── Фотографии ──
  photos = signal<ProductPhoto[]>([]);
  addPhotoDialogVisible = signal(false);
  newPhotoUrl = signal('');
  editingCaptionId = signal<string | null>(null);
  editCaption = signal('');

  // ── Компоненты ──
  components = signal<ProductComponent[]>([]);
  compDialogVisible = signal(false);
  editingCompId = signal<string | null>(null);
  compName = signal('');
  compQtyPerProduct = signal(1);
  compDesc = signal('');
  compSortOrder = signal(1);
  compMaterials = signal<ComponentMaterial[]>([]);
  compWorkTypes = signal<ComponentWorkType[]>([]);
  // Временные поля для добавления материала/работы в диалоге
  matName = signal('');
  matQty = signal<number | null>(null);
  matUnit = signal('');
  matNotes = signal('');
  wtName = signal('');
  wtDept = signal('Изготовление');
  wtHours = signal<number | null>(null);

  deptOptions = [
    { label: 'Изготовление', value: 'Изготовление' },
    { label: 'Подготовка', value: 'Подготовка' },
    { label: 'Сборка', value: 'Сборка' },
    { label: 'Покраска', value: 'Покраска' },
  ];

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
    this.photoService.seedPhotos();
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

          // Загружаем фото
          const photoRes = await firstValueFrom(this.photoService.getPhotos(p.id));
          if (photoRes.success) this.photos.set(photoRes.data);

          // Загружаем компоненты
          const compRes = await firstValueFrom(this.componentService.getByProduct(p.id));
          if (compRes.success) this.components.set(compRes.data);
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

  // ── Фотографии ──
  openAddPhotoDialog() {
    this.newPhotoUrl.set('');
    this.addPhotoDialogVisible.set(true);
  }

  async addPhoto() {
    const url = this.newPhotoUrl().trim();
    if (!url) return;

    try {
      const res = await firstValueFrom(this.photoService.addPhoto(this.editId()!, url));
      if (res.success) {
        this.photos.update(p => [...p, res.data]);
        this.notification.success('Фото добавлено');
        this.addPhotoDialogVisible.set(false);
      } else {
        this.notification.error(res.message || 'Ошибка добавления фото');
      }
    } catch {
      this.notification.error('Ошибка добавления фото');
    }
  }

  async setMainPhoto(photoId: string) {
    const res = await firstValueFrom(this.photoService.setMain(photoId));
    if (res.success) {
      this.photos.update(photos => photos.map(p => ({ ...p, isMain: p.id === photoId })));
      this.notification.success('Главное фото обновлено');
    }
  }

  startEditCaption(photo: ProductPhoto) {
    this.editingCaptionId.set(photo.id);
    this.editCaption.set(photo.caption || '');
  }

  async saveCaption(photoId: string) {
    const caption = this.editCaption().trim();
    const res = await firstValueFrom(this.photoService.updateCaption(photoId, caption || ''));
    if (res.success) {
      this.photos.update(photos => photos.map(p =>
        p.id === photoId ? { ...p, caption: caption || undefined } : p
      ));
      this.editingCaptionId.set(null);
    }
  }

  async deletePhoto(photoId: string) {
    const res = await firstValueFrom(this.photoService.deletePhoto(photoId));
    if (res.success) {
      // Перезагружаем фото из сервиса (там уже обработано isMain)
      const photoRes = await firstValueFrom(this.photoService.getPhotos(this.editId()!));
      if (photoRes.success) this.photos.set(photoRes.data);
      this.notification.success('Фото удалено');
    } else {
      this.notification.error(res.message || 'Ошибка удаления фото');
    }
  }

  async movePhoto(photoId: string, direction: number) {
    const current = this.photos();
    const idx = current.findIndex(p => p.id === photoId);
    const targetIdx = idx + direction;
    if (idx === -1 || targetIdx < 0 || targetIdx >= current.length) return;

    // Меняем sortOrder
    const newPhotos = [...current];
    const temp = newPhotos[idx]!.sortOrder;
    newPhotos[idx] = { ...newPhotos[idx]!, sortOrder: newPhotos[targetIdx]!.sortOrder };
    newPhotos[targetIdx] = { ...newPhotos[targetIdx]!, sortOrder: temp };
    newPhotos.sort((a, b) => a.sortOrder - b.sortOrder);

    // Сохраняем порядок на сервисе
    const orderedIds = newPhotos.map(p => p.id);
    await firstValueFrom(this.photoService.reorderPhotos(this.editId()!, orderedIds));
    this.photos.set(newPhotos);
  }

  // ── Компоненты ──
  openCompDialog(comp?: ProductComponent) {
    if (comp) {
      this.editingCompId.set(comp.id);
      this.compName.set(comp.name);
      this.compQtyPerProduct.set(comp.quantityPerProduct);
      this.compDesc.set(comp.description || '');
      this.compSortOrder.set(comp.sortOrder);
      this.compMaterials.set(comp.materials.map(m => ({ ...m })));
      this.compWorkTypes.set(comp.workTypes.map(w => ({ ...w })));
    } else {
      this.editingCompId.set(null);
      this.compName.set('');
      this.compQtyPerProduct.set(1);
      this.compDesc.set('');
      this.compSortOrder.set(this.components().length + 1);
      this.compMaterials.set([]);
      this.compWorkTypes.set([]);
    }
    this.matName.set(''); this.matQty.set(null); this.matUnit.set(''); this.matNotes.set('');
    this.wtName.set(''); this.wtDept.set('Изготовление'); this.wtHours.set(null);
    this.compDialogVisible.set(true);
  }

  editComponent(comp: ProductComponent) { this.openCompDialog(comp); }

  addMaterial() {
    const name = this.matName().trim();
    const qty = this.matQty();
    const unit = this.matUnit().trim();
    if (!name || qty === null || !unit) return;
    this.compMaterials.update(m => [...m, {
      id: generateId(),
      name, quantity: qty, unit, notes: this.matNotes().trim() || undefined,
    }]);
    this.matName.set(''); this.matQty.set(null); this.matUnit.set(''); this.matNotes.set('');
  }

  removeMaterial(id: string) {
    this.compMaterials.update(m => m.filter(x => x.id !== id));
  }

  addWorkType() {
    const name = this.wtName().trim();
    const hours = this.wtHours();
    if (!name || hours === null) return;
    const order = this.compWorkTypes().length + 1;
    this.compWorkTypes.update(w => [...w, {
      id: generateId(),
      name, department: this.wtDept(), normHours: hours, sortOrder: order,
    }]);
    this.wtName.set(''); this.wtHours.set(null);
  }

  removeWorkType(id: string) {
    this.compWorkTypes.update(w => w.filter(x => x.id !== id));
  }

  async saveComponent() {
    const name = this.compName().trim();
    if (!name) return;

    const base = {
      name,
      quantityPerProduct: this.compQtyPerProduct(),
      description: this.compDesc().trim() || undefined,
      sortOrder: this.compSortOrder(),
      materials: this.compMaterials(),
      workTypes: this.compWorkTypes(),
    };

    try {
      if (this.editingCompId()) {
        await firstValueFrom(this.componentService.updateComponent(this.editingCompId()!, base));
        this.notification.success('Компонент обновлён');
      } else {
        await firstValueFrom(this.componentService.createComponent({ ...base, productId: this.editId()! }));
        this.notification.success('Компонент добавлен');
      }
      // Перезагружаем компоненты
      const res = await firstValueFrom(this.componentService.getByProduct(this.editId()!));
      if (res.success) this.components.set(res.data);
      this.compDialogVisible.set(false);
    } catch {
      this.notification.error('Ошибка сохранения компонента');
    }
  }

  async deleteComponent(compId: string) {
    const res = await firstValueFrom(this.componentService.deleteComponent(compId));
    if (res.success) {
      const reloaded = await firstValueFrom(this.componentService.getByProduct(this.editId()!));
      if (reloaded.success) this.components.set(reloaded.data);
      this.notification.success('Компонент удалён');
    } else {
      this.notification.error(res.message || 'Ошибка удаления');
    }
  }
}
