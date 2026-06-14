import { Component, inject, signal, viewChild, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { firstValueFrom } from 'rxjs';

import { KpButtonComponent } from '../../shared/ui/kp-button.component';
import { KpBreadcrumbComponent } from '../../shared/ui/kp-breadcrumb.component';
import { KpCardComponent } from '../../shared/ui/kp-card.component';
import { KpTableComponent, TableColumn, TableExtraAction } from '../../shared/ui/kp-table.component';
import { KpToastComponent } from '../../shared/ui/kp-toast.component';
import { KpConfirmDialogComponent } from '../../shared/ui/kp-confirm-dialog.component';

import { KpDocPreviewDialogComponent } from '../../shared/ui/kp-doc-preview-dialog.component';
import { NotificationService } from '../../core/notification.service';
import { CommercialProposalService } from '../../core/commercial-proposal.service';
import { DocumentTemplateService } from '../../core/document-template.service';
import { ClientService } from '../../core/client.service';
import { OrganizationService } from '../../core/organization.service';
import { ConfirmationService } from 'primeng/api';
import { ContractService } from '../../core/contract.service';
import { generateId } from '../../core/crud-factory.js';
import type { CommercialProposal, ProposalStatus, DocBlock } from '../../../../shared/types/index.js';

interface ProposalRow extends CommercialProposal {
  statusLabel: string;
  itemsCount: number;
  updatedAtDisplay: string;
}

@Component({
  selector: 'app-proposal-list',
  standalone: true,
  imports: [
    CommonModule, RouterLink,
    KpButtonComponent, KpBreadcrumbComponent, KpCardComponent,
    KpTableComponent, KpToastComponent, KpDocPreviewDialogComponent,
  ],
  template: `
    <kp-toast />

    <kp-card>
      <kp-breadcrumb [items]="breadcrumbs" />

      <div class="cp-list__header">
        <h2 class="cp-list__title">📄 Коммерческие предложения</h2>
        <kp-button
          label="+ Создать КП"
          lucideIcon="plus"
          routerLink="/sales/proposals/new"
          [disabled]="loading()"
        />
      </div>

      <kp-table
        storageKey="proposals"
        [data]="rows()"
        [columns]="tableColumns"
        [rows]="20"
        [paginator]="true"
        [sortField]="'number'"
        [sortOrder]="-1"
        [searchFields]="['number', 'notes']"
        emptyMessage="Нет коммерческих предложений"
        [showActions]="true"
        [showView]="true"
        [loading]="loading()"
        [extraActions]="statusActions"
        (rowEdit)="onEditRow($event)"
        (rowDelete)="onDelete($event)"
        (rowView)="onPreview($event)"
        (rowExtraAction)="onStatusChange($event)"
      />

      <kp-doc-preview-dialog />
    </kp-card>
  `,
  styles: [`
    :host { display: block; max-width: 1100px; margin: 0 auto; padding: var(--space-6); }
    .cp-list__header {
      display: flex; align-items: center; justify-content: space-between; margin: var(--space-4) 0;
    }
    .cp-list__title {
      font-size: var(--font-size-xl); font-weight: var(--font-weight-bold);
      color: var(--color-text); margin: 0;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProposalListComponent {
  private router = inject(Router);
  private proposalService = inject(CommercialProposalService);
  private templateService = inject(DocumentTemplateService);
  private contractService = inject(ContractService);
  private clientService = inject(ClientService);
  private orgService = inject(OrganizationService);
  private notification = inject(NotificationService);
  private confirmationService = inject(ConfirmationService);

  rows = signal<ProposalRow[]>([]);
  loading = signal(false);

  previewDialog = viewChild(KpDocPreviewDialogComponent);

  /** Кастомные кнопки смены статуса */
  statusActions: TableExtraAction[] = [
    {
      icon: 'send',
      severity: 'info',
      tooltip: 'Отправить',
      visible: (row: unknown) => (row as CommercialProposal).status === 'draft',
    },
    {
      icon: 'thumbs-up',
      severity: 'success',
      tooltip: 'Согласовать',
      visible: (row: unknown) => (row as CommercialProposal).status === 'sent',
    },
    {
      icon: 'thumbs-down',
      severity: 'danger',
      tooltip: 'Отклонить',
      visible: (row: unknown) => (row as CommercialProposal).status === 'sent',
    },
    {
      icon: 'file-signature',
      severity: 'info',
      tooltip: 'Создать договор',
      visible: (row: unknown) => (row as CommercialProposal).status === 'approved' || (row as CommercialProposal).status === 'sent',
    },
    {
      icon: 'copy',
      severity: 'secondary',
      tooltip: 'Дублировать',
      visible: () => true,
    },
  ];

  breadcrumbs: MenuItem[] = [
    { label: 'Продажи' },
    { label: 'Коммерческие предложения' },
  ];

  tableColumns: TableColumn[] = [
    { field: 'number', header: 'Номер', width: '110px', sortable: true },
    { field: 'statusLabel', header: 'Статус', width: '120px', type: 'badge' },
    { field: 'itemsCount', header: 'Позиций', width: '90px', type: 'number' },
    { field: 'totalAmount', header: 'Сумма', width: '140px', type: 'number' },
    { field: 'updatedAtDisplay', header: 'Изменён', width: '170px', sortable: true },
  ];

  constructor() {
    this.load();
  }

  async load() {
    this.loading.set(true);
    try {
      const res = await firstValueFrom(this.proposalService.getProposals());
      this.rows.set(res.data.map(p => ({
        ...p,
        statusLabel: this.statusText(p.status),
        itemsCount: p.items.length,
        updatedAtDisplay: new Date(p.updatedAt).toLocaleString('ru-RU'),
      })));
    } finally {
      this.loading.set(false);
    }
  }

  private statusText(s: string): string {
    const map: Record<string, string> = {
      draft: 'Черновик',
      sent: 'Отправлено',
      approved: 'Согласовано',
      rejected: 'Отклонено',
    };
    return map[s] || s;
  }

  async onPreview(row: unknown) {
    const p = row as CommercialProposal;

    // Находим шаблон: по templateId или первый quotation-шаблон
    let blocks: DocBlock[] = [];
    let templateName = 'Коммерческое предложение';

    if (p.templateId) {
      const res = await firstValueFrom(this.templateService.getTemplate(p.templateId));
      if (res.success && res.data) {
        blocks = res.data.blocks;
        templateName = res.data.name;
      }
    }

    if (blocks.length === 0) {
      // Fallback: ищем первый шаблон типа quotation
      const allRes = await firstValueFrom(this.templateService.getTemplates());
      const quotationTmpl = allRes.data.find(t => t.docType === 'quotation');
      if (quotationTmpl) {
        blocks = quotationTmpl.blocks;
        templateName = quotationTmpl.name;
      } else {
        this.notification.warn('Нет шаблона для печати');
        return;
      }
    }

    // Загружаем имена клиента и организации для подстановки
    let clientName = '';
    let orgName = '';
    if (p.clientId) {
      const cliRes = await firstValueFrom(this.clientService.getClient(p.clientId));
      if (cliRes.success && cliRes.data) {
        clientName = [cliRes.data.lastName, cliRes.data.firstName, cliRes.data.patronymic].filter(Boolean).join(' ');
      }
    }
    if (p.organizationId) {
      const orgRes = await firstValueFrom(this.orgService.getOrganization(p.organizationId));
      if (orgRes.success && orgRes.data) {
        orgName = orgRes.data.shortName;
      }
    }

    // Подстановка данных КП в блоки
    blocks = this.fillPlaceholders(blocks, p, clientName, orgName);

    this.previewDialog()?.open(
      `${templateName} — ${p.number}`,
      'quotation',
      blocks,
      [],
      1,
    );
  }

  /** Заменяет плейсхолдеры {{...}} в блоках и заполняет табличные блоки данными позиций КП */
  private fillPlaceholders(blocks: DocBlock[], cp: CommercialProposal, clientName: string, orgName: string): DocBlock[] {
    const date = new Date(cp.createdAt).toLocaleDateString('ru-RU');
    const total = cp.totalAmount.toLocaleString('ru-RU') + ' ₽';
    const itemsText = cp.items.map((it, i) =>
      `${i + 1}. ${it.productName} (${it.productSku}) — ${it.quantity} ${it.productUnit} × ${it.unitPrice.toLocaleString('ru-RU')} ₽ = ${it.total.toLocaleString('ru-RU')} ₽`
    ).join('\n');

    const map: Record<string, string> = {
      '{{number}}': cp.number,
      '{{date}}': date,
      '{{total}}': total,
      '{{items}}': itemsText,
      '{{notes}}': cp.notes || '',
      '{{client.name}}': clientName || 'Клиент',
      '{{org.shortName}}': orgName || 'Организация',
    };

    const replace = (text?: string) => {
      if (!text) return text;
      let result = text;
      for (const [key, value] of Object.entries(map)) {
        result = result.replaceAll(key, value);
      }
      return result;
    };

    // Формируем инлайн-строки из позиций КП (для табличных блоков)
    const inlineRows: Record<string, unknown>[] = cp.items.map(it => ({
      name: it.productName,
      productName: it.productName,
      sku: it.productSku,
      productSku: it.productSku,
      price: it.unitPrice,
      unitPrice: it.unitPrice,
      quantity: it.quantity,
      unit: it.productUnit,
      productUnit: it.productUnit,
      total: it.total,
      totalAmount: it.total,
      markupPercent: it.markupPercent,
    }));

    const totalQty = cp.items.reduce((s, it) => s + it.quantity, 0);
    const avgPrice = cp.items.length > 0
      ? Math.round((cp.items.reduce((s, it) => s + it.unitPrice, 0) / cp.items.length) * 100) / 100
      : 0;

    // Итоги по колонкам
    const summaries: Record<string, number> = {
      quantity: totalQty,
      total: cp.totalAmount,
      totalAmount: cp.totalAmount,
      price: avgPrice,
    };

    // Footer-строки
    const footerRows: { label: string; value: string }[] = [
      { label: 'Итого:', value: total },
    ];

    return blocks.map(b => {
      // Табличный блок — заполняем инлайн-данными из позиций КП
      if (b.type === 'table') {
        return {
          ...b,
          _inlineRows: inlineRows,
          _columnSummaries: summaries,
          _footerRows: footerRows,
        };
      }
      return {
        ...b,
        content: replace(b.content),
        columns: b.columns?.map(c => ({ ...c, content: replace(c.content) || c.content })),
      };
    });
  }

  onEditRow(row: unknown) {
    const p = row as CommercialProposal;
    this.router.navigate(['/sales/proposals', p.id, 'edit']);
  }

  async onStatusChange(event: { icon: string; row: unknown }) {
    const p = event.row as CommercialProposal;

    // Дублировать КП
    if (event.icon === 'copy') {
      KpConfirmDialogComponent.confirm(this.confirmationService, {
        header: 'Дублирование КП',
        message: `Создать копию КП «${p.number}»? Позиции будут скопированы в новый черновик.`,
        acceptLabel: 'Дублировать',
        rejectLabel: 'Отмена',
        accept: async () => {
          const itemsCopy = p.items.map(i => ({ ...i, id: generateId() }));
          const res = await firstValueFrom(this.proposalService.createWithItems(
            {
              organizationId: p.organizationId,
              clientId: p.clientId,
              templateId: p.templateId,
              status: 'draft',
              notes: p.notes ? `${p.notes} (копия)` : `Копия ${p.number}`,
            },
            itemsCopy,
          ));
          if (res.success) {
            this.notification.success(`КП «${res.data!.number}» создан как копия «${p.number}»`);
            this.load();
          } else {
            this.notification.error(res.message || 'Ошибка дублирования');
          }
        },
      });
      return;
    }

    // Создать договор из КП
    if (event.icon === 'file-signature') {
      KpConfirmDialogComponent.confirm(this.confirmationService, {
        header: 'Создание договора',
        message: `Создать договор на основе КП «${p.number}»? Позиции будут скопированы без цен.`,
        acceptLabel: 'Создать договор',
        rejectLabel: 'Отмена',
        accept: async () => {
          const res = await firstValueFrom(this.contractService.createFromProposal({
            organizationId: p.organizationId,
            clientId: p.clientId,
            status: 'draft',
            notes: `На основе КП ${p.number}`,
          }, p));
          if (res.success) {
            this.notification.success(`Договор «${res.data.number}» создан на основе КП «${p.number}»`);
            this.load();
          } else {
            this.notification.error(res.message || 'Ошибка создания договора');
          }
        },
      });
      return;
    }

    const statusMap: Record<string, { status: ProposalStatus; label: string }> = {
      send: { status: 'sent', label: 'Отправлено' },
      'thumbs-up': { status: 'approved', label: 'Согласовано' },
      'thumbs-down': { status: 'rejected', label: 'Отклонено' },
    };
    const target = statusMap[event.icon];
    if (!target) return;

    KpConfirmDialogComponent.confirm(this.confirmationService, {
      header: 'Смена статуса КП',
      message: `Вы уверены, что хотите изменить статус «${p.number}» на «${target.label}»?`,
      acceptLabel: 'Подтвердить',
      rejectLabel: 'Отмена',
      accept: async () => {
        const res = await firstValueFrom(this.proposalService.changeStatus(p.id, target.status));
        if (res.success) {
          this.notification.success(`КП «${p.number}» — ${target.label}`);
          this.load();
        } else {
          this.notification.error(res.message || 'Ошибка смены статуса');
        }
      },
    });
  }

  onDelete(row: unknown) {
    const p = row as ProposalRow;
    KpConfirmDialogComponent.confirm(this.confirmationService, {
      header: 'Удаление КП',
      message: `Вы уверены, что хотите удалить «${p.number}» (${p.statusLabel})?`,
      acceptLabel: 'Удалить',
      rejectLabel: 'Отмена',
      accept: async () => {
        const res = await firstValueFrom(this.proposalService.deleteProposal(p.id));
        if (res.success) {
          this.notification.success('КП удалено');
          this.load();
        } else {
          this.notification.error(res.message || 'Ошибка удаления');
        }
      },
    });
  }
}
