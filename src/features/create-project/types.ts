/**
 * Типы для фичи создания проектов.
 * @module create-project/types
 */

/** Проект */
export interface Project {
  id: string;
  name: string;
  template: string;
  number: number;
  createdAt: string;
  status: 'active' | 'archived';
}

/** Состояние формы создания проекта */
export interface CreateProjectState {
  projectName: string;
  isLoading: boolean;
  error: string | null;
  projects: Project[];
}