export interface Project {
  id: string;
  name: string;
  template: string;
  number: number;
  createdAt: string;
  status: 'active' | 'archived';
}

export interface CreateProjectState {
  projectName: string;
  isLoading: boolean;
  error: string | null;
  projects: Project[];
}