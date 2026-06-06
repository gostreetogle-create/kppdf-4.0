import { Injectable, signal } from '@angular/core';
import { FEATURE_FLAGS } from '../../../shared/types/index.js';
import type { FeatureFlagDef } from '../../../shared/types/index.js';

const STORAGE_KEY = 'kppdf:featureFlags';

/**
 * Сервис флагов возможностей (Feature Flags).
 *
 * Позволяет включать/выключать новые функции без изменения кода.
 * Состояние хранится в localStorage и сохраняется между сессиями.
 *
 * Использование в компоненте:
 *   const flags = inject(FeatureFlagService);
 *   if (flags.isEnabled('placeholders')) { ... }
 */
@Injectable({ providedIn: 'root' })
export class FeatureFlagService {
  /** Список всех определённых флагов */
  readonly allFlags: FeatureFlagDef[] = FEATURE_FLAGS;

  /** Текущие значения флагов (сигнал — реактивно обновляет UI) */
  readonly flags = signal<Record<string, boolean>>(this.loadFlags());

  /**
   * Проверить, включён ли флаг.
   * Если флаг не найден — возвращает false.
   */
  isEnabled(key: string): boolean {
    return this.flags()[key] ?? false;
  }

  /**
   * Включить или выключить флаг.
   * Изменение сразу сохраняется в localStorage.
   */
  toggle(key: string, enabled: boolean): void {
    this.flags.update(current => {
      const updated = { ...current, [key]: enabled };
      this.saveFlags(updated);
      return updated;
    });
  }

  /**
   * Сбросить все флаги к значениям по умолчанию.
   */
  resetAll(): void {
    localStorage.removeItem(STORAGE_KEY);
    this.flags.set(this.loadFlags());
  }

  /** Загрузить флаги: сначала из localStorage, потом дополняется дефолтными */
  private loadFlags(): Record<string, boolean> {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const saved = raw ? JSON.parse(raw) : {};
      // Объединяем: всё, что есть в localStorage + дефолтные значения для новых флагов
      const result: Record<string, boolean> = {};
      for (const flag of FEATURE_FLAGS) {
        result[flag.key] = saved[flag.key] ?? flag.enabledByDefault;
      }
      return result;
    } catch {
      return this.getDefaults();
    }
  }

  /** Сохранить в localStorage */
  private saveFlags(values: Record<string, boolean>): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(values));
    } catch {
      // localStorage может быть недоступен (например, в SSR)
    }
  }

  /** Дефолтные значения на случай ошибки */
  private getDefaults(): Record<string, boolean> {
    const result: Record<string, boolean> = {};
    for (const flag of FEATURE_FLAGS) {
      result[flag.key] = flag.enabledByDefault;
    }
    return result;
  }
}
