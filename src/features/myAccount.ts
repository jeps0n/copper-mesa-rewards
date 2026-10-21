import type { Member } from '../data/members';

export function renderMyAccount(member: Member): string {
  return `
      <p class="screen-intro">Your membership at a glance.</p>
      <div class="account-panel">
        <div><span>Member name</span><strong>${member.name}</strong></div>
        <div><span>Membership tier</span><strong>${member.tier}</strong></div>
        <div><span>Member card</span><strong>${member.card}</strong></div>
        <div><span>Rewards points</span><strong>${member.points.toLocaleString('en-US')}</strong></div>
      </div>
    `;
}
