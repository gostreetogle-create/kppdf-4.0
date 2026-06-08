import { Component, signal, inject, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { KpDialogComponent } from './kp-dialog.component.js';
import { KpDocCanvasComponent } from './kp-doc-canvas.component.js';
import { KpButtonComponent } from './kp-button.component.js';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { firstValueFrom } from 'rxjs';
import type { DocBlock, TableTemplate } from '../../../../shared/types/index.js';
import { TableTemplateService } from '../../core/table-template.service.js';
import { ApiService } from '../../core/api.service.js';

const DOC_TYPE_LABELS: Record<string, string> = {
  quotation: 'Коммерческое предложение',
  contract: 'Договор',
  invoice: 'Счёт',
  shipping: 'Отгрузка',
};

@Component({
  selector: 'kp-doc-preview-dialog',
  standalone: true,
  imports: [
    KpDialogComponent, KpDocCanvasComponent, KpButtonComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './kp-doc-preview-dialog.component.html',
  styleUrl: './kp-doc-preview-dialog.component.scss'
})
export class KpDocPreviewDialogComponent {
  visible = signal(false);
  printing = signal(false);
  pdfLoading = signal(false);
  templateName = signal('');
  docType = signal('');
  backgroundImage = signal('');
  blocks = signal<DocBlock[]>([]);
  docTypeLabel = signal('');

  /** Кеш данных для табличных блоков: blockId → { template, rows } */
  tableCache = signal<Map<string, { template: TableTemplate; rows: Record<string, unknown>[] }>>(new Map());

  private cdr = inject(ChangeDetectorRef);
  private templateService = inject(TableTemplateService);
  private api = inject(ApiService);

  /** Коэффициент масштабирования A4-страницы, чтобы полностью помещалась в диалоге */
  pageScale = signal(1);

  open(templateName: string, docType: string, blocks: DocBlock[], backgroundImage = '') {
    this.templateName.set(templateName);
    this.docType.set(docType);
    this.docTypeLabel.set(DOC_TYPE_LABELS[docType] ?? docType);
    this.backgroundImage.set(backgroundImage);
    this.blocks.set(blocks.map(b => ({
      ...b,
      columns: b.columns?.map(c => ({ ...c })),
      settings: b.settings ? { ...b.settings } : undefined,
    })));
    this.printing.set(false);
    this.visible.set(true);

    // Предзагружаем данные для всех табличных блоков (для print-шаблона)
    this.resolveTableData(blocks);

    // Ждём рендеринга диалога, затем вычисляем масштаб
    requestAnimationFrame(() => this.computeScale());
  }

  /** Загрузить шаблоны и данные для всех table-блоков (кеш для print-шаблона) */
  private async resolveTableData(blocks: DocBlock[]) {
    const tableBlocks = blocks.filter(b => b.type === 'table' && b.tableTemplateId);
    if (tableBlocks.length === 0) return;

    const cache = new Map<string, { template: TableTemplate; rows: Record<string, unknown>[] }>();

    for (const block of tableBlocks) {
      try {
        const tid = block.tableTemplateId!;
        const tmplRes = await firstValueFrom(this.templateService.getTemplate(tid));
        if (!tmplRes.success || !tmplRes.data) continue;

        const template = tmplRes.data;
        const tableName = template.columns[0]?.tableName;
        let rows: Record<string, unknown>[] = [];

        if (tableName) {
          try {
            const dataRes = await firstValueFrom(this.api.get<unknown[]>('/' + tableName));
            if (dataRes.success && Array.isArray(dataRes.data)) {
              rows = dataRes.data as Record<string, unknown>[];
            }
          } catch {
            rows = [];
          }
        }

        cache.set(block.id, { template, rows });
      } catch {
        // блок без данных
      }
    }

    if (cache.size > 0) {
      this.tableCache.set(cache);
    }
  }

  /** Получить данные из кеша для блока (используется в print-шаблоне) */
  getTableData(blockId: string): { template: TableTemplate; rows: Record<string, unknown>[] } | undefined {
    return this.tableCache().get(blockId);
  }

  /** Значение поля с форматированием для печати */
  getFieldValue(row: Record<string, unknown>, fieldName: string): string {
    const val = row[fieldName];
    if (val === null || val === undefined) return '—';
    if (typeof val === 'boolean') return val ? '✓' : '—';
    if (typeof val === 'number') {
      if (fieldName.toLowerCase().includes('price') || fieldName.toLowerCase().includes('total') || fieldName.toLowerCase().includes('sum')) {
        return val.toLocaleString('ru-RU') + ' ₽';
      }
      if (fieldName.toLowerCase().includes('percent') || fieldName.toLowerCase().includes('markup')) {
        return val + '%';
      }
      if (fieldName.toLowerCase().includes('weight') || fieldName.toLowerCase().includes('kg')) {
        return val.toLocaleString('ru-RU') + ' кг';
      }
      return val.toLocaleString('ru-RU');
    }
    return String(val);
  }

  columnsGrid(block: DocBlock): string {
    const cols = block.columns;
    if (!cols || cols.length === 0) return '1fr';
    return cols.map(c => c.width || '1fr').join(' ');
  }

  print() {
    this.printing.set(true);
    this.cdr.detectChanges();
    // Allow Angular to render the print-only template
    setTimeout(() => {
      window.print();
      // Reset after printing
      setTimeout(() => this.printing.set(false), 500);
    }, 100);
  }

  async downloadPdf() {
    this.pdfLoading.set(true);
    this.cdr.detectChanges();

    await new Promise(resolve => setTimeout(resolve, 100));

    const pageElement = document.querySelector('kp-doc-preview-dialog .canvas__page') as HTMLElement | null;
    if (!pageElement && !this.visible()) {
      this.pdfLoading.set(false);
      return;
    }
    const pageEl = pageElement || document.querySelector('.canvas__page') as HTMLElement | null;
    if (!pageEl) {
      this.pdfLoading.set(false);
      return;
    }

    try {
      const canvas = await html2canvas(pageEl, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;
      let pageNum = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;
      pageNum++;

      while (heightLeft > 0) {
        position = -(pdfHeight * pageNum);
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
        pageNum++;
      }

      const fileName = `${this.templateName() || 'документ'}.pdf`;
      pdf.save(fileName);
    } catch (err) {
      console.error('PDF export failed:', err);
    } finally {
      this.pdfLoading.set(false);
    }
  }

  /** Вычислить масштаб, чтобы A4-страница (794×1123 px) полностью помещалась в контейнере */
  private computeScale() {
    const wrap = document.querySelector('kp-doc-preview-dialog .preview__canvas-wrap') as HTMLElement | null;
    if (!wrap) return;

    const wrapWidth = wrap.clientWidth;
    const wrapHeight = wrap.clientHeight;

    if (wrapWidth === 0 || wrapHeight === 0) {
      requestAnimationFrame(() => this.computeScale());
      return;
    }

    const pageW = 794;
    const pageH = 1123;

    const scaleX = (wrapWidth - 8) / pageW;
    const scaleY = (wrapHeight - 8) / pageH;
    const scale = Math.min(scaleX, scaleY, 1);

    this.pageScale.set(parseFloat(scale.toFixed(4)));
  }
}
