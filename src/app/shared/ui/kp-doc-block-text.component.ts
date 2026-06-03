import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import type { DocBlock } from '../../../../shared/types/index.js';

@Component({
  selector: 'kp-doc-block-text',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="text-block" (dblclick)="editClick.emit(block())">
      @if (block().title) {
        <div class="text-block__title">{{ block().title }}</div>
      }
      @if (block().columns && block().columns!.length > 0) {
        <div class="text-block__columns" [style.grid-template-columns]="columnsGrid()">
          @for (col of block().columns!; track col.id) {
            <div
              class="text-block__col"
              [style.text-align]="col.textAlign || 'left'"
              [style.font-weight]="col.fontWeight || 'normal'"
              [style.font-style]="col.fontStyle || 'normal'"
              [style.text-decoration]="col.textDecoration || 'none'"
              [style.color]="col.color || 'inherit'"
            >{{ col.content }}</div>
          }
        </div>
      } @else if (block().content) {
        <div class="text-block__content">{{ block().content }}</div>
      }
    </div>
  `,
  styles: [`
    .text-block {
      padding: 5mm;
      cursor: pointer;
      min-height: 10mm;
      border: 1px dashed transparent;
      border-radius: 2px;
      transition: border-color 0.15s ease;
    }
    .text-block:hover {
      border-color: #93c5fd;
    }
    .text-block__title {
      font-weight: 600;
      margin-bottom: 2mm;
      font-size: inherit;
    }
    .text-block__columns {
      display: grid;
      gap: 3mm;
    }
    .text-block__col {
      white-space: pre-wrap;
      word-break: break-word;
    }
    .text-block__content {
      white-space: pre-wrap;
      word-break: break-word;
    }
  `]
})
export class KpDocBlockTextComponent {
  block = input.required<DocBlock>();
  editClick = output<DocBlock>();

  columnsGrid(): string {
    const cols = this.block().columns;
    if (!cols || cols.length === 0) return '1fr';
    return cols.map((c: { width?: string }) => c.width || '1fr').join(' ');
  }
}
