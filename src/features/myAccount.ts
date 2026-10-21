import type { Member } from '../data/members';
import type { MemberState } from '../data/session';

export function renderMyAccount(member: Member, state: MemberState): string {
  return `
    <p class="screen-intro">Your membership at a glance.</p>
    <div class="account-panel">
      <div><span>Member name</span><strong>${member.name}</strong></div>
      <div><span>Membership tier</span><strong>${member.tier}</strong></div>
      <div><span>Member card</span><strong>${member.card}</strong></div>
      <div><span>Rewards points</span><strong>${state.points.toLocaleString('en-US')}</strong></div>
      <div><span>Free play loaded this session</span><strong>$${state.cardCredit}</strong></div>
    </div>
  `;
}
