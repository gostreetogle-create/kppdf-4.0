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
