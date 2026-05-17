/**
 * Типы для фичи мебели.
 * Описывает предмет мебели и состояние хранилища.
 * @module furniture/types
 */

/**
 * Предмет мебели, размещённый в комнате.
 */
export interface FurnitureItem {
  id: string;
  name: string;
  modelPath: string;
  position: [number, number, number];
  scale: number;
  rotation: [number, number, number];
  /** Половина ширины модели (если измерена) */
  halfWidth?: number;
  /** Половина глубины модели (если измерена) */
  halfDepth?: number;
  /** Высота модели (если измерена) */
  height?: number;
}

/**
 * Состояние мебели в Redux.
 */
export interface FurnitureState {
  items: FurnitureItem[];
  selectedFurniturePath?: string;
  selectedFurniture: FurnitureItem | null;
  showFurnitureModal: boolean;
}