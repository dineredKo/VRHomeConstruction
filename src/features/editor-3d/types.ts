/**
 * Типы и интерфейсы для редактора 3D-сцены.
 * Включает описание проёмов, состояния редактора, инструментов и конфигурации освещения.
 * @module editor-3d/types
 */

import { RoomDimensions } from './ui/EditorScene';

/**
 * Проём (окно или дверь) на стене.
 */
export interface Opening {
  /** Уникальный идентификатор */
  id: string;
  /** Идентификатор стены, к которой привязан проём */
  wallId: string;
  /** Тип проёма: окно или дверь */
  type: 'window' | 'door';
  /** Позиция центра проёма в локальных координатах стены [x, y] */
  position: [number, number];
  /** Ширина проёма (метры) */
  width: number;
  /** Высота проёма (метры) */
  height: number;
}

/**
 * Режим отображения сцены.
 */
export type ViewMode = '2d' | '3d' | 'vr';

/**
 * Инструмент, выбранный пользователем в редакторе.
 */
export type Tool = 'select' | 'window' | 'door' | 'furniture';

/**
 * Цвета элементов комнаты.
 */
export interface RoomColors {
  /** Цвет стен */
  walls: string;
  /** Цвет пола */
  floor: string;
  /** Цвет потолка */
  ceiling: string;
}

/**
 * Описание одной стены для построения геометрии.
 */
export interface WallData {
  /** Идентификатор стены ('front', 'back', 'left', 'right') */
  id: string;
  /** Позиция центра стены в мировых координатах */
  pos: [number, number, number];
  /** Поворот стены [x, y, z] */
  rot: [number, number, number];
  /** Ширина и высота стены */
  size: [number, number];
}

/**
 * Перегородка (внутренняя стена), которую можно добавить в комнату.
 */
export interface Partition {
  /** Уникальный идентификатор */
  id: string;
  /** Центр перегородки в мировых координатах */
  position: [number, number, number];
  /** Поворот [x, y, z] */
  rotation: [number, number, number];
  /** Габариты: ширина, высота, толщина */
  size: [number, number, number];
  /** Проёмы (окна/двери) внутри перегородки */
  openings: Opening[];
}

/**
 * Конфигурация освещения в сцене.
 */
export interface LightConfig {
  /** Интенсивность направленного света */
  intensity: number;
  /** Интенсивность окружающего (ambient) света */
  ambientIntensity: number;
  /** Цвет основного направленного света */
  color: string;
}

/**
 * Полное состояние редактора 3D-сцены (Redux slice).
 */
export interface EditorState {
  /** Размеры комнаты */
  dimensions: RoomDimensions;
  /** Цвета стен, пола, потолка */
  colors: RoomColors;
  /** Конфигурация освещения */
  light: LightConfig;
  /** Текущий режим просмотра */
  viewMode: ViewMode;
  /** Активный инструмент */
  activeTool: Tool;
  /** Проёмы, сгруппированные по идентификатору стены */
  openings: { [wallId: string]: Opening[] };
  /** Список перегородок */
  partitions: Partition[];
  /** Цвета перегородок (ключ – id перегородки) */
  partitionColors: { [partitionId: string]: string };
  /** Идентификатор стены, выбранной для просмотра в 2D */
  viewedWallId: string;
  /** Выбранный пользователем проём для редактирования */
  selectedOpening: {
    wallId: string;
    opening: Opening;
    wallWidth: number;
    wallHeight: number;
  } | null;
  /** Выбранная перегородка для редактирования */
  selectedPartition: Partition | null;
  /** ID текущего открытого проекта */
  currentProjectId: string | null;
}