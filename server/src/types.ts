import type { Request } from 'express';

export type AuthPayload = { userId: number; role: 'CUSTOMER' | 'ADMIN' };
export type AuthRequest = Request & { auth?: AuthPayload };

