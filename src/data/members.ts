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
    name: 'Alex Rivera',
    tier: 'Bronze',
    points: 1500,
    card: '•••• 1042',
  },
  {
    name: 'Jordan Lee',
    tier: 'Silver',
    points: 3500,
    card: '•••• 2086',
  },
  {
    name: 'Morgan Blake',
    tier: 'Gold',
    points: 10000,
    card: '•••• 3091',
  },
];

