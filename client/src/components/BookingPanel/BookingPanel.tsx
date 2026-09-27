import { useTranslation } from 'react-i18next';
import type { LoungeTable } from '../../types';
import { ArrowIcon } from '../Icons/Icons';
import './BookingPanel.scss';

export type BookingDetails = {
  date: string;
  time: string;
  guests: number;
  comment: string;
};

type BookingPanelProps = {
  details: BookingDetails;
  minDate: string;
  selected: LoungeTable | null;
  isAuthenticated: boolean;
  isPending: boolean;
  error?: string;
  onChange: (changes: Partial<BookingDetails>) => void;
  onReserve: () => void;
};

const times = ['18:00', '19:00', '20:00', '21:00', '22:00', '23:00', '00:00', '01:00'];
const guestCounts = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export function BookingPanel({
  details, minDate, selected, isAuthenticated, isPending, error, onChange, onReserve,
}: BookingPanelProps) {
  const { t } = useTranslation();

  return (
    <aside className="booking-panel">
      <p className="micro">{t('booking.detailsLabel')}</p>
      <h2>{t('booking.detailsTitle')}</h2>
      <div className="field-row">
        <label>
          {t('booking.date')}
          <input type="date" min={minDate} value={details.date} onChange={(event) => onChange({ date: event.target.value })} />
        </label>
        <label>
          {t('booking.time')}
          <select value={details.time} onChange={(event) => onChange({ time: event.target.value })}>
            {times.map((time) => <option key={time}>{time}</option>)}
          </select>
        </label>
      </div>
      <label>
        {t('booking.guestCount')}
        <select value={details.guests} onChange={(event) => onChange({ guests: Number(event.target.value) })}>
          {guestCounts.map((count) => <option value={count} key={count}>{t('common.guests', { count })}</option>)}
        </select>
      </label>
      <label>
        {t('booking.comment')}
        <textarea
          rows={3}
          maxLength={500}
          placeholder={t('booking.commentPlaceholder')}
          value={details.comment}
          onChange={(event) => onChange({ comment: event.target.value })}
        />
      </label>
      {selected ? (
        <div className="selected-table">
          <div>
            <span>{t('booking.yourChoice')}</span>
            <b>{t('common.tableNumber', { number: selected.number })}</b>
            <small>
              {t(`common.zone${selected.zone === 'MAIN' ? 'Main' : selected.zone === 'BAR' ? 'Bar' : 'Vip'}`)}
              {' · '}{t('booking.upToGuests', { count: selected.capacity })}
            </small>
          </div>
          <strong>#{selected.number}</strong>
        </div>
      ) : <div className="selection-hint">{t('booking.selectHint')}</div>}
      {error && <p className="form-error">{error}</p>}
      <button disabled={!selected || isPending} onClick={onReserve} className="button button--primary button--full">
        {isPending ? t('booking.reserving') : isAuthenticated ? t('booking.confirm') : t('booking.loginAndReserve')}
        {' '}<ArrowIcon />
      </button>
      <p className="fine-print">{t('booking.holdNote')}</p>
    </aside>
  );
}
