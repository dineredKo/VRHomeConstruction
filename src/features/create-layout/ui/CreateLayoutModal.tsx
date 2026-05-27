/**
 * Модальное окно создания макета.
 * @module create-layout/ui/CreateLayoutModal
 */

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ModalsFeature } from '@/features/modals';
import { CreateLayoutFeature } from '../index';
import styles from './CreateLayoutModal.module.scss';

export const CreateLayoutModal = () => {
  const dispatch = useDispatch();

  const isModalOpen = useSelector(ModalsFeature.selectors.selectIsCreateLayoutModalOpen);
  const layoutName = useSelector(CreateLayoutFeature.selectors.selectLayoutName);
  const isLoading = useSelector(CreateLayoutFeature.selectors.selectIsLoading);
  const error = useSelector(CreateLayoutFeature.selectors.selectError);

  if (!isModalOpen) return null;

  const handleCreateLayout = () => {
    if (layoutName.trim()) {
      dispatch(CreateLayoutFeature.actions.createLayoutRequested());
    } else {
      dispatch(CreateLayoutFeature.actions.setError('Введите название макета'));
    }
  };

  const handleClose = () => {
    dispatch(ModalsFeature.actions.closeCreateLayoutModal());
    dispatch(CreateLayoutFeature.actions.resetForm());
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && layoutName.trim()) {
      handleCreateLayout();
    }
  };

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>Создать макет</h2>
        </div>
        <div className={styles.content}>
          {error && <div className={styles.error}>{error}</div>}
          <div className={styles.nameStep}>
            <label className={styles.label}>Введите название макета</label>
            <input
              type="text"
              className={styles.nameInput}
              placeholder="Например: Главная, Контакты, etc."
              value={layoutName}
              onChange={(e) => dispatch(CreateLayoutFeature.actions.setLayoutName(e.target.value))}
              autoFocus
              onKeyDown={handleKeyDown}
              disabled={isLoading}
            />
            <div className={styles.hint}>Нажмите Enter или кнопку "Создать макет"</div>
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
            onClick={handleCreateLayout}
            disabled={!layoutName.trim() || isLoading}
          >
            {isLoading ? 'Создание...' : 'Создать макет'}
          </button>
        </div>
      </div>
    </div>
  );
};