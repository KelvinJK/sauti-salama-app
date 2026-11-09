# Contributing to Sauti Salama

Thank you for helping. This project handles sensitive health information for women and families,
so privacy and safety come before features.

## Getting started

1. Follow "Run it on your computer" in the [README](README.md). Always develop against the
   local database (`supabase start`), never against production.
2. Create a branch from `main`: `git checkout -b fix/short-description`.
3. Make your change, then run:

   ```bash
   bunx tsc --noEmit
   bun run test
   bun run build
   ```

4. Open a pull request describing what changed, why, and how you tested it.

## Rules for changes

- **No real personal data** in code, tests, screenshots, issues or pull requests. Use made-up test accounts.
- **No secrets** in commits. `.env` is git-ignored; only `.env.example` with placeholders is committed.
  Keys starting with `VITE_` end up in the browser, so never put a secret in one.
- **Database changes** go in a new file under `supabase/migrations/`. Every table with personal data needs
  row-level security with owner-only policies. Do not expose `SECURITY DEFINER` functions in the `public` schema.
- **Bilingual**: user-facing text needs English and Kiswahili.
- **Health content** must stay informational (no diagnosis or dosing) and be reviewed by a qualified clinician.
- **Accessibility**: keep labels, keyboard access and readable contrast.

## Reporting bugs and ideas

Open a GitHub issue. For security problems, follow [SECURITY.md](SECURITY.md) instead of opening a public issue.

By contributing you agree that your contributions are licensed under the [MIT licence](LICENSE)
and that you will follow the [code of conduct](CODE_OF_CONDUCT.md).
