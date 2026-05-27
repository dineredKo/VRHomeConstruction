/**
 * Общий хедер приложения с иконкой дома и кнопками авторизации.
 * @module widgets/header/ui/Header
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import HomeIcon from '@/shared/ui/icons/home.svg';
import { UserFeature } from '@/features/user';
import styles from './Header.module.scss';

export const Header = () => {
  const dispatch = useDispatch();
  const isAuth = useSelector(UserFeature.selectors.selectUserIsAuth);
  const userName = useSelector(UserFeature.selectors.selectUserName);

  return (
    <header className={styles.header}>
      <Link to="/" className={styles.logo}>
        <HomeIcon className={styles.homeIcon} />
      </Link>

      <div className={styles.auth}>
        {isAuth ? (
          <>
            <span className={styles.userName}>{userName}</span>
            <button
              type="button"
              className={styles.authBtn}
              onClick={() => dispatch(UserFeature.actions.logout())}
            >
              Выйти
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              className={styles.authBtn}
              onClick={() => dispatch(UserFeature.actions.openAuthModal('login'))}
            >
              Войти
            </button>
            <button
              type="button"
              className={`${styles.authBtn} ${styles.authBtnPrimary}`}
              onClick={() => dispatch(UserFeature.actions.openAuthModal('register'))}
            >
              Регистрация
            </button>
          </>
        )}
      </div>
    </header>
  );
};
