import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Project } from './types';

export interface CreateProjectState {
  projectName: string;
  isLoading: boolean;
  error: string | null;
  projects: Project[];
}

const initialState: CreateProjectState = {
  projectName: '',
  isLoading: false,
  error: null,
  projects: [],
};

export const { actions, name, reducer } = createSlice({
  name: 'createProject',
  initialState,
  reducers: {
    setProjectName: (state, action: PayloadAction<string>) => {
      state.projectName = action.payload;
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
      state.projectName = '';
      state.isLoading = false;
      state.error = null;
    },
    createProjectRequested: (state) => {
    },
    addProject: (state, action: PayloadAction<Project>) => {
      state.projects.push(action.payload);
    },
    removeProject: (state, action: PayloadAction<string>) => {
      state.projects = state.projects.filter(p => p.id !== action.payload);
    },
  },
});