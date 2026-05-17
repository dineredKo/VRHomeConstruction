/**
 * Компонент загружает и отображает 3D-модель мебели.
 * После загрузки измеряет габариты и сообщает их через колбэк onReady.
 * @module furniture/ui/FurnitureModel
 */

import { useEffect, useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { Box3, Group, Light } from 'three';

interface FurnitureModelProps {
  path: string;
  position: [number, number, number];
  scale: number;
  rotation: [number, number, number];
  onClick?: () => void;
  onReady?: (info: { halfWidth: number; halfDepth: number; height: number }) => void;
}

/**
 * Компонент модели мебели.
 * Отключает встроенные источники света модели и измеряет её габариты.
 */
export const FurnitureModel: React.FC<FurnitureModelProps> = ({
  path,
  position,
  scale,
  rotation,
  onClick,
  onReady,
}) => {
  const groupRef = useRef<Group>(null);
  const { scene } = useGLTF(path);

  useEffect(() => {
    scene.traverse((child) => {
      if (child instanceof Light) child.intensity = 0;
    });
  }, [scene]);

  useEffect(() => {
    if (groupRef.current && onReady) {
      const box = new Box3().setFromObject(groupRef.current);
      const sizeX = box.max.x - box.min.x;
      const sizeZ = box.max.z - box.min.z;
      const height = box.max.y - box.min.y;
      onReady({
        halfWidth: sizeX / 2,
        halfDepth: sizeZ / 2,
        height,
      });
    }
  }, [scene, scale, onReady]);

  return (
    <group position={position} rotation={rotation}>
      <primitive
        ref={groupRef}
        object={scene}
        scale={scale}
        onClick={(e: any) => {
          e.stopPropagation();
          onClick?.();
        }}
      />
    </group>
  );
};