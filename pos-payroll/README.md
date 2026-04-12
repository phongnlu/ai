# POS Payroll

Cross-platform employee payroll management for the State of California — available on web, iOS, and Android.

**Web:** https://[your-domain]
**iOS:** https://apps.apple.com/app/[app-id]
**Android:** https://play.google.com/store/apps/details?id=[package-id]

---

## Tech Stack

| Layer | Technology |
|---|---|
| Monorepo | Turborepo |
| Web | Next.js 15 (App Router) |
| Mobile | React Native + Expo SDK 51 |
| Shared UI | Tamagui (runtime only) |
| State | Zustand + React Query |
| API | REST (Next.js App Router) |
| Auth | Google OAuth |
| Database | MongoDB |
| File storage | AWS S3 |
| Push notifications | Expo Notifications + APNs/FCM |
| CI/CD | GitHub Actions |
| Web hosting | AWS ECS Express Mode |
| Mobile builds | EAS Build |
| OTA updates | EAS Update |

---

## Repository Structure

```
apps/
  web/                  # Next.js 15 web app
    src/app/
      (auth)/           # Sign-in screen
      (app)/            # Authenticated pages (dashboard, employees, payroll)
      api/              # REST route handlers
    src/components/     # Sidebar, Header
    src/lib/            # auth.ts (NextAuth config)
  mobile/               # Expo app (iOS + Android)
    app/
      (auth)/           # Auth screens
      (tabs)/           # Bottom tab navigator (dashboard, employees, payroll)
packages/
  api/                  # Mongoose models, DB/S3/notifications helpers, Axios client
  ui/                   # Shared Tamagui components (Button, Text, Card)
  types/                # Shared TypeScript interfaces (Employee, PayStub, PayPeriod)
  config/               # Shared ESLint + TypeScript configs
```

All packages are importable as `@repo/<name>` via pnpm workspace aliases.

---

## Prerequisites

- Node.js v22 — `nvm use`
- pnpm v9 — `npm i -g pnpm`
- Expo CLI — `npm i -g expo-cli`
- iOS Simulator (Xcode, macOS only)
- Android Emulator (Android Studio)

---

## Getting Started

```bash
# 1. Copy and fill in environment variables
cp .env.example apps/web/.env.local
# edit apps/web/.env.local with your values

# 2. Generate HTTPS cert (one-time)
brew install mkcert && mkcert -install
cd apps/web && mkcert localhost && cd ../..

# 3. Install dependencies
pnpm install

# 4. Start web + mobile simultaneously
pnpm dev
```

### Run targets individually

```bash
pnpm --filter web dev            # web only → https://localhost:3000
pnpm --filter mobile start       # Expo DevTools
pnpm --filter mobile ios         # iOS simulator
pnpm --filter mobile android     # Android emulator
```

---

## Environment Variables

### Web — `apps/web/.env.local`

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | Yes | MongoDB connection string |
| `S3_BUCKET` | Yes | AWS S3 bucket name |
| `AWS_REGION` | Yes | AWS region (default: `us-west-2`) |
| `AWS_ACCESS_KEY_ID` | Yes | AWS access key |
| `AWS_SECRET_ACCESS_KEY` | Yes | AWS secret key |
| `GOOGLE_CLIENT_ID` | Yes | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Yes | Google OAuth client secret |
| `NEXTAUTH_SECRET` | Yes | NextAuth signing secret |
| `NEXTAUTH_URL` | Yes | App base URL (e.g. `https://localhost:3000`) |

### Mobile — `apps/mobile/.env`

| Variable | Required | Description |
|---|---|---|
| `EXPO_PUBLIC_API_URL` | Yes | API base URL pointing to the web backend |

In production, secrets are injected via EAS Secrets and AWS Secrets Manager — never committed to the repo.

---

## Architecture

```
┌─────────────┐   ┌──────────────┐
│  Next.js    │   │  Expo App    │
│  (web)      │   │  (iOS/Android│
└──────┬──────┘   └──────┬───────┘
       │                  │
       └──────┬───────────┘
              ▼
        REST API layer
        (apps/web/src/app/api)
              │
       ┌──────┴──────┐
       ▼             ▼
    MongoDB          S3
```

Shared business logic (models, helpers) lives in `packages/api`. Platform-specific code lives in `apps/web` or `apps/mobile`. Shared UI primitives live in `packages/ui`.

---

