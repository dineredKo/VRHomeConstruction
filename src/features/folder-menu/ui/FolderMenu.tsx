import React from 'react';
import { useDispatch } from 'react-redux';
import { foldersActions } from '@/features/folders';
import { FolderPicker } from '@/features/folders/ui/FolderPicker';
import styles from './FolderMenu.module.scss';

interface FolderMenuProps {
  folderId: string;
  onClose: () => void;
  onRemove: () => void;
}

export const FolderMenu: React.FC<FolderMenuProps> = ({ folderId, onClose, onRemove }) => {
  const dispatch = useDispatch();

  const handleAddToFolder = (targetFolderId: string) => {
    dispatch(foldersActions.addFolderToFolder({ parentFolderId: targetFolderId, childFolderId: folderId }));
    onClose();
  };

  return (
    <>
      <div className={styles.menuOverlay} onClick={onClose} />
      <div className={styles.folderMenu}>
        <button className={styles.menuItem} onClick={onRemove}>🗑️ Удалить папку</button>
        <div className={styles.folderDropdown}>
          <button className={styles.menuItem}>📁 Добавить в папку</button>
          <div className={styles.folderList}>
            <FolderPicker onSelect={handleAddToFolder} excludeFolderId={folderId} />
          </div>
        </div>
        <button className={styles.menuItem}>🏷️ Присвоить тег</button>
      </div>
    </>
  );
};