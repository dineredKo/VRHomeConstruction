import { useSelector, useDispatch } from 'react-redux';
import { useCallback } from 'react';
import { userActions, userSelectors } from '@/features/user';
import type { User } from '@/features/user/types';
/**
 * Хук для управления авторизацией.
 * Предоставляет методы login, register, logout и текущее состояние пользователя.
 * @module shared/lib/hooks/useAuth
 */
export function useAuth() {
  const dispatch = useDispatch();

  const user = useSelector(userSelectors.selectUser) as User | null;
  const isAuth = useSelector(userSelectors.selectIsAuth) as boolean;
  const isLoading = useSelector(userSelectors.selectAuthLoading) as boolean;
  const error = useSelector(userSelectors.selectAuthError) as string | null;

  /** Войти с email и паролем */
  const login = useCallback((email: string, password: string) => {
    dispatch(userActions.loginRequested({ email, password }));
  }, [dispatch]);

  /** Зарегистрироваться */
  const register = useCallback((name: string, email: string, password: string) => {
    dispatch(userActions.registerRequested({ name, email, password }));
  }, [dispatch]);

  /** Выйти */
  const logout = useCallback(() => {
    dispatch(userActions.logout());
  }, [dispatch]);

  return { user, isAuth, isLoading, error, login, register, logout };
}