/**
 * Компонент сцены редактора.
 * Переключает 2D (вид на стену) и 3D (от первого лица) режимы.
 * @module editor-3d/ui/EditorScene
 */

import React, { memo } from 'react';
import { Canvas } from '@react-three/fiber';
import { MapControls } from '@react-three/drei';
import * as THREE from 'three';
import { Room } from './Room';
import { FPSControls } from './FPSControls';
import type { ViewMode, RoomColors, Opening, LightConfig } from '../types';
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

/** Интерфейс размеров комнаты */
export interface RoomDimensions {
  width: number;
  height: number;
  depth: number;
}

/**
 * Стабильный источник света, мемоизирован, чтобы избежать пересоздания при обновлении мебели.
 */
const SceneLights = memo<{ height: number; light: LightConfig }>(({ height, light }) => (
  <>
    <ambientLight intensity={light.ambientIntensity} />
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
  onWallClick?: (wallId: string, point: { x: number; y: number }) => void;
  activeTool?: 'select' | 'window' | 'door' | 'furniture';
  viewedWallId?: string;
  onOpeningClick?: (wallId: string, openingId: string, wallWidth: number, wallHeight: number) => void;
  furnitureItems?: FurnitureItem[];
  onFloorClick?: (point: { x: number; z: number }) => void;
  onFurnitureClick?: (item: FurnitureItem) => void;
  onFurnitureReady?: (itemId: string, info: { halfWidth: number; halfDepth: number; height: number }) => void;
}

/**
 * Основной компонент сцены редактора.
 * Рендерит Canvas с комнатой, освещением, элементами управления и мебелью.
 */
export const EditorScene: React.FC<EditorSceneProps> = ({
  dimensions,
  colors,
  light,
  viewMode,
  openings,
  onWallClick,
  activeTool,
  viewedWallId,
  onOpeningClick,
  furnitureItems,
  onFloorClick,
  onFurnitureClick,
  onFurnitureReady,
}) => {
  const roomComponent = (
    <Room
      dimensions={dimensions}
      colors={colors}
      openings={openings}
      onWallClick={onWallClick}
      activeTool={activeTool}
      onOpeningClick={onOpeningClick}
      furnitureItems={furnitureItems}
      onFloorClick={onFloorClick}
      onFurnitureClick={onFurnitureClick}
      onFurnitureReady={onFurnitureReady}
    />
  );

  if (viewMode === '2d' && viewedWallId) {
    const camPos = getWallCameraPosition(viewedWallId, dimensions);
    return (
      <div className={styles.sceneContainer}>
        <Canvas
          key="2d-wall"
          orthographic
          camera={{ zoom: ZOOM_2D, position: camPos, near: 0.1, far: 100 }}
          shadows
          onCreated={({ gl }) => { gl.shadowMap.type = THREE.PCFShadowMap; }}
        >
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
      <Canvas
        key="3d-fps"
        camera={{ position: [0, FPS_CAMERA_HEIGHT, 0], fov: FPS_CAMERA_FOV }}
        shadows
        onCreated={({ gl }) => { gl.shadowMap.type = THREE.PCFShadowMap; }}
      >
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