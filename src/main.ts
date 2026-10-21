import './style.css';

type Screen =
  | 'welcome'
  | 'menu'
  | 'gifts'
  | 'promotions'
  | 'points'
  | 'account';

type Tier = 'Bronze' | 'Silver' | 'Gold';

interface Member {
  name: string;
  tier: Tier;
  points: number;
  card: string;
}

const members: Member[] = [
  {
    name: 'Alex Rivera',
    tier: 'Bronze',
    points: 1500,
    card: '•••• 1042',
  },
  {
    name: 'Jordan Lee',
    tier: 'Silver',
    points: 3500,
    card: '•••• 2086',
  },
  {
    name: 'Morgan Blake',
    tier: 'Gold',
    points: 10000,
    card: '•••• 3091',
  },
];

const menuItems: Array<{
  screen: Exclude<Screen, 'welcome' | 'menu'>;
  title: string;
  description: string;
  icon: string;
}> = [
  {
    screen: 'gifts',
    title: 'Weekly Gifts',
    description: 'Discover this month’s member gifts',
    icon: '✦',
  },
  {
    screen: 'promotions',
    title: 'Promotions',
    description: 'Explore your monthly offers',
    icon: '★',
  },
  {
    screen: 'points',
    title: 'Rewards Points',
    description: 'View points and redemption options',
    icon: '◈',
  },
  {
    screen: 'account',
    title: 'My Account',
    description: 'Review your membership details',
    icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="7.5" r="3.5"/><path d="M5 20v-2a7 7 0 0 1 14 0v2"/></svg>',
  },
];

const app = document.querySelector<HTMLDivElement>('#app');

if (!app) {
  throw new Error('Application root was not found.');
}

function mountainLogo(): string {
  return `
    <svg class="mountain-logo" viewBox="0 0 100 76" aria-hidden="true">
      <path d="M9 65 33 12 54 46 72 25 92 65 Z" />
      <path d="M33 12 54 46 72 25" class="mountain-highlight" />
    </svg>
  `;
}

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

  if (screen === 'gifts') {
    content = `
      <p class="screen-intro">Four gifts. Four weekly opportunities.</p>
      <div class="content-grid four-up">
        ${['Week 1', 'Week 2', 'Week 3', 'Week 4'].map((week, index) => `
          <article class="offer-card">
            <span class="offer-number">0${index + 1}</span>
            <h3>${week}</h3>
            <p>Gift details are currently unavailable</p>
            <span class="status-label">NOT AVAILABLE</span>
          </article>
        `).join('')}
      </div>
    `;
  }

  if (screen === 'promotions') {
    const offers = {
      Bronze: [10, 15],
      Silver: [25, 30],
      Gold: [100, 75],
    }[member.tier];

    content = `
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

  if (screen === 'points') {
    content = `
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

  if (screen === 'account') {
    content = `
      <p class="screen-intro">Your membership at a glance.</p>
      <div class="account-panel">
        <div><span>Member name</span><strong>${member.name}</strong></div>
        <div><span>Membership tier</span><strong>${member.tier}</strong></div>
        <div><span>Member card</span><strong>${member.card}</strong></div>
        <div><span>Rewards points</span><strong>${member.points.toLocaleString('en-US')}</strong></div>
      </div>
    `;
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

function physicalPanel(): string {
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

function render(): void {
  if (!app) {
    return;
  }

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
        ${screenContent()}
        <footer class="kiosk-footer">
          <span>COPPER MESA REWARDS</span>
          ${member ? '<button class="finish-button" data-action="finish">FINISH SESSION</button>' : '<span>WELCOME</span>'}
        </footer>
      </section>
      <aside class="physical-panel" aria-label="Physical kiosk controls">
        ${physicalPanel()}
      </aside>
    </main>
  `;
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
