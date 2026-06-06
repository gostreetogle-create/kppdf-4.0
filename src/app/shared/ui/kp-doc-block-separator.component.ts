import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'kp-doc-block-separator',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="separator" [style.height.px]="height()" [class.separator--line]="showLine()">
      @if (showLine()) {
        <div class="separator__line"></div>
      }
    </div>
  `,
  styles: [`
    .separator {
      width: 100%;
      display: flex;
      align-items: flex-start;
      justify-content: center;
      padding-top: 2px;
    }
    .separator--line {
      padding: 0;
    }
    .separator__line {
      width: calc(100% - 10mm);
      max-width: calc(794px - 10mm);
      border-top: 1px solid #9ca3af;
      margin: 0 auto;
    }
  `]
})
export class KpDocBlockSeparatorComponent {
  height = input(20);
  showLine = input(false);
}
