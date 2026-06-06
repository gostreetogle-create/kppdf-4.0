import { Injectable, inject } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import type { ApiResponse, Organization } from '../../../shared/types/index.js';
import { CounterpartyRoleService } from './counterparty-role.service.js';

function generateId(): string {
  return crypto.randomUUID?.() ?? Math.random().toString(36).slice(2, 11);
}

function nowISO(): string {
  return new Date().toISOString();
}

/** Предзаполненные контрагенты для демо */
// ID ролей будут подставляться из CounterpartyRoleService
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
    counterpartyRoleIds: [] as string[],
    contactPerson: '',
    paymentTermDays: 0,
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
    counterpartyRoleIds: [] as string[],
    contactPerson: '',
    paymentTermDays: 0,
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
    counterpartyRoleIds: [] as string[],
    contactPerson: '',
    paymentTermDays: 0,
    isActive: true,
    createdAt: '2024-09-12T16:00:00.000Z',
    updatedAt: '2026-02-01T09:00:00.000Z',
  },
  // Бывшие поставщики — с ID роли поставщика
];

/**
 * Сервис контрагентов — CRUD с хранением в памяти.
 * Объединяет бывшие справочники «Организации» и «Поставщики».
 *
 * Позже заменяется на HTTP-сервис через ApiService.
 */
@Injectable({ providedIn: 'root' })
export class OrganizationService {
  private roleService = inject(CounterpartyRoleService);
  private organizations: Organization[] = [];

  constructor() {
    this.initSeedData();
  }

  private initSeedData() {
    const supplierRoleId = this.roleService.getRoleIdBySlug('supplier') || 'role-supplier';
    const buyerRoleId = this.roleService.getRoleIdBySlug('buyer') || 'role-buyer';

    // Проставляем роли первым трём организациям
    this.organizations = [...SEED_ORGANIZATIONS].map((org, i) => {
      if (i === 0) return { ...org, counterpartyRoleIds: [buyerRoleId] };       // ТехноПром — покупатель
      if (i === 1) return { ...org, counterpartyRoleIds: [supplierRoleId, buyerRoleId] }; // СтройМонтажСервис — и поставщик, и покупатель
      if (i === 2) return { ...org, counterpartyRoleIds: [supplierRoleId] };    // ИП Сидоров — поставщик
      return org;
    });

    // Добавляем бывших поставщиков с правильными ID ролей
    this.organizations.push({
      id: 'sup-1',
      name: 'ООО «МеталлПродукт»',
      shortName: 'ООО «МеталлПродукт»',
      legalForm: 'ООО',
      inn: '6671234567',
      kpp: '',
      ogrn: '',
      phone: '+7 (343) 222-33-44',
      email: 'sale@metallproduct.ru',
      legalAddress: '',
      postalAddress: '',
      bankName: '',
      bankBik: '',
      bankAccount: '40702810700000012345',
      signerName: '',
      signerPosition: '',
      counterpartyRoleIds: [supplierRoleId],
      contactPerson: 'Кузнецов Андрей Викторович',
      paymentTermDays: 30,
      isActive: true,
      createdAt: '2025-02-10T09:00:00.000Z',
      updatedAt: '2026-04-15T11:00:00.000Z',
    });
    this.organizations.push({
      id: 'sup-2',
      name: 'АО «ХимРеактив»',
      shortName: 'АО «ХимРеактив»',
      legalForm: 'АО',
      inn: '7709876543',
      kpp: '',
      ogrn: '',
      phone: '+7 (495) 777-88-99',
      email: 'info@chemreactive.ru',
      legalAddress: '',
      postalAddress: '',
      bankName: '',
      bankBik: '',
      bankAccount: '40702810500000067890',
      signerName: '',
      signerPosition: '',
      counterpartyRoleIds: [supplierRoleId],
      contactPerson: 'Смирнова Елена Игоревна',
      paymentTermDays: 15,
      isActive: true,
      createdAt: '2025-05-20T14:00:00.000Z',
      updatedAt: '2026-03-01T16:30:00.000Z',
    });
    this.organizations.push({
      id: 'sup-3',
      name: 'ИП Григорьев Дмитрий Сергеевич',
      shortName: 'ИП Григорьев Д.С.',
      legalForm: 'ИП',
      inn: '503456789012',
      kpp: '',
      ogrn: '',
      phone: '+7 (926) 333-22-11',
      email: 'grigoriev@parts-msk.ru',
      legalAddress: '',
      postalAddress: '',
      bankName: '',
      bankBik: '',
      bankAccount: '40802810300000054321',
      signerName: '',
      signerPosition: '',
      counterpartyRoleIds: [supplierRoleId],
      contactPerson: 'Григорьев Дмитрий Сергеевич',
      paymentTermDays: 0,
      isActive: false,
      createdAt: '2024-11-01T10:00:00.000Z',
      updatedAt: '2026-01-20T09:00:00.000Z',
    });
  }

  /** Получить всех контрагентов (опционально с фильтром по slug роли) */
  getOrganizations(roleSlug?: string): Observable<ApiResponse<Organization[]>> {
    let data: Organization[];
    if (roleSlug) {
      const roleId = this.roleService.getRoleIdBySlug(roleSlug);
      data = roleId
        ? this.organizations.filter(o => o.counterpartyRoleIds.includes(roleId))
        : [];
    } else {
      data = [...this.organizations];
    }
    return of({ success: true, data }).pipe(delay(100));
  }

  /** Получить контрагента по id */
  getOrganization(id: string): Observable<ApiResponse<Organization | undefined>> {
    const org = this.organizations.find(o => o.id === id);
    return of({
      success: !!org,
      data: org ? { ...org } : undefined,
    }).pipe(delay(100));
  }

  /** Создать нового контрагента */
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

  /** Обновить контрагента */
  updateOrganization(id: string, data: Partial<Omit<Organization, 'id' | 'createdAt'>>): Observable<ApiResponse<Organization>> {
    const index = this.organizations.findIndex(o => o.id === id);
    if (index === -1) {
      return of({ success: false, data: undefined as unknown as Organization, message: 'Контрагент не найден' }).pipe(delay(100));
    }
    this.organizations[index] = { ...this.organizations[index], ...data, id, updatedAt: nowISO() };
    return of({ success: true, data: { ...this.organizations[index] } }).pipe(delay(100));
  }

  /** Удалить контрагента */
  deleteOrganization(id: string): Observable<ApiResponse<void>> {
    const index = this.organizations.findIndex(o => o.id === id);
    if (index === -1) {
      return of({ success: false, data: undefined, message: 'Контрагент не найден' }).pipe(delay(100));
    }
    this.organizations.splice(index, 1);
    return of({ success: true, data: undefined }).pipe(delay(100));
  }

  /** Получить количество контрагентов по slug роли */
  getCountByRole(roleSlug?: string): Observable<number> {
    if (!roleSlug) return of(this.organizations.length);
    const roleId = this.roleService.getRoleIdBySlug(roleSlug);
    if (!roleId) return of(0);
    return of(this.organizations.filter(o => o.counterpartyRoleIds.includes(roleId)).length);
  }
}
