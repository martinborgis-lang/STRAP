# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

> ⚠️ Per AGENTS.md: this project pins **Next.js 14 (App Router) + Tailwind v3**, not the scaffold's Next 16 / Tailwind v4. Read `node_modules/next/dist/docs/` before writing framework code — APIs may differ from training data.

## Commands

```bash
npm run dev      # dev server → http://localhost:3000
npm run build    # production build (must pass: TS strict + lint)
npm run start    # serve production build
npm run lint     # next lint (eslint-config-next)
npm run format   # prettier --write . (prettier-plugin-tailwindcss sorts classes)
```

No test runner is configured. Validation = `npm run build` + `npm run lint`.

Stripe webhook locally (needed for order persistence / emails):
```bash
stripe listen --forward-to localhost:3000/api/webhook
```

## What this is

STRAP — a cinematic, animation-heavy e-commerce boutique (French UI) selling adaptable bracelets for Swatch × Audemars Piguet watches. Catalog is small and static; the focus is on motion design and a working Stripe checkout.

## Architecture

**Static catalog as source of truth.** Products live in `src/lib/products.ts` (a hardcoded `Product[]`), accessed via `getProductBySlug` / `getProductById` / `getFeaturedProducts` / etc. Product pages are SSG'd from this. There is no products table — Supabase only stores orders.

**Money is always in integer cents.** `Product.price`, totals, and Stripe amounts are all cents. Format for display with `formatPrice` (`src/lib/utils.ts`, fr-FR EUR). Shipping logic lives in `shippingCost` (flat 590, free at ≥15000).

**Cart** is a Zustand store (`src/store/cart.ts`) persisted to `localStorage` under key `strap-cart` (only `items` are persisted via `partialize`). `total()` / `itemCount()` are selectors. Client-side only.

**Checkout / payment flow:**
1. Client POSTs cart line items (`{product_id, quantity}`) to `POST /api/create-payment-intent`.
2. Server **recomputes the total from the catalog** — the client-sent total is never trusted. It packs a compact `[{id, q}]` list + customer/shipping info into Stripe PaymentIntent `metadata` (kept tiny to stay under Stripe's 500-char metadata limit).
3. Stripe fires `payment_intent.succeeded` → `POST /api/webhook`, which rebuilds full order lines from the catalog, inserts into Supabase `orders`, then sends a Resend confirmation email.
4. Idempotency: a UNIQUE constraint on `stripe_payment_intent_id`; Postgres error `23505` is treated as already-recorded (returns 200).

**Graceful degradation by env config.** Each external service has an `isXConfigured` flag and placeholder fallbacks so the build and dev server run with no keys: `isStripeConfigured` (`src/lib/stripe.ts`), `isSupabaseConfigured` (`src/lib/supabase.ts`), `isResendConfigured` (`src/lib/emails.ts`). Missing Stripe → `/checkout` shows "payment unavailable" instead of crashing. Missing Supabase → webhook just logs. **Preserve this pattern** when touching server libs. The webhook also accepts unsigned bodies when `STRIPE_WEBHOOK_SECRET` is absent (dev only).

**API routes** must declare `export const runtime = 'nodejs'` and `export const dynamic = 'force-dynamic'`. The webhook reads the **raw body** via `request.text()` for signature verification — never parse it as JSON first.

**Animations** are the core of the UI:
- GSAP (+ ScrollTrigger / SplitText) via the `useGSAP` hook (`src/hooks/useGSAP.ts`) — wraps work in a `gsap.context()` scoped to a ref with automatic cleanup, SSR-safe. Use its returned ref as the scope container.
- Framer Motion for component-level transitions.
- All animated components are `'use client'` and should respect `prefers-reduced-motion`.

**Video placeholders.** AI-video slots are `<VideoPlaceholder>` (`src/components/ui/`) awaiting real `.mp4`s in `public/videos/`. `next.config.mjs` sets `Accept-Ranges`/cache headers for `/videos/*`.

## Styling

Dark Indigo design system. Tailwind colors are **CSS-variable-backed semantic tokens** (`bg`, `accent`, `fg`, `border`, …) defined in `tailwind.config.ts` against variables in `src/app/globals.css` — use the semantic class names (`bg-bg-surface`, `text-fg-muted`, `text-accent`), not raw hex. Fonts: Space Grotesk (sans/display) + DM Mono (mono). `cn()` (`src/lib/utils.ts`) merges classes (clsx + tailwind-merge).

> Note: `next.config.mjs` currently sets `images.unoptimized: true` (temporary, to serve local product PNGs without next/image cache issues). Revert once real photos are in.

## Env vars

Copy `.env.example` → `.env.local`. Groups: Stripe (`NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`), Supabase (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` — server-only), Resend (`RESEND_API_KEY`), and `NEXT_PUBLIC_APP_URL`. The `orders` table schema is in `src/lib/supabase-schema.sql`.
