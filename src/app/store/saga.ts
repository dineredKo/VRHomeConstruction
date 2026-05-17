import { all, fork } from 'redux-saga/effects';
import { UserFeature } from '@/features/user';
import { CreateProjectFeature } from '@/features/create-project';
import { FoldersFeature } from '@/features/folders';
import { CreateFolderFeature } from '@/features/create-folder';
import { CreateLayoutFeature } from '@/features/create-layout';
import { SearchFeature } from '@/features/search';
import { initSaga as editorSaga } from '@/features/editor-3d/saga';
import { initSaga as furnitureSaga } from '@/features/furniture/saga';

export function* rootSaga(): Generator<any, void, any> {
  yield all([
    fork(UserFeature.sagas.init),
    fork(CreateProjectFeature.sagas.init),
    fork(FoldersFeature.sagas.init),
    fork(CreateFolderFeature.sagas.init),
    fork(CreateLayoutFeature.sagas.init),
    fork(SearchFeature.sagas.init),
    fork(editorSaga),
    fork(furnitureSaga),
  ]);
}