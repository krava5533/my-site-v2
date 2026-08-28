# LuxeStone Interiors Ltd. — Website & Lead-Generation Platform

A premium, conversion-focused Next.js website and lightweight CMS/admin platform for a
tile, stone, marble, porcelain and architectural surfaces company. Built with Next.js 14
(App Router), TypeScript, Tailwind CSS, Prisma/PostgreSQL, NextAuth, and a full lead-capture
system (Request a Quote, Request a Sample, Upload Your Project, Book a Showroom Visit).

## ⚠️ About this build

This project was generated inside a sandboxed environment **without internet access or a
package registry**, so it was not possible to run `npm install`, `npm run build`, or
`npm run lint` to verify the build in that environment. Every file was hand-written to be a
correct, idiomatic Next.js 14 App Router project — but **you should run the standard checks
yourself** the first time you set it up locally:

```bash
npm install
npm run typecheck
npm run lint
npm run build
```

Fix any issues that surface (dependency version drift between when this was written and when
you install is the most likely source of small breakage — see `package.json` if you need to
pin exact versions).

## Getting started

```bash
npm install
cp .env.example .env.local
npm run dev
```

The site runs **fully out of the box in `MOCK_MODE=true`** (the default) — no database, email
provider, or Telegram bot required:

- Product/collection/material/project/blog content comes from `lib/data/*.ts`
- Form submissions (quotes, samples, project uploads, appointments, contact) are saved to
  `lib/mock-store/leads.json` and shown in the admin dashboard
- Uploaded files are written to `public/uploads/`
- Email and Telegram notifications are logged to the console instead of sent

### Admin dashboard

Visit `/admin/login`. In mock mode, sign in with the credentials from `.env.local`:

```
ADMIN_SEED_EMAIL=admin@luxestone.example
ADMIN_SEED_PASSWORD=change-me-immediately
```

**Change these before deploying anywhere public.**

## AI Agent — Telegram bot, SMS, and email auto-reply

The site includes a shared AI reply engine (`lib/ai-agent.ts`) plugged into three webhook
routes, so it can auto-reply to customers on Telegram, SMS, and email. Every conversation is
logged and viewable at `/admin/agent`.

**None of this works from `localhost`** — all three providers need to deliver webhooks to a
real, publicly reachable HTTPS URL, so you'll need the site deployed (Vercel or similar)
before setting these up. What you can do locally: add `ANTHROPIC_API_KEY` and confirm the
routes respond correctly with a tool like Postman, but real Telegram/Twilio delivery requires
a public deployment.

1. **Get an AI key**: add `ANTHROPIC_API_KEY` to `.env.local` (or your host's environment
   variables). Without it, the webhooks still log incoming messages but reply with a generic
   fallback line instead of a real AI-drafted response.

