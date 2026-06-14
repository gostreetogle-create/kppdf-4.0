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
  styleUrl: './warehouse-editor.component.scss',
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
          roleIds,
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
