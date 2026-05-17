/**
 * Общий хедер приложения с иконкой дома.
 * @module widgets/header/ui/Header
 */

import React from 'react';
import { Link } from 'react-router-dom';
import HomeIcon from '@/shared/ui/icons/home.svg';
import styles from './Header.module.scss';

export const Header = () => {
  return (
    <header className={styles.header}>
      <Link to="/" className={styles.logo}>
        <HomeIcon className={styles.homeIcon} />
      </Link>
    </header>
  );
};