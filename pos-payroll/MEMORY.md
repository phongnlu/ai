# Project Memory

Context log for AI assistants and contributors — covers what was built, decisions made, and known issues resolved during setup.

---

## What was built

Full Turborepo monorepo scaffolded from scratch (63 files) for a California employee payroll cross-platform app.

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

## Monorepo structure

```
apps/web/          Next.js 15 web app
apps/mobile/       Expo SDK 51 app
packages/api/      Mongoose models, DB/S3/notifications helpers, Axios client
packages/ui/       Tamagui Button, Text, Card components
packages/types/    Shared TS types (Employee, PayStub, PayPeriod, User, ApiResponse)
packages/config/   Shared ESLint + TypeScript configs
```

All packages importable as `@repo/<name>`.

---

## Setup decisions & fixes

### 1. Next.js upgraded 14 → 15
14.2.3 was flagged as outdated at install time. Upgraded to 15.x.

### 2. Tamagui `withTamagui` plugin removed
`next.config.js` originally used `withTamagui({ config, components })`. This caused:
- `Could not resolve "tamagui"` during webpack bundling of the Tamagui config
- `Must provide components` loader error

**Fix:** Removed the plugin entirely. Tamagui runs runtime-only (no compile-time CSS extraction). `TamaguiProvider` is used in `apps/web/src/app/providers.tsx` with `disableRootThemeClass` and `disableInjectCSS`.

### 3. `@repo/config` exports map
`packages/config/package.json` exports must explicitly list each tsconfig file:
```json
"./typescript/nextjs.json": "./typescript/nextjs.json",
"./typescript/react-native.json": "./typescript/react-native.json"
```
Without this, Next.js 15 throws `TS6053: File '@repo/config/typescript/nextjs.json' not found`.

### 4. `@repo/api` import paths
The exports map in `packages/api/package.json` maps:
- `./lib/*` → `./src/lib/*.ts`
- `./models/*` → `./src/models/*.ts`

All imports in `apps/web` must use `@repo/api/lib/db`, `@repo/api/models/Employee` — **not** `@repo/api/src/lib/db`.

### 5. `authOptions` extracted from route handler
Originally defined in `apps/web/src/app/api/auth/[...nextauth]/route.ts` and imported by server components. Next.js 15 has issues with this pattern (circular route imports).

**Fix:** `authOptions` lives in `apps/web/src/lib/auth.ts`. The route handler imports from there.

### 6. HTTPS local dev
`apps/web` dev script uses:
```
next dev --experimental-https --experimental-https-key ./localhost-key.pem --experimental-https-cert ./localhost.pem
```
Certs generated with `mkcert localhost` inside `apps/web/`. Files are gitignored via `*.pem`.

### 7. Hydration mismatch (Tamagui SSR)
Tamagui injects theme class names server-side that differ from the client's first render.

**Fix:**
- `suppressHydrationWarning` on `<html>` and `<body>` in `apps/web/src/app/layout.tsx`
- `disableRootThemeClass disableInjectCSS` on `<TamaguiProvider>` in `providers.tsx`

### 8. `outputFileTracingRoot` — do not add
Adding `outputFileTracingRoot` to `next.config.js` causes the dev server to look for production build artifacts (`required-server-files.json`) and return 500 on all routes. Do not add this option.

---

## Environment variables

| Variable | Status | Notes |
|---|---|---|
| `DATABASE_URL` | Set | MongoDB Atlas |
| `NEXTAUTH_SECRET` | Set | Generated via `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Set | `https://localhost:3000` |
| `GOOGLE_CLIENT_ID` | **Not set** | Needed for Google OAuth sign-in |
| `GOOGLE_CLIENT_SECRET` | **Not set** | Needed for Google OAuth sign-in |
| `S3_BUCKET` | Not set | Needed for file uploads |
| `AWS_ACCESS_KEY_ID` | Not set | Needed for S3 |
| `AWS_SECRET_ACCESS_KEY` | Not set | Needed for S3 |

---

## Running locally

```bash
nvm use                          # Node 22 required
pnpm install
pnpm --filter web dev            # https://localhost:3000
pnpm --filter mobile start       # Expo DevTools
```

> First run: generate HTTPS certs with `mkcert localhost` inside `apps/web/` and run `mkcert -install` once.
