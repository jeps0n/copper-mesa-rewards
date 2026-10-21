export function renderWeeklyGifts(): string {
  return `
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
