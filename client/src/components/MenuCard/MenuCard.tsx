import { useTranslation } from 'react-i18next';
import { currentLocale } from '../../i18n';
import type { MenuItem } from '../../types';
import './MenuCard.scss';

type MenuCardProps = {
  item: MenuItem & { category: string };
  index: number;
};

export function MenuCard({ item, index }: MenuCardProps) {
  const { t } = useTranslation();
  return (
    <article className="menu-card">
        <div className={`menu-image menu-image--${item.imageKey}`}><span>{String(index + 1).padStart(2, '0')}</span><b>{t(`menu.items.${item.imageKey}.name`, { defaultValue: item.name }).charAt(0)}</b></div>
        <div className="menu-info"><div><p className="micro">{t('menu.signature')} / {t(`menu.categories.${item.category}`)}</p><h2>{t(`menu.items.${item.imageKey}.name`, { defaultValue: item.name })}</h2></div><strong>{new Intl.NumberFormat(currentLocale()).format(item.price)} ₴</strong><p>{t(`menu.items.${item.imageKey}.description`, { defaultValue: item.description })}</p></div>
      </article>
  );
}
