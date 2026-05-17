import { takeLatest, all } from 'redux-saga/effects';
import { actions, name } from './slice';

function* load() {
  console.log('User saga triggered');
}

export function* initSaga() {
  yield all([
    takeLatest(actions.setUser.type, load),
  ]);
}