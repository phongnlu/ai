# [POS - payroll]

[This project is to create a cross platform application that support web, android and ios. The application is used to handle employee payroll for state of california]

**Web:** https://[your-domain]
**iOS:** https://apps.apple.com/app/[app-id]
**Android:** https://play.google.com/store/apps/details?id=[package-id]

---

## Tech stack

| Layer | Technology |
|---|---|
| Monorepo | Turborepo |
| Web | Next.js 14 (App Router) |
| Mobile | React Native + Expo SDK 51 |
| Shared UI | Tamagui (web + native tokens) |
| State | Zustand + React Query |
| API | REST (Next.js App Router) |
| Auth | Login with Google |
| Database | MongoDB |
| File storage | S3 |
| Push notifications | Expo Notifications + APNs/FCM |
| CI/CD | GitHub Actions |
| Web hosting | aws ECS Express Mode 1 |
| Mobile builds | EAS Build |
| OTA updates | EAS Update |

---

## Monorepo structure

```
apps/
  web/                  # Next.js app (web)
  mobile/               # Expo app (iOS + Android)
packages/
  api/                  # REST Next.js App Router + Axios client
  ui/                   # Shared Tamagui components
  config/               # ESLint, TypeScript, Tailwind configs
  types/                # Shared TypeScript types
```

All packages are importable as `@repo/<name>` via workspace aliases.

---

## Local development

### Prerequisites

- Node.js v22 (via nvm: `nvm use`)
- pnpm v9 (`npm i -g pnpm`)
- Expo CLI (`npm i -g expo-cli`)
- iOS Simulator (Xcode, macOS only)
- Android Emulator (Android Studio)

### Setup

```bash
cp .env.example .env.local
pnpm install
pnpm dev               # starts web + mobile simultaneously via Turborepo
```

### Run targets individually

```bash
pnpm --filter web dev            # web only  → http://localhost:3000
pnpm --filter mobile start       # Expo DevTools
pnpm --filter mobile ios         # iOS simulator
pnpm --filter mobile android     # Android emulator
```

---

## Environment variables

### Web (`apps/web/.env.local`)

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | Yes | MongoDB connection string |
| `S3_BUCKET` | Yes | Storage bucket name |
| `AWS_REGION` | Yes | AWS region (default: `us-west-2`) |

### Mobile (`apps/mobile/.env`)

| Variable | Required | Description |
|---|---|---|
| `EXPO_PUBLIC_API_URL` | Yes | API base URL (points to web backend) |

In production, secrets are injected at build time via EAS Secrets and AWS secret manager environment settings — never committed to the repository.

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
        Rest API layer
        (packages/api)
              │
       ┌──────┴──────┐
       ▼             ▼
    MongoDB          S3
