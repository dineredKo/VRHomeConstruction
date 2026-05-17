import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Folder } from './types';

export interface FoldersState {
  folders: Folder[];
  isLoading: boolean;
  error: string | null;
  activeMenuId: string | null;
  activeFolderId: string | null;
}

const initialState: FoldersState = {
  folders: [],
  isLoading: false,
  error: null,
  activeMenuId: null,
  activeFolderId: null,
};

export const { actions, name, reducer } = createSlice({
  name: 'folders',
  initialState,
  reducers: {
    addFolder: (state, action: PayloadAction<Omit<Folder, 'createdAt' | 'projectIds' | 'layoutIds' | 'childFolderIds'>>) => {
      const newFolder: Folder = {
        ...action.payload,
        createdAt: new Date().toISOString(),
        projectIds: [],
        layoutIds: [],
        childFolderIds: [],
      };
      state.folders.push(newFolder);
    },
    removeFolder: (state, action: PayloadAction<string>) => {
      state.folders = state.folders.filter(f => f.id !== action.payload);
    },
    addProjectToFolder: (state, action: PayloadAction<{ folderId: string; projectId: string }>) => {
      const folder = state.folders.find(f => f.id === action.payload.folderId);
      if (folder && !folder.projectIds.includes(action.payload.projectId)) {
        folder.projectIds.push(action.payload.projectId);
      }
    },
    addLayoutToFolder: (state, action: PayloadAction<{ folderId: string; layoutId: string }>) => {
      const folder = state.folders.find(f => f.id === action.payload.folderId);
      if (folder && !folder.layoutIds.includes(action.payload.layoutId)) {
        folder.layoutIds.push(action.payload.layoutId);
      }
    },
    addFolderToFolder: (state, action: PayloadAction<{ parentFolderId: string; childFolderId: string }>) => {
      const folder = state.folders.find(f => f.id === action.payload.parentFolderId);
      if (folder && !folder.childFolderIds.includes(action.payload.childFolderId)) {
        folder.childFolderIds.push(action.payload.childFolderId);
      }
    },
    removeProjectFromFolder: (state, action: PayloadAction<{ folderId: string; projectId: string }>) => {
      const folder = state.folders.find(f => f.id === action.payload.folderId);
      if (folder) {
        folder.projectIds = folder.projectIds.filter(id => id !== action.payload.projectId);
      }
    },
    removeLayoutFromFolder: (state, action: PayloadAction<{ folderId: string; layoutId: string }>) => {
      const folder = state.folders.find(f => f.id === action.payload.folderId);
      if (folder) {
        folder.layoutIds = folder.layoutIds.filter(id => id !== action.payload.layoutId);
      }
    },
    removeFolderFromFolder: (state, action: PayloadAction<{ parentFolderId: string; childFolderId: string }>) => {
      const folder = state.folders.find(f => f.id === action.payload.parentFolderId);
      if (folder) {
        folder.childFolderIds = folder.childFolderIds.filter(id => id !== action.payload.childFolderId);
      }
    },
    setFoldersLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setFoldersError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setActiveMenuId: (state, action: PayloadAction<string | null>) => {
      state.activeMenuId = action.payload;
    },
    setActiveFolderId: (state, action: PayloadAction<string | null>) => {
      state.activeFolderId = action.payload;
    },
  },
});