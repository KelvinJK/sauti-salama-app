# Sauti Salama — Outsourcing & Mobile Handoff Checklist

## Ready for external team

- [x] Code independent of Lovable
- [x] Local development works with `.env`
- [x] Docker + Nginx example for VPS
- [x] Core features functional (no Coming Soon banners)
- [x] Dark mode, bilingual, private vault, facility directory, search
- [x] Developer README

## Needs owner input / approval

- [ ] **Supabase production settings**
  - Set Site URL to `https://app.sautisalama.health`
  - Add redirect allow-list entries for the production domain
  - Confirm auth email templates if using email signup

- [ ] **Test account**
  - Create one real user via signup so export + account deletion can be verified end-to-end

- [ ] **Social profile URLs** (optional polish)
  - Provide Instagram, Facebook, X, LinkedIn links to activate footer icons

- [ ] **Mobile strategy decision**
  - Option A: Capacitor wrapper (fastest, reuses web app) — recommended for first store release
  - Option B: React Native or Flutter rewrite

- [ ] **Domain & hosting confirmation**
  - Confirm `app.sautisalama.health` DNS points to the intended server
  - Decide whether final hosting is Hostinger VPS, Vercel, or both

## Suggested next implementation tasks (external team)

1. Verify signed-in export and deletion flows with a real account
2. Add Capacitor config + build scripts for iOS/Android (if Option A chosen)
3. Expand admin facility verification UI if partners will manage listings
4. Add any remaining clinical review workflow for education content
5. Increase test coverage around vault, auth, and referral note generation

## Contact / ownership

Repo: https://github.com/KelvinJK/sauti-salama-app  
Primary owner: KelvinJK
