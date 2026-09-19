import { Router } from 'express';
import bcrypt from 'bcryptjs';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { createToken, requireAuth, setAuthCookie } from '../lib/auth';
import type { AuthRequest } from '../types';

export const authRouter = Router();

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 30, standardHeaders: true });
const registerSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().transform((value) => value.toLowerCase()),
  phone: z.string().trim().max(30).optional(),
  password: z.string().min(8).max(72).regex(/[A-ZА-ЯІЇЄ]/, 'Додайте велику літеру').regex(/\d/, 'Додайте цифру'),
});
const loginSchema = z.object({ email: z.string().email(), password: z.string().min(1) });

authRouter.post('/register', limiter, async (req, res, next) => {
  try {
    const input = registerSchema.parse(req.body);
    const exists = await prisma.user.findUnique({ where: { email: input.email } });
    if (exists) return res.status(409).json({ code: 'emailExists', message: 'Користувач із таким email уже існує.' });
    const { password, ...profile } = input;
    const user = await prisma.user.create({
      data: { ...profile, passwordHash: await bcrypt.hash(password, 12) },
      select: { id: true, name: true, email: true, phone: true, role: true },
    });
    setAuthCookie(res, createToken({ userId: user.id, role: user.role }));
    res.status(201).json(user);
  } catch (error) { next(error); }
});

authRouter.post('/login', limiter, async (req, res, next) => {
  try {
    const input = loginSchema.parse(req.body);
    const user = await prisma.user.findUnique({ where: { email: input.email.toLowerCase() } });
    if (!user || !(await bcrypt.compare(input.password, user.passwordHash))) {
      return res.status(401).json({ code: 'invalidCredentials', message: 'Невірний email або пароль.' });
    }
    setAuthCookie(res, createToken({ userId: user.id, role: user.role }));
    res.json({ id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role });
  } catch (error) { next(error); }
});

authRouter.post('/logout', (_req, res) => {
  res.clearCookie('opium_session', { path: '/' });
  res.status(204).send();
});

authRouter.get('/me', requireAuth, async (req: AuthRequest, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.auth!.userId },
      select: { id: true, name: true, email: true, phone: true, role: true },
    });
    if (!user) return res.status(404).json({ code: 'userNotFound', message: 'Користувача не знайдено.' });
    res.json(user);
  } catch (error) { next(error); }
});
