import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  isDark = signal(true);
  constructor() {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
  toggle() { this.isDark.update(v => !v); document.documentElement.setAttribute('data-theme', this.isDark() ? 'dark' : 'light'); }
}
