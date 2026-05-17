import React from 'react';
import { useDispatch } from 'react-redux';
import { ModalsFeature } from '@/features/modals';
import styles from './CreateProjectButton.module.scss';

export const CreateProjectButton: React.FC = () => {
  const dispatch = useDispatch();

  const handleClick = () => {
    dispatch(ModalsFeature.actions.openCreateProjectModal());
  };

  return (
    <div className={styles.createCard} onClick={handleClick}>
      <span className={styles.plusIcon}>+</span>
    </div>
  );
};