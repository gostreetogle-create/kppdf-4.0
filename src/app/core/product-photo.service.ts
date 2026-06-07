import { Injectable, inject } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { BaseCrudService, generateId, nowISO } from './crud-factory.js';
import { ProductService } from './product.service.js';
import type { ApiResponse, ProductPhoto } from '../../../shared/types/index.js';

/** Seed-фотографии для демонстрации */
const SEED_PHOTOS: Record<string, ProductPhoto[]> = {
  'prod-1': [
    {
      id: 'photo-1-1', productId: 'prod-1',
      url: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600',
      caption: 'Стойка баскетбольная БСФП-120 — вид спереди',
      isMain: true, sortOrder: 1,
      createdAt: '2026-01-15T10:30:00.000Z',
    },
    {
      id: 'photo-1-2', productId: 'prod-1',
      url: 'https://images.unsplash.com/photo-1504450758481-7338eba7524a?w=600',
      caption: 'Щит и кольцо крупным планом',
      isMain: false, sortOrder: 2,
      createdAt: '2026-01-15T10:35:00.000Z',
    },
    {
      id: 'photo-1-3', productId: 'prod-1',
      url: 'https://images.unsplash.com/photo-1627627256672-027a4613d028?w=600',
      caption: 'Чертёж стойки (общий вид)',
      isMain: false, sortOrder: 3,
      createdAt: '2026-01-20T10:00:00.000Z',
    },
  ],
  'prod-2': [
    {
      id: 'photo-2-1', productId: 'prod-2',
      url: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=600',
      caption: 'Турник уличный ТУ-2 на площадке',
      isMain: true, sortOrder: 1,
      createdAt: '2026-01-25T10:00:00.000Z',
    },
    {
      id: 'photo-2-2', productId: 'prod-2',
      url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600',
      caption: 'Комплектация турника',
      isMain: false, sortOrder: 2,
      createdAt: '2026-02-01T10:00:00.000Z',
    },
  ],
  'prod-3': [
    {
      id: 'photo-3-1', productId: 'prod-3',
      url: 'https://images.unsplash.com/photo-1593061715086-1591ef134782?w=600',
      caption: 'Скамейка парковая СК-180 в парке',
      isMain: true, sortOrder: 1,
      createdAt: '2026-02-05T10:00:00.000Z',
    },
  ],
};

@Injectable({ providedIn: 'root' })
export class ProductPhotoService {
  private productService = inject(ProductService);

  /** Загрузить seed-фотографии в товары (вызывается один раз при старте) */
  seedPhotos(): void {
    const products = (this.productService as unknown as { items: { id: string; photos?: ProductPhoto[] }[] }).items;
    for (const product of products) {
      if (!product.photos && SEED_PHOTOS[product.id]) {
        product.photos = SEED_PHOTOS[product.id].map(p => ({ ...p }));
      }
    }
  }

  /** Получить все фото товара */
  getPhotos(productId: string): Observable<ApiResponse<ProductPhoto[]>> {
    const product = this.findProduct(productId);
    if (!product) {
      return of({ success: false, data: [], message: 'Товар не найден' }).pipe(delay(50));
    }
    const photos = (product.photos || []).slice().sort((a, b) => a.sortOrder - b.sortOrder);
    return of({ success: true, data: photos.map(p => ({ ...p })) }).pipe(delay(50));
  }

  /** Добавить фото к товару */
  addPhoto(productId: string, url: string, caption?: string): Observable<ApiResponse<ProductPhoto>> {
    const product = this.findProduct(productId);
    if (!product) {
      return of({ success: false, data: undefined as unknown as ProductPhoto, message: 'Товар не найден' }).pipe(delay(50));
    }
    if (!product.photos) product.photos = [];

    const maxOrder = product.photos.length > 0
      ? Math.max(...product.photos.map(p => p.sortOrder))
      : 0;

    const photo: ProductPhoto = {
      id: generateId(),
      productId,
      url: url.trim(),
      caption: caption?.trim() || undefined,
      isMain: product.photos.length === 0,
      sortOrder: maxOrder + 1,
      createdAt: nowISO(),
    };

    product.photos.push(photo);
    return of({ success: true, data: { ...photo } }).pipe(delay(50));
  }

  /** Обновить подпись фото */
  updateCaption(photoId: string, caption: string): Observable<ApiResponse<ProductPhoto>> {
    const result = this.findPhoto(photoId);
    if (!result) {
      return of({ success: false, data: undefined as unknown as ProductPhoto, message: 'Фото не найдено' }).pipe(delay(50));
    }
    result.photo.caption = caption.trim() || undefined;
    return of({ success: true, data: { ...result.photo } }).pipe(delay(50));
  }

  /** Установить фото как главное */
  setMain(photoId: string): Observable<ApiResponse<ProductPhoto>> {
    const result = this.findPhoto(photoId);
    if (!result) {
      return of({ success: false, data: undefined as unknown as ProductPhoto, message: 'Фото не найдено' }).pipe(delay(50));
    }
    // Снять isMain со всех фото товара
    for (const p of result.product.photos!) {
      p.isMain = false;
    }
    result.photo.isMain = true;
    return of({ success: true, data: { ...result.photo } }).pipe(delay(50));
  }

  /** Удалить фото */
  deletePhoto(photoId: string): Observable<ApiResponse<void>> {
    const result = this.findPhoto(photoId);
    if (!result) {
      return of({ success: false, data: undefined, message: 'Фото не найдено' }).pipe(delay(50));
    }
    const wasMain = result.photo.isMain;
    result.product.photos = result.product.photos!.filter(p => p.id !== photoId);

    // Если удалили главное — назначить первое оставшееся
    if (wasMain && result.product.photos!.length > 0) {
      result.product.photos![0].isMain = true;
    }

    // Перенумерация sortOrder
    result.product.photos!.forEach((p, i) => p.sortOrder = i + 1);

    return of({ success: true, data: undefined }).pipe(delay(50));
  }

  /** Изменить порядок фото (передать массив id в нужном порядке) */
  reorderPhotos(productId: string, photoIds: string[]): Observable<ApiResponse<void>> {
    const product = this.findProduct(productId);
    if (!product || !product.photos) {
      return of({ success: false, data: undefined, message: 'Товар не найден' }).pipe(delay(50));
    }
    const idOrder = new Map(photoIds.map((id, i) => [id, i + 1]));
    for (const photo of product.photos) {
      if (idOrder.has(photo.id)) {
        photo.sortOrder = idOrder.get(photo.id)!;
      }
    }
    // Сортировка по новому порядку
    product.photos.sort((a, b) => a.sortOrder - b.sortOrder);
    return of({ success: true, data: undefined }).pipe(delay(50));
  }

  private findProduct(productId: string): { id: string; photos?: ProductPhoto[] } | undefined {
    const items = (this.productService as unknown as { items: { id: string; photos?: ProductPhoto[] }[] }).items;
    return items.find(p => p.id === productId);
  }

  private findPhoto(photoId: string): { photo: ProductPhoto; product: { id: string; photos: ProductPhoto[] } } | undefined {
    const items = (this.productService as unknown as { items: { id: string; photos?: ProductPhoto[] }[] }).items;
    for (const product of items) {
      if (product.photos) {
        const photo = product.photos.find(p => p.id === photoId);
        if (photo) return { photo, product: product as { id: string; photos: ProductPhoto[] } };
      }
    }
    return undefined;
  }
}
