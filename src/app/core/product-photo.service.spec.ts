import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

import { ProductPhotoService } from './product-photo.service';
import { ProductService } from './product.service';
import { ProductCategoryService } from './product-category.service';
import type { Product } from '../../../shared/types/index.js';

function makeProduct(overrides: Partial<Product> = {}): Product {
  return {
    id: 'pp-test-1',
    sku: 'SP9999',
    name: 'Тестовый товар',
    categoryId: 'cat-sp',
    productType: 'manufactured',
    unit: 'шт',
    isActive: true,
    hasPassport: false,
    hasDrawing: false,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
  };
}

describe('ProductPhotoService', () => {
  let svc: ProductPhotoService;
  let prodSvc: ProductService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProductPhotoService, ProductService, ProductCategoryService, provideHttpClient()],
    });
    svc = TestBed.inject(ProductPhotoService);
    prodSvc = TestBed.inject(ProductService);
    // Очищаем seed-данные
    const items = (prodSvc as unknown as { items: Product[] }).items;
    items.length = 0;
    items.push(makeProduct());
    items.push(makeProduct({ id: 'pp-test-2', sku: 'SP9998', name: 'Второй товар' }));
  });

  it('добавляет фото к товару', async () => {
    const res = await firstValueFrom(svc.addPhoto('pp-test-1', 'https://example.com/a.jpg', 'Вид спереди'));
    expect(res.success).toBe(true);
    expect(res.data.url).toBe('https://example.com/a.jpg');
    expect(res.data.caption).toBe('Вид спереди');
    expect(res.data.isMain).toBe(true); // первое фото — главное
    expect(res.data.sortOrder).toBe(1);
  });

  it('добавляет второе фото как не-главное', async () => {
    await firstValueFrom(svc.addPhoto('pp-test-1', 'https://example.com/a.jpg'));
    const res = await firstValueFrom(svc.addPhoto('pp-test-1', 'https://example.com/b.jpg'));
    expect(res.success).toBe(true);
    expect(res.data.isMain).toBe(false);
    expect(res.data.sortOrder).toBe(2);
  });

  it('получает все фото товара', async () => {
    await firstValueFrom(svc.addPhoto('pp-test-1', 'https://example.com/a.jpg'));
    await firstValueFrom(svc.addPhoto('pp-test-1', 'https://example.com/b.jpg'));
    const res = await firstValueFrom(svc.getPhotos('pp-test-1'));
    expect(res.success).toBe(true);
    expect(res.data.length).toBe(2);
  });

  it('возвращает ошибку для несуществующего товара', async () => {
    const res = await firstValueFrom(svc.getPhotos('nonexistent'));
    expect(res.success).toBe(false);
  });

  it('устанавливает фото как главное', async () => {
    const a = await firstValueFrom(svc.addPhoto('pp-test-1', 'https://example.com/a.jpg'));
    const secondPhoto = await firstValueFrom(svc.addPhoto('pp-test-1', 'https://example.com/b.jpg'));
    expect(a.data.isMain).toBe(true);
    expect(secondPhoto.data.isMain).toBe(false);

    const res = await firstValueFrom(svc.setMain(secondPhoto.data.id));
    expect(res.success).toBe(true);
    expect(res.data.isMain).toBe(true);

    const photos = await firstValueFrom(svc.getPhotos('pp-test-1'));
    expect(photos.data.find(p => p.id === a.data.id)!.isMain).toBe(false);
    expect(photos.data.find(p => p.id === secondPhoto.data.id)!.isMain).toBe(true);
  });

  it('обновляет подпись фото', async () => {
    const a = await firstValueFrom(svc.addPhoto('pp-test-1', 'https://example.com/a.jpg'));
    const res = await firstValueFrom(svc.updateCaption(a.data.id, 'Новая подпись'));
    expect(res.success).toBe(true);
    expect(res.data.caption).toBe('Новая подпись');
  });

  it('удаляет фото и назначает новое главное', async () => {
    const a = await firstValueFrom(svc.addPhoto('pp-test-1', 'https://example.com/a.jpg'));
    await firstValueFrom(svc.addPhoto('pp-test-1', 'https://example.com/b.jpg'));
    expect(a.data.isMain).toBe(true);

    // Удаляем главное
    await firstValueFrom(svc.deletePhoto(a.data.id));
    const photos = await firstValueFrom(svc.getPhotos('pp-test-1'));
    expect(photos.data.length).toBe(1);
    expect(photos.data[0].isMain).toBe(true); // оставшееся стало главным
  });

  it('меняет порядок фото через reorder', async () => {
    const a = await firstValueFrom(svc.addPhoto('pp-test-1', 'https://example.com/a.jpg'));
    const b = await firstValueFrom(svc.addPhoto('pp-test-1', 'https://example.com/b.jpg'));
    const c = await firstValueFrom(svc.addPhoto('pp-test-1', 'https://example.com/c.jpg'));

    // Переворачиваем порядок
    await firstValueFrom(svc.reorderPhotos('pp-test-1', [c.data.id, b.data.id, a.data.id]));

    const photos = await firstValueFrom(svc.getPhotos('pp-test-1'));
    expect(photos.data[0].id).toBe(c.data.id);
    expect(photos.data[1].id).toBe(b.data.id);
    expect(photos.data[2].id).toBe(a.data.id);
  });

  it('seedPhotos не перезаписывает существующие фото', async () => {
    await firstValueFrom(svc.addPhoto('pp-test-1', 'https://example.com/xyz.jpg'));
    svc.seedPhotos(); // не должен затереть
    const photos = await firstValueFrom(svc.getPhotos('pp-test-1'));
    expect(photos.data.length).toBe(1);
    expect(photos.data[0].url).toBe('https://example.com/xyz.jpg');
  });
});
