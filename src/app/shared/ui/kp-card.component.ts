import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { CardModule } from 'primeng/card';
import { SkeletonModule } from 'primeng/skeleton';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'kp-card',
  standalone: true,
  imports: [CommonModule, CardModule, SkeletonModule],
  template: `
    @if (loading()) {
      <div class="kp-card-skeleton">
        @if (header()) {
          <p-skeleton width="40%" height="1.5rem" styleClass="mb-2" />
        }
        @if (subheader()) {
          <p-skeleton width="25%" height="1rem" styleClass="mb-3" />
        }
        <p-skeleton width="100%" height="2rem" styleClass="mb-2" />
        <p-skeleton width="100%" height="2rem" styleClass="mb-2" />
        <p-skeleton width="60%" height="2rem" />
      </div>
    } @else {
      <p-card [header]="header()" [subheader]="subheader()" [styleClass]="'kp-card-interactive ' + styleClass()">
        <ng-content />
      </p-card>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`
    :host {
      display: block;
    }
    :host ::ng-deep .kp-card-interactive {
      transition: box-shadow var(--transition-spring), transform var(--transition-spring);
      cursor: default;
    }
    :host ::ng-deep .kp-card-interactive:hover {
      box-shadow: var(--shadow-card-hover) !important;
      transform: translateY(-2px);
    }
    .kp-card-skeleton {
      background: var(--color-surface);
      border-radius: var(--radius-lg);
      padding: var(--space-6);
      box-shadow: var(--shadow-card);
      border: 1px solid var(--color-border-light);
    }
  `]
})
export class KpCardComponent {
  header = input('');
  subheader = input('');
  styleClass = input('');
  loading = input(false);
}
