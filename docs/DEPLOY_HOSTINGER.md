# Deploying to the Hostinger VPS

Production runs as a Docker container on the Hostinger VPS (`srv2018115.hstgr.cloud`, `187.7.28.113`)
behind nginx with Let's Encrypt TLS. The database and auth stay on Supabase.
The VPS also hosts Mentora; Sauti Salama uses its own nginx file and port 3100 so nothing collides.

## One-time server setup

```bash
ssh <your-vps>
apt-get update && apt-get install -y docker.io docker-compose-plugin nginx certbot python3-certbot-nginx rsync
mkdir -p /opt/sauti-salama
nano /opt/sauti-salama/.env        # production values, see below
```

`/opt/sauti-salama/.env` (production Supabase project, never staging):

```
VITE_SUPABASE_URL=https://ptqifqwcpnfvpbfbmwdm.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
VITE_SUPABASE_PROJECT_ID=ptqifqwcpnfvpbfbmwdm
SUPABASE_URL=https://ptqifqwcpnfvpbfbmwdm.supabase.co
SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
SUPABASE_SERVICE_ROLE_KEY=sb_secret_...
HOST_PORT=3100
```

```bash
chmod 600 /opt/sauti-salama/.env
```

## DNS (Namecheap → Advanced DNS)

| Type | Host | Value |
|---|---|---|
| A | `@` | `187.7.28.113` |
| A | `app` | `187.7.28.113` |
| CNAME | `www` | `sautisalama.health.` |

## Deploy (from your computer)

```bash
scripts/deploy-hostinger.sh <your-vps>
```

The script type-checks and tests, uploads the code (never `.env`), rebuilds the container and waits
until it is healthy. First deploy only, then install nginx and TLS on the server:

```bash
cp /opt/sauti-salama/nginx/sauti-salama.conf /etc/nginx/sites-available/sauti-salama
ln -sf /etc/nginx/sites-available/sauti-salama /etc/nginx/sites-enabled/sauti-salama
nginx -t && systemctl reload nginx
certbot --nginx -d sautisalama.health -d www.sautisalama.health -d app.sautisalama.health
```

## Check it

```bash
curl -I https://sautisalama.health          # 200
curl -I https://app.sautisalama.health/app  # 200
curl -s https://sautisalama.health/.well-known/oauth-protected-resource
```

## Roll back

Each deploy rebuilds from the uploaded source. To roll back, check out the previous commit locally and
run the deploy script again.

## Database changes

Schema changes are not part of the app deploy. Apply them first with `supabase db push`
(see the README).
