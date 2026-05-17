/**
 * Селекторы для редактора 3D-сцены.
 * Предоставляют мемоизированный доступ к состоянию редактора.
 * @module editor-3d/selectors
 */

import { createSelector } from '@reduxjs/toolkit';
import { name, EditorState } from './slice';
import { RoomDimensions } from './ui/EditorScene';
import type { RootState } from '@/app/store';

type State = {
  [name]: EditorState;
};

const root = (state: State) => state[name];

/** Полное состояние редактора */
const selectEditor = createSelector(root, (state) => state);
/** Размеры комнаты */
const selectDimensions = createSelector(root, (state) => state?.dimensions);
/** Цвета стен/пола/потолка */
const selectColors = createSelector(root, (state) => state?.colors);
/** Конфигурация освещения */
const selectLight = createSelector(root, (state) => state?.light);
/** Текущий режим просмотра */
const selectViewMode = createSelector(root, (state) => state?.viewMode);
/** Активный инструмент */
const selectActiveTool = createSelector(root, (state) => state?.activeTool);
/** Проёмы на стенах */
const selectOpenings = createSelector(root, (state) => state?.openings ?? {});
/** Стена, выбранная для 2D-просмотра */
const selectViewedWallId = createSelector(root, (state) => state?.viewedWallId ?? 'front');
/** Выбранный проём для редактирования */
const selectSelectedOpening = createSelector(root, (state) => state?.selectedOpening);
/** Все перегородки */
const selectPartitions = createSelector(root, (state) => state?.partitions ?? []);
/** Выбранная перегородка */
const selectSelectedPartition = createSelector(root, (state) => state?.selectedPartition);
/** Цвета перегородок */
const selectPartitionColors = createSelector(root, (state) => state?.partitionColors ?? {});

/**
 * Мемоизированный селектор цвета конкретной перегородки.
 * @param state - корневой стейт Redux
 * @param partitionId - ID перегородки
 * @returns Цвет перегородки или цвет по умолчанию
 */
export const selectPartitionColor = createSelector(
  [selectPartitionColors, (_: RootState, partitionId: string) => partitionId],
  (colors, partitionId): string => colors[partitionId] || '#c0b0a0'
);

/**
 * Возвращает позицию камеры для просмотра конкретной стены в 2D.
 * @param wallId - идентификатор стены
 * @param dimensions - размеры комнаты
 * @returns Кортеж [x, y, z]
 */
export const getWallCameraPosition = (
  wallId: string,
  dimensions: RoomDimensions
): [number, number, number] => {
  const { width, height, depth } = dimensions;
  switch (wallId) {
    case 'front': return [0, height / 2, depth / 2 + 0.5];
    case 'back': return [0, height / 2, -depth / 2 - 0.5];
    case 'left': return [-width / 2 - 0.5, height / 2, 0];
    case 'right': return [width / 2 + 0.5, height / 2, 0];
    default: return [0, height / 2, depth / 2 + 0.5];
  }
};

/**
 * Генерирует массив описаний четырёх стен комнаты.
 * @param width - ширина комнаты
 * @param height - высота комнаты
 * @param depth - глубина комнаты
 * @returns Массив объектов WallData
 */
export const getWallsData = (width: number, height: number, depth: number) => [
  { id: 'back',  pos: [0, height / 2, -depth / 2] as [number,number,number], rot: [0, 0, 0] as [number,number,number], size: [width, height] as [number,number] },
  { id: 'left',  pos: [-width / 2, height / 2, 0],         rot: [0, Math.PI / 2, 0],             size: [depth, height] },
  { id: 'right', pos: [width / 2, height / 2, 0],          rot: [0, -Math.PI / 2, 0],            size: [depth, height] },
  { id: 'front', pos: [0, height / 2, depth / 2],          rot: [0, 0, 0],                        size: [width, height] },
];

/** Объект с именованными селекторами для удобного импорта */
export const selectors = {
  selectEditor,
  selectDimensions,
  selectColors,
  selectLight,
  selectViewMode,
  selectActiveTool,
  selectOpenings,
  selectViewedWallId,
  selectSelectedOpening,
  selectPartitions,
  selectSelectedPartition,
  selectPartitionColors,
};