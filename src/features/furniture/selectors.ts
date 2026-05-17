import { createSelector } from '@reduxjs/toolkit';
import { name, FurnitureState } from './slice';

type State = {
  [name]: FurnitureState;
};

const root = (state: State) => state[name];

const selectFurnitureItems = createSelector(root, (state) => state?.items ?? []);
const selectSelectedFurniture = createSelector(root, (state) => state?.selectedFurniture);
const selectShowFurnitureModal = createSelector(root, (state) => state?.showFurnitureModal ?? false);
const selectSelectedFurniturePath = createSelector(root, (state) => state?.selectedFurniturePath);

export const selectors = {
  selectFurnitureItems,
  selectSelectedFurniture,
  selectShowFurnitureModal,
  selectSelectedFurniturePath,
};