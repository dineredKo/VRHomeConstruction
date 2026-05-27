import { api } from './client';
import type { Project } from '@/features/create-project/types';

interface ProjectListResponse {
  data: any[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export async function fetchProjects(): Promise<Project[]> {
  const res = await api.get<ProjectListResponse>('/api/projects');
  return res.data.map(api.mapProject);
}

export async function fetchProject(id: string): Promise<any> {
  const res = await api.get<any>(`/api/projects/${id}`);
  return api.mapProject(res);
}

export async function createProject(name: string, status = 'active'): Promise<Project> {
  const res = await api.post<any>('/api/projects', { name, status });
  return api.mapProject(res);
}

export async function updateProject(id: string, data: any): Promise<any> {
  const res = await api.put<any>(`/api/projects/${id}`, data);
  return api.mapProject(res);
}

export async function deleteProject(id: string): Promise<void> {
  await api.del(`/api/projects/${id}`);
}
