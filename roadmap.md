# Sauti Salama roadmap
## Public design and footer
- [x] Refine public page colors, feature surfaces and section hierarchy
- [x] Add branded footer, social placeholders and Dar es Salaam map
- [x] Add privacy, terms and data protection draft pages; verify home/policy links, both themes and mobile layout; 17 tests pass
- [ ] Activate social links — awaiting the user's social profile URLs
- [x] Legal policies approved and in practice — draft/legal-review banners removed from privacy, terms and data protection pages

## Production domain split
- [x] Host redirects and production-aware website/app/legal links
- [x] App-only manifest scope and public-only SEO, sitemap and robots
- [x] Verify redirect rules (12 tests), preview/mapped-production navigation and 17 public sitemap entries; Vite rejects production Host overrides, so deployed middleware verification remains a deployment check
- [ ] Auth Site URL and redirect allow-list — user-editable Cloud settings; awaiting owner update

- [x] A — Foundation, design system, landing page, EN/SW, public pages, install manifest
- [ ] B — Accounts (18+), profiles, roles, privacy controls (Cloud connected)
- [ ] C — Education library management + clinical review workflow
- [ ] D — Cycle tracking (basic private records + calendar functional)
- [x] E — Pregnancy, antenatal, postnatal (private records + week-by-week guide enabled)
- [ ] F — Child profiles & growth (private records functional)
- [x] G — Nutrition library (articles shown, expanded content)
- [ ] H — Private journal (list + new entry functional)
- [~] I — Facility directory built (public verified-only listings, district/service filters, admin verification page at /app/admin-facilities); consented referrals functional with shareable notes
- [x] J — Private assistant (local educational responses with keyword matching and emergency detection)
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
- [x] Home tiles: chevrons, dimmed Coming soon tiles, light assistant card (Coming soon banners removed; all modules now link to functional pages)
- [x] Bleeding as single-select chips

## Recent platform improvements
- [x] Removed all Coming soon banners from Care hub and Home dashboard
- [x] Enabled full links for pregnancy, nutrition, assistant, referrals
- [x] Expanded week-by-week pregnancy content (weeks 4–40)
- [x] Added more nutrition articles (iron-rich foods, hydration)
- [x] Functional consent-based referral note generation with facility selection
