import {
  Component,
  input,
  ChangeDetectionStrategy,
} from '@angular/core';
import { LucideDynamicIcon } from '@lucide/angular';

/**
 * Единый компонент для отображения Lucide-иконок в проекте через UI Kit.
 *
 * Использование:
 * ```html
 * <kp-icon name="check" />
 * <kp-icon name="user" size="1.5rem" />
 * <kp-icon name="trash-2" class="custom-class" />
 * ```
 *
 * Все иконки централизованно регистрируются в `app.config.ts` через `provideLucideIcons()`.
 * Проверка полноты регистрации выполняется скриптом `scripts/validate-icons.mjs`.
 *
 * Если иконка не зарегистрирована — @lucide/angular выбросит ошибку в рантайме.
 */
@Component({
  selector: 'kp-icon',
  standalone: true,
  imports: [LucideDynamicIcon],
  template: `
    @if (name()) {
      <svg
        [lucideIcon]="name()"
        [style.width]="size()"
        [style.height]="size()"
        [class]="class()"
        [style.stroke-width]="strokeWidth()"
        [attr.aria-hidden]="true"
        [attr.data-icon]="name()"
      ></svg>
    }
  `,
  styles: [`
    :host {
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KpIconComponent {
  /** Название иконки (kebab-case, например "check", "user", "trash-2") */
  name = input('');

  /** Размер иконки (CSS значение, по умолчанию "1.25rem" = 20px) */
  size = input('1.25rem');

  /** Толщина линии (по умолчанию 2) */
  strokeWidth = input('2');

  /** Дополнительные CSS-классы */
  class = input('');
}
