import { Router } from 'express';
import { z } from 'zod';
import { requireAuth } from '../lib/auth';
import { prisma } from '../lib/prisma';
import type { AuthRequest } from '../types';

export const bookingsRouter = Router();
bookingsRouter.use(requireAuth);

const bookingSchema = z.object({
  tableId: z.number().int().positive(),
  startsAt: z.string().datetime(),
  guests: z.number().int().min(1).max(20),
  comment: z.string().trim().max(500).optional(),
});

bookingsRouter.get('/', async (req: AuthRequest, res, next) => {
  try {
    const bookings = await prisma.booking.findMany({
      where: { userId: req.auth!.userId },
      orderBy: { startsAt: 'desc' },
      include: { table: true },
    });
    res.json(bookings);
  } catch (error) { next(error); }
});

bookingsRouter.post('/', async (req: AuthRequest, res, next) => {
  try {
    const input = bookingSchema.parse(req.body);
    const startsAt = new Date(input.startsAt);
    if (startsAt.getTime() < Date.now()) return res.status(400).json({ code: 'pastDate', message: 'Оберіть майбутні дату й час.' });
    const table = await prisma.loungeTable.findUnique({ where: { id: input.tableId } });
    if (!table) return res.status(404).json({ code: 'tableNotFound', message: 'Столик не знайдено.' });
    if (input.guests > table.capacity) return res.status(400).json({ code: 'capacityExceeded', capacity: table.capacity, message: `Місткість столика — до ${table.capacity} гостей.` });

    const from = new Date(startsAt.getTime() - 2 * 60 * 60 * 1000);
    const to = new Date(startsAt.getTime() + 2 * 60 * 60 * 1000);
    const booking = await prisma.$transaction(async (tx) => {
      const collision = await tx.booking.findFirst({
        where: { tableId: input.tableId, status: 'CONFIRMED', startsAt: { gt: from, lt: to } },
      });
      if (collision) return null;
      return tx.booking.create({
        data: { ...input, startsAt, userId: req.auth!.userId },
        include: { table: true },
      });
    });
    if (!booking) return res.status(409).json({ code: 'tableUnavailable', message: 'Столик уже зайнятий у цей часовий проміжок.' });
    res.status(201).json(booking);
  } catch (error) { next(error); }
});

bookingsRouter.patch('/:id/cancel', async (req: AuthRequest, res, next) => {
  try {
    const id = z.coerce.number().int().positive().parse(req.params.id);
    const booking = await prisma.booking.findFirst({ where: { id, userId: req.auth!.userId } });
    if (!booking) return res.status(404).json({ code: 'bookingNotFound', message: 'Бронювання не знайдено.' });
    if (booking.startsAt.getTime() <= Date.now()) return res.status(400).json({ code: 'pastBooking', message: 'Минуле бронювання скасувати неможливо.' });
    const updated = await prisma.booking.update({ where: { id }, data: { status: 'CANCELLED' }, include: { table: true } });
    res.json(updated);
  } catch (error) { next(error); }
});
