import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { currentLocale } from '../../i18n';
import type { Booking } from '../../types';
import { ArrowIcon } from '../Icons/Icons';
import './BookingConfirmation.scss';

export function BookingConfirmation({ booking }: { booking: Booking }) {
  const { t } = useTranslation();
  const startsAt = new Date(booking.startsAt);

  return (
    <section className="confirmation page container">
      <div className="confirmation-mark">✓</div>
      <p className="eyebrow">{t('booking.confirmed')}</p>
      <h1>{t('booking.confirmationLine1')}<br /><em>{t('booking.confirmationLine2')}</em></h1>
      <div className="confirmation-details">
        <span>{startsAt.toLocaleDateString(currentLocale(), { day: 'numeric', month: 'long' })}</span>
        <span>{startsAt.toLocaleTimeString(currentLocale(), { hour: '2-digit', minute: '2-digit' })}</span>
        <span>{t('common.tableNumber', { number: booking.table.number })}</span>
        <span>{t('common.guests', { count: booking.guests })}</span>
      </div>
      <Link to="/profile" className="button button--primary">{t('booking.myBookings')} <ArrowIcon /></Link>
    </section>
  );
}
