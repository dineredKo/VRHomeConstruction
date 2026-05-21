/**
 * Redux Slice для управления авторизацией.
 * Содержит экшены для входа, регистрации, выхода и обновления токена.
 * @module user/slice
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, AuthState } from './types';

const initialState: AuthState = {
  user: null,
  accessToken: null,
  isLoading: false,
  error: null,
};

export const { actions, name, reducer } = createSlice({
  name: 'user',
  initialState,
  reducers: {
    /** Запрос на вход (сага) */
    loginRequested(state, _action: PayloadAction<{ email: string; password: string }>) {},
    /** Запрос на регистрацию (сага) */
    registerRequested(state, _action: PayloadAction<{ name: string; email: string; password: string }>) {},
    /** Успешная аутентификация */
    authSuccess(state, action: PayloadAction<{ user: User; accessToken: string }>) {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.isLoading = false;
      state.error = null;
    },
    /** Ошибка аутентификации (можно передать null для сброса) */
    authFailure(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
      state.isLoading = false;
    },
    /** Выход из аккаунта */
    logout(state) {
      state.user = null;
      state.accessToken = null;
      state.error = null;
    },
    /** Установить флаг загрузки */
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
  },
});

export type { AuthState };