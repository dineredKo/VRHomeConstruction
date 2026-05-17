import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Layout } from './types';

export interface CreateLayoutState {
  layoutName: string;
  isLoading: boolean;
  error: string | null;
  layouts: Layout[];
}

const initialState: CreateLayoutState = {
  layoutName: '',
  isLoading: false,
  error: null,
  layouts: [],
};

export const { actions, name, reducer } = createSlice({
  name: 'createLayout',
  initialState,
  reducers: {
    setLayoutName: (state, action: PayloadAction<string>) => {
      state.layoutName = action.payload;
      state.error = null;
    },
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    resetForm: (state) => {
      state.layoutName = '';
      state.isLoading = false;
      state.error = null;
    },
    addLayout: (state, action: PayloadAction<Layout>) => {
      state.layouts.push(action.payload);
    },
    removeLayout: (state, action: PayloadAction<string>) => {
      state.layouts = state.layouts.filter(l => l.id !== action.payload);
    },
    createLayoutRequested: (state) => {
    },
  },
});