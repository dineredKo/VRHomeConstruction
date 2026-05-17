import { takeLatest, put, select, all } from 'typed-redux-saga';
import { ModalsFeature } from '@/features/modals';
import { foldersActions } from '@/features/folders';
import { actions } from './slice';
import { selectors } from './selectors';

function* handleCreateFolder() {
  try {
    const folderName: string = yield* select(selectors.selectFolderName);
    const trimmedName = folderName.trim();

    if (!trimmedName) {
      throw new Error('Введите название папки');
    }

    yield put(actions.setIsLoading(true));
    yield put(actions.setError(null));

    yield put(foldersActions.addFolder({
      id: `folder_${Date.now()}`,
      name: trimmedName,
      description: '',
      parentId: null,
    }));

    yield put(actions.resetForm());
    yield put(ModalsFeature.actions.closeCreateFolderModal());
  } catch (error: any) {
    const errorMessage = error.message || 'Ошибка при создании папки';
    yield put(actions.setError(errorMessage));
  } finally {
    yield put(actions.setIsLoading(false));
  }
}

export function* initSaga() {
  yield all([
    takeLatest(actions.createFolderRequested.type, handleCreateFolder),
  ]);
}