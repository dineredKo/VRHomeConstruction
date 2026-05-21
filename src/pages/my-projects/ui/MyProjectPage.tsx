import React from 'react';
import { NavLink } from 'react-router-dom';
import { UniversalButtonFeature } from '@/features/universal-button';
import { SearchBar } from '@/features/search/ui/SearchBar';
import { ProjectsGrid } from '@/widgets/ProjectsGrid';
import styles from './MyProjectPage.module.scss';
/**
 * Страница "Мои проекты".
 * @module pages/my-projects/ui/MyProjectPage
 */
export const MyProjectsPage = () => {
  return (
    <div className={styles.page}>
      <div className={styles.navRow}>
        <nav className={styles.nav}>
          <NavLink to="/" className={`${styles.navItem} ${styles.active}`}>Мои проекты</NavLink>
          <NavLink to="/packages" className={styles.navItem}>Папки</NavLink>
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
      <ProjectsGrid />
    </div>
  );
};