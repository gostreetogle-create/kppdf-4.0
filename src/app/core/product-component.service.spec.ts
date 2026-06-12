import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { ProductComponentService } from './product-component.service';
import { API_URL } from './api-url.token';

describe('ProductComponentService', () => {
  let service: ProductComponentService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: API_URL, useValue: '/api/v1' },
      ],
    });
    service = TestBed.inject(ProductComponentService);
  });

  it('создаётся через DI', () => {
    expect(service).toBeTruthy();
  });

  it('имеет методы CRUD', () => {
    expect(typeof service.getAll).toBe('function');
    expect(typeof service.getByProduct).toBe('function');
    expect(typeof service.createComponent).toBe('function');
    expect(typeof service.updateComponent).toBe('function');
    expect(typeof service.deleteComponent).toBe('function');
  });
});
