import './ProfilePage.scss';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../app/AuthContext';
import { currentLocale } from '../../i18n';
import { ArrowIcon } from '../../components/Icons/Icons';
import { BookingTicket } from '../../components/BookingTicket/BookingTicket';
import { LoadingPage } from '../../components/LoadingPage/LoadingPage';
import { api } from '../../services/api';
import type { Booking } from '../../types';

export function ProfilePage() {
  const { t } = useTranslation();
  const { user, isLoading, logout } = useAuth();
  const queryClient = useQueryClient();
  const bookings = useQuery({ queryKey: ['bookings'], queryFn: () => api<Booking[]>('/bookings'), enabled: Boolean(user) });
  const cancel = useMutation({ mutationFn: (id: number) => api(`/bookings/${id}/cancel`, { method: 'PATCH' }), onSuccess: () => queryClient.invalidateQueries({ queryKey: ['bookings'] }) });
  if (isLoading) return <LoadingPage />;
  if (!user) return <Navigate to="/auth" replace state={{ from: '/profile' }}/>;
  const future = (bookings.data || []).filter((b) => new Date(b.startsAt).getTime() > Date.now());
  const history = (bookings.data || []).filter((b) => new Date(b.startsAt).getTime() <= Date.now());
  return <div className="profile-page page container">
    <header className="profile-header"><div><p className="eyebrow"><span/> {t('profile.privateAccess')}</p><h1>{t('profile.hello')} <em>{user.name.split(' ')[0].toLocaleUpperCase(currentLocale())}.</em></h1><p>{user.email}{user.phone ? ` · ${user.phone}` : ''}</p></div><button className="text-button" onClick={logout}>{t('profile.logout')}</button></header>
    <section className="profile-section"><div className="section-title"><div><p className="micro">{t('profile.upcoming')} / {String(future.length).padStart(2,'0')}</p><h2>{t('profile.upcomingTitle')}</h2></div><Link to="/booking" className="button button--outline">{t('profile.newBooking')} <ArrowIcon/></Link></div>
      {bookings.isLoading ? <p>{t('profile.loadingBookings')}</p> : future.length ? <div className="booking-list">{future.map(b => <BookingTicket key={b.id} booking={b} isCancelling={cancel.isPending} onCancel={(id) => cancel.mutate(id)} />)}</div> : <div className="no-bookings"><span>{t('profile.noPlans')}</span><p>{t('profile.noPlansText')}</p><Link to="/booking" className="text-link">{t('profile.chooseTable')} <ArrowIcon/></Link></div>}
      {cancel.error && <p className="form-error">{cancel.error.message}</p>}
    </section>
    {history.length > 0 && <section className="profile-section"><div className="section-title"><h2>{t('profile.history')}</h2></div><div className="history-list">{history.map(b => <p key={b.id}>{t('common.tableNumber', { number: b.table.number })}<span>{new Date(b.startsAt).toLocaleDateString(currentLocale())} · {t(`profile.${b.status.toLowerCase()}`)}</span></p>)}</div></section>}
  </div>;
}
