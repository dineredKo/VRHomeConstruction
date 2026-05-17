import { RoomDimensions } from './ui/EditorScene';

export interface Opening {
  id: string;
  wallId: string;
  type: 'window' | 'door';
  position: [number, number];
  width: number;
  height: number;
}

export type ViewMode = '2d' | '3d' | 'vr';
export type Tool = 'select' | 'window' | 'door' | 'furniture' | 'partition';

export interface RoomColors {
  walls: string;
  floor: string;
  ceiling: string;
}

export interface WallData {
  id: string;
  pos: [number, number, number];
  rot: [number, number, number];
  size: [number, number];
}

export interface Partition {
  id: string;
  position: [number, number, number];
  rotation: [number, number, number];
  size: [number, number, number];
  openings: Opening[];
  color?: string;
}

export interface LightConfig {
  intensity: number;
  color: string;
}

export interface EditorState {
  dimensions: RoomDimensions;
  colors: RoomColors;
  light: LightConfig;
  viewMode: ViewMode;
  activeTool: Tool;
  openings: { [wallId: string]: Opening[] };
  partitions: Partition[];
  viewedWallId: string;
  selectedOpening: {
    wallId: string;
    opening: Opening;
    wallWidth: number;
    wallHeight: number;
  } | null;
  selectedPartition: Partition | null;
}