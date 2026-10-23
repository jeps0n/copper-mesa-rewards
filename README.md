# Copper Mesa Rewards

**Copper Mesa Rewards** is an interactive casino loyalty kiosk built with **TypeScript** and **Vite** for the fictional **Copper Mesa Casino & Resort**. It simulates a self-service membership experience featuring touchscreen navigation, tier-based benefits, time-sensitive rewards, and virtual kiosk hardware—all within a standalone frontend application.

**[▶ LIVE DEMO](https://jeps0n.github.io/copper-mesa-rewards/)** · **[View Source](https://github.com/jeps0n/copper-mesa-rewards)**

## The Kiosk Experience

Visitors start by selecting one of three demonstration memberships: **Bronze**, **Silver**, or **Gold**. Each opens the same touchscreen experience with tier-specific benefits and account information.

| Menu | What it demonstrates |
| --- | --- |
| **Weekly Gifts** | Scheduled gift windows, claim validation, and historical claimed/expired states |
| **Monthly Promotions** | Tier-specific slot-play and dining offers with one claim per offer per month |
| **Rewards Points** | Points balances and simulated conversion into free slot play |
| **My Account** | Member details and account information |

A simulated card reader supports the kiosk presentation, while receipt and voucher interactions provide visible feedback for supported transactions.

## Time-Based Rewards and Session Behavior

Weekly gifts and monthly promotions both follow calendar-based availability rules, but use different cycles.

**Weekly Gifts** displays the month's scheduled gifts and evaluates each claim against its opening and closing time. Gifts that have already closed when the app starts receive simulated historical `CLAIMED` or `EXPIRED` results for each member. An active gift can be claimed once; successful claims remain marked `CLAIMED` after its window closes. A scheduled timer updates the displayed status when a gift boundary passes, without requiring a page refresh.

**Monthly Promotions** presents a member's slot-play and dining offers for the current calendar month. Claims are tracked using month-specific identifiers, allowing a new month's offers to be treated separately from the previous month's. The application also schedules a screen update at the monthly boundary so the displayed offers reflect the new period.

These behaviors share an **in-memory session model**. Moving between menu screens preserves the member's claims, balances, and related activity. Refreshing the browser starts a new demonstration session, including newly simulated historical gift results.

## Interaction and Validation

Claim actions are validated when clicked, using the current timestamp rather than relying solely on the button's last displayed state. The application checks the relevant availability window and existing claims before accepting a redemption. Successful claims update session state and produce the appropriate on-screen confirmation or receipt; duplicate claims are rejected.

The card reader, printer, vouchers, and account activity are browser-based simulations. No physical hardware, payments, personal customer records, or backend services are involved.

## Technology

- **TypeScript** — application logic, validation, and session state
- **Vite** — local development and production builds
- **HTML and CSS** — kiosk interface, layout, and presentation
- **GitHub Actions** — deployment to GitHub Pages

## Run Locally

```bash
npm install
npm run dev
```

To build and preview the production output:

```bash
npm run build
npm run preview
```


