import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { InventoryService } from './inventory.service';
import { API_URL } from './api-url.token';

describe('InventoryService', () => {
  let service: InventoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: API_URL, useValue: '/api/v1' },
      ],
    });
    service = TestBed.inject(InventoryService);
  });

  it('создаётся через DI', () => {
    expect(service).toBeTruthy();
  });

  it('имеет методы для работы с остатками и движениями', () => {
    expect(typeof service.getItems).toBe('function');
    expect(typeof service.getItem).toBe('function');
    expect(typeof service.getMovements).toBe('function');
    expect(typeof service.addMovement).toBe('function');
  });
});
