# Connect Africa

A structured investment facilitation platform connecting global investors with African entrepreneurs and verified service providers.

**Live:** _add your deployment URL here_

---

## What it does

Connect Africa reduces deal friction and increases trust in cross-border African investments through verified listings, structured workflows, and controlled communication.

**Three user roles:**

| Role | What they do |
|---|---|
| **Entrepreneur** | Register a company, submit funded projects (paid), receive investor interest, track submissions via a dashboard |
| **Investor** | Browse verified ventures by country, sector and stage, express interest, enter deal rooms |
| **Service Provider** | Get verified, increase visibility, receive qualified leads from investors and entrepreneurs |

---

## Tech stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite 6, Tailwind CSS v4, Framer Motion, React Router v7, Lucide React, Supabase client |
| **Backend** | Node.js (native ES modules), Express, CORS, dotenv, Supabase, Nodemon |
| **Database / Auth / Storage** | Supabase (auth, PostgreSQL, storage, realtime) |
| **Payments** | Stripe (planned — wiring guide in `BACKEND_WIRING.md`) |

---

## Project structure

```
project-final/
├── backend/
│   ├── lib/
│   │   └── supabase.js              # Supabase admin client
│   ├── server.js                    # Express entry point, CORS, routes
│   └── .env                         # Secrets (not committed)
│
├── frontend/
│   ├── src/
│       ├── design-system/
│       │   └── theme.css            # CSS design tokens (colours, type, spacing)
│       ├── components/
│       │   ├── layout/
│       │   │   ├── Navbar.jsx       # Top navigation bar
│       │   │   └── Footer.jsx
│       │   ├── landing/             # Landing page section components
│       │   │   ├── HeroVideo.jsx
│       │   │   ├── HowItWorks.jsx
│       │   │   ├── ProblemSolution.jsx
│       │   │   ├── StatsSection.jsx
│       │   │   └── Testimonials.jsx
│       │   └── entrepreneur/
│       │       └── Sidebar.jsx      # Sidebar navigation for entrepreneur area
│       ├── pages/
│       │   ├── LandingPage.jsx      # / — Hero, sections, CTA
│       │   ├── ChooseRole.jsx       # /choose-role — three role selection cards
│       │   ├── Investor.jsx         # /investor
│       │   ├── ProjectFeed.jsx      # /feed — searchable project discovery feed
│       │   ├── HowItWorks.jsx       # /how-it-works — per-role step-by-step pages
│       │   ├── WhyUs.jsx            # /why-us — problem/solution, comparison table
│       │   ├── TestimonialsPage.jsx # /testimonials — cards, video slots, case studies
│       │   ├── Advice.jsx           # /advice — article grid, newsletter CTA
│       │   └── entrepreneur/
│       │       ├── Register.jsx     # /register — full registration form
│       │       ├── Login.jsx        # /login — returning user sign-in
│       │       ├── Welcome.jsx      # /welcome — T&C acceptance after email confirm
│       │       ├── Profile.jsx      # /entrepreneur/profile — avatar, bio, details
│       │       ├── SubmitProject.jsx # /entrepreneur/submit — project + PDF upload
│       │       ├── Payment.jsx      # /entrepreneur/payment — Stripe + calendar
│       │       └── Dashboard.jsx    # /entrepreneur/dashboard — tracker + chat
│       ├── App.jsx                  # All routes
│       └── index.css
│   └── vercel.json              # SPA rewrite rule for Vercel deployment
├── BACKEND_WIRING.md    # Step-by-step guide to wire Supabase, Stripe, and realtime
├── DESIGN_SYSTEM.md     # Palette, typography, spacing, component patterns
├── Build_Guide.md       # Full application spec and build order
├── Procfile             # Heroku/Render process definition for backend
└── package.json         # Root scripts: postinstall, dev:backend, dev:frontend
```

---

## Routes

### Public

