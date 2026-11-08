# Sauti Salama

Women’s health, motherhood and family wellbeing platform for Tanzania — bilingual (English / Kiswahili).

## Stack

- **Frontend**: TanStack Start + React 19 + Vite + Tailwind CSS 4
- **Backend / Auth / DB**: Supabase
- **Private records**: Encrypted on-device vault (PIN / optional WebAuthn)
- **Deployment**: Node.js (Nitro) — Docker or direct on VPS

## Local development

```bash
git clone https://github.com/KelvinJK/sauti-salama-app.git
cd sauti-salama-app
cp .env.example .env
# Fill VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY

bun install          # or npm install
bun run dev          # or npm run dev
```

Open http://localhost:3000

### Scripts

| Command | Description |
|---------|-------------|
| `bun run dev` | Start development server |
| `bun run build` | Production build |
| `bun run start` | Run production server (`.output/server`) |
| `bun run preview` | Preview production build |
| `bun run test` | Run tests |

## Environment variables

See `.env.example`. Required:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

## Architecture notes

- File-based routing in `src/routes/`
- Content and bilingual strings in `src/lib/`
- Private health records stay on the device (encrypted vault)
- Public facility directory and education content come from Supabase + local fallbacks
- Dark mode is class-based (`dark` on `<html>`)

## Deployment (Hostinger VPS or any Node host)

### Docker (recommended)

```bash
cp .env.example .env
# edit .env
docker compose up -d --build
```

Then reverse-proxy `app.sautisalama.health` to port 3000 (see `nginx/sauti-salama.conf`).

### Direct Node

```bash
bun install
bun run build
bun run start
```

Use PM2 or systemd for process management.

## Mobile readiness

The app is a Progressive Web App (manifest included). For store distribution:

1. **Fastest path**: Wrap with Capacitor (iOS + Android) — reuses the existing web codebase.
2. **Full native**: Extract shared logic and rebuild UI in React Native or Flutter.

See `HANDOFF.md` for the current outsourcing checklist.

## License

Private — Sauti Salama / Mentora Tanzania.
