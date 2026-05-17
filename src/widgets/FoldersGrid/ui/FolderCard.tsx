/**
 * Карточка папки.
 * @module widgets/FoldersGrid/ui/FolderCard
 */

import React from 'react';
import { Folder } from '@/features/folders/types';
import classNames from 'classnames';
import styles from './FolderCard.module.scss';
import OptionsIcon from '@/shared/ui/icons/options.svg'

interface FolderCardProps {
  folder: Folder;
  isActive: boolean;
  onClick: () => void;
  onMenuToggle: (id: string) => void;
  activeMenuId: string | null;
}

export const FolderCard: React.FC<FolderCardProps> = ({ 
  folder, 
  isActive, 
  onClick, 
  onMenuToggle, 
  activeMenuId 
}) => {
  const { projectIds, layoutIds, childFolderIds } = folder;
  const summary = `Проекты: ${projectIds.length}  Папки: ${childFolderIds.length}  Макеты: ${layoutIds.length}`;

  return (
    <div 
      className={classNames(styles.folderCard, {
        [styles.highlighted]: isActive,
      })}
      onClick={onClick}
    >
      <div className={styles.folderTop} />
      <div className={styles.folderBottom}>
        <div className={styles.folderInfo}>
          <div className={styles.folderName}>{folder.name}</div>
          <div className={styles.folderDescription}>{summary}</div>
        </div>
        <button 
          className={styles.menuButton}
          onClick={(e) => {
            e.stopPropagation();
            onMenuToggle(folder.id);
          }}
        >
          <OptionsIcon className={styles.menuIcon} />
        </button>
      </div>
    </div>
  );
};