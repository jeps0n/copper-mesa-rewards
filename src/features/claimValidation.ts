import { activeGiftPeriod } from '../data/giftSchedule';
import { monthKey } from '../data/session';
import type { MemberState } from '../data/session';

export type ClaimKind = 'gift' | 'slot' | 'dining';

export type ValidClaim =
  | {
      kind: 'gift';
      key: string;
      weekIndex: number;
      pickupDate: string;
    }
  | {
      kind: 'slot' | 'dining';
      key: string;
    };

export function validateClaim(
  button: HTMLButtonElement,
  state: MemberState,
  clickedAt: Date,
): ValidClaim | null {
  const kind = button.dataset.redeem;

  if (kind === 'gift') {
    const period = activeGiftPeriod(clickedAt);

    if (
      !period
      || button.dataset.giftKey !== period.key
      || button.dataset.week !== String(period.index)
      || state.claimedWeeks.has(period.key)
    ) {
      return null;
    }

    return {
      kind: 'gift',
      key: period.key,
      weekIndex: period.index,
      pickupDate: period.pickupDate,
    };
  }

  if (kind === 'slot' || kind === 'dining') {
    const currentMonth = monthKey(clickedAt);
    const key = `${currentMonth}-${kind}`;

    if (
      button.dataset.month !== currentMonth
      || state.claimedPromotions.has(key)
    ) {
      return null;
    }

    return { kind, key };
  }

  return null;
}
