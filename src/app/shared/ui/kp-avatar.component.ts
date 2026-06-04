import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { CommonModule } from '@angular/common';

type AvatarStatus = 'online' | 'offline' | 'busy' | 'away' | null;

@Component({
  selector: 'kp-avatar',
  standalone: true,
  imports: [CommonModule, AvatarModule],
  template: `
    <div class="kp-avatar-wrap">
      <p-avatar
        [label]="label()"
        [icon]="icon()"
        [image]="image()"
        [size]="size()"
        [shape]="shape()"
        [styleClass]="styleClass()"
      />
      @if (status()) {
        <span class="kp-avatar__status kp-avatar__status--{{ status() }}"></span>
      }
    </div>
  `,
  styles: [`
    .kp-avatar-wrap {
      position: relative;
      display: inline-flex;
    }
    .kp-avatar__status {
      position: absolute;
      bottom: 1px;
      right: 1px;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      border: 2px solid var(--color-surface);
      box-sizing: border-box;
    }
    :host-context(.p-avatar-large) .kp-avatar__status,
    :host-context(.p-avatar-xlarge) .kp-avatar__status {
      width: 14px;
      height: 14px;
    }
    .kp-avatar__status--online { background: var(--color-success); }
    .kp-avatar__status--offline { background: var(--color-text-muted); }
    .kp-avatar__status--busy { background: var(--color-error); }
    .kp-avatar__status--away { background: var(--color-warning); }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KpAvatarComponent {
  label = input('');
  icon = input('');
  image = input('');
  size = input<'normal' | 'large' | 'xlarge'>('normal');
  shape = input<'square' | 'circle'>('circle');
  styleClass = input('');
  status = input<AvatarStatus>(null);
}
