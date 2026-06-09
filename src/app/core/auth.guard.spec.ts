import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Component } from '@angular/core';
import { authGuard } from './auth.guard';

@Component({ template: '' })
class DummyComponent {}

/** Browser-compatible base64 encode */
function safeBtoa(str: string): string {
  const bytes = new Uint8Array(str.length);
  for (let i = 0; i < str.length; i++) {
    bytes[i] = str.charCodeAt(i) & 0xff;
  }
  return Buffer.from(bytes).toString('base64');
}

function makeToken(payload: Record<string, unknown>): string {
  return `header.${safeBtoa(JSON.stringify(payload))}.sign`;
}

const mockUser = {
  id: 'user-1',
  username: 'admin',
  displayName: 'Administrator',
  role: 'admin' as const,
  permissions: ['*'],
};

describe('authGuard', () => {

  const mockRoute = {} as ActivatedRouteSnapshot;
  const mockState = {} as RouterStateSnapshot;

  beforeEach(() => {
    localStorage.clear();
  });

  function setup(token: string | null) {
    if (token) {
      localStorage.setItem('accessToken', token);
    }
    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          { path: 'login', component: DummyComponent },
          { path: 'dashboard', component: DummyComponent },
        ]),
      ],
    });
  }

  /** Запустить guard в injection-контексте TestBed */
  function runGuard() {
    return TestBed.runInInjectionContext(() => authGuard(mockRoute, mockState));
  }

  describe('авторизованный пользователь', () => {
    it('возвращает true при валидном неистёкшем токене', () => {
      const token = makeToken({ ...mockUser, exp: Math.floor(Date.now() / 1000) + 3600 });
      setup(token);

      const result = runGuard();
      expect(result).toBe(true);
    });

    it('возвращает true при токене без поля exp', () => {
      const token = makeToken(mockUser);
      setup(token);

      const result = runGuard();
      expect(result).toBe(true);
    });
  });

  describe('неавторизованный пользователь', () => {
    it('возвращает UrlTree /login при отсутствии токена', () => {
      setup(null);

      const result = runGuard();
      expect(result).not.toBe(true);
      expect(result).toBeInstanceOf(UrlTree);
      expect(result?.toString()).toBe('/login');
    });

    it('возвращает UrlTree /login при просроченном токене', () => {
      const token = makeToken({ ...mockUser, exp: Math.floor(Date.now() / 1000) - 3600 });
      setup(token);

      const result = runGuard();
      expect(result).not.toBe(true);
      expect(result).toBeInstanceOf(UrlTree);
      expect(result?.toString()).toBe('/login');
    });
  });
});
