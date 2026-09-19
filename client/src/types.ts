export type User = { id: number; name: string; email: string; phone?: string | null; role: string };
export type Zone = 'MAIN' | 'BAR' | 'VIP';
export type LoungeTable = {
  id: number; number: number; capacity: number; zone: Zone;
  positionX: number; positionY: number; shape: string; status: 'available' | 'reserved' | 'occupied';
};
export type Booking = {
  id: number; startsAt: string; guests: number; status: 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  comment?: string; table: LoungeTable;
};
export type MenuItem = { id: number; name: string; description: string; price: number; imageKey: string };
export type MenuCategory = { id: number; name: string; slug: string; items: MenuItem[] };
