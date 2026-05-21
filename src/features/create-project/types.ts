/**
 * Типы для фичи создания проектов.
 * @module create-project/types
 */

import type { EditorState } from '@/features/editor-3d/types';

/** Проект */
export interface Project {
  id: string;
  name: string;
  template: string;
  number: number;
  createdAt: string;
  status: 'active' | 'archived';
  /** Данные редактора 3D-сцены (сохраняются бэкендом) */
  roomData?: Partial<EditorState>;
}

/** Состояние формы создания проекта */
export interface CreateProjectState {
  projectName: string;
  isLoading: boolean;
  error: string | null;
  projects: Project[];
}