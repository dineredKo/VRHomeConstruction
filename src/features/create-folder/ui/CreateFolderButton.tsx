/**
 * Кнопка для открытия модалки создания папки.
 * @module create-folder/ui/CreateFolderButton
 */

import React from 'react';
import styles from './CreateFolderButton.module.scss';

interface CreateFolderButtonProps {
  onClick: () => void;
}

export const CreateFolderButton: React.FC<CreateFolderButtonProps> = ({ onClick }) => {
  return (
    <div 
      className={styles.createCard}
      onClick={onClick}
    >
      <span className={styles.plusIcon}>+</span>
    </div>
  );
};