/**
 * Страница "Папки".
 * @module pages/package/ui/PackagesPage
 */

import React from 'react';
import { NavLink } from 'react-router-dom';
import { UniversalButtonFeature } from '@/features/universal-button';
import { SearchBar } from '@/features/search/ui/SearchBar';
import { FoldersGrid } from '@/widgets/FoldersGrid';
import styles from './PackagesPage.module.scss';

export const PackagesPage = () => {
  return (
    <div className={styles.page}>
      <div className={styles.navRow}>
        <nav className={styles.nav}>
          <NavLink to="/" className={styles.navItem}>Мои проекты</NavLink>
          <NavLink to="/packages" className={`${styles.navItem} ${styles.active}`}>Папки</NavLink>
          <NavLink to="/layouts" className={styles.navItem}>Макеты</NavLink>
        </nav>
        <div className={styles.addButton}>
          <UniversalButtonFeature.ui.UniversalButton />
        </div>
      </div>
      <div className={styles.searchRow}>
        <div className={styles.searchBarWrapper}>
          <SearchBar scope="global" />
        </div>
      </div>
      <FoldersGrid />
    </div>
  );
};