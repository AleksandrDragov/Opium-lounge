import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { currentLocale } from '../i18n';
import { api } from '../services/api';
import type { MenuCategory } from '../types';

const fallback: MenuCategory[] = [
  { id: 1, name: 'Кальяни', slug: 'hookah', items: [{ id: 1, name: 'Purple Haze', description: 'Виноград, чорниця, лаванда та легка прохолода.', price: 780, imageKey: 'purple' }, { id: 2, name: 'Dark Ritual', description: 'Гранат, пряна вишня та терпкий чай.', price: 850, imageKey: 'dark' }] },
  { id: 2, name: 'Коктейлі', slug: 'cocktails', items: [{ id: 3, name: 'Neon Sour', description: 'Джин, юзу, фіалка, лимон і шовкова піна.', price: 320, imageKey: 'neon' }, { id: 4, name: 'Opium Kiss', description: 'Горілка, малина, лічі та троянда.', price: 360, imageKey: 'kiss' }] },
  { id: 3, name: 'Безалкогольні', slug: 'soft', items: [{ id: 5, name: 'Zero Gravity', description: 'Маракуя, грейпфрут, тонік і розмарин.', price: 220, imageKey: 'zero' }] },
  { id: 4, name: 'Закуски', slug: 'snacks', items: [{ id: 6, name: 'Truffle Fries', description: 'Хрустка картопля, пармезан і трюфельний соус.', price: 260, imageKey: 'fries' }] },
];

export function MenuPage() {
  const { t } = useTranslation();
  const { data = fallback } = useQuery({ queryKey: ['menu'], queryFn: () => api<MenuCategory[]>('/menu'), placeholderData: fallback });
  const [active, setActive] = useState('all');
  const items = useMemo(() => data.flatMap((category) => category.items.map((item) => ({ ...item, category: category.slug }))).filter((item) => active === 'all' || item.category === active), [data, active]);
  return <div className="page menu-page">
    <header className="page-hero container"><p className="eyebrow"><span/> {t('menu.kicker')}</p><h1>{t('menu.titleLine1')} <em>{t('menu.titleLine2')}</em></h1><p>{t('menu.intro')}</p></header>
    <section className="container">
      <div className="filters" role="group" aria-label={t('menu.categoryLabel')}>
        <button className={active === 'all' ? 'active' : ''} onClick={() => setActive('all')}>{t('menu.all')}</button>
        {data.map((category) => <button key={category.slug} className={active === category.slug ? 'active' : ''} onClick={() => setActive(category.slug)}>{t(`menu.categories.${category.slug}`, { defaultValue: category.name })}</button>)}
      </div>
      <div className="menu-grid">{items.map((item, index) => <article className="menu-card" key={item.id}>
        <div className={`menu-image menu-image--${item.imageKey}`}><span>{String(index + 1).padStart(2, '0')}</span><b>{t(`menu.items.${item.imageKey}.name`, { defaultValue: item.name }).charAt(0)}</b></div>
        <div className="menu-info"><div><p className="micro">{t('menu.signature')} / {t(`menu.categories.${item.category}`)}</p><h2>{t(`menu.items.${item.imageKey}.name`, { defaultValue: item.name })}</h2></div><strong>{new Intl.NumberFormat(currentLocale()).format(item.price)} ₴</strong><p>{t(`menu.items.${item.imageKey}.description`, { defaultValue: item.description })}</p></div>
      </article>)}</div>
    </section>
  </div>;
}