| Path | Page |
|---|---|
| `/` | Landing page |
| `/choose-role` | Role selection (Entrepreneur / Investor / Service Provider) |
| `/how-it-works` | Step-by-step guide per role |
| `/why-us` | Problem–solution, differentiators, comparison table |
| `/testimonials` | User testimonials, video slots, case studies |
| `/advice` | Article grid, quick tips, newsletter signup |
| `/feed` | Project discovery feed with search and category filters |
| `/investor` | Investor landing page |

### Entrepreneur flow

| Path | Page |
|---|---|
| `/register` | Registration form (personal + company details) |
| `/login` | Returning user sign-in |
| `/welcome` | Email confirmation → Terms & Conditions acceptance |
| `/entrepreneur/profile` | Profile — avatar, bio, company presentation |
| `/entrepreneur/submit` | Submit a project (PDF upload, categories, funding stage) |
| `/entrepreneur/payment` | €1,000 submission fee + phone verification calendar |
| `/entrepreneur/dashboard` | Submission tracker, interest metrics, admin chat |

---

## Entrepreneur submission flow

```
Sign Up button
    └─▶ /choose-role
            └─▶ /register  (personal + company form)
                    └─▶ Supabase sends confirmation email
                            └─▶ /welcome  (T&C accordion + acceptance)
                                    └─▶ /entrepreneur/profile  (avatar + bio)
                                            └─▶ /entrepreneur/submit  (project form + PDFs)
                                                    └─▶ /entrepreneur/payment  (Stripe + calendar)
                                                            └─▶ /entrepreneur/dashboard
```

**Key rules:**
- Submission fee: **€1,000** per project
- **80%** refunded if project fails screening · **20%** retained as admin fee
- PDF uploads: pitch deck required (max 50 MB), business plan optional
- Phone verification: Mon–Fri, 09:00–16:00 GMT, 30-minute slots

---

## Prerequisites

- **Node.js** v18 or v20 LTS
- **npm**

---

## Installation

```bash
# From project root — installs backend + frontend deps in one step
npm install
```

---

## Environment variables

### `backend/.env`

```env
# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key   # For admin ops (bypasses RLS)

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# App
PORT=8080
FRONTEND_URL=http://localhost:5173
```

### `frontend/.env` _(create this file)_

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_API_URL=http://localhost:8080
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

---

## Running locally

```bash
# Terminal 1 — backend (http://localhost:8080)
npm run dev:backend

# Terminal 2 — frontend (http://localhost:5173)
npm run dev:frontend
```

---

## Root scripts

| Script | Description |
|---|---|
| `npm install` | Installs backend + frontend deps via `postinstall` |
| `npm run dev:backend` | Start Express backend with nodemon |
| `npm run dev:frontend` | Start Vite dev server |

---

## Documentation

| File | Contents |
|---|---|
| [`BACKEND_WIRING.md`](BACKEND_WIRING.md) | Step-by-step guide: Supabase tables, RLS policies, storage buckets, auth setup, per-page wiring code, Stripe integration, deployment checklist |
| [`DESIGN_SYSTEM.md`](DESIGN_SYSTEM.md) | Colour palette, typography scale, spacing tokens, component patterns |
| [`Build_Guide.md`](Build_Guide.md) | Full application spec, database schema, auth flows, API routes, build order |

---

## Design system

The editorial aesthetic is defined in `frontend/src/design-system/theme.css` as CSS custom properties:

```css
--ds-bg-light:       #F9F7F3   /* warm off-white page background */
--ds-bg-dark:        #0F1A1C   /* dark sections and sidebar */
--ds-accent:         #C9A96E   /* gold — primary brand colour */
--ds-accent-green:   #2C5F4A   /* forest green — secondary accent */
--ds-text-primary:   #0F1A1C
--ds-text-secondary: #4A4A4A
--ds-border:         #E5DDD0
--ds-font-display:   "Playfair Display"  /* headings */
--ds-font-sans:      "DM Sans"           /* body */
```

