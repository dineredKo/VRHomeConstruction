export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface UserState {
  authData?: User;
  isAuth: boolean;
  isLoading: boolean;
  error?: string;
}