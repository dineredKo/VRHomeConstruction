import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ModalsFeature } from '@/features/modals';
import { CreateProjectFeature } from '../index';
import styles from './CreateProjectModal.module.scss';

export const CreateProjectModal = () => {
  const dispatch = useDispatch();

  const isModalOpen = useSelector(ModalsFeature.selectors.selectIsCreateProjectModalOpen);
  const projectName = useSelector(CreateProjectFeature.selectors.selectProjectName);
  const isLoading = useSelector(CreateProjectFeature.selectors.selectIsLoading);
  const error = useSelector(CreateProjectFeature.selectors.selectError);

  if (!isModalOpen) return null;

  const handleCreateProject = () => {
    if (projectName.trim()) {
      dispatch(CreateProjectFeature.actions.createProjectRequested());
    } else {
      dispatch(CreateProjectFeature.actions.setError('Введите название проекта'));
    }
  };

  const handleClose = () => {
    dispatch(ModalsFeature.actions.closeCreateProjectModal());
    dispatch(CreateProjectFeature.actions.resetForm());
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && projectName.trim()) {
      handleCreateProject();
    }
  };

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>Создать проект</h2>
        </div>
        <div className={styles.content}>
          {error && <div className={styles.error}>{error}</div>}
          <div className={styles.nameStep}>
            <label className={styles.label}>Введите название проекта</label>
            <input
              type="text"
              className={styles.nameInput}
              placeholder="Например: Сайт, Приложение, etc."
              value={projectName}
              onChange={(e) => dispatch(CreateProjectFeature.actions.setProjectName(e.target.value))}
              autoFocus
              onKeyDown={handleKeyDown}
              disabled={isLoading}
            />
            <div className={styles.hint}>Нажмите Enter или кнопку "Создать проект"</div>
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
            onClick={handleCreateProject}
            disabled={!projectName.trim() || isLoading}
          >
            {isLoading ? 'Создание...' : 'Создать проект'}
          </button>
        </div>
      </div>
    </div>
  );
};