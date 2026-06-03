import { Component, input, output, signal, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import type { DocBlock, TableTemplate } from '../../../../shared/types/index.js';
import { TableTemplateService } from '../../core/table-template.service.js';

@Component({
  selector: 'kp-doc-block-table',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="table-block" (dblclick)="editClick.emit(block())">
      @if (block().title) {
        <div class="table-block__title">{{ block().title }}</div>
      }
      @if (tmpl()) {
        <table class="table-block__preview">
          <thead>
            <tr>
              @for (col of tmpl()!.columns; track col.fieldName) {
                <th [style.width]="col.width || 'auto'">{{ col.label }}</th>
              }
            </tr>
          </thead>
          <tbody>
            @if (mode() === 'template') {
              <tr>
                @for (col of tmpl()!.columns; track col.fieldName) {
                  <td class="table-block__placeholder">{{ '{' + '{' + col.fieldName + '}' + '}' }}</td>
                }
              </tr>
            }
          </tbody>
        </table>
      } @else {
        <div class="table-block__empty">
          Двойной клик для выбора шаблона таблицы
        </div>
      }
    </div>
  `,
  styles: [`
    .table-block {
      padding: 5mm;
      cursor: pointer;
      border: 1px dashed transparent;
      border-radius: 2px;
      transition: border-color 0.15s ease;
    }
    .table-block:hover { border-color: #93c5fd; }
    .table-block__title { font-weight: 600; margin-bottom: 2mm; }
    .table-block__preview { width: 100%; border-collapse: collapse; font-size: 11px; }
    .table-block__preview th,
    .table-block__preview td { border: 1px solid #d1d5db; padding: 2mm 3mm; text-align: left; }
    .table-block__preview th { background: #f3f4f6; font-weight: 600; }
    .table-block__placeholder { color: #9ca3af; font-style: italic; }
    .table-block__empty {
      text-align: center; padding: 8mm; color: #9ca3af;
      border: 1px dashed #d1d5db; border-radius: 4px;
    }
  `]
})
export class KpDocBlockTableComponent implements OnInit {
  block = input.required<DocBlock>();
  mode = input<'template' | 'instance'>('template');
  editClick = output<DocBlock>();

  private templateService = inject(TableTemplateService);
  tmpl = signal<TableTemplate | undefined>(undefined);

  async ngOnInit() {
    const tid = this.block().tableTemplateId;
    if (tid) {
      const res = await firstValueFrom(this.templateService.getTemplate(tid));
      if (res.success && res.data) this.tmpl.set(res.data);
    }
  }
}
