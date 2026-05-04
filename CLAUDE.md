# TradeFlow

Voice-to-invoice MVP for solo trades (Next.js 14, **Clerk** auth, Supabase data, Groq, Stripe, Twilio).

## Setup

1. Copy `.env.example` to `.env.local` and fill keys.
2. **Clerk:** create an application, add `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY`. In Clerk → **Paths**, set sign-in URL to `/login` and sign-up URL to `/signup` (or use defaults that match those routes).
3. **Supabase:** run the SQL from the product spec (profiles, customers, invoices, triggers). **Auth is Clerk only** — remove or ignore Supabase Auth; the app uses the **service role** key on the server and always scopes queries by Clerk `userId`.
4. **Clerk user ids are text** (e.g. `user_2abc...`). If your tables still use `uuid` for `profiles.id` / `invoices.user_id`, run `supabase/migrations/20250204_clerk_user_ids.sql` (and update `generate_invoice_number` to accept `text`).
5. `npm install` then `npm run dev`.

## Routes

- `/` — landing
- `/login`, `/signup` — Clerk `<SignIn />` / `<SignUp />`
- `/dashboard`, `/new`, `/invoices`, `/invoice/[id]`, `/settings` — authenticated app (middleware + Clerk)
- `/pay/[id]` — public payment (service role read for invoice + business name)
- `/api/webhooks/stripe` — Stripe events (no Clerk)

## Design tokens

See `app/globals.css` — base `#080810`, accent `#00E5A0`, Syne 800 + DM Sans + DM Mono.
