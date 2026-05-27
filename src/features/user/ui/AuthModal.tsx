/**
 * Модальное окно входа и регистрации с подтверждением по коду из email.
 * @module user/ui/AuthModal
 */

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { UserFeature } from '../index';
import type { AuthForm } from '../types';
import styles from './AuthModal.module.scss';

export const AuthModal = () => {
  const dispatch = useDispatch();

  const isOpen = useSelector(UserFeature.selectors.selectIsAuthModalOpen);
  const mode = useSelector(UserFeature.selectors.selectAuthMode);
  const step = useSelector(UserFeature.selectors.selectAuthStep);
  const codeSent = useSelector(UserFeature.selectors.selectCodeSent);
  const form = useSelector(UserFeature.selectors.selectAuthForm);
  const isLoading = useSelector(UserFeature.selectors.selectUserIsLoading);
  const error = useSelector(UserFeature.selectors.selectUserError);
  const successMessage = useSelector(UserFeature.selectors.selectSuccessMessage);

  if (!isOpen) {
    return null;
  }

  const isRegister = mode === 'register';
  const isCodeStep = step === 'code';
  const title = isRegister ? 'Регистрация' : 'Вход';

  const submitLabel = isLoading
    ? isCodeStep
      ? 'Проверка...'
      : 'Отправка...'
    : isCodeStep
      ? 'Подтвердить и войти'
      : 'Получить код на email';

  const handleClose = () => {
    dispatch(UserFeature.actions.closeAuthModal());
  };

  const handleSubmit = () => {
    if (isCodeStep) {
      dispatch(UserFeature.actions.verifyCodeRequested());
    } else {
      dispatch(UserFeature.actions.sendCodeRequested());
    }
  };

  const handleBack = () => {
    dispatch(UserFeature.actions.setAuthStep('form'));
    dispatch(UserFeature.actions.setCodeSent(false));
    dispatch(UserFeature.actions.setFormField({ field: 'code', value: '' }));
  };

  const handleFieldChange = (field: keyof AuthForm, value: string) => {
    dispatch(UserFeature.actions.setFormField({ field, value }));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>{title}</h2>
        </div>
        <div className={styles.content}>
          {error && <div className={styles.error}>{error}</div>}
          {successMessage && isCodeStep && (
            <div className={styles.success}>{successMessage}</div>
          )}

          {isCodeStep ? (
            <>
              {codeSent && (
                <p className={styles.hint}>
                  Код отправлен на <strong>{form.email}</strong>. Проверьте почту (и папку «Спам»).
                </p>
              )}
              <label className={styles.label}>Код из письма</label>
              <input
                type="text"
                className={styles.input}
                placeholder="000000"
                value={form.code}
                onChange={(e) =>
                  handleFieldChange('code', e.target.value.replace(/\D/g, '').slice(0, 6))
                }
                onKeyDown={handleKeyDown}
                disabled={isLoading}
                autoFocus
                maxLength={6}
                inputMode="numeric"
              />
              <button type="button" className={styles.backLink} onClick={handleBack}>
                ← Изменить email или пароль
              </button>
            </>
          ) : (
            <>
              {isRegister && (
                <>
                  <label className={styles.label}>Имя</label>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="Ваше имя"
                    value={form.name}
                    onChange={(e) => handleFieldChange('name', e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={isLoading}
                    autoFocus
                  />
                </>
              )}
              <label className={styles.label}>Email</label>
              <input
                type="email"
                className={styles.input}
                placeholder="email@example.com"
                value={form.email}
                onChange={(e) => handleFieldChange('email', e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
                autoFocus={!isRegister}
              />
              <label className={styles.label}>Пароль</label>
              <input
                type="password"
                className={styles.input}
                placeholder={isRegister ? 'Минимум 6 символов' : 'Пароль'}
                value={form.password}
                onChange={(e) => handleFieldChange('password', e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
              />
              <p className={styles.hint}>На email придёт 6-значный код для подтверждения</p>
              <div className={styles.switchMode}>
                {isRegister ? (
                  <>
                    Уже есть аккаунт?
                    <button
                      type="button"
                      onClick={() => dispatch(UserFeature.actions.setAuthMode('login'))}
                    >
                      Войти
                    </button>
                  </>
                ) : (
                  <>
                    Нет аккаунта?
                    <button
                      type="button"
                      onClick={() => dispatch(UserFeature.actions.setAuthMode('register'))}
                    >
                      Зарегистрироваться
                    </button>
                  </>
                )}
              </div>
            </>
          )}
        </div>
        <div className={styles.footer}>
          <button className={styles.cancelBtn} onClick={handleClose} disabled={isLoading}>
            Отмена
          </button>
          <button className={styles.submitBtn} onClick={handleSubmit} disabled={isLoading}>
            {submitLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
