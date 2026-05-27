import { api } from './client';
import type { Layout } from '@/features/create-layout/types';

export async function fetchLayouts(): Promise<Layout[]> {
  const res = await api.get<any[]>('/api/layouts');
  return res.map(api.mapLayout);
}

export async function createLayout(name: string): Promise<Layout> {
  const res = await api.post<any>('/api/layouts', { name });
  return api.mapLayout(res);
}

export async function updateLayout(id: string, name: string): Promise<Layout> {
  const res = await api.put<any>(`/api/layouts/${id}`, { name });
  return api.mapLayout(res);
}

export async function deleteLayout(id: string): Promise<void> {
  await api.del(`/api/layouts/${id}`);
}
