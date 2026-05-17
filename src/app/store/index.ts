import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import { UserFeature } from '@/features/user';
import { SearchFeature } from '@/features/search';
import { ModalsFeature } from '@/features/modals';
import { UniversalButtonFeature } from '@/features/universal-button';
import { CreateProjectFeature } from '@/features/create-project';
import { CreateFolderFeature } from '@/features/create-folder';
import { FoldersFeature } from '@/features/folders';
import { CreateLayoutFeature } from '@/features/create-layout';
import { reducer as editorReducer } from '@/features/editor-3d/slice';
import { reducer as furnitureReducer } from '@/features/furniture/slice';
import { rootSaga } from './saga';

const sagaMiddleware = createSagaMiddleware();

export const createReduxStore = () => {
  const store = configureStore({
    reducer: {
      ...UserFeature.reducer,
      ...CreateProjectFeature.reducer,
      ...SearchFeature.reducer,
      ...ModalsFeature.reducer,
      ...CreateFolderFeature.reducer,
      ...FoldersFeature.reducer,
      ...CreateLayoutFeature.reducer,
      ...UniversalButtonFeature.reducer,
      editor: editorReducer,
      furniture: furnitureReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({ thunk: false }).concat(sagaMiddleware),
    devTools: true,
  });
  sagaMiddleware.run(rootSaga);
  return store;
};

export type RootState = ReturnType<ReturnType<typeof createReduxStore>['getState']>;