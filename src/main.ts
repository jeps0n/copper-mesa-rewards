import './style.css';

const app = document.querySelector<HTMLDivElement>('#app');

if (!app) {
  throw new Error('Application root was not found.');
}

app.innerHTML = `
  <main class="welcome">
    <p class="eyebrow">Copper Mesa Casino & Resort</p>
    <h1>Mesa Rewards</h1>
    <p>Kiosk prototype coming soon.</p>
  </main>
`;