## API Reference

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/employees` | List employees (paginated, searchable) |
| `POST` | `/api/employees` | Create employee |
| `GET` | `/api/employees/:id` | Get employee by ID |
| `PATCH` | `/api/employees/:id` | Update employee |
| `DELETE` | `/api/employees/:id` | Delete employee |
| `GET` | `/api/pay-periods` | List pay periods |
| `POST` | `/api/pay-periods` | Create pay period |
| `GET` | `/api/pay-stubs` | List pay stubs (filter by employeeId / payPeriodId) |
| `POST` | `/api/pay-stubs` | Create pay stub |
| `GET/POST` | `/api/auth/[...nextauth]` | Google OAuth (NextAuth) |

---

## Database

```bash
pnpm db:seed           # seed development data
```

Mongoose models live in `packages/api/src/models/`. Connection helper is at `packages/api/src/lib/db.ts`.

---

## Testing

```bash
pnpm test              # unit tests (Vitest) across all packages
pnpm test:e2e          # Playwright E2E tests (web)
```

- Unit tests are colocated with source as `*.test.ts`
- Web E2E tests live in `apps/web/e2e/`
- Mobile E2E tests live in `apps/mobile/e2e/`

---

## Mobile Builds

### Development build

```bash
eas build --profile development --platform ios
eas build --profile development --platform android
```

### Production build

```bash
eas build --profile production --platform all
```

### OTA update (JS-only changes)

```bash
eas update --branch production --message "fix: description"
```

### App store submission

```bash
eas submit --platform ios
eas submit --platform android
```

Credentials are managed by EAS Credentials — never stored in the repo.

---

## Web Deployment

Deployments are **manual only** — triggered on demand via GitHub Actions. There is no auto-deploy on push.

### One-time infrastructure setup

```bash
# Provisions ECR, ECS cluster, IAM role, SSM secrets, CloudWatch, Express Mode service
./infra/setup-ecs.sh
```

ECS Express Mode automatically provisions the ALB, HTTPS endpoint, auto-scaling, and VPC networking — no manual AWS networking setup required.

### Set GitHub Actions variables and secrets

After running the setup script, configure these in repo **Settings → Variables**:

| Variable | Value |
|---|---|
| `AWS_REGION` | `us-west-2` |
| `ECR_REPOSITORY` | `pos-payroll` |
| `ECS_CLUSTER` | `pos-payroll` |
| `ECS_SERVICE` | `pos-payroll` |
| `CONTAINER_NAME` | `pos-payroll` |
| `TASK_DEFINITION` | `pos-payroll` |

And in **Settings → Secrets**: `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`.

### Trigger a deployment

**GitHub UI:** `Actions → Deploy Web — AWS ECS Express Mode → Run workflow`

**GitHub CLI:**
```bash
# Build + deploy latest commit
gh workflow run deploy-web.yml

# Redeploy existing :latest image without rebuilding (fast rollback)
gh workflow run deploy-web.yml -f skip_build=true

# Deploy a specific image tag
gh workflow run deploy-web.yml -f image_tag=abc1234
```

### After first deploy

1. Copy the HTTPS endpoint from the ECS console
2. Update `NEXTAUTH_URL` in SSM Parameter Store: `/pos-payroll/NEXTAUTH_URL`
3. Add the URL to Google Cloud Console OAuth redirect URIs

---

## CI/CD

| Workflow | Trigger | What it does |
|---|---|---|
| `ci.yml` | PR, push to main | Lint, type-check, unit tests |
| `e2e.yml` | Push to main | Playwright E2E on web |
| `deploy-web.yml` | **Manual only** | Build Docker image → push ECR → deploy ECS Express Mode |
| `eas-build.yml` | Push to main | EAS production build + submit |
| `eas-update.yml` | Push to staging | EAS OTA update to staging channel |

---

## Code Conventions

- **TypeScript strict mode** everywhere — no `any`, no `ts-ignore` without an explanation
- **Shared logic** goes in `packages/` — never duplicate between `apps/web` and `apps/mobile`
- **Platform-specific files** use `.web.tsx` / `.native.tsx` / `.ios.tsx` / `.android.tsx` suffixes
- **No barrel files** — import directly from source to keep tree-shaking effective
- **API calls** go through the REST layer — no direct `fetch` to internal endpoints from the frontend
- **Secrets** are never hardcoded — `EXPO_PUBLIC_*` and `NEXT_PUBLIC_*` are safe for client bundles

---

## Push Notifications

- **iOS** — APNs via Expo Notifications; requires a physical device to test
- **Android** — FCM via Expo Notifications; works on emulators with Google Play Services
- Token registration happens on app launch in `apps/mobile/app/_layout.tsx`
- Server-side sending via `packages/api/src/lib/notifications.ts`

Test locally with the [Expo Push Notification Tool](https://expo.dev/notifications).

---

## Deep Linking

| Platform | Scheme |
|---|---|
| iOS + Android | `pos-payroll://` |
| Web | `https://[your-domain]` |

Universal links require `apple-app-site-association` and `assetlinks.json` in `apps/web/public/.well-known/`.

---

## Troubleshooting

**Metro bundler cache issues**
```bash
pnpm --filter mobile start --clear
```

**iOS build fails on simulator**
```bash
cd apps/mobile/ios && pod install
```

**pnpm workspace resolution errors**
```bash
pnpm install --frozen-lockfile
```

**Next.js dev server 500 / missing build artifacts**
```bash
rm -rf apps/web/.next && pnpm --filter web dev
```

**HTTPS cert missing**
```bash
cd apps/web && mkcert localhost
```
