import { Component, inject, signal, OnInit, ChangeDetectionStrategy, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TooltipModule } from 'primeng/tooltip';
import { KpCardComponent } from '../../shared/ui/kp-card.component';
import { KpBadgeComponent } from '../../shared/ui/kp-badge.component';
import { KpButtonComponent } from '../../shared/ui/kp-button.component';
import { MonitorService, MonitorData } from '../../core/monitor.service';
import { PageTitleService } from '../../core/page-title.service';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-monitor-dashboard',
  standalone: true,
  imports: [
    CommonModule, RouterModule,
    TooltipModule,
    KpCardComponent, KpBadgeComponent, KpButtonComponent,
  ],
  templateUrl: './monitor-dashboard.component.html',
  styleUrls: ['./monitor-dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MonitorDashboardComponent implements OnInit {
  private monitorService = inject(MonitorService);
  private pageTitle = inject(PageTitleService);

  data = signal<MonitorData | null>(null);
  error = signal<string | null>(null);
  loading = signal(true);
  lastRefresh = signal('');

  /** Состояние БД для стилизации */
  dbStatusBadge = computed(() => {
    const s = this.data()?.database?.status;
    if (s === 'connected') return { label: 'Подключена', severity: 'success' as const };
    if (s === 'connecting') return { label: 'Подключается', severity: 'warn' as const };
    return { label: s || '—', severity: 'danger' as const };
  });

  systemStatusBadge = computed(() => {
    const s = this.data()?.status;
    if (s === 'healthy') return { label: 'Здорова', severity: 'success' as const };
    return { label: 'Деградация', severity: 'warn' as const };
  });

  memoryPercent = computed(() => this.data()?.memory?.usedPercent ?? 0);
  memoryColor = computed(() => {
    const p = this.memoryPercent();
    if (p > 90) return 'var(--color-danger)';
    if (p > 70) return 'var(--color-warn)';
    return 'var(--color-success)';
  });

  ngOnInit(): void {
    this.pageTitle.setTitle('Мониторинг системы');
    this.refresh();
  }

  refresh(): void {
    this.loading.set(true);
    this.error.set(null);
    this.monitorService.getStatus().pipe(
      catchError(err => {
        this.error.set(err?.error?.message || err?.message || 'Ошибка получения данных');
        this.loading.set(false);
        return of(null);
      })
    ).subscribe(res => {
      if (res?.success && res.data) {
        this.data.set(res.data);
        this.lastRefresh.set(new Date().toLocaleTimeString('ru-RU'));
      }
      this.loading.set(false);
    });
  }
}
