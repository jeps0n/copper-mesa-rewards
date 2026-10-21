import type { Member } from '../data/members';
import { promotions } from '../data/rewards';
import { monthKey } from '../data/session';
import type { MemberState } from '../data/session';

export function renderPromotions(member: Member, state: MemberState): string {
  const offers = promotions[member.tier];
  const slotClaimed = state.claimedPromotions.has(`${monthKey()}-slot`);
  const diningClaimed = state.claimedPromotions.has(`${monthKey()}-dining`);

  return `
    <p class="screen-intro">Your monthly offers as a ${member.tier} member.</p>
    <div class="content-grid two-up">
      <article class="offer-card featured">
        <span class="offer-kicker">ELECTRONIC CREDIT</span>
        <h3>Free Slot Play</h3>
        <strong class="offer-value">$${offers.slot}</strong>
        <p>Loaded to your member card when claimed</p>
        ${slotClaimed
          ? '<span class="status-label status-pill">CLAIMED</span>'
          : '<button class="offer-action" data-redeem="slot">CLAIM OFFER</button>'}
      </article>
      <article class="offer-card">
        <span class="offer-kicker">PRINTED VOUCHER</span>
        <h3>Dining Credit</h3>
        <strong class="offer-value">$${offers.dining}</strong>
        <p>Receive a dining voucher from the kiosk</p>
        ${diningClaimed
          ? '<span class="status-label status-pill">CLAIMED</span>'
          : '<button class="offer-action" data-redeem="dining">CLAIM OFFER</button>'}
      </article>
    </div>
  `;
}
