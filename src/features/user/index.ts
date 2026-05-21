/**
 * Публичный API фичи user.
 * @module user/index
 */

import { actions, reducer, name } from './slice';
import { selectors } from './selectors';
import { initSaga } from './saga';

export const userActions = actions;
export const userSelectors = selectors;

export const UserFeature = {
  reducer: { [name]: reducer },
  actions,
  selectors,
  sagas: { init: initSaga },
};