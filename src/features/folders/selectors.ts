import { createSelector } from '@reduxjs/toolkit';
import { name } from './slice';
import { FoldersState } from './types';

type State = {
  [name]: FoldersState;
};

const root = (state: State) => state[name];

const selectFolders = createSelector(root, (folders) => folders?.folders ?? []);
const selectFolderById = createSelector(
  [root, (_, id: string) => id],
  (folders, id) => folders?.folders.find(f => f.id === id)
);
const selectFoldersLoading = createSelector(root, (folders) => folders?.isLoading ?? false);
const selectFoldersError = createSelector(root, (folders) => folders?.error);
const selectActiveMenuId = createSelector(root, (folders) => folders?.activeMenuId ?? null);
const selectActiveFolderId = createSelector(root, (folders) => folders?.activeFolderId ?? null);

export const selectors = {
  selectFolders,
  selectFolderById,
  selectFoldersLoading,
  selectFoldersError,
  selectActiveMenuId,
  selectActiveFolderId,
};