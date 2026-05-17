import { actions, reducer, name } from './slice';
import { selectors } from './selectors';
import { initSaga } from './saga';
import { CreateProjectModal } from './ui/CreateProjectModal';

export const CreateProjectFeature = {
  reducer: { [name]: reducer },
  actions,
  sagas: {
    init: initSaga,
  },
  selectors,
  ui: {
    CreateProjectModal,
  },
};