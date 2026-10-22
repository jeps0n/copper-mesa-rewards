import { giftSchedule, monthlyGiftPeriods } from '../data/giftSchedule';
import { weeklyGifts } from '../data/rewards';
import { memberStates, type MemberState } from '../data/session';

// Historical results are simulated only for gifts already expired at startup.
const startupSchedule = giftSchedule();
const historicalGiftKeys = new Set(
  startupSchedule.periods
    .filter((period) => startupSchedule.currentSecond > period.closesAt)
    .map((period) => period.key),
);

const giftHistory = new Map<MemberState, Map<string, boolean>>(
  memberStates.map((state) => [
    state,
    new Map(
      [...historicalGiftKeys].map((key) => [key, Math.random() < 0.5]),
    ),
  ]),
);

function wasPreviouslyClaimed(state: MemberState, key: string): boolean {
  return giftHistory.get(state)?.get(key) ?? false;
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
            <h3><span class="gift-week-label">WEEK</span> ${period.index + 1}</h3>
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
