/**
 * Верхняя панель редактора.
 * Отображает название проекта, кнопки действий и переключатели режимов просмотра.
 * @module widgets/editor-header/ui/EditorHeader
 */

import React from 'react';
import styles from './EditorHeader.module.scss';
import type { ViewMode } from '@/features/editor-3d/types';

interface EditorHeaderProps {
  projectName: string;
  viewMode: ViewMode;
  onChangeViewMode: (mode: ViewMode) => void;
  viewedWallId: string;
  onChangeViewedWall: (id: string) => void;
}

export const EditorHeader: React.FC<EditorHeaderProps> = ({
  projectName,
  viewMode,
  onChangeViewMode,
  viewedWallId,
  onChangeViewedWall,
}) => {
  return (
    <header className={styles.header}>
      <div className={styles.projectName}>{projectName}</div>
      <div className={styles.actions}>
        <button className={styles.actionBtn} title="Поделиться">👥</button>
        <button className={styles.actionBtn} title="Варианты">🪟</button>
      </div>
      <div className={styles.viewModes}>
        <button
          className={`${styles.viewBtn} ${viewMode === '2d' ? styles.active : ''}`}
          onClick={() => onChangeViewMode('2d')}
        >
          2D
        </button>
        <button
          className={`${styles.viewBtn} ${viewMode === '3d' ? styles.active : ''}`}
          onClick={() => onChangeViewMode('3d')}
        >
          3D
        </button>
        <button className={styles.viewBtn} disabled title="VR пока не готово">
          VR
        </button>
        {viewMode === '2d' && (
          <select
            className={styles.wallSelect}
            value={viewedWallId}
            onChange={(e) => onChangeViewedWall(e.target.value)}
          >
            <option value="front">Передняя стена</option>
            <option value="back">Задняя стена</option>
            <option value="left">Левая стена</option>
            <option value="right">Правая стена</option>
          </select>
        )}
      </div>
    </header>
  );
};