import { Component, inject, signal, computed, viewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { firstValueFrom } from 'rxjs';

import { KpButtonComponent } from '../../shared/ui/kp-button.component';
import { KpBreadcrumbComponent } from '../../shared/ui/kp-breadcrumb.component';
import { KpCardComponent } from '../../shared/ui/kp-card.component';
import { KpToastComponent } from '../../shared/ui/kp-toast.component';
import { KpDocCanvasComponent } from '../../shared/ui/kp-doc-canvas.component';
import { KpDocPreviewDialogComponent } from '../../shared/ui/kp-doc-preview-dialog.component';
import { LucideDynamicIcon } from '@lucide/angular';
import { NotificationService } from '../../core/notification.service';
import { CommercialProposalService } from '../../core/commercial-proposal.service';
import { ProposalDocBuilderService } from '../../core/proposal-doc-builder.service';
import { OrganizationService } from '../../core/organization.service';
import { ClientService } from '../../core/client.service';
import { DocumentTemplateService } from '../../core/document-template.service';
import type { CommercialProposal, Organization, Client, DocumentTemplate, DocBlock } from '../../../../shared/types/index.js';

const STATUS_LABELS: Record<string, string> = {
  draft: 'Черновик',
  sent: 'Отправлено',
  approved: 'Согласовано',
  rejected: 'Отклонено',
};

@Component({
  selector: 'app-proposal-view',
  standalone: true,
  imports: [
    CommonModule,
    KpButtonComponent, KpBreadcrumbComponent, KpCardComponent,
    KpToastComponent, KpDocCanvasComponent, KpDocPreviewDialogComponent,
    LucideDynamicIcon,
  ],
  template: `
    <kp-toast />

    <div class="cp-view">
      <kp-breadcrumb [items]="breadcrumbs()" />

      <div class="cp-view__header">
        <h1 class="cp-view__title">КП {{ proposal()?.number }}</h1>
        <div class="cp-view__header-actions">
          <kp-button
            label="Скачать PDF"
            lucideIcon="download"
            severity="success"
            [disabled]="docBlocks().length === 0"
            (buttonClick)="openPdfPreview()"
          />
          <kp-button
            label="Редактировать"
            lucideIcon="pencil"
            (buttonClick)="edit()"
          />
          <kp-button
            label="К списку"
            lucideIcon="arrow-left"
            severity="secondary"
            (buttonClick)="back()"
          />
        </div>
      </div>

      <kp-card>
        <!-- Информация о КП -->
        <div class="cp-view__info">
          <div class="cp-view__info-row">
            <span class="cp-view__label">Статус:</span>
            <span class="cp-view__value cp-view__status" [class]="'cp-view__status--' + (proposal()?.status ?? 'draft')">
              {{ statusLabel() }}
            </span>
          </div>
          <div class="cp-view__info-row">
            <span class="cp-view__label">Организация:</span>
            <span class="cp-view__value">{{ orgName() }}</span>
          </div>
          <div class="cp-view__info-row">
            <span class="cp-view__label">Клиент:</span>
            <span class="cp-view__value">{{ clientName() }}</span>
          </div>
          <div class="cp-view__info-row">
            <span class="cp-view__label">Позиций:</span>
            <span class="cp-view__value">{{ itemCount() }} шт.</span>
          </div>
          <div class="cp-view__info-row">
            <span class="cp-view__label">Сумма:</span>
            <span class="cp-view__value cp-view__total">
              {{ (proposal()?.totalAmount ?? 0).toLocaleString('ru-RU') }} ₽
            </span>
          </div>
          @if (proposal()?.notes) {
            <div class="cp-view__info-row">
              <span class="cp-view__label">Примечания:</span>
              <span class="cp-view__value cp-view__notes">{{ proposal()?.notes }}</span>
            </div>
          }
          <div class="cp-view__info-row">
            <span class="cp-view__label">Создан:</span>
            <span class="cp-view__value">{{ createdAt() }}</span>
          </div>
          <div class="cp-view__info-row">
            <span class="cp-view__label">Обновлён:</span>
            <span class="cp-view__value">{{ updatedAt() }}</span>
          </div>
        </div>
      </kp-card>

      <!-- A4 Preview -->
      @if (itemCount() > 0) {
        <div class="cp-view__preview">
          <h3 class="cp-view__section-title">Предпросмотр</h3>
          <div class="cp-view__canvas">
            <kp-doc-canvas
              [blocks]="docBlocks()"
              [editable]="false"
              [backgroundImages]="backgroundImages()"
            />
          </div>
        </div>
      }
    </div>

    <kp-doc-preview-dialog />
  `,
  styleUrl: './proposal-view.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProposalViewComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private proposalService = inject(CommercialProposalService);
  private docBuilder = inject(ProposalDocBuilderService);
  private orgService = inject(OrganizationService);
  private clientService = inject(ClientService);
  private templateService = inject(DocumentTemplateService);
  private notification = inject(NotificationService);

  previewDialog = viewChild(KpDocPreviewDialogComponent);

  proposal = signal<CommercialProposal | null>(null);
  organizations = signal<Organization[]>([]);
  clients = signal<Client[]>([]);
  templates = signal<DocumentTemplate[]>([]);
  loading = signal(true);

  statusLabel = computed(() => STATUS_LABELS[this.proposal()?.status ?? 'draft']);
  itemCount = computed(() => this.proposal()?.items.length ?? 0);

  orgName = computed(() => {
    const orgId = this.proposal()?.organizationId;
    if (!orgId) return '—';
    const org = this.organizations().find(o => o.id === orgId);
    return org ? (org.shortName || org.name) : orgId;
  });

  clientName = computed(() => {
    const clientId = this.proposal()?.clientId;
    if (!clientId) return '—';
    const client = this.clients().find(c => c.id === clientId);
    return client ? [client.lastName, client.firstName, client.patronymic].filter(Boolean).join(' ') : clientId;
  });

  createdAt = computed(() => {
    const cp = this.proposal();
    return cp ? new Date(cp.createdAt).toLocaleString('ru-RU') : '';
  });

  updatedAt = computed(() => {
    const cp = this.proposal();
    return cp ? new Date(cp.updatedAt).toLocaleString('ru-RU') : '';
  });

  templateId = computed(() => this.proposal()?.templateId ?? '');

  docBlocks = computed<DocBlock[]>(() => {
    const cp = this.proposal();
    if (!cp || cp.items.length === 0) return [];
    return this.docBuilder.buildDocBlocks({
      templateId: this.templateId(),
      templates: this.templates(),
      items: cp.items,
      organizationId: cp.organizationId ?? '',
      organizations: this.organizations(),
      clientId: cp.clientId ?? '',
      clients: this.clients(),
      grandTotal: cp.totalAmount,
      discountPercent: 0,
      discountAmount: 0,
      totalBeforeDiscount: cp.totalAmount,
      vatRate: this.docBuilder.getVatRate(cp.organizationId ?? '', this.organizations()),
      vatAmount: 0,
      clientMarkup: 0,
      itemType: 'proposal',
    });
  });

  backgroundImages = computed(() => {
    const bg = this.docBuilder.getBackgroundImage(this.templateId(), this.templates());
    return bg ? [bg] : [];
  });

  breadcrumbs = computed<MenuItem[]>(() => {
    const cp = this.proposal();
    return [
      { label: 'Продажи' },
      { label: 'Коммерческие предложения', routerLink: '/sales/proposals' },
      { label: cp?.number ?? 'Просмотр КП' },
    ];
  });

  async ngOnInit() {
    this.loading.set(true);
    try {
      const id = this.route.snapshot.paramMap.get('id');
      if (!id) {
        this.notification.error('ID КП не указан');
        this.router.navigate(['/sales/proposals']);
        return;
      }

      const [cpRes, orgRes, clientRes, tmplRes] = await Promise.all([
        firstValueFrom(this.proposalService.getProposal(id)),
        firstValueFrom(this.orgService.getAll()),
        firstValueFrom(this.clientService.getClients()),
        firstValueFrom(this.templateService.getTemplates()),
      ]);

      if (!cpRes.success || !cpRes.data) {
        this.notification.error('КП не найдено');
        this.router.navigate(['/sales/proposals']);
        return;
      }

      this.proposal.set(cpRes.data);
      if (orgRes.success) this.organizations.set(orgRes.data);
      if (clientRes.success) this.clients.set(clientRes.data.filter(c => c.isActive));
      if (tmplRes.success) this.templates.set(tmplRes.data.filter(t => t.docType === 'quotation'));
    } finally {
      this.loading.set(false);
    }
  }

  openPdfPreview() {
    const blocks = this.docBlocks();
    const tmplId = this.templateId();
    const tmpl = tmplId ? this.templates().find(t => t.id === tmplId) : null;
    this.previewDialog()?.open(
      tmpl?.name || 'Коммерческое предложение',
      'quotation',
      blocks,
      tmpl?.backgroundImages || [],
      tmpl?.backgroundOpacity ?? 1,
    );
  }

  edit() {
    const id = this.proposal()?.id;
    if (id) this.router.navigate(['/sales/proposals', id, 'edit']);
  }

  back() {
    this.router.navigate(['/sales/proposals']);
  }
}
