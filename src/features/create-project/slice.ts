/**
 * Redux Slice для создания проектов.
 * Управляет формой, списком проектов и процессом создания.
 * @module create-project/slice
 */

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
    /** Установить название проекта */
    setProjectName: (state, action: PayloadAction<string>) => {
      state.projectName = action.payload;
      state.error = null;
    },
    /** Установить флаг загрузки */
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    /** Установить ошибку */
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    /** Сбросить форму */
    resetForm: (state) => {
      state.projectName = '';
      state.isLoading = false;
      state.error = null;
    },
    /** Запрос на создание проекта (сага) */
    createProjectRequested: (state) => {},
    /** Добавить проект в список */
    addProject: (state, action: PayloadAction<Project>) => {
      state.projects.push(action.payload);
    },
    /** Удалить проект по id */
    removeProject: (state, action: PayloadAction<string>) => {
      state.projects = state.projects.filter(p => p.id !== action.payload);
    },
  },
});