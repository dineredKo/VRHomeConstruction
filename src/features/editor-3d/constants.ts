import { RoomColors, LightConfig } from './types';

export const DEFAULT_CAMERA_POSITION: [number, number, number] = [5, 5, 5];
export const DEFAULT_CAMERA_FOV = 50;
export const MOVEMENT_SPEED = 2.5;
export const SPRINT_SPEED = 5;
export const MOUSE_SENSITIVITY = 0.002;
export const PITCH_LIMIT = Math.PI / 2.1;
export const FURNITURE_MARGIN_XZ = 0;
export const FURNITURE_MARGIN_Y = 0;
export const DEFAULT_MODEL_HALF_WIDTH = 0.5;
export const DEFAULT_MODEL_HALF_DEPTH = 0.5;
export const DEFAULT_MODEL_HEIGHT = 0.5;
export const CAMERA_MARGIN = 0.1;
export const CAMERA_HEIGHT_FIXED = 1.6;
export const FORWARD_VECTOR = [0, 0, -1] as const;
export const RIGHT_VECTOR = [1, 0, 0] as const;
export const KEY_W = 'KeyW';
export const KEY_S = 'KeyS';
export const KEY_A = 'KeyA';
export const KEY_D = 'KeyD';
export const KEY_SHIFT_LEFT = 'ShiftLeft';
export const KEY_SHIFT_RIGHT = 'ShiftRight';
export const DEFAULT_ROOM_WIDTH = 4;
export const DEFAULT_ROOM_HEIGHT = 3;
export const DEFAULT_ROOM_DEPTH = 4;
export const WALL_THICKNESS = 0.2;
export const ZOOM_2D = 80;
export const FPS_CAMERA_HEIGHT = 1.6;
export const FPS_CAMERA_FOV = 60;
export const AMBIENT_LIGHT_INTENSITY = 0.4;
export const DIRECTIONAL_LIGHT_POSITION: [number, number, number] = [5, 8, 3];
export const DIRECTIONAL_LIGHT_INTENSITY = 1.2;
export const SHADOW_MAP_SIZE = 1024;
export const CEILING_LIGHT_OFFSET = 0.2;
export const CEILING_LIGHT_INTENSITY = 1.5;
export const FILL_LIGHT_INTENSITY = 0.3;
export const DEFAULT_COLORS: RoomColors = {
  walls: '#c0b0a0',
  floor: '#e8e0d0',
  ceiling: '#ffffff',
};
export const DEFAULT_LIGHT: LightConfig = {
  intensity: 1.2,
  color: '#ffffff',
};
export const LIGHT_PRESETS = {
  warm: '#ffcc99',
  cold: '#99ccff',
  neutral: '#ffffff',
};
