import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';

export const tablesRouter = Router();

tablesRouter.get('/', async (req, res, next) => {
  try {
    const query = z.object({ startsAt: z.string().datetime().optional() }).parse(req.query);
    const tables = await prisma.loungeTable.findMany({ orderBy: { number: 'asc' } });
    if (!query.startsAt) return res.json(tables.map((table) => ({ ...table, status: 'available' })));

    const start = new Date(query.startsAt);
    const from = new Date(start.getTime() - 2 * 60 * 60 * 1000);
    const to = new Date(start.getTime() + 2 * 60 * 60 * 1000);
    const bookings = await prisma.booking.findMany({
      where: { status: 'CONFIRMED', startsAt: { gt: from, lt: to } },
      select: { tableId: true },
    });
    const reserved = new Set(bookings.map((booking) => booking.tableId));
    const isCurrentSlot = start.getTime() <= Date.now() && start.getTime() + 2 * 60 * 60 * 1000 > Date.now();
    res.json(tables.map((table) => ({ ...table, status: reserved.has(table.id) ? (isCurrentSlot ? 'occupied' : 'reserved') : 'available' })));
  } catch (error) { next(error); }
});
