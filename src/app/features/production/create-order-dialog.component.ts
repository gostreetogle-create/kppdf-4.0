import { Component, inject, signal, computed, input, output, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';

import { KpDialogComponent } from '../../shared/ui/kp-dialog.component';
import { KpSelectComponent } from '../../shared/ui/kp-select.component';
import { KpInputComponent } from '../../shared/ui/kp-input.component';
import { KpDatepickerComponent } from '../../shared/ui/kp-datepicker.component';
import { KpButtonComponent } from '../../shared/ui/kp-button.component';
import { KpToastComponent } from '../../shared/ui/kp-toast.component';
import { NotificationService } from '../../core/notification.service';
import { ProductionOrderService } from '../../core/production-order.service';
import type { ProductionOrder, Product, Organization } from '../../../../shared/types/index.js';

@Component({
  selector: 'app-create-order-dialog',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    KpDialogComponent, KpSelectComponent, KpInputComponent,
    KpDatepickerComponent, KpButtonComponent, KpToastComponent,
  ],
  template: `
    <kp-toast />

    <kp-dialog
      header="📋 Новый производственный заказ"
      [(visible)]="visible"
      width="520px"
      (dialogHide)="close()"
    >
      <div class="cod-form">
        <kp-select
          label="Товар"
          [options]="productOptions()"
          [(ngModel)]="formProductId"
          placeholder="Выберите товар..."
          [filter]="true"
          [showClear]="true"
        />
        <kp-select
          label="Заказчик"
          [options]="orgOptions()"
          [(ngModel)]="formOrgId"
          placeholder="Выберите организацию..."
          [filter]="true"
          [showClear]="true"
        />
        <div class="cod-form__row">
          <kp-input label="Количество" type="number" [(ngModel)]="formQuantity" />
          <kp-datepicker label="Старт" [(selectedDate)]="formStartDate" />
          <kp-datepicker label="Финиш" [(selectedDate)]="formEndDate" />
        </div>
        <kp-input label="Примечание" [(ngModel)]="formNotes" placeholder="Опционально..." />
      </div>
      <div class="cod-actions">
        <kp-button label="Отмена" severity="secondary" size="small" (buttonClick)="close()" />
        <kp-button
          label="Создать"
          lucideIcon="plus"
          severity="info"
          size="small"
          [loading]="submitting()"
          [disabled]="!formProductId() || !formOrgId() || formQuantity() < 1"
          (buttonClick)="create()"
        />
      </div>
    </kp-dialog>
  `,
  styleUrl: './create-order-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateOrderDialogComponent {
  private orderSvc = inject(ProductionOrderService);
  private notification = inject(NotificationService);

  /** Доступные товары (фильтруются: только manufactured + active) */
  products = input<Product[]>([]);
  /** Доступные организации */
  organizations = input<Organization[]>([]);

  /** Событие при успешном создании заказа */
  orderCreated = output<ProductionOrder>();

  visible = signal(false);
  submitting = signal(false);

  formProductId = signal<string | null>(null);
  formOrgId = signal<string | null>(null);
  formQuantity = signal(1);
  formStartDate = signal<Date | null>(new Date());
  formEndDate = signal<Date | null>(new Date(Date.now() + 7 * 86400000));
  formNotes = signal('');

  productOptions = computed(() =>
    this.products()
      .filter(p => p.productType === 'manufactured' && p.isActive)
      .map(p => ({ label: `${p.sku} — ${p.name}`, value: p.id })),
  );

  orgOptions = computed(() =>
    this.organizations()
      .filter(o => o.isActive)
      .map(o => ({ label: o.shortName || o.name, value: o.id })),
  );

  open() {
    this.resetForm();
    this.visible.set(true);
  }

  close() {
    this.visible.set(false);
    this.resetForm();
  }

  private resetForm() {
    this.formProductId.set(null);
    this.formOrgId.set(null);
    this.formQuantity.set(1);
    this.formStartDate.set(new Date());
    this.formEndDate.set(new Date(Date.now() + 7 * 86400000));
    this.formNotes.set('');
  }

  async create() {
    const productId = this.formProductId();
    const orgId = this.formOrgId();
    const qty = this.formQuantity();
    if (!productId || !orgId || qty < 1) return;

    const product = this.products().find(p => p.id === productId);
    if (!product) return;

    this.submitting.set(true);
    try {
      const sd = this.formStartDate() || new Date();
      const ed = this.formEndDate() || new Date(Date.now() + 7 * 86400000);

      const data = {
        contractId: '',
        productId: product.id,
        productName: product.name,
        productSku: product.sku,
        quantity: qty,
        status: 'accepted' as const,
        plannedStartDate: sd.toISOString().substring(0, 10),
        plannedEndDate: ed.toISOString().substring(0, 10),
        notes: this.formNotes(),
      };

      const res = await firstValueFrom(this.orderSvc.createOrder(data));
      if (res.success) {
        this.notification.success(`Заказ ${res.data.number} создан`);
        this.orderCreated.emit(res.data);
        this.close();
      }
    } finally {
      this.submitting.set(false);
    }
  }
}
