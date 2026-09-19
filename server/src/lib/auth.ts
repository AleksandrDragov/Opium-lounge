import type { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';
import type { AuthPayload, AuthRequest } from '../types';

if (process.env.NODE_ENV === 'production' && (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32)) {
  throw new Error('JWT_SECRET must be set to a strong value in production.');
}
const jwtSecret = process.env.JWT_SECRET || 'development-only-change-me';

export function createToken(payload: AuthPayload) {
  return jwt.sign(payload, jwtSecret, { expiresIn: '7d' });
}

export function setAuthCookie(res: Response, token: string) {
  res.cookie('opium_session', token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production' && process.env.COOKIE_SECURE !== 'false',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/',
  });
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const token = req.cookies?.opium_session;
  if (!token) return res.status(401).json({ code: 'authRequired', message: 'Потрібно увійти в профіль.' });

  try {
    req.auth = jwt.verify(token, jwtSecret) as AuthPayload;
    next();
  } catch {
    return res.status(401).json({ code: 'sessionExpired', message: 'Сесія недійсна або завершилася.' });
  }
}
