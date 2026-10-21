import type { Member } from '../data/members';

export function renderRewardsPoints(member: Member): string {
  return `
      <p class="screen-intro">Turn your points into more ways to play.</p>
      <div class="points-panel">
        <span class="offer-kicker">AVAILABLE POINTS</span>
        <strong class="points-total">${member.points.toLocaleString('en-US')}</strong>
        <div class="conversion-rule">100 points = $1 in rewards value</div>
        <div class="redemption-preview">
          <div>
            <h3>1,000 Points</h3>
            <p>Exchange for $10 Free Slot Play</p>
          </div>
          <span class="preview-pill">NOT AVAILABLE</span>
        </div>
      </div>
    `;
}
