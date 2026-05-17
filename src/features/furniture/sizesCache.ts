/**
 * Простой кеш размеров моделей.
 * Позволяет повторно использовать измеренные размеры без повторной загрузки модели.
 * @module furniture/sizesCache
 */

interface FurnitureSizes {
  halfWidth: number;
  halfDepth: number;
  height: number;
}

const cache = new Map<string, FurnitureSizes>();

export const furnitureSizesCache = {
  /** Получить размеры модели по пути к файлу */
  get: (path: string) => cache.get(path),
  /** Сохранить размеры модели */
  set: (path: string, sizes: FurnitureSizes) => {
    cache.set(path, sizes);
  },
};