# ── Stage 1: Install dependencies ──────────────────────────────────────────────
FROM node:22-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

RUN corepack enable pnpm

# Copy workspace manifests only (cache layer)
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/web/package.json                  ./apps/web/
COPY packages/api/package.json              ./packages/api/
COPY packages/ui/package.json               ./packages/ui/
COPY packages/types/package.json            ./packages/types/
COPY packages/config/package.json           ./packages/config/

RUN pnpm install --frozen-lockfile

# ── Stage 2: Build ──────────────────────────────────────────────────────────────
FROM node:22-alpine AS builder
WORKDIR /app

RUN corepack enable pnpm

COPY --from=deps /app/node_modules         ./node_modules
COPY --from=deps /app/apps/web/node_modules ./apps/web/node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXT_BUILD_STANDALONE=true

RUN pnpm --filter web build

# ── Stage 3: Production runner ──────────────────────────────────────────────────
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs \
 && adduser  --system --uid 1001 nextjs

# Standalone bundle (includes all required node_modules)
COPY --from=builder /app/apps/web/.next/standalone ./

# Static assets and public folder
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/public        ./apps/web/public

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "apps/web/server.js"]
