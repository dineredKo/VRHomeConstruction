/**
 * Модальное окно создания папки.
 * @module create-folder/ui/CreateFolderModal
 */

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ModalsFeature } from '@/features/modals';
import { CreateFolderFeature } from '../index';
import styles from './CreateFolderModal.module.scss';

export const CreateFolderModal = () => {
  const dispatch = useDispatch();
  const isModalOpen = useSelector(ModalsFeature.selectors.selectIsCreateFolderModalOpen);
  const folderName = useSelector(CreateFolderFeature.selectors.selectFolderName);
  const isLoading = useSelector(CreateFolderFeature.selectors.selectIsLoading);
  const folderError = useSelector(CreateFolderFeature.selectors.selectError);
  const error = folderError;

  if (!isModalOpen) return null;

  const handleCreateFolder = () => {
    dispatch(CreateFolderFeature.actions.createFolderRequested());
  };

  const handleClose = () => {
    dispatch(ModalsFeature.actions.closeCreateFolderModal());
    dispatch(CreateFolderFeature.actions.resetForm());
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && folderName.trim()) {
      handleCreateFolder();
    }
  };

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>Создать папку</h2>
        </div>
        <div className={styles.content}>
          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.nameStep}>
            <label className={styles.label}>Введите название папки</label>
            <input
              type="text"
              className={styles.nameInput}
              placeholder="Например: Работа, Отпуск, etc."
              value={folderName}
              onChange={(e) => dispatch(CreateFolderFeature.actions.setFolderName(e.target.value))}
              autoFocus
              onKeyDown={handleKeyDown}
              disabled={isLoading}
            />
            <div className={styles.hint}>Нажмите Enter или кнопку "Создать папку"</div>
          </div>
        </div>

        <div className={styles.footer}>
          <button
            className={styles.cancelBtn}
            onClick={handleClose}
            disabled={isLoading}
          >
            Отмена
          </button>
          <button
            className={styles.createBtn}
            onClick={handleCreateFolder}
            disabled={!folderName.trim() || isLoading}
          >
            {isLoading ? 'Создание...' : 'Создать папку'}
          </button>
        </div>
      </div>
    </div>
  );
};