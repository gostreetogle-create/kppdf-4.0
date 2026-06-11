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
import { PageTitleService } from '../../core/page-title.service';
import { NotificationService } from '../../core/notification.service';
import { OrganizationService } from '../../core/organization.service';
import { CounterpartyRoleService } from '../../core/counterparty-role.service';
import type { Organization, CounterpartyRoleDef } from '../../../../shared/types/index.js';

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
  private roleService = inject(CounterpartyRoleService);
  private pageTitle = inject(PageTitleService);
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

  /** Роли контрагента (динамически загружаются из справочника) */
  allRoles = signal<CounterpartyRoleDef[]>([]);
  selectedRoleIds = signal<string[]>([]);

  /** Поля для поставщика */
  contactPerson = signal('');
  paymentTermDays = signal<number | null>(30);

  isActive = signal(true);

  /** Ошибки валидации */
  nameError = signal('');
  innError = signal('');

  legalFormOptions = LEGAL_FORM_OPTIONS;

  breadcrumbs: MenuItem[] = [
    { label: 'Справочники', routerLink: '/references' },
    { label: 'Контрагенты', routerLink: '/references/organizations' },
    { label: 'Новый контрагент' },
  ];

  async ngOnInit() {
    // Загружаем все роли из справочника
    await this.loadRoles();

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isNew.set(false);
      this.orgId.set(id);
      this.loading.set(true);
      try {
        const result = await firstValueFrom(this.orgService.getOrganization(id));
        if (result.success && result.data) {
          this.patchForm(result.data);
          this.breadcrumbs[2] = { label: result.data.shortName || result.data.name };
        } else {
          this.notification.error('Контрагент не найден');
          this.router.navigate(['/references/organizations']);
        }
    } finally {
      this.loading.set(false);
    }
    }

    if (!this.pageTitle.title()) {
      this.pageTitle.setTitle(this.isNew() ? 'Новый контрагент' : '');
    }
  }

  private async loadRoles() {
    const result = await firstValueFrom(this.roleService.getRoles());
    this.allRoles.set(result.data.filter(r => r.isActive));
  }

  isRoleChecked(roleId: string): boolean {
    return this.selectedRoleIds().includes(roleId);
  }

  onRoleCheckboxChange(roleId: string, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    this.selectedRoleIds.update(ids => {
      if (checked) {
        return [...ids, roleId];
      }
      return ids.filter(id => id !== roleId);
    });
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
    this.selectedRoleIds.set([...org.counterpartyRoleIds]);
    this.contactPerson.set(org.contactPerson);
    this.paymentTermDays.set(org.paymentTermDays);
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
      const hasAnyRole = this.selectedRoleIds().length > 0;

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
        counterpartyRoleIds: this.selectedRoleIds(),
        contactPerson: hasAnyRole ? this.contactPerson().trim() : '',
        paymentTermDays: hasAnyRole ? Number(this.paymentTermDays() ?? 0) : 0,
        isActive: this.isActive(),
      };

      if (this.isNew()) {
        await firstValueFrom(this.orgService.createOrganization(data));
        this.notification.success('Контрагент создан');
      } else {
        await firstValueFrom(this.orgService.updateOrganization(this.orgId()!, data));
        this.notification.success('Контрагент сохранён');
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
