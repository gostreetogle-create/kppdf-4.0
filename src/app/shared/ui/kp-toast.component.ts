import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'kp-toast',
  standalone: true,
  imports: [ToastModule],
  template: `<p-toast position="top-right" [life]="4000">
    <ng-template pTemplate="message" let-msg>
      <div class="kp-toast-msg">
        <div class="kp-toast-msg__content">
          @if (msg.icon) {
            <i [class]="msg.icon" class="kp-toast-msg__icon"></i>
          }
          <span>{{ msg.detail || msg.summary }}</span>
        </div>
        <div class="kp-toast-msg__progress">
          <div class="kp-toast-msg__bar"></div>
        </div>
      </div>
    </ng-template>
  </p-toast>`,
  styles: [`
    .kp-toast-msg__content {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      padding-bottom: var(--space-2);
    }
    .kp-toast-msg__icon {
      font-size: 1.2rem;
    }
    .kp-toast-msg__progress {
      height: 3px;
      background: rgba(255,255,255,0.2);
      border-radius: 2px;
      overflow: hidden;
    }
    .kp-toast-msg__bar {
      height: 100%;
      background: rgba(255,255,255,0.6);
      border-radius: 2px;
      animation: kp-toast-shrink 4s linear forwards;
    }
    @keyframes kp-toast-shrink {
      from { width: 100%; }
      to { width: 0%; }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class KpToastComponent {
  messageService = inject(MessageService);
}
