import { createSelector } from '@reduxjs/toolkit';
import { name, CreateFolderState } from './slice';

type State = {
  [name]: CreateFolderState;
};

const root = (state: State) => state[name];

const selectFolderName = createSelector(root, (state) => state?.folderName ?? '');
const selectIsLoading = createSelector(root, (state) => state?.isLoading ?? false);
const selectError = createSelector(root, (state) => state?.error);

export const selectors = {
  selectFolderName,
  selectIsLoading,
  selectError,
};