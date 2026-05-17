import { createSlice } from '@reduxjs/toolkit';

export interface UniversalButtonState {
  isOpen: boolean;
}

const initialState: UniversalButtonState = {
  isOpen: false,
};

export const { actions, name, reducer } = createSlice({
  name: 'universalButton',
  initialState,
  reducers: {
    openModal: (state) => {
      state.isOpen = true;
    },
    closeModal: (state) => {
      state.isOpen = false;
    },
  },
});