import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { KpDocBlockTextComponent } from './kp-doc-block-text.component';
describe('KpDocBlockTextComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KpDocBlockTextComponent],
    }).compileComponents();
  });

  afterEach(() => TestBed.resetTestingModule());

  it('создаётся в injection context', () => {
    TestBed.runInInjectionContext(() => {
      const comp = new KpDocBlockTextComponent();
      expect(comp).toBeTruthy();
    });
  });

  it('columnsGrid метод существует', () => {
    TestBed.runInInjectionContext(() => {
      const comp = new KpDocBlockTextComponent();
      expect(typeof comp.columnsGrid).toBe('function');
    });
  });

  it('editClick output существует', () => {
    TestBed.runInInjectionContext(() => {
      const comp = new KpDocBlockTextComponent();
      expect(comp.editClick).toBeDefined();
    });
  });

  it('block input существует', () => {
    TestBed.runInInjectionContext(() => {
      const comp = new KpDocBlockTextComponent();
      expect(comp.block).toBeDefined();
      expect(typeof comp.block).toBe('function');
    });
  });
});
