import 'dotenv/config';
import assert from 'node:assert/strict';
import { PrismaClient } from '@prisma/client';

const base = 'http://localhost:4000/api';
const prisma = new PrismaClient();
let createdId;

async function run() {
  const health = await fetch(`${base}/health`).then((response) => response.json());
  assert.equal(health.status, 'ok');

  const menu = await fetch(`${base}/menu`).then((response) => response.json());
  assert.ok(menu.length >= 4);

  const login = await fetch(`${base}/auth/login`, {
    method: 'POST', headers: { 'Content-Type': 'application/json', Origin: 'http://localhost:3000' },
    body: JSON.stringify({ email: 'demo@opium.local', password: 'Opium123!' }),
  });
  assert.equal(login.status, 200);
  const cookie = login.headers.get('set-cookie')?.split(';')[0];
  assert.ok(cookie);

  const startsAt = new Date(Date.now() + 3 * 86400000).toISOString();
  const tables = await fetch(`${base}/tables?startsAt=${encodeURIComponent(startsAt)}`).then((response) => response.json());
  assert.ok(tables.length >= 8);
  const table = tables.find((item) => item.status === 'available' && item.capacity >= 2);
  assert.ok(table);

  const options = {
    method: 'POST', headers: { 'Content-Type': 'application/json', Origin: 'http://localhost:3000', Cookie: cookie },
    body: JSON.stringify({ tableId: table.id, startsAt, guests: 2 }),
  };
  const bookingResponse = await fetch(`${base}/bookings`, options);
  assert.equal(bookingResponse.status, 201);
  const booking = await bookingResponse.json();
  createdId = booking.id;

  const collision = await fetch(`${base}/bookings`, options);
  assert.equal(collision.status, 409);
  const unavailable = await fetch(`${base}/tables?startsAt=${encodeURIComponent(startsAt)}`).then((response) => response.json());
  assert.equal(unavailable.find((item) => item.id === table.id).status, 'reserved');

  const cancel = await fetch(`${base}/bookings/${booking.id}/cancel`, {
    method: 'PATCH', headers: { Origin: 'http://localhost:3000', Cookie: cookie },
  });
  assert.equal(cancel.status, 200);
  assert.equal((await cancel.json()).status, 'CANCELLED');
  console.log('Smoke test passed: health, menu, auth, tables, booking conflict and cancellation.');
}

run().catch((error) => { console.error(error); process.exitCode = 1; }).finally(async () => {
  if (createdId) await prisma.booking.delete({ where: { id: createdId } });
  await prisma.$disconnect();
});
