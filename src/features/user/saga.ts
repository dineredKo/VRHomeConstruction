/**
 * Саги для авторизации.
 * Временно используют моковые данные; будут заменены на реальные запросы к API.
 * @module user/saga
 */

import { put, takeLatest, delay } from 'typed-redux-saga';
import { actions } from './slice';

/** Временная база пользователей для отладки */
const MOCK_USERS = [
  { id: '1', name: 'Иван', email: 'ivan@example.com', password: '123456' },
];

function* handleLogin(action: ReturnType<typeof actions.loginRequested>) {
  try {
    yield put(actions.setLoading(true));
    yield delay(800);
    const user = MOCK_USERS.find(
      u => u.email === action.payload.email && u.password === action.payload.password
    );
    if (!user) throw new Error('Неверный email или пароль');
    yield put(actions.authSuccess({
      user: { id: user.id, name: user.name, email: user.email },
      accessToken: 'mock_token',
    }));
  } catch (error: any) {
    yield put(actions.authFailure(error.message || 'Ошибка входа'));
  } finally {
    yield put(actions.setLoading(false));
  }
}

function* handleRegister(action: ReturnType<typeof actions.registerRequested>) {
  try {
    yield put(actions.setLoading(true));
    yield delay(800);
    yield put(actions.authSuccess({
      user: { id: `user_${Date.now()}`, name: action.payload.name, email: action.payload.email },
      accessToken: 'mock_token',
    }));
  } catch (error: any) {
    yield put(actions.authFailure(error.message || 'Ошибка регистрации'));
  } finally {
    yield put(actions.setLoading(false));
  }
}

export function* initSaga() {
  yield takeLatest(actions.loginRequested.type, handleLogin);
  yield takeLatest(actions.registerRequested.type, handleRegister);
}