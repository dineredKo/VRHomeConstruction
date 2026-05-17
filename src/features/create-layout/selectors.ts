import { createSelector } from '@reduxjs/toolkit';
import { name, CreateLayoutState } from './slice';

type State = {
  [name]: CreateLayoutState;
};

const root = (state: State) => state[name];

const selectLayouts = createSelector(root, (state) => state?.layouts ?? []);
const selectLayoutName = createSelector(root, (state) => state?.layoutName ?? '');
const selectIsLoading = createSelector(root, (state) => state?.isLoading ?? false);
const selectError = createSelector(root, (state) => state?.error);

export const selectors = {
  selectLayouts,
  selectLayoutName,
  selectIsLoading,
  selectError,
};