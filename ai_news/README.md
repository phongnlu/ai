# AI News

A Next.js news feed that crawls RSS sources, filters and summarizes articles with Claude, and serves them in a clean UI with search, category filters, and bookmarks.

## How it works

```
RSS sources → fetch → filter (AI) → summarize (Claude) → S3 / local file
                                                              ↓
                                                        Next.js feed UI
```

The pipeline runs automatically on server startup and every 6 hours. It can also be triggered manually via `POST /api/refresh`.

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
    ↓ auto-deploy on push
AWS App Runner (0.25 vCPU / 0.5 GB, single instance)
    ↓ reads/writes
S3 bucket  (articles.json, feed.xml)
    ↑ secret
SSM Parameter Store  (ANTHROPIC_API_KEY)
```

**Estimated cost:** ~$2–5/month (idle memory charge only for a personal app with low traffic).

### Prerequisites

- AWS CLI configured (`aws sts get-caller-identity` should succeed)
- AWS CDK installed (`npx cdk --version`)
- Node.js v22

### First-time deploy

```bash
./deploy.sh
```

**What it does (step by step):**

1. Checks SSM for `ANTHROPIC_API_KEY` — writes it from `.env.local` only on first deploy, skips on subsequent runs
2. Creates an App Runner GitHub connection (or verifies an existing one)
3. If the connection needs authorization → prints the console URL and exits
4. Deploys the CDK stack (S3 bucket, IAM role, App Runner service)

**If it exits asking you to authorize GitHub:**

1. Open the URL it prints (AWS App Runner console → Connections)
2. Click **Complete handshake** and authorize via GitHub OAuth
3. Re-run `./deploy.sh` — it will continue from where it left off

### Subsequent deploys

Auto-deploy on push is disabled. Run manually whenever you want to deploy:

```bash
./deploy.sh
```

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
curl -X POST https://<your-app-runner-url>/api/refresh
```

---

## Environment variables

| Variable | Required | Description |
|---|---|---|
| `ANTHROPIC_API_KEY` | Yes | Claude API key for filtering and summarization |
| `NEXT_PUBLIC_BASE_URL` | No | Base URL used in RSS feed metadata (defaults to `http://localhost:3000`) |
| `S3_BUCKET` | No (auto-set in prod) | S3 bucket name; if unset, uses local `data/articles.json` |
| `AWS_REGION` | No (auto-set in prod) | AWS region (default: `us-west-2`) |

In production, `S3_BUCKET` and `AWS_REGION` are set automatically by the CDK stack. `ANTHROPIC_API_KEY` is injected from SSM at runtime.

---

## Project structure

```
src/
  agents/          # pipeline: fetch → filter → summarize → build RSS
  app/
    api/feed/      # GET  /api/feed       — paginated article feed
    api/feed/xml/  # GET  /api/feed/xml   — RSS feed
    api/refresh/   # POST /api/refresh    — trigger pipeline manually
    article/[id]/  # article detail page
    bookmarks/     # saved bookmarks page
  components/      # UI components
  config/          # env vars, RSS source list
  hooks/           # useBookmarks, useTheme
  lib/
    storage.ts     # S3/fs abstraction (S3 in prod, local file in dev)
  types/
    article.ts     # Article and FeedResponse types
  instrumentation.ts  # starts pipeline cron on server startup (prod only)
infrastructure/    # AWS CDK stack (App Runner + S3 + IAM)
apprunner.yaml     # App Runner build + run config
deploy.sh          # one-command deploy script
```

---

## API reference

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/feed` | Paginated articles. Params: `page`, `pageSize`, `category`, `q`, `sort` |
| `GET` | `/api/feed/xml` | RSS 2.0 feed |
| `POST` | `/api/refresh` | Runs the full fetch → filter → summarize pipeline |
| `GET` | `/api/cron-status` | Returns cron scheduler state |

### Cron status response

```json
{
  "lastRunAt": "2026-03-21T10:00:00.000Z",
  "lastRunResult": "success",
  "lastRunCount": 24,
  "lastRunError": null,
  "nextRunAt": "2026-03-21T16:00:00.000Z",
  "schedule": "0 * * * *"
}
```

`lastRunResult` is `"success"`, `"error"`, or `null` (not yet run). The cron only runs in production (`NODE_ENV=production`) — use `POST /api/refresh` for manual triggers in dev.
