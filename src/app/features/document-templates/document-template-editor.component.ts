import { Component, inject, signal, computed, viewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MenuItem } from 'primeng/api';
import { firstValueFrom } from 'rxjs';
import { DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';

import { KpInputComponent } from '../../shared/ui/kp-input.component';
import { KpSelectComponent, SelectOption } from '../../shared/ui/kp-select.component';
import { KpButtonComponent } from '../../shared/ui/kp-button.component';
import { KpBreadcrumbComponent } from '../../shared/ui/kp-breadcrumb.component';
import { KpCardComponent } from '../../shared/ui/kp-card.component';
import { KpToastComponent } from '../../shared/ui/kp-toast.component';
import { KpDialogComponent } from '../../shared/ui/kp-dialog.component';
import { KpToggleComponent } from '../../shared/ui/kp-toggle.component';
import { KpDocCanvasComponent } from '../../shared/ui/kp-doc-canvas.component';
import { KpDocTextEditorDialogComponent } from '../../shared/ui/kp-doc-text-editor-dialog.component';
import { KpDocPreviewDialogComponent } from '../../shared/ui/kp-doc-preview-dialog.component';
import { NotificationService } from '../../core/notification.service';
import { DocumentTemplateService } from '../../core/document-template.service';
import { TableTemplateService } from '../../core/table-template.service';
import type { DocBlock, DocBlockType, DocumentTemplate, TableTemplate } from '../../../../shared/types/index.js';

function genId(): string {
  return Math.random().toString(36).slice(2, 10);
}

const DOC_TYPE_OPTIONS: SelectOption[] = [
  { value: 'quotation', label: 'Коммерческое предложение' },
  { value: 'contract', label: 'Договор' },
  { value: 'invoice', label: 'Счёт' },
  { value: 'shipping', label: 'Отгрузка' },
];

@Component({
  selector: 'app-document-template-editor',
  standalone: true,
  imports: [
    CommonModule, FormsModule, DragDropModule,
    KpInputComponent, KpSelectComponent, KpButtonComponent, KpToggleComponent,
    KpBreadcrumbComponent, KpCardComponent, KpToastComponent, KpDialogComponent,
    KpDocCanvasComponent, KpDocTextEditorDialogComponent, KpDocPreviewDialogComponent,
  ],
  templateUrl: './document-template-editor.component.html',
  styleUrls: ['./document-template-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentTemplateEditorComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private templateService = inject(DocumentTemplateService);
  private tableTemplateService = inject(TableTemplateService);
  private notification = inject(NotificationService);

  isNew = signal(true);
  templateId = signal<string | null>(null);
  templateName = signal('');
  nameError = signal('');
  description = signal('');
  docType = signal<string>('quotation');
  blocks = signal<DocBlock[]>([]);
  selectedBlockId = signal('');
  loading = signal(false);
  saving = signal(false);

  /** Table block editing dialog */
  tableEditVisible = signal(false);
  editingTableBlock = signal<DocBlock | null>(null);
  editingTableTemplateId = signal('');
  editingTableTitle = signal('');
  tableTemplateList = signal<TableTemplate[]>([]);

  /** Separator block editing dialog */
  sepEditVisible = signal(false);
  editingSepBlock = signal<DocBlock | null>(null);
  editingSepHeight = signal(20);
  editingSepShowLine = signal(false);

  tableTemplateOptions = computed<SelectOption[]>(() =>
    this.tableTemplateList().map(t => ({ value: t.id, label: t.name }))
  );

  docTypeOptions = DOC_TYPE_OPTIONS;

  breadcrumbs: MenuItem[] = [
    { label: 'Администрирование', routerLink: '/admin' },
    { label: 'Шаблоны документов', routerLink: '/admin/document-templates' },
    { label: 'Новый шаблон' },
  ];

  async ngOnInit() {
    this.loading.set(true);
    try {
      const id = this.route.snapshot.paramMap.get('id');
      if (id) {
        this.isNew.set(false);
        this.templateId.set(id);
        const result = await firstValueFrom(this.templateService.getTemplate(id));
        if (result.success && result.data) {
          const t = result.data;
          this.templateName.set(t.name);
          this.description.set(t.description ?? '');
          this.docType.set(t.docType);
          this.blocks.set(t.blocks.map(b => ({ ...b, columns: b.columns?.map(c => ({ ...c })) })));
          this.breadcrumbs[2] = { label: t.name };
        } else {
          this.notification.error('Шаблон не найден');
          this.router.navigate(['/admin/document-templates']);
        }
      }
    } finally {
      this.loading.set(false);
    }
  }

  addBlock(type: DocBlockType) {
    const block: DocBlock = {
      id: genId(),
      type,
      order: this.blocks().length,
      ...(type === 'text' && { title: '', content: '' }),
      ...(type === 'separator' && { height: 20, showLine: false }),
    };
    this.blocks.update(b => [...b, block]);
    this.selectedBlockId.set(block.id);
  }

  removeBlock(blockId: string) {
    this.blocks.update(b => b.filter(bl => bl.id !== blockId));
    if (this.selectedBlockId() === blockId) this.selectedBlockId.set('');
  }

  /** Drag-and-drop переупорядочивание блоков */
  onBlocksReorder(event: { previousIndex: number; currentIndex: number }) {
    this.blocks.update(b => {
      const arr = [...b];
      moveItemInArray(arr, event.previousIndex, event.currentIndex);
      return arr;
    });
  }

  /** Переместить блок вверх */
  moveBlockUp(blockId: string) {
    this.blocks.update(b => {
      const idx = b.findIndex(bl => bl.id === blockId);
      if (idx <= 0) return b;
      const arr = [...b];
      [arr[idx - 1], arr[idx]] = [arr[idx], arr[idx - 1]];
      return arr;
    });
  }

  /** Переместить блок вниз */
  moveBlockDown(blockId: string) {
    this.blocks.update(b => {
      const idx = b.findIndex(bl => bl.id === blockId);
      if (idx < 0 || idx >= b.length - 1) return b;
      const arr = [...b];
      [arr[idx], arr[idx + 1]] = [arr[idx + 1], arr[idx]];
      return arr;
    });
  }

  /** Двойной клик по блоку — открыть соответствующий редактор */
  onBlockDblClick(block: DocBlock) {
    if (block.type === 'text') {
      this.textEditor().open(block);
    } else if (block.type === 'table') {
      this.openTableBlockEditor(block);
    } else if (block.type === 'separator') {
      this.openSepEditor(block);
    }
  }

  /** Клик по кнопке ✏️ — открыть редактор блока */
  onBlockEdit(block: DocBlock) {
    if (block.type === 'text') {
      this.textEditor().open(block);
    } else if (block.type === 'table') {
      this.openTableBlockEditor(block);
    } else if (block.type === 'separator') {
      this.openSepEditor(block);
    }
  }

  /** Открыть редактор табличного блока */
  async openTableBlockEditor(block: DocBlock) {
    this.editingTableBlock.set(block);
    this.editingTableTemplateId.set(block.tableTemplateId || '');
    this.editingTableTitle.set(block.title || '');

    if (this.tableTemplateList().length === 0) {
      try {
        const result = await firstValueFrom(this.tableTemplateService.getTemplates());
        if (result.success && result.data) {
          this.tableTemplateList.set(result.data);
        }
      } catch {
        this.notification.error('Не удалось загрузить шаблоны таблиц');
        return;
      }
    }
    this.tableEditVisible.set(true);
  }

  /** Сохранить изменения табличного блока */
  saveTableBlockEdit() {
    const block = this.editingTableBlock();
    if (!block) return;

    this.blocks.update(b => b.map(bl => {
      if (bl.id === block.id) {
        return {
          ...bl,
          title: this.editingTableTitle().trim() || undefined,
          tableTemplateId: this.editingTableTemplateId() || undefined,
        };
      }
      return bl;
    }));
    this.tableEditVisible.set(false);
    this.editingTableBlock.set(null);
    this.notification.success('Блок таблицы обновлён');
  }

  /** Закрытие диалога редактирования табличного блока */
  onTableEditDialogClose(visible: boolean) {
    this.tableEditVisible.set(visible);
    if (!visible) {
      this.editingTableBlock.set(null);
    }
  }

  /** Открыть редактор разделителя */
  openSepEditor(block: DocBlock) {
    this.editingSepBlock.set(block);
    this.editingSepHeight.set(block.height ?? 20);
    this.editingSepShowLine.set(block.showLine ?? false);
    this.sepEditVisible.set(true);
  }

  /** Сохранить изменения разделителя */
  saveSepEdit() {
    const block = this.editingSepBlock();
    if (!block) return;

    this.blocks.update(b => b.map(bl => {
      if (bl.id === block.id) {
        return {
          ...bl,
          height: Number(this.editingSepHeight()),
          showLine: this.editingSepShowLine(),
        };
      }
      return bl;
    }));
    this.sepEditVisible.set(false);
    this.editingSepBlock.set(null);
    this.notification.success('Разделитель обновлён');
  }

  /** Закрытие диалога редактирования разделителя */
  onSepEditDialogClose(visible: boolean) {
    this.sepEditVisible.set(visible);
    if (!visible) {
      this.editingSepBlock.set(null);
    }
  }

  onTextBlockSave(updated: DocBlock) {
    this.blocks.update(b => b.map(bl => bl.id === updated.id ? updated : bl));
  }

  textEditor = viewChild.required(KpDocTextEditorDialogComponent);
  previewDialog = viewChild.required(KpDocPreviewDialogComponent);

  validate(): boolean {
    let valid = true;
    if (!this.templateName().trim()) {
      this.nameError.set('Название обязательно');
      valid = false;
    } else {
      this.nameError.set('');
    }
    if (this.blocks().length === 0) {
      this.notification.error('Добавьте хотя бы один блок');
      valid = false;
    }
    return valid;
  }

  async save() {
    if (!this.validate()) return;
    this.saving.set(true);
    try {
      const data = {
        name: this.templateName().trim(),
        description: this.description().trim() || undefined,
        docType: this.docType() as DocumentTemplate['docType'],
        pageSize: 'A4' as const,
        blocks: this.blocks(),
      };
      if (this.isNew()) {
        await firstValueFrom(this.templateService.createTemplate(data));
        this.notification.success('Шаблон создан');
      } else {
        await firstValueFrom(this.templateService.updateTemplate(this.templateId()!, data));
        this.notification.success('Шаблон сохранён');
      }
      this.router.navigate(['/admin/document-templates']);
    } catch {
      this.notification.error('Ошибка сохранения');
    } finally {
      this.saving.set(false);
    }
  }

  preview() {
    this.previewDialog().open(
      this.templateName() || 'Без названия',
      this.docType(),
      this.blocks(),
    );
  }

  cancel() {
    this.router.navigate(['/admin/document-templates']);
  }
}
