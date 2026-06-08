import { Component, inject, signal, computed, linkedSignal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { firstValueFrom } from 'rxjs';

import { generateId } from '../../core/crud-factory';

import { KpButtonComponent } from '../../shared/ui/kp-button.component';
import { KpBreadcrumbComponent } from '../../shared/ui/kp-breadcrumb.component';
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
    KpButtonComponent, KpBreadcrumbComponent,
    KpInputComponent, KpSelectComponent, KpToggleComponent, KpToastComponent,
    KpDialogComponent,
  ],
  template: `
    <kp-toast />

    <div class="pe-page">
      <kp-breadcrumb [items]="breadcrumbs()" />

      @let isCreating = isNew();
      @let totalPhotos = photos().length;
      @let isMfg = productType() === 'manufactured';

      <!-- Header with SKU badge + actions -->
      <div class="pe-hero">
        <div class="pe-hero__info">
          <div class="pe-hero__sku">{{ isCreating ? 'Новый товар' : sku() }}</div>
          <div class="pe-hero__title">
            @if (!isCreating) {
              <input class="pe-hero__title-input" [ngModel]="name()" (ngModelChange)="name.set($event)" placeholder="Название товара" />
            } @else {
              <h1 class="pe-hero__title-h1">{{ name() || 'Новый товар' }}</h1>
            }
          </div>
          @if (!isCreating) {
            <div class="pe-hero__meta">
              <span class="pe-hero__meta-tag" [class.pe-hero__meta-tag--mfg]="isMfg">{{ isMfg ? '🔧 Изготавливаемый' : '🛒 Покупной' }}</span>
              <span class="pe-hero__meta-tag">{{ unit() }}</span>
              @if (basePrice()) {
                <span class="pe-hero__meta-tag pe-hero__meta-tag--price">{{ basePrice()!.toLocaleString('ru-RU') }} ₽</span>
              }
              @if (weightKg()) {
                <span class="pe-hero__meta-tag">{{ weightKg() }} кг</span>
              }
            </div>
          }
        </div>
        <div class="pe-hero__actions">
          <kp-button label="Сохранить" lucideIcon="check" [loading]="saving()" (buttonClick)="save()" />
          <kp-button label="Отмена" lucideIcon="x" severity="secondary" (buttonClick)="cancel()" />
        </div>
      </div>

      <div class="pe-layout">
        <!-- Main column -->
        <div class="pe-main">

          <!-- ─── Фотографии ─── -->
          <section class="pe-section">
            <div class="pe-section__hed">
              <h3 class="pe-section__title">📷 Фотографии</h3>
              <span class="pe-section__count">{{ totalPhotos }}</span>
              @if (!isCreating) {
                <kp-button lucideIcon="camera" severity="secondary" [text]="true" size="small" (buttonClick)="openAddPhotoDialog()" />
              }
            </div>
            @if (!isCreating) {
              <div class="pe-photos">
                @for (photo of photos(); track photo.id) {
                  <div class="pe-photo" [class.pe-photo--main]="photo.isMain">
                    <div class="pe-photo__frame">
                      <img [src]="photo.url" [alt]="photo.caption || 'Фото'" loading="lazy" />
                      @if (photo.isMain) { <span class="pe-photo__badge">⭐ Главное</span> }
                    </div>
                    <div class="pe-photo__meta">
                      @if (editingCaptionId() === photo.id) {
                        <input class="pe-photo__cap-input" [(ngModel)]="editCaption" placeholder="Подпись..." (keyup.enter)="saveCaption(photo.id)" (blur)="saveCaption(photo.id)" />
                      } @else {
                        <span class="pe-photo__cap" (click)="startEditCaption(photo)">{{ photo.caption || 'Добавить подпись' }}</span>
                      }
                    </div>
                    <div class="pe-photo__actions">
                      @if (!photo.isMain) { <kp-button lucideIcon="star" severity="info" [text]="true" size="small" title="Сделать главным" (buttonClick)="setMainPhoto(photo.id)" /> }
                      @let hasMultiplePhotos = totalPhotos > 1;
                      @if (hasMultiplePhotos && photo.sortOrder > 1) { <kp-button lucideIcon="chevron-up" severity="secondary" [text]="true" size="small" (buttonClick)="movePhoto(photo.id, -1)" /> }
                      @if (hasMultiplePhotos && photo.sortOrder < totalPhotos) { <kp-button lucideIcon="chevron-down" severity="secondary" [text]="true" size="small" (buttonClick)="movePhoto(photo.id, 1)" /> }
                      <kp-button lucideIcon="trash-2" severity="danger" [text]="true" size="small" (buttonClick)="deletePhoto(photo.id)" />
                    </div>
                  </div>
                } @empty {
                  <div class="pe-photos__empty">
                    <span class="pe-photos__empty-icon">📷</span>
                    <p>Нет фотографий. Нажмите <strong>+</strong> чтобы добавить.</p>
                  </div>
                }
              </div>
            } @else {
              <p class="pe-hint">Сохраните товар, чтобы добавить фотографии.</p>
            }
          </section>

          <!-- ─── Компоненты / BOM ─── -->
          @if (isMfg && !isCreating) {
            <section class="pe-section">
              <div class="pe-section__hed">
                <h3 class="pe-section__title">🔩 Спецификация (BOM)</h3>
                <span class="pe-section__count">{{ components().length }}</span>
                <kp-button lucideIcon="plus" severity="info" [text]="true" size="small" (buttonClick)="openCompDialog()" />
              </div>

              @for (comp of components(); track comp.id) {
                <div class="pe-bom">
                  <div class="pe-bom__head">
                    <div class="pe-bom__head-left">
                      <span class="pe-bom__num">{{ comp.sortOrder }}</span>
                      <div>
                        <span class="pe-bom__name">{{ comp.name }}</span>
                        <span class="pe-bom__qty">× {{ comp.quantityPerProduct }} на товар</span>
                      </div>
                    </div>
                    <div class="pe-bom__head-actions">
                      <kp-button lucideIcon="pencil" severity="secondary" [text]="true" size="small" (buttonClick)="editComponent(comp)" />
                      <kp-button lucideIcon="trash-2" severity="danger" [text]="true" size="small" (buttonClick)="deleteComponent(comp.id)" />
                    </div>
                  </div>
                  @if (comp.description) {
                    <p class="pe-bom__desc">{{ comp.description }}</p>
                  }

                  <!-- Материалы -->
                  @if (comp.materials.length > 0) {
                    <div class="pe-bom__sub pe-bom__sub--materials">
                      <span class="pe-bom__sub-label">🧱 Материалы</span>
                      <div class="pe-bom__table">
                        <div class="pe-bom__tr pe-bom__tr--head">
                          <span class="pe-bom__td pe-bom__td--w">Наименование</span>
                          <span class="pe-bom__td pe-bom__td--n">Кол-во</span>
                          <span class="pe-bom__td pe-bom__td--u">Ед.</span>
                          <span class="pe-bom__td">Прим.</span>
                        </div>
                        @for (m of comp.materials; track m.id) {
                          <div class="pe-bom__tr">
                            <span class="pe-bom__td pe-bom__td--w">{{ m.name }}</span>
                            <span class="pe-bom__td pe-bom__td--n">{{ m.quantity }}</span>
                            <span class="pe-bom__td pe-bom__td--u">{{ m.unit }}</span>
                            <span class="pe-bom__td pe-bom__td--notes">{{ m.notes || '—' }}</span>
                          </div>
                        }
                      </div>
                    </div>
                  }

                  <!-- Виды работ -->
                  @if (comp.workTypes.length > 0) {
                    <div class="pe-bom__sub pe-bom__sub--work-types">
                      <span class="pe-bom__sub-label">⚡ Виды работ</span>
                      <div class="pe-bom__table">
                        <div class="pe-bom__tr pe-bom__tr--head">
                          <span class="pe-bom__td pe-bom__td--w">Работа</span>
                          <span class="pe-bom__td">Участок</span>
                          <span class="pe-bom__td pe-bom__td--n">Норма (ч)</span>
                        </div>
                        @for (w of comp.workTypes; track w.id) {
                          <div class="pe-bom__tr">
                            <span class="pe-bom__td pe-bom__td--w">{{ w.name }}</span>
                            <span class="pe-bom__td">{{ w.department }}</span>
                            <span class="pe-bom__td pe-bom__td--n">{{ w.normHours }}</span>
                          </div>
                        }
                      </div>
                    </div>
                  }
                </div>
              } @empty {
                <p class="pe-hint">Компоненты не заданы. Нажмите <strong>+</strong> чтобы добавить составляющие части товара.</p>
              }
            </section>
          }

        </div>

        <!-- Sidebar -->
        <div class="pe-sidebar">

          <!-- Основное -->
          <section class="pe-section pe-section--card">
            <h3 class="pe-section__title">Основное</h3>
            <div class="pe-fieldset">
              <kp-input label="Наименование" placeholder="Название товара" [(ngModel)]="name" [error]="nameError()" />
              <kp-input label="Артикул (SKU)" [(ngModel)]="sku" [disabled]="!isNew()" placeholder="Авто" />
              <kp-select label="Категория" [options]="categoryOptions()" [(ngModel)]="categoryId" (ngModelChange)="onCategoryChange()" [error]="categoryError()" />
              <kp-select label="Тип" [options]="typeOptions" [(ngModel)]="productType" />
              <kp-select label="Ед. изм." [options]="unitOptions" [(ngModel)]="unit" [error]="unitError()" />
            </div>
          </section>

          <!-- Цены -->
          <section class="pe-section pe-section--card">
            <h3 class="pe-section__title">💰 Цены</h3>
            <div class="pe-fieldset">
              <kp-input label="Базовая цена (₽)" type="number" [(ngModel)]="basePrice" />
              <kp-input label="Наценка (%)" type="number" [(ngModel)]="markupPercent" />
            </div>
          </section>

          <!-- Характеристики -->
          <section class="pe-section pe-section--card">
            <h3 class="pe-section__title">📐 Характеристики</h3>
            <div class="pe-fieldset">
              <kp-input label="Описание" [(ngModel)]="description" />
              <kp-input label="Вес (кг)" type="number" [(ngModel)]="weightKg" />
              <kp-input label="Габариты (мм)" [(ngModel)]="dimensions" placeholder="Д×Ш×В" />
              <kp-input label="Материал" [(ngModel)]="material" />
            </div>
          </section>

          <!-- Статусы -->
          <section class="pe-section pe-section--card">
            <h3 class="pe-section__title">⚙️ Статус</h3>
            <div class="pe-fieldset">
              <kp-toggle label="Активен" [(ngModel)]="isActive" />
              <kp-toggle label="Паспорт качества" [(ngModel)]="hasPassport" />
              <kp-toggle label="Есть чертёж" [(ngModel)]="hasDrawing" />
            </div>
          </section>

        </div>
      </div>
    </div>

    <!-- Диалог добавления фото -->
    <kp-dialog
      header="Добавить фотографию"
      [(visible)]="addPhotoDialogVisible"
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
      [(visible)]="compDialogVisible"
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
    :host { display: block; padding: var(--space-6); }
    

    /* ── Hero header ── */
    .pe-hero {
      display: flex; justify-content: space-between; align-items: flex-start;
      gap: var(--space-4); margin: var(--space-4) 0 var(--space-6);
      padding-bottom: var(--space-5); border-bottom: 1px solid var(--color-border);
    }
    .pe-hero__sku {
      font-size: var(--font-size-xs); font-weight: 700; text-transform: uppercase;
      letter-spacing: 0.05em; color: var(--color-text-muted); margin-bottom: var(--space-1);
    }
    .pe-hero__title { margin-bottom: var(--space-2); }
    .pe-hero__title-input {
      font-size: 1.5rem; font-weight: 800; color: var(--color-text);
      border: none; background: transparent; padding: 0; width: 100%;
      outline: none; border-bottom: 2px solid transparent;
      transition: border-color 0.2s;
    }
    .pe-hero__title-input:focus { border-bottom-color: var(--color-primary); }
    .pe-hero__title-h1 { font-size: 1.5rem; font-weight: 800; color: var(--color-text); margin: 0; }
    .pe-hero__meta { display: flex; gap: var(--space-2); flex-wrap: wrap; }
    .pe-hero__meta-tag {
      padding: 2px 10px; border-radius: var(--radius-full);
      font-size: var(--font-size-xs); font-weight: var(--font-weight-medium);
      background: var(--color-surface-alt); border: 1px solid var(--color-border);
      color: var(--color-text-secondary);
    }
    .pe-hero__meta-tag--mfg { background: color-mix(in srgb, var(--color-primary) 12%, transparent); border-color: var(--color-primary); color: var(--color-primary); }
    .pe-hero__meta-tag--price { font-weight: 700; color: var(--color-text); }
    .pe-hero__actions { display: flex; gap: var(--space-2); flex-shrink: 0; }

    /* ── Layout ── */
    .pe-layout { display: grid; grid-template-columns: 1fr 360px; gap: var(--space-6); align-items: start; }
    .pe-main { display: flex; flex-direction: column; gap: var(--space-6); }
    .pe-sidebar { display: flex; flex-direction: column; gap: var(--space-4); position: sticky; top: var(--space-4); }

    /* ── Sections ── */
    .pe-section { display: flex; flex-direction: column; }
    .pe-section--card {
      background: var(--color-surface); border: 1px solid var(--color-border);
      border-radius: var(--radius-lg); padding: var(--space-4);
    }
    .pe-section__hed {
      display: flex; align-items: center; gap: var(--space-2);
      margin-bottom: var(--space-4); padding-bottom: var(--space-3);
      border-bottom: 1px solid var(--color-border);
    }
    .pe-section__title {
      font-size: var(--font-size-base); font-weight: var(--font-weight-bold);
      color: var(--color-text); margin: 0;
    }
    .pe-section__count {
      background: var(--color-primary); color: #fff;
      font-size: var(--font-size-xs); font-weight: 700;
      width: 22px; height: 22px; border-radius: 50%;
      display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0;
    }
    .pe-fieldset { display: flex; flex-direction: column; gap: var(--space-4); }
    .pe-hint {
      color: var(--color-text-secondary); font-size: var(--font-size-sm);
      font-style: italic; margin: var(--space-3) 0;
    }

    /* ── Photos ── */
    .pe-photos { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: var(--space-4); }
    .pe-photo {
      border: 1px solid var(--color-border); border-radius: var(--radius-lg);
      overflow: hidden; background: var(--color-surface);
      transition: box-shadow 0.2s, border-color 0.2s;
    }
    .pe-photo:hover { box-shadow: var(--shadow-md); border-color: var(--color-primary-light); }
    .pe-photo--main { border-color: var(--color-primary); box-shadow: 0 0 0 2px color-mix(in srgb, var(--color-primary) 30%, transparent); }
    .pe-photo__frame {
      position: relative; width: 100%; height: 200px;
      background: var(--color-bg); overflow: hidden;
    }
    .pe-photo__frame img {
      width: 100%; height: 100%; object-fit: cover;
      transition: transform 0.3s;
    }
    .pe-photo:hover .pe-photo__frame img { transform: scale(1.06); }
    .pe-photo__badge {
      position: absolute; top: var(--space-2); left: var(--space-2);
      font-size: var(--font-size-xs); font-weight: 700;
      background: rgba(0,0,0,0.55); color: #fff;
      padding: 2px 8px; border-radius: var(--radius-full);
      backdrop-filter: blur(4px);
    }
    .pe-photo__meta { padding: var(--space-2) var(--space-3); }
    .pe-photo__cap {
      font-size: var(--font-size-sm); color: var(--color-text-secondary);
      cursor: pointer; display: block; line-height: 1.4;
    }
    .pe-photo__cap:hover { color: var(--color-primary); }
    .pe-photo__cap-input {
      width: 100%; border: none; border-bottom: 1px solid var(--color-primary);
      font-size: var(--font-size-sm); background: transparent;
      color: var(--color-text); outline: none; padding: 2px 0;
    }
    .pe-photo__actions {
      display: flex; gap: 2px; padding: var(--space-1) var(--space-2);
      border-top: 1px solid var(--color-border-light); flex-wrap: wrap;
    }
    .pe-photos__empty {
      grid-column: 1 / -1; text-align: center;
      padding: var(--space-8); color: var(--color-text-secondary);
    }
    .pe-photos__empty-icon { font-size: 2.5rem; display: block; margin-bottom: var(--space-2); }
    .pe-photos__empty p { margin: 0; font-size: var(--font-size-sm); }

    /* ── BOM ── */
    .pe-bom {
      border: 1px solid var(--color-border); border-radius: var(--radius-lg);
      padding: var(--space-4); margin-bottom: var(--space-3);
      background: var(--color-surface); transition: box-shadow 0.2s;
    }
    .pe-bom:hover { box-shadow: var(--shadow-sm); }
    .pe-bom__head {
      display: flex; justify-content: space-between; align-items: flex-start;
      margin-bottom: var(--space-2);
    }
    .pe-bom__head-left { display: flex; align-items: center; gap: var(--space-3); }
    .pe-bom__num {
      width: 28px; height: 28px; border-radius: 50%;
      background: var(--color-primary); color: #fff;
      display: flex; align-items: center; justify-content: center;
      font-size: var(--font-size-xs); font-weight: 700; flex-shrink: 0;
    }
    .pe-bom__name { font-weight: var(--font-weight-semibold); color: var(--color-text); font-size: var(--font-size-sm); }
    .pe-bom__qty { font-size: var(--font-size-xs); color: var(--color-text-secondary); margin-left: var(--space-2); }
    .pe-bom__head-actions { display: flex; gap: 2px; flex-shrink: 0; }
    .pe-bom__desc { font-size: var(--font-size-xs); color: var(--color-text-secondary); margin: 0 0 var(--space-3); }

    .pe-bom__sub { margin-bottom: var(--space-3); }
    .pe-bom__sub:last-child { margin-bottom: 0; }
    .pe-bom__sub-label {
      display: block; font-size: var(--font-size-xs); font-weight: 600;
      color: var(--color-text-muted); text-transform: uppercase;
      letter-spacing: 0.05em; margin-bottom: var(--space-2);
    }
    .pe-bom__table {
      display: flex; flex-direction: column;
      border: 1px solid var(--color-border-light); border-radius: var(--radius-md);
      overflow: hidden;
    }
    .pe-bom__tr {
      display: grid; gap: 0;
      padding: var(--space-2) var(--space-3);
      border-bottom: 1px solid var(--color-border-light);
    }
    .pe-bom__tr:last-child { border-bottom: none; }
    .pe-bom__tr--head {
      background: var(--color-bg-secondary);
      font-size: var(--font-size-xs); font-weight: 700; text-transform: uppercase;
      letter-spacing: 0.04em; color: var(--color-text-muted);
    }
    .pe-bom__tr--head .pe-bom__td { color: var(--color-text-muted); }
    .pe-bom__td {
      font-size: var(--font-size-xs); color: var(--color-text-secondary);
      display: flex; align-items: center;
    }
    .pe-bom__td--w { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .pe-bom__td--n { text-align: right; justify-content: flex-end; }
    .pe-bom__td--u { text-align: center; justify-content: center; }
    .pe-bom__td--notes { color: var(--color-text-muted); }
    .pe-bom__tr--head .pe-bom__td--n,
    .pe-bom__tr--head .pe-bom__td--u { justify-content: center; }

    .pe-bom__sub--materials .pe-bom__tr { grid-template-columns: 1fr 60px 50px 1fr; }
    .pe-bom__sub--work-types .pe-bom__tr { grid-template-columns: 1fr 120px 70px; }

    /* ── Responsive ── */
    @media (max-width: 900px) {
      .pe-layout { grid-template-columns: 1fr; }
      .pe-sidebar { position: static; }
    }

    /* ── Dialog: add photo ── */
    .pe-photo-add {
      display: flex; flex-direction: column; gap: var(--space-3);
    }
    .pe-photo-add__hint {
      font-size: var(--font-size-xs); color: var(--color-text-secondary);
      margin: 0; line-height: 1.5;
    }
    .pe-photo-add__preview {
      border: 1px solid var(--color-border); border-radius: var(--radius-md);
      width: 100%; max-height: 250px; overflow: hidden;
      background: var(--color-border);
    }
    .pe-photo-add__preview img {
      width: 100%; max-height: 250px; object-fit: contain;
    }
    .pe-photo-add__actions {
      display: flex; gap: var(--space-3); justify-content: flex-end;
      margin-top: var(--space-4);
    }

    /* ── Dialog: component ── */
    .pe-comp-dialog {
      display: flex; flex-direction: column; gap: var(--space-4);
    }
    .pe-comp-dialog__row {
      display: grid; grid-template-columns: 120px 120px; gap: var(--space-3);
    }
    .pe-comp-dialog__fieldset {
      border: 1px solid var(--color-border); border-radius: var(--radius-md);
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
      padding: 2px 8px; background: var(--color-surface-alt);
      border-radius: var(--radius-sm); color: var(--color-text-secondary); flex: 1;
    }
    .pe-comp-dialog__chip--work {
      background: var(--color-primary-subtle); color: var(--color-primary);
    }
    .pe-comp-dialog__add-row {
      display: flex; gap: var(--space-2); align-items: flex-end;
    }
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
  editCaption = linkedSignal<string | null, string>({
    source: () => this.editingCaptionId(),
    computation: (id) => {
      if (!id) return '';
      const photo = this.photos().find(p => p.id === id);
      return photo?.caption ?? '';
    },
  });

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
    // editCaption сбрасывается автоматически через linkedSignal
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
