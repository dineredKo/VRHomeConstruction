export interface FurnitureItem {
  id: string;
  name: string;
  modelPath: string;
  position: [number, number, number];
  scale: number;
  rotation: [number, number, number];
  halfWidth?: number;
  halfDepth?: number;
  height?: number;
}

export interface FurnitureState {
  items: FurnitureItem[];
  selectedFurniturePath?: string;
  selectedFurniture: FurnitureItem | null;
  showFurnitureModal: boolean;
}