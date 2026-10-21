import './style.css';

import { members } from './data/members';
import type { Member, Screen } from './data/members';
import { menuItems } from './data/menu';
import { renderWeeklyGifts } from './features/weeklyGifts';
import { renderPromotions } from './features/promotions';
import { renderRewardsPoints } from './features/rewardsPoints';
import { renderMyAccount } from './features/myAccount';
import { renderKiosk } from './ui/kiosk';
import { mountainLogo } from './ui/logo';

const root = document.querySelector<HTMLDivElement>('#app');

if (!root) {
  throw new Error('Application root was not found.');
}

const app: HTMLDivElement = root;

let screen: Screen = 'welcome';
let member: Member | null = null;

function screenContent(): string {
  if (screen === 'welcome') {
    return `
      <section class="welcome-screen">
        <p class="overline">COPPER MESA CASINO & RESORT</p>
        <div class="mesa-mark">${mountainLogo()}</div>
        <h1>Copper Mesa <span>Rewards</span></h1>
        <p class="welcome-copy">Your stay. Your rewards.</p>
        <div class="welcome-divider"></div>
        <p class="welcome-instruction">Swipe your member card to begin</p>
      </section>
    `;
  }

  if (!member) {
    return '';
  }

  if (screen === 'menu') {
    return `
      <section class="screen-body">
        <div class="section-heading">
          <p class="overline">MEMBER DASHBOARD</p>
          <h2>Welcome, ${member.name.split(' ')[0]}</h2>
          <p>What would you like to explore today?</p>
        </div>
        <div class="menu-grid">
          ${menuItems.map((item) => `
            <button class="menu-tile" data-screen="${item.screen}">
              <span class="tile-icon" aria-hidden="true">${item.icon}</span>
              <span class="tile-title">${item.title}</span>
              <span class="tile-description">${item.description}</span>
              <span class="tile-arrow" aria-hidden="true">→</span>
            </button>
          `).join('')}
        </div>
      </section>
    `;
  }

  const heading = menuItems.find((item) => item.screen === screen)?.title;

  let content = '';

  switch (screen) {
    case 'gifts':
      content = renderWeeklyGifts();
      break;
    case 'promotions':
      content = renderPromotions(member);
      break;
    case 'points':
      content = renderRewardsPoints(member);
      break;
    case 'account':
      content = renderMyAccount(member);
      break;
  }

  return `
    <section class="screen-body detail-screen">
      <button class="back-button" data-screen="menu">← Back to menu</button>
      <div class="section-heading">
        <p class="overline">COPPER MESA REWARDS</p>
        <h2>${heading}</h2>
      </div>
      ${content}
    </section>
  `;
}

function render(): void {
  renderKiosk(app, screen, member, screenContent());
}

app.addEventListener('click', (event) => {
  const target = event.target;

  if (!(target instanceof Element)) {
    return;
  }

  const memberButton = target.closest<HTMLButtonElement>('[data-member]');
  const screenButton = target.closest<HTMLButtonElement>('[data-screen]');
  const finishButton = target.closest<HTMLButtonElement>('[data-action="finish"]');

  if (memberButton) {
    const index = Number(memberButton.dataset.member);
    member = Number.isInteger(index) ? members[index] ?? null : null;
    screen = member ? 'menu' : 'welcome';
  } else if (screenButton && member) {
    const destination = screenButton.dataset.screen;
    const allowedScreens: Screen[] = [
      'menu',
      'gifts',
      'promotions',
      'points',
      'account',
    ];

    if (!destination || !allowedScreens.includes(destination as Screen)) {
      return;
    }

    screen = destination as Screen;
  } else if (finishButton) {
    member = null;
    screen = 'welcome';
  } else {
    return;
  }

  render();
});

render();
