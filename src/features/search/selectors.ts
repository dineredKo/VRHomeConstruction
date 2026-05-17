import { createSelector } from '@reduxjs/toolkit';
import { name } from './slice';
import { SearchState } from './types';

type State = {
  [name]: SearchState;
};

const root = (state: State) => state[name];

const selectSearchQuery = createSelector(root, (search) => search?.query ?? '');
const selectIsSearching = createSelector(root, (search) => search?.isSearching ?? false);
const selectSearchResults = createSelector(root, (search) => search?.results ?? []);
const selectFoundProjectId = createSelector(root, (search) => search?.foundProjectId);
const selectHighlightedIds = createSelector(root, (search) => search?.highlightedIds ?? []);
const selectHighlightedFolderIds = createSelector(root, (search) => search?.highlightedFolderIds ?? []);
const selectSearchInputValue = createSelector(root, (search) => search?.inputValue ?? '');
const selectActiveMenuId = createSelector(root, (search) => search?.activeMenuId ?? null);

export const selectors = {
  selectSearchQuery,
  selectIsSearching,
  selectSearchResults,
  selectFoundProjectId,
  selectHighlightedIds,
  selectHighlightedFolderIds,
  selectSearchInputValue,
  selectActiveMenuId,
};