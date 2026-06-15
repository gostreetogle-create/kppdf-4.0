import { Injectable, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import type { LoginResponse, RefreshResponse } from '../../../shared/types/index.js';
import { ApiService } from './api.service.js';

interface User { id: string; username: string; displayName: string; role: string; permissions: string[]; }

interface JwtPayload {
  exp?: number;
  iat?: number;
  sub?: string;
  [key: string]: unknown;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private api = inject(ApiService);
  private router = inject(Router);
  private _currentUser = signal<User | null>(null);
  currentUser = this._currentUser.asReadonly();

  isAuthenticated = computed(() => this._currentUser() !== null);

  get accessToken(): string | null { return localStorage.getItem('accessToken'); }

  login(username: string, password: string) {
    return this.api.post<LoginResponse>(
      '/auth/login',
      { username, password },
      { withCredentials: true }
    ).pipe(
      tap(res => {
        localStorage.setItem('accessToken', res.data.accessToken);
        this._currentUser.set(res.data.user);
      })
    );
  }

  refreshToken() {
    return this.api.post<RefreshResponse>(
      '/auth/refresh',
      {},
      { withCredentials: true }
    ).pipe(
      tap(res => {
        localStorage.setItem('accessToken', res.data.accessToken);
      })
    );
  }

  constructor() {
    this.loadUserFromStorage();
  }

  logout() {
    this.api.post('/auth/logout', {}, { withCredentials: true }).subscribe({
      complete: () => this.finishLogout(),
      error: () => this.finishLogout(),
    });
  }

  private finishLogout() {
    localStorage.removeItem('accessToken');
    this._currentUser.set(null);
    this.router.navigate(['/login']);
  }

  /**
   * Загружает пользователя из JWT в localStorage.
   * Проверяет срок действия токена (exp) — если истёк, сбрасывает сессию.
   */
  loadUserFromStorage() {
    const token = this.accessToken;
    if (!token) return;

    try {
      const payload: JwtPayload = JSON.parse(atob(token.split('.')[1]));

      // Проверка срока действия
      if (payload.exp && payload.exp * 1000 < Date.now()) {
        this.finishLogout();
        return;
      }

      this._currentUser.set(payload as unknown as User);
    } catch {
      this.finishLogout();
    }
  }
}
