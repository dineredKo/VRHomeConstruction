// Автоматически сгенерировано. Не редактировать вручную.
export const modelPaths: string[] = [
  "/models/bed.glb",
  "/models/chair.glb",
  "/models/classic_table.glb",
  "/models/commode.glb",
  "/models/retro_vintage_furniture_pack.glb",
  "/models/wardrobe.glb",
  "/models/wood-crate/untitled.gltf"
];

export const getModelName = (path: string) => {
  const fileName = path.split('/').pop() || '';
  return fileName.replace(/.(glb|gltf)$/, '');
};
