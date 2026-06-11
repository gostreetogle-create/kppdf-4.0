import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { LucideDynamicIcon } from '@lucide/angular';

type ButtonSeverity = 'primary' | 'secondary' | 'success' | 'danger' | 'warn' | 'info' | 'contrast';
type ButtonSize = 'small' | 'large';

@Component({
  selector: 'kp-button',
  standalone: true,
  imports: [ButtonModule, LucideDynamicIcon, RouterLink],
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
      [routerLink]="routerLink()"
      [queryParams]="queryParams()"
      [attr.aria-label]="label() || 'Кнопка'"
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
      width: 1.75rem;
      height: 1.75rem;
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
  size = input<ButtonSize>('large');
  outlined = input(false);
  raised = input(false);
  rounded = input(false);
  text = input(false);
  plain = input(false);
  loading = input(false);
  disabled = input(false);
  styleClass = input('');
  routerLink = input<string | string[] | undefined>(undefined);
  queryParams = input<Record<string, string | number | boolean>>({});

  readonly buttonClick = output<MouseEvent>();
}
