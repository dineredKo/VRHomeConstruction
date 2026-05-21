/**
 * Компонент комнаты: пол, стены, потолок и размещённая мебель.
 * Реагирует на изменение размеров, цвета и списка проёмов/мебели.
 * @module editor-3d/ui/Room
 */

import React from 'react';
import { DoubleSide } from 'three';
import { WallWithOpenings } from './WallWithOpenings';
import { FurnitureModel } from '@/features/furniture/ui/FurnitureModel';
import type { Opening } from '../types';
import type { RoomColors } from '../types';
import type { FurnitureItem } from '@/features/furniture/types';
import { WALL_THICKNESS } from '../constants';
import { getWallsData } from '../selectors';

interface RoomProps {
  dimensions: { width: number; height: number; depth: number };
  colors: RoomColors;
  openings: { [wallId: string]: Opening[] };
  onWallClick?: (wallId: string, point: { x: number; y: number }) => void;
  activeTool?: 'select' | 'window' | 'door' | 'furniture';
  onOpeningClick?: (wallId: string, openingId: string, wallWidth: number, wallHeight: number) => void;
  furnitureItems?: FurnitureItem[];
  onFloorClick?: (point: { x: number; z: number }) => void;
  onFurnitureClick?: (item: FurnitureItem) => void;
  onFurnitureReady?: (itemId: string, info: { halfWidth: number; halfDepth: number; height: number }) => void;
}

/**
 * Компонент комнаты, мемоизирован для предотвращения лишних перерисовок.
 */
export const Room: React.FC<RoomProps> = React.memo(({
  dimensions,
  colors,
  openings,
  onWallClick,
  activeTool,
  onOpeningClick,
  furnitureItems,
  onFloorClick,
  onFurnitureClick,
  onFurnitureReady,
}) => {
  const { width, height, depth } = dimensions;
  const wallThickness = WALL_THICKNESS;

  const walls = React.useMemo(() => getWallsData(width, height, depth), [width, height, depth]);

  /**
   * Обработчик клика по стене.
   * Преобразует мировые координаты клика в локальные координаты стены и вызывает колбэк.
   */
  const handleWallClick = (wallId: string) => (e: any) => {
    if (activeTool === 'window' || activeTool === 'door') {
      e.stopPropagation();
      if (e.point) {
        const wallData = walls.find(w => w.id === wallId);
        if (!wallData) return;

        const [wallWidth, wallHeight] = wallData.size;
        const localPoint = e.object.worldToLocal(e.point.clone());

        const margin = 0.1;
        const clampedX = Math.max(-wallWidth / 2 + margin, Math.min(wallWidth / 2 - margin, localPoint.x));
        const clampedY = Math.max(-wallHeight / 2 + margin, Math.min(wallHeight / 2 - margin, localPoint.y));

        onWallClick?.(wallId, { x: clampedX, y: clampedY });
      }
    }
  };

  return (
    <group>
      {/* Пол */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0] as [number, number, number]}
        position={[0, 0, 0]}
        receiveShadow
        castShadow={false}
        onClick={(e: any) => {
          e.stopPropagation();
          if (activeTool === 'furniture' && onFloorClick) {
            onFloorClick({ x: e.point.x, z: e.point.z });
          }
        }}
      >
        <planeGeometry args={[width, depth]} />
        <meshStandardMaterial color={colors.floor} />
      </mesh>

      {/* Стены */}
      {walls.map((wall) => (
        <WallWithOpenings
          key={wall.id}
          position={wall.pos as [number, number, number]}
          rotation={wall.rot as [number, number, number]}
          size={wall.size as [number, number]}
          thickness={wallThickness}
          openings={openings[wall.id] || []}
          onClick={handleWallClick(wall.id)}
          color={colors.walls}
          onOpeningClick={(openingId) => {
            const wallData = walls.find(w => w.id === wall.id);
            if (wallData) {
              onOpeningClick?.(wall.id, openingId, wallData.size[0], wallData.size[1]);
            }
          }}
        />
      ))}

      {/* Мебель */}
      {furnitureItems?.map(item => (
        <FurnitureModel
          key={item.id}
          path={item.modelPath}
          position={item.position}
          scale={item.scale}
          rotation={item.rotation}
          onClick={() => onFurnitureClick?.(item)}
          onReady={(info) => onFurnitureReady?.(item.id, info)}
        />
      ))}

      {/* Потолок */}
      <mesh rotation={[Math.PI / 2, 0, 0] as [number, number, number]} position={[0, height, 0]} receiveShadow castShadow={false}>
        <planeGeometry args={[width, depth]} />
        <meshStandardMaterial color={colors.ceiling} />
      </mesh>
    </group>
  );
});