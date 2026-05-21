import React, { useState, useEffect } from 'react';
import { useAuth } from '@/shared/lib/hooks/useAuth';
import { userActions } from '@/features/user';
import { useDispatch } from 'react-redux';

interface AuthModalProps {
  onClose: () => void;
}
/**
 * Модальное окно аутентификации (вход / регистрация).
 * После успешного входа показывает профиль пользователя и кнопку "Выйти".
 * Ошибка авторизации сбрасывается при закрытии или переключении режимов.
 * @module user/ui/AuthModal
 */
export const AuthModal: React.FC<AuthModalProps> = ({ onClose }) => {
  const dispatch = useDispatch();
  const { isAuth, user, login, register, logout, isLoading, error } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  /**
   * Сбрасываем ошибку при размонтировании компонента.
   */
  useEffect(() => {
    return () => {
      dispatch(userActions.authFailure(null));
    };
  }, [dispatch]);

  /**
   * Сбрасываем ошибку при переключении режима (вход / регистрация).
   */
  const handleModeSwitch = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    dispatch(userActions.authFailure(null));
  };

  /**
   * Закрываем модалку и сбрасываем ошибку.
   */
  const handleClose = () => {
    dispatch(userActions.authFailure(null));
    onClose();
  };

  /**
   * Отправляем форму входа или регистрации.
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'login') {
      login(email, password);
    } else {
      register(name, email, password);
    }
  };

  // Если пользователь уже авторизован — показываем профиль
  if (isAuth && user) {
    return (
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        background: 'rgba(0,0,0,0.5)', display: 'flex',
        alignItems: 'center', justifyContent: 'center', zIndex: 1000
      }} onClick={handleClose}>
        <div style={{
          background: 'white', borderRadius: 12, padding: 24,
          minWidth: 300, textAlign: 'center'
        }} onClick={e => e.stopPropagation()}>
          <h3>Вход выполнен</h3>
          <p>{user.name} ({user.email})</p>
          <button onClick={() => { logout(); handleClose(); }}
            style={{ marginTop: 12, padding: '8px 16px' }}>
            Выйти
          </button>
        </div>
      </div>
    );
  }

  // Форма входа / регистрации
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.5)', display: 'flex',
      alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }} onClick={handleClose}>
      <div style={{
        background: 'white', borderRadius: 12, padding: 24,
        minWidth: 320, maxWidth: 400
      }} onClick={e => e.stopPropagation()}>
        <h2>{mode === 'login' ? 'Вход' : 'Регистрация'}</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          {mode === 'register' && (
            <div style={{ marginBottom: 12 }}>
              <label>Имя</label>
              <input type="text" value={name}
                onChange={e => setName(e.target.value)} required
                style={{ width: '100%', padding: '8px' }} />
            </div>
          )}
          <div style={{ marginBottom: 12 }}>
            <label>Email</label>
            <input type="email" value={email}
              onChange={e => setEmail(e.target.value)} required
              style={{ width: '100%', padding: '8px' }} />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label>Пароль</label>
            <input type="password" value={password}
              onChange={e => setPassword(e.target.value)} required
              style={{ width: '100%', padding: '8px' }} />
          </div>
          <button type="submit" disabled={isLoading}
            style={{
              width: '100%', padding: '10px',
              background: '#3B00FF', color: 'white',
              border: 'none', borderRadius: 6
            }}>
            {isLoading ? 'Загрузка...' : mode === 'login' ? 'Войти' : 'Зарегистрироваться'}
          </button>
        </form>
        <p style={{ marginTop: 12, textAlign: 'center' }}>
          {mode === 'login' ? 'Нет аккаунта? ' : 'Уже есть аккаунт? '}
          <button onClick={handleModeSwitch}
            style={{
              border: 'none', background: 'none',
              color: '#3B00FF', cursor: 'pointer'
            }}>
            {mode === 'login' ? 'Зарегистрироваться' : 'Войти'}
          </button>
        </p>
      </div>
    </div>
  );
};