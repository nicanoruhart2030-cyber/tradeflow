# TradeFlow

Voice-to-invoice MVP for solo trades (Next.js 14, Supabase, Groq, Stripe, Twilio).

## Setup

1. Copy `.env.example` to `.env.local` and fill keys.
2. Run the SQL from the product spec in Supabase (profiles, customers, invoices, RLS, triggers, `generate_invoice_number`).
3. `npm install` then `npm run dev`.

## Routes

- `/` — landing
- `/login`, `/signup` — Supabase auth
- `/dashboard`, `/new`, `/invoices`, `/invoice/[id]`, `/settings` — authenticated app
- `/pay/[id]` — public payment (service role read for invoice + business name)
- `/api/webhooks/stripe` — Stripe events (no auth)

## Design tokens

See `app/globals.css` — base `#080810`, accent `#00E5A0`, Syne 800 + DM Sans + DM Mono.
