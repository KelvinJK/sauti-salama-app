# Production configuration checklist

Sauti Salama runs on infrastructure the team owns:

| Environment | App hosting | Database / auth |
|---|---|---|
| Production | Vercel, Production environment | Supabase project `ptqifqwcpnfvpbfbmwdm` (rename it to `sauti-salama` in the dashboard) |
| Previews (pull requests) | Vercel, Preview environment | A separate Supabase project (never production) |
| Local development | `bun run dev` | `supabase start` (Docker on your machine) |

Lovable is no longer used. Never put production keys in Preview or local `.env` files.

## 1. Vercel environment variables

Settings → Environment Variables. One set for **Production**, one set for **Preview** (all branches),
each with values from its own Supabase project (Dashboard → Project Settings → API Keys).

| Variable | Value | Notes |
|---|---|---|
| `VITE_SUPABASE_URL` | `https://<ref>.supabase.co` | Public, compiled into the browser bundle |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | `sb_publishable_…` | Public by design; protected by row-level security |
| `VITE_SUPABASE_PROJECT_ID` | `<ref>` | MCP OAuth issuer |
| `SUPABASE_URL` | same as `VITE_SUPABASE_URL` | Server functions |
| `SUPABASE_PUBLISHABLE_KEY` | same as `VITE_SUPABASE_PUBLISHABLE_KEY` | Server functions |
| `SUPABASE_SERVICE_ROLE_KEY` | `sb_secret_…` | **Production only, Sensitive.** Only for account deletion. Never `VITE_`, never Preview |

## 2. Database

```bash
supabase link --project-ref <ref>
supabase db push            # applies any new files in supabase/migrations/
supabase db advisors --linked --type security
```

- [ ] `supabase db push --dry-run` reports "Remote database is up to date"
- [ ] Security Advisor shows no function or RLS warnings
- [ ] `POST https://<ref>.supabase.co/rest/v1/rpc/has_role` returns 404

## 3. Supabase Auth (production project)

- [x] Site URL `https://app.sautisalama.health`
- [x] Redirect URLs `https://app.sautisalama.health/**`, `https://sautisalama.health/**`, `https://www.sautisalama.health/**`
- [x] Passwords: minimum 8 characters, letters and digits
- [x] TOTP MFA enabled
- [ ] Custom SMTP provider (Authentication → Emails → SMTP). Supabase's built-in mailer only delivers to
      project team members, so users cannot receive confirmation or reset emails without it
- [ ] Then turn on **Confirm email** (Authentication → Sign In / Providers → Email)
- [ ] Google sign-in: create OAuth credentials in Google Cloud, add them under Providers → Google
- [ ] OAuth Server on (Authentication → OAuth Server), needed for the `/mcp` endpoint
- [ ] Leaked-password protection (paid plan)

## 4. Vercel project

- [ ] Domains `app.sautisalama.health` and `sautisalama.health` on Production; DNS pointed to Vercel
- [ ] Deployment Protection covers previews only, so production is public
- [ ] Revoke the "Protection Bypass for Automation" secret created during testing
- [ ] Vercel Hobby is for non-commercial use; move to Pro if the project is commercial or funded

## 5. After merging to `main`

- [ ] Production build succeeds
- [ ] Browser bundle references only the production project
- [ ] `/.well-known/oauth-protected-resource` shows `https://<production-ref>.supabase.co/auth/v1`; `/mcp` returns 401 without a token
- [ ] Sign up, profile save, journal save, care navigation, data export and account deletion all work

## 6. Self-hosting instead of Vercel

```bash
cp .env.example .env      # production values
docker compose up -d --build
```

Add `proxy_set_header X-Forwarded-Host $host;` to `nginx/sauti-salama.conf`.