2. **Telegram bot**:
   - Message [@BotFather](https://t.me/BotFather) on Telegram, create a bot, get its token.
   - Set `TELEGRAM_BOT_TOKEN` in your environment.
   - Once deployed, register the webhook (run once, from any machine with internet access):
     ```
     curl "https://api.telegram.org/bot<TOKEN>/setWebhook?url=https://yourdomain.com/api/agent/telegram"
     ```
   - Message your bot on Telegram — it should now reply automatically.

3. **SMS (Twilio)**:
   - Create a Twilio account and buy a phone number with SMS capability.
   - In the Twilio console, set that number's incoming-message webhook to
     `https://yourdomain.com/api/agent/sms` (HTTP POST).
   - Texting that number should now get an automatic AI-drafted reply.

4. **Email auto-reply**:
   - This route is written for Resend's inbound email webhook payload shape. Set up inbound
     email routing for your domain in Resend (requires DNS/MX changes — the most involved
     setup of the three), and point its webhook at `https://yourdomain.com/api/agent/email`.
   - If you use a different email provider (SendGrid, Postmark, Mailgun), the field names in
     `app/api/agent/email/route.ts` will need adjusting to match that provider's payload.

**On phone calls answered in your own voice**: this is a meaningfully bigger project than the
three channels above — it needs a phone number via Twilio, a cloned voice via a service like
ElevenLabs (trained from your own audio samples), and an always-on server handling real-time
audio streaming (not just request/response webhooks, which is all this Next.js site does). It
wasn't built here; happy to scope it separately if you want to pursue it.

**Review the agent log regularly** (`/admin/agent`), especially at first — an AI reply that
guesses at a price, timeline, or promise you haven't actually made is a business risk. The
system prompt in `lib/ai-agent.ts` is written to avoid inventing specifics and steer toward
booking a real estimate instead, but it's worth checking its actual replies against real
conversations before fully trusting it unsupervised.

## Going to production (real database, email, Telegram, storage)

1. Provision a PostgreSQL database and set `DATABASE_URL` in `.env.local`.
2. Set `MOCK_MODE=false`.
3. Run:
   ```bash
   npm run db:generate
   npm run db:push
   npm run db:seed
   ```
4. Fill in real values in `.env.local`:
   - `COMPANY_ADDRESS`, `COMPANY_PHONE`, `COMPANY_EMAIL`, `SHOWROOM_*` — the site pulls **all**
     contact info from `lib/config.ts`, which reads these env vars, so updating them here
     updates the footer, contact page, showroom page, and SEO structured data everywhere at once.
   - `RESEND_API_KEY` (or `SMTP_*`) for real email delivery.
   - `TELEGRAM_ENABLED=true`, `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` for lead alerts.
   - `NEXTAUTH_SECRET` — generate with `openssl rand -base64 32`.
5. Implement a real storage provider in `lib/storage.ts` (S3 / Cloudinary / Vercel Blob) if you
   don't want uploads written to local disk — the function signature is already in place.
6. Wire real admin users: `lib/auth.ts` has the `authorize()` callback ready to swap from the
   mock credential check to a Prisma `User` lookup (commented code included).
7. The admin **Products** and **Projects** pages currently render read-only from the mock data
   files as a demo. Once `MOCK_MODE=false` and the database is seeded, extend those pages with
   Prisma-backed create/edit/delete forms — the schema and seed script already model everything
   needed (`Product`, `Collection`, `Material`, `Project`, `BlogPost`, `Asset`).

## Project structure

```
app/                  Next.js App Router pages & API routes
  admin/               Admin dashboard (auth-protected route group)
  api/                 API routes (quote, sample, upload-project, appointment, contact, admin)
  products/ collections/ materials/ applications/ projects/ inspiration/
  request-quote/ request-sample/ upload-project/ showroom/
  find-your-surface/ favorites/ compare/
components/            Reusable UI components
lib/
  data/                 Mock catalog data (20 products, 8 collections, 13 materials,
                         10 projects, 10 blog posts) — swap for real content anytime
  hooks/                Client hooks (favorites/compare via localStorage)
  config.ts             Central site configuration (contact info, nav, SEO)
  leads.ts               Lead persistence (JSON in mock mode / Prisma in production)
  email.ts telegram.ts storage.ts   Provider abstractions
  auth.ts                NextAuth configuration
  validators.ts           Zod schemas for every form
prisma/
  schema.prisma           Full production database schema
  seed.ts                  Seeds real Postgres from the same mock data
types/                  Shared TypeScript types
```

## Key features implemented

- Premium homepage: hero, featured collections, shop by material/application, featured
  products, project gallery, "Why LuxeStone", Upload Your Project CTA, Free Estimate section,
  testimonials, design inspiration, final quote CTA — all content pulled from the admin-managed
  content store
- **Full CMS-style admin dashboard** (`/admin`, NextAuth-protected): Products, Collections,
  Materials, Projects (with photo upload), Inspiration/Blog, Reviews, and Settings (contact
  info & social links) are all fully editable — add, view, and delete — directly from the
  browser, with changes reflected on the live site immediately. No code edits or redeploys
  needed for day-to-day content changes.
- Full product catalog with search/filter/sort (`/products`) and rich product detail pages
- Collections, Materials, and Applications hub + detail pages, all cross-linked
- Project gallery combining seed demo projects with your own uploaded project photos
- **Find Your Surface** — a 3-step interactive product recommendation tool
- **Favorites** and **Compare Products** (up to 3) using localStorage
- Lead-capture forms (Quote, Upload Project, Free Estimate/Appointment, Contact) with file
  upload, validated via Zod, persisted as leads, and triggering (mocked) email + Telegram
  notifications
- CRM-style lead table (status pipeline, notes, search/filter)
- SEO: dynamic `sitemap.xml`, `robots.txt`, Organization/Product/Article JSON-LD, per-page
  metadata — all reflecting live admin-edited content
- Security basics: secure headers, server-side + edge admin auth guards, Zod validation,
  file size/type limits on uploads

## How the CMS works (important to understand)

Every content type (products, collections, materials, projects, blog posts, testimonials,
settings) is backed by a JSON file under `lib/mock-store/`, managed through `lib/store/*.ts` /
`lib/*.ts` modules with a consistent get/create/update/delete shape. The **first time** a
content type is read, it's automatically seeded from the original demo data in `lib/data/*.ts`
— after that, the JSON file is the live source of truth, and both the public site and the
admin dashboard read from it.

This means:
- You can freely add, and delete items from the admin dashboard — changes appear on the site
  immediately (no restart needed).
- The original demo/seed files in `lib/data/*.ts` are left untouched — they're only used as
  the initial seed. Deleting an admin-added item never affects them.
- **Editing existing items isn't wired up yet** — the admin UI currently supports add and
  delete for Collections, Materials, and Blog posts (Products additionally support quick
  status/patch updates via the API, but there's no edit form in the UI yet). If you need to
  fix a typo, the fastest path today is: delete the item and re-add it with corrected info.
  Extending each Manager component (`components/*Manager.tsx`) with an edit form is
  straightforward — they already share the same create/delete pattern.
- Search (the magnifying-glass icon in the header) currently only searches the original demo
  data, not items you've added through the admin — a known limitation, listed below.

When you're ready for a real production database, `lib/store/*.ts` and `lib/*.ts` are designed
to be swapped for Prisma calls against the matching models in `prisma/schema.prisma` — the
function signatures (`getX`, `createX`, `deleteX`) are the same shape either way.

## What still needs your attention before launch

- Real company/contact info — now editable from `/admin/settings` (no code editing needed)
- Real product photography and copy — add via `/admin/products`, `/admin/collections`,
  `/admin/materials`; the original Unsplash placeholders remain until you do
- Legal page content reviewed by counsel (`/privacy`, `/terms`, `/accessibility` are marked
  as placeholder copy — these are static pages, not yet in the CMS)
- Real testimonials — add via `/admin/testimonials`; delete the demo ones once you have real
  reviews
- Edit forms for existing items (currently add/delete only — see "How the CMS works" above)
- Search only covers the original demo data, not admin-added items (see above)
- A production storage provider if you don't want to rely on local disk for uploads
- Running `npm install && npm run build` locally to catch any dependency-version issues, since
  this couldn't be verified in the environment that generated it
