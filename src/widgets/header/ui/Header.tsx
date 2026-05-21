import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import HomeIcon from '@/shared/ui/icons/home.svg';
import UserDefaultIcon from '@/shared/ui/icons/userDefault.svg';
import { AuthModal } from '@/features/user/ui/AuthModal';
import styles from './Header.module.scss';

export const Header = () => {
  const [showAuth, setShowAuth] = useState(false);

  return (
    <header className={styles.header}>
      <Link to="/" className={styles.logo}>
        <HomeIcon className={styles.homeIcon} />
      </Link>
      <button className={styles.authButton} onClick={() => setShowAuth(true)}>
        <UserDefaultIcon className={styles.authIcon} />
      </button>
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </header>
  );
};