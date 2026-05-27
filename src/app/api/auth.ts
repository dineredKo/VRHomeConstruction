import { api } from './client';
import type { User } from '@/features/user/types';

export { getStoredToken, setStoredToken, clearStoredToken } from './token';

export interface AuthResponse {
  user: User;
  token: string;
}

export type AuthPurpose = 'login' | 'register';

export async function sendCode(
  email: string,
  purpose: AuthPurpose,
  payload?: { name?: string; password?: string },
): Promise<{ message: string }> {
  return api.post<{ message: string }>('/api/auth/send-code', {
    email,
    purpose,
    ...payload,
  });
}

export async function verifyCode(
  email: string,
  code: string,
  purpose: AuthPurpose,
): Promise<AuthResponse> {
  return api.post<AuthResponse>('/api/auth/verify-code', { email, code, purpose });
}

export async function fetchMe(): Promise<User> {
  return api.get<User>('/api/auth/me');
}
