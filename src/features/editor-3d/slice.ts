import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { EditorState, Opening, RoomColors, ViewMode, Tool, Partition, LightConfig } from './types';
import { DEFAULT_ROOM_WIDTH, DEFAULT_ROOM_HEIGHT, DEFAULT_ROOM_DEPTH, DEFAULT_COLORS, DEFAULT_LIGHT } from './constants';
import { RoomDimensions } from './ui/EditorScene';

const initialState: EditorState = {
  dimensions: { width: DEFAULT_ROOM_WIDTH, height: DEFAULT_ROOM_HEIGHT, depth: DEFAULT_ROOM_DEPTH },
  colors: DEFAULT_COLORS,
  light: DEFAULT_LIGHT,
  viewMode: '3d',
  activeTool: 'select',
  openings: {},
  partitions: [],
  viewedWallId: 'front',
  selectedOpening: null,
  selectedPartition: null,
};

export const { actions, name, reducer } = createSlice({
  name: 'editor',
  initialState,
  reducers: {
    setDimensions(state, action: PayloadAction<RoomDimensions>) { state.dimensions = action.payload; },
    setColors(state, action: PayloadAction<RoomColors>) { state.colors = action.payload; },
    setLight(state, action: PayloadAction<LightConfig>) { state.light = action.payload; },
    setViewMode(state, action: PayloadAction<ViewMode>) { state.viewMode = action.payload; },
    setActiveTool(state, action: PayloadAction<Tool>) { state.activeTool = action.payload; },
    createOpeningRequested(state, action: PayloadAction<{ wallId: string; point: { x: number; y: number } }>) {},
    addOpening(state, action: PayloadAction<{ wallId: string; opening: Opening }>) {
      const { wallId, opening } = action.payload;
      if (!state.openings[wallId]) state.openings[wallId] = [];
      state.openings[wallId].push(opening);
    },
    updateOpening(state, action: PayloadAction<{ wallId: string; opening: Opening }>) {
      const { wallId, opening } = action.payload;
      if (state.openings[wallId]) {
        state.openings[wallId] = state.openings[wallId].map(o => o.id === opening.id ? opening : o);
      }
    },
    deleteOpeningRequested(state, action: PayloadAction<{ openingId: string }>) {},
    removeOpening(state, action: PayloadAction<{ wallId: string; openingId: string }>) {
      const { wallId, openingId } = action.payload;
      if (state.openings[wallId]) {
        state.openings[wallId] = state.openings[wallId].filter(o => o.id !== openingId);
        if (state.openings[wallId].length === 0) delete state.openings[wallId];
      }
    },
    setViewedWallId(state, action: PayloadAction<string>) { state.viewedWallId = action.payload; },
    setSelectedOpening(state, action: PayloadAction<EditorState['selectedOpening']>) { state.selectedOpening = action.payload; },
    addPartition(state, action: PayloadAction<Partition>) { state.partitions.push(action.payload); },
    updatePartition(state, action: PayloadAction<Partition>) {
      const updated = action.payload;
      state.partitions = state.partitions.map(p => p.id === updated.id ? updated : p);
      if (state.selectedPartition?.id === updated.id) {
        state.selectedPartition = updated;
      }
    },
    removePartition(state, action: PayloadAction<string>) {
      state.partitions = state.partitions.filter(p => p.id !== action.payload);
      if (state.selectedPartition?.id === action.payload) {
        state.selectedPartition = null;
      }
    },
    setSelectedPartition(state, action: PayloadAction<Partition | null>) { state.selectedPartition = action.payload; },
    addOpeningToPartition(state, action: PayloadAction<{ partitionId: string; opening: Opening }>) {
      const partition = state.partitions.find(p => p.id === action.payload.partitionId);
      if (partition) partition.openings.push(action.payload.opening);
    },
    removeOpeningFromPartition(state, action: PayloadAction<{ partitionId: string; openingId: string }>) {
      const partition = state.partitions.find(p => p.id === action.payload.partitionId);
      if (partition) partition.openings = partition.openings.filter(o => o.id !== action.payload.openingId);
    },
  },
});

export type { EditorState };