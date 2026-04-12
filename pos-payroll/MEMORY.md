# Project Memory

Context log for AI assistants and contributors — covers what was built, decisions made, and known issues resolved during setup.

---

## What was built

Full Turborepo monorepo scaffolded from scratch for a California employee payroll cross-platform app. Web UI is fully designed and functional.

## Stack

| Layer | Technology |
|---|---|
| Monorepo | Turborepo + pnpm workspaces |
| Web | Next.js 15 (App Router) |
| Mobile | React Native + Expo SDK 51 |
| Shared UI | Tamagui (runtime only, no build-time plugin) |
| State | Zustand + React Query |
| Auth | NextAuth v4 + Google OAuth |
| Database | MongoDB via Mongoose |
| File storage | AWS S3 |
| Push notifications | Expo Notifications + APNs/FCM |

## Web UI

Pages designed with plain CSS (inline styles + `globals.css`), no extra UI framework:

| Page | What's there |
|---|---|
| `/sign-in` | Centered card, gradient background, Google OAuth button with SVG logo |
| `/dashboard` | 4 stat cards + recent activity feed with status badges |
| `/employees` | Search bar, avatar table, type/status pill badges, Edit button |
| `/payroll` | Pay periods table, gross/net pay, Draft/Approved/Paid badges |

**Layout:** 220px sidebar (`Sidebar.tsx`) with active-link highlight + top header (`Header.tsx`) with initials avatar and sign-out button. Both in `apps/web/src/components/`.

## Monorepo structure

```
apps/web/
  src/app/
    (auth)/sign-in/      Google sign-in page
    (app)/               Authenticated layout (sidebar + header)
      dashboard/         Stat cards + activity feed
      employees/         Employee table
      payroll/           Pay periods table
    api/                 REST route handlers
    globals.css          CSS variables + reset
  src/components/        Sidebar.tsx, Header.tsx
  src/lib/auth.ts        NextAuth authOptions (extracted from route handler)
  .env.local             Web-specific env vars (NOT the monorepo root)
apps/mobile/             Expo SDK 51 app (tabs: dashboard, employees, payroll)
packages/api/            Mongoose models, DB/S3/notifications helpers, Axios client
packages/ui/             Tamagui Button, Text, Card components
packages/types/          Shared TS types
packages/config/         Shared ESLint + TypeScript configs
```

---

## Setup decisions & fixes

### 1. Next.js upgraded 14 → 15
14.2.3 was flagged as outdated at install time. Upgraded to 15.x.

### 2. Tamagui `withTamagui` plugin removed
`next.config.js` originally used `withTamagui({ config, components })`. Caused:
- `Could not resolve "tamagui"` during webpack bundling
- `Must provide components` loader error

**Fix:** Removed plugin. Tamagui runs runtime-only. `TamaguiProvider` in `providers.tsx` uses `disableRootThemeClass` and `disableInjectCSS`.

### 3. `@repo/config` exports map
Must explicitly list each tsconfig file in `packages/config/package.json`:
```json
"./typescript/nextjs.json": "./typescript/nextjs.json",
"./typescript/react-native.json": "./typescript/react-native.json"
```
Without this, Next.js 15 throws `TS6053: File '@repo/config/typescript/nextjs.json' not found`.

### 4. `@repo/api` import paths
Exports map: `./lib/*` → `./src/lib/*.ts`, `./models/*` → `./src/models/*.ts`.
All imports in `apps/web` must use `@repo/api/lib/db`, `@repo/api/models/Employee` — **not** `@repo/api/src/...`.

### 5. `authOptions` extracted from route handler
Next.js 15 has issues importing from route files in server components.
**Fix:** Lives in `apps/web/src/lib/auth.ts`. Route handler at `api/auth/[...nextauth]/route.ts` imports from there.

### 6. HTTPS local dev
Dev script: `next dev --experimental-https --experimental-https-key ./localhost-key.pem --experimental-https-cert ./localhost.pem`
- Certs generated with `mkcert localhost` inside `apps/web/`
- `mkcert -install` run once to trust the local CA
- `*.pem` gitignored

### 7. Hydration mismatch (Tamagui SSR)
**Fix:** `suppressHydrationWarning` on `<html>` and `<body>` in `layout.tsx`, plus `disableRootThemeClass disableInjectCSS` on `<TamaguiProvider>`.

### 8. `outputFileTracingRoot` — do not add
Causes dev server to look for production build artifacts (`required-server-files.json`) → 500 on all routes.

### 9. `.env.local` must be in `apps/web/`, not the monorepo root
Next.js reads env files from the app's own directory. Root `.env.local` is ignored by Next.js.
**Fix:** All web env vars live in `apps/web/.env.local`.

---

## Environment variables (`apps/web/.env.local`)

| Variable | Status | Notes |
|---|---|---|
| `DATABASE_URL` | Set | MongoDB Atlas |
| `NEXTAUTH_SECRET` | Set | Generated via `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Set | `https://localhost:3000` |
| `GOOGLE_CLIENT_ID` | Set | Google Cloud Console OAuth client |
| `GOOGLE_CLIENT_SECRET` | Set | Google Cloud Console OAuth client |
| `S3_BUCKET` | Not set | Needed for file uploads |
| `AWS_ACCESS_KEY_ID` | Not set | Needed for S3 |
| `AWS_SECRET_ACCESS_KEY` | Not set | Needed for S3 |

Google OAuth redirect URI configured: `https://localhost:3000/api/auth/callback/google`

---

## Running locally

```bash
nvm use                              # Node 22 required
pnpm install
# First run only:
brew install mkcert && mkcert -install
cd apps/web && mkcert localhost && cd ../..
# Then:
pnpm --filter web dev                # https://localhost:3000
pnpm --filter mobile start           # Expo DevTools
```

**Clean restart (fixes most dev issues):**
```bash
rm -rf apps/web/.next && pnpm --filter web dev
```
