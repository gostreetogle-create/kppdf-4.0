import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../shared/types';

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
  private http = inject(HttpClient);

  getStatus(): Observable<ApiResponse<MonitorData>> {
    return this.http.get<ApiResponse<MonitorData>>('/api/v1/monitor');
  }
}
