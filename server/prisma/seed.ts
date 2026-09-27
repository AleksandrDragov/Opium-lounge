import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const tables = [
  { number: 1, capacity: 2, zone: 'BAR' as const, positionX: 12, positionY: 20, shape: 'round' },
  { number: 2, capacity: 2, zone: 'BAR' as const, positionX: 12, positionY: 39, shape: 'round' },
  { number: 3, capacity: 2, zone: 'BAR' as const, positionX: 12, positionY: 58, shape: 'round' },
  { number: 4, capacity: 2, zone: 'BAR' as const, positionX: 12, positionY: 77, shape: 'round' },
  { number: 5, capacity: 4, zone: 'MAIN' as const, positionX: 38, positionY: 20, shape: 'round' },
  { number: 6, capacity: 4, zone: 'MAIN' as const, positionX: 64, positionY: 20, shape: 'round' },
  { number: 7, capacity: 4, zone: 'MAIN' as const, positionX: 38, positionY: 39, shape: 'round' },
  { number: 8, capacity: 4, zone: 'MAIN' as const, positionX: 64, positionY: 39, shape: 'round' },
  { number: 9, capacity: 4, zone: 'MAIN' as const, positionX: 38, positionY: 58, shape: 'round' },
  { number: 10, capacity: 4, zone: 'MAIN' as const, positionX: 64, positionY: 58, shape: 'round' },
  { number: 11, capacity: 4, zone: 'MAIN' as const, positionX: 38, positionY: 77, shape: 'round' },
  { number: 12, capacity: 4, zone: 'MAIN' as const, positionX: 64, positionY: 77, shape: 'round' },
  { number: 13, capacity: 8, zone: 'VIP' as const, positionX: 87, positionY: 30, shape: 'vip' },
  { number: 14, capacity: 10, zone: 'VIP' as const, positionX: 87, positionY: 67, shape: 'vip' },
];

const menu = [
  { name: 'Кальяни', slug: 'hookah', items: [
    ['Midnight Classic', 'Авторський мікс ягід, м’яти та холодного цитрусу.', 650, 'smoke'],
    ['Purple Haze', 'Виноград, чорниця, лаванда та легка прохолода.', 780, 'purple'],
    ['Dark Ritual', 'Гранат, пряна вишня та терпкий чай.', 850, 'dark'],
  ] },
  { name: 'Коктейлі', slug: 'cocktails', items: [
    ['Neon Sour', 'Джин, юзу, фіалка, лимон і шовкова піна.', 320, 'neon'],
    ['Opium Kiss', 'Горілка, малина, лічі та троянда.', 360, 'kiss'],
    ['Backstage', 'Бурбон, ожина, вермут і шоколадний біттер.', 390, 'amber'],
  ] },
  { name: 'Безалкогольні', slug: 'soft', items: [
    ['Zero Gravity', 'Маракуя, грейпфрут, тонік і розмарин.', 220, 'zero'],
    ['Pink Noise', 'Полуниця, базилік, лайм і содова.', 210, 'pink'],
  ] },
  { name: 'Закуски', slug: 'snacks', items: [
    ['Truffle Fries', 'Хрустка картопля, пармезан і трюфельний соус.', 260, 'fries'],
    ['Beef Sliders', 'Мінібургери з яловичиною, чедером і чилі.', 360, 'beef'],
    ['Night Olives', 'Мариновані оливки з цитрусом і травами.', 190, 'olives'],
  ] },
];

async function main() {
  for (const table of tables) await prisma.loungeTable.upsert({ where: { number: table.number }, update: table, create: table });
  for (let index = 0; index < menu.length; index++) {
    const category = menu[index];
    const existing = await prisma.menuCategory.findUnique({ where: { slug: category.slug } });
    if (!existing) await prisma.menuCategory.create({
      data: { name: category.name, slug: category.slug, sortOrder: index,
        items: { create: category.items.map(([name, description, price, imageKey]) => ({ name: String(name), description: String(description), price: Number(price), imageKey: String(imageKey) })) } },
    });
  }
  await prisma.user.upsert({
    where: { email: 'demo@opium.local' },
    update: { phone: null },
    create: { name: 'Demo Guest', email: 'demo@opium.local', passwordHash: await bcrypt.hash('Opium123!', 12) },
  });
}

main().finally(() => prisma.$disconnect());
