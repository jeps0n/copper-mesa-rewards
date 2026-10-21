# Copper Mesa Rewards

An interactive, fictional casino loyalty kiosk built with TypeScript and Vite.

## Features

- Three sample member cards with Bronze, Silver, and Gold tiers
- Touchscreen navigation for Weekly Gifts, Promotions, Rewards Points, and My Account
- Member-specific monthly offer amounts and point balances
- A physical card reader and receipt printer interface
- Weekly gift claims and tier-specific monthly promotions
- Points redemption into free slot play
- Printed gift and dining vouchers with receipt inspection

Member activity is stored in memory and resets when the page reloads.

## Local development

```bash
npm install
npm run dev
npm test
npm run build
npm run preview
```

## Deployment

Push to `main` to deploy through GitHub Actions. In repository Settings → Pages, set the source to **GitHub Actions**.
