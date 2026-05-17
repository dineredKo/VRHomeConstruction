import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserState, User } from './types';

const initialState: UserState = {
  authData: undefined,
  isAuth: false,
  isLoading: false,
  error: undefined,
};

export const { actions, name, reducer } = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.authData = action.payload;
      state.isAuth = true;
      state.isLoading = false;
      state.error = undefined;
    },
    logout: (state) => {
      state.authData = undefined;
      state.isAuth = false;
      state.isLoading = false;
      state.error = undefined;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | undefined>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
});