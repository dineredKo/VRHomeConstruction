import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { UniversalButtonFeature } from '@/features/universal-button';
import { SearchBar } from '@/features/search/ui/SearchBar';
import { LayoutsGrid } from '@/widgets/LayoutsGrid'; 
import styles from './LayoutsPage.module.scss';

export const LayoutsPage = () => {
  return (
    <div className={styles.page}>
      <div className={styles.navRow}>
        <nav className={styles.nav}>
          <NavLink to="/" className={styles.navItem}>Мои проекты</NavLink>
          <NavLink to="/packages" className={styles.navItem}>Папки</NavLink>
          <NavLink to="/layouts" className={`${styles.navItem} ${styles.active}`}>Макеты</NavLink>
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

      <LayoutsGrid /> 
    </div>
  );
};