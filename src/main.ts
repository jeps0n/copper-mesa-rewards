import './style.css';

import { members } from './data/members';
import type { Member, Screen } from './data/members';
import { menuItems } from './data/menu';
import {
  millisecondsUntilGiftBoundary,
  monthlyGiftPeriods,
} from './data/giftSchedule';
import { renderWeeklyGifts } from './features/weeklyGifts';
import { validateClaim } from './features/claimValidation';
import { renderPromotions } from './features/promotions';
import { renderRewardsPoints } from './features/rewardsPoints';
import { renderMyAccount } from './features/myAccount';
import { renderKiosk } from './ui/kiosk';
import type { PrintedReceipt } from './ui/kiosk';
import { mountainLogo } from './ui/logo';
import {
  promotions,
  dollarsPerRedemption,
  pointsPerRedemption,
} from './data/rewards';
import {
  memberStates,
  monthKey,
} from './data/session';
import type { MemberState } from './data/session';

const root = document.querySelector<HTMLDivElement>('#app');

if (!root) {
  throw new Error('Application root was not found.');
}

const app: HTMLDivElement = root;

let screen: Screen = 'welcome';
let member: Member | null = null;
let memberIndex: number | null = null;
let message = '';
let notificationIsReplacement = false;
let previousNotification = '';
let notificationTimer: ReturnType<typeof setTimeout> | null = null;
let notificationSequence = 0;
let receipt: PrintedReceipt | null = null;
let inspectedReceipt: PrintedReceipt | null = null;
let focusBeforeReceiptModal: HTMLElement | null = null;
let receiptAssistanceTimer: ReturnType<typeof setTimeout> | null = null;
let receiptNeedsAssistance = false;
let giftBoundaryTimer: ReturnType<typeof setTimeout> | null = null;
let monthBoundaryTimer: ReturnType<typeof setTimeout> | null = null;
let casinoClockTimer: ReturnType<typeof setInterval> | null = null;
let previousClockOffset = Date.now() - performance.now();

const clockJumpThresholdMs = 2000;

const desktopLayout = window.matchMedia('(min-width: 1051px)');
let contentResizeFrame: number | null = null;

function fitMonitorContent(): void {
  const touchscreen = app.querySelector<HTMLElement>('.touchscreen');
  const content = touchscreen?.querySelector<HTMLElement>(
    '.screen-body, .welcome-screen',
  );

  if (!touchscreen || !content) {
    return;
  }

  content.style.zoom = '';

  if (!desktopLayout.matches) {
    return;
  }

  const header = touchscreen.querySelector<HTMLElement>('.kiosk-header');
  const footer = touchscreen.querySelector<HTMLElement>('.kiosk-footer');

  if (!header || !footer) {
    return;
  }

  const availableHeight =
    touchscreen.clientHeight - header.offsetHeight - footer.offsetHeight;
  const requiredHeight = content.scrollHeight;

  if (availableHeight > 0 && requiredHeight > availableHeight) {
    content.style.zoom = String(availableHeight / requiredHeight);
  }
}

function scheduleMonitorFit(): void {
  if (contentResizeFrame !== null) {
    cancelAnimationFrame(contentResizeFrame);
  }

  contentResizeFrame = requestAnimationFrame(() => {
    contentResizeFrame = null;
    fitMonitorContent();
  });
}

function handleLayoutChange(event: MediaQueryListEvent): void {
  if (event.matches) {
    window.scrollTo(0, 0);
  }

  scheduleMonitorFit();
}

desktopLayout.addEventListener('change', handleLayoutChange);
window.addEventListener('resize', scheduleMonitorFit);

function scheduleGiftBoundaryUpdate(): void {
  if (giftBoundaryTimer !== null) {
    clearTimeout(giftBoundaryTimer);
    giftBoundaryTimer = null;
  }

  const delay = millisecondsUntilGiftBoundary();

  if (delay === null) {
    return;
  }

  giftBoundaryTimer = setTimeout(() => {
    giftBoundaryTimer = null;

    if (screen === 'gifts' && !receipt && !inspectedReceipt) {
      render();
    } else {
      scheduleGiftBoundaryUpdate();
    }
  }, delay + 20);
}

function millisecondsUntilNextMonth(now = new Date()): number {
  const currentMonth = monthKey(now);

  let start = now.getTime();
  let end = start + 32 * 24 * 60 * 60 * 1000;

  while (end - start > 1) {
    const midpoint = Math.floor((start + end) / 2);

    if (monthKey(new Date(midpoint)) === currentMonth) {
      start = midpoint;
    } else {
      end = midpoint;
    }
  }

  return end - now.getTime();
}

