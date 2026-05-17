/**
 * Автоматически сгенерированный список моделей.
 * Обновляется скриптом generate-model-list.cjs при старте dev-сервера.
 * @module furniture/modelList
 */

export const modelPaths: string[] = [
  "/models/bed.glb",
  "/models/chair.glb",
  "/models/classic_table.glb",
  "/models/commode.glb",
  "/models/retro_vintage_furniture_pack.glb",
  "/models/wardrobe.glb",
  "/models/wood-crate/untitled.gltf"
];

/**
 * Извлекает имя модели из пути файла.
 * @param path - путь к файлу модели
 * @returns имя модели без расширения
 */
export const getModelName = (path: string) => {
  const fileName = path.split('/').pop() || '';
  return fileName.replace(/.(glb|gltf)$/, '');
};