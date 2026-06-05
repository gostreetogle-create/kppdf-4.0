import { ApplicationConfig, ErrorHandler, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { providePrimeNG } from 'primeng/config';
import { MessageService, ConfirmationService } from 'primeng/api';
import {
  provideLucideIcons,
  LucidePencil, LucideTrash2, LucideEye, LucideCopy, LucideGripVertical,
  LucideChevronUp, LucideChevronDown, LucideAlignLeft, LucideTable, LucideMinus,
  LucideArrowUpDown, LucideBox, LucideCheck, LucideSearch,
  LucideExternalLink, LucideTriangleAlert,
} from '@lucide/angular';
import Aura from '@primeuix/themes/aura';

import { routes } from './app.routes';
import { GlobalErrorHandler } from './core/global-error-handler';
import { authInterceptor } from './core/auth.interceptor';
import { API_URL } from './core/api-url.token';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideAnimationsAsync(),
    MessageService,
    ConfirmationService,
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    providePrimeNG({
      theme: {
        preset: Aura,
        options: { darkModeSelector: '[data-theme="dark"]' }
      }
    }),
    { provide: API_URL, useValue: '/api/v1' },
    provideLucideIcons(
      LucidePencil, LucideTrash2, LucideEye, LucideCopy, LucideGripVertical,
      LucideChevronUp, LucideChevronDown, LucideAlignLeft, LucideTable, LucideMinus,
      LucideArrowUpDown, LucideBox, LucideCheck, LucideSearch,
      LucideExternalLink, LucideTriangleAlert,
    ),
  ]
};
