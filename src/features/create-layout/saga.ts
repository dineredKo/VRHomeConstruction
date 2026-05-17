/**
 * Саги для создания макетов.
 * @module create-layout/saga
 */

import { takeLatest, put, select, all, delay } from 'typed-redux-saga';
import { ModalsFeature } from '@/features/modals';
import { SearchFeature } from '@/features/search';
import { actions, name } from './slice';
import { selectors } from './selectors';

function* handleCreateLayout() {
  try {
    const layoutName: string = yield* select(selectors.selectLayoutName);
    const trimmedName = layoutName.trim();
    if (!trimmedName) {
      throw new Error('Введите название макета');
    }
    yield put(actions.setIsLoading(true));
    yield put(actions.setError(null));
    yield delay(1000);

    yield put(actions.addLayout({
      id: `layout_${Date.now()}`,
      name: trimmedName,
    }));

    yield put(actions.resetForm());
    yield put(ModalsFeature.actions.closeCreateLayoutModal());
  } catch (error: any) {
    const errorMessage = error.message || 'Ошибка при создании макета';
    yield put(actions.setError(errorMessage));
  } finally {
    yield put(actions.setIsLoading(false));
  }
}

function* handleSearchLayouts() {
  try {
    const searchQuery = yield* select(SearchFeature.selectors.selectSearchQuery);
    if (!searchQuery.trim()) {
      yield put(SearchFeature.actions.setHighlightedIds([]));
      return;
    }
    
    const layouts = yield* select(selectors.selectLayouts);
    const found = layouts.filter((l: any) =>
      l.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const foundIds = found.map((l: any) => l.id);
    
    yield put(SearchFeature.actions.setHighlightedIds(foundIds));
    if (foundIds.length > 0) {
      yield put(SearchFeature.actions.setSearchResults(foundIds));
    }
  } catch (error: any) {
    console.error('Search layouts error:', error);
  }
}

export function* initSaga() {
  yield all([
    takeLatest(actions.createLayoutRequested.type, handleCreateLayout),
  ]);
}