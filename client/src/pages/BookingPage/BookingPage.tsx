import './BookingPage.scss';
import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../app/AuthContext';
import { demoTables } from '../../data/demoTables';
import { PageHero } from '../../components/PageHero/PageHero';
import { FloorPlan } from '../../components/FloorPlan/FloorPlan';
import { BookingPanel, type BookingDetails } from '../../components/BookingPanel/BookingPanel';
import { BookingConfirmation } from '../../components/BookingConfirmation/BookingConfirmation';
import { api } from '../../services/api';
import type { Booking, LoungeTable } from '../../types';

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
  const mutation = useMutation({
    mutationFn: () => api<Booking>('/bookings', { method: 'POST', body: JSON.stringify({ tableId: selectedId, startsAt, guests, comment: comment || undefined }) }),
    onSuccess: (booking) => { setConfirmed(booking); queryClient.invalidateQueries({ queryKey: ['bookings'] }); },
  });
  const reserve = () => {
    if (!user) { navigate('/auth', { state: { from: '/booking' } }); return; }
    if (selected) mutation.mutate();
  };

  const changeDetails = (changes: Partial<BookingDetails>) => {
    if (changes.date !== undefined) setDate(changes.date);
    if (changes.time !== undefined) setTime(changes.time);
    if (changes.guests !== undefined) setGuests(changes.guests);
    if (changes.comment !== undefined) setComment(changes.comment);
    if (changes.date !== undefined || changes.time !== undefined || changes.guests !== undefined) setSelectedId(null);
  };

  if (confirmed) return <BookingConfirmation booking={confirmed} />;

  return <div className="page booking-page">
    <PageHero kicker={t('booking.kicker')} title={t('booking.titleLine1')} accent={t('booking.titleLine2')} description={t('booking.intro')} />
    <section className="booking-layout container">
      <FloorPlan tables={tables} guests={guests} selectedId={selectedId} isFetching={isFetching} onSelect={setSelectedId} />
      <BookingPanel
        details={{ date, time, guests, comment }}
        minDate={localDate(new Date())}
        selected={selected}
        isAuthenticated={Boolean(user)}
        isPending={mutation.isPending}
        error={mutation.error?.message}
        onChange={changeDetails}
        onReserve={reserve}
      />
    </section>
  </div>;
}
