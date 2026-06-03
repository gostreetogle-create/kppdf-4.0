import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import type { DocBlock } from '../../../../shared/types/index.js';
import { KpDocBlockTextComponent } from './kp-doc-block-text.component.js';
import { KpDocBlockTableComponent } from './kp-doc-block-table.component.js';
import { KpDocBlockSeparatorComponent } from './kp-doc-block-separator.component.js';
import { KpButtonComponent } from './kp-button.component.js';

@Component({
  selector: 'kp-doc-canvas',
  standalone: true,
  imports: [
    CommonModule,
    KpDocBlockTextComponent, KpDocBlockTableComponent,
    KpDocBlockSeparatorComponent, KpButtonComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="canvas__workspace">
      <div class="canvas__page" [style.background-image]="backgroundImage() ? 'url(' + backgroundImage() + ')' : 'none'">
        @for (block of blocks(); track block.id; let i = $index) {
          <div class="canvas__block" [class.canvas__block--selected]="selectedBlockId() === block.id" (click)="blockSelect.emit(block.id)">
            @switch (block.type) {
              @case ('text') {
                <kp-doc-block-text [block]="block" (editClick)="blockEdit.emit($event)" />
              }
              @case ('table') {
                <kp-doc-block-table [block]="block" [mode]="mode()" (editClick)="blockEdit.emit($event)" />
              }
              @case ('separator') {
                <kp-doc-block-separator [height]="block.height ?? 20" [showLine]="block.showLine ?? false" />
              }
            }
            @if (editable()) {
              <div class="canvas__block-actions">
                <kp-button icon="pi pi-arrow-up" size="small" [text]="true" [rounded]="true" severity="secondary" [disabled]="i === 0" (buttonClick)="blockMoveUp.emit(i)" />
                <kp-button icon="pi pi-arrow-down" size="small" [text]="true" [rounded]="true" severity="secondary" [disabled]="i === blocks().length - 1" (buttonClick)="blockMoveDown.emit(i)" />
                <kp-button icon="pi pi-trash" size="small" [text]="true" [rounded]="true" severity="danger" (buttonClick)="blockRemove.emit(block.id)" />
              </div>
            }
          </div>
        }
        @if (blocks().length === 0) {
          <div class="canvas__empty">
            Добавьте блоки с помощью панели инструментов выше
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .canvas__workspace {
      background: #e5e7eb;
      padding: 24px;
      display: flex;
      justify-content: center;
      min-height: 600px;
      border-radius: 8px;
    }
    .canvas__page {
      width: 794px;
      min-height: 1123px;
      background: #ffffff;
      box-shadow: 0 4px 24px rgba(0,0,0,0.12);
      border-radius: 2px;
      position: relative;
      background-size: cover;
      background-position: center;
    }
    .canvas__block {
      position: relative;
      transition: outline 0.15s ease;
      outline: 2px solid transparent;
      outline-offset: -2px;
    }
    .canvas__block:hover {
      outline-color: #bfdbfe;
    }
    .canvas__block--selected {
      outline-color: #3b82f6;
    }
    .canvas__block-actions {
      position: absolute;
      top: 2px;
      right: 2px;
      display: flex;
      gap: 2px;
      opacity: 0;
      transition: opacity 0.15s ease;
      z-index: 10;
    }
    .canvas__block:hover .canvas__block-actions {
      opacity: 1;
    }
    .canvas__empty {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 200px;
      color: #9ca3af;
      font-size: 14px;
    }
  `]
})
export class KpDocCanvasComponent {
  blocks = input<DocBlock[]>([]);
  mode = input<'template' | 'instance'>('template');
  editable = input(true);
  backgroundImage = input<string>('');
  selectedBlockId = input<string>('');

  blockSelect = output<string>();
  blockEdit = output<DocBlock>();
  blockRemove = output<string>();
  blockMoveUp = output<number>();
  blockMoveDown = output<number>();
}
