import { createSelector } from '@reduxjs/toolkit';
import { name } from './slice';
import { UserState } from './types';

type State = {
  [name]: UserState;
};

const root = (state: State) => state[name];

const selectUserAuthData = createSelector(root, (user) => user?.authData);
const selectUserIsAuth = createSelector(root, (user) => user?.isAuth ?? false);
const selectUserIsLoading = createSelector(root, (user) => user?.isLoading ?? false);
const selectUserError = createSelector(root, (user) => user?.error);
const selectUserName = createSelector(root, (user) => user?.authData?.name);
const selectUserEmail = createSelector(root, (user) => user?.authData?.email);
const selectUserAvatar = createSelector(root, (user) => user?.authData?.avatar);

export const selectors = {
  selectUserAuthData,
  selectUserIsAuth,
  selectUserIsLoading,
  selectUserError,
  selectUserName,
  selectUserEmail,
  selectUserAvatar,
};