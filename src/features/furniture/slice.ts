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
    addFurniture(state, action: PayloadAction<FurnitureItem>) {
      state.items.push(action.payload);
    },
    updateFurniture(state, action: PayloadAction<FurnitureItem>) {
      state.items = state.items.map(i => i.id === action.payload.id ? action.payload : i);
      if (state.selectedFurniture?.id === action.payload.id) {
        state.selectedFurniture = action.payload;
      }
    },
    removeFurniture(state, action: PayloadAction<string>) {
      state.items = state.items.filter(i => i.id !== action.payload);
      if (state.selectedFurniture?.id === action.payload) {
        state.selectedFurniture = null;
        state.showFurnitureModal = false;
      }
    },
    setSelectedFurniturePath(state, action: PayloadAction<string | undefined>) {
      state.selectedFurniturePath = action.payload;
    },
    selectFurniture(state, action: PayloadAction<string | null>) {
      const id = action.payload;
      state.selectedFurniture = id ? state.items.find(i => i.id === id) || null : null;
      state.showFurnitureModal = id !== null;
    },
    hideFurnitureModal(state) {
      state.showFurnitureModal = false;
      state.selectedFurniture = null;
    },
    setFurnitureReady(state, action: PayloadAction<{
      itemId: string;
      sizes: { halfWidth: number; halfDepth: number; height: number };
    }>) {},
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
        if (state.selectedFurniture?.id === itemId) {
          state.selectedFurniture = { ...item };
        }
      }
    },
  },
});

export type { FurnitureState };