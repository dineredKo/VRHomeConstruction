import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ModalsFeature } from '@/features/modals';
import { CreateProjectFeature } from '../index';
import { useAuth } from '@/shared/lib/hooks/useAuth';
import styles from './CreateProjectModal.module.scss';

/**
 * Модальное окно создания проекта.
 * Позволяет ввести название и создать проект.
 * Если пользователь не авторизован, выводит предупреждение.
 * @module create-project/ui/CreateProjectModal
 */

export const CreateProjectModal = () => {
  const dispatch = useDispatch();
  const { isAuth } = useAuth();

  const isModalOpen = useSelector(ModalsFeature.selectors.selectIsCreateProjectModalOpen);
  const projectName = useSelector(CreateProjectFeature.selectors.selectProjectName);
  const isLoading = useSelector(CreateProjectFeature.selectors.selectIsLoading);
  const error = useSelector(CreateProjectFeature.selectors.selectError);

  const [showAuthWarning, setShowAuthWarning] = useState(false);

  if (!isModalOpen) return null;

  const handleCreateProject = () => {
    if (!projectName.trim()) {
      dispatch(CreateProjectFeature.actions.setError('Введите название проекта'));
      return;
    }
    if (!isAuth) {
      setShowAuthWarning(true);
      return;
    }
    dispatch(CreateProjectFeature.actions.createProjectRequested());
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

          {showAuthWarning && (
            <div className={styles.warning}>
              <p>⚠️ Вы не вошли в аккаунт. Проект не будет сохранён.</p>
              <div className={styles.warningButtons}>
                <button
                  className={styles.authBtn}
                  onClick={() => {
                    setShowAuthWarning(false);
                  }}
                >
                  Войти
                </button>
                <button
                  className={styles.continueBtn}
                  onClick={() => {
                    setShowAuthWarning(false);
                    dispatch(CreateProjectFeature.actions.createProjectRequested());
                  }}
                >
                  Продолжить без сохранения
                </button>
              </div>
            </div>
          )}

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