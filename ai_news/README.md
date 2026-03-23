# AI News

A curated AI news reader that crawls RSS sources, filters and summarizes articles with Claude, and serves them in a clean UI with search, category filters, brand filters, bookmarks, dark mode, PWA install, push notifications, and multilingual translation.

**Live:** https://ai-news.onesolution365.com

## Features

- **Feed** — paginated article cards with search, category tabs, brand filters (Claude Code, Anthropic, ChatGPT, Gemini, Codex), infinite scroll
- **AI pipeline** — fetch → keyword filter → Claude summarize & categorize → save → RSS feed, runs hourly via cron
- **Translation** — EN / 中文 / Tiếng Việt via Google Translate; feed cards, article detail, and related articles all translate; preference persisted in localStorage
- **Push notifications** — browser push per new article, delivered in the subscriber's saved language
- **PWA** — installable, home screen icon, offline-capable service worker
- **Dark mode** — auto follows OS preference, manual override persisted
- **Bookmarks** — localStorage-backed saved articles

---

## How it works

```
RSS sources → fetch → filter (AI) → summarize (Claude) → S3 / local file
                                                              ↓
                                                        Next.js feed UI
```

The pipeline runs automatically on server startup and every hour. It can also be triggered manually via `POST /api/refresh`.

---

## Local development

### Prerequisites

