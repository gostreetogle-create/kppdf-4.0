import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../shared/types';
import type { OneCSettings, OneCExchangeResult } from '../../../shared/types/one-c';

@Injectable({ providedIn: 'root' })
export class OneCService {
  private http = inject(HttpClient);

  getSettings(): Observable<ApiResponse<OneCSettings>> {
    return this.http.get<ApiResponse<OneCSettings>>('/api/v1/one-c/settings');
  }

  updateSettings(settings: Partial<OneCSettings>): Observable<ApiResponse<OneCSettings>> {
    return this.http.put<ApiResponse<OneCSettings>>('/api/v1/one-c/settings', settings);
  }

  sync(direction: 'import' | 'export', entities: string[]): Observable<ApiResponse<OneCExchangeResult>> {
    return this.http.post<ApiResponse<OneCExchangeResult>>('/api/v1/one-c/sync', { direction, entities });
  }

  getSyncLog(limit = 50): Observable<ApiResponse<unknown[]>> {
    return this.http.get<ApiResponse<unknown[]>>(`/api/v1/one-c/sync-log?limit=${limit}`);
  }
}
