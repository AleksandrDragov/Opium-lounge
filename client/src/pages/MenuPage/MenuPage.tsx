import './MenuPage.scss';
import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { demoMenu } from '../../data/demoMenu';
import { MenuCard } from '../../components/MenuCard/MenuCard';
import { PageHero } from '../../components/PageHero/PageHero';
import { api } from '../../services/api';
import type { MenuCategory } from '../../types';

export function MenuPage() {
  const { t } = useTranslation();
  const { data = demoMenu } = useQuery({ queryKey: ['menu'], queryFn: () => api<MenuCategory[]>('/menu'), placeholderData: demoMenu });
  const [active, setActive] = useState('all');
  const items = useMemo(() => data.flatMap((category) => category.items.map((item) => ({ ...item, category: category.slug }))).filter((item) => active === 'all' || item.category === active), [data, active]);
  return <div className="page menu-page">
    <PageHero kicker={t('menu.kicker')} title={t('menu.titleLine1')} accent={t('menu.titleLine2')} description={t('menu.intro')} />
    <section className="container">
      <div className="filters" role="group" aria-label={t('menu.categoryLabel')}>
        <button className={active === 'all' ? 'active' : ''} onClick={() => setActive('all')}>{t('menu.all')}</button>
        {data.map((category) => <button key={category.slug} className={active === category.slug ? 'active' : ''} onClick={() => setActive(category.slug)}>{t(`menu.categories.${category.slug}`, { defaultValue: category.name })}</button>)}
      </div>
      <div className="menu-grid">{items.map((item, index) => <MenuCard key={item.id} item={item} index={index} />)}</div>
    </section>
  </div>;
}
