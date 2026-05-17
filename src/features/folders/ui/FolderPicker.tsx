import React from 'react';
import { useSelector } from 'react-redux';
import { selectors } from '../selectors';
import type { Folder } from '../types';
import styles from './FolderPicker.module.scss';

interface FolderPickerProps {
  onSelect: (folderId: string) => void;
  excludeFolderId?: string;
}

export const FolderPicker: React.FC<FolderPickerProps> = ({ onSelect, excludeFolderId }) => {
  const folders = useSelector(selectors.selectFolders);
  const filtered = excludeFolderId
    ? folders.filter((f: Folder) => f.id !== excludeFolderId)
    : folders;

  if (filtered.length === 0) {
    return <div className={styles.empty}>Нет папок</div>;
  }

  return (
    <div>
      {filtered.map((folder: Folder) => (
        <button
          key={folder.id}
          className={styles.option}
          onClick={() => onSelect(folder.id)}
        >
          {folder.name}
        </button>
      ))}
    </div>
  );
};