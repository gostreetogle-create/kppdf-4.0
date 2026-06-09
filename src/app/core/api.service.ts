import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, timeout, retry } from 'rxjs';
import type { ApiResponse, PaginatedResponse } from '../../../shared/types/index.js';
import { API_URL } from './api-url.token.js';

const DEFAULT_TIMEOUT = 30_000;
const DEFAULT_RETRIES = 1;

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  private apiUrl = inject(API_URL);

  get<T>(path: string, params?: Record<string, string | number | boolean>): Observable<ApiResponse<T>> {
    let httpParams = new HttpParams();
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        httpParams = httpParams.set(key, String(value));
      }
    }
    return this.http.get<ApiResponse<T>>(`${this.apiUrl}${path}`, { params: httpParams }).pipe(
      timeout(DEFAULT_TIMEOUT),
      retry(DEFAULT_RETRIES)
    );
  }

  getById<T>(path: string, id: string): Observable<ApiResponse<T>> {
    return this.http.get<ApiResponse<T>>(`${this.apiUrl}${path}/${id}`).pipe(
      timeout(DEFAULT_TIMEOUT),
      retry(DEFAULT_RETRIES)
    );
  }

  post<T>(path: string, body: unknown): Observable<ApiResponse<T>> {
    return this.http.post<ApiResponse<T>>(`${this.apiUrl}${path}`, body).pipe(
      timeout(DEFAULT_TIMEOUT)
    );
  }

  put<T>(path: string, id: string, body: unknown): Observable<ApiResponse<T>> {
    return this.http.put<ApiResponse<T>>(`${this.apiUrl}${path}/${id}`, body).pipe(
      timeout(DEFAULT_TIMEOUT)
    );
  }

  delete<T>(path: string, id: string): Observable<ApiResponse<T>> {
    return this.http.delete<ApiResponse<T>>(`${this.apiUrl}${path}/${id}`).pipe(
      timeout(DEFAULT_TIMEOUT)
    );
  }

  patch<T>(path: string, body: unknown): Observable<ApiResponse<T>> {
    return this.http.patch<ApiResponse<T>>(`${this.apiUrl}${path}`, body).pipe(
      timeout(DEFAULT_TIMEOUT)
    );
  }

  getPaginated<T>(
    path: string,
    page = 1,
    limit = 20,
    params?: Record<string, string | number | boolean>
  ): Observable<PaginatedResponse<T>> {
    let httpParams = new HttpParams().set('page', String(page)).set('limit', String(limit));
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        httpParams = httpParams.set(key, String(value));
      }
    }
    return this.http.get<PaginatedResponse<T>>(`${this.apiUrl}${path}`, { params: httpParams }).pipe(
      timeout(DEFAULT_TIMEOUT),
      retry(DEFAULT_RETRIES)
    );
  }
}
