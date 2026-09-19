import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../app/AuthContext';
import { currentLocale } from '../i18n';
import { ArrowIcon, UsersIcon } from '../components/Icons';
import { api } from '../services/api';
import type { Booking, LoungeTable } from '../types';

const demoTables: LoungeTable[] = [
  { id: 1, number: 1, capacity: 2, zone: 'BAR', positionX: 12, positionY: 24, shape: 'round', status: 'available' },
  { id: 2, number: 2, capacity: 2, zone: 'BAR', positionX: 12, positionY: 50, shape: 'round', status: 'available' },
  { id: 3, number: 3, capacity: 4, zone: 'MAIN', positionX: 38, positionY: 26, shape: 'round', status: 'available' },
  { id: 4, number: 4, capacity: 4, zone: 'MAIN', positionX: 58, positionY: 26, shape: 'round', status: 'available' },
  { id: 5, number: 5, capacity: 6, zone: 'MAIN', positionX: 38, positionY: 58, shape: 'wide', status: 'available' },
  { id: 6, number: 6, capacity: 6, zone: 'MAIN', positionX: 61, positionY: 58, shape: 'wide', status: 'available' },
  { id: 7, number: 7, capacity: 8, zone: 'VIP', positionX: 83, positionY: 24, shape: 'vip', status: 'available' },
  { id: 8, number: 8, capacity: 10, zone: 'VIP', positionX: 83, positionY: 61, shape: 'vip', status: 'available' },
];
const localDate = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
const tomorrow = () => { const d = new Date(); d.setDate(d.getDate() + 1); return localDate(d); };

export function BookingPage() {
  const { t } = useTranslation();
  const [date, setDate] = useState(tomorrow());
  const [time, setTime] = useState('21:00');
  const [guests, setGuests] = useState(2);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [comment, setComment] = useState('');
  const [confirmed, setConfirmed] = useState<Booking | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const startsAt = useMemo(() => new Date(`${date}T${time}:00`).toISOString(), [date, time]);
  const { data: tables = demoTables, isFetching } = useQuery({ queryKey: ['tables', startsAt], queryFn: () => api<LoungeTable[]>(`/tables?startsAt=${encodeURIComponent(startsAt)}`), placeholderData: demoTables });
  const selected = tables.find((table) => table.id === selectedId) ?? null;
  const availableForGuests = (table: LoungeTable) => table.capacity >= guests && table.status === 'available';
  const mutation = useMutation({
    mutationFn: () => api<Booking>('/bookings', { method: 'POST', body: JSON.stringify({ tableId: selectedId, startsAt, guests, comment: comment || undefined }) }),
    onSuccess: (booking) => { setConfirmed(booking); queryClient.invalidateQueries({ queryKey: ['bookings'] }); },
  });
  const reserve = () => {
    if (!user) { navigate('/auth', { state: { from: '/booking' } }); return; }
    if (selected) mutation.mutate();
  };

  if (confirmed) return <section className="confirmation page container"><div className="confirmation-mark">✓</div><p className="eyebrow">{t('booking.confirmed')}</p><h1>{t('booking.confirmationLine1')}<br/><em>{t('booking.confirmationLine2')}</em></h1><div className="confirmation-details"><span>{new Date(confirmed.startsAt).toLocaleDateString(currentLocale(), { day: 'numeric', month: 'long' })}</span><span>{new Date(confirmed.startsAt).toLocaleTimeString(currentLocale(), { hour: '2-digit', minute: '2-digit' })}</span><span>{t('common.tableNumber', { number: confirmed.table.number })}</span><span>{t('common.guests', { count: confirmed.guests })}</span></div><Link to="/profile" className="button button--primary">{t('booking.myBookings')} <ArrowIcon/></Link></section>;

  return <div className="page booking-page">
    <header className="page-hero container"><p className="eyebrow"><span/> {t('booking.kicker')}</p><h1>{t('booking.titleLine1')} <em>{t('booking.titleLine2')}</em></h1><p>{t('booking.intro')}</p></header>
    <section className="booking-layout container">
      <div className="floor-wrap">
        <div className="floor-toolbar"><div><b>{t('booking.mapTitle')}</b><span>{isFetching ? t('booking.updating') : t('booking.availabilityCurrent')}</span></div><div className="legend"><span><i className="available"/>{t('booking.free')}</span><span><i className="reserved"/>{t('booking.reserved')}</span><span><i className="selected"/>{t('booking.selected')}</span></div></div>
        <div className="floor-plan">
          <div className="zone zone--bar"><span>BAR</span></div><div className="zone zone--main"><span>{t('booking.mainHall')}</span><i className="dance-floor">{t('booking.danceFloorLine1')}<br/>{t('booking.danceFloorLine2')}</i></div><div className="zone zone--vip"><span>{t('booking.vipRooms')}</span></div>
          <div className="restroom">WC</div><div className="entrance">{t('booking.entrance')}</div>
          {tables.map((table) => <button key={table.id} aria-label={t('booking.tableAria', { number: table.number, capacity: table.capacity, status: t(`booking.status${table.status === 'available' ? 'Available' : table.status === 'occupied' ? 'Occupied' : 'Reserved'}`) })} disabled={!availableForGuests(table)} onClick={() => setSelectedId(table.id)} className={clsx('table-spot', `table-spot--${table.shape}`, { 'is-selected': selectedId === table.id, 'is-reserved': table.status !== 'available', 'is-too-small': table.capacity < guests })} style={{ left: `${table.positionX}%`, top: `${table.positionY}%` }}><b>{table.number}</b><small><UsersIcon size={11}/>{table.capacity}</small></button>)}
        </div>
      </div>
      <aside className="booking-panel">
        <p className="micro">{t('booking.detailsLabel')}</p><h2>{t('booking.detailsTitle')}</h2>
        <div className="field-row"><label>{t('booking.date')}<input type="date" min={localDate(new Date())} value={date} onChange={(e) => { setDate(e.target.value); setSelectedId(null); }}/></label><label>{t('booking.time')}<select value={time} onChange={(e) => { setTime(e.target.value); setSelectedId(null); }}>{['18:00','19:00','20:00','21:00','22:00','23:00','00:00','01:00'].map(value => <option key={value}>{value}</option>)}</select></label></div>
        <label>{t('booking.guestCount')}<select value={guests} onChange={(e) => { setGuests(Number(e.target.value)); setSelectedId(null); }}>{[1,2,3,4,5,6,7,8,9,10].map(n => <option value={n} key={n}>{t('common.guests', { count: n })}</option>)}</select></label>
        <label>{t('booking.comment')}<textarea rows={3} maxLength={500} placeholder={t('booking.commentPlaceholder')} value={comment} onChange={(e) => setComment(e.target.value)}/></label>
        {selected ? <div className="selected-table"><div><span>{t('booking.yourChoice')}</span><b>{t('common.tableNumber', { number: selected.number })}</b><small>{t(`common.zone${selected.zone === 'MAIN' ? 'Main' : selected.zone === 'BAR' ? 'Bar' : 'Vip'}`)} · {t('booking.upToGuests', { count: selected.capacity })}</small></div><strong>#{selected.number}</strong></div> : <div className="selection-hint">{t('booking.selectHint')}</div>}
        {mutation.error && <p className="form-error">{mutation.error.message}</p>}
        <button disabled={!selected || mutation.isPending} onClick={reserve} className="button button--primary button--full">{mutation.isPending ? t('booking.reserving') : user ? t('booking.confirm') : t('booking.loginAndReserve')} <ArrowIcon/></button>
        <p className="fine-print">{t('booking.holdNote')}</p>
      </aside>
    </section>
  </div>;
}
