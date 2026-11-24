# Smart Marketing Web

Next.js + TypeScript web dashboard for the Smart Marketing Platform.

## Local setup

Start the backend and infrastructure first, then run:

```powershell
Copy-Item .env.example .env
npm install
npm run dev
```

The web app runs on `http://localhost:3000` by default. If the backend also runs on port 3000, start the web app on another port:

```powershell
npm run dev -- -p 3001
```

Set the backend API URL in `.env`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
```

By default the app runs against its in-browser mock adapter
(`NEXT_PUBLIC_API_MODE=mock`), so the full product can be demoed
without the backend. Set `NEXT_PUBLIC_API_MODE=live` to talk to the
real API above.

## Current foundation

- Next.js App Router (Next.js 16, React 19).
- TypeScript.
- Tailwind CSS v4 (theme tokens in `src/app/globals.css`).
- Arabic RTL application shell.
- English-first localization with Arabic and Turkish support via `next-intl`.
- Shared responsive navbar with language switching and automatic RTL/LTR direction.
- Landing page.
- Login page connected to the backend login API.
- Shared API client with Bearer token support.
- Local access-token storage helper.

## Frontend integration (branch `frontend`)

The complete product frontend (Saeed's section: landing, auth,
workspace with dashboard / onboarding / brand / products / campaigns /
AI content studio / review / calendar / integrations / analytics /
reports / admin / notifications / settings, the guest → account →
full access ladder, and the Solid design with dark and light themes)
has been ported onto this foundation:

- All product strings live in the `next-intl` message tree
  (`src/i18n/messages.ts`, composed from `src/i18n/locales/*` and
  `src/i18n/page-copy.ts`). The product's components read them through
  a small bridge (`src/lib/i18n/context.tsx`) over this provider.
- API calls stay inside `src/lib` per the team workflow: the
  product's API modules call one transport (`src/lib/api/client.ts`)
  that delegates live HTTP to the shared client
  (`src/lib/api-client.ts`) and reads the bearer token from
  `src/lib/auth-storage.ts`. In live mode, `GET /account/profile`
  is aliased to the backend's `GET /users/me`.
- The foundation's placeholder dashboard shell (`app-shell`) was
  replaced by the real workspace shell; its navbar lives on as the
  landing page header (`src/components/site-navbar.tsx`), and its
  language switcher is the one switcher used across the app.
- Two foundation fixes came with the port:
  - `postcss.config.mjs` + `@tailwindcss/postcss` were added — under
    the Webpack production build, Tailwind v4 utilities were silently
    missing without them (the Turbopack dev loader masked this).
  - The i18n provider no longer writes the locale back to
    localStorage on mount: during hydration that overwrote the saved
    language with the server default (`en`) before it was ever read,
    so the chosen language never survived a refresh.

## Backend contract

The backend Swagger contract is available at `http://localhost:3000/docs` when the backend is running. The initial web integration uses:

```text
POST /api/v1/auth/login
GET  /api/v1/users/me
GET  /api/v1/products
```

The full frontend → backend contract (all endpoints the UI calls,
with request/response shapes and the business rules the mock adapter
encodes) is documented in the handoff notes shared with the backend
section.

## Verification

```powershell
npm run lint
npm run build
npm run typecheck
npm test
```

The production build uses Next.js Webpack mode for stable CSS builds in the team environment.

## Team workflow

Create a feature branch from `main`, keep API calls inside `src/lib`, and update loading/error states when adding a page. Do not connect the browser directly to PostgreSQL or social provider APIs.
