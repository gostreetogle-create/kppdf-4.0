import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { KpDocCanvasComponent } from './kp-doc-canvas.component';

describe('KpDocCanvasComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KpDocCanvasComponent],
    }).compileComponents();
  });

  afterEach(() => TestBed.resetTestingModule());

  it('создаётся в injection context', () => {
    TestBed.runInInjectionContext(() => {
      const comp = new KpDocCanvasComponent();
      expect(comp).toBeTruthy();
    });
  });

  it('blocks по умолчанию пустой массив', () => {
    TestBed.runInInjectionContext(() => {
      const comp = new KpDocCanvasComponent();
      expect(comp.blocks()).toEqual([]);
    });
  });

  it('mode по умолчанию template', () => {
    TestBed.runInInjectionContext(() => {
      const comp = new KpDocCanvasComponent();
      expect(comp.mode()).toBe('template');
    });
  });

  it('editable по умолчанию true', () => {
    TestBed.runInInjectionContext(() => {
      const comp = new KpDocCanvasComponent();
      expect(comp.editable()).toBe(true);
    });
  });

  it('backgroundImage по умолчанию пустая строка', () => {
    TestBed.runInInjectionContext(() => {
      const comp = new KpDocCanvasComponent();
      expect(comp.backgroundImage()).toBe('');
    });
  });

  it('selectedBlockId по умолчанию пустая строка', () => {
    TestBed.runInInjectionContext(() => {
      const comp = new KpDocCanvasComponent();
      expect(comp.selectedBlockId()).toBe('');
    });
  });

  it('outputs существуют', () => {
    TestBed.runInInjectionContext(() => {
      const comp = new KpDocCanvasComponent();
      expect(comp.blockSelect).toBeDefined();
      expect(comp.blockEdit).toBeDefined();
      expect(comp.blockRemove).toBeDefined();
      expect(comp.blocksReorder).toBeDefined();
    });
  });
});