- Node.js v22 (via nvm: `nvm use`)
- An [Anthropic API key](https://console.anthropic.com/)

### Setup

```bash
cp .env.example .env.local
# edit .env.local and set ANTHROPIC_API_KEY
```

```bash
npm install
npm run dev        # http://localhost:3000
```

### Seed articles (optional)

Runs the full pipeline once locally and saves to `data/articles.json`:

```bash
npm run seed
```

---

## Deploy to AWS (App Runner)

The app deploys to AWS App Runner from the GitHub source — no Docker or container registry needed. Article data is persisted in S3.

### Architecture

```
GitHub (master branch)
    ↓ manual deploy via ./deploy.sh
AWS App Runner (0.25 vCPU / 0.5 GB, single instance)
    ↓ reads/writes
S3 bucket  (articles.json, feed.xml)
    ↑ secret
SSM Parameter Store  (ANTHROPIC_API_KEY)
    ↑ DNS
Route 53  (ai-news.onesolution365.com → App Runner)
```

**Estimated cost:** ~$2–5/month (idle memory charge only for a personal app with low traffic).

### Prerequisites

- AWS CLI configured (`aws sts get-caller-identity` should succeed)
- AWS CDK installed (`npx cdk --version`)
- Node.js v22

### Deploy

```bash
./deploy.sh
```

**What it does (step by step):**

1. Checks SSM for `ANTHROPIC_API_KEY` — writes it from `.env.local` only on first deploy, skips on subsequent runs
2. Creates an App Runner GitHub connection (or verifies an existing one)
3. If the connection needs authorization → prints the console URL and exits
4. Deploys the CDK stack (S3 bucket, IAM role, App Runner service)
5. Triggers `apprunner start-deployment` to pull the latest commit and rebuild
6. Waits until the service is back to `RUNNING`

**If it exits asking you to authorize GitHub:**

1. Open the URL it prints (AWS App Runner console → Connections)
2. Click **Complete handshake** and authorize via GitHub OAuth
3. Re-run `./deploy.sh` — it will continue from where it left off

### Rotating the API key

The `ANTHROPIC_API_KEY` is stored in SSM once and never overwritten by `deploy.sh`. To rotate it manually:

```bash
PYTHONPATH="" aws ssm put-parameter \
  --name "/ai-news/anthropic-api-key" \
  --value "sk-ant-..." \
  --type SecureString \
  --overwrite \
  --region us-west-2
```

### Trigger a pipeline refresh

```bash
curl -X POST https://ai-news.onesolution365.com/api/refresh
```

---

## Environment variables

| Variable | Required | Description |
|---|---|---|
| `ANTHROPIC_API_KEY` | Yes | Claude API key for filtering and summarization |
| `NEXT_PUBLIC_BASE_URL` | No | Base URL used in RSS feed metadata (defaults to `http://localhost:3000`) |
| `S3_BUCKET` | No (auto-set in prod) | S3 bucket name; if unset, uses local `data/articles.json` |
| `AWS_REGION` | No (auto-set in prod) | AWS region (default: `us-west-2`) |
| `CRON_SCHEDULE` | No | Cron expression for pipeline schedule (default: `0 * * * *`) |
| `VAPID_PUBLIC_KEY` | Yes (prod) | VAPID public key for push notifications (set from SSM) |
| `VAPID_PRIVATE_KEY` | Yes (prod) | VAPID private key for push notifications (set from SSM) |

In production, `S3_BUCKET` and `AWS_REGION` are set automatically by the CDK stack. `ANTHROPIC_API_KEY` is injected from SSM at runtime.

---

## Project structure

```
src/
  agents/          # pipeline: fetch → filter → summarize → build RSS
  app/
    api/feed/      # GET  /api/feed           — paginated article feed
    api/feed/xml/  # GET  /api/feed/xml       — RSS feed
    api/refresh/   # POST /api/refresh        — trigger pipeline manually
    api/cron-status/   # GET  /api/cron-status       — cron scheduler state
    api/translate/     # POST /api/translate          — Google Translate proxy
    api/push/          # push subscribe/unsubscribe/vapid-public-key
    article/[id]/      # article detail page (SSR + client translation)
    bookmarks/         # saved bookmarks page
  components/
    ArticleCard.tsx         # feed card with translation shimmer
    ArticleTranslated.tsx   # article detail title + summary + related (translated)
    BrandFilter.tsx         # brand pills: Claude Code, Anthropic, ChatGPT, Gemini, Codex
    CategoryFilter.tsx      # category tab filter
    FeedHeader.tsx          # sticky header: logo, search row, nav
    LanguageSelector.tsx    # EN / 中文 / Tiếng Việt dropdown
    PWAInstallBanner.tsx    # bottom install prompt (dismissible)
    PushNotificationButton.tsx
    SearchBar.tsx
    ThemeToggle.tsx
    Toast.tsx
  config/
    sources.ts     # 11 RSS sources (Anthropic, OpenAI, DeepMind, HN queries…)
    env.ts         # environment variable exports
  hooks/           # useBookmarks, useTheme, usePushNotifications
  lib/
    storage.ts     # S3/fs abstraction (S3 in prod, local file in dev)
    cronStatus.ts  # in-memory cron run state
    webPush.ts     # send push notifications with per-subscriber translation
  types/
    article.ts     # Article and FeedResponse types
  instrumentation.ts  # starts pipeline cron on server startup (prod only)
infrastructure/    # AWS CDK stack (App Runner + S3 + IAM)
apprunner.yaml     # App Runner build + run config
deploy.sh          # one-command deploy script
```

---

## PWA & push notifications

The app is installable as a Progressive Web App and supports browser push notifications for new articles.

### Installing

Visit https://ai-news.onesolution365.com in Chrome/Edge and click **Install** in the address bar (or use the browser menu). On mobile, use **Add to Home Screen**.

### Push notifications

Click the **bell icon** in the header to subscribe. The browser will prompt for notification permission. Once granted, you'll receive a push notification per new article whenever the pipeline runs (hourly). Notifications are delivered in your selected language (EN / 中文 / Tiếng Việt).

To unsubscribe, click the bell icon again. If you change your language preference, re-subscribe so the new language is saved with your subscription.

To unsubscribe, click the bell icon again.

### VAPID keys (first deploy only)

Push notifications require VAPID keys stored in SSM. They are already provisioned for production. To rotate them:

```bash
# Generate new keys
npx web-push generate-vapid-keys

# Store in SSM
PYTHONPATH="" aws ssm put-parameter --name "/ai-news/vapid-public-key"  --value "<PUBLIC_KEY>"  --type String       --overwrite --region us-west-2
PYTHONPATH="" aws ssm put-parameter --name "/ai-news/vapid-private-key" --value "<PRIVATE_KEY>" --type SecureString --overwrite --region us-west-2
```

Then redeploy with `./deploy.sh`.

---

## API reference

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/feed` | Paginated articles. Params: `page`, `pageSize`, `category`, `q`, `sort` |
| `GET` | `/api/feed/xml` | RSS 2.0 feed |
| `POST` | `/api/refresh` | Runs the full fetch → filter → summarize pipeline |
| `GET` | `/api/cron-status` | Returns cron scheduler state |
| `POST` | `/api/translate` | Translate article titles & summaries via Google Translate. Body: `{articles, targetLang}` |
| `GET` | `/api/push/vapid-public-key` | Returns VAPID public key for push subscription |
| `POST` | `/api/push/subscribe` | Save a push subscription |
| `DELETE` | `/api/push/unsubscribe` | Remove a push subscription |

### Cron status response

```json
{
  "lastRunAt": "2026-03-21T10:00:00.000Z",
  "lastRunResult": "success",
  "lastRunCount": 24,
  "lastRunError": null,
  "nextRunAt": "2026-03-21T11:00:00.000Z",
  "schedule": "0 * * * *"
}
```

`lastRunResult` is `"success"`, `"error"`, or `null` (not yet run). The cron only runs in production (`NODE_ENV=production`) — use `POST /api/refresh` for manual triggers in dev.
