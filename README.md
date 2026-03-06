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
| **Frontend** | React 18, Vite, Tailwind CSS v4, Framer Motion, React Router v7, Lucide React |
| **Backend** | Node.js, Express, Babel (ES modules) |
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
│   └── src/
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
│       │   │   ├── Testimonials.jsx
│       │   │   └── CTASection.jsx
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
│
├── frontend/
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
