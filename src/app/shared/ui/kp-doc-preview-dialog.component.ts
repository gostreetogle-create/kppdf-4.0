import { Component, signal, inject, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { KpDialogComponent } from './kp-dialog.component.js';
import { KpDocCanvasComponent } from './kp-doc-canvas.component.js';
import { KpButtonComponent } from './kp-button.component.js';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import type { DocBlock } from '../../../../shared/types/index.js';

const DOC_TYPE_LABELS: Record<string, string> = {
  quotation: 'Коммерческое предложение',
  contract: 'Договор',
  invoice: 'Счёт',
  shipping: 'Отгрузка',
};

@Component({
  selector: 'kp-doc-preview-dialog',
  standalone: true,
  imports: [KpDialogComponent, KpDocCanvasComponent, KpButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <kp-dialog
      [header]="'Предпросмотр: ' + templateName()"
      [visible]="visible()"
      (visibleChange)="visible.set($event)"
      width="1000px"
    >
      <div class="preview">
        <div class="preview__info">
          <span class="preview__label">{{ docTypeLabel() }}</span>
          <span class="preview__sep">·</span>
          <span class="preview__label">{{ blocks().length }} блоков</span>
          <span class="preview__sep">·</span>
          <span class="preview__label">Формат A4</span>
        </div>

        <div class="preview__canvas-wrap">
          <kp-doc-canvas
            [blocks]="blocks()"
            [editable]="false"
            [backgroundImage]="backgroundImage()"
          />
        </div>

        <div class="preview__footer no-print">
          <kp-button
            label="Скачать PDF"
            icon="pi pi-download"
            severity="success"
            [loading]="pdfLoading()"
            (buttonClick)="downloadPdf()"
          />
          <kp-button
            label="Печать"
            icon="pi pi-print"
            (buttonClick)="print()"
          />
          <kp-button
            label="Закрыть"
            icon="pi pi-times"
            severity="secondary"
            (buttonClick)="visible.set(false)"
          />
        </div>
      </div>
    </kp-dialog>

    <!-- Hidden print template — rendered only when printing -->
    @if (printing()) {
      <div class="print-only">
        <div class="print-page">
          @for (block of blocks(); track block.id) {
            <div class="print-block">
              @switch (block.type) {
                @case ('text') {
                  @if (block.title) {
                    <div class="print-block__title">{{ block.title }}</div>
                  }
                  @if (block.columns && block.columns.length > 0) {
                    <div class="print-block__columns" [style.grid-template-columns]="columnsGrid(block)">
                      @for (col of block.columns; track col.id) {
                        <div
                          class="print-block__col"
                          [style.text-align]="col.textAlign || 'left'"
                          [style.font-weight]="col.fontWeight || 'normal'"
                          [style.font-style]="col.fontStyle || 'normal'"
                          [style.text-decoration]="col.textDecoration || 'none'"
                          [style.color]="col.color || 'inherit'"
                        >{{ col.content }}</div>
                      }
                    </div>
                  } @else if (block.content) {
                    <div class="print-block__content">{{ block.content }}</div>
                  }
                }
                @case ('separator') {
                  <div class="print-block__separator" [style.height.px]="block.height ?? 20">
                    @if (block.showLine) {
                      <hr class="print-block__hr" />
                    }
                  </div>
                }
                @case ('table') {
                  @if (block.title) {
                    <div class="print-block__title">{{ block.title }}</div>
                  }
                  <div class="print-block__table-placeholder">
                    [Таблица: {{ block.tableTemplateId || 'не выбрана' }}]
                  </div>
                }
              }
            </div>
          }
        </div>
      </div>
    }
  `,
  styles: [`
    .preview {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .preview__info {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 13px;
      color: #6b7280;
    }
    .preview__sep {
      color: #d1d5db;
    }
    .preview__canvas-wrap {
      max-height: 82vh;
      overflow-y: auto;
      border-radius: 8px;
    }
    .preview__footer {
      display: flex;
      gap: 8px;
      justify-content: flex-end;
      padding-top: 12px;
      border-top: 1px solid #e5e7eb;
    }

    /* Print-only hidden container */
    .print-only {
      display: none;
    }

    /* Print styles */
    @media print {
      :host {
        display: block !important;
      }

      /* Hide everything except print content */
      .no-print,
      kp-dialog,
      .preview {
        display: none !important;
      }

      .print-only {
        display: block !important;
      }

      .print-page {
        width: 210mm;
        min-height: 297mm;
        padding: 15mm 20mm;
        margin: 0;
        background: white;
        color: black;
        font-family: 'Times New Roman', 'Georgia', serif;
        font-size: 12pt;
        line-height: 1.5;
      }

      .print-block {
        margin-bottom: 4mm;
        page-break-inside: avoid;
      }
      .print-block__title {
        font-weight: 700;
        margin-bottom: 2mm;
        font-size: 12pt;
      }
      .print-block__columns {
        display: grid;
        gap: 3mm;
      }
      .print-block__col {
        white-space: pre-wrap;
        word-break: break-word;
      }
      .print-block__content {
        white-space: pre-wrap;
        word-break: break-word;
      }
      .print-block__separator {
        width: 100%;
        display: flex;
        align-items: center;
      }
      .print-block__hr {
        width: 100%;
        border: none;
        border-top: 1px solid #000;
        margin: 0;
      }
      .print-block__table-placeholder {
        color: #666;
        font-style: italic;
        padding: 4mm;
      }
    }
  `]
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

  private cdr = inject(ChangeDetectorRef);

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

    // Small delay to let the canvas fully render
    await new Promise(resolve => setTimeout(resolve, 100));

    const pageElement = document.querySelector('kp-doc-preview-dialog .canvas__page') as HTMLElement | null;
    if (!pageElement) {
      this.pdfLoading.set(false);
      return;
    }

    try {
      const canvas = await html2canvas(pageElement, {
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

      // First page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;
      pageNum++;

      // Additional pages if content overflows
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
}
