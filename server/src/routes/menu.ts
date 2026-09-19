import { Router } from 'express';
import { prisma } from '../lib/prisma';

export const menuRouter = Router();

menuRouter.get('/', async (_req, res, next) => {
  try {
    const categories = await prisma.menuCategory.findMany({
      orderBy: { sortOrder: 'asc' },
      include: { items: { where: { isAvailable: true }, orderBy: { name: 'asc' } } },
    });
    res.json(categories);
  } catch (error) { next(error); }
});

