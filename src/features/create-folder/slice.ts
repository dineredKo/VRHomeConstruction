import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Folder } from './types'

export interface CreateFolderState {
  folderName: string;
  isLoading: boolean;
  error: string | null;
}

const initialState: CreateFolderState = {
  folderName: '',
  isLoading: false,
  error: null,
};

export const { actions, name, reducer } = createSlice({
  name: 'createFolder',
  initialState,
  reducers: {
    setFolderName: (state, action: PayloadAction<string>) => {
      state.folderName = action.payload;
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
      state.folderName = '';
      state.isLoading = false;
      state.error = null;
    },
    createFolderRequested: (state) => {
    },
  },
});