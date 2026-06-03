import { Component, inject, signal, ChangeDetectionStrategy, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { KpInputComponent } from '../../shared/ui/kp-input.component';
import { KpButtonComponent } from '../../shared/ui/kp-button.component';
import { KpToastComponent } from '../../shared/ui/kp-toast.component';
import { NotificationService } from '../../core/notification.service';

interface LoginErrors {
  username?: string;
  password?: string;
  general?: string;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, KpInputComponent, KpButtonComponent, KpToastComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <kp-toast />
    <div class="login">
      <div class="login__bg"></div>
      <div class="login__card">
        <div class="login__header">
          <div class="login__logo">
            <i class="pi pi-bolt"></i>
          </div>
          <h1 class="login__title">Project Core</h1>
          <p class="login__subtitle">Вход в систему</p>
        </div>

        <form (ngSubmit)="login()" class="login__form">
          <div class="login__field">
            <kp-input
              label="Имя пользователя"
              [type]="'text'"
              placeholder="Введите логин"
              [(ngModel)]="username"
              name="username"
              [error]="errors().username ?? ''"
            />
          </div>

          <div class="login__field">
            <kp-input
              label="Пароль"
              [type]="'password'"
              placeholder="Введите пароль"
              [(ngModel)]="password"
              name="password"
              [error]="errors().password ?? ''"
            />
          </div>

          @if (errors().general) {
            <div class="login__error">{{ errors().general }}</div>
          }

          <kp-button
            [label]="loading() ? 'Вход...' : 'Войти'"
            [loading]="loading()"
            styleClass="login__submit"
            (buttonClick)="login()"
          />
        </form>

        <div class="login__footer">
          <span class="login__hint">admin / admin123</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      background: var(--color-bg);
      padding: var(--space-4);
      position: relative;
      overflow: hidden;
    }

    .login__bg {
      position: absolute;
      inset: 0;
      background:
        radial-gradient(ellipse at 20% 50%, rgba(37, 99, 235, 0.08) 0%, transparent 50%),
        radial-gradient(ellipse at 80% 20%, rgba(124, 58, 237, 0.06) 0%, transparent 50%),
        radial-gradient(ellipse at 50% 80%, rgba(37, 99, 235, 0.04) 0%, transparent 50%);
      pointer-events: none;
    }

    .login__card {
      position: relative;
      background: var(--color-surface);
      border-radius: var(--radius-xl);
      box-shadow: var(--shadow-xl);
      padding: var(--space-10);
      width: 100%;
      max-width: 400px;
      border: 1px solid var(--color-border-light);
    }

    .login__header {
      text-align: center;
      margin-bottom: var(--space-8);
    }

    .login__logo {
      width: 56px;
      height: 56px;
      border-radius: var(--radius-lg);
      background: linear-gradient(135deg, #3b82f6, #2563eb);
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto var(--space-4);

      i {
        font-size: 1.5rem;
        color: #ffffff;
      }
    }

    .login__title {
      font-size: var(--font-size-2xl);
      font-weight: var(--font-weight-bold);
      color: var(--color-text);
      margin: 0 0 var(--space-1);
      letter-spacing: -0.02em;
    }

    .login__subtitle {
      color: var(--color-text-muted);
      margin: 0;
      font-size: var(--font-size-sm);
    }

    .login__form {
      display: flex;
      flex-direction: column;
      gap: var(--space-4);
    }

    .login__field {
      display: flex;
      flex-direction: column;
    }

    .login__submit {
      width: 100%;
      margin-top: var(--space-2);
    }

    .login__error {
      background: var(--color-error-bg);
      color: var(--color-error);
      padding: var(--space-3) var(--space-4);
      border-radius: var(--radius-md);
      font-size: var(--font-size-sm);
      text-align: center;
      border: 1px solid rgba(220, 38, 38, 0.15);
    }

    .login__footer {
      margin-top: var(--space-6);
      padding-top: var(--space-4);
      border-top: 1px solid var(--color-border-light);
      text-align: center;
    }

    .login__hint {
      font-size: var(--font-size-xs);
      color: var(--color-text-muted);
      background: var(--color-surface-alt);
      padding: var(--space-1) var(--space-3);
      border-radius: var(--radius-sm);
      font-family: 'Consolas', 'Courier New', monospace;
    }
  `]
})
export class LoginComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  private notify = inject(NotificationService);
  private destroyRef = inject(DestroyRef);

  username = '';
  password = '';
  loading = signal(false);
  errors = signal<LoginErrors>({});

  login() {
    const errs: LoginErrors = {};
    if (!this.username.trim()) errs.username = 'Введите имя пользователя';
    if (!this.password.trim()) errs.password = 'Введите пароль';
    this.errors.set(errs);
    if (Object.keys(errs).length) return;

    this.loading.set(true);
    this.errors.set({});

    this.auth.login(this.username, this.password).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: () => {
        this.notify.success('Добро пожаловать!');
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.loading.set(false);
        const detail = err.error?.message || 'Неверный логин или пароль';
        this.errors.set({ general: detail });
        this.notify.error(detail);
      }
    });
  }
}
