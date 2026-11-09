#!/usr/bin/env bash
# Deploy Sauti Salama to the Hostinger VPS with Docker.
# Usage: scripts/deploy-hostinger.sh <ssh-host> [remote-dir]
#   <ssh-host>  an SSH host alias or user@host with key-based access
#   remote-dir  defaults to /opt/sauti-salama
# The server must already have Docker, nginx and a production .env in remote-dir
# (see docs/DEPLOY_HOSTINGER.md). This script never copies local .env files.
set -euo pipefail

HOST="${1:?usage: scripts/deploy-hostinger.sh <ssh-host> [remote-dir]}"
DIR="${2:-/opt/sauti-salama}"
cd "$(dirname "$0")/.."

echo "==> Checks"
bunx tsc --noEmit
bun run test

echo "==> Uploading source to $HOST:$DIR"
ssh "$HOST" "mkdir -p '$DIR'"
rsync -az --delete \
  --exclude '.git' --exclude 'node_modules' --exclude '.output' --exclude '.vercel' \
  --exclude '.env' --exclude '.env.*' --exclude 'supabase/.temp' --exclude 'supabase/.branches' \
  ./ "$HOST:$DIR/"

echo "==> Building and starting container"
ssh "$HOST" "cd '$DIR' && test -f .env || { echo 'Missing $DIR/.env on server'; exit 1; }; docker compose up -d --build && docker image prune -f >/dev/null"

echo "==> Health check"
ssh "$HOST" "for i in \$(seq 1 30); do curl -fsS -o /dev/null http://127.0.0.1:\${HOST_PORT:-3100}/ && echo healthy && exit 0; sleep 2; done; echo 'not healthy'; docker compose -f '$DIR/docker-compose.yml' logs --tail 50; exit 1"
echo "==> Done: https://sautisalama.health"
