import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PageTitleService {
  readonly title = signal('');

  setTitle(title: string): void {
    this.title.set(title);
  }

  clearTitle(): void {
    this.title.set('');
  }
}
