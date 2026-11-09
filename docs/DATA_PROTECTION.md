# Data protection and privacy

Sauti Salama processes sensitive personal data (health and reproductive information).
This document describes what is stored, where, and how it is protected.

## What is stored

| Data | Where | Who can read it |
|---|---|---|
| Email and password hash | Supabase Auth | The user; administrators of the Supabase project |
| Profile: display name, language, birth date, terms acceptance time | `public.profiles` | Only the owner (row-level security) |
| Health records: cycle, journal, mood check-ins, pregnancy, antenatal, postnatal, child, growth | `public.health_records` | Only the owner, and only after adult registration with consent |
| Roles | `public.user_roles` | Only the owner (read-only); assigned server-side, never from user-editable metadata |
| Facility directory | `public.facilities` | Public (verified entries only); editable by admins |
| Guest records (not signed in) | Encrypted vault in the browser (IndexedDB, AES-GCM, PIN-derived key) | Only on that device; never sent to the server |

## Safeguards

- **Row-level security** on every personal table; users can only read and change their own rows.
  Cross-user access is covered by automated checks run before each release.
- **Adults only**: accounts require age 18+ (enforced by a database trigger), and records can only be saved
  after adult registration with consent.
- **Private policy helpers**: the functions used by security policies live in a non-exposed `private` schema
  and only check the signed-in user.
- **Secrets stay on the server**: the service role key is used only by the account-deletion server function
  and is never sent to the browser.
- **On-device PIN lock** for sensitive records, and automatic re-lock after 5 minutes in the background.
- **Quick exit** button and urgent-help guidance (112) for users in unsafe situations.
- **Transport**: HTTPS only in production.

## User rights

- **Access and portability**: Profile → Download my data exports all of the user's records as JSON.
- **Erasure**: Profile → Delete account removes the account; profile and records are deleted with it.
- **Correction**: users can edit their profile and records at any time.

## Hosting and jurisdiction

Production data is stored in a Supabase project in the EU (Ireland, `eu-west-1`).
Operators deploying their own instance choose their own region.

## Open items

- Confirm compliance with Tanzania's Personal Data Protection Act, 2022 (registration as a data controller,
  cross-border transfer conditions) with a qualified adviser.
- Configure a custom email provider so sign-up confirmation and password reset emails can be delivered.
- Enable leaked-password protection (requires a paid Supabase plan).
