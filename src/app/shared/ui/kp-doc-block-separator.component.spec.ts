import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { KpDocBlockSeparatorComponent } from './kp-doc-block-separator.component';

describe('KpDocBlockSeparatorComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KpDocBlockSeparatorComponent],
    }).compileComponents();
  });

  afterEach(() => TestBed.resetTestingModule());

  it('создаётся', () => {
    const f = TestBed.createComponent(KpDocBlockSeparatorComponent);
    f.detectChanges();
    expect(f.componentInstance).toBeTruthy();
  });

  it('значения по умолчанию', () => {
    const c = TestBed.createComponent(KpDocBlockSeparatorComponent).componentInstance;
    expect(c.height()).toBe(20);
    expect(c.showLine()).toBe(false);
  });

  it('рендерит div.separator', () => {
    const f = TestBed.createComponent(KpDocBlockSeparatorComponent);
    f.detectChanges();
    expect(f.nativeElement.querySelector('.separator')).toBeTruthy();
  });

  it('высота по умолчанию 20px', () => {
    const f = TestBed.createComponent(KpDocBlockSeparatorComponent);
    f.detectChanges();
    const sep = f.nativeElement.querySelector('.separator') as HTMLElement;
    expect(sep.style.height).toBe('20px');
  });

  it('не показывает hr по умолчанию', () => {
    const f = TestBed.createComponent(KpDocBlockSeparatorComponent);
    f.detectChanges();
    expect(f.nativeElement.querySelector('.separator__hr')).toBeNull();
  });

  it('нет класса separator--line по умолчанию', () => {
    const f = TestBed.createComponent(KpDocBlockSeparatorComponent);
    f.detectChanges();
    const sep = f.nativeElement.querySelector('.separator') as HTMLElement;
    expect(sep.classList.contains('separator--line')).toBe(false);
  });
});
