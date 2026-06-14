# OpenShed 🏗️

> **Your neighborhood's digital shed.** Borrow tools from neighbors you trust. Save money. Build community.

A peer-to-peer tool sharing platform for suburban neighborhoods in the US, built with React + Vite.

---

## 🚀 Quick Start (Local Development)

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev
# → opens at http://localhost:3000
```

---

## 📦 Project Structure

```
openshed/
├── index.html              ← Entry point + Google Fonts
├── vite.config.js          ← Vite config
├── vercel.json             ← Vercel SPA rewrites
├── .env.example            ← Copy to .env.local for env vars
└── src/
    ├── App.jsx             ← Main router
    ├── main.jsx            ← React DOM entry
    ├── index.css           ← Global styles
    ├── theme.js            ← Design tokens (colors, shadows)
    ├── data/
    │   └── index.js        ← Mock data (tools, plans, activity)
    ├── components/
    │   ├── atoms.jsx       ← TrustRing, HealthBadge, ToolPhoto, etc.
    │   ├── ToolCard.jsx    ← Tool listing card
    │   └── Nav.jsx         ← Bottom tab navigation
    └── screens/
        ├── HomeScreen.jsx
        ├── BrowseScreen.jsx
        ├── DetailScreen.jsx        ← With consumables shop + waiver
        ├── PhotoScreen.jsx         ← Before/after photo comparison
        ├── ShedScreen.jsx          ← My tools with health dashboard
        ├── HandshakeScreen.jsx     ← 4-step pickup flow
        └── NeighborsProfilePaywall.jsx  ← Community + Profile + Pricing
```

---

## 🐙 GitHub Setup

```bash
# 1. Initialize git in the project folder
cd openshed
git init
git add .
git commit -m "feat: initial OpenShed prototype"

# 2. Create a new repo on github.com (don't initialize with README)
# Then link and push:
git remote add origin https://github.com/YOUR_USERNAME/openshed.git
git branch -M main
git push -u origin main
```

---

## ▲ Vercel Deployment

### Option A — Deploy via Vercel Dashboard (easiest)
1. Go to **[vercel.com/new](https://vercel.com/new)**
2. Click **"Import Git Repository"** and connect your GitHub account
3. Select the `openshed` repo
4. Vercel auto-detects Vite — leave all settings as default
5. Click **"Deploy"**

That's it. Every push to `main` auto-deploys. ✅

### Option B — Deploy via Vercel CLI
```bash
npm install -g vercel
vercel login
vercel --prod
```

### Build Settings (if Vercel asks)
| Setting | Value |
|---|---|
| Framework | Vite |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Install Command | `npm install` |

---

## 🔧 Tech Stack (current — prototype)

| Layer | Tech |
|---|---|
| UI Framework | React 18 |
| Build Tool | Vite 5 |
| Icons | lucide-react |
| Deployment | Vercel |
| Fonts | Inter (Google Fonts) |
| Styling | Inline styles (design tokens in `theme.js`) |

---

## 🗺️ Roadmap — From Prototype to Production

### Phase 1 — Authentication & Profiles *(next)*
```
Recommended: Supabase Auth
- npm install @supabase/supabase-js
- Email/password + SMS OTP (for US users)
- Profile: name, address (geocoded), profile photo
- Supabase table: profiles(id, trust_score, plan, stripe_customer_id)
```

### Phase 2 — Tool Listings & Search
```
- Supabase table: tools(id, owner_id, name, brand, health, location, visibility)
- PostGIS extension for geospatial search (distance filtering)
- Supabase Storage for tool photos (replace ToolPhoto placeholder)
- Full-text search with Supabase fts
```

### Phase 3 — Loan Management
```
- Supabase table: loans(id, tool_id, borrower_id, status, waiver_pdf_url)
- Loan status machine: REQUESTED → APPROVED → WAIVER_SIGNED → ACTIVE → RETURNED
- QR codes: generate with qrcode.react, verify server-side
- Photo evidence: upload to Supabase Storage with metadata
- Push notifications: Expo (mobile) or web push via Supabase Edge Functions
```

### Phase 4 — Payments & Monetization
```
Recommended: Stripe
- npm install @stripe/stripe-js stripe
- Stripe Customer Portal for subscription management
- Plans: Starter (free) / Neighbor ($4.99/mo) / Pro ($9.99/mo)
- Stripe Connect for lender payouts (paid tool rentals)
- Webhook handler (Vercel Edge Function): /api/webhooks/stripe
```

### Phase 5 — Trust System & Communities
```
- Trust Score algorithm (server-side, not client-modifiable)
- Signed waivers: generate PDF with pdf-lib, store in Supabase Storage
- Neighborhood groups: invite-only or HOA code
- Real-time activity feed: Supabase Realtime subscriptions
```

---

## 🌐 Recommended Services

| Service | Purpose | Free Tier |
|---|---|---|
| [Supabase](https://supabase.com) | Database + Auth + Storage + Realtime | 500MB DB, 1GB storage |
| [Stripe](https://stripe.com) | Payments + Connect | 2.9% + 30¢ per transaction |
| [Vercel](https://vercel.com) | Hosting + Edge Functions | Generous free tier |
| [Sentry](https://sentry.io) | Error monitoring | 5k errors/mo free |
| [Resend](https://resend.com) | Transactional email | 3k emails/mo free |

---

## 📱 Screens (current prototype)

| Screen | Description |
|---|---|
| 🏠 Home | Dashboard with trust ring, active loan, neighborhood feed |
| 🔍 Browse | Search with category filters, sponsored commercial fallback |
| 📋 Detail | Tool info, health dashboard, consumables shop, liability waiver |
| 📸 Photo | 3-shot capture + before/after drag comparison + AI badge |
| 🏗️ Shed | My tools with health indicators, expandable maintenance details |
| 🤝 Handshake | 4-step pickup: waiver → QR → photos → confirmed |
| 👥 Neighbors | SOS alert, live activity feed, neighborhood groups |
| 👤 Profile | Trust score, current plan, settings |
| 💳 Paywall | 3-tier pricing, monthly/annual toggle |

---

## 💡 Environment Variables

Copy `.env.example` to `.env.local` and fill in:

```bash
cp .env.example .env.local
```

In Vercel: add environment variables in **Project Settings → Environment Variables**.

---

## 📄 License

MIT — build on it, ship it, make it yours.

---

*Built with ❤️ — OpenShed prototype v0.1*
