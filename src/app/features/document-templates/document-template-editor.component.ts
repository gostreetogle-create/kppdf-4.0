import { Component, inject, signal, computed, viewChild, linkedSignal, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MenuItem } from 'primeng/api';
import { TooltipModule } from 'primeng/tooltip';
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
import { KpFileUploadComponent } from '../../shared/ui/kp-file-upload.component';
import type { FileUploadEvent } from 'primeng/fileupload';
import { NotificationService } from '../../core/notification.service';
import { DocumentTemplateService } from '../../core/document-template.service';
import { UndoRedoStack } from '../../core/undo-redo-stack';
import { TableTemplateService } from '../../core/table-template.service';
import { DocTypeService } from '../../core/doc-type.service';
import { OrganizationService } from '../../core/organization.service';
import type { DocBlock, DocBlockType, DocumentTemplate, TableTemplate, Organization } from '../../../../shared/types/index.js';

function genId(): string {
  return Math.random().toString(36).slice(2, 10);
}

@Component({
  selector: 'app-document-template-editor',
  standalone: true,
  imports: [
    CommonModule, FormsModule, DragDropModule,
    KpInputComponent, KpSelectComponent, KpButtonComponent, KpToggleComponent,
    KpBreadcrumbComponent, KpCardComponent, KpToastComponent, KpDialogComponent,
    KpDocCanvasComponent, KpDocTextEditorDialogComponent, KpDocPreviewDialogComponent, KpFileUploadComponent,
    TooltipModule,
  ],
  templateUrl: './document-template-editor.component.html',
  styleUrls: ['./document-template-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentTemplateEditorComponent implements OnInit {
  /** Стек Undo/Redo для blocks */
  private undoStack = new UndoRedoStack<DocBlock[]>(50);

  /** Состояние кнопок Undo/Redo (вычисляется от стека) */
  canUndo = signal(false);
  canRedo = signal(false);
  undoSteps = signal(0);
  redoSteps = signal(0);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private templateService = inject(DocumentTemplateService);
  private tableTemplateService = inject(TableTemplateService);
  private docTypeService = inject(DocTypeService);
  private organizationService = inject(OrganizationService);
  private notification = inject(NotificationService);

  isNew = signal(true);
  templateId = signal<string | null>(null);
  templateName = signal('Новый документ');
  nameError = signal('');
  description = signal('');
  docType = signal<string>('quotation');
  organizationId = signal<string>('');
  isDefault = signal(false);
  backgroundImage = signal<string>('');
  blocks = signal<DocBlock[]>([]);
  selectedBlockId = signal('');
  loading = signal(false);
  saving = signal(false);

  organizations = signal<Organization[]>([]);

  organizationOptions = computed<SelectOption[]>(() =>
    this.organizations().filter(o => o.isActive).map(o => ({
      value: o.id,
      label: o.shortName || o.name,
    }))
  );

  /** Table block editing dialog */
  tableEditVisible = signal(false);
  editingTableBlock = signal<DocBlock | null>(null);
  editingTableTemplateId = linkedSignal({
    source: () => this.editingTableBlock(),
    computation: (block) => block?.tableTemplateId ?? '',
  });
  editingTableTitle = linkedSignal({
    source: () => this.editingTableBlock(),
    computation: (block) => block?.title ?? '',
  });
  tableTemplateList = signal<TableTemplate[]>([]);

  /** Separator block editing dialog */
  sepEditVisible = signal(false);
  editingSepBlock = signal<DocBlock | null>(null);
  editingSepHeight = linkedSignal({
    source: () => this.editingSepBlock(),
    computation: (block) => block?.height ?? 20,
  });
  editingSepShowLine = linkedSignal({
    source: () => this.editingSepBlock(),
    computation: (block) => block?.showLine ?? false,
  });

  tableTemplateOptions = computed<SelectOption[]>(() =>
    this.tableTemplateList().map(t => ({ value: t.id, label: t.name }))
  );

  docTypes = signal<{ slug: string; name: string }[]>([]);

  docTypeOptions = computed<SelectOption[]>(() =>
    this.docTypes().map(dt => ({ value: dt.slug, label: dt.name }))
  );

  breadcrumbs: MenuItem[] = [
    { label: 'Администрирование', routerLink: '/admin' },
    { label: 'Шаблоны документов', routerLink: '/admin/document-templates' },
    { label: 'Новый шаблон' },
  ];

  async ngOnInit() {
    this.loading.set(true);
    try {
      // Загружаем типы документов из справочника
      const docTypesRes = await firstValueFrom(this.docTypeService.getDocTypes());
      if (docTypesRes.success) {
        this.docTypes.set(docTypesRes.data.filter(dt => dt.isActive).map(dt => ({ slug: dt.slug, name: dt.name })));
      }

      // Загружаем организации
      const orgsRes = await firstValueFrom(this.organizationService.getOrganizations());
      if (orgsRes.success) {
        this.organizations.set(orgsRes.data);
      }

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
          this.organizationId.set(t.organizationId ?? '');
          this.isDefault.set(t.isDefault ?? false);
          this.backgroundImage.set(t.backgroundImage ?? '');
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
    // Инициализируем стек undo начальным состоянием blocks
    this.pushState();
  }

  /** Сохранить ТЕКУЩЕЕ состояние blocks() в стек undo (вызывать ПОСЛЕ мутации) */
  private pushState(): void {
    this.undoStack.push(this.blocks());
    this.updateUndoState();
  }

  /** Обновить сигналы состояния undo/redo */
  private updateUndoState(): void {
    this.canUndo.set(this.undoStack.canUndo);
    this.canRedo.set(this.undoStack.canRedo);
    this.undoSteps.set(this.undoStack.undoSteps);
    this.redoSteps.set(this.undoStack.redoSteps);
  }

  /** Undo — откатить blocks() на предыдущий снапшот */
  undo(): void {
    const state = this.undoStack.undo();
    if (state) {
      this.blocks.set(state);
      this.updateUndoState();
    }
  }

  /** Redo — вернуть отменённый снапшот */
  redo(): void {
    const state = this.undoStack.redo();
    if (state) {
      this.blocks.set(state);
      this.updateUndoState();
    }
  }

  /** Обработчик клавиатуры для Ctrl+Z / Ctrl+Shift+Z */
  onKeyDown(event: KeyboardEvent): void {
    if (event.ctrlKey && event.key === 'z' && !event.shiftKey) {
      event.preventDefault();
      this.undo();
    } else if (event.ctrlKey && event.key === 'z' && event.shiftKey) {
      event.preventDefault();
      this.redo();
    } else if (event.ctrlKey && event.key === 'y') {
      event.preventDefault();
      this.redo();
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
    this.pushState();
  }

  removeBlock(blockId: string) {
    this.blocks.update(b => b.filter(bl => bl.id !== blockId));
    if (this.selectedBlockId() === blockId) this.selectedBlockId.set('');
    this.pushState();
  }

  /** Drag-and-drop переупорядочивание блоков */
  onBlocksReorder(event: { previousIndex: number; currentIndex: number }) {
    this.blocks.update(b => {
      const arr = [...b];
      moveItemInArray(arr, event.previousIndex, event.currentIndex);
      return arr;
    });
    this.pushState();
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
    this.pushState();
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
    this.pushState();
  }

  /** Двойной клик по блоку — открыть соответствующий редактор */
  onBlockDblClick(block: DocBlock) {
    if (block.type === 'text') {
      this.textEditor()?.open(block);
    } else if (block.type === 'table') {
      this.openTableBlockEditor(block);
    } else if (block.type === 'separator') {
      this.openSepEditor(block);
    }
  }

  /** Клик по кнопке ✏️ — открыть редактор блока */
  onBlockEdit(block: DocBlock) {
    if (block.type === 'text') {
      this.textEditor()?.open(block);
    } else if (block.type === 'table') {
      this.openTableBlockEditor(block);
    } else if (block.type === 'separator') {
      this.openSepEditor(block);
    }
  }

  /** Открыть редактор шаблона таблицы в новой вкладке */
  editTableTemplate() {
    const tid = this.editingTableTemplateId();
    if (tid) {
      const url = this.router.serializeUrl(
        this.router.createUrlTree([`/admin/table-templates/${tid}/edit`])
      );
      window.open(url, '_blank');
    }
  }

  /** Открыть редактор табличного блока */
  async openTableBlockEditor(block: DocBlock) {
    this.editingTableBlock.set(block);
    // editingTableTemplateId и editingTableTitle сбрасываются автоматически через linkedSignal

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

  /** При выборе шаблона таблицы — авто-подставить заголовок */
  onTableTemplateSelected(templateId: string) {
    this.editingTableTemplateId.set(templateId);
    // Авто-подстановка названия шаблона как заголовка, если заголовок ещё не задан
    if (!this.editingTableTitle().trim()) {
      const tmpl = this.tableTemplateList().find(t => t.id === templateId);
      if (tmpl) {
        this.editingTableTitle.set(tmpl.name);
      }
    }
  }

  /** Перейти к созданию нового шаблона таблицы */
  createNewTableTemplate() {
    this.tableEditVisible.set(false);
    this.editingTableBlock.set(null);
    this.router.navigate(['/admin/table-templates/new']);
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
    this.pushState();
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
    // editingSepHeight и editingSepShowLine сбрасываются автоматически через linkedSignal
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
    this.pushState();
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
    this.pushState();
  }

  /** Обработчик загрузки фонового изображения */
  onBackgroundUpload(event: FileUploadEvent) {
    try {
      const evt = event as any;
      const response = JSON.parse(evt.xhr.response);
      if (response.success && response.data?.url) {
        this.backgroundImage.set(response.data.url);
        this.notification.success('Фоновое изображение загружено');
      } else {
        this.notification.error(response.message || 'Ошибка загрузки файла');
      }
    } catch {
      this.notification.error('Ошибка обработки ответа сервера');
    }
  }

  /** Удалить фоновое изображение */
  removeBackground() {
    this.backgroundImage.set('');
  }

  textEditor = viewChild(KpDocTextEditorDialogComponent);
  previewDialog = viewChild(KpDocPreviewDialogComponent);

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
        organizationId: this.organizationId() || undefined,
        isDefault: this.isDefault(),
        backgroundImage: this.backgroundImage() || undefined,
        blocks: this.blocks(),
      };
      if (this.isNew()) {
        await firstValueFrom(this.templateService.createTemplate(data));
        this.notification.success('Шаблон создан');
      } else {
        await firstValueFrom(this.templateService.updateTemplate(this.templateId()!, data));
        this.notification.success('Шаблон сохранён');
      }
      // После сохранения очищаем историю undo — новая «чистая» сессия
      this.undoStack.clear();
      this.pushState();
      this.router.navigate(['/admin/document-templates']);
    } catch {
      this.notification.error('Ошибка сохранения');
    } finally {
      this.saving.set(false);
    }
  }

  preview() {
    this.previewDialog()?.open(
      this.templateName() || 'Без названия',
      this.docType(),
      this.blocks(),
      this.backgroundImage(),
    );
  }

  cancel() {
    this.router.navigate(['/admin/document-templates']);
  }
}
