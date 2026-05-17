export interface UniversalButtonState {
  currentPage: 'projects' | 'folders' | 'layouts';
  isCreating: boolean;
  error: string | null;
}