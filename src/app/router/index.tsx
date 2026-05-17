import { createBrowserRouter } from 'react-router-dom';
import { App } from '../App';
import { MyProjectsPage } from '@/pages/my-projects/ui/MyProjectPage';
import { PackagesPage } from '@/pages/package/ui/PackagesPage';
import { LayoutsPage } from '@/pages/layout/ui/LayoutsPage';
import { ProjectEditorPage } from '@/pages/project-editor/ui/ProjectEditorPage';
import { NotFoundPage } from '@/pages/not-found/ui/NotFoundPage';

export const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <App />,
      children: [
        { index: true, element: <MyProjectsPage /> },
        { path: '/packages', element: <PackagesPage /> },
        { path: '/layouts', element: <LayoutsPage /> },
        { path: '/project/:projectId', element: <ProjectEditorPage /> },
        { path: '*', element: <NotFoundPage /> },
      ],
    },
  ],
  {
    // @ts-ignore
      v7_startTransition: true,
  }
);