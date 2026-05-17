import { actions, reducer, name } from './slice';
import { selectors } from './selectors';
import { initSaga } from './saga';
import { FolderPicker } from './ui/FolderPicker';
import { FolderContentsModal } from './ui/FolderContentsModal';

export const foldersActions = actions;
export const foldersSelectors = selectors;

export const FoldersFeature = {
  reducer: { [name]: reducer },
  actions,
  sagas: { init: initSaga },
  selectors,
  ui: {
    FolderPicker,
    FolderContentsModal,
  },
};