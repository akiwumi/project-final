# Connect Africa

A LinkedIn-style investment platform connecting global investors with African entrepreneurs and verified service providers.

## What it does

**Value proposition:** Reduce deal friction and increase trust in cross-border African investments through structured listings, verification workflows, and controlled communication.

**User roles:**

- **Investors** — discover ventures, filter by country/sector/stage, manage watchlists, request introductions
- **Entrepreneurs** — create project listings, upload documents, receive investor interest
- **Service providers** — subscribe for visibility, capture leads, earn verification badges

## Tech stack

| Layer      | Technologies |
|-----------|--------------|
| **Frontend** | React 18, Vite, Tailwind CSS v4, Framer Motion, React Router, Lucide React |
| **Backend**  | Node.js, Express, Babel (ES modules) |
| **Database / Auth** | Supabase (client in backend), Mongoose (MongoDB) |
| **Planned** | Stripe, WhatsApp Business API, AI assistance |

## Project structure

```
project-final/
├── backend/                 # Express API
│   ├── lib/
│   │   └── supabase.js      # Supabase client (auth, DB, storage)
│   ├── server.js            # App entry, CORS, routes
│   └── .env                 # SUPABASE_*, MONGO_*, PORT (not committed)
├── frontend/                # React SPA (Vite)
│   ├── public/
│   │   └── videos/           # Add hero-video.mp4 here (optional)
│   ├── src/
│   │   ├── design-system/
│   │   │   └── theme.css     # CSS variables (design tokens)
│   │   ├── components/
│   │   │   ├── layout/       # Navbar, Footer
│   │   │   └── landing/      # Hero, HowItWorks, Testimonials, etc.
│   │   ├── pages/            # LandingPage, Investor, …
│   │   ├── App.jsx           # React Router routes
│   │   ├── main.jsx
│   │   └── index.css
│   └── index.html
├── DESIGN_SYSTEM.md          # Design system (colors, typography, components)
├── Build_Guide.md            # Full app build spec (schema, flows, pages)
├── package.json              # Root scripts: postinstall, dev:backend, dev:frontend
└── README.md                 # This file
```

## Prerequisites

- **Node.js** (v18 or v20 LTS recommended)
- **npm**

## Installation

From the project root:

```bash
npm install
```

This runs `postinstall` and installs dependencies for both `backend` and `frontend`.

## Environment variables (backend)

Create `backend/.env` (the file is gitignored). Example:

```env
# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key
# Optional: for admin operations (bypass RLS)
# SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Optional: direct Postgres (migrations, tools)
# SUPABASE_DB_URL=postgresql://...

# Server
PORT=8080

# MongoDB (optional; defaults to mongodb://localhost/final-project)
# MONGO_URL=mongodb://localhost/final-project
```

The Supabase client is created in `backend/lib/supabase.js`; import `supabase` in your routes for auth, database, and storage.

## Running the project

### Backend (Express)

From **project root**:

```bash
npm run dev:backend
```

Or from `backend/`:

```bash
cd backend && npm run dev
```

Server runs at **http://localhost:8080** (or the port in `PORT`).

### Frontend (React + Vite)

From **project root**:

```bash
npm run dev:frontend
```

Or from `frontend/`:

```bash
cd frontend && npm run dev
```

Then open the URL shown (e.g. **http://localhost:5173**).

### Run both

Use two terminals: one for `npm run dev:backend`, one for `npm run dev:frontend`.

## Frontend overview

- **Landing page (`/`)** — Hero with role CTAs (Investor, Entrepreneur, Service Provider), How it works, Why Connect Africa, platform stats, testimonials, footer. Navbar is transparent over the hero and solid on scroll.
- **Investor page (`/investor`)** — Placeholder page; linked from the “I’m an Investor” button on the landing page.
- **Design system** — Colors, typography, and spacing are documented in `DESIGN_SYSTEM.md`. Tokens are available as CSS variables in `frontend/src/design-system/theme.css` (e.g. `--ds-bg-light`, `--ds-accent`, `--ds-text-primary`).
- **Hero video** — Optional: add `frontend/public/videos/hero-video.mp4` for the hero background; otherwise a gradient fallback is used.

## Root scripts

| Script           | Command                    | Description                          |
|------------------|----------------------------|--------------------------------------|
| `postinstall`    | (runs on `npm install`)    | Installs backend + frontend deps     |
| `dev:backend`    | `npm run dev:backend`      | Start backend dev server             |
| `dev:frontend`   | `npm run dev:frontend`    | Start frontend dev server            |

## Documentation

- **Build_Guide.md** — Full application spec: Supabase schema, auth flows, Stripe, pages, API routes, deployment, and step-by-step build order.
- **DESIGN_SYSTEM.md** — Design system derived from the reference: palette, type scale, components, spacing, and accessibility notes.

## View it live

Deploy the backend and frontend to your chosen hosts and add the live URL here so others can try the app.
