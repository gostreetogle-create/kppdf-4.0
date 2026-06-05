import { Component, inject, signal, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MenuItem } from 'primeng/api';
import { firstValueFrom } from 'rxjs';

import { KpInputComponent } from '../../shared/ui/kp-input.component';
import { KpButtonComponent } from '../../shared/ui/kp-button.component';
import { KpBreadcrumbComponent } from '../../shared/ui/kp-breadcrumb.component';
import { KpCardComponent } from '../../shared/ui/kp-card.component';
import { KpToastComponent } from '../../shared/ui/kp-toast.component';
import { KpToggleComponent } from '../../shared/ui/kp-toggle.component';
import { NotificationService } from '../../core/notification.service';
import { SupplierService } from '../../core/supplier.service';
import type { Supplier } from '../../../../shared/types/index.js';

@Component({
  selector: 'app-supplier-editor',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    KpInputComponent, KpButtonComponent, KpToggleComponent,
    KpBreadcrumbComponent, KpCardComponent, KpToastComponent,
  ],
  templateUrl: './supplier-editor.component.html',
  styleUrls: ['./supplier-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SupplierEditorComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private supplierService = inject(SupplierService);
  private notification = inject(NotificationService);

  isNew = signal(true);
  supplierId = signal<string | null>(null);
  loading = signal(false);
  saving = signal(false);

  name = signal('');
  contactPerson = signal('');
  phone = signal('');
  email = signal('');
  inn = signal('');
  bankAccount = signal('');
  paymentTermDays = signal<number | null>(30);
  isActive = signal(true);

  nameError = signal('');
  innError = signal('');

  breadcrumbs: MenuItem[] = [
    { label: 'Справочники', routerLink: '/references' },
    { label: 'Поставщики', routerLink: '/references/suppliers' },
    { label: 'Новый поставщик' },
  ];

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isNew.set(false);
      this.supplierId.set(id);
      this.loading.set(true);
      try {
        const result = await firstValueFrom(this.supplierService.getSupplier(id));
        if (result.success && result.data) {
          this.patchForm(result.data);
          this.breadcrumbs[2] = { label: result.data.name };
        } else {
          this.notification.error('Поставщик не найден');
          this.router.navigate(['/references/suppliers']);
        }
      } finally {
        this.loading.set(false);
      }
    }
  }

  private patchForm(s: Supplier) {
    this.name.set(s.name);
    this.contactPerson.set(s.contactPerson);
    this.phone.set(s.phone);
    this.email.set(s.email);
    this.inn.set(s.inn);
    this.bankAccount.set(s.bankAccount);
    this.paymentTermDays.set(s.paymentTermDays);
    this.isActive.set(s.isActive);
  }

  validate(): boolean {
    let valid = true;
    if (!this.name().trim()) { this.nameError.set('Наименование обязательно'); valid = false; }
    else { this.nameError.set(''); }

    if (!this.inn().trim()) { this.innError.set('ИНН обязателен'); valid = false; }
    else if (!/^\d{10}$|^\d{12}$/.test(this.inn().trim())) { this.innError.set('ИНН должен содержать 10 или 12 цифр'); valid = false; }
    else { this.innError.set(''); }
    return valid;
  }

  async save() {
    if (!this.validate()) return;
    this.saving.set(true);
    try {
      const data = {
        name: this.name().trim(),
        contactPerson: this.contactPerson().trim(),
        phone: this.phone().trim(),
        email: this.email().trim(),
        inn: this.inn().trim(),
        bankAccount: this.bankAccount().trim(),
        paymentTermDays: Number(this.paymentTermDays() ?? 0),
        isActive: this.isActive(),
      };
      if (this.isNew()) {
        await firstValueFrom(this.supplierService.createSupplier(data));
        this.notification.success('Поставщик создан');
      } else {
        await firstValueFrom(this.supplierService.updateSupplier(this.supplierId()!, data));
        this.notification.success('Поставщик сохранён');
      }
      this.router.navigate(['/references/suppliers']);
    } catch {
      this.notification.error('Ошибка сохранения');
    } finally {
      this.saving.set(false);
    }
  }

  cancel() {
    this.router.navigate(['/references/suppliers']);
  }
}
