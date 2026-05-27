import { takeLatest, put, select, all, call } from 'typed-redux-saga';
import { SearchFeature } from '@/features/search';
import { selectors } from './selectors';
import { actions } from './slice';
import { foldersApi } from '@/app/api';

function* handleSearchFolders() {
  try {
    const searchQuery = yield* select(SearchFeature.selectors.selectSearchQuery);
    if (!searchQuery.trim()) {
      yield* put(SearchFeature.actions.setHighlightedFolderIds([]));
      return;
    }
    const folders = yield* select(selectors.selectFolders);
    const found = folders.filter((f: any) =>
      f.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const foundIds = found.map((f: any) => f.id);
    yield* put(SearchFeature.actions.setHighlightedFolderIds(foundIds));
    if (foundIds.length > 0) {
      yield* put(SearchFeature.actions.setSearchResults(foundIds));
    }
  } catch (error: any) {
    console.error('Search folders error:', error);
  }
}

function* handleDeleteFolder(action: ReturnType<typeof actions.removeFolder>) {
  try {
    yield* call(foldersApi.deleteFolder, action.payload);
  } catch (error: any) {
    console.error('Delete folder error:', error);
  }
}

export function* initSaga() {
  yield all([
    takeLatest(SearchFeature.actions.setSearchQuery.type, handleSearchFolders),
    takeLatest(actions.removeFolder.type, handleDeleteFolder),
  ]);
}