function scheduleMonthBoundaryUpdate(): void {
  if (monthBoundaryTimer !== null) {
    clearTimeout(monthBoundaryTimer);
  }

  const displayedMonth = monthKey();
  const delay = Math.min(
    millisecondsUntilNextMonth() + 20,
    24 * 60 * 60 * 1000,
  );

  monthBoundaryTimer = setTimeout(() => {
    monthBoundaryTimer = null;

    if (
      monthKey() !== displayedMonth
      && (screen === 'promotions' || screen === 'gifts')
      && !receipt
      && !inspectedReceipt
    ) {
      render();
    } else {
      scheduleMonthBoundaryUpdate();
    }
  }, delay);
}

function clearReceiptAssistance(): void {
  if (receiptAssistanceTimer !== null) {
    clearTimeout(receiptAssistanceTimer);
    receiptAssistanceTimer = null;
  }

  receiptNeedsAssistance = false;
}

function beginReceiptCollection(): void {
  clearReceiptAssistance();

  receiptAssistanceTimer = setTimeout(() => {
    receiptAssistanceTimer = null;

    if (!receipt) {
      return;
    }

    receiptNeedsAssistance = true;
    app.querySelector('.receipt-hardware')?.classList.add('needs-assistance');
  }, 10000);
}

function clearNotification(): void {
  notificationSequence += 1;

  if (notificationTimer !== null) {
    clearTimeout(notificationTimer);
    notificationTimer = null;
  }

  message = '';
  previousNotification = '';
  notificationIsReplacement = false;
}

function showNotification(text: string): void {
  notificationIsReplacement = message !== '';
  previousNotification = message;
  message = text;

  if (notificationTimer !== null) {
    clearTimeout(notificationTimer);
  }

  const sequence = ++notificationSequence;

  notificationTimer = setTimeout(() => {
    if (sequence !== notificationSequence) {
      return;
    }

    notificationTimer = null;

    const notification = app.querySelector<HTMLElement>('.result-message');

    if (!notification) {
      message = '';
      return;
    }

    notification.classList.add('is-leaving');

    setTimeout(() => {
      if (sequence !== notificationSequence) {
        return;
      }

      message = '';
      notification.remove();
    }, 250);
  }, 6000);
}

function activeState(): MemberState | null {
  return memberIndex === null ? null : memberStates[memberIndex] ?? null;
}

