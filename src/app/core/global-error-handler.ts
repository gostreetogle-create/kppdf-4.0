import { ErrorHandler, Injectable, inject, Injector } from '@angular/core';
import { NotificationService } from './notification.service';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  private injector = inject(Injector);

  handleError(error: unknown): void {
    const message = error instanceof Error ? error.message : 'Неизвестная ошибка';
    console.error('[GlobalErrorHandler]', error);

    // Lazy-inject NotificationService to avoid NG0200 circular dependency
    // (MessageService from PrimeNG triggers _StandaloneService during early bootstrap)
    try {
      const notify = this.injector.get(NotificationService);
      notify.error(`Что-то пошло не так: ${message}`);
    } catch (e) {
      console.warn('[GlobalErrorHandler] NotificationService unavailable:', e);
    }
  }
}
