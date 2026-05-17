import React from 'react';
import { Link } from 'react-router-dom';
import { UniversalButtonFeature } from '@/features/universal-button';
import styles from './Header.module.scss';

export const Header = () => {
  return (
    <header className={styles.header}>
      <Link to="/" className={styles.logo}>
        🏠
      </Link>
    </header>
  );
};