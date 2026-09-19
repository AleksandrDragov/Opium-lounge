import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../app/AuthContext';
import { ArrowIcon } from '../components/Icons';

type Values = { name?: string; email: string; phone?: string; password: string };

export function AuthPage() {
  const { t } = useTranslation();
  const schema = z.object({ name: z.string().optional(), email: z.string().email(t('auth.invalidEmail')), phone: z.string().optional(), password: z.string().min(8, t('auth.passwordMin')) });
  const [mode, setMode] = useState<'login'|'register'>('login');
  const [serverError, setServerError] = useState('');
  const { user, login, register: registerUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<Values>({ resolver: zodResolver(schema) });
  if (user) return <Navigate to="/profile" replace/>;
  const changeMode = (next: 'login'|'register') => { setMode(next); setServerError(''); reset(); };
  const submit = async (values: Values) => {
    try {
      setServerError('');
      if (mode === 'login') await login({ email: values.email, password: values.password });
      else {
        if (!values.name || values.name.trim().length < 2) { setServerError(t('auth.nameMin')); return; }
        await registerUser({ name: values.name, email: values.email, phone: values.phone, password: values.password });
      }
      navigate((location.state as { from?: string } | null)?.from || '/profile');
    } catch (error) { setServerError(error instanceof Error ? error.message : t('auth.requestFailed')); }
  };
  return <section className="auth-page page">
    <div className="auth-art"><p>{t('auth.artLine1')}<br/><em>{t('auth.artLine2')}</em></p><span>{t('auth.artCaption')}</span></div>
    <div className="auth-form-wrap"><div className="auth-tabs"><button onClick={() => changeMode('login')} className={mode === 'login' ? 'active' : ''}>{t('auth.login')}</button><button onClick={() => changeMode('register')} className={mode === 'register' ? 'active' : ''}>{t('auth.register')}</button></div><p className="eyebrow"><span/> {mode === 'login' ? t('auth.welcomeBack') : t('auth.joinNight')}</p><h1>{mode === 'login' ? t('auth.loginTitle') : t('auth.registerTitle')}</h1>
      <form onSubmit={handleSubmit(submit)} noValidate>
        {mode === 'register' && <><label>{t('auth.name')}<input autoComplete="name" {...register('name')} placeholder={t('auth.namePlaceholder')}/></label><label>{t('auth.phone')}<input autoComplete="tel" {...register('phone')} placeholder={t('auth.phonePlaceholder')}/></label></>}
        <label>{t('auth.email')}<input type="email" autoComplete="email" {...register('email')} placeholder={t('auth.emailPlaceholder')}/><small>{errors.email?.message}</small></label>
        <label>{t('auth.password')}<input type="password" autoComplete={mode === 'login' ? 'current-password' : 'new-password'} {...register('password')} placeholder={t('auth.passwordPlaceholder')}/><small>{errors.password?.message}</small></label>
        {serverError && <p className="form-error">{serverError}</p>}
        <button className="button button--primary button--full" disabled={isSubmitting}>{isSubmitting ? t('auth.wait') : mode === 'login' ? t('auth.loginButton') : t('auth.registerButton')} <ArrowIcon/></button>
      </form><p className="demo-hint">{t('auth.demo')}</p>
    </div>
  </section>;
}
