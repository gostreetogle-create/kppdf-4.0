import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Группа полей (inputs, selects) в аккуратной рамке.
 * Использование:
 * ```html
 * <kp-field-group>
 *   <kp-input label="Название" [(ngModel)]="name" />
 *   <kp-field-row>
 *     <kp-select ... />
 *     <kp-button ... />
 *   </kp-field-row>
 * </kp-field-group>
 * ```
 */
@Component({
  selector: 'kp-field-group',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="kp-field-group">
      <ng-content />
    </div>
  `,
  styles: [`
    .kp-field-group {
      display: flex;
      flex-direction: column;
      gap: var(--space-3);
      border: 1px solid var(--color-border-light);
      border-radius: var(--radius-md);
      padding: var(--space-3);
      background: var(--color-surface);
    }
  `],
})
export class KpFieldGroupComponent {}
