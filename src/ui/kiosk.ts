import { members } from '../data/members';
import type { Member, Screen } from '../data/members';
import { mountainLogo } from './logo';
import { receiptModalMarkup } from './receipt';

export interface PrintedReceipt {
  kind: 'gift' | 'dining';
  title: string;
  description: string;
  issuedAt: string;
  pickupDate?: string;
}

function memberControls(screen: Screen, member: Member | null): string {
  return screen === 'welcome'
    ? `
      <div class="reader-instruction">
        <h2>INSERT OR TAP CARD</h2>
        <p>Select a member card to begin</p>
      </div>
      <div class="member-cards">
        ${members.map((item, index) => `
          <button class="member-card ${item.tier.toLowerCase()}" data-member="${index}">
            <span class="member-card-emblem" aria-hidden="true">
              ${mountainLogo()}
            </span>
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
}

function physicalPanel(screen: Screen, member: Member | null): string {
  return `
    <div class="card-reader" aria-label="Card insertion and contactless reader">
      <div class="reader-head"><span class="reader-light"></span></div>
      <div class="reader-channel"></div>
    </div>
    <div class="member-controls">${memberControls(screen, member)}</div>
    <div class="receipt-hardware" aria-label="Receipt printer">
      <span class="receipt-label">RECEIPT</span>
      <div class="receipt-slot"></div>
    </div>
  `;
}

function receiptMarkup(): string {
  return `
    <div class="printed-receipt">
      <div class="receipt-tab-barcode" aria-hidden="true"></div>
      <button data-action="take-receipt" aria-label="Take printed receipt">
        TAKE RECEIPT
      </button>
    </div>
  `;
}

let displayedReceipt: PrintedReceipt | null = null;

export function renderKiosk(
  app: HTMLDivElement,
  screen: Screen,
  member: Member | null,
  content: string,
  notification: string,
  notificationIsReplacement: boolean,
  previousNotification: string,
  receipt: PrintedReceipt | null = null,
  inspectedReceipt: PrintedReceipt | null = null,
  receiptNeedsAssistance = false,
): void {
  const touchscreen = `
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
    ${notification ? `
      <div
        class="result-message${notificationIsReplacement ? ' is-refresh' : ''}${notificationIsReplacement && previousNotification !== notification ? ' is-changing' : ''}"
        role="status"
      >
        <span class="notification-copy">
          ${notificationIsReplacement && previousNotification !== notification
            ? `<span class="notification-previous" aria-hidden="true">${previousNotification}</span>`
            : ''}
          <span class="notification-current">${notification}</span>
        </span>
        <button data-action="dismiss" aria-label="Dismiss notification">×</button>
      </div>
    ` : ''}
    <footer class="kiosk-footer">
      <span>COPPER MESA REWARDS</span>
      ${member
        ? `<div class="session-footer-controls">
            <time class="casino-clock" aria-label="Casino local date and time"></time>
            <button class="finish-button" data-action="finish">FINISH SESSION</button>
          </div>`
        : '<span>WELCOME</span>'}
    </footer>
  `;

  let screenElement = app.querySelector<HTMLElement>('.touchscreen');

  if (!screenElement) {
    app.innerHTML = `
      <main class="kiosk-shell">
        <section class="touchscreen" aria-label="Kiosk touchscreen"></section>
        <aside class="physical-panel" aria-label="Physical kiosk controls">
          ${physicalPanel(screen, member)}
        </aside>
      </main>
    `;

    screenElement = app.querySelector<HTMLElement>('.touchscreen');
  }

  if (!screenElement) {
    throw new Error('Kiosk touchscreen was not found.');
  }

  screenElement.innerHTML = touchscreen;

  const controls = app.querySelector<HTMLElement>('.member-controls');

  if (controls) {
    controls.innerHTML = memberControls(screen, member);
  }

  const printer = app.querySelector<HTMLElement>('.receipt-hardware');

  printer?.classList.toggle('needs-assistance', Boolean(receipt && receiptNeedsAssistance));

  if (printer && receipt !== displayedReceipt) {
    printer.querySelector('.printed-receipt')?.remove();

    if (receipt) {
      printer.insertAdjacentHTML('beforeend', receiptMarkup());
    }

    displayedReceipt = receipt;
  }

  const existingModal = app.querySelector('.receipt-modal-backdrop');

  screenElement.inert = Boolean(inspectedReceipt);
  const physicalControls = app.querySelector<HTMLElement>('.physical-panel');

  if (physicalControls) {
    physicalControls.inert = Boolean(inspectedReceipt);
  }

  if (inspectedReceipt && !existingModal) {
    app.insertAdjacentHTML(
      'beforeend',
      receiptModalMarkup(inspectedReceipt, member),
    );

    app.querySelector<HTMLButtonElement>('[data-action="close-receipt"]')?.focus();
  } else if (!inspectedReceipt && existingModal) {
    existingModal.remove();
  }

  if (receipt) {
    app.querySelectorAll<HTMLButtonElement>('button').forEach((button) => {
      button.disabled = button.dataset.action !== 'take-receipt'
        && button.dataset.action !== 'dismiss';
    });
  }
}
