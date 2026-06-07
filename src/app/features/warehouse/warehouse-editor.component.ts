import { Component, inject, signal, computed, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { firstValueFrom } from 'rxjs';

import { KpCardComponent } from '../../shared/ui/kp-card.component';
import { KpButtonComponent } from '../../shared/ui/kp-button.component';
import { KpBreadcrumbComponent } from '../../shared/ui/kp-breadcrumb.component';
import { KpToastComponent } from '../../shared/ui/kp-toast.component';
import { KpInputComponent } from '../../shared/ui/kp-input.component';
import { NotificationService } from '../../core/notification.service';
import { WarehouseService } from '../../core/warehouse.service';

@Component({
  selector: 'app-warehouse-editor',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    KpCardComponent, KpButtonComponent, KpBreadcrumbComponent, KpToastComponent,
    KpInputComponent,
  ],
  template: `
    <kp-toast />

    <div class="wh-editor">
      <kp-breadcrumb [items]="breadcrumbs()" />

      <div class="wh-editor__header">
        <h1 class="wh-editor__title">{{ isNew() ? 'Новый склад' : 'Редактирование склада' }}</h1>
        <div class="wh-editor__header-actions">
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
        <div class="wh-editor__form">
          <kp-input
            label="Название склада *"
            [(ngModel)]="formName"
            placeholder="Например: Трубный склад"
          />
          <kp-input
            label="Адрес"
            [(ngModel)]="formAddress"
            placeholder="ул. Заводская, 15"
          />

          <div class="wh-editor__section">
            <div class="wh-editor__section-header">
              <h3 class="wh-editor__section-title">📂 Подразделения (зоны)</h3>
              <kp-button
                label="+ Зона"
                size="small"
                severity="secondary"
                (buttonClick)="addZone()"
              />
            </div>
            <p class="wh-editor__hint">Введите названия подразделений склада (трубный, листовой, окрасочный...)</p>
            @for (zone of zoneList(); track $index) {
              <div class="wh-editor__zone-row">
                <input
                  class="wh-editor__zone-input"
                  [ngModel]="zoneList()[$index]"
                  (ngModelChange)="updateZone($index, $event)"
                  [placeholder]="'Зона ' + ($index + 1)"
                />
                <button class="wh-editor__zone-remove" (click)="removeZone($index)">×</button>
              </div>
            }
            @if (zoneList().length === 0) {
              <p class="wh-editor__hint">Нет зон. Нажмите «+ Зона» чтобы добавить.</p>
            }
          </div>

          <div class="wh-editor__section">
            <h3 class="wh-editor__section-title">🔑 Роли доступа</h3>
            <kp-input
              label="ID ролей (через запятую)"
              [(ngModel)]="formRoleIds"
              placeholder="admin, warehouse-trubny, warehouse-listovoy"
            />
            <p class="wh-editor__hint">Оставьте пустым — склад будет виден всем ролям.</p>
          </div>
        </div>
      </kp-card>
    </div>
  `,
  styles: [`
    :host { display: block; }
    .wh-editor { max-width: 700px; margin: 0 auto; padding: var(--space-6); }
    .wh-editor__header {
      display: flex; align-items: center; justify-content: space-between;
      flex-wrap: wrap; gap: var(--space-3); margin: var(--space-4) 0;
    }
    .wh-editor__title { font-size: var(--font-size-xl); font-weight: var(--font-weight-bold); color: var(--color-text); margin: 0; }
    .wh-editor__header-actions { display: flex; gap: var(--space-3); }
    .wh-editor__form { display: flex; flex-direction: column; gap: var(--space-4); }
    .wh-editor__section { padding-top: var(--space-4); border-top: 1px solid var(--color-border); }
    .wh-editor__section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: var(--space-2); }
    .wh-editor__section-title { font-size: var(--font-size-sm); font-weight: 700; color: var(--color-text); margin: 0; }
    .wh-editor__hint { font-size: var(--font-size-xs); color: var(--color-text-secondary); margin: 0 0 var(--space-2); }
    .wh-editor__zone-row { display: flex; gap: var(--space-2); align-items: center; margin-bottom: var(--space-2); }
    .wh-editor__zone-input {
      flex: 1; padding: var(--space-2) var(--space-3);
      border: 1px solid var(--color-border); border-radius: var(--radius-md);
      font-size: var(--font-size-sm);
      background: var(--color-bg);
      color: var(--color-text);
    }
    .wh-editor__zone-input:focus { outline: none; border-color: var(--color-primary); }
    .wh-editor__zone-remove {
      width: 32px; height: 32px; border-radius: 50%;
      border: 1px solid var(--color-border);
      background: var(--color-bg);
      font-size: var(--font-size-lg); line-height: 1;
      color: var(--color-text-secondary);
      cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      transition: all 0.15s;
    }
    .wh-editor__zone-remove:hover { background: var(--color-error-bg, #fef2f2); color: var(--color-error, #dc2626); border-color: var(--color-error, #dc2626); }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WarehouseEditorComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private warehouseService = inject(WarehouseService);
  private notification = inject(NotificationService);

  isNew = signal(true);
  warehouseId = signal<string | null>(null);
  saving = signal(false);

  formName = '';
  formAddress = '';
  formRoleIds = '';
  zoneList = signal<string[]>([]);

  breadcrumbs = computed<MenuItem[]>(() => [
    { label: 'Склад', routerLink: '/warehouse' },
    { label: this.isNew() ? 'Новый склад' : this.formName || 'Редактирование' },
  ]);

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isNew.set(false);
      this.warehouseId.set(id);
      const res = await firstValueFrom(this.warehouseService.getWarehouse(id));
      if (res.success && res.data) {
        this.formName = res.data.name;
        this.formAddress = res.data.address || '';
        this.formRoleIds = res.data.roleIds.join(', ');
        this.zoneList.set([...res.data.zoneNames]);
      }
    }
  }

  addZone() {
    this.zoneList.update(z => [...z, '']);
  }

  updateZone(index: number, value: string) {
    this.zoneList.update(z => z.map((n, i) => i === index ? value : n));
  }

  removeZone(index: number) {
    this.zoneList.update(z => z.filter((_, i) => i !== index));
  }

  async save() {
    if (!this.formName.trim()) {
      this.notification.warn('Название склада обязательно');
      return;
    }
    this.saving.set(true);
    try {
      const zones = this.zoneList().map(z => z.trim()).filter(Boolean);
      const roleIds = this.formRoleIds.split(',').map(s => s.trim()).filter(Boolean);

      if (this.isNew()) {
        await firstValueFrom(this.warehouseService.createWarehouse({
          name: this.formName,
          address: this.formAddress || undefined,
          zoneNames: zones,
          roleIds,
          isActive: true,
        }));
        this.notification.success('Склад создан');
      } else {
        await firstValueFrom(this.warehouseService.updateWarehouse(this.warehouseId()!, {
          name: this.formName,
          address: this.formAddress || undefined,
          zoneNames: zones,
        }));
        this.notification.success('Склад сохранён');
      }
      this.router.navigate(['/warehouse']);
    } catch {
      this.notification.error('Ошибка сохранения');
    } finally {
      this.saving.set(false);
    }
  }

  cancel() {
    this.router.navigate(['/warehouse']);
  }
}
