import { Component, inject, signal, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { MenuItem } from 'primeng/api';

import { KpCardComponent } from '../../shared/ui/kp-card.component';
import { KpButtonComponent } from '../../shared/ui/kp-button.component';
import { KpBreadcrumbComponent } from '../../shared/ui/kp-breadcrumb.component';
import { KpToastComponent } from '../../shared/ui/kp-toast.component';
import { WarehouseService } from '../../core/warehouse.service';
import { InventoryService } from '../../core/inventory.service';
import { NotificationService } from '../../core/notification.service';
import { AuthService } from '../../core/auth.service';
import type { Warehouse } from '../../../../shared/types/index.js';

interface WarehouseCard {
  warehouse: Warehouse;
  itemCount: number;
  totalQuantity: number;
  zones: string[];
}

@Component({
  selector: 'app-warehouse-dashboard',
  standalone: true,
  imports: [
    CommonModule, RouterLink,
    KpCardComponent, KpButtonComponent, KpBreadcrumbComponent, KpToastComponent,
  ],
  template: `
    <kp-toast />

    <div class="wh-dash">
      <kp-breadcrumb [items]="breadcrumbs" />

      <div class="wh-dash__header">
        <h1 class="wh-dash__title">📦 Склад</h1>
        <div class="wh-dash__header-actions">
          <kp-button
            label="+ Новый склад"
            lucideIcon="plus"
            routerLink="/warehouse/new"
          />
          <kp-button
            label="📦 Инвентарь"
            lucideIcon="box"
            routerLink="/warehouse/storage-items"
            severity="secondary"
          />
        </div>
      </div>

      @if (loading()) {
        <div class="wh-dash__loading">Загрузка складов...</div>
      } @else if (cards().length === 0) {
        <kp-card>
          <div class="wh-dash__empty">
            <p>Нет доступных складов.</p>
            <p>Создайте первый склад или обратитесь к администратору для настройки доступа.</p>
          </div>
        </kp-card>
      } @else {
        <div class="wh-dash__grid">
          @for (card of cards(); track card.warehouse.id) {
            <a
              class="wh-dash__card"
              [routerLink]="['/warehouse', card.warehouse.id]"
            >
              <div class="wh-dash__card-header">
                <span class="wh-dash__card-icon">🏭</span>
                <div class="wh-dash__card-info">
                  <h3 class="wh-dash__card-name">{{ card.warehouse.name }}</h3>
                  @if (card.warehouse.address) {
                    <span class="wh-dash__card-addr">{{ card.warehouse.address }}</span>
                  }
                </div>
                <span class="wh-dash__card-arrow">→</span>
              </div>

              <div class="wh-dash__card-stats">
                <div class="wh-dash__stat">
                  <span class="wh-dash__stat-value">{{ card.itemCount }}</span>
                  <span class="wh-dash__stat-label">позиций</span>
                </div>
                <div class="wh-dash__stat">
                  <span class="wh-dash__stat-value">{{ card.totalQuantity }}</span>
                  <span class="wh-dash__stat-label">единиц</span>
                </div>
                <div class="wh-dash__stat">
                  <span class="wh-dash__stat-value">{{ card.zones.length }}</span>
                  <span class="wh-dash__stat-label">зон</span>
                </div>
              </div>

              @if (card.zones.length > 0) {
                <div class="wh-dash__card-zones">
                  @for (zone of card.zones; track zone) {
                    <span class="wh-dash__zone-tag">{{ zone }}</span>
                  }
                </div>
              }
            </a>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    :host { display: block; }
    .wh-dash { max-width: 1100px; margin: 0 auto; padding: var(--space-6); }
    .wh-dash__header {
      display: flex; align-items: center; justify-content: space-between;
      flex-wrap: wrap; gap: var(--space-3); margin: var(--space-4) 0;
    }
    .wh-dash__title { font-size: var(--font-size-xl); font-weight: var(--font-weight-bold); color: var(--color-text); margin: 0; }
    .wh-dash__header-actions { display: flex; gap: var(--space-3); }
    .wh-dash__loading, .wh-dash__empty { text-align: center; padding: var(--space-8); color: var(--color-text-secondary); }

    .wh-dash__grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: var(--space-4);
    }

    .wh-dash__card {
      display: block;
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      padding: var(--space-5);
      text-decoration: none;
      transition: all 0.2s ease;
      cursor: pointer;
    }
    .wh-dash__card:hover {
      border-color: var(--color-primary);
      box-shadow: var(--shadow-md);
      transform: translateY(-2px);
    }

    .wh-dash__card-header {
      display: flex; align-items: flex-start; gap: var(--space-3);
      margin-bottom: var(--space-4);
    }
    .wh-dash__card-icon { font-size: 2rem; line-height: 1; }
    .wh-dash__card-info { flex: 1; min-width: 0; }
    .wh-dash__card-name { font-size: var(--font-size-base); font-weight: 700; color: var(--color-text); margin: 0; }
    .wh-dash__card-addr { font-size: var(--font-size-xs); color: var(--color-text-secondary); }
    .wh-dash__card-arrow { font-size: 1.25rem; color: var(--color-text-secondary); opacity: 0.5; }

    .wh-dash__card-stats {
      display: flex; gap: var(--space-4); margin-bottom: var(--space-3);
    }
    .wh-dash__stat { text-align: center; flex: 1; }
    .wh-dash__stat-value {
      display: block; font-size: 1.5rem; font-weight: 800; color: var(--color-primary);
    }
    .wh-dash__stat-label {
      display: block; font-size: var(--font-size-xs); color: var(--color-text-secondary);
    }

    .wh-dash__card-zones { display: flex; flex-wrap: wrap; gap: var(--space-2); }
    .wh-dash__zone-tag {
      padding: 2px 10px; border-radius: 999px;
      background: var(--color-bg-secondary);
      border: 1px solid var(--color-border);
      font-size: var(--font-size-xs); color: var(--color-text-secondary);
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WarehouseDashboardComponent implements OnInit {
  private router = inject(Router);
  private warehouseService = inject(WarehouseService);
  private inventoryService = inject(InventoryService);
  private notification = inject(NotificationService);
  private authService = inject(AuthService);

  loading = signal(true);
  cards = signal<WarehouseCard[]>([]);

  breadcrumbs: MenuItem[] = [
    { label: 'Склад' },
    { label: 'Обзор' },
  ];

  async ngOnInit() {
    this.loading.set(true);
    try {
      const role = this.authService.currentUser()?.role || '';
      const warehouses = await this.warehouseService.getWarehousesByRole(role);

      if (warehouses.length === 1) {
        this.router.navigate(['/warehouse', warehouses[0].id], { replaceUrl: true });
        return;
      }

      const cards: WarehouseCard[] = [];
      for (const wh of warehouses) {
        const invRes = await firstValueFrom(this.inventoryService.getItems(wh.id));
        const items = invRes.data;
        cards.push({
          warehouse: wh,
          itemCount: items.length,
          totalQuantity: items.reduce((s, i) => s + i.quantity, 0),
          zones: wh.zoneNames,
        });
      }
      this.cards.set(cards);
    } finally {
      this.loading.set(false);
    }
  }
}
