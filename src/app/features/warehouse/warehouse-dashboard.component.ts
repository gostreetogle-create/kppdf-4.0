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
  styleUrl: './warehouse-dashboard.component.scss',
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
