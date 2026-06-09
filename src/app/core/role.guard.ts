import { inject } from '@angular/core';
import { CanActivateChildFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

/**
 * Фабрика guard'а по ролям.
 * Принимает список ролей — если роль текущего пользователя совпадает с любой из них, доступ разрешён.
 * Если роль не подходит — редирект на /dashboard.
 *
 * @example
 * canActivateChild: [requireRole('admin')]
 * canActivateChild: [requireRole('admin', 'manager')]
 */
export function requireRole(...roles: string[]): CanActivateChildFn {
  return () => {
    const auth = inject(AuthService);
    const router = inject(Router);

    const user = auth.currentUser();
    if (user && roles.includes(user.role)) {
      return true;
    }

    return router.parseUrl('/dashboard');
  };
}
