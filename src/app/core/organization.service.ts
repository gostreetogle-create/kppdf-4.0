import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import type { ApiResponse, Organization } from '../../../shared/types/index.js';

function generateId(): string {
  return crypto.randomUUID?.() ?? Math.random().toString(36).slice(2, 11);
}

function nowISO(): string {
  return new Date().toISOString();
}

/** Предзаполненные организации для демо */
const SEED_ORGANIZATIONS: Organization[] = [
  {
    id: 'org-1',
    name: 'Общество с ограниченной ответственностью «ТехноПром»',
    shortName: 'ООО «ТехноПром»',
    legalForm: 'ООО',
    inn: '7701234567',
    kpp: '770101001',
    ogrn: '1234567890123',
    phone: '+7 (495) 123-45-67',
    email: 'info@technoprom.ru',
    legalAddress: '125009, г. Москва, ул. Тверская, д. 12, оф. 305',
    postalAddress: '125009, г. Москва, а/я 45',
    bankName: 'ПАО «Сбербанк»',
    bankBik: '044525225',
    bankAccount: '40702810938000012345',
    signerName: 'Иванов Иван Петрович',
    signerPosition: 'Генеральный директор',
    isActive: true,
    createdAt: '2025-01-15T10:00:00.000Z',
    updatedAt: '2026-03-20T14:30:00.000Z',
  },
  {
    id: 'org-2',
    name: 'Акционерное общество «СтройМонтажСервис»',
    shortName: 'АО «СтройМонтажСервис»',
    legalForm: 'АО',
    inn: '7715987654',
    kpp: '771501001',
    ogrn: '9876543210987',
    phone: '+7 (812) 555-01-02',
    email: 'office@sms-spb.ru',
    legalAddress: '191023, г. Санкт-Петербург, наб. реки Фонтанки, д. 48, лит. А',
    postalAddress: '191023, г. Санкт-Петербург, наб. реки Фонтанки, д. 48, лит. А',
    bankName: 'ПАО «ВТБ»',
    bankBik: '044030707',
    bankAccount: '40702810630000054321',
    signerName: 'Петров Сергей Александрович',
    signerPosition: 'Генеральный директор',
    isActive: true,
    createdAt: '2025-06-01T08:00:00.000Z',
    updatedAt: '2026-05-10T11:00:00.000Z',
  },
  {
    id: 'org-3',
    name: 'Индивидуальный предприниматель Сидоров Алексей Викторович',
    shortName: 'ИП Сидоров А.В.',
    legalForm: 'ИП',
    inn: '503212345678',
    kpp: '',
    ogrn: '312503212300010',
    phone: '+7 (926) 111-22-33',
    email: 'sidorov@freelance.ru',
    legalAddress: '141070, Московская обл., г. Королёв, ул. Циолковского, д. 5, кв. 17',
    postalAddress: '141070, Московская обл., г. Королёв, ул. Циолковского, д. 5, кв. 17',
    bankName: 'АО «Т-Банк»',
    bankBik: '044525974',
    bankAccount: '40802810400000009876',
    signerName: 'Сидоров Алексей Викторович',
    signerPosition: 'Индивидуальный предприниматель',
    isActive: true,
    createdAt: '2024-09-12T16:00:00.000Z',
    updatedAt: '2026-02-01T09:00:00.000Z',
  },
];

/**
 * Сервис организаций — CRUD с хранением в памяти.
 *
 * Позже заменяется на HTTP-сервис через ApiService,
 * интерфейс остаётся неизменным (Observable<ApiResponse<T>>).
 */
@Injectable({ providedIn: 'root' })
export class OrganizationService {
  private organizations: Organization[] = [...SEED_ORGANIZATIONS];

  /** Получить все организации */
  getOrganizations(): Observable<ApiResponse<Organization[]>> {
    return of({
      success: true,
      data: [...this.organizations],
    }).pipe(delay(100));
  }

  /** Получить организацию по id */
  getOrganization(id: string): Observable<ApiResponse<Organization | undefined>> {
    const org = this.organizations.find(o => o.id === id);
    return of({
      success: !!org,
      data: org ? { ...org } : undefined,
    }).pipe(delay(100));
  }

  /** Создать новую организацию */
  createOrganization(data: Omit<Organization, 'id' | 'createdAt' | 'updatedAt'>): Observable<ApiResponse<Organization>> {
    const now = nowISO();
    const org: Organization = {
      ...data,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    };
    this.organizations.push(org);
    return of({ success: true, data: { ...org } }).pipe(delay(100));
  }

  /** Обновить организацию */
  updateOrganization(id: string, data: Partial<Omit<Organization, 'id' | 'createdAt'>>): Observable<ApiResponse<Organization>> {
    const index = this.organizations.findIndex(o => o.id === id);
    if (index === -1) {
      return of({ success: false, data: undefined as unknown as Organization, message: 'Организация не найдена' }).pipe(delay(100));
    }
    this.organizations[index] = { ...this.organizations[index], ...data, id, updatedAt: nowISO() };
    return of({ success: true, data: { ...this.organizations[index] } }).pipe(delay(100));
  }

  /** Удалить организацию */
  deleteOrganization(id: string): Observable<ApiResponse<void>> {
    const index = this.organizations.findIndex(o => o.id === id);
    if (index === -1) {
      return of({ success: false, data: undefined, message: 'Организация не найдена' }).pipe(delay(100));
    }
    this.organizations.splice(index, 1);
    return of({ success: true, data: undefined }).pipe(delay(100));
  }
}