function screenContent(): string {
  if (screen === 'welcome') {
    return `
      <section class="welcome-screen">
        <p class="overline">COPPER MESA CASINO & RESORT</p>
        <div class="mesa-mark">${mountainLogo()}</div>
        <h1>Copper Mesa <span>Rewards</span></h1>
        <p class="welcome-copy">Your stay. Your rewards.</p>
        <div class="welcome-divider"></div>
        <p class="welcome-instruction">Insert or tap your member card to begin</p>
      </section>
    `;
  }

  if (!member || !activeState()) {
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

  const title = menuItems.find((item) => item.screen === screen)?.title;
  const casinoDate = new Date();
  let headingDate = casinoDate;
  let headingTimeZone = 'America/Los_Angeles';

  if (screen === 'gifts') {
    const firstGift = monthlyGiftPeriods(casinoDate).periods[0];

    if (firstGift) {
      const [giftYear, giftMonth] = firstGift.key.split('-').map(Number);

      headingDate = new Date(Date.UTC(giftYear, giftMonth - 1, 1));
      headingTimeZone = 'UTC';
    }
  }

  const monthName = new Intl.DateTimeFormat('en-US', {
    timeZone: headingTimeZone,
    month: 'long',
  }).format(headingDate).toUpperCase();
  const year = new Intl.DateTimeFormat('en-US', {
    timeZone: headingTimeZone,
    year: 'numeric',
  }).format(headingDate);

  const heading = screen === 'gifts' || screen === 'promotions'
    ? `${title} — <span class="heading-month">${monthName}</span> ${year}`
    : title;

  let content = '';
  const state = activeState()!;

  switch (screen) {
    case 'gifts':
      content = renderWeeklyGifts(state);
      break;
    case 'promotions':
      content = renderPromotions(member, state);
      break;
    case 'points':
      content = renderRewardsPoints(state);
      break;
    case 'account':
      content = renderMyAccount(member, state);
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

function startCasinoClock(): void {
  if (casinoClockTimer !== null) {
    clearInterval(casinoClockTimer);
  }

  function updateClock(): void {
    const clockOffset = Date.now() - performance.now();
    const clockJumped = Math.abs(
      clockOffset - previousClockOffset,
    ) > clockJumpThresholdMs;

    previousClockOffset = clockOffset;

    if (clockJumped) {
      synchronizeAfterClockChange();
    }

    const clock = app.querySelector<HTMLElement>('.casino-clock');

    if (!clock) {
      return;
    }

    clock.textContent = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/Los_Angeles',
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    }).format(new Date());
  }

  updateClock();
  casinoClockTimer = setInterval(updateClock, 1000);
}

function render(): void {
  renderKiosk(
    app,
    screen,
    member,
    screenContent(),
    message,
    notificationIsReplacement,
    previousNotification,
    receipt,
    inspectedReceipt,
    receiptNeedsAssistance,
  );

  scheduleGiftBoundaryUpdate();
  scheduleMonthBoundaryUpdate();
  scheduleMonitorFit();
  startCasinoClock();
}

app.addEventListener('click', (event) => {
  const target = event.target;

  if (!(target instanceof Element)) {
    return;
  }

  const redemptionButton = target.closest<HTMLButtonElement>('[data-redeem]');
  const dismissButton = target.closest<HTMLButtonElement>('[data-action="dismiss"]');
  const takeReceiptButton = target.closest<HTMLButtonElement>('[data-action="take-receipt"]');
  const closeReceiptButton = target.closest<HTMLButtonElement>('[data-action="close-receipt"]');
  const memberButton = target.closest<HTMLButtonElement>('[data-member]');
  const screenButton = target.closest<HTMLButtonElement>('[data-screen]');
  const finishButton = target.closest<HTMLButtonElement>('[data-action="finish"]');

  if (inspectedReceipt && !closeReceiptButton) {
    return;
  }

  if (receipt && !takeReceiptButton && !dismissButton) {
    return;
  }

  if (closeReceiptButton) {
    inspectedReceipt = null;
  } else if (memberButton) {
    const index = Number(memberButton.dataset.member);
    memberIndex = Number.isInteger(index) && members[index] ? index : null;
    member = memberIndex === null ? null : members[memberIndex];
    clearNotification();
    receipt = null;
    clearReceiptAssistance();
    screen = member ? 'menu' : 'welcome';
  } else if (redemptionButton && member && activeState()) {
    const state = activeState()!;
    const kind = redemptionButton.dataset.redeem;
    const promotion = promotions[member.tier];

    if (kind === 'gift' || kind === 'slot' || kind === 'dining') {
      const clickedAt = new Date();
      const claim = validateClaim(redemptionButton, state, clickedAt);

      if (!claim) {
        render();
        return;
      }

      if (claim.kind === 'gift') {
        state.claimedWeeks.add(claim.key);
        receipt = {
          kind: 'gift',
          title: 'WEEKLY GIFT',
          description: `WEEK ${claim.weekIndex + 1} GIFT`,
          pickupDate: claim.pickupDate,
          issuedAt: clickedAt.toISOString(),
        };
        beginReceiptCollection();
        showNotification('Gift claimed! Please take your receipt.');
      } else {
        state.claimedPromotions.add(claim.key);

        if (claim.kind === 'slot') {
          state.cardCredit += promotion.slot;
          showNotification(`$${promotion.slot} Free Slot Play is on your card, ready to use.`);
        } else {
          receipt = {
            kind: 'dining',
            title: 'DINING VOUCHER',
            description: `$${promotion.dining} Dining Credit`,
            issuedAt: clickedAt.toISOString(),
          };
          beginReceiptCollection();
          showNotification('Dining credit claimed! Please take your voucher.');
        }
      }
    } else if (kind === 'points') {
      if (state.points < pointsPerRedemption) {
        return;
      }

      state.points -= pointsPerRedemption;
      state.cardCredit += dollarsPerRedemption;
      showNotification(`$${dollarsPerRedemption} Free Slot Play is on your card, ready to use.`);
    } else {
      return;
    }
  } else if (takeReceiptButton && receipt) {
    focusBeforeReceiptModal = takeReceiptButton;
    inspectedReceipt = receipt;
    receipt = null;
    clearReceiptAssistance();
    clearNotification();
  } else if (dismissButton) {
    clearNotification();
  } else if (screenButton && member) {
    clearNotification();
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
    const state = activeState();

    if (state) {
      state.cardCredit = 0;
    }

    member = null;
    memberIndex = null;
    clearNotification();
    receipt = null;
    clearReceiptAssistance();
    screen = 'welcome';
  } else {
    return;
  }

  render();

  if (closeReceiptButton) {
    const focusTarget = focusBeforeReceiptModal;
    focusBeforeReceiptModal = null;

    if (focusTarget?.isConnected && !focusTarget.hasAttribute('disabled')) {
      focusTarget.focus();
    } else {
      app.querySelector<HTMLButtonElement>('.back-button:not(:disabled), .finish-button:not(:disabled), .menu-tile:not(:disabled)')?.focus();
    }
  }
});

function synchronizeAfterClockChange(): void {
  if (
    (screen === 'gifts' || screen === 'promotions')
    && !receipt
    && !inspectedReceipt
  ) {
    render();
    return;
  }

  scheduleGiftBoundaryUpdate();
  scheduleMonthBoundaryUpdate();
}

window.addEventListener('focus', synchronizeAfterClockChange);

document.addEventListener('visibilitychange', () => {
  if (!document.hidden) {
    synchronizeAfterClockChange();
  }
});

app.addEventListener('keydown', (event) => {
  if (!inspectedReceipt || event.key !== 'Tab') {
    return;
  }

  const doneButton = app.querySelector<HTMLButtonElement>('[data-action="close-receipt"]');

  if (doneButton) {
    event.preventDefault();
    doneButton.focus();
  }
});

render();
