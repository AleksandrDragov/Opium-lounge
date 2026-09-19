import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../app/AuthContext';
import { currentLocale } from '../i18n';
import { ArrowIcon, CalendarIcon, UsersIcon } from '../components/Icons';
import { api } from '../services/api';
import type { Booking } from '../types';

export function ProfilePage() {
  const { t } = useTranslation();
  const { user, isLoading, logout } = useAuth();
  const queryClient = useQueryClient();
  const bookings = useQuery({ queryKey: ['bookings'], queryFn: () => api<Booking[]>('/bookings'), enabled: Boolean(user) });
  const cancel = useMutation({ mutationFn: (id: number) => api(`/bookings/${id}/cancel`, { method: 'PATCH' }), onSuccess: () => queryClient.invalidateQueries({ queryKey: ['bookings'] }) });
  if (isLoading) return <div className="loader page">{t('common.loading')}</div>;
  if (!user) return <Navigate to="/auth" replace state={{ from: '/profile' }}/>;
  const future = (bookings.data || []).filter((b) => new Date(b.startsAt).getTime() > Date.now());
  const history = (bookings.data || []).filter((b) => new Date(b.startsAt).getTime() <= Date.now());
  return <div className="profile-page page container">
    <header className="profile-header"><div><p className="eyebrow"><span/> {t('profile.privateAccess')}</p><h1>{t('profile.hello')} <em>{user.name.split(' ')[0].toLocaleUpperCase(currentLocale())}.</em></h1><p>{user.email}{user.phone ? ` · ${user.phone}` : ''}</p></div><button className="text-button" onClick={logout}>{t('profile.logout')}</button></header>
    <section className="profile-section"><div className="section-title"><div><p className="micro">{t('profile.upcoming')} / {String(future.length).padStart(2,'0')}</p><h2>{t('profile.upcomingTitle')}</h2></div><Link to="/booking" className="button button--outline">{t('profile.newBooking')} <ArrowIcon/></Link></div>
      {bookings.isLoading ? <p>{t('profile.loadingBookings')}</p> : future.length ? <div className="booking-list">{future.map(b => <article className={b.status === 'CANCELLED' ? 'booking-ticket is-cancelled' : 'booking-ticket'} key={b.id}><div className="ticket-date"><b>{new Date(b.startsAt).toLocaleDateString(currentLocale(),{day:'2-digit'})}</b><span>{new Date(b.startsAt).toLocaleDateString(currentLocale(),{month:'short'}).toLocaleUpperCase(currentLocale())}</span></div><div className="ticket-main"><p>{t(`profile.${b.status.toLowerCase()}`)}</p><h3>{t('common.tableNumber', { number: b.table.number })} · {t(`common.zone${b.table.zone === 'MAIN' ? 'Main' : b.table.zone === 'BAR' ? 'Bar' : 'Vip'}`)}</h3><span><CalendarIcon size={16}/>{new Date(b.startsAt).toLocaleTimeString(currentLocale(),{hour:'2-digit',minute:'2-digit'})}</span><span><UsersIcon size={16}/>{t('common.guests', { count: b.guests })}</span></div>{b.status === 'CONFIRMED' && <button onClick={() => cancel.mutate(b.id)} disabled={cancel.isPending}>{t('profile.cancel')}</button>}</article>)}</div> : <div className="no-bookings"><span>{t('profile.noPlans')}</span><p>{t('profile.noPlansText')}</p><Link to="/booking" className="text-link">{t('profile.chooseTable')} <ArrowIcon/></Link></div>}
      {cancel.error && <p className="form-error">{cancel.error.message}</p>}
    </section>
    {history.length > 0 && <section className="profile-section"><div className="section-title"><h2>{t('profile.history')}</h2></div><div className="history-list">{history.map(b => <p key={b.id}>{t('common.tableNumber', { number: b.table.number })}<span>{new Date(b.startsAt).toLocaleDateString(currentLocale())} · {t(`profile.${b.status.toLowerCase()}`)}</span></p>)}</div></section>}
  </div>;
}
