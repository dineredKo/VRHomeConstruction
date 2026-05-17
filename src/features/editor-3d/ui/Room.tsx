import React from 'react';
import { DoubleSide } from 'three';
import { WallWithOpenings } from './WallWithOpenings';
import { PartitionModel } from './PartitionModel';
import { FurnitureModel } from '@/features/furniture/ui/FurnitureModel';
import type { Opening, Partition, RoomColors } from '../types';
import type { FurnitureItem } from '@/features/furniture/types';
import { WALL_THICKNESS } from '../constants';
import { getWallsData } from '../selectors';

interface RoomProps {
  dimensions: { width: number; height: number; depth: number };
  colors: RoomColors;
  openings: { [wallId: string]: Opening[] };
  partitions?: Partition[];
  onWallClick?: (wallId: string, point: { x: number; y: number }) => void;
  activeTool?: 'select' | 'window' | 'door' | 'furniture' | 'partition';
  onOpeningClick?: (wallId: string, openingId: string, wallWidth: number, wallHeight: number) => void;
  furnitureItems?: FurnitureItem[];
  onFloorClick?: (point: { x: number; z: number }) => void;
  onFurnitureClick?: (item: FurnitureItem) => void;
  onFurnitureReady?: (itemId: string, info: { halfWidth: number; halfDepth: number; height: number }) => void;
  onPartitionClick?: (partition: Partition) => void;
  onPartitionOpeningClick?: (partitionId: string, openingId: string) => void;
  onPartitionCreateOnWall?: (wallId: string, x: number, z: number) => void;
}

export const Room: React.FC<RoomProps> = React.memo(({
  dimensions,
  colors,
  openings,
  partitions,
  onWallClick,
  activeTool,
  onOpeningClick,
  furnitureItems,
  onFloorClick,
  onFurnitureClick,
  onFurnitureReady,
  onPartitionClick,
  onPartitionOpeningClick,
  onPartitionCreateOnWall,
}) => {
  const { width, height, depth } = dimensions;
  const wallThickness = WALL_THICKNESS;

  const handleWallClick = (wallId: string) => (e: any) => {
    if (activeTool === 'window' || activeTool === 'door') {
      e.stopPropagation();
      if (e.point) {
        const localPoint = e.object.worldToLocal(e.point.clone());
        const clampedX = Math.max(-wallThickness / 2, Math.min(wallThickness / 2, localPoint.x));
        const clampedY = Math.max(-height / 2 + 0.3, Math.min(height / 2 - 0.3, localPoint.y));
        onWallClick?.(wallId, { x: clampedX, y: clampedY });
      }
    } else if (activeTool === 'partition' && onPartitionCreateOnWall) {
      e.stopPropagation();
      if (e.point) {
        onPartitionCreateOnWall(wallId, e.point.x, e.point.z);
      }
    }
  };

  const walls = React.useMemo(() => getWallsData(width, height, depth), [width, height, depth]);

  return (
    <group>
      <mesh
        rotation={[-Math.PI / 2, 0, 0] as [number, number, number]}
        position={[0, 0, 0]}
        receiveShadow
        castShadow={false}
        onClick={(e: any) => {
          e.stopPropagation();
          if (activeTool === 'furniture' && onFloorClick) {
            onFloorClick({ x: e.point.x, z: e.point.z });
          } else if (activeTool === 'partition' && onFloorClick) {
            onFloorClick({ x: e.point.x, z: e.point.z });
          }
        }}
      >
        <planeGeometry args={[width, depth]} />
        <meshStandardMaterial color={colors.floor} />
      </mesh>

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

      {partitions?.map(p => (
        <PartitionModel
          key={p.id}
          partition={p}
          color={p.color || colors.walls}
          onClick={(e) => {
            e.stopPropagation();
            onPartitionClick?.(p);
          }}
          onOpeningClick={(opId) => onPartitionOpeningClick?.(p.id, opId)}
          onWallClick={(partitionId, point) => {
            if (activeTool === 'window' || activeTool === 'door') {
              onWallClick?.(partitionId, { x: point.x, y: point.y });
            }
          }}
        />
      ))}

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

      <mesh rotation={[Math.PI / 2, 0, 0] as [number, number, number]} position={[0, height, 0]} receiveShadow castShadow={false}>
        <planeGeometry args={[width, depth]} />
        <meshStandardMaterial color={colors.ceiling} />
      </mesh>
    </group>
  );
});