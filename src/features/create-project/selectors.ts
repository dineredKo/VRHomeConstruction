import { createSelector } from '@reduxjs/toolkit';
import { name, CreateProjectState } from './slice';

type State = {
  [name]: CreateProjectState;
};

const root = (state: State) => state[name];

const selectProjects = createSelector(root, (state) => state?.projects ?? []);
const selectProjectName = createSelector(root, (state) => state?.projectName ?? '');
const selectIsLoading = createSelector(root, (state) => state?.isLoading ?? false);
const selectError = createSelector(root, (state) => state?.error);

export const selectors = {
  selectProjects,
  selectProjectName,
  selectIsLoading,
  selectError,
};