```

Shared business logic lives in `packages/api`. Platform-specific code (navigation, native modules) lives in `apps/web` or `apps/mobile` respectively. Shared UI primitives live in `packages/ui`.

---

## Database

```bash
pnpm db:migrate        # apply pending migrations (dev)
pnpm db:studio         # open database studio
pnpm db:generate       # regenerate database client/types after schema changes
pnpm db:seed           # seed development data
```

Schema lives at `packages/api/prisma/schema.prisma`. Never edit generated files under `node_modules/.prisma`.

---

## Testing

```bash
pnpm test              # unit tests (Vitest) across all packages
pnpm test:e2e          # Playwright E2E tests (web)
pnpm test:detox        # Detox E2E tests (mobile, requires simulator)
```

- Unit tests colocated with source (`*.test.ts`)
- E2E web tests in `apps/web/e2e/`
- E2E mobile tests in `apps/mobile/e2e/`

---

## Mobile builds

### Development build (simulator / physical device)

```bash
eas build --profile development --platform ios
eas build --profile development --platform android
```

### Production build

```bash
eas build --profile production --platform all
```

### OTA update (no app store submission)

```bash
eas update --branch production --message "fix: [description]"
```

OTA updates are limited to JavaScript changes. Any native module changes require a full build.

### App store submission

```bash
eas submit --platform ios      # uploads to App Store Connect
eas submit --platform android  # uploads to Google Play
```

Credentials (certificates, provisioning profiles, keystore) are managed by EAS Credentials — never stored in the repo.

---

## Web deploy

Deployments are automatic on push to `main` via Vercel GitHub integration.

To deploy manually:

```bash
vercel --prod
```

Preview deployments are created automatically for every pull request.

---

## CI/CD (GitHub Actions)

| Workflow | Trigger | What it does |
|---|---|---|
| `ci.yml` | PR, push to main | Lint, type-check, unit tests |
| `e2e.yml` | Push to main | Playwright E2E on web |
| `eas-build.yml` | Push to main | EAS production build + submit |
| `eas-update.yml` | Push to staging | EAS OTA update to staging channel |

---

## Code conventions

- **TypeScript strict mode** everywhere — no `any`, no `ts-ignore` without a comment explaining why
- **Shared logic** goes in `packages/` — never duplicate between `apps/web` and `apps/mobile`
- **Platform-specific files** use `.web.tsx` / `.native.tsx` / `.ios.tsx` / `.android.tsx` suffixes
- **No barrel files** (`index.ts` re-exports) — import directly from source files to keep tree-shaking effective
- **API calls** go through REST — no direct `fetch` calls to internal endpoints from the frontend
- **Secrets** are never hardcoded — use environment variables; `EXPO_PUBLIC_*` and `NEXT_PUBLIC_*` are safe for client bundles

---

## Project structure (detail)

```
apps/
  web/
    app/                  # Next.js App Router pages
      api/                # API routes (REST handler, webhooks)
      (auth)/             # Auth group (sign-in, sign-up)
      (app)/              # Authenticated app group
    components/           # Web-only React components
    public/               # Static assets
  mobile/
    app/                  # Expo Router file-based navigation
      (tabs)/             # Bottom tab navigator screens
      (auth)/             # Auth screens
    components/           # Mobile-only RN components
    assets/               # Images, fonts, splash screens
packages/
  api/
    src/
      router/             # REST route handlers (one file per domain)
      prisma/             # database schema + migrations
      lib/                # Shared server utilities
  ui/
    src/
      components/         # Tamagui cross-platform components
      tokens/             # Design tokens (colors, spacing, typography)
  types/
    src/                  # Shared TypeScript interfaces and enums
  config/
    eslint/               # Shared ESLint config
    typescript/           # Shared tsconfig bases
```

---

## Push notifications

- **iOS** — APNs via Expo Notifications; requires physical device to test
- **Android** — FCM via Expo Notifications; works on emulator with Google Play Services
- Token registration happens on app launch in `apps/mobile/app/_layout.tsx`
- Server sends via `packages/api/src/lib/notifications.ts`

To test locally, use the Expo Push Notification Tool: https://expo.dev/notifications

---

## Deep linking

| Platform | Scheme |
|---|---|
| iOS + Android | `myapp://` (custom scheme) |
| Web | `https://[your-domain]` (universal links / app links) |

Universal links require `apple-app-site-association` and `assetlinks.json` in `apps/web/public/.well-known/`.

---

## API reference

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/[resource]` | REST GET endpoint |
| `POST` | `/api/[resource]` | REST POST endpoint |
| `POST` | `/api/webhooks/auth` | Google auth webhook |

All application API calls go through REST — see `packages/api/src/router/` for the full router tree.

---

## Troubleshooting

**Metro bundler cache issues**
```bash
pnpm --filter mobile start --clear
```

**Database client out of sync**
```bash
pnpm db:generate
```

**iOS build fails on simulator**
```bash
cd apps/mobile/ios && pod install
```

**pnpm workspace resolution errors**
```bash
pnpm install --frozen-lockfile
```
