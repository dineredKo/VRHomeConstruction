import { put, takeEvery } from 'typed-redux-saga';
import { actions } from './slice';

function* handleSetFurnitureReady(action: ReturnType<typeof actions.setFurnitureReady>) {
  yield put(actions.updateFurnitureSizes({ itemId: action.payload.itemId, sizes: action.payload.sizes }));
}

export function* initSaga() {
  yield takeEvery(actions.setFurnitureReady.type, handleSetFurnitureReady);
}