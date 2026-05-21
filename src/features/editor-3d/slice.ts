/**
 * Redux Slice редактора 3D-сцены.
 * Управляет размерами комнаты, цветами, освещением, проёмами, перегородками и активным инструментом.
 * @module editor-3d/slice
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { EditorState, Opening, RoomColors, ViewMode, Tool, Partition, LightConfig } from './types';
import { DEFAULT_ROOM_WIDTH, DEFAULT_ROOM_HEIGHT, DEFAULT_ROOM_DEPTH, DEFAULT_COLORS, DEFAULT_LIGHT } from './constants';
import { RoomDimensions } from './ui/EditorScene';

/** Начальное состояние редактора */
const initialState: EditorState = {
  dimensions: { width: DEFAULT_ROOM_WIDTH, height: DEFAULT_ROOM_HEIGHT, depth: DEFAULT_ROOM_DEPTH },
  colors: DEFAULT_COLORS,
  light: DEFAULT_LIGHT,
  viewMode: '3d',
  activeTool: 'select',
  openings: {},
  partitions: [],
  partitionColors: {},
  furnitureItems: [],
  viewedWallId: 'front',
  selectedOpening: null,
  selectedPartition: null,
};

export const { actions, name, reducer } = createSlice({
  name: 'editor',
  initialState,
  reducers: {
    /** Установить новые размеры комнаты */
    setDimensions(state, action: PayloadAction<RoomDimensions>) { state.dimensions = action.payload; },
    /** Установить цвета стен, пола и потолка */
    setColors(state, action: PayloadAction<RoomColors>) { state.colors = action.payload; },
    /** Обновить конфигурацию освещения */
    setLight(state, action: PayloadAction<LightConfig>) { state.light = action.payload; },
    /** Установить режим просмотра (2D/3D/VR) */
    setViewMode(state, action: PayloadAction<ViewMode>) { state.viewMode = action.payload; },
    /** Выбрать активный инструмент */
    setActiveTool(state, action: PayloadAction<Tool>) { state.activeTool = action.payload; },
    /** Запрос на создание проёма (обрабатывается сагой) */
    createOpeningRequested(state, action: PayloadAction<{ wallId: string; point: { x: number; y: number } }>) {},
    /** Добавить проём на стену */
    addOpening(state, action: PayloadAction<{ wallId: string; opening: Opening }>) {
      const { wallId, opening } = action.payload;
      if (!state.openings[wallId]) state.openings[wallId] = [];
      state.openings[wallId].push(opening);
    },
    /** Обновить параметры существующего проёма */
    updateOpening(state, action: PayloadAction<{ wallId: string; opening: Opening }>) {
      const { wallId, opening } = action.payload;
      if (state.openings[wallId]) {
        state.openings[wallId] = state.openings[wallId].map(o => o.id === opening.id ? opening : o);
      }
    },
    /** Запрос на удаление проёма (обрабатывается сагой) */
    deleteOpeningRequested(state, action: PayloadAction<{ openingId: string }>) {},
    /** Удалить проём со стены */
    removeOpening(state, action: PayloadAction<{ wallId: string; openingId: string }>) {
      const { wallId, openingId } = action.payload;
      if (state.openings[wallId]) {
        state.openings[wallId] = state.openings[wallId].filter(o => o.id !== openingId);
        if (state.openings[wallId].length === 0) delete state.openings[wallId];
      }
    },
    /** Установить идентификатор стены, просматриваемой в 2D */
    setViewedWallId(state, action: PayloadAction<string>) { state.viewedWallId = action.payload; },
    /** Выделить проём для редактирования */
    setSelectedOpening(state, action: PayloadAction<EditorState['selectedOpening']>) { state.selectedOpening = action.payload; },
    /** Добавить перегородку */
    addPartition(state, action: PayloadAction<Partition>) { state.partitions.push(action.payload); },
    /** Обновить перегородку */
    updatePartition(state, action: PayloadAction<Partition>) {
      state.partitions = state.partitions.map(p => p.id === action.payload.id ? action.payload : p);
      if (state.selectedPartition?.id === action.payload.id) {
        state.selectedPartition = action.payload;
      }
    },
    /** Удалить перегородку и её цвет */
    removePartition(state, action: PayloadAction<string>) {
      state.partitions = state.partitions.filter(p => p.id !== action.payload);
      delete state.partitionColors[action.payload];
      if (state.selectedPartition?.id === action.payload) {
        state.selectedPartition = null;
      }
    },
    /** Выделить перегородку для редактирования */
    setSelectedPartition(state, action: PayloadAction<Partition | null>) { state.selectedPartition = action.payload; },
    /** Добавить проём в перегородку */
    addOpeningToPartition(state, action: PayloadAction<{ partitionId: string; opening: Opening }>) {
      const partition = state.partitions.find(p => p.id === action.payload.partitionId);
      if (partition) partition.openings.push(action.payload.opening);
    },
    /** Удалить проём из перегородки */
    removeOpeningFromPartition(state, action: PayloadAction<{ partitionId: string; openingId: string }>) {
      const partition = state.partitions.find(p => p.id === action.payload.partitionId);
      if (partition) partition.openings = partition.openings.filter(o => o.id !== action.payload.openingId);
    },
    /** Задать цвет перегородки */
    setPartitionColor(state, action: PayloadAction<{ partitionId: string; color: string }>) {
      state.partitionColors[action.payload.partitionId] = action.payload.color;
    },
    /** Удалить цвет перегородки */
    removePartitionColor(state, action: PayloadAction<string>) {
      delete state.partitionColors[action.payload];
    },
     /** Загрузить полное состояние редактора из данных проекта */
    loadProjectData(state, action: PayloadAction<Partial<EditorState>>) {
      if (action.payload.dimensions) state.dimensions = action.payload.dimensions;
      if (action.payload.colors) state.colors = action.payload.colors;
      if (action.payload.light) state.light = action.payload.light;
      if (action.payload.viewMode) state.viewMode = action.payload.viewMode;
      if (action.payload.activeTool) state.activeTool = action.payload.activeTool;
      if (action.payload.openings) state.openings = action.payload.openings;
      if (action.payload.partitions) state.partitions = action.payload.partitions;
      if (action.payload.furnitureItems) state.furnitureItems = action.payload.furnitureItems;
      if (action.payload.partitionColors) state.partitionColors = action.payload.partitionColors;
      if (action.payload.viewedWallId) state.viewedWallId = action.payload.viewedWallId;
      if (action.payload.selectedOpening) state.selectedOpening = action.payload.selectedOpening;
      if (action.payload.selectedPartition) state.selectedPartition = action.payload.selectedPartition;
    },
    /** Сбросить редактор в начальное состояние */
    resetEditor() {
      return initialState;
    },
  },
});

export type { EditorState };