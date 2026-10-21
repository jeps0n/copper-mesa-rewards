import type { Member } from '../data/members';
import type { PrintedReceipt } from './kiosk';

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    };

    return entities[character];
  });
}

export function receiptModalMarkup(
  receipt: PrintedReceipt,
  member: Member | null,
): string {
  const redemptionLocation = receipt.kind === 'dining'
    ? 'at a participating dining venue.'
    : 'at the rewards counter.';

  const issuedAt = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Los_Angeles',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(receipt.issuedAt));

  return `
    <div class="receipt-modal-backdrop">
      <section
        class="receipt-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="receipt-modal-title"
      >
        <p class="receipt-modal-heading">YOUR REDEMPTION VOUCHER</p>
        <div class="receipt-paper">
          <div class="receipt-paper-brand">COPPER MESA</div>
          <div class="receipt-paper-subtitle">CASINO & RESORT</div>
          <div class="receipt-paper-divider"></div>
          <p class="receipt-paper-type">${escapeHtml(receipt.title)}</p>
          <h2 id="receipt-modal-title">${escapeHtml(receipt.description)}</h2>
          <dl class="receipt-paper-details">
            <div><dt>MEMBER</dt><dd>${escapeHtml(member?.name ?? 'Guest')}</dd></div>
            <div><dt>ISSUED</dt><dd>${escapeHtml(issuedAt)} PT</dd></div>
          </dl>
          <div class="receipt-paper-divider"></div>
          <p class="receipt-paper-instructions">Present this voucher<br>${redemptionLocation}</p>
          ${receipt.kind === 'gift' && receipt.pickupDate
            ? `<p class="receipt-paper-pickup">PICKUP: ${escapeHtml(receipt.pickupDate.toUpperCase())} · 11 AM – 7 PM</p>`
            : ''}
          <div class="receipt-paper-bars" aria-hidden="true"></div>
          <p class="receipt-paper-footer">THANK YOU FOR BEING A MEMBER</p>
        </div>
        <button class="receipt-modal-done" data-action="close-receipt">DONE</button>
      </section>
    </div>
  `;
}
