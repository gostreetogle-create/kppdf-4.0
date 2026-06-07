import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  let service: ThemeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThemeService);
    // Сбрасываем тему перед каждым тестом
    document.documentElement.setAttribute('data-theme', 'light');
  });

  afterEach(() => {
    document.documentElement.setAttribute('data-theme', 'light');
  });

  it('создаётся', () => {
    expect(service).toBeTruthy();
  });

  it('isDark по умолчанию true (тёмная тема)', () => {
    expect(service.isDark()).toBe(true);
  });

  it('toggle() переключает тему', () => {
    service.toggle();
    expect(service.isDark()).toBe(false);
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });

  it('toggle() переключает обратно', () => {
    service.toggle(); // light
    service.toggle(); // dark
    expect(service.isDark()).toBe(true);
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  it('toggle() обновляет data-theme на <html>', () => {
    service.toggle();
    const theme = document.documentElement.getAttribute('data-theme');
    expect(theme).toBe('light');
  });
});
