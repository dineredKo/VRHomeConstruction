import { createSelector } from '@reduxjs/toolkit';
import { name } from './slice';
import { ModalsState } from './types';

type State = {
  [name]: ModalsState;
};

const root = (state: State) => state[name];

const selectIsCreateProjectModalOpen = createSelector(root, (state) => state?.isCreateProjectModalOpen ?? false);
const selectIsCreateFolderModalOpen = createSelector(root, (state) => state?.isCreateFolderModalOpen ?? false);
const selectIsCreateLayoutModalOpen = createSelector(root, (state) => state?.isCreateLayoutModalOpen ?? false);

const selectProjectCreationError = createSelector(root, (state) => state?.projectCreationError);
const selectFolderCreationError = createSelector(root, (state) => state?.folderCreationError);
const selectLayoutCreationError = createSelector(root, (state) => state?.layoutCreationError);

export const selectors = {
  selectIsCreateProjectModalOpen,
  selectIsCreateFolderModalOpen,
  selectIsCreateLayoutModalOpen,
  selectProjectCreationError,
  selectFolderCreationError,
  selectLayoutCreationError,
};