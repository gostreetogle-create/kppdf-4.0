import { Component, inject, signal, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MenuItem } from 'primeng/api';
import { firstValueFrom } from 'rxjs';

import { KpInputComponent } from '../../shared/ui/kp-input.component';
import { KpSelectComponent, SelectOption } from '../../shared/ui/kp-select.component';
import { KpButtonComponent } from '../../shared/ui/kp-button.component';
import { KpBreadcrumbComponent } from '../../shared/ui/kp-breadcrumb.component';
import { KpCardComponent } from '../../shared/ui/kp-card.component';
import { KpToastComponent } from '../../shared/ui/kp-toast.component';
import { KpToggleComponent } from '../../shared/ui/kp-toggle.component';
import { NotificationService } from '../../core/notification.service';
import { OrganizationService } from '../../core/organization.service';
import type { Organization } from '../../../../shared/types/index.js';

const LEGAL_FORM_OPTIONS: SelectOption[] = [
  { value: 'ООО', label: 'ООО — Общество с ограниченной ответственностью' },
  { value: 'АО', label: 'АО — Акционерное общество' },
  { value: 'ИП', label: 'ИП — Индивидуальный предприниматель' },
  { value: 'ПАО', label: 'ПАО — Публичное акционерное общество' },
  { value: 'ЗАО', label: 'ЗАО — Закрытое акционерное общество' },
  { value: 'НКО', label: 'НКО — Некоммерческая организация' },
];

@Component({
  selector: 'app-organization-editor',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    KpInputComponent, KpSelectComponent, KpButtonComponent,
    KpBreadcrumbComponent, KpCardComponent, KpToastComponent,
    KpToggleComponent,
  ],
  templateUrl: './organization-editor.component.html',
  styleUrls: ['./organization-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganizationEditorComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private orgService = inject(OrganizationService);
  private notification = inject(NotificationService);

  isNew = signal(true);
  orgId = signal<string | null>(null);
  loading = signal(false);
  saving = signal(false);

  /** Поля формы */
  name = signal('');
  shortName = signal('');
  legalForm = signal('');
  inn = signal('');
  kpp = signal('');
  ogrn = signal('');
  phone = signal('');
  email = signal('');
  legalAddress = signal('');
  postalAddress = signal('');
  bankName = signal('');
  bankBik = signal('');
  bankAccount = signal('');
  signerName = signal('');
  signerPosition = signal('');
  isActive = signal(true);

  /** Ошибки валидации */
  nameError = signal('');
  innError = signal('');

  legalFormOptions = LEGAL_FORM_OPTIONS;

  breadcrumbs: MenuItem[] = [
    { label: 'Справочники', routerLink: '/references' },
    { label: 'Организации', routerLink: '/references/organizations' },
    { label: 'Новая организация' },
  ];

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isNew.set(false);
      this.orgId.set(id);
      this.loading.set(true);
      try {
        const result = await firstValueFrom(this.orgService.getOrganization(id));
        if (result.success && result.data) {
          this.patchForm(result.data);
          this.breadcrumbs[2] = { label: result.data.shortName };
        } else {
          this.notification.error('Организация не найдена');
          this.router.navigate(['/references/organizations']);
        }
      } finally {
        this.loading.set(false);
      }
    }
  }

  private patchForm(org: Organization) {
    this.name.set(org.name);
    this.shortName.set(org.shortName);
    this.legalForm.set(org.legalForm);
    this.inn.set(org.inn);
    this.kpp.set(org.kpp);
    this.ogrn.set(org.ogrn);
    this.phone.set(org.phone);
    this.email.set(org.email);
    this.legalAddress.set(org.legalAddress);
    this.postalAddress.set(org.postalAddress);
    this.bankName.set(org.bankName);
    this.bankBik.set(org.bankBik);
    this.bankAccount.set(org.bankAccount);
    this.signerName.set(org.signerName);
    this.signerPosition.set(org.signerPosition);
    this.isActive.set(org.isActive);
  }

  validate(): boolean {
    let valid = true;

    if (!this.name().trim()) {
      this.nameError.set('Наименование обязательно');
      valid = false;
    } else {
      this.nameError.set('');
    }

    if (!this.inn().trim()) {
      this.innError.set('ИНН обязателен');
      valid = false;
    } else if (!/^\d{10}$|^\d{12}$/.test(this.inn().trim())) {
      this.innError.set('ИНН должен содержать 10 или 12 цифр');
      valid = false;
    } else {
      this.innError.set('');
    }

    return valid;
  }

  async save() {
    if (!this.validate()) return;

    this.saving.set(true);
    try {
      const data = {
        name: this.name().trim(),
        shortName: this.shortName().trim(),
        legalForm: this.legalForm(),
        inn: this.inn().trim(),
        kpp: this.kpp().trim(),
        ogrn: this.ogrn().trim(),
        phone: this.phone().trim(),
        email: this.email().trim(),
        legalAddress: this.legalAddress().trim(),
        postalAddress: this.postalAddress().trim(),
        bankName: this.bankName().trim(),
        bankBik: this.bankBik().trim(),
        bankAccount: this.bankAccount().trim(),
        signerName: this.signerName().trim(),
        signerPosition: this.signerPosition().trim(),
        isActive: this.isActive(),
      };

      if (this.isNew()) {
        await firstValueFrom(this.orgService.createOrganization(data));
        this.notification.success('Организация создана');
      } else {
        await firstValueFrom(this.orgService.updateOrganization(this.orgId()!, data));
        this.notification.success('Организация сохранена');
      }

      this.router.navigate(['/references/organizations']);
    } catch {
      this.notification.error('Ошибка сохранения');
    } finally {
      this.saving.set(false);
    }
  }

  cancel() {
    this.router.navigate(['/references/organizations']);
  }
}
