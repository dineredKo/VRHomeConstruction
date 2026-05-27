/**
 * Контекстное меню для проекта.
 * Позволяет удалить проект, добавить в папку или присвоить тег.
 * @module project-menu/ui/ProjectMenu
 */

import React from 'react';
import { useDispatch } from 'react-redux';
import { foldersActions } from '@/features/folders';
import { FolderPicker } from '@/features/folders/ui/FolderPicker';
import TrashIcon from '@/shared/ui/icons/trashmainsceen.svg';
import FolderIcon from '@/shared/ui/icons/folder.svg';
import TagIcon from '@/shared/ui/icons/tag.svg';
import styles from './ProjectMenu.module.scss';

interface ProjectMenuProps {
  projectId: string;
  onClose: () => void;
  onRemove: () => void;
}

export const ProjectMenu: React.FC<ProjectMenuProps> = ({ projectId, onClose, onRemove }) => {
  const dispatch = useDispatch();

  const handleAddToFolder = (folderId: string) => {
    dispatch(foldersActions.addProjectToFolder({ folderId, projectId }));
    onClose();
  };

  return (
    <>
      <div className={styles.menuOverlay} onClick={onClose} />
      <div className={styles.projectMenu}>
        <button className={styles.menuItem} onClick={onRemove}>
          <TrashIcon className={styles.menuIcon} /> Удалить
        </button>
        <div className={styles.folderDropdown}>
          <button className={styles.menuItem}>
            <FolderIcon className={styles.menuIcon} /> Добавить в папку
          </button>
          <div className={styles.folderList}>
            <FolderPicker onSelect={handleAddToFolder} />
          </div>
        </div>
        <button className={styles.menuItem}>
          <TagIcon className={styles.menuIcon} /> Присвоить тег
        </button>
      </div>
    </>
  );
};