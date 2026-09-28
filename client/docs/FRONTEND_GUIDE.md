# Frontend guide

The frontend is a Next.js App Router application written in JavaScript/JSX. Styling uses Tailwind CSS v4 utilities. There are no Next.js API route handlers: `next.config.js` forwards `/api/:path*` and `/launch` to the Express backend.

## Typography

`src/app/layout.jsx` loads the local variable fonts using `next/font/local`:

- `src/assets/fonts/Roboto-Latin-Variable.woff2` → `--font-roboto`.
- `src/assets/fonts/Inter-Latin-Variable.woff2` → `--font-inter`.

`src/app/globals.css` defines Tailwind `font-heading` and `font-body`. The base layer applies Roboto to `h1`–`h6` and Inter to paragraphs/body. Font licenses are included alongside this guide. The UI is English; the included font files cover Latin text. Add licensed script subsets if translating the product to another script.

## Feature organization

`SurgicalSafetyDashboard.jsx` composes the screen. `useSurgicalSafetyWorkflow.js` owns session, evidence, confirmations, notes, saving and expiry state. Display components receive data and callbacks through props; they never evaluate medical criteria or access MongoDB.

`apiClient.js` calls relative `/api/...` URLs with same-origin cookies. The opaque session cookie is HttpOnly. The CSRF token exists only in component memory. Access tokens and client secrets are never returned to this UI. No patient information is stored in localStorage/sessionStorage.

`EvidenceDialog.jsx` uses the native accessible dialog element. Navigation supports narrow screens, field labels and keyboard focus. Tables scroll inside their card on mobile. Refreshing evidence clears the human confirmations; editing a review clears the current export selection.

## Configuration

Copy `client/.env.example` to `client/.env.local` if defaults need changing. The default backend is `http://127.0.0.1:5000`. The root launcher reads `CLIENT_PORT`; for direct Next startup pass `--port` explicitly if changing the default. Rebuild after changing backend routing or EHR framing origins.

Server credentials belong only in `server/.env`. Never add them to `NEXT_PUBLIC_` values.

## Primary framework references

- [Next.js rewrites](https://nextjs.org/docs/app/api-reference/config/next-config-js/rewrites)
- [Next.js local fonts](https://nextjs.org/docs/app/api-reference/components/font)
- [Tailwind CSS with Next.js](https://tailwindcss.com/docs/installation/framework-guides/nextjs)
- [Express 5 API](https://expressjs.com/en/5x/api.html)
- [Mongoose connections](https://mongoosejs.com/docs/connections.html)
