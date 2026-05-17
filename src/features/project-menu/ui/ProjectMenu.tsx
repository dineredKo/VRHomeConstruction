import React from 'react';
import { useDispatch } from 'react-redux';
import { foldersActions } from '@/features/folders';
import { FolderPicker } from '@/features/folders/ui/FolderPicker';
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
        <button className={styles.menuItem} onClick={onRemove}>🗑️ Удалить</button>
        <div className={styles.folderDropdown}>
          <button className={styles.menuItem}>📁 Добавить в папку</button>
          <div className={styles.folderList}>
            <FolderPicker onSelect={handleAddToFolder} />
          </div>
        </div>
        <button className={styles.menuItem}>🏷️ Присвоить тег</button>
      </div>
    </>
  );
};