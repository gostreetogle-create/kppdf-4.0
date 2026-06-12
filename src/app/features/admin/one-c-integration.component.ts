import { Component, inject, signal, OnInit, ChangeDetectionStrategy, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TooltipModule } from 'primeng/tooltip';
import { KpCardComponent } from '../../shared/ui/kp-card.component';
import { KpButtonComponent } from '../../shared/ui/kp-button.component';
import { KpInputComponent } from '../../shared/ui/kp-input.component';
import { KpSelectComponent, SelectOption } from '../../shared/ui/kp-select.component';
import { KpToggleComponent } from '../../shared/ui/kp-toggle.component';
import { KpBadgeComponent } from '../../shared/ui/kp-badge.component';
import { OneCService } from '../../core/one-c.service';
import { PageTitleService } from '../../core/page-title.service';
import { MessageService } from 'primeng/api';
import { catchError, of } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import type { OneCSettings } from '../../../../shared/types/one-c';

@Component({
  selector: 'app-one-c-integration',
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterModule,
    TooltipModule,
    KpCardComponent, KpButtonComponent, KpInputComponent,
    KpSelectComponent, KpToggleComponent, KpBadgeComponent,
  ],
  templateUrl: './one-c-integration.component.html',
  styleUrls: ['./one-c-integration.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OneCIntegrationComponent implements OnInit {
  private oneCService = inject(OneCService);
  private pageTitle = inject(PageTitleService);
  private messageService = inject(MessageService);
  private destroyRef = inject(DestroyRef);

  settings = signal<OneCSettings | null>(null);
  loading = signal(true);
  saving = signal(false);
  syncing = signal(false);

  syncDirection = signal<'import' | 'export'>('import');
  syncEntities = signal<string[]>(['counterparties', 'nomenclature', 'documents']);

  /** Форма: поля для [(ngModel)] */
  syncEnabled = false;
  syncBaseUrl = '';
  syncUsername = '';
  syncPassword = '';
  syncMode: 'http' | 'odata' | 'file' = 'http';
  syncInterval = 0;

  modeOptions: SelectOption[] = [
    { label: 'HTTP-сервис 1С (REST)', value: 'http' },
    { label: 'OData', value: 'odata' },
    { label: 'Файловый обмен', value: 'file' },
  ];

  entityOptions: { label: string; value: string }[] = [
    { label: 'Контрагенты', value: 'counterparties' },
    { label: 'Номенклатура', value: 'nomenclature' },
    { label: 'Документы', value: 'documents' },
    { label: 'Заказы', value: 'orders' },
  ];

  ngOnInit(): void {
    this.pageTitle.setTitle('Интеграция с 1С');
    this.loadSettings();
  }

  loadSettings(): void {
    this.loading.set(true);
    this.oneCService.getSettings().pipe(
      catchError(() => {
        this.messageService.add({ severity: 'error', summary: 'Ошибка', detail: 'Не удалось загрузить настройки' });
        this.loading.set(false);
        return of(null);
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(res => {
      if (res?.success && res.data) {
        const s = res.data;
        this.settings.set(s);
        this.syncEnabled = s.enabled;
        this.syncBaseUrl = s.baseUrl;
        this.syncUsername = s.username;
        this.syncPassword = '';
        this.syncMode = s.mode;
        this.syncInterval = s.syncIntervalMinutes;
      }
      this.loading.set(false);
    });
  }

  saveSettings(): void {
    this.saving.set(true);
    this.oneCService.updateSettings({
      enabled: this.syncEnabled,
      baseUrl: this.syncBaseUrl,
      username: this.syncUsername,
      password: this.syncPassword,
      mode: this.syncMode,
      syncIntervalMinutes: this.syncInterval,
    }).pipe(
      catchError(() => {
        this.messageService.add({ severity: 'error', summary: 'Ошибка', detail: 'Не удалось сохранить настройки' });
        this.saving.set(false);
        return of(null);
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(res => {
      if (res?.success) {
        this.settings.set(res.data);
        this.syncPassword = '';
        this.messageService.add({ severity: 'success', summary: 'Готово', detail: 'Настройки сохранены' });
      }
      this.saving.set(false);
    });
  }

  runSync(): void {
    this.syncing.set(true);
    this.oneCService.sync(this.syncDirection(), this.syncEntities()).pipe(
      catchError(() => {
        this.messageService.add({ severity: 'error', summary: 'Ошибка', detail: 'Синхронизация не удалась' });
        this.syncing.set(false);
        return of(null);
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(res => {
      if (res?.success) {
        const r = res.data;
        this.messageService.add({
          severity: 'success',
          summary: 'Синхронизация завершена',
          detail: `Обработано: ${r?.processed || 0}, ошибок: ${r?.errors || 0}`
        });
      }
      this.syncing.set(false);
    });
  }

  toggleEntity(entity: string): void {
    this.syncEntities.update(ents => {
      if (ents.includes(entity)) return ents.filter(e => e !== entity);
      return [...ents, entity];
    });
  }
}
