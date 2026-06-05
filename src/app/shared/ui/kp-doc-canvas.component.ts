import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import type { DocBlock } from '../../../../shared/types/index.js';
import { KpDocBlockTextComponent } from './kp-doc-block-text.component.js';
import { KpDocBlockTableComponent } from './kp-doc-block-table.component.js';
import { KpDocBlockSeparatorComponent } from './kp-doc-block-separator.component.js';
import { KpButtonComponent } from './kp-button.component.js';

@Component({
  selector: 'kp-doc-canvas',
  standalone: true,
  imports: [
    CommonModule, DragDropModule,
    KpDocBlockTextComponent, KpDocBlockTableComponent,
    KpDocBlockSeparatorComponent, KpButtonComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="canvas__workspace">
      <div class="canvas__page" [style.background-image]="backgroundImage() ? 'url(' + backgroundImage() + ')' : 'none'">
        @if (blocks().length === 0) {
          <div class="canvas__empty">
            Добавьте блоки с помощью панели инструментов слева
          </div>
        }

        <div
          cdkDropList
          class="canvas__blocks-list"
          (cdkDropListDropped)="onBlockDrop($event)"
        >
          @for (block of blocks(); track block.id) {
            <div
              class="canvas__block"
              [class.canvas__block--selected]="selectedBlockId() === block.id"
              [class.cdk-drag-placeholder]="false"
              cdkDrag
              cdkDragBoundary=".canvas__blocks-list"
              (click)="blockSelect.emit(block.id)"
            >
              <!-- Drag handle (visible on hover) -->
              <div class="canvas__drag-handle" cdkDragHandle>
                <i class="pi pi-grip-vertical"></i>
              </div>

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
                  <kp-button
                    icon="pi pi-pencil"
                    size="small"
                    [text]="true"
                    [rounded]="true"
                    severity="secondary"
                    pTooltip="Редактировать"
                    tooltipPosition="left"
                    (buttonClick)="blockEdit.emit(block)"
                  />
                  <kp-button
                    icon="pi pi-trash"
                    size="small"
                    [text]="true"
                    [rounded]="true"
                    severity="danger"
                    pTooltip="Удалить блок"
                    tooltipPosition="left"
                    (buttonClick)="blockRemove.emit(block.id)"
                  />
                </div>
              }
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .canvas__workspace {
      background: #e5e7eb;
      padding: 16px;
      display: flex;
      justify-content: center;
      min-height: 600px;
      border-radius: 8px;
    }
    .canvas__page {
      width: 794px;
      min-height: 1123px;
      background: #ffffff;
      color: #111827;
      box-shadow: 0 4px 24px rgba(0,0,0,0.12);
      border-radius: 2px;
      position: relative;
      background-size: cover;
      background-position: center;
    }
    .canvas__blocks-list {
      min-height: 100px;
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

    /* CDK Drag styles */
    .canvas__block.cdk-drag-preview {
      outline-color: #3b82f6;
      background: rgba(255,255,255,0.97);
      box-shadow: 0 8px 32px rgba(0,0,0,0.18);
      opacity: 0.95;
    }
    .canvas__block.cdk-drag-placeholder {
      opacity: 0.3;
      outline-style: dashed;
      outline-color: #93c5fd;
      background: #eff6ff;
    }
    .cdk-drop-list-dragging .canvas__block:not(.cdk-drag-placeholder) {
      transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
    }

    .canvas__drag-handle {
      position: absolute;
      left: -28px;
      top: 50%;
      transform: translateY(-50%);
      width: 24px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #9ca3af;
      cursor: grab;
      opacity: 0;
      transition: opacity 0.15s ease, color 0.15s ease;
      z-index: 10;
      border-radius: 4px;
      background: rgba(255,255,255,0.8);
    }
    .canvas__block:hover .canvas__drag-handle {
      opacity: 1;
    }
    .canvas__drag-handle:hover {
      color: #3b82f6;
      background: #eff6ff;
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
  blocksReorder = output<{ previousIndex: number; currentIndex: number }>();

  onBlockDrop(event: CdkDragDrop<DocBlock[]>) {
    if (event.previousIndex === event.currentIndex) return;
    this.blocksReorder.emit({
      previousIndex: event.previousIndex,
      currentIndex: event.currentIndex,
    });
  }
}
