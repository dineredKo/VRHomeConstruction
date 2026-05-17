/**
 * Типы для фичи создания макетов.
 * @module create-layout/types
 */

export interface Layout {
  id: string;
  name: string;
}

export interface CreateLayoutState {
  layoutName: string;
  isLoading: boolean;
  error: string | null;
  layouts: Layout[];
}