import { useTranslation } from 'react-i18next';
import type { LoungeTable } from '../../types';
import { TableSpot } from '../TableSpot/TableSpot';
import './FloorPlan.scss';

type FloorPlanProps = {
  tables: LoungeTable[];
  guests: number;
  selectedId: number | null;
  isFetching: boolean;
  onSelect: (id: number) => void;
};

export function FloorPlan({ tables, guests, selectedId, isFetching, onSelect }: FloorPlanProps) {
  const { t } = useTranslation();

  return (
    <div className="floor-wrap">
      <div className="floor-toolbar">
        <div>
          <b>{t('booking.mapTitle')} · 100 m²</b>
          <span>{isFetching ? t('booking.updating') : t('booking.availabilityCurrent')}</span>
        </div>
        <div className="legend">
          <span><i className="available" />{t('booking.free')}</span>
          <span><i className="reserved" />{t('booking.reserved')}</span>
          <span><i className="selected" />{t('booking.selected')}</span>
        </div>
      </div>
      <div className="floor-plan">
        <div className="zone zone--bar"><span>BAR</span></div>
        <div className="zone zone--main"><span>{t('booking.mainHall')}</span></div>
        <div className="zone zone--vip"><span>{t('booking.vipRooms')}</span></div>
        <div className="restroom">WC</div>
        <div className="entrance">{t('booking.entrance')}</div>
        {tables.map((table) => (
          <TableSpot key={table.id} table={table} guests={guests} selected={selectedId === table.id} onSelect={onSelect} />
        ))}
      </div>
    </div>
  );
}
