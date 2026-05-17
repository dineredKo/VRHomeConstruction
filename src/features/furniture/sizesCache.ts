interface FurnitureSizes {
  halfWidth: number;
  halfDepth: number;
  height: number;
}

const cache = new Map<string, FurnitureSizes>();

export const furnitureSizesCache = {
  get: (path: string) => cache.get(path),
  set: (path: string, sizes: FurnitureSizes) => {
    cache.set(path, sizes);
  },
};