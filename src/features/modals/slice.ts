import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ModalsState } from './types';

const initialState: ModalsState = {
  isCreateProjectModalOpen: false,
  isCreateFolderModalOpen: false,
  isCreateLayoutModalOpen: false,
  projectCreationError: null,
  folderCreationError: null,
  layoutCreationError: null,
};

export const { actions, name, reducer } = createSlice({
  name: 'modals',
  initialState,
  reducers: {
    openCreateProjectModal: (state) => {
      state.isCreateProjectModalOpen = true;
      state.projectCreationError = null;
    },
    closeCreateProjectModal: (state) => {
      state.isCreateProjectModalOpen = false;
    },
    openCreateFolderModal: (state) => {
      state.isCreateFolderModalOpen = true;
      state.folderCreationError = null;
    },
    closeCreateFolderModal: (state) => {
      state.isCreateFolderModalOpen = false;
    },
    openCreateLayoutModal: (state) => {
      state.isCreateLayoutModalOpen = true;
      state.layoutCreationError = null;
    },
    closeCreateLayoutModal: (state) => {
      state.isCreateLayoutModalOpen = false;
    },
    setProjectCreationError: (state, action: PayloadAction<string | null>) => {
      state.projectCreationError = action.payload;
    },
    setFolderCreationError: (state, action: PayloadAction<string | null>) => {
      state.folderCreationError = action.payload;
    },
    setLayoutCreationError: (state, action: PayloadAction<string | null>) => {
      state.layoutCreationError = action.payload;
    },
  },
});