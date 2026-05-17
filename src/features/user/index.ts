import { actions, reducer, name } from './slice';
import { selectors } from './selectors';
import { initSaga } from './saga';

export const UserFeature = {
  reducer: { [name]: reducer },
  actions,
  sagas: {
    init: initSaga
  },
  selectors,
};