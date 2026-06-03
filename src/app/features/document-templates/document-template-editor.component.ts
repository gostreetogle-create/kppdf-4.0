import { Component, inject, signal, viewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MenuItem } from 'primeng/api';
import { firstValueFrom } from 'rxjs';

import { KpInputComponent } from '../../shared/ui/kp-input.component';
import { KpSelectComponent, SelectOption } from '../../shared/ui/kp-select.component';
import { KpButtonComponent } from '../../shared/ui/kp-button.component';
import { KpBreadcrumbComponent } from '../../shared/ui/kp-breadcrumb.component';
import { KpCardComponent } from '../../shared/ui/kp-card.component';
import { KpToastComponent } from '../../shared/ui/kp-toast.component';
import { KpDocCanvasComponent } from '../../shared/ui/kp-doc-canvas.component';
import { KpDocTextEditorDialogComponent } from '../../shared/ui/kp-doc-text-editor-dialog.component';
import { NotificationService } from '../../core/notification.service';
import { DocumentTemplateService } from '../../core/document-template.service';
import type { DocBlock, DocBlockType, DocumentTemplate } from '../../../../shared/types/index.js';

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
    CommonModule, FormsModule,
    KpInputComponent, KpSelectComponent, KpButtonComponent,
    KpBreadcrumbComponent, KpCardComponent, KpToastComponent,
    KpDocCanvasComponent, KpDocTextEditorDialogComponent,
  ],
  templateUrl: './document-template-editor.component.html',
  styleUrls: ['./document-template-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentTemplateEditorComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private templateService = inject(DocumentTemplateService);
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

  moveBlockUp(index: number) {
    if (index === 0) return;
    this.blocks.update(b => {
      const arr = [...b];
      [arr[index - 1], arr[index]] = [arr[index], arr[index - 1]];
      return arr;
    });
  }

  moveBlockDown(index: number) {
    if (index >= this.blocks().length - 1) return;
    this.blocks.update(b => {
      const arr = [...b];
      [arr[index], arr[index + 1]] = [arr[index + 1], arr[index]];
      return arr;
    });
  }

  onBlockEdit(block: DocBlock) {
    if (block.type === 'text') {
      this.textEditor().open(block);
    } else {
      this.notification.info('Редактирование этого типа блока будет добавлено позже');
    }
  }

  onTextBlockSave(updated: DocBlock) {
    this.blocks.update(b => b.map(bl => bl.id === updated.id ? updated : bl));
  }

  textEditor = viewChild.required(KpDocTextEditorDialogComponent);

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

  cancel() {
    this.router.navigate(['/admin/document-templates']);
  }
}
