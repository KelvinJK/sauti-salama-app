# Build stage
FROM oven/bun:1 AS builder
WORKDIR /app

# Public browser values are baked into the client bundle at build time.
# Pass them as build args (docker compose reads them from .env).
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_PUBLISHABLE_KEY
ARG VITE_SUPABASE_PROJECT_ID
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL \
    VITE_SUPABASE_PUBLISHABLE_KEY=$VITE_SUPABASE_PUBLISHABLE_KEY \
    VITE_SUPABASE_PROJECT_ID=$VITE_SUPABASE_PROJECT_ID \
    SERVER_PRESET=node

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY . .
RUN bun run build

# Runtime stage: only the self-contained Nitro output is shipped.
FROM node:22-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

COPY --from=builder /app/.output ./.output

EXPOSE 3000
USER node

# Server-side values (SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY and optionally
# SUPABASE_SERVICE_ROLE_KEY) are provided at runtime via environment variables.
CMD ["node", ".output/server/index.mjs"]
