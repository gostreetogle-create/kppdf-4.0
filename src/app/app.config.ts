import { ApplicationConfig, ErrorHandler, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { providePrimeNG } from 'primeng/config';
import { MessageService, ConfirmationService } from 'primeng/api';
import {
  provideLucideIcons,
  LucidePencil, LucideTrash2, LucideEye, LucideCopy, LucideGripVertical,
  LucideDownload, LucidePrinter, LucideShoppingCart, LucideTag,
  LucideChevronUp, LucideChevronDown, LucideAlignLeft, LucideTable, LucideMinus,
  LucideArrowUpDown, LucideBox, LucideCheck, LucideSearch,
  LucideExternalLink, LucideTriangleAlert,
  LucideChevronLeft, LucideChevronRight, LucideSun, LucideMoon, LucideMenu, LucideBell,      LucidePalette, LucideBook, LucideBuilding, LucideCog, LucideFile,
  LucideEyeOff, LucideX, LucidePlus,
  LucideFlag, LucideRotateCcw,
  LucideSend,
  LucidePlay,
  LucideCamera, LucideStar, LucideLandmark,
  LucideTextAlignCenter, LucideTextAlignEnd,
  LucideBold, LucideItalic, LucideUnderline,
  LucideTrash, LucideFileText, LucideUserPlus,
  LucideListTodo, LucideBraces, LucideRotateCw,
  LucidePercent,
  LucideHouse, LucideMap, LucideFileSignature,
  LucideClipboard, LucideCheckSquare, LucideBarChart,
  LucideWrench, LucideMonitor, LucideUsers,
  LucideWarehouse, LucidePackage, LucideTruck,
  LucideUser, LucidePieChart, LucideLogOut, LucideSettings,
  LucidePackageCheck, LucideThumbsUp, LucideThumbsDown,
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
      LucideChevronLeft, LucideChevronRight, LucideSun, LucideMoon, LucideMenu, LucideBell,
      LucidePalette, LucideBook, LucideBuilding, LucideCog, LucideFile,
      LucideEyeOff, LucideX, LucidePlus,
      LucideDownload, LucidePrinter, LucideShoppingCart, LucideTag,
      LucideFlag, LucideRotateCcw,
      LucideSend,
      LucidePlay,
      LucideCamera, LucideStar, LucideLandmark,
      LucideTextAlignCenter, LucideTextAlignEnd,
      LucideBold, LucideItalic, LucideUnderline,
      LucideTrash, LucideFileText, LucideUserPlus,
      LucideListTodo, LucideBraces,
      LucideRotateCw,
      LucidePercent,
      LucideHouse, LucideMap, LucideFileSignature,
      LucideClipboard, LucideCheckSquare, LucideBarChart,
      LucideWrench, LucideMonitor, LucideUsers,
      LucideWarehouse, LucidePackage, LucideTruck,
      LucideUser, LucidePieChart, LucideLogOut, LucideSettings,
      LucidePackageCheck, LucideThumbsUp, LucideThumbsDown,
    ),
  ]
};
