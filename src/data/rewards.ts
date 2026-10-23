import type { Tier } from './members';

export const promotions: Record<Tier, { slot: number; dining: number }> = {
  Bronze: { slot: 10, dining: 15 },
  Silver: { slot: 25, dining: 30 },
  Gold: { slot: 100, dining: 75 },
};

export const weeklyGifts = [
  'Bluetooth Speaker',
  'Canvas Tote Bag',
  'Mystery Gift',
  'Football Jersey',
  'Mini Waffle Maker',
];

export const pointsPerRedemption = 1000;
export const dollarsPerRedemption = 10;
