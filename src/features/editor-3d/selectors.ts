import { createSelector } from '@reduxjs/toolkit';
import { name, EditorState } from './slice';
import { RoomDimensions } from './ui/EditorScene';

type State = {
  [name]: EditorState;
};

const root = (state: State) => state[name];

const selectEditor = createSelector(root, (state) => state);
const selectDimensions = createSelector(root, (state) => state?.dimensions);
const selectColors = createSelector(root, (state) => state?.colors);
const selectLight = createSelector(root, (state) => state?.light);
const selectViewMode = createSelector(root, (state) => state?.viewMode);
const selectActiveTool = createSelector(root, (state) => state?.activeTool);
const selectOpenings = createSelector(root, (state) => state?.openings ?? {});
const selectViewedWallId = createSelector(root, (state) => state?.viewedWallId ?? 'front');
const selectSelectedOpening = createSelector(root, (state) => state?.selectedOpening);
const selectPartitions = createSelector(root, (state) => state?.partitions ?? []);
const selectSelectedPartition = createSelector(root, (state) => state?.selectedPartition);

export const getWallCameraPosition = (wallId: string, dimensions: RoomDimensions): [number, number, number] => {
  const { width, height, depth } = dimensions;
  switch (wallId) {
    case 'front': return [0, height / 2, depth / 2 + 0.5];
    case 'back': return [0, height / 2, -depth / 2 - 0.5];
    case 'left': return [-width / 2 - 0.5, height / 2, 0];
    case 'right': return [width / 2 + 0.5, height / 2, 0];
    default: return [0, height / 2, depth / 2 + 0.5];
  }
};

export const getWallsData = (width: number, height: number, depth: number) => [
  { id: 'back',  pos: [0, height / 2, -depth / 2] as [number,number,number], rot: [0, 0, 0] as [number,number,number], size: [width, height] as [number,number] },
  { id: 'left',  pos: [-width / 2, height / 2, 0],         rot: [0, Math.PI / 2, 0],             size: [depth, height] },
  { id: 'right', pos: [width / 2, height / 2, 0],          rot: [0, -Math.PI / 2, 0],            size: [depth, height] },
  { id: 'front', pos: [0, height / 2, depth / 2],          rot: [0, 0, 0],                        size: [width, height] },
];

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
};