Use these as Tailwind arbitrary values: `bg-[var(--ds-accent)]`, `text-[var(--ds-text-primary)]`, etc.

---

## Deployment

- **Frontend:** Vercel — `frontend/vercel.json` contains the SPA rewrite rule
- **Backend:** Render or Heroku — `Procfile` defines `web: npm start --prefix backend`
- See [`BACKEND_WIRING.md`](BACKEND_WIRING.md) → Section 16 for the full deployment checklist

---

## Recent improvements (2026-04-03)

### 1) Realtime sign-in error fixed

Resolved the runtime error:

`Unhandled Promise Rejection: Error: cannot add postgres_changes callbacks for realtime:messages after subscribe().`

**What was changed**
- Updated `frontend/src/pages/entrepreneur/Dashboard.jsx` realtime lifecycle handling.
- Ensured callbacks are registered before `.subscribe()`.
- Moved channel cleanup to the effect return (React cleanup), instead of returning from inside an async function.
- Added stale async guard and safe channel removal.
- Changed channel naming to per-user (`messages:${user.id}`) to avoid collisions.

### 2) Accessibility hardening across the app

Implemented accessibility upgrades in core forms, navigation, admin tooling, and content pages:

- Added explicit `label` ↔ `input` associations using `htmlFor`/`id`.
- Added `aria-label` and `aria-pressed` to icon-only toggle buttons (for example password visibility and chat send).
- Added `aria-expanded`/`aria-controls` on menu and accordion controls.
- Added live regions for feedback states (`role="alert"` / `role="status"` + `aria-live`).
- Improved heading structure in footer to fix heading-order audit.
- Improved text contrast in targeted UI areas to satisfy contrast checks.

**Key files updated**
- `frontend/src/pages/entrepreneur/Login.jsx`
- `frontend/src/pages/entrepreneur/Register.jsx`
- `frontend/src/pages/entrepreneur/SubmitProject.jsx`
- `frontend/src/pages/entrepreneur/Profile.jsx`
- `frontend/src/pages/entrepreneur/Welcome.jsx`
- `frontend/src/pages/entrepreneur/Dashboard.jsx`
- `frontend/src/pages/admin/Login.jsx`
- `frontend/src/pages/admin/Register.jsx`
- `frontend/src/pages/admin/Panel.jsx`
- `frontend/src/components/layout/Navbar.jsx`
- `frontend/src/components/layout/Footer.jsx`
- `frontend/src/components/landing/Testimonials.jsx`
- `frontend/src/pages/ProjectFeed.jsx`
- `frontend/src/pages/Advice.jsx`

### 3) Responsive behavior verified and fixed

Performed responsive validation at widths **320px**, **768px**, and **1600px** across Chromium, Firefox, and WebKit.

**Fix applied**
- Removed horizontal overflow risk on `/how-it-works` by changing horizontal entrance animations to vertical motion and tightening overflow handling in:
  - `frontend/src/pages/HowItWorks.jsx`
  - `frontend/src/index.css`

### 4) Cross-browser support verification

Ran automated browser smoke checks for Chromium, Firefox, and WebKit on major routes:
- `/`
- `/login`
- `/register`
- `/how-it-works`
- `/advice`

All returned HTTP 200 with no runtime JS errors in test runs.

### 5) Lighthouse accessibility result

Ran Lighthouse accessibility audit on local preview build:
- **Accessibility score: 100/100**

### 6) Quality gates

- `npm run lint` ✅
- `npm run build` ✅

### 7) Acceptance criteria status

All requested criteria are now covered:
- Authentication ✅
- Navigation using React Router ✅
- Global state management via Context API ✅
- At least two external libraries beyond core stack ✅
- React hooks beyond basic usage (`useMemo`, `useCallback`, `lazy`, `Suspense`) ✅
- Chrome/Firefox/Safari support ✅
- Fully responsive between 320px and 1600px ✅
- Accessibility standards with Lighthouse 100 ✅
- Clean code baseline (lint/build + improved semantics and structure) ✅
