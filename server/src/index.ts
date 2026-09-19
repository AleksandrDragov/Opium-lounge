import 'dotenv/config';
import path from 'node:path';
import { existsSync } from 'node:fs';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { type ErrorRequestHandler } from 'express';
import helmet from 'helmet';
import { ZodError } from 'zod';
import { authRouter } from './routes/auth';
import { bookingsRouter } from './routes/bookings';
import { menuRouter } from './routes/menu';
import { tablesRouter } from './routes/tables';

const app = express();
const port = Number(process.env.PORT || 4000);

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000', credentials: true }));
app.use(express.json({ limit: '32kb' }));
app.use(cookieParser());
app.use((req, res, next) => {
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
    const origin = req.get('origin');
    const allowed = process.env.CLIENT_URL || 'http://localhost:3000';
    const sameOrigin = `${req.protocol}://${req.get('host')}`;
    if (origin && origin !== allowed && origin !== sameOrigin) return res.status(403).json({ code: 'forbiddenOrigin', message: 'Недозволене джерело запиту.' });
  }
  next();
});

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/api/auth', authRouter);
app.use('/api/menu', menuRouter);
app.use('/api/tables', tablesRouter);
app.use('/api/bookings', bookingsRouter);

app.use('/api', (_req, res) => res.status(404).json({ code: 'notFound', message: 'Маршрут не знайдено.' }));

const clientDist = path.resolve(__dirname, '../../client/dist');
if (process.env.NODE_ENV === 'production' && existsSync(path.join(clientDist, 'index.html'))) {
  app.use(express.static(clientDist));
  app.get('*', (_req, res) => res.sendFile(path.join(clientDist, 'index.html')));
}

const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof ZodError) {
    res.status(400).json({ code: 'invalidInput', message: 'Перевірте введені дані.', issues: error.issues });
    return;
  }
  console.error(error);
  res.status(500).json({ code: 'serverError', message: 'Сталася внутрішня помилка сервера.' });
};
app.use(errorHandler);

app.listen(port, () => console.log(`Opium API is running on http://localhost:${port}`));
