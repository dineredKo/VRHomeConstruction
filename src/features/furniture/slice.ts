/**
 * Redux Slice для управления мебелью.
 * Содержит редюсеры для добавления, обновления, удаления, выбора мебели, а также загрузки данных проекта и сброса.
 * @module furniture/slice
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FurnitureItem, FurnitureState } from './types';

const initialState: FurnitureState = {
  items: [],
  selectedFurniturePath: undefined,
  selectedFurniture: null,
  showFurnitureModal: false,
};

export const { actions, name, reducer } = createSlice({
  name: 'furniture',
  initialState,
  reducers: {
    /** Добавить новый предмет мебели */
    addFurniture(state, action: PayloadAction<FurnitureItem>) {
      state.items.push(action.payload);
    },
    /** Обновить существующий предмет */
    updateFurniture(state, action: PayloadAction<FurnitureItem>) {
      state.items = state.items.map(i => i.id === action.payload.id ? action.payload : i);
      if (state.selectedFurniture?.id === action.payload.id) {
        state.selectedFurniture = action.payload;
      }
    },
    /** Удалить предмет по id */
    removeFurniture(state, action: PayloadAction<string>) {
      state.items = state.items.filter(i => i.id !== action.payload);
      if (state.selectedFurniture?.id === action.payload) {
        state.selectedFurniture = null;
        state.showFurnitureModal = false;
      }
    },
    /** Установить выбранный путь модели для размещения */
    setSelectedFurniturePath(state, action: PayloadAction<string | undefined>) {
      state.selectedFurniturePath = action.payload;
    },
    /** Выделить предмет мебели для редактирования */
    selectFurniture(state, action: PayloadAction<string | null>) {
      const id = action.payload;
      state.selectedFurniture = id ? state.items.find(i => i.id === id) || null : null;
      state.showFurnitureModal = id !== null;
    },
    /** Закрыть модалку мебели */
    hideFurnitureModal(state) {
      state.showFurnitureModal = false;
      state.selectedFurniture = null;
    },
    /** Запрос на установку размеров (обрабатывается сагой) */
    setFurnitureReady(state, action: PayloadAction<{
      itemId: string;
      sizes: { halfWidth: number; halfDepth: number; height: number };
    }>) {},
    /** Сохранить измеренные размеры модели и скорректировать позицию Y */
    updateFurnitureSizes(state, action: PayloadAction<{
      itemId: string;
      sizes: { halfWidth: number; halfDepth: number; height: number };
    }>) {
      const { itemId, sizes } = action.payload;
      const item = state.items.find(i => i.id === itemId);
      if (item) {
        item.halfWidth = sizes.halfWidth;
        item.halfDepth = sizes.halfDepth;
        item.height = sizes.height;
        if (item.position[1] === 0) {
          item.position[1] = (sizes.height / 2) * item.scale;
        }
        if (state.selectedFurniture?.id === itemId) {
          state.selectedFurniture = { ...item };
        }
      }
    },
    /** Загрузить список мебели из данных проекта */
    loadFurniture(state, action: PayloadAction<FurnitureItem[]>) {
      state.items = action.payload;
    },
    /** Сбросить мебель в начальное состояние */
    resetFurniture(state) {
      state.items = [];
      state.selectedFurniture = null;
      state.showFurnitureModal = false;
    },
  },
});

export type { FurnitureState };