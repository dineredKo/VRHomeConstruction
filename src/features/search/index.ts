import { actions, reducer, name } from './slice';
import { selectors } from './selectors';
import { SearchBar } from './ui/SearchBar';
import { initSaga } from './saga';

export const SearchFeature = {
  reducer: { [name]: reducer },
  actions,
  selectors,
  sagas: { init: initSaga },
  ui: {
    SearchBar
  }
};