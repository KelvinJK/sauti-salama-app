# Production configuration checklist

Production uses the existing **Lovable-managed Supabase project `fnilxsxzvspfjsxpvyak`**.
Never copy values from the staging project (`ptqifqwcpnfvpbfbmwdm`) into Production.
Work through the sections in order; do not merge PR #3 until sections 1–3 are done.

## 1. Vercel → Settings → Environment Variables (target: Production only)

Mark every variable **Sensitive**. Values come from the Lovable Cloud project
(Supabase → Project Settings → API), never from staging.

| Variable | Value | Exposed to browser? |
|---|---|---|
| `SUPABASE_URL` | `https://fnilxsxzvspfjsxpvyak.supabase.co` | No (server) |
| `SUPABASE_PUBLISHABLE_KEY` | production `sb_publishable_…` key | No (server) |
| `VITE_SUPABASE_URL` | `https://fnilxsxzvspfjsxpvyak.supabase.co` | Yes (public by design) |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | production `sb_publishable_…` key | Yes (public by design, RLS-protected) |
| `VITE_SUPABASE_PROJECT_ID` | `fnilxsxzvspfjsxpvyak` | Yes (MCP OAuth issuer) |
| `SUPABASE_SERVICE_ROLE_KEY` | production secret key | **No — server only.** Needed only for in-app account deletion. Never prefix with `VITE_`. Never add to Preview. |

- [ ] All six set for **Production** only
- [ ] None of them added to Preview or Development
- [ ] No variable contains `ptqifqwcpnfvpbfbmwdm`

These are required because `.env` is no longer committed; without them the
production build has no Supabase configuration and private-app saves fail.

## 2. Production database (via Lovable Cloud)

- [ ] Compare the live schema with `drizzle/migrations/0000`–`0005` (Lovable may have changed production directly)
- [ ] Apply `drizzle/migrations/0006_private_rls_helpers.sql` (verified on staging; rollback script available)
- [ ] Re-run Security Advisor: the four `*_security_definer_function_executable` warnings should clear
- [ ] Confirm `/rest/v1/rpc/has_role` and `/rest/v1/rpc/registered_adult` return 404
- [ ] Enable leaked-password protection if the plan allows it
- [ ] Confirm TOTP MFA is enabled

## 3. Supabase Auth (production project)

- [ ] Site URL: `https://app.sautisalama.health`
- [ ] Redirect URLs include `https://app.sautisalama.health/**` and `https://sautisalama.health/**`
- [ ] Google provider redirect URI matches the production domain
- [ ] OAuth server enabled (required for MCP; currently on)
- [ ] Email confirmation stays **on** (only staging has it off)

## 4. Vercel project settings

- [ ] Domains `app.sautisalama.health` and `sautisalama.health` attached to the Production environment
- [ ] Deployment Protection: decide whether Production is public (it must be for real users)
- [ ] Review/revoke the "Protection Bypass for Automation" secret created during testing
- [ ] Remove the redundant branch-specific Preview overrides for `fix/vercel-build-kelvinjk` (project-wide Preview already points to staging)

## 5. Merge and verify (after approval)

- [ ] Merge PR #3 into `main`
- [ ] Production build succeeds
- [ ] Client bundle references only `fnilxsxzvspfjsxpvyak.supabase.co`
- [ ] `/.well-known/oauth-protected-resource` advertises `https://fnilxsxzvspfjsxpvyak.supabase.co/auth/v1` and resource `https://app.sautisalama.health/mcp`
- [ ] `/mcp` returns 401 without a token
- [ ] Sign in with a real admin-owned test account: profile save, journal save, care navigation
- [ ] Account deletion works (requires `SUPABASE_SERVICE_ROLE_KEY`)

## 6. Self-hosted VPS (only if used)

- [ ] Add `proxy_set_header X-Forwarded-Host $host;` to `nginx/sauti-salama.conf`
- [ ] Provide the same variables as section 1 in the server's environment
