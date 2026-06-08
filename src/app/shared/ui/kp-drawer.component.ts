import { Component, input, model, ChangeDetectionStrategy } from '@angular/core';
import { DrawerModule } from 'primeng/drawer';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'kp-drawer',
  standalone: true,
  imports: [CommonModule, DrawerModule],
  template: `
    <p-drawer
      [(visible)]="visible"
      [position]="position()"
      [style]="{ width: width() }"
      [closable]="closable()"
    >
      <ng-content />
    </p-drawer>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KpDrawerComponent {
  visible = model(false);
  position = input<'left' | 'right' | 'top' | 'bottom'>('left');
  width = input('300px');
  closable = input(true);
}
