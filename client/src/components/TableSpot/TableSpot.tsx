import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import type { LoungeTable } from '../../types';
import { UsersIcon } from '../Icons/Icons';
import './TableSpot.scss';

type TableSpotProps = {
  table: LoungeTable;
  guests: number;
  selected: boolean;
  onSelect: (id: number) => void;
};

export function TableSpot({ table, guests, selected, onSelect }: TableSpotProps) {
  const { t } = useTranslation();
  const available = table.status === 'available';
  const statusKey = available ? 'Available' : table.status === 'occupied' ? 'Occupied' : 'Reserved';

  return (
    <button
      aria-label={t('booking.tableAria', {
        number: table.number,
        capacity: table.capacity,
        status: t(`booking.status${statusKey}`),
      })}
      disabled={!available || table.capacity < guests}
      onClick={() => onSelect(table.id)}
      className={clsx('table-spot', `table-spot--${table.shape}`, {
        'is-selected': selected,
        'is-reserved': !available,
        'is-too-small': table.capacity < guests,
      })}
      style={{ left: `${table.positionX}%`, top: `${table.positionY}%` }}
    >
      <b>{table.number}</b>
      <small><UsersIcon size={11} />{table.capacity}</small>
    </button>
  );
}
