/**
 * Саги авторизации: код на email, подтверждение, восстановление сессии.
 * @module user/saga
 */

import { takeLatest, put, call, select, all } from 'typed-redux-saga';
import { authApi } from '@/app/api';
import { clearStoredToken, getStoredToken, setStoredToken } from '@/app/api/token';
import type { AuthPurpose } from '@/app/api/auth';
import { actions } from './slice';
import { selectors } from './selectors';

/** Перезагрузить страницу после входа, чтобы подгрузить проекты пользователя */
function reloadAfterAuth() {
  window.location.reload();
}

/** Восстановить пользователя по сохранённому JWT */
export function* restoreSession() {
  const token = getStoredToken();
  if (!token) {
    return;
  }

  try {
    yield* put(actions.setLoading(true));
    const user = yield* call(authApi.fetchMe);
    yield* put(actions.setUser(user));
  } catch {
    clearStoredToken();
    yield* put(actions.logout());
  } finally {
    yield* put(actions.setLoading(false));
  }
}

function* handleSendCode() {
  yield* put(actions.setLoading(true));
  yield* put(actions.setError(undefined));

  try {
    const form = yield* select(selectors.selectAuthForm);
    const mode = yield* select(selectors.selectAuthMode);
    const purpose: AuthPurpose = mode;

    if (!form.email.trim() || !form.password) {
      yield* put(actions.setError('Введите email и пароль'));
      return;
    }

    if (purpose === 'register') {
      if (!form.name.trim()) {
        yield* put(actions.setError('Введите имя'));
        return;
      }
      if (form.password.length < 6) {
        yield* put(actions.setError('Пароль должен быть не короче 6 символов'));
        return;
      }
    }

    const result = yield* call(authApi.sendCode, form.email.trim(), purpose, {
      name: form.name.trim(),
      password: form.password,
    });

    yield* put(actions.setCodeSent(true));
    if (result?.message) {
      yield* put(actions.setSuccessMessage(result.message));
    }
  } catch (error: any) {
    const message = error?.message || 'Не удалось отправить код';
    yield* put(actions.setError(message));
  } finally {
    yield* put(actions.setLoading(false));
  }
}

function* handleVerifyCode() {
  try {
    const form = yield* select(selectors.selectAuthForm);
    const mode = yield* select(selectors.selectAuthMode);
    const purpose: AuthPurpose = mode;

    if (!form.email.trim() || !form.code.trim()) {
      yield* put(actions.setError('Введите код из письма'));
      return;
    }

    if (form.code.trim().length !== 6) {
      yield* put(actions.setError('Код должен содержать 6 цифр'));
      return;
    }

    yield* put(actions.setLoading(true));
    yield* put(actions.setError(undefined));

    const { user, token } = yield* call(
      authApi.verifyCode,
      form.email.trim(),
      form.code.trim(),
      purpose,
    );

    setStoredToken(token);
    yield* put(actions.setUser(user));
    reloadAfterAuth();
  } catch (error: any) {
    const message = error?.message || 'Неверный код';
    yield* put(actions.setError(message));
  } finally {
    yield* put(actions.setLoading(false));
  }
}

function* handleLogout() {
  clearStoredToken();
  reloadAfterAuth();
}

export function* initSaga() {
  yield all([
    takeLatest(actions.sendCodeRequested.type, handleSendCode),
    takeLatest(actions.verifyCodeRequested.type, handleVerifyCode),
    takeLatest(actions.logout.type, handleLogout),
    takeLatest(actions.restoreSessionRequested.type, restoreSession),
  ]);
}
