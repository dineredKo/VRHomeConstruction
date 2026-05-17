/**
 * Селекторы для создания проектов.
 * @module create-project/selectors
 */

import { createSelector } from '@reduxjs/toolkit';
import { name, CreateProjectState } from './slice';

type State = {
  [name]: CreateProjectState;
};

const root = (state: State) => state[name];

/** Список проектов */
const selectProjects = createSelector(root, (state) => state?.projects ?? []);
/** Название нового проекта */
const selectProjectName = createSelector(root, (state) => state?.projectName ?? '');
/** Флаг загрузки */
const selectIsLoading = createSelector(root, (state) => state?.isLoading ?? false);
/** Ошибка */
const selectError = createSelector(root, (state) => state?.error);

export const selectors = {
  selectProjects,
  selectProjectName,
  selectIsLoading,
  selectError,
};