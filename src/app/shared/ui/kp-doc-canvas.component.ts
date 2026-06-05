import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { LucideDynamicIcon } from '@lucide/angular';
import type { DocBlock } from '../../../../shared/types/index.js';
import { KpDocBlockTextComponent } from './kp-doc-block-text.component.js';
import { KpDocBlockTableComponent } from './kp-doc-block-table.component.js';
import { KpDocBlockSeparatorComponent } from './kp-doc-block-separator.component.js';
import { KpButtonComponent } from './kp-button.component.js';

const BLOCK_TYPE_ICONS: Record<string, string> = {
  text: 'align-left',
  table: 'table',
  separator: 'minus',
};

const BLOCK_TYPE_LABELS: Record<string, string> = {
  text: 'Текст',
  table: 'Таблица',
  separator: 'Разделитель',
};

@Component({
  selector: 'kp-doc-canvas',
  standalone: true,
  imports: [
    CommonModule, DragDropModule, LucideDynamicIcon,
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
          [cdkDropListLockAxis]="'y'"
          (cdkDropListDropped)="onBlockDrop($event)"
        >
          @for (block of blocks(); track block.id) {
            <div
              class="canvas__block"
              [class.canvas__block--selected]="selectedBlockId() === block.id"
              cdkDrag
              cdkDragLockAxis="y"
              cdkDragBoundary=".canvas__blocks-list"
              (click)="blockSelect.emit(block.id)"
              (dblclick)="blockDblClick.emit(block)"
            >
              <!-- Кастомный превью — компактная плашка с иконкой и названием -->
              <ng-template cdkDragPreview>
                <div class="canvas__drag-preview">
                  <svg [lucideIcon]="getBlockIcon(block.type)" class="canvas__drag-preview-icon"></svg>
                  <span>{{ getBlockLabel(block) }}</span>
                </div>
              </ng-template>

              <!-- Кастомный placeholder — видимая пунктирная зона -->
              <ng-template cdkDragPlaceholder>
                <div class="canvas__drag-placeholder">
                  <svg lucideIcon="arrow-up-down" class="canvas__drag-placeholder-icon"></svg>
                </div>
              </ng-template>

              <!-- Drag handle (visible on hover) -->
              <div class="canvas__drag-handle">
                <svg lucideIcon="grip-vertical"></svg>
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
                    lucideIcon="chevron-up"
                    size="small"
                    [text]="true"
                    [rounded]="true"
                    severity="secondary"
                    pTooltip="Переместить вверх"
                    tooltipPosition="left"
                    (buttonClick)="blockMoveUp.emit(block.id)"
                  />
                  <kp-button
                    lucideIcon="chevron-down"
                    size="small"
                    [text]="true"
                    [rounded]="true"
                    severity="secondary"
                    pTooltip="Переместить вниз"
                    tooltipPosition="left"
                    (buttonClick)="blockMoveDown.emit(block.id)"
                  />
                  <kp-button
                    lucideIcon="pencil"
                    size="small"
                    [text]="true"
                    [rounded]="true"
                    severity="secondary"
                    pTooltip="Редактировать"
                    tooltipPosition="left"
                    (buttonClick)="blockEdit.emit(block)"
                  />
                  <kp-button
                    lucideIcon="trash-2"
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

    /* === CDK Drag: кастомный превью === */
    .canvas__drag-preview {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      background: var(--color-surface);
      border: 2px solid var(--color-primary);
      border-radius: var(--radius-md);
      box-shadow: var(--shadow-xl);
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text);
      opacity: 0.97;
      pointer-events: none;
      transform: scale(1.03);
    }
    .canvas__drag-preview-icon {
      width: 1rem;
      height: 1rem;
      color: var(--color-primary);
    }

    /* === CDK Drag: кастомный placeholder === */
    .canvas__drag-placeholder {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 64px;
      border: 2px dashed var(--color-primary);
      border-radius: var(--radius-md);
      background: var(--color-primary-subtle);
      animation: canvas-placeholder-pulse 1.2s ease-in-out infinite;
    }
    .canvas__drag-placeholder-icon {
      width: 1.25rem;
      height: 1.25rem;
      color: var(--color-primary);
      opacity: 0.6;
    }
    @keyframes canvas-placeholder-pulse {
      0%, 100% { opacity: 0.5; }
      50% { opacity: 1; }
    }

    /* === CDK Drag: анимация перемещения элементов === */
    .cdk-drop-list-dragging .canvas__block:not(.cdk-drag-placeholder) {
      transition: transform 180ms cubic-bezier(0.25, 0.8, 0.25, 1.2);
    }
    .cdk-drag-animating {
      transition: transform 180ms cubic-bezier(0.25, 0.8, 0.25, 1.2);
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
      color: var(--color-text-muted);
      cursor: grab;
      opacity: 0;
      transition: opacity 0.15s ease, color 0.15s ease, background 0.15s ease;
      z-index: 10;
      border-radius: 4px;
      background: var(--color-surface);
    }
    .canvas__block:hover .canvas__drag-handle {
      opacity: 1;
    }
    .canvas__drag-handle:hover {
      color: var(--color-primary);
      background: var(--color-primary-subtle);
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

    /* Чёткие рамки у кнопок действий на холсте */
    .canvas__block-actions ::ng-deep .p-button.p-button-text {
      border: 1.5px solid var(--color-border);
      background: var(--color-surface);
    }
    .canvas__block-actions ::ng-deep .p-button.p-button-text:hover {
      border-color: var(--color-primary);
      background: var(--color-primary-subtle);
    }
    .canvas__block-actions ::ng-deep .p-button.p-button-text.p-button-danger:hover {
      border-color: var(--color-error);
      background: var(--color-error-bg);
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
  blockMoveUp = output<string>();
  blockMoveDown = output<string>();
  blockDblClick = output<DocBlock>();
  blocksReorder = output<{ previousIndex: number; currentIndex: number }>();

  private fallbackIcon = 'box';

  getBlockIcon(type: string): string {
    return BLOCK_TYPE_ICONS[type] || this.fallbackIcon;
  }

  getBlockLabel(block: DocBlock): string {
    const typeLabel = BLOCK_TYPE_LABELS[block.type] || block.type;
    return block.title ? `${typeLabel}: ${block.title}` : typeLabel;
  }

  onBlockDrop(event: CdkDragDrop<DocBlock[]>) {
    if (event.previousIndex === event.currentIndex) return;
    this.blocksReorder.emit({
      previousIndex: event.previousIndex,
      currentIndex: event.currentIndex,
    });
  }
}
