import { members } from '../data/members';
import type { Member, Screen } from '../data/members';
import { mountainLogo } from './logo';

function physicalPanel(screen: Screen, member: Member | null): string {
  const memberSelection = screen === 'welcome'
    ? `
      <div class="reader-instruction">
        <h2>SWIPE CARD</h2>
        <p>Select a member card to begin</p>
      </div>
      <div class="member-cards">
        ${members.map((item, index) => `
          <button class="member-card ${item.tier.toLowerCase()}" data-member="${index}">
            <span>${item.tier}</span>
            <small>${item.name}</small>
          </button>
        `).join('')}
      </div>
    `
    : `
      <div class="session-status">
        <span>ACTIVE SESSION</span>
        <strong>${member?.tier ?? ''} Member</strong>
      </div>
    `;

  return `
    <div class="card-reader" aria-label="Card swipe reader">
      <div class="reader-head"><span class="reader-light"></span></div>
      <div class="reader-channel"></div>
    </div>
    ${memberSelection}
    <div class="receipt-hardware" aria-label="Receipt printer">
      <span class="receipt-label">RECEIPT</span>
      <div class="receipt-slot"></div>
    </div>
  `;
}

export function renderKiosk(
  app: HTMLDivElement,
  screen: Screen,
  member: Member | null,
  content: string,
): void {
  app.innerHTML = `
    <main class="kiosk-shell">
      <section class="touchscreen" aria-label="Kiosk touchscreen">
        <header class="kiosk-header">
          <div class="brand-lockup">
            <span class="brand-symbol">${mountainLogo()}</span>
            <span>COPPER MESA <small>CASINO & RESORT</small></span>
          </div>
          <div class="header-right">
            ${member ? `<span class="tier-tag">${member.tier.toUpperCase()} MEMBER</span>` : ''}
            <span class="header-label">REWARDS KIOSK</span>
          </div>
        </header>
        ${content}
        <footer class="kiosk-footer">
          <span>COPPER MESA REWARDS</span>
          ${member ? '<button class="finish-button" data-action="finish">FINISH SESSION</button>' : '<span>WELCOME</span>'}
        </footer>
      </section>
      <aside class="physical-panel" aria-label="Physical kiosk controls">
        ${physicalPanel(screen, member)}
      </aside>
    </main>
  `;
}

