import { Injectable } from '@angular/core';
import { BaseCrudService } from './crud-factory.js';
import type { StatusWorkflow } from '../../../shared/types/index.js';

const SEED_WORKFLOWS: StatusWorkflow[] = [
  { id: 'wf-proposal', entityType: 'proposal', name: 'Коммерческие предложения', statuses: ['draft', 'sent', 'approved', 'rejected'], transitions: [{ from: 'draft', to: 'sent', label: 'Отправить', allowedRoleIds: ['sales-manager'] }, { from: 'sent', to: 'approved', label: 'Согласовать', allowedRoleIds: ['sales-manager', 'director'] }, { from: 'sent', to: 'rejected', label: 'Отклонить', allowedRoleIds: ['sales-manager'] }], createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z' },
  { id: 'wf-contract', entityType: 'contract', name: 'Договоры', statuses: ['draft', 'signed', 'active', 'closed'], transitions: [{ from: 'draft', to: 'signed', label: 'Подписать', allowedRoleIds: ['director'] }, { from: 'signed', to: 'active', label: 'Активировать', allowedRoleIds: ['sales-manager'] }, { from: 'active', to: 'closed', label: 'Закрыть', allowedRoleIds: ['accountant', 'director'] }], createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z' },
  { id: 'wf-production', entityType: 'production_order', name: 'Производственные заказы', statuses: ['accepted', 'in_design', 'in_production', 'ready', 'shipped', 'closed'], transitions: [{ from: 'accepted', to: 'in_design', label: 'В проектирование', allowedRoleIds: ['production-chief'] }, { from: 'in_design', to: 'in_production', label: 'В производство', allowedRoleIds: ['production-chief'] }, { from: 'in_production', to: 'ready', label: 'Готов', allowedRoleIds: ['production-chief', 'foreman'] }, { from: 'ready', to: 'shipped', label: 'Отгрузить', allowedRoleIds: ['storekeeper'] }, { from: 'shipped', to: 'closed', label: 'Закрыть', allowedRoleIds: ['accountant', 'director'] }], createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z' },
];

@Injectable({ providedIn: 'root' })
export class StatusWorkflowService extends BaseCrudService<StatusWorkflow> {
  constructor() {
    super();
    this.items = SEED_WORKFLOWS.map(w => ({ ...w, statuses: [...w.statuses], transitions: w.transitions.map(t => ({ ...t, allowedRoleIds: [...t.allowedRoleIds] })) }));
  }
}
