import type { Screen } from './members';

export const menuItems: Array<{
  screen: Exclude<Screen, 'welcome' | 'menu'>;
  title: string;
  description: string;
  icon: string;
}> = [
  {
    screen: 'gifts',
    title: 'Weekly Gifts',
    description: 'Discover this month’s member gifts',
    icon: '✦',
  },
  {
    screen: 'promotions',
    title: 'Promotions',
    description: 'Explore your monthly offers',
    icon: '★',
  },
  {
    screen: 'points',
    title: 'Rewards Points',
    description: 'View points and redemption options',
    icon: '◈',
  },
  {
    screen: 'account',
    title: 'My Account',
    description: 'Review your membership details',
    icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="7.5" r="3.5"/><path d="M5 20v-2a7 7 0 0 1 14 0v2"/></svg>',
  },
];

