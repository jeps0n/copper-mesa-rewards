import type { Member } from '../data/members';

export function renderPromotions(member: Member): string {
  const offers = {
    Bronze: [10, 15],
    Silver: [25, 30],
    Gold: [100, 75],
  }[member.tier];

  return `
      <p class="screen-intro">Your monthly offers as a ${member.tier} member.</p>
      <div class="content-grid two-up">
        <article class="offer-card featured">
          <span class="offer-kicker">ELECTRONIC CREDIT</span>
          <h3>Free Slot Play</h3>
          <strong class="offer-value">$${offers[0]}</strong>
          <p>Applied electronically when claimed</p>
          <span class="status-label">NOT AVAILABLE</span>
        </article>
        <article class="offer-card">
          <span class="offer-kicker">PRINTED VOUCHER</span>
          <h3>Dining Credit</h3>
          <strong class="offer-value">$${offers[1]}</strong>
          <p>Redeem for a dining voucher</p>
          <span class="status-label">NOT AVAILABLE</span>
        </article>
      </div>
    `;
}
