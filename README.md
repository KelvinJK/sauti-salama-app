# Sauti Salama

Women's health, motherhood and family wellbeing for Tanzania, in English and Kiswahili.
Sauti Salama provides health information and care navigation only. It does not diagnose or treat.

Open source under the [MIT licence](LICENSE).

## What it does

- **Learn**: menstrual health, pregnancy week by week, antenatal and postnatal care, nutrition, family planning
- **Track**: private cycle log, journal, mood check-ins, pregnancy, child profiles and growth
- **Care**: verified facility directory, urgent-help guidance (emergency number 112), referrals shared only with consent
- **Privacy**: adults only (18+), row-level security on every private table, data export and account deletion, an optional on-device PIN lock, and a device-only encrypted vault for guests

## Stack

| Layer | Technology |
|---|---|
| App | TanStack Start, React 19, Vite, Tailwind CSS 4 |
| Server | Nitro (Node.js); runs on Vercel or any Node/Docker host |
| Database, auth | [Supabase](https://supabase.com) (open-source Postgres + GoTrue), self-hostable |
| Migrations | Supabase CLI, SQL files in `supabase/migrations/` |
| Tests | Vitest |

## Run it on your computer

Requirements: [Bun](https://bun.sh) 1.3+, [Docker](https://www.docker.com/) running, and the [Supabase CLI](https://supabase.com/docs/guides/cli).

```bash
git clone https://github.com/KelvinJK/sauti-salama-app.git
cd sauti-salama-app
bun install

# Start a local Postgres + Supabase stack. All migrations and the
# facility directory are applied automatically.
supabase start
supabase status          # shows API_URL and PUBLISHABLE_KEY

cp .env.example .env     # paste API_URL and PUBLISHABLE_KEY into the four values
bun run dev              # http://localhost:3000
```

Local services use ports 54420–54429 so they can run beside other Supabase projects.
The database UI (Studio) is at http://127.0.0.1:54423. Stop everything with `supabase stop`.

### Scripts

| Command | Description |
|---|---|
| `bun run dev` | Development server |
| `bun run build` | Production build (`.output/`) |
| `bun run start` | Run the production build |
| `bun run test` | Run tests |
| `bun run lint` | Lint |
| `bunx tsc --noEmit` | Type check |

## Database changes

Schema lives in `supabase/migrations/` and is the single source of truth.

```bash
supabase migration new describe_your_change   # write SQL in the new file
supabase db reset                              # re-apply everything locally
supabase db push                               # apply to the linked hosted project
```

Every table holding personal data must enable row-level security with owner-only policies.
Helper functions used by policies belong in the non-exposed `private` schema.

## Deploy

**Vercel (current production).** Import the repo, add the environment variables listed in
[`docs/PRODUCTION_CHECKLIST.md`](docs/PRODUCTION_CHECKLIST.md) for Production and Preview, and push.

**Any server (Hostinger VPS, etc.).** Put the variables in `.env`, then:

```bash
docker compose up -d --build
```

Reverse-proxy your domain to port 3000 (example: `nginx/sauti-salama.conf`).
The `VITE_*` values are compiled into the browser bundle at build time; the others are read at runtime.

## Documentation

- [Production checklist](docs/PRODUCTION_CHECKLIST.md)
- [Data protection and privacy](docs/DATA_PROTECTION.md)
- [Digital Public Goods alignment](docs/DPG_ALIGNMENT.md)
- [Contributing](CONTRIBUTING.md) · [Code of conduct](CODE_OF_CONDUCT.md) · [Security policy](SECURITY.md)

## Licence

[MIT](LICENSE). Health content is informational and must be reviewed by qualified clinicians before reuse.
