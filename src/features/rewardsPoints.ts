import { dollarsPerRedemption, pointsPerRedemption } from '../data/rewards';
import type { MemberState } from '../data/session';

export function renderRewardsPoints(state: MemberState): string {
  const affordable = state.points >= pointsPerRedemption;

  return `
    <p class="screen-intro">Turn your points into more ways to play.</p>
    <div class="points-panel">
      <span class="offer-kicker">AVAILABLE POINTS</span>
      <strong class="points-total">${state.points.toLocaleString('en-US')}</strong>
      <div class="conversion-rule">100 points = $1 in rewards value</div>
      <div class="redemption-preview">
        <div>
          <h3>${pointsPerRedemption.toLocaleString('en-US')} Points</h3>
          <p>Exchange for $${dollarsPerRedemption} Free Slot Play</p>
        </div>
        <button class="offer-action points-action" data-redeem="points" ${affordable ? '' : 'disabled'}>
          ${affordable ? 'REDEEM POINTS' : 'INSUFFICIENT POINTS'}
        </button>
      </div>
    </div>
  `;
}
