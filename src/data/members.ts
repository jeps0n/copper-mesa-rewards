export type Screen =
  | 'welcome'
  | 'menu'
  | 'gifts'
  | 'promotions'
  | 'points'
  | 'account';

export type Tier = 'Bronze' | 'Silver' | 'Gold';

export interface Member {
  name: string;
  tier: Tier;
  points: number;
  card: string;
}

export const members: Member[] = [
  {
    name: 'Alex Johnson',
    tier: 'Bronze',
    points: 1500,
    card: '•••• 7824',
  },
  {
    name: 'Peyton Campbell',
    tier: 'Silver',
    points: 3500,
    card: '•••• 1936',
  },
  {
    name: 'Tracy Harris',
    tier: 'Gold',
    points: 10000,
    card: '•••• 3091',
  },
];

