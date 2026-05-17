import React from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { ModalsFeature } from '@/features/modals';
import PlusIcon from '@/shared/ui/icons/plusmainscreen.svg';
import styles from './UniversalButton.module.scss';

export const UniversalButton: React.FC = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  const handleClick = () => {
    if (location.pathname === '/') {
      dispatch(ModalsFeature.actions.openCreateProjectModal());
    } else if (location.pathname === '/packages') {
      dispatch(ModalsFeature.actions.openCreateFolderModal());
    } else if (location.pathname === '/layouts') {
      dispatch(ModalsFeature.actions.openCreateLayoutModal());
    }
  };

  return (
    <button className={styles.button} onClick={handleClick}>
      <PlusIcon className={styles.icon} />
    </button>
  );
};