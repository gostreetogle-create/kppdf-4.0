import { InjectionToken } from '@angular/core';

/** Базовый URL для API-запросов */
export const API_URL = new InjectionToken<string>('API_URL', {
  factory: () => '/api/v1',
});
