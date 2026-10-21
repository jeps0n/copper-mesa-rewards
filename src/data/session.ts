import { members } from './members';

export interface MemberState {
  points: number;
  claimedWeeks: Set<string>;
  claimedPromotions: Set<string>;
  cardCredit: number;
}

export const memberStates: MemberState[] = members.map((member) => ({
  points: member.points,
  claimedWeeks: new Set<string>(),
  claimedPromotions: new Set<string>(),
  cardCredit: 0,
}));

export function pacificDate(
  now = new Date(),
): { year: number; month: number; day: number } {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Los_Angeles',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  }).formatToParts(now);

  const value = (type: string): number => Number(
    parts.find((part) => part.type === type)?.value,
  );

  return {
    year: value('year'),
    month: value('month'),
    day: value('day'),
  };
}

export function monthKey(): string {
  const { year, month } = pacificDate();
  return `${year}-${String(month).padStart(2, '0')}`;
}
