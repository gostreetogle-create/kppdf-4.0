import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { LucideDynamicIcon } from '@lucide/angular';

type ButtonSeverity = 'primary' | 'secondary' | 'success' | 'danger' | 'warn' | 'info' | 'contrast';
type ButtonSize = 'small' | 'large';

@Component({
  selector: 'kp-button',
  standalone: true,
  imports: [ButtonModule, TooltipModule, LucideDynamicIcon],
  template: `
    <p-button
      [label]="label()"
      [icon]="lucideIcon() ? '' : icon()"
      [iconPos]="iconPos()"
      [severity]="severity()"
      [size]="size()"
      [outlined]="outlined()"
      [raised]="raised()"
      [rounded]="rounded()"
      [text]="text()"
      [plain]="plain()"
      [loading]="loading()"
      [disabled]="disabled()"
      [styleClass]="styleClass()"
      [pTooltip]="pTooltip()"
      [tooltipPosition]="tooltipPosition()"
      [attr.aria-label]="label() || pTooltip() || 'Кнопка'"
      (onClick)="buttonClick.emit($event)"
    >
      @if (lucideIcon()) {
        <ng-template pTemplate="icon">
          <svg [lucideIcon]="lucideIcon()" class="kp-btn__lucide"></svg>
        </ng-template>
      }
    </p-button>
  `,
  styles: [`
    .kp-btn__lucide {
      width: 1.25rem;
      height: 1.25rem;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class KpButtonComponent {
  label = input('');
  icon = input('');
  lucideIcon = input('');
  iconPos = input<'left' | 'right' | 'top' | 'bottom'>('left');
  severity = input<ButtonSeverity>('primary');
  size = input<ButtonSize>('small');
  outlined = input(false);
  raised = input(false);
  rounded = input(false);
  text = input(false);
  plain = input(false);
  loading = input(false);
  disabled = input(false);
  styleClass = input('');
  pTooltip = input('');
  tooltipPosition = input<'top' | 'bottom' | 'left' | 'right'>('top');

  readonly buttonClick = output<MouseEvent>();
}
