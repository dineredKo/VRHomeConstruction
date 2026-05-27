import { put, call } from 'typed-redux-saga';
import { projectsApi, foldersApi, layoutsApi } from '@/app/api';
import { actions as projectActions } from '@/features/create-project/slice';
import { foldersActions } from '@/features/folders';
import { actions as layoutActions } from '@/features/create-layout/slice';

export function* initDataSaga() {
  try {
    const projects = yield* call(projectsApi.fetchProjects);

    for (const project of projects) {
      yield* put(projectActions.addProject(project));
    }
  } catch (error: any) {
    console.error('Failed to load projects:', error);
  }

  try {
    const folders = yield* call(foldersApi.fetchFolders);

    for (const folder of folders) {
      yield* put(foldersActions.addFolder(folder));
    }
  } catch (error: any) {
    console.error('Failed to load folders:', error);
  }

  try {
    const layouts = yield* call(layoutsApi.fetchLayouts);

    for (const layout of layouts) {
      yield* put(layoutActions.addLayout(layout));
    }
  } catch (error: any) {
    console.error('Failed to load layouts:', error);
  }
}
