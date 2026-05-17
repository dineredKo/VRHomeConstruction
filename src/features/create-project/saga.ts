/**
 * Саги для создания проектов.
 * Обрабатывают создание проекта и поиск по проектам.
 * @module create-project/saga
 */

import { takeLatest, put, select, all, delay } from 'typed-redux-saga';
import { ModalsFeature } from '@/features/modals';
import { SearchFeature } from '@/features/search';
import { actions, name } from './slice';
import { selectors } from './selectors';

/** Сага создания проекта: валидирует, показывает загрузку, добавляет проект */
function* handleCreateProject() {
  try {
    const projectName: string = yield* select(selectors.selectProjectName);
    if (!projectName.trim()) {
      throw new Error('Введите название проекта');
    }
    yield put(actions.setIsLoading(true));
    yield put(actions.setError(null));
    yield delay(1000);

    yield put(actions.addProject({
      id: `project_${Date.now()}`,
      name: projectName.trim(),
      template: 'default',
      number: 1,
      createdAt: new Date().toISOString(),
      status: 'active',
    }));

    yield put(actions.resetForm());
    yield put(ModalsFeature.actions.closeCreateProjectModal());
  } catch (error: any) {
    const errorMessage = error.message || 'Ошибка при создании проекта';
    yield put(actions.setError(errorMessage));
  } finally {
    yield put(actions.setIsLoading(false));
  }
}

/** Сага поиска проектов: фильтрует проекты по названию */
function* handleSearchProjects() {
  try {
    const searchQuery = yield* select(SearchFeature.selectors.selectSearchQuery);
    if (!searchQuery.trim()) {
      yield put(SearchFeature.actions.setHighlightedIds([]));
      return;
    }
    
    const projects = yield* select(selectors.selectProjects);
    const found = projects.filter((p: any) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const foundIds = found.map((p: any) => p.id);

    yield put(SearchFeature.actions.setHighlightedIds(foundIds));
    if (foundIds.length > 0) {
      yield put(SearchFeature.actions.setSearchResults(foundIds));
    }
  } catch (error: any) {
    console.error('Search projects error:', error);
  }
}

export function* initSaga() {
  yield all([
    takeLatest(actions.createProjectRequested.type, handleCreateProject),
  ]);
}