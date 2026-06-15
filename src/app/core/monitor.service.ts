import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import type { ApiResponse } from '../../../shared/types';
import { ApiService } from './api.service.js';

export interface MonitorData {
  status: 'healthy' | 'degraded';
  timestamp: string;
  environment: string;
  nodeVersion: string;
  platform: string;
  processUptime: string;
  processUptimeSeconds: number;
  systemUptime: string;
  memory: {
    total: string;
    free: string;
    used: string;
    usedPercent: number;
    processHeapUsed: string;
    processHeapTotal: string;
    processRSS: string;
  };
  cpu: {
    loadAvg1m: string;
    loadAvg5m: string;
    loadAvg15m: string;
    cpus: number;
  };
  database: {
    status: string;
    host: string;
    name: string;
    collections: number;
    totalDocuments: number;
    collectionList: { name: string; count: number }[];
  };
}

@Injectable({ providedIn: 'root' })
export class MonitorService {
  private api = inject(ApiService);

  getStatus(): Observable<ApiResponse<MonitorData>> {
    return this.api.get<MonitorData>('/monitor');
  }
}
