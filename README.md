# Sentient — Official Website

Live site: [sentient-web-iota.vercel.app](https://sentient-web-iota.vercel.app)

The official web presence for **Sentient**: streaming links, a tour date list backed by a Google Sheet, and a mailing-list signup that writes straight into that same sheet and triggers a welcome email — no third-party mailing list provider required.

Built with [Astro](https://astro.build) (server output), React islands, and Tailwind CSS v4, deployed on Vercel.

## How it works

```text
┌───────────────┐     ┌─────────────────────┐     ┌───────────────────────┐
│  React forms  │ ──> │  Astro API routes   │ ──> │  Google Sheet + Apps  │
│ (client:load) │     │  (Vercel functions) │     │  Script (data + mail) │
└───────────────┘     └─────────────────────┘     └───────────────────────┘
```

- **Tour dates** — `TourWidget.jsx` renders a searchable/filterable list of shows. On each request, `/api/tour-dates` pulls rows live from a public Google Sheet (via [opensheet.elk.sh](https://opensheet.elk.sh)) and falls back to a small set of mock dates if the sheet is unreachable, so the page never breaks.
- **Newsletter signup** — `NewsletterForm.jsx` posts a name/email to `/api/subscribe`, an Astro server route that forwards the payload to a Google Apps Script Web App. The script appends the row to the sheet (guarded with `LockService` to avoid write collisions) and sends a welcome email, all without exposing the Apps Script URL to the browser or hitting CORS preflight issues.
- **Logo** — `Logo.astro` inlines the brand SVG at build time so it can be styled/colored like any other element instead of sitting behind an `<img>` tag.

## Project structure

```text
src/
├── components/
│   ├── Logo.astro          # Inlines and sanitizes the brand SVG
│   ├── NewsletterForm.jsx  # Name/email signup form (client-side)
│   └── TourWidget.jsx      # Searchable tour date list (client-side)
├── layouts/
│   └── Layout.astro        # Base HTML shell, fonts, global styles
├── pages/
│   ├── index.astro         # Home page — hero, signup, tour dates
│   └── api/
│       ├── subscribe.ts    # POST /api/subscribe -> Google Apps Script
│       └── tour-dates.ts   # GET /api/tour-dates -> Google Sheet (with fallback)
└── styles/
    └── global.css          # Tailwind v4 theme tokens (colors, fonts)
public/
└── favicon.svg / favicon.ico
```

## Getting started

Requires Node.js **22.12+**.

```bash
npm install
npm run dev
```

| Command            | Action                                  |
| ------------------ | --------------------------------------- |
| `npm run dev`      | Start the local dev server              |
| `npm run build`    | Build the production site to `./dist`   |
| `npm run preview`  | Preview the production build locally    |
| `npm run astro`    | Run the Astro CLI directly              |

## Environment variables

Create a `.env` file in the project root (already git-ignored):

```env
# Google Apps Script Web App execution URL that /api/subscribe forwards to
GOOGLE_APPS_SCRIPT_URL="https://script.google.com/macros/s/XXXXXXXX/exec"
```

The tour-dates endpoint currently points at a fixed public Google Sheet URL in `src/pages/api/tour-dates.ts`; update the `SHEET_JSON_URL` constant there to point at your own sheet.

## Deployment (Vercel)

1. **Google Apps Script**: open the tracking spreadsheet → **Extensions > Apps Script**, deploy it as a Web App (**Deploy > Manage Deployments**, access set to "Anyone"), and copy the resulting URL.
2. **Vercel**: in the project's **Settings > Environment Variables**, add `GOOGLE_APPS_SCRIPT_URL` with that value, then redeploy. The site uses the `@astrojs/vercel` adapter with `output: 'server'`, so `/api/*` routes run as Vercel serverless functions.

## Email deliverability

Because welcome emails are sent from Apps Script rather than a dedicated email provider, make sure the sending domain has correct SPF, DKIM, and DMARC records configured (via Google Workspace admin) — otherwise messages are likely to be flagged as spam by Gmail/Yahoo.

## Tech stack

- [Astro](https://astro.build) 7 (server-rendered)
- [React](https://react.dev) 19 (interactive islands only)
- [Tailwind CSS](https://tailwindcss.com) 4
- [Vercel](https://vercel.com) hosting + serverless functions
- Google Sheets + Apps Script as a free CRM/mailer backend
