import { useTranslation } from 'react-i18next';
import { currentLocale } from '../../i18n';
import type { Booking } from '../../types';
import { CalendarIcon, UsersIcon } from '../Icons/Icons';
import './BookingTicket.scss';

type BookingTicketProps = {
  booking: Booking;
  isCancelling: boolean;
  onCancel: (id: number) => void;
};

export function BookingTicket({ booking: b, isCancelling, onCancel }: BookingTicketProps) {
  const { t } = useTranslation();
  return (
    <article className={b.status === 'CANCELLED' ? 'booking-ticket is-cancelled' : 'booking-ticket'}><div className="ticket-date"><b>{new Date(b.startsAt).toLocaleDateString(currentLocale(),{day:'2-digit'})}</b><span>{new Date(b.startsAt).toLocaleDateString(currentLocale(),{month:'short'}).toLocaleUpperCase(currentLocale())}</span></div><div className="ticket-main"><p>{t(`profile.${b.status.toLowerCase()}`)}</p><h3>{t('common.tableNumber', { number: b.table.number })} · {t(`common.zone${b.table.zone === 'MAIN' ? 'Main' : b.table.zone === 'BAR' ? 'Bar' : 'Vip'}`)}</h3><span><CalendarIcon size={16}/>{new Date(b.startsAt).toLocaleTimeString(currentLocale(),{hour:'2-digit',minute:'2-digit'})}</span><span><UsersIcon size={16}/>{t('common.guests', { count: b.guests })}</span></div>{b.status === 'CONFIRMED' && <button onClick={() => onCancel(b.id)} disabled={isCancelling}>{t('profile.cancel')}</button>}</article>
  );
}
