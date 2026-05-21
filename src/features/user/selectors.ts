/**
 * Селекторы для авторизации.
 * @module user/selectors
 */

import { createSelector } from '@reduxjs/toolkit';
import { name, AuthState } from './slice';

type State = { [name]: AuthState };
const root = (state: State) => state[name];

/** Текущий пользователь */
export const selectUser = createSelector(root, (state) => state?.user);
/** Авторизован ли пользователь */
export const selectIsAuth = createSelector(root, (state) => !!state?.user);
/** Идёт ли процесс загрузки */
export const selectAuthLoading = createSelector(root, (state) => state?.isLoading ?? false);
/** Текущая ошибка авторизации */
export const selectAuthError = createSelector(root, (state) => state?.error);

export const selectors = {
  selectUser,
  selectIsAuth,
  selectAuthLoading,
  selectAuthError,
};