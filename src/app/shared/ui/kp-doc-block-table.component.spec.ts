import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { KpDocBlockTableComponent } from './kp-doc-block-table.component';
import { TableTemplateService } from '../../core/table-template.service.js';
import type { TableTemplate, ApiResponse } from '../../../../shared/types/index.js';

function createMockService() {
  return {
    getTemplate: vi.fn((_id: string) => of({ success: false, data: undefined } as ApiResponse<TableTemplate | undefined>)),
  };
}

describe('KpDocBlockTableComponent', () => {
  let mockService: ReturnType<typeof createMockService>;

  beforeEach(() => {
    mockService = createMockService();
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KpDocBlockTableComponent],
      providers: [
        { provide: TableTemplateService, useValue: mockService },
      ],
    }).compileComponents();
  });

  afterEach(() => TestBed.resetTestingModule());

  it('создаётся в injection context', () => {
    TestBed.runInInjectionContext(() => {
      const comp = new KpDocBlockTableComponent();
      expect(comp).toBeTruthy();
      expect(comp.tmpl()).toBeUndefined();
      expect(comp.editClick).toBeDefined();
      expect(comp.mode()).toBe('template');
    });
  });

  it('tmpl по умолчанию undefined', () => {
    TestBed.runInInjectionContext(() => {
      const comp = new KpDocBlockTableComponent();
      expect(comp.tmpl()).toBeUndefined();
    });
  });

  it('editClick output существует', () => {
    TestBed.runInInjectionContext(() => {
      const comp = new KpDocBlockTableComponent();
      expect(comp.editClick).toBeDefined();
    });
  });

  it('mode input по умолчанию template', () => {
    TestBed.runInInjectionContext(() => {
      const comp = new KpDocBlockTableComponent();
      expect(comp.mode()).toBe('template');
    });
  });
});
