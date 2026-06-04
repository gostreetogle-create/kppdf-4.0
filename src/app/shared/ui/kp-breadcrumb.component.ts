import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'kp-breadcrumb',
  standalone: true,
  imports: [BreadcrumbModule],
  template: `<p-breadcrumb [model]="items()">
    <ng-template pTemplate="separator">
      <span class="kp-breadcrumb__sep">›</span>
    </ng-template>
  </p-breadcrumb>`,
  styles: [`
    .kp-breadcrumb__sep {
      color: var(--color-text-muted);
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-bold);
      margin: 0 var(--space-1);
      user-select: none;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class KpBreadcrumbComponent {
  items = input<MenuItem[]>([]);
}
