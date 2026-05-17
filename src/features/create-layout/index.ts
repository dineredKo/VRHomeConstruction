import { actions, reducer, name } from './slice';
import { selectors } from './selectors';
import { initSaga } from './saga';
import { CreateLayoutModal } from './ui/CreateLayoutModal';

export const CreateLayoutFeature = {
  reducer: { [name]: reducer },
  actions,
  sagas: {
    init: initSaga,
  },
  selectors,
  ui: {
    CreateLayoutModal,
  },
};