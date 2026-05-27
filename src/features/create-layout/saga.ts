import { takeLatest, put, select, all, call } from 'typed-redux-saga';
import { ModalsFeature } from '@/features/modals';
import { actions } from './slice';
import { selectors } from './selectors';
import { layoutsApi } from '@/app/api';

function* handleCreateLayout() {
  try {
    const layoutName = yield* select(selectors.selectLayoutName);
    const trimmedName = layoutName.trim();
    if (!trimmedName) {
      throw new Error('Введите название макета');
    }
    yield* put(actions.setIsLoading(true));
    yield* put(actions.setError(null));

    const layout = yield* call(layoutsApi.createLayout, trimmedName);

    yield* put(actions.addLayout(layout));
    yield* put(actions.resetForm());
    yield* put(ModalsFeature.actions.closeCreateLayoutModal());
  } catch (error: any) {
    const errorMessage = error.message || 'Ошибка при создании макета';
    yield* put(actions.setError(errorMessage));
  } finally {
    yield* put(actions.setIsLoading(false));
  }
}

function* handleDeleteLayout(action: ReturnType<typeof actions.removeLayout>) {
  try {
    yield* call(layoutsApi.deleteLayout, action.payload);
  } catch (error: any) {
    console.error('Delete layout error:', error);
  }
}

export function* initSaga() {
  yield all([
    takeLatest(actions.createLayoutRequested.type, handleCreateLayout),
    takeLatest(actions.removeLayout.type, handleDeleteLayout),
  ]);
}
