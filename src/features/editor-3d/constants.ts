/**
 * Константы редактора 3D-сцены: размеры по умолчанию, параметры камеры, освещения, управления.
 * Все значения используются в компонентах `EditorScene`, `Room`, `FPSControls` и связанных слайсах.
 * @module editor-3d/constants
 */

import { RoomColors, LightConfig } from './types';

/** Позиция камеры по умолчанию для 3D-вида */
export const DEFAULT_CAMERA_POSITION: [number, number, number] = [5, 5, 5];
/** Поле зрения камеры (градусы) для 3D-вида */
export const DEFAULT_CAMERA_FOV = 50;
/** Скорость движения (м/с) */
export const MOVEMENT_SPEED = 2.5;
/** Скорость бега (м/с) при зажатом Shift */
export const SPRINT_SPEED = 5;
/** Чувствительность мыши */
export const MOUSE_SENSITIVITY = 0.002;
/** Ограничение угла наклона камеры вверх/вниз (радианы) */
export const PITCH_LIMIT = Math.PI / 2.1;
/** Отступы для размещения мебели по X и Z (проценты) */
export const FURNITURE_MARGIN_XZ = 0;
/** Отступы для размещения мебели по Y (проценты) */
export const FURNITURE_MARGIN_Y = 0;
/** Половина ширины модели по умолчанию (если не удалось измерить) */
export const DEFAULT_MODEL_HALF_WIDTH = 0.5;
/** Половина глубины модели по умолчанию */
export const DEFAULT_MODEL_HALF_DEPTH = 0.5;
/** Высота модели по умолчанию */
export const DEFAULT_MODEL_HEIGHT = 0.5;
/** Отступ от стен при движении камеры */
export const CAMERA_MARGIN = 0.1;
/** Фиксированная высота камеры (уровень глаз) */
export const CAMERA_HEIGHT_FIXED = 1.6;
/** Направление "вперёд" для камеры FPS */
export const FORWARD_VECTOR = [0, 0, -1] as const;
/** Направление "вправо" для камеры FPS */
export const RIGHT_VECTOR = [1, 0, 0] as const;
/** Коды клавиш для управления */
export const KEY_W = 'KeyW';
export const KEY_S = 'KeyS';
export const KEY_A = 'KeyA';
export const KEY_D = 'KeyD';
export const KEY_SHIFT_LEFT = 'ShiftLeft';
export const KEY_SHIFT_RIGHT = 'ShiftRight';
/** Размеры комнаты по умолчанию */
export const DEFAULT_ROOM_WIDTH = 4;
export const DEFAULT_ROOM_HEIGHT = 3;
export const DEFAULT_ROOM_DEPTH = 4;
/** Толщина стены */
export const WALL_THICKNESS = 0.2;
/** Зум камеры в 2D-режиме */
export const ZOOM_2D = 80;
/** Высота камеры в режиме FPS */
export const FPS_CAMERA_HEIGHT = 1.6;
/** Поле зрения камеры в режиме FPS */
export const FPS_CAMERA_FOV = 60;
/** Интенсивность фонового освещения (ambient) */
export const AMBIENT_LIGHT_INTENSITY = 0.4;
/** Позиция направленного света */
export const DIRECTIONAL_LIGHT_POSITION: [number, number, number] = [5, 8, 3];
/** Интенсивность направленного света по умолчанию */
export const DIRECTIONAL_LIGHT_INTENSITY = 1.2;
/** Размер карты теней */
export const SHADOW_MAP_SIZE = 1024;
/** Отступ люстры от потолка */
export const CEILING_LIGHT_OFFSET = 0.2;
/** Интенсивность люстры */
export const CEILING_LIGHT_INTENSITY = 1.5;
/** Интенсивность заполняющего света */
export const FILL_LIGHT_INTENSITY = 0.3;
/** Интенсивность ambient по умолчанию (для совместимости) */
export const DEFAULT_AMBIENT_INTENSITY = 0.4;
/** Цвета по умолчанию */
export const DEFAULT_COLORS: RoomColors = {
  walls: '#c0b0a0',
  floor: '#e8e0d0',
  ceiling: '#ffffff',
};
/** Параметры освещения по умолчанию */
export const DEFAULT_LIGHT: LightConfig = {
  intensity: DIRECTIONAL_LIGHT_INTENSITY,
  ambientIntensity: DEFAULT_AMBIENT_INTENSITY,
  color: '#ffffff',
};
/** Предустановки цвета света (для справки) */
export const LIGHT_PRESETS = {
  warm: '#ffcc99',
  cold: '#99ccff',
  neutral: '#ffffff',
};