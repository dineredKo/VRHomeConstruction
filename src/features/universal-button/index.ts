import { actions, reducer, name } from './slice';
import { selectors } from './selectors';
import { UniversalButton } from './ui/UniversalButton';

export const UniversalButtonFeature = {
  reducer: { [name]: reducer },
  actions,
  selectors,
  ui: {
    UniversalButton,
  },
};