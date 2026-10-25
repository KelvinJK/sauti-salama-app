# SautiSalama roadmap
## Production domain split
- [ ] Host redirects and production-aware website/app/legal links
- [ ] App-only manifest scope and public-only SEO, sitemap and robots
- [ ] Verify redirects, navigation and search metadata
- [ ] Auth Site URL and redirect allow-list — user-editable Cloud settings; awaiting owner update

- [x] A — Foundation, design system, landing page, EN/SW, public pages, install manifest
- [ ] B — Accounts (18+), profiles, roles, privacy controls (Cloud connected)
- [ ] C — Education library management + clinical review workflow
- [ ] D — Cycle tracking
- [ ] E — Pregnancy, antenatal, postnatal
- [ ] F — Child profiles & growth
- [ ] G — Nutrition & recipes
- [ ] H — Private journal
- [~] I — Facility directory built (public verified-only listings, district/service filters, admin verification page at /app/admin-facilities); consented referrals still pending; no facilities listed until real ones are verified
- [ ] J — AI health information assistant
- [ ] K — Staff/admin portals, testing, launch readiness

## Uploaded fixes — guest privacy and app clarity
- [x] Encrypted device records, PIN lock, quick exit and loading retry
- [x] Mood check-ins, Monday calendar, symptom chips and Track views
- [x] Navigation, labels, urgent help and unfinished-module placeholders
- [x] Landing copy and care partnership invitation
- [x] Verify device saves, lock/unlock, navigation and safety flows
- Optional fingerprint/face unlock was added later on request; the six-digit PIN stays required and is the fallback.

## Earlier functional /app verification
- [x] Welcome, language choice, guest dashboard, five-tab navigation
- [x] Secure account forms, adult registration, profile, export and deletion controls
- [x] Openable education, cycle, maternal, children, nutrition, journal and care pages
- [x] Storage-connected private record forms and honest unavailable-service states
- [x] Verify guest navigation and both languages
- [ ] Verify signed-in record, export and deletion round trips — blocked: no registered auth user; signup test's reserved email was rejected. Needs a real account created via signup or social sign-in.

## Follow-up fixes (7)
- [x] PIN lock polish + optional fingerprint/face unlock (WebAuthn, device must support secure key derivation)
- [x] Care hub sections with icon rows
- [x] Six labelled example facilities behind a feature flag (hours, verification tag, search)
- [x] Journal list first, form at /app/journal/new
- [x] Illustrated mood faces, wrapping/scrolling mood row
- [x] Home tiles: chevrons, dimmed Coming soon tiles, light assistant card
- [x] Bleeding as single-select chips
