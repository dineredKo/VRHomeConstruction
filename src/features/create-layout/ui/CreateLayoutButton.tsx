/**
 * Кнопка для открытия модалки создания макета.
 * @module create-layout/ui/CreateLayoutButton
 */

import React from 'react';
import { useDispatch } from 'react-redux';
import { ModalsFeature } from '@/features/modals';
import styles from './CreateLayoutButton.module.scss';

export const CreateLayoutButton: React.FC = () => {
  const dispatch = useDispatch();

  const handleClick = () => {
    dispatch(ModalsFeature.actions.openCreateLayoutModal());
  };

  return (
    <div className={styles.createCard} onClick={handleClick}>
      <span className={styles.plusIcon}>+</span>
    </div>
  );
};