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
import { CounterpartyRoleService } from '../../core/counterparty-role.service';


@Component({
  selector: 'app-counterparty-role-editor',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    KpInputComponent, KpButtonComponent, KpToggleComponent,
    KpBreadcrumbComponent, KpCardComponent, KpToastComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <kp-toast />

    <kp-card styleClass="org-editor">
      <kp-breadcrumb [items]="breadcrumbs" />

      <h2 class="org-editor__title">
        {{ isNew() ? 'Новый вид контрагента' : 'Редактирование вида контрагента' }}
      </h2>

      @if (loading()) {
        <div class="org-editor__loading">Загрузка...</div>
      } @else {
        <fieldset class="org-editor__section">
          <legend class="org-editor__section-title">Основные данные</legend>

          <div class="org-editor__row">
            <div class="org-editor__field org-editor__field--wide">
              <kp-input
                label="Название"
                placeholder="Например: Поставщик, Покупатель, Перевозчик"
                [(ngModel)]="name"
                [error]="nameError()"
              />
            </div>
          </div>

          <div class="org-editor__row">
            <div class="org-editor__field org-editor__field--wide">
              <kp-input
                label="Системный ключ"
                placeholder="Заполняется автоматически из названия"
                [(ngModel)]="slug"
              />
            </div>
          </div>

          <div class="org-editor__row">
            <div class="org-editor__field org-editor__field--wide">
              <kp-input
                label="Описание"
                placeholder="Для чего используется эта роль"
                [(ngModel)]="description"
              />
            </div>
          </div>
        </fieldset>

        <div class="org-editor__status">
          <div class="org-editor__status-row">
            <kp-toggle [(ngModel)]="isActive" label="Вид контрагента активен" />
          </div>
        </div>

        <div class="org-editor__footer">
          <kp-button
            [label]="isNew() ? 'Создать' : 'Сохранить'"
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
      }
    </kp-card>
  `,
  styles: [`
    :host { display: block; max-width: 700px; margin: 0 auto; }
    .org-editor { display: block; }
    .org-editor__title {
      font-size: var(--font-size-xl);
      font-weight: var(--font-weight-bold);
      color: var(--color-text);
      margin: var(--space-2) 0 var(--space-6);
    }
    .org-editor__loading {
      display: flex;
      justify-content: center;
      padding: var(--space-12);
      color: var(--color-text-muted);
    }
    .org-editor__section {
      border: 1px solid var(--color-border-light);
      border-radius: var(--radius-md);
      padding: var(--space-5);
      margin-bottom: var(--space-5);
      background: var(--color-surface);
    }
    .org-editor__section-title {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text-secondary);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      padding: 0 var(--space-2);
    }
    .org-editor__row {
      display: flex;
      gap: var(--space-4);
      margin-bottom: var(--space-4);
      flex-wrap: wrap;
      align-items: flex-end;
      &:last-child { margin-bottom: 0; }
    }
    .org-editor__field { flex: 1; min-width: 200px; }
    .org-editor__field--wide { flex: 2; }
    .org-editor__status { margin-bottom: var(--space-6); }
    .org-editor__status-row {
      display: flex;
      align-items: center;
      gap: var(--space-3);
    }
    .org-editor__footer {
      display: flex;
      gap: var(--space-3);
      padding-top: var(--space-4);
      border-top: 1px solid var(--color-border-light);
    }
  `]
})
export class CounterpartyRoleEditorComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private roleService = inject(CounterpartyRoleService);
  private notification = inject(NotificationService);

  isNew = signal(true);
  roleId = signal<string | null>(null);
  loading = signal(false);
  saving = signal(false);

  name = signal('');
  slug = signal('');
  description = signal('');
  isActive = signal(true);

  nameError = signal('');

  breadcrumbs: MenuItem[] = [
    { label: 'Справочники', routerLink: '/references' },
    { label: 'Виды контрагентов', routerLink: '/references/counterparty-roles' },
    { label: 'Новый вид' },
  ];

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isNew.set(false);
      this.roleId.set(id);
      this.loading.set(true);
      try {
        const result = await firstValueFrom(this.roleService.getRole(id));
        if (result.success && result.data) {
          this.name.set(result.data.name);
          this.slug.set(result.data.slug);
          this.description.set(result.data.description);
          this.isActive.set(result.data.isActive);
          this.breadcrumbs[2] = { label: result.data.name };
        } else {
          this.notification.error('Вид контрагента не найден');
          this.router.navigate(['/references/counterparty-roles']);
        }
      } finally {
        this.loading.set(false);
      }
    }
  }

  validate(): boolean {
    if (!this.name().trim()) {
      this.nameError.set('Название обязательно');
      return false;
    }
    this.nameError.set('');
    return true;
  }

  async save() {
    if (!this.validate()) return;

    this.saving.set(true);
    try {
      const data = {
        name: this.name().trim(),
        slug: this.slug().trim() || this.name().trim().toLowerCase().replace(/[^a-zа-яё0-9]+/g, '_').replace(/^_|_$/g, ''),
        description: this.description().trim(),
        isActive: this.isActive(),
      };

      if (this.isNew()) {
        await firstValueFrom(this.roleService.createRole(data));
        this.notification.success('Вид контрагента создан');
      } else {
        await firstValueFrom(this.roleService.updateRole(this.roleId()!, data));
        this.notification.success('Вид контрагента сохранён');
      }

      this.router.navigate(['/references/counterparty-roles']);
    } catch {
      this.notification.error('Ошибка сохранения');
    } finally {
      this.saving.set(false);
    }
  }

  cancel() {
    this.router.navigate(['/references/counterparty-roles']);
  }
}
