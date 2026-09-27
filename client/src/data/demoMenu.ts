import type { MenuCategory } from '../types';

export const demoMenu: MenuCategory[] = [
  { id: 1, name: 'Кальяни', slug: 'hookah', items: [{ id: 1, name: 'Purple Haze', description: 'Виноград, чорниця, лаванда та легка прохолода.', price: 780, imageKey: 'purple' }, { id: 2, name: 'Dark Ritual', description: 'Гранат, пряна вишня та терпкий чай.', price: 850, imageKey: 'dark' }] },
  { id: 2, name: 'Коктейлі', slug: 'cocktails', items: [{ id: 3, name: 'Neon Sour', description: 'Джин, юзу, фіалка, лимон і шовкова піна.', price: 320, imageKey: 'neon' }, { id: 4, name: 'Opium Kiss', description: 'Горілка, малина, лічі та троянда.', price: 360, imageKey: 'kiss' }] },
  { id: 3, name: 'Безалкогольні', slug: 'soft', items: [{ id: 5, name: 'Zero Gravity', description: 'Маракуя, грейпфрут, тонік і розмарин.', price: 220, imageKey: 'zero' }] },
  { id: 4, name: 'Закуски', slug: 'snacks', items: [{ id: 6, name: 'Truffle Fries', description: 'Хрустка картопля, пармезан і трюфельний соус.', price: 260, imageKey: 'fries' }] },
];
