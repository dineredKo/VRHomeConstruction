/**
 * Контекстное меню для папки.
 * Позволяет удалить папку, добавить в другую папку или присвоить тег.
 * @module folder-menu/ui/FolderMenu
 */

import React from 'react';
import { useDispatch } from 'react-redux';
import { foldersActions } from '@/features/folders';
import { FolderPicker } from '@/features/folders/ui/FolderPicker';
import TrashIcon from '@/shared/ui/icons/trashmainsceen.svg';
import OptionsIcon from '@/shared/ui/icons/options.svg';
import TagIcon from '@/shared/ui/icons/tag.svg';
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
        <button className={styles.menuItem} onClick={onRemove}>
          <TrashIcon className={styles.menuIcon} /> Удалить папку
        </button>
        <div className={styles.folderDropdown}>
          <button className={styles.menuItem}>
            <OptionsIcon className={styles.menuIcon} /> Добавить в папку
          </button>
          <div className={styles.folderList}>
            <FolderPicker onSelect={handleAddToFolder} excludeFolderId={folderId} />
          </div>
        </div>
        <button className={styles.menuItem}>
          <TagIcon className={styles.menuIcon} /> Присвоить тег
        </button>
      </div>
    </>
  );
};