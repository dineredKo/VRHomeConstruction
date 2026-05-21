/**
 * Типы и интерфейсы для фичи авторизации пользователя.
 * @module user/types
 */

/** Данные авторизованного пользователя */
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

/** Состояние авторизации в Redux */
export interface AuthState {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  error: string | null;
}