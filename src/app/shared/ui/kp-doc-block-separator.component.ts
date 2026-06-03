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
        <hr class="separator__hr" />
      }
    </div>
  `,
  styles: [`
    .separator {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .separator--line {
      padding: 0 5mm;
    }
    .separator__hr {
      width: 100%;
      border: none;
      border-top: 1px solid #ccc;
      margin: 0;
    }
  `]
})
export class KpDocBlockSeparatorComponent {
  height = input(20);
  showLine = input(false);
}
