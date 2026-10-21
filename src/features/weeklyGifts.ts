import { monthlyGiftPeriods } from '../data/giftSchedule';
import { weeklyGifts } from '../data/rewards';
import type { MemberState } from '../data/session';

const memberGiftHistory = new WeakMap<MemberState, Map<string, boolean>>();

function wasPreviouslyClaimed(state: MemberState, key: string): boolean {
  let history = memberGiftHistory.get(state);

  if (!history) {
    history = new Map<string, boolean>();
    memberGiftHistory.set(state, history);
  }

  if (!history.has(key)) {
    history.set(key, Math.random() < 0.5);
  }

  return history.get(key) ?? false;
}

export function renderWeeklyGifts(state: MemberState): string {
  const { periods, currentSecond } = monthlyGiftPeriods();

  return `
    <p class="screen-intro"><strong>PRINT:</strong> Mon 7 AM – Thu 7 PM · <strong>PICKUP:</strong> Thu 11 AM – 7 PM</p>
    <div class="content-grid gift-grid">
      ${periods.map((period) => {
        const claimed = state.claimedWeeks.has(period.key);
        const expired = currentSecond > period.closesAt;
        const available = currentSecond >= period.opensAt && !expired && !claimed;
        const status = claimed || (expired && wasPreviouslyClaimed(state, period.key))
          ? 'CLAIMED'
          : expired
            ? 'EXPIRED'
            : 'CLAIM';

        return `
          <article class="offer-card gift-card ${available ? 'featured' : 'offer-disabled'}">
            <h3>WEEK ${period.index + 1}</h3>
            <p>${weeklyGifts[period.giftIndex]}</p>
            <span class="gift-dates">${period.claimDates}</span>
            <button
              class="offer-action"
              data-redeem="gift"
              data-week="${period.index}"
              data-gift-key="${period.key}"
              ${available ? '' : 'disabled'}
            >${status}</button>
          </article>
        `;
      }).join('')}
    </div>
  `;
}
