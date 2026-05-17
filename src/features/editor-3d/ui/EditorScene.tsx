import React, { memo } from 'react';
import { Canvas } from '@react-three/fiber';
import { MapControls } from '@react-three/drei';
import { Room } from './Room';
import { FPSControls } from './FPSControls';
import type { ViewMode, RoomColors, Opening, Partition, LightConfig } from '../types';
import type { FurnitureItem } from '@/features/furniture/types';
import styles from './EditorScene.module.scss';
import {
  ZOOM_2D,
  AMBIENT_LIGHT_INTENSITY,
  DIRECTIONAL_LIGHT_POSITION,
  SHADOW_MAP_SIZE,
  CEILING_LIGHT_OFFSET,
  CEILING_LIGHT_INTENSITY,
  FILL_LIGHT_INTENSITY,
  FPS_CAMERA_HEIGHT,
  FPS_CAMERA_FOV,
} from '../constants';
import { getWallCameraPosition } from '../selectors';

export interface RoomDimensions {
  width: number;
  height: number;
  depth: number;
}

const SceneLights = memo<{ height: number; light: LightConfig }>(({ height, light }) => (
  <>
    <ambientLight intensity={AMBIENT_LIGHT_INTENSITY} />
    <directionalLight
      position={DIRECTIONAL_LIGHT_POSITION}
      intensity={light.intensity}
      color="#ffffff"
      castShadow
      shadow-mapSize-width={SHADOW_MAP_SIZE}
      shadow-mapSize-height={SHADOW_MAP_SIZE}
    />
    <pointLight
      position={[0, height - CEILING_LIGHT_OFFSET, 0]}
      intensity={CEILING_LIGHT_INTENSITY}
      distance={Math.max(10, height * 2)}
      castShadow
    />
    <pointLight position={[0, 1.5, 0]} intensity={FILL_LIGHT_INTENSITY} />
  </>
));

interface EditorSceneProps {
  dimensions: RoomDimensions;
  colors: RoomColors;
  light: LightConfig;
  viewMode: ViewMode;
  openings: { [wallId: string]: Opening[] };
  partitions?: Partition[];
  onWallClick?: (wallId: string, point: { x: number; y: number }) => void;
  activeTool?: 'select' | 'window' | 'door' | 'furniture' | 'partition';
  viewedWallId?: string;
  onOpeningClick?: (wallId: string, openingId: string, wallWidth: number, wallHeight: number) => void;
  furnitureItems?: FurnitureItem[];
  onFloorClick?: (point: { x: number; z: number }) => void;
  onFurnitureClick?: (item: FurnitureItem) => void;
  onFurnitureReady?: (itemId: string, info: { halfWidth: number; halfDepth: number; height: number }) => void;
  onPartitionClick?: (partition: Partition) => void;
  onPartitionOpeningClick?: (partitionId: string, openingId: string) => void;
  onPartitionCreateOnWall?: (wallId: string, x: number, z: number) => void;
}

export const EditorScene: React.FC<EditorSceneProps> = ({
  dimensions,
  colors,
  light,
  viewMode,
  openings,
  partitions,
  onWallClick,
  activeTool,
  viewedWallId,
  onOpeningClick,
  furnitureItems,
  onFloorClick,
  onFurnitureClick,
  onFurnitureReady,
  onPartitionClick,
  onPartitionOpeningClick,
  onPartitionCreateOnWall,
}) => {
  const roomComponent = (
    <Room
      dimensions={dimensions}
      colors={colors}
      openings={openings}
      partitions={partitions}
      onWallClick={onWallClick}
      activeTool={activeTool}
      onOpeningClick={onOpeningClick}
      furnitureItems={furnitureItems}
      onFloorClick={onFloorClick}
      onFurnitureClick={onFurnitureClick}
      onFurnitureReady={onFurnitureReady}
      onPartitionClick={onPartitionClick}
      onPartitionOpeningClick={onPartitionOpeningClick}
      onPartitionCreateOnWall={onPartitionCreateOnWall}
    />
  );

  if (viewMode === '2d' && viewedWallId) {
    const camPos = getWallCameraPosition(viewedWallId, dimensions);
    return (
      <div className={styles.sceneContainer}>
        <Canvas key="2d-wall" orthographic camera={{ zoom: ZOOM_2D, position: camPos, near: 0.1, far: 100 }} shadows>
          <color attach="background" args={['#f0f0f0']} />
          <SceneLights height={dimensions.height} light={light} />
          {roomComponent}
          <MapControls enableRotate={false} enableZoom={true} screenSpacePanning={true} panSpeed={1} zoomSpeed={1.5} />
        </Canvas>
      </div>
    );
  }

  return (
    <div className={styles.sceneContainer}>
      <Canvas key="3d-fps" camera={{ position: [0, FPS_CAMERA_HEIGHT, 0], fov: FPS_CAMERA_FOV }} shadows>
        <color attach="background" args={['#f0f0f0']} />
        <SceneLights height={dimensions.height} light={light} />
        {roomComponent}
        <FPSControls roomWidth={dimensions.width} roomDepth={dimensions.depth} />
        <gridHelper args={[10, 10, '#cccccc', '#e0e0e0']} visible={false} />
      </Canvas>
      <div className={styles.controlsHint}>
        🖱️ Зажмите левую кнопку мыши, чтобы осмотреться<br />
        ⌨️ WASD – ходьба, Shift – ускорение
      </div>
    </div>
  );
};