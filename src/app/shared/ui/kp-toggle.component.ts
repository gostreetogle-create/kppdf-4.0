import { Component, input, model, output, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToggleSwitchModule, ToggleSwitchChangeEvent } from 'primeng/toggleswitch';

type ToggleSize = 'small' | 'normal' | 'large';

@Component({
  selector: 'kp-toggle',
  standalone: true,
  imports: [ToggleSwitchModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="kp-toggle-wrap" [class.kp-toggle-wrap--small]="toggleSize() === 'small'" [class.kp-toggle-wrap--large]="toggleSize() === 'large'">
      @if (label()) {
        <label class="kp-toggle__label" [for]="inputId()">{{ label() }}</label>
      }
      <p-toggleswitch
        [(ngModel)]="checked"
        [disabled]="disabled()"
        [inputId]="inputId()"
        [styleClass]="'kp-toggle--' + toggleSize() + ' ' + styleClass()"
        (onChange)="toggleChange.emit($event)"
      />
    </div>
  `,
  styles: [`
    .kp-toggle-wrap { display: flex; align-items: center; gap: var(--space-2); }
    .kp-toggle__label { font-size: var(--font-size-sm); font-weight: var(--font-weight-medium); cursor: pointer; }

    :host ::ng-deep .kp-toggle--small .p-toggleswitch {
      width: 2.5rem;
      height: 1.25rem;
    }
    :host ::ng-deep .kp-toggle--small .p-toggleswitch-slider::before {
      width: 0.875rem;
      height: 0.875rem;
      margin-top: -0.4375rem;
    }
    :host ::ng-deep .kp-toggle--large .p-toggleswitch {
      width: 4rem;
      height: 2rem;
    }
    :host ::ng-deep .kp-toggle--large .p-toggleswitch-slider::before {
      width: 1.5rem;
      height: 1.5rem;
      margin-top: -0.75rem;
    }
  `],
})
export class KpToggleComponent {
  label = input('');
  checked = model(false);
  disabled = input(false);
  inputId = input('');
  styleClass = input('');
  toggleSize = input<ToggleSize>('normal');
  toggleChange = output<ToggleSwitchChangeEvent>();
}
