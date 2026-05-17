import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SearchState } from './types';

const initialState: SearchState = {
  query: '',
  isSearching: false,
  results: [],
  foundProjectId: null,
  highlightedIds: [],
  highlightedFolderIds: [],
  inputValue: '',
  activeMenuId: null,
};

export const { actions, name, reducer } = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.query = action.payload;
      state.isSearching = action.payload.length > 0;
    },
    setSearchResults: (state, action: PayloadAction<string[]>) => {
      state.results = action.payload;
      state.foundProjectId = action.payload.length > 0 ? action.payload[0] : null;
      state.isSearching = false;
    },
    setHighlightedIds: (state, action: PayloadAction<string[]>) => {
      state.highlightedIds = action.payload;
    },
    setHighlightedFolderIds: (state, action: PayloadAction<string[]>) => {
      state.highlightedFolderIds = action.payload;
    },
    clearSearch: (state) => {
      state.query = '';
      state.isSearching = false;
      state.results = [];
      state.foundProjectId = null;
      state.highlightedIds = [];
      state.highlightedFolderIds = [];
      state.inputValue = '';
      state.activeMenuId = null;
    },
    setSearchInputValue: (state, action: PayloadAction<string>) => {
      state.inputValue = action.payload;
    },
    setActiveMenuId: (state, action: PayloadAction<string | null>) => {
      state.activeMenuId = action.payload;
    },
  },
});