export const getModelName = (path: string) => {
  const fileName = path.split('/').pop() || '';
  return fileName.replace(/\.(glb|gltf)$/, '');
};