/**
 * Типы для универсальной кнопки (устаревшие, оставлены для совместимости).
 * @module universal-button/types
 */

export interface UniversalButtonState {
  currentPage: 'projects' | 'folders' | 'layouts';
  isCreating: boolean;
  error: string | null;
}