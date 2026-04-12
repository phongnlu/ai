## What was built

Full Turborepo monorepo scaffolded from scratch. Web UI fully designed and functional.

## Stack

- Monorepo: Turborepo + pnpm workspaces
- Web: Next.js 15 (App Router) — upgraded from 14 during setup
- Mobile: React Native + Expo SDK 51
- Shared UI: Tamagui (runtime only, no build-time plugin)
- State: Zustand + React Query
- Auth: NextAuth v4 + Google OAuth
- Database: MongoDB via Mongoose
- File storage: AWS S3
- Push notifications: Expo Notifications + APNs/FCM

## Web UI pages

- `/sign-in` — centered card, gradient bg, Google OAuth button with SVG logo
- `/dashboard` — 4 stat cards + recent activity feed with status badges
- `/employees` — search bar, avatar table, type/status pill badges
- `/payroll` — pay periods table, gross/net, Draft/Approved/Paid badges
- Layout: 220px sidebar (active-link highlight) + top header (initials avatar + sign-out)
- Styling: `apps/web/src/app/globals.css` CSS variables + inline styles throughout

## Key files

- `apps/web/src/lib/auth.ts` — NextAuth authOptions (extracted from route handler)
- `apps/web/src/components/Sidebar.tsx` — nav sidebar
- `apps/web/src/components/Header.tsx` — top bar with sign-out
- `apps/web/.env.local` — web env vars (NOT monorepo root)

## Setup fixes (9 total — see MEMORY.md for full detail)

1. Next.js 14 → 15 upgrade
2. Tamagui withTamagui plugin removed (runtime only)
3. @repo/config exports map — explicit tsconfig paths
4. @repo/api import paths — use @repo/api/lib/db not @repo/api/src/lib/db
5. authOptions extracted to src/lib/auth.ts (Next.js 15 route import issue)
6. HTTPS dev via mkcert + --experimental-https flag
7. Hydration mismatch — suppressHydrationWarning + disableRootThemeClass/disableInjectCSS
8. outputFileTracingRoot — do NOT add (breaks dev server)
9. .env.local must be in apps/web/, not monorepo root

## Environment (apps/web/.env.local)

- DATABASE_URL — MongoDB Atlas (set)
- NEXTAUTH_SECRET — generated, set
- NEXTAUTH_URL — https://localhost:3000 (set)
- GOOGLE_CLIENT_ID — set
- GOOGLE_CLIENT_SECRET — set
- S3_BUCKET / AWS keys — not yet set

## Deployment (AWS ECS Express Mode)

- `apps/web/Dockerfile` — 3-stage Alpine build; `NEXT_BUILD_STANDALONE=true` activates standalone output
- `apps/web/src/app/api/health/route.ts` — `/health` for ECS container health check
- `infra/setup-ecs.sh` — one-time AWS provisioning (ECR, cluster, IAM, SSM secrets, Express Mode service)
- `.github/workflows/deploy-web.yml` — **manual only** (`workflow_dispatch`), no auto-deploy on push

Trigger: `gh workflow run deploy-web.yml` or GitHub UI → Actions → Run workflow.
Options: `skip_build=true` (redeploy :latest), `image_tag=abc123` (specific tag).

## Running locally

```bash
nvm use && pnpm install
# First run: brew install mkcert && mkcert -install && cd apps/web && mkcert localhost && cd ../..
pnpm --filter web dev        # https://localhost:3000
# Clean restart: rm -rf apps/web/.next && pnpm --filter web dev
```
