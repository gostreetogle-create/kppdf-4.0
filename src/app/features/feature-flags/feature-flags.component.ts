import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuItem } from 'primeng/api';

import { KpButtonComponent } from '../../shared/ui/kp-button.component';
import { KpBreadcrumbComponent } from '../../shared/ui/kp-breadcrumb.component';
import { KpCardComponent } from '../../shared/ui/kp-card.component';
import { KpToggleComponent } from '../../shared/ui/kp-toggle.component';
import { KpBadgeComponent } from '../../shared/ui/kp-badge.component';
import { FeatureFlagService } from '../../core/feature-flag.service';
import { FEATURE_FLAGS } from '../../../../shared/types/index.js';

@Component({
  selector: 'app-feature-flags',
  standalone: true,
  imports: [
    CommonModule,
    KpButtonComponent, KpBreadcrumbComponent, KpCardComponent,
    KpToggleComponent, KpBadgeComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <kp-card>
      <kp-breadcrumb [items]="breadcrumbs" />

      <div class="ff__header">
        <h2 class="ff__title">Флаги возможностей</h2>
        <kp-button
          label="Сбросить всё"
          lucideIcon="rotate-ccw"
          severity="secondary"
          size="small"
          (buttonClick)="resetAll()"
        />
      </div>

      <p class="ff__note">
        Включайте и выключайте новые функции без изменения кода.
        Настройки сохраняются в вашем браузере.
      </p>

      @for (cat of categories; track cat) {
        <div class="ff__section">
          <h3 class="ff__section-title">{{ cat }}</h3>

          @for (flag of flagsByCategory(cat); track flag.key) {
            <div class="ff__row">
              <div class="ff__row-info">
                <div class="ff__row-label">
                  {{ flag.label }}
                  @if (!flag.enabledByDefault) {
                    <kp-badge value="Экспериментальное" severity="warn" />
                  }
                </div>
                <div class="ff__row-desc">{{ flag.description }}</div>
              </div>
              <div class="ff__row-toggle">
                <kp-toggle
                  [checked]="flagService.flags()[flag.key]"
                  (checkedChange)="flagService.toggle(flag.key, $event)"
                />
              </div>
            </div>
          }
        </div>
      }
    </kp-card>
  `,
  styles: [`
    .ff__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 8px;
    }
    .ff__title {
      font-size: 20px;
      font-weight: 700;
      margin: 0;
    }
    .ff__note {
      font-size: 13px;
      color: var(--color-text-muted);
      margin: -4px 0 20px;
    }
    .ff__section {
      margin-bottom: 24px;
    }
    .ff__section-title {
      font-size: 13px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--color-text-muted);
      margin: 0 0 8px;
      padding-bottom: 6px;
      border-bottom: 1px solid var(--color-border-light);
    }
    .ff__row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 12px;
      border-radius: 6px;
      transition: background 0.15s;
    }
    .ff__row:hover {
      background: var(--color-surface-alt);
    }
    .ff__row + .ff__row {
      border-top: 1px solid var(--color-border-light);
    }
    .ff__row-info {
      flex: 1;
      min-width: 0;
    }
    .ff__row-label {
      font-size: 14px;
      font-weight: 600;
      color: var(--color-text);
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .ff__row-desc {
      font-size: 12px;
      color: var(--color-text-muted);
      margin-top: 2px;
    }
    .ff__row-toggle {
      flex-shrink: 0;
      margin-left: 16px;
    }
  `],
})
export class FeatureFlagsComponent {
  flagService = inject(FeatureFlagService);

  breadcrumbs: MenuItem[] = [
    { label: 'Администрирование', routerLink: '/admin' },
    { label: 'Флаги возможностей' },
  ];

  /** Уникальные категории флагов */
  categories = [...new Set(FEATURE_FLAGS.map(f => f.category))];

  /** Флаги по категории */
  flagsByCategory(category: string) {
    return FEATURE_FLAGS.filter(f => f.category === category);
  }

  resetAll() {
    this.flagService.resetAll();
  }
}
