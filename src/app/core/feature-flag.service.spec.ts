import { TestBed } from '@angular/core/testing';
import { FeatureFlagService } from './feature-flag.service';

describe('FeatureFlagService', () => {
  let service: FeatureFlagService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(FeatureFlagService);
  });

  it('должен вернуть все флаги с дефолтными значениями', () => {
    expect(service.allFlags.length).toBe(5);
    expect(service.isEnabled('placeholders')).toBe(true);
    expect(service.isEnabled('pdfExport')).toBe(true);
    expect(service.isEnabled('counterpartyRoles')).toBe(true);
    expect(service.isEnabled('deferDialogs')).toBe(true);
    expect(service.isEnabled('advancedSearch')).toBe(false);
  });

  it('должен вернуть false для неизвестного флага', () => {
    expect(service.isEnabled('unknown-flag')).toBe(false);
  });

  it('должен включить/выключить флаг', () => {
    expect(service.isEnabled('advancedSearch')).toBe(false);

    service.toggle('advancedSearch', true);
    expect(service.isEnabled('advancedSearch')).toBe(true);

    service.toggle('advancedSearch', false);
    expect(service.isEnabled('advancedSearch')).toBe(false);
  });

  it('должен сохранить состояние в localStorage', () => {
    service.toggle('advancedSearch', true);
    const saved = JSON.parse(localStorage.getItem('kppdf:featureFlags') || '{}');
    expect(saved.advancedSearch).toBe(true);
  });

  it('должен восстановить состояние из localStorage при создании', () => {
    localStorage.setItem('kppdf:featureFlags', JSON.stringify({ advancedSearch: true }));

    // Сбрасываем TestBed и создаём новый сервис, который прочитает localStorage
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});
    const newService = TestBed.inject(FeatureFlagService);
    expect(newService.isEnabled('advancedSearch')).toBe(true);
  });

  it('должен сбросить все флаги к значениям по умолчанию', () => {
    service.toggle('placeholders', false);
    service.toggle('advancedSearch', true);
    expect(service.isEnabled('placeholders')).toBe(false);
    expect(service.isEnabled('advancedSearch')).toBe(true);

    service.resetAll();
    expect(service.isEnabled('placeholders')).toBe(true);
    expect(service.isEnabled('advancedSearch')).toBe(false);
  });

  it('должен вернуть состояние флага как сигнал', () => {
    const flags = service.flags();
    expect(flags['placeholders']).toBe(true);
    expect(flags['advancedSearch']).toBe(false);
  });

  it('должен обновить сигнал после toggle', () => {
    service.toggle('advancedSearch', true);
    const flags = service.flags();
    expect(flags['advancedSearch']).toBe(true);
  });
});
