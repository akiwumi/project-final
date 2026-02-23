# Connect AFRICA — Web Application Build Guide

## Complete Schema, Structure & Step-by-Step Cursor Instructions

**Confidential — February 2026**
**Stack: Next.js (React) + Supabase + Stripe + WhatsApp Business API + OpenAI**

---

## TABLE OF CONTENTS

1. [Application Overview](#1-application-overview)
2. [Tech Stack & Dependencies](#2-tech-stack--dependencies)
3. [Project Folder Structure](#3-project-folder-structure)
4. [Supabase Database Schema](#4-supabase-database-schema)
5. [Authentication & Disclaimer Flow](#5-authentication--disclaimer-flow)
6. [Stripe Payment Architecture](#6-stripe-payment-architecture)
7. [Page-by-Page Breakdown](#7-page-by-page-breakdown)
8. [Step-by-Step Cursor Build Order](#8-step-by-step-cursor-build-order)
9. [API Routes & Edge Functions](#9-api-routes--edge-functions)
10. [Admin Panel](#10-admin-panel)
11. [AI Integration](#11-ai-integration)
12. [WhatsApp Business API Integration](#12-whatsapp-business-api-integration)
13. [Deployment & Environment Variables](#13-deployment--environment-variables)

---

## 1. APPLICATION OVERVIEW

Connect AFRICA is a LinkedIn-style investment platform connecting global investors with African entrepreneurs and verified service providers. The application has three distinct user types, each with unique flows, dashboards, and features.

**Core Value Proposition:** Reduce deal friction and increase trust in cross-border African investments through structured listings, verification workflows, and controlled communication.

**Three User Roles:**
- **Investor** — discovers ventures, filters by country/sector/stage, manages watchlists, requests introductions
- **Entrepreneur** — creates project listings (paid), uploads documents, receives investor interest
- **Service Provider** — subscribes for visibility, captures leads, earns verification badges

---

## 2. TECH STACK & DEPENDENCIES

### Core Framework
```
next@14+              # React framework with App Router
react@18+             # UI library
typescript             # Type safety
tailwindcss@3+        # Utility-first CSS
shadcn/ui             # Component library (built on Radix)
```

### Backend & Database
```
@supabase/supabase-js  # Supabase client
@supabase/ssr          # Supabase server-side rendering helpers
supabase CLI           # Local dev, migrations, edge functions
```

### Payments
```
stripe                 # Stripe Node.js SDK
@stripe/stripe-js      # Stripe browser SDK
@stripe/react-stripe-js # Stripe React components
```

### AI & Messaging
```
openai                 # OpenAI SDK for AI assistant features
whatsapp-business-api  # WhatsApp Business API (or Meta Cloud API)
```

### Utilities
```
zod                    # Schema validation
react-hook-form        # Form management
@tanstack/react-query  # Server state management
framer-motion          # Animations (hero section, transitions)
lucide-react           # Icon library
date-fns               # Date utilities
react-player           # Video player for hero section
sonner                 # Toast notifications
```

---

## 3. PROJECT FOLDER STRUCTURE

```
connect-africa/
├── .env.local                          # Environment variables
├── supabase/
│   ├── migrations/                     # SQL migration files
│   │   ├── 001_create_profiles.sql
│   │   ├── 002_create_ventures.sql
│   │   ├── 003_create_providers.sql
│   │   ├── 004_create_investors.sql
│   │   ├── 005_create_payments.sql
│   │   ├── 006_create_messaging.sql
│   │   ├── 007_create_watchlists.sql
│   │   ├── 008_create_admin.sql
│   │   ├── 009_create_disclaimers.sql
│   │   └── 010_rls_policies.sql
│   ├── functions/                      # Supabase Edge Functions
│   │   ├── stripe-webhook/
│   │   ├── ai-assistant/
│   │   ├── whatsapp-notify/
│   │   └── admin-review/
│   └── seed.sql                        # Seed data
├── public/
│   ├── videos/
│   │   └── hero-video.mp4             # Landing page hero video
│   ├── images/
│   │   ├── logo.svg
│   │   ├── testimonials/
│   │   └── icons/
│   └── documents/
│       ├── disclaimer-investor.pdf
│       ├── disclaimer-entrepreneur.pdf
│       └── disclaimer-provider.pdf
├── src/
│   ├── app/                            # Next.js App Router
│   │   ├── layout.tsx                  # Root layout
│   │   ├── page.tsx                    # Landing page
│   │   ├── globals.css
│   │   │
│   │   ├── (auth)/                     # Auth group
│   │   │   ├── login/page.tsx
│   │   │   ├── register/page.tsx       # Role selection + signup
│   │   │   ├── register/disclaimer/page.tsx  # Disclaimer signing
│   │   │   └── callback/route.ts       # OAuth callback
│   │   │
│   │   ├── (public)/                   # Public pages
│   │   │   ├── about/page.tsx
│   │   │   ├── advice/
│   │   │   │   ├── page.tsx            # Advice hub
│   │   │   │   ├── investors/page.tsx
│   │   │   │   ├── entrepreneurs/page.tsx
│   │   │   │   └── providers/page.tsx
│   │   │   ├── rules/
│   │   │   │   ├── page.tsx            # Rules hub
│   │   │   │   ├── investors/page.tsx
│   │   │   │   ├── entrepreneurs/page.tsx
│   │   │   │   └── providers/page.tsx
│   │   │   └── terms/page.tsx
│   │   │
│   │   ├── (dashboard)/                # Protected dashboard group
│   │   │   ├── layout.tsx              # Dashboard layout with sidebar
│   │   │   ├── feed/page.tsx           # Shared newsfeed
│   │   │   │
│   │   │   ├── investor/               # Investor dashboard
│   │   │   │   ├── page.tsx            # Investor home
│   │   │   │   ├── discover/page.tsx   # Browse ventures
│   │   │   │   ├── watchlist/page.tsx
│   │   │   │   ├── deal-rooms/page.tsx
│   │   │   │   ├── deal-rooms/[id]/page.tsx
│   │   │   │   ├── messages/page.tsx
│   │   │   │   └── settings/page.tsx
│   │   │   │
│   │   │   ├── entrepreneur/           # Entrepreneur dashboard
│   │   │   │   ├── page.tsx            # Entrepreneur home
│   │   │   │   ├── project/new/page.tsx      # Create listing
│   │   │   │   ├── project/[id]/page.tsx     # Edit listing
│   │   │   │   ├── project/[id]/documents/page.tsx
│   │   │   │   ├── interest/page.tsx         # Inbound interest
│   │   │   │   ├── providers/page.tsx        # Browse providers
│   │   │   │   ├── messages/page.tsx
│   │   │   │   └── settings/page.tsx
│   │   │   │
│   │   │   ├── provider/               # Service provider dashboard
│   │   │   │   ├── page.tsx            # Provider home
│   │   │   │   ├── profile/page.tsx    # Edit service profile
│   │   │   │   ├── leads/page.tsx      # Incoming leads
│   │   │   │   ├── analytics/page.tsx
│   │   │   │   ├── subscription/page.tsx
│   │   │   │   ├── messages/page.tsx
│   │   │   │   └── settings/page.tsx
│   │   │   │
│   │   │   └── admin/                  # Admin panel
│   │   │       ├── page.tsx            # Admin dashboard
│   │   │       ├── ventures/page.tsx   # Review submissions
│   │   │       ├── providers/page.tsx  # Provider verification
│   │   │       ├── users/page.tsx
│   │   │       ├── payments/page.tsx
│   │   │       ├── disputes/page.tsx
│   │   │       └── audit-log/page.tsx
│   │   │
│   │   └── api/                        # API routes
│   │       ├── stripe/
│   │       │   ├── checkout/route.ts
│   │       │   ├── webhook/route.ts
│   │       │   ├── portal/route.ts
│   │       │   └── refund/route.ts
│   │       ├── ai/
│   │       │   ├── profile-assist/route.ts
│   │       │   ├── memo-generate/route.ts
│   │       │   └── summarize/route.ts
│   │       └── whatsapp/
│   │           ├── send/route.ts
│   │           └── webhook/route.ts
│   │
│   ├── components/
│   │   ├── ui/                         # shadcn/ui components
│   │   ├── layout/
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── DashboardSidebar.tsx
│   │   │   └── MobileNav.tsx
│   │   ├── landing/
│   │   │   ├── HeroVideo.tsx           # Full-page hero with video
│   │   │   ├── RoleButtons.tsx         # 3 floating role buttons
│   │   │   ├── HowItWorks.tsx          # Steps explanation
│   │   │   ├── Testimonials.tsx        # Testimonials carousel
│   │   │   └── CTASection.tsx
│   │   ├── auth/
│   │   │   ├── LoginForm.tsx
│   │   │   ├── RegisterForm.tsx
│   │   │   ├── RoleSelector.tsx
│   │   │   └── DisclaimerModal.tsx
│   │   ├── investor/
│   │   │   ├── VentureCard.tsx
│   │   │   ├── FilterPanel.tsx
│   │   │   ├── WatchlistButton.tsx
│   │   │   ├── IntroRequestButton.tsx
│   │   │   └── DealRoomView.tsx
│   │   ├── entrepreneur/
│   │   │   ├── ProjectForm.tsx
│   │   │   ├── DocumentChecklist.tsx
│   │   │   ├── MilestoneTracker.tsx
│   │   │   └── InterestCard.tsx
│   │   ├── provider/
│   │   │   ├── ServiceProfileForm.tsx
│   │   │   ├── LeadCard.tsx
│   │   │   ├── SubscriptionManager.tsx
│   │   │   └── VerificationBadge.tsx
│   │   ├── messaging/
│   │   │   ├── MessageThread.tsx
│   │   │   ├── MessageInput.tsx
│   │   │   └── IntroRequest.tsx
│   │   └── shared/
│   │       ├── CountrySelector.tsx
│   │       ├── SectorSelector.tsx
│   │       ├── StageSelector.tsx
│   │       ├── FileUploader.tsx
│   │       ├── RiskBadge.tsx
│   │       └── ActivityFeed.tsx
│   │
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts               # Browser Supabase client
│   │   │   ├── server.ts               # Server Supabase client
│   │   │   ├── admin.ts                # Service role client
│   │   │   └── middleware.ts            # Auth middleware
│   │   ├── stripe/
│   │   │   ├── client.ts
│   │   │   ├── config.ts               # Products & prices
│   │   │   └── helpers.ts
│   │   ├── ai/
│   │   │   └── openai.ts
│   │   ├── whatsapp/
│   │   │   └── client.ts
│   │   └── utils/
│   │       ├── constants.ts            # Countries, sectors, stages
│   │       ├── formatters.ts
│   │       └── validators.ts
│   │
│   ├── hooks/
│   │   ├── useUser.ts
│   │   ├── useRole.ts
│   │   ├── useVentures.ts
│   │   ├── useWatchlist.ts
│   │   ├── useMessages.ts
│   │   └── useSubscription.ts
│   │
│   └── types/
│       ├── database.ts                 # Generated Supabase types
│       ├── stripe.ts
│       └── index.ts
│
├── middleware.ts                        # Next.js middleware (auth guard)
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 4. SUPABASE DATABASE SCHEMA

### 4.1 Core Tables

```sql
-- ============================================================
-- MIGRATION 001: PROFILES (extends Supabase auth.users)
-- ============================================================

-- Enum types
CREATE TYPE user_role AS ENUM ('investor', 'entrepreneur', 'provider', 'admin');
CREATE TYPE user_status AS ENUM ('pending_disclaimer', 'active', 'suspended', 'deactivated');

CREATE TABLE public.profiles (
  id              UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role            user_role NOT NULL,
  status          user_status DEFAULT 'pending_disclaimer',
  full_name       TEXT NOT NULL,
  email           TEXT NOT NULL,
  phone           TEXT,
  avatar_url      TEXT,
  country         TEXT,              -- ISO 3166-1 alpha-2
  city            TEXT,
  bio             TEXT,
  linkedin_url    TEXT,
  whatsapp_optin  BOOLEAN DEFAULT FALSE,
  disclaimer_signed     BOOLEAN DEFAULT FALSE,
  disclaimer_signed_at  TIMESTAMPTZ,
  disclaimer_version    TEXT,         -- tracks which version was signed
  onboarding_completed  BOOLEAN DEFAULT FALSE,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-update timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();


-- ============================================================
-- MIGRATION 002: VENTURES (Entrepreneur projects)
-- ============================================================

CREATE TYPE venture_status AS ENUM (
  'draft', 'submitted', 'under_review', 'approved',
  'rejected', 'suspended', 'archived'
);
CREATE TYPE venture_stage AS ENUM (
  'pre_seed', 'seed', 'series_a', 'series_b',
  'growth', 'bridge', 'other'
);

CREATE TABLE public.ventures (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entrepreneur_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title           TEXT NOT NULL,
  slug            TEXT UNIQUE,
  tagline         TEXT,
  description     TEXT,
  country         TEXT NOT NULL,      -- primary country of operations
  countries       TEXT[],             -- additional countries
  sector          TEXT NOT NULL,
  sub_sector      TEXT,
  stage           venture_stage NOT NULL,
  funding_ask     NUMERIC,            -- amount seeking in EUR
  currency        TEXT DEFAULT 'EUR',
  valuation       NUMERIC,
  revenue_ttm     NUMERIC,            -- trailing twelve months
  team_size       INTEGER,
  founded_year    INTEGER,
  website         TEXT,
  pitch_deck_url  TEXT,               -- Supabase Storage path
  logo_url        TEXT,
  milestones      JSONB DEFAULT '[]', -- [{title, date, description}]
  traction_data   JSONB DEFAULT '{}', -- {users, revenue, growth_rate, etc.}
  team_members    JSONB DEFAULT '[]', -- [{name, role, linkedin, bio}]
  risk_signals    JSONB DEFAULT '{}', -- AI-generated or admin-set flags
  status          venture_status DEFAULT 'draft',
  review_notes    TEXT,               -- admin notes (internal)
  rejection_reason TEXT,
  listing_fee_paid BOOLEAN DEFAULT FALSE,
  listing_payment_id TEXT,            -- Stripe payment intent ID
  approved_at     TIMESTAMPTZ,
  approved_by     UUID REFERENCES profiles(id),
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_ventures_status ON ventures(status);
CREATE INDEX idx_ventures_country ON ventures(country);
CREATE INDEX idx_ventures_sector ON ventures(sector);
CREATE INDEX idx_ventures_stage ON ventures(stage);

CREATE TRIGGER ventures_updated_at
  BEFORE UPDATE ON ventures
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();


-- ============================================================
-- MIGRATION 003: VENTURE DOCUMENTS
-- ============================================================

CREATE TYPE document_type AS ENUM (
  'pitch_deck', 'financials', 'cap_table', 'legal_docs',
  'business_plan', 'due_diligence', 'team_cv', 'other'
);

CREATE TABLE public.venture_documents (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  venture_id      UUID NOT NULL REFERENCES ventures(id) ON DELETE CASCADE,
  uploaded_by     UUID NOT NULL REFERENCES profiles(id),
  doc_type        document_type NOT NULL,
  file_name       TEXT NOT NULL,
  file_path       TEXT NOT NULL,       -- Supabase Storage path
  file_size       BIGINT,
  mime_type       TEXT,
  is_public       BOOLEAN DEFAULT FALSE, -- visible to all investors or only in deal room
  created_at      TIMESTAMPTZ DEFAULT NOW()
);


-- ============================================================
-- MIGRATION 004: INVESTOR PROFILES
-- ============================================================

CREATE TYPE investor_type AS ENUM (
  'angel', 'vc', 'pe', 'family_office', 'impact',
  'diaspora', 'institutional', 'corporate', 'other'
);

CREATE TABLE public.investor_profiles (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID UNIQUE NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  investor_type   investor_type,
  firm_name       TEXT,
  thesis          TEXT,                -- investment thesis
  ticket_min      NUMERIC,             -- minimum ticket size EUR
  ticket_max      NUMERIC,
  preferred_countries  TEXT[],         -- ISO codes
  preferred_sectors    TEXT[],
  preferred_stages     venture_stage[],
  portfolio_size  INTEGER,
  tier            TEXT DEFAULT 'free', -- 'free', 'pro', 'team'
  stripe_customer_id   TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER investor_profiles_updated_at
  BEFORE UPDATE ON investor_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();


-- ============================================================
-- MIGRATION 005: SERVICE PROVIDERS
-- ============================================================

CREATE TYPE provider_category AS ENUM (
  'legal', 'accounting', 'tax', 'audit', 'consulting',
  'logistics', 'real_estate', 'hr', 'marketing',
  'technology', 'insurance', 'other'
);
CREATE TYPE provider_status AS ENUM (
  'pending', 'active', 'suspended', 'expired'
);
CREATE TYPE verification_level AS ENUM (
  'unverified', 'basic', 'verified', 'premium'
);

CREATE TABLE public.service_providers (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID UNIQUE NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  company_name    TEXT NOT NULL,
  category        provider_category NOT NULL,
  sub_categories  TEXT[],
  description     TEXT,
  services_offered JSONB DEFAULT '[]',  -- [{name, description, price_range}]
  countries_covered TEXT[] NOT NULL,
  website         TEXT,
  logo_url        TEXT,
  verification_level verification_level DEFAULT 'unverified',
  verification_notes TEXT,
  verified_at     TIMESTAMPTZ,
  verified_by     UUID REFERENCES profiles(id),
  partner_references JSONB DEFAULT '[]', -- [{name, contact, relationship}]
  pricing_info    TEXT,
  availability    TEXT,
  status          provider_status DEFAULT 'pending',
  subscription_tier TEXT,               -- 'monthly', 'annual'
  stripe_customer_id    TEXT,
  stripe_subscription_id TEXT,
  subscription_expires_at TIMESTAMPTZ,
  lead_count      INTEGER DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_providers_category ON service_providers(category);
CREATE INDEX idx_providers_countries ON service_providers USING GIN(countries_covered);
CREATE INDEX idx_providers_status ON service_providers(status);

CREATE TRIGGER service_providers_updated_at
  BEFORE UPDATE ON service_providers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();


-- ============================================================
-- MIGRATION 006: PAYMENTS & TRANSACTIONS
-- ============================================================

CREATE TYPE payment_type AS ENUM (
  'listing_fee', 'provider_subscription', 'investor_upgrade',
  'refund'
);
CREATE TYPE payment_status AS ENUM (
  'pending', 'completed', 'failed', 'refunded', 'partially_refunded'
);

CREATE TABLE public.payments (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES profiles(id),
  payment_type    payment_type NOT NULL,
  amount          NUMERIC NOT NULL,
  currency        TEXT DEFAULT 'EUR',
  stripe_payment_intent_id  TEXT,
  stripe_checkout_session_id TEXT,
  stripe_subscription_id     TEXT,
  status          payment_status DEFAULT 'pending',
  refund_amount   NUMERIC,
  refund_reason   TEXT,
  metadata        JSONB DEFAULT '{}',   -- flexible extra data
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_payments_user ON payments(user_id);
CREATE INDEX idx_payments_stripe ON payments(stripe_payment_intent_id);

CREATE TRIGGER payments_updated_at
  BEFORE UPDATE ON payments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();


-- ============================================================
-- MIGRATION 007: MESSAGING & INTRO REQUESTS
-- ============================================================

CREATE TYPE intro_status AS ENUM (
  'pending', 'accepted', 'declined', 'expired'
);

CREATE TABLE public.intro_requests (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_user_id    UUID NOT NULL REFERENCES profiles(id),
  to_user_id      UUID NOT NULL REFERENCES profiles(id),
  venture_id      UUID REFERENCES ventures(id),
  message         TEXT,
  status          intro_status DEFAULT 'pending',
  responded_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_intro_from ON intro_requests(from_user_id);
CREATE INDEX idx_intro_to ON intro_requests(to_user_id);

CREATE TABLE public.conversations (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_ids UUID[] NOT NULL,      -- array of user IDs
  venture_id      UUID REFERENCES ventures(id),
  intro_request_id UUID REFERENCES intro_requests(id),
  is_deal_room    BOOLEAN DEFAULT FALSE,
  title           TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.messages (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id       UUID NOT NULL REFERENCES profiles(id),
  content         TEXT NOT NULL,
  attachments     JSONB DEFAULT '[]',   -- [{file_name, file_path, mime_type}]
  read_by         UUID[] DEFAULT '{}',
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_messages_created ON messages(created_at DESC);


-- ============================================================
-- MIGRATION 008: WATCHLISTS & SAVED ITEMS
-- ============================================================

CREATE TABLE public.watchlist_items (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  venture_id      UUID NOT NULL REFERENCES ventures(id) ON DELETE CASCADE,
  notes           TEXT,
  alert_on_update BOOLEAN DEFAULT TRUE,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, venture_id)
);

CREATE TABLE public.saved_providers (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  provider_id     UUID NOT NULL REFERENCES service_providers(id) ON DELETE CASCADE,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, provider_id)
);


-- ============================================================
-- MIGRATION 009: DEAL ROOMS
-- ============================================================

CREATE TABLE public.deal_rooms (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  venture_id      UUID NOT NULL REFERENCES ventures(id),
  created_by      UUID NOT NULL REFERENCES profiles(id),
  title           TEXT NOT NULL,
  member_ids      UUID[] NOT NULL,
  status          TEXT DEFAULT 'active', -- 'active', 'closed', 'archived'
  notes           JSONB DEFAULT '[]',    -- [{user_id, content, timestamp}]
  shared_documents UUID[],               -- references to venture_documents
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);


-- ============================================================
-- MIGRATION 010: DISCLAIMERS & LEGAL
-- ============================================================

CREATE TABLE public.disclaimers (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  version         TEXT NOT NULL UNIQUE,  -- e.g., 'v1.0', 'v1.1'
  role            user_role NOT NULL,     -- different disclaimer per role
  title           TEXT NOT NULL,
  content         TEXT NOT NULL,          -- full legal text (markdown)
  is_active       BOOLEAN DEFAULT TRUE,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.disclaimer_signatures (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  disclaimer_id   UUID NOT NULL REFERENCES disclaimers(id),
  ip_address      INET,
  user_agent      TEXT,
  signature_data  JSONB,                  -- {full_name, agreed: true, timestamp}
  signed_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_signatures_user ON disclaimer_signatures(user_id);


-- ============================================================
-- MIGRATION 011: ADMIN & AUDIT
-- ============================================================

CREATE TYPE audit_action AS ENUM (
  'venture_submitted', 'venture_approved', 'venture_rejected',
  'venture_suspended', 'provider_verified', 'provider_suspended',
  'user_suspended', 'user_activated', 'refund_issued',
  'payment_received', 'intro_sent', 'intro_accepted',
  'intro_declined', 'document_uploaded', 'profile_updated',
  'disclaimer_signed', 'deal_room_created', 'message_sent',
  'admin_action'
);

CREATE TABLE public.audit_log (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id        UUID REFERENCES profiles(id),
  action          audit_action NOT NULL,
  target_type     TEXT,                  -- 'venture', 'user', 'payment', etc.
  target_id       UUID,
  details         JSONB DEFAULT '{}',    -- flexible context
  ip_address      INET,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_audit_actor ON audit_log(actor_id);
CREATE INDEX idx_audit_action ON audit_log(action);
CREATE INDEX idx_audit_target ON audit_log(target_type, target_id);
CREATE INDEX idx_audit_created ON audit_log(created_at DESC);


-- ============================================================
-- MIGRATION 012: NEWSFEED / ACTIVITY
-- ============================================================

CREATE TABLE public.feed_posts (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id       UUID NOT NULL REFERENCES profiles(id),
  content         TEXT NOT NULL,
  post_type       TEXT DEFAULT 'update', -- 'update', 'milestone', 'announcement', 'article'
  venture_id      UUID REFERENCES ventures(id),
  attachments     JSONB DEFAULT '[]',
  visibility      TEXT DEFAULT 'public', -- 'public', 'investors_only', 'private'
  likes_count     INTEGER DEFAULT 0,
  comments_count  INTEGER DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.feed_comments (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id         UUID NOT NULL REFERENCES feed_posts(id) ON DELETE CASCADE,
  author_id       UUID NOT NULL REFERENCES profiles(id),
  content         TEXT NOT NULL,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.feed_likes (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id         UUID NOT NULL REFERENCES feed_posts(id) ON DELETE CASCADE,
  user_id         UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);


-- ============================================================
-- MIGRATION 013: PROVIDER LEADS
-- ============================================================

CREATE TABLE public.provider_leads (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id     UUID NOT NULL REFERENCES service_providers(id) ON DELETE CASCADE,
  from_user_id    UUID NOT NULL REFERENCES profiles(id),
  venture_id      UUID REFERENCES ventures(id),
  message         TEXT,
  status          TEXT DEFAULT 'new',   -- 'new', 'contacted', 'converted', 'closed'
  created_at      TIMESTAMPTZ DEFAULT NOW()
);


-- ============================================================
-- MIGRATION 014: ROW LEVEL SECURITY (RLS)
-- ============================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE ventures ENABLE ROW LEVEL SECURITY;
ALTER TABLE venture_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE investor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE intro_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE watchlist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE deal_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE disclaimers ENABLE ROW LEVEL SECURITY;
ALTER TABLE disclaimer_signatures ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE feed_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE feed_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE feed_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE provider_leads ENABLE ROW LEVEL SECURITY;

-- PROFILES: users can read all active profiles, edit own
CREATE POLICY "Public profiles readable"
  ON profiles FOR SELECT
  USING (status = 'active' OR id = auth.uid());

CREATE POLICY "Users update own profile"
  ON profiles FOR UPDATE
  USING (id = auth.uid());

-- VENTURES: approved ventures public, own ventures always visible
CREATE POLICY "Approved ventures public"
  ON ventures FOR SELECT
  USING (status = 'approved' OR entrepreneur_id = auth.uid());

CREATE POLICY "Entrepreneurs manage own ventures"
  ON ventures FOR ALL
  USING (entrepreneur_id = auth.uid());

-- ADMIN: full access for admin role
CREATE POLICY "Admin full access profiles"
  ON profiles FOR ALL
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- (Additional RLS policies follow same pattern for all tables)
-- Investors can see approved ventures
-- Providers can manage own profiles
-- Messages visible only to conversation participants
-- Audit log admin-only
-- Watchlists are private to the owner
```

### 4.2 Supabase Storage Buckets

```
Buckets to create:
├── avatars/           # Profile photos (public)
├── venture-logos/     # Venture logos (public)
├── venture-docs/      # Pitch decks, financials (private, RLS)
├── provider-logos/    # Provider logos (public)
├── feed-attachments/  # Newsfeed images/files (public)
└── legal-docs/        # Signed disclaimers (private, admin-only)
```

---

## 5. AUTHENTICATION & DISCLAIMER FLOW

### Registration Flow (Critical — All Users Must Sign Disclaimer)

```
1. User lands on /register
2. User selects role: Investor | Entrepreneur | Service Provider
3. User enters: email, password, full name, country
4. Supabase Auth creates account → profile row created via trigger
5. Profile status set to 'pending_disclaimer'
6. Redirect to /register/disclaimer
7. Show role-specific disclaimer (full legal text, scrollable)
8. User must:
   a. Scroll to bottom (or checkbox "I have read the above")
   b. Type full name as electronic signature
   c. Check "I agree to the terms and conditions"
   d. Click "Sign & Continue"
9. Record in disclaimer_signatures table (with IP, user_agent, timestamp)
10. Update profile: disclaimer_signed = true, status = 'active'
11. Redirect to role-specific onboarding or dashboard
```

### Middleware Guard Logic

```typescript
// middleware.ts — enforces disclaimer signing
// If user is logged in but disclaimer_signed = false,
// redirect to /register/disclaimer for ANY protected route
// If user is not logged in, redirect to /login for protected routes
// Admin routes require role = 'admin'
```

---

## 6. STRIPE PAYMENT ARCHITECTURE

### 6.1 Products & Prices

```
Stripe Products:
├── Entrepreneur Listing Fee
│   └── Price: €1,000 one-time (payment_type: 'listing_fee')
│       └── Metadata: { refundable_portion: 800, non_refundable: 200 }
│
├── Service Provider Subscription
│   ├── Monthly: €X/month (payment_type: 'provider_subscription')
│   └── Annual: €Y/year (payment_type: 'provider_subscription')
│
└── Investor Premium
    ├── Pro Tier: €X/month (advanced filters, deal rooms)
    └── Team Tier: €X/month (multi-seat, internal approvals)
```

### 6.2 Payment Flows

**Entrepreneur Listing Payment:**
```
1. Entrepreneur completes project draft
2. Clicks "Submit for Review" → Stripe Checkout (€1,000)
3. Webhook: payment_intent.succeeded
   → Create payment record
   → Update venture: listing_fee_paid = true, status = 'submitted'
   → Log audit event
4. Admin reviews → approve/reject
5. If rejected:
   → Admin triggers partial refund (€800 refundable portion)
   → Platform keeps €200 non-refundable review fee
```

**Provider Subscription:**
```
1. Provider completes profile
2. Selects plan → Stripe Checkout (subscription)
3. Webhook: customer.subscription.created
   → Update provider: subscription_tier, subscription_expires_at
   → Activate provider listing
4. Webhook: customer.subscription.deleted
   → Deactivate provider listing
```

**Investor Upgrade:**
```
1. Investor on free tier → clicks upgrade
2. Stripe Checkout (subscription)
3. Webhook updates investor tier
```

---

## 7. PAGE-BY-PAGE BREAKDOWN

### 7.1 Landing Page (`/` — `src/app/page.tsx`)

```
SECTION 1: HERO (full viewport height)
┌─────────────────────────────────────────────────┐
│                                                   │
│    [Full-screen background video playing]         │
│    (autoplay, muted, loop)                        │
│                                                   │
│    Overlay: semi-transparent dark gradient         │
│                                                   │
│    Center:                                        │
│      CONNECT AFRICA logo (large, white)           │
│      "The trust layer for cross-border            │
│       investment into Africa"                     │
│                                                   │
│    Bottom floating buttons (3 columns):           │
│    ┌────────────┐ ┌────────────┐ ┌────────────┐  │
│    │  INVESTOR   │ │ENTREPRENEUR│ │  SERVICE   │  │
│    │  "Find      │ │ "Get your  │ │  PROVIDER  │  │
│    │  vetted     │ │  venture   │ │ "Connect   │  │
│    │  deals"     │ │  funded"   │ │  with      │  │
│    │             │ │            │ │  clients"  │  │
│    └────────────┘ └────────────┘ └────────────┘  │
│    (Each button links to /register?role=X)        │
└─────────────────────────────────────────────────┘

SECTION 2: HOW IT WORKS (below the fold)
┌─────────────────────────────────────────────────┐
│  "How Connect AFRICA Works"                       │
│                                                   │
│  Three columns (responsive → stacked on mobile):  │
│                                                   │
│  FOR INVESTORS:          FOR ENTREPRENEURS:        │
│  1. Create profile       1. Pay listing fee        │
│  2. Browse ventures      2. Build your profile     │
│  3. Request intros       3. Get reviewed/approved  │
│  4. Enter deal rooms     4. Receive investor       │
│                             interest               │
│                                                   │
│  FOR SERVICE PROVIDERS:                           │
│  1. Subscribe                                     │
│  2. Get verified                                  │
│  3. Receive leads                                 │
│  4. Close deals                                   │
│                                                   │
│  [CTA: "Join the Platform →"]                     │
└─────────────────────────────────────────────────┘

SECTION 3: WHY CONNECT AFRICA
┌─────────────────────────────────────────────────┐
│  Problem → Solution grid                          │
│  "Information asymmetry" → "Standardized data"    │
│  "Trust deficits" → "Paid listings + verification"│
│  "High deal friction" → "Structured workflows"    │
└─────────────────────────────────────────────────┘

SECTION 4: PLATFORM STATS / SOCIAL PROOF
┌─────────────────────────────────────────────────┐
│  Animated counters:                               │
│  "54 African Nations" | "X Ventures" | "X         │
│   Investors" | "X Service Providers"              │
└─────────────────────────────────────────────────┘

SECTION 5: TESTIMONIALS
┌─────────────────────────────────────────────────┐
│  "What Our Users Say"                             │
│                                                   │
│  Carousel of testimonial cards:                   │
│  ┌──────────────────────┐                         │
│  │ Photo | Name | Role  │                         │
│  │ "Quote text..."      │                         │
│  │ Company / Country    │                         │
│  └──────────────────────┘                         │
│                                                   │
│  Categories: Investor | Entrepreneur | Provider   │
│  (filter tabs above carousel)                     │
└─────────────────────────────────────────────────┘

SECTION 6: CTA + FOOTER
┌─────────────────────────────────────────────────┐
│  "Ready to connect?"                              │
│  [Get Started] [Learn More]                       │
│                                                   │
│  Footer: Links to Advice, Rules, Terms, About     │
└─────────────────────────────────────────────────┘
```

### 7.2 Advice Pages (`/advice/*`)

Each role gets a dedicated advice page with practical guidance:

**`/advice/investors`** — Advice for Investors
- Understanding African markets: cultural context, relationship-first reality
- Due diligence checklist for cross-border deals
- Risk assessment framework (what "good" looks like per country/sector)
- Common failure patterns and how to avoid them
- Working with local service providers
- Timeline expectations vs. Western norms
- Post-investment governance best practices

**`/advice/entrepreneurs`** — Advice for Entrepreneurs
- What investors actually look for (structured data, clear metrics)
- How to build an investor-ready profile
- Document preparation checklist by stage
- Pricing your round and setting realistic valuations
- Communicating traction effectively
- Working with service providers for compliance
- Managing investor relationships post-intro

**`/advice/providers`** — Advice for Service Providers
- How to build a compelling provider profile
- Verification process and how to earn premium badges
- Lead conversion best practices
- Pricing transparency expectations
- Country coverage and specialization strategy
- Building reputation through platform references

### 7.3 Rules Pages (`/rules/*`)

**`/rules` — Platform Rules Hub** (links to all three below)

**`/rules/investors`** — Investor Rules
- Account verification requirements
- Communication guidelines (no spam, no unsolicited bulk messages)
- Intro request limits and etiquette
- Confidentiality obligations for deal room documents
- Prohibited activities (front-running, sharing deal info externally)
- Dispute resolution process
- Account suspension/termination conditions

**`/rules/entrepreneurs`** — Entrepreneur Rules
- Listing accuracy and truthfulness requirements
- Mandatory disclosures (conflicts, legal issues, material risks)
- Document authenticity standards
- Response time expectations for investor inquiries
- Prohibited listings (illegal activities, sanctions violations)
- Refund policy for rejected listings
- Profile maintenance and update obligations

**`/rules/providers`** — Service Provider Rules
- Verification truthfulness requirements
- Service delivery standards
- Pricing transparency obligations
- Client confidentiality requirements
- Conflict of interest disclosure
- Subscription terms and cancellation
- Lead response time expectations
- Grounds for badge revocation

### 7.4 Dashboard Pages (Protected)

**Shared Newsfeed** — `/feed`
- Posts from ventures (milestones, updates)
- Platform announcements
- Provider highlights
- Like/comment functionality

**Investor Dashboard** — `/investor`
- Overview: recent activity, watchlist updates, pending intros
- Discover: filterable venture grid (country, sector, stage, risk)
- Watchlist: saved ventures with alert preferences
- Deal Rooms: active rooms with document tracking
- Messages: conversations from accepted intros

**Entrepreneur Dashboard** — `/entrepreneur`
- Overview: listing status, inbound interest count, profile completeness
- Project management: create/edit project, upload documents
- Interest: inbound intro requests (accept/decline)
- Providers: browse vetted service providers
- Messages: conversations with investors

**Provider Dashboard** — `/provider`
- Overview: lead count, subscription status, analytics
- Profile: edit services, coverage, pricing
- Leads: incoming lead management
- Analytics: views, clicks, conversion rates
- Subscription: manage plan, billing

---

## 8. STEP-BY-STEP CURSOR BUILD ORDER

### PHASE 1: Project Scaffolding (Steps 1–5)

**Step 1: Initialize Next.js Project**
```
Cursor prompt: "Create a new Next.js 14 project with TypeScript, Tailwind CSS, 
App Router, and src/ directory. Install shadcn/ui with the default config. 
Add Supabase client packages (@supabase/supabase-js, @supabase/ssr). 
Add Stripe packages (stripe, @stripe/stripe-js, @stripe/react-stripe-js).
Add react-player, framer-motion, zod, react-hook-form, @tanstack/react-query,
lucide-react, date-fns, sonner."
```

**Step 2: Set Up Environment Variables**
```
Cursor prompt: "Create .env.local with placeholders for:
NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, 
SUPABASE_SERVICE_ROLE_KEY, NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, OPENAI_API_KEY, 
WHATSAPP_API_TOKEN, NEXT_PUBLIC_APP_URL.
Create a lib/env.ts that validates these with zod."
```

**Step 3: Initialize Supabase**
```
Cursor prompt: "Set up Supabase clients in src/lib/supabase/:
- client.ts: browser client using createBrowserClient
- server.ts: server client using createServerClient with cookies
- admin.ts: service role client for admin operations
- middleware.ts: auth helper for Next.js middleware
Create the Next.js middleware.ts at root that checks auth status and
redirects unauthenticated users from protected routes."
```

**Step 4: Run Database Migrations**
```
Cursor prompt: "Create all Supabase SQL migration files in supabase/migrations/ 
using the complete database schema provided. Include all tables, types, indexes, 
triggers, and RLS policies. Create a seed.sql with:
- 3 disclaimer records (one per role)
- An admin user profile
- Sample sector/country reference data."
```

**Step 5: Generate TypeScript Types**
```
Cursor prompt: "Run supabase gen types typescript to generate database types.
Create src/types/database.ts with the generated types. Create src/types/index.ts 
with application-level types extending the database types."
```

### PHASE 2: Layout & Shared Components (Steps 6–9)

**Step 6: Create Root Layout & Global Styles**
```
Cursor prompt: "Create the root layout.tsx with:
- Supabase auth provider
- React Query provider
- Sonner toaster
- Global metadata (title, description, OG tags for Connect AFRICA)
Set up globals.css with Tailwind config, custom CSS variables for brand colors 
(Africa-inspired: gold #D4A843, deep green #1B5E20, warm brown #5D4037, 
sky blue #0277BD). Configure tailwind.config.ts with these custom colors."
```

**Step 7: Build Navbar & Footer**
```
Cursor prompt: "Create components/layout/Navbar.tsx:
- Logo left, nav links center, auth buttons right
- Mobile hamburger menu
- Conditional rendering based on auth state (Login/Register vs Dashboard link)
- Role-aware dashboard link

Create components/layout/Footer.tsx:
- Site links: About, Advice, Rules, Terms
- Social links
- Copyright
- Contact info placeholder"
```

**Step 8: Build Dashboard Layout**
```
Cursor prompt: "Create the (dashboard)/layout.tsx with:
- Left sidebar navigation (collapsible on mobile)
- Role-aware menu items (different nav for investor/entrepreneur/provider/admin)
- Top bar with user avatar, notifications bell, role badge
- Main content area
Use shadcn/ui Sheet for mobile sidebar."
```

**Step 9: Build Shared Components**
```
Cursor prompt: "Create these shared components:
- CountrySelector: dropdown of 54 African nations with flags
- SectorSelector: multi-select for investment sectors
- StageSelector: venture stage picker
- FileUploader: drag-and-drop with Supabase Storage integration
- RiskBadge: colored badge showing risk level
- ActivityFeed: reusable activity stream component
Use shadcn/ui Select, MultiSelect, and Badge components."
```

### PHASE 3: Landing Page (Steps 10–13)

**Step 10: Build Hero Video Section**
```
Cursor prompt: "Create components/landing/HeroVideo.tsx:
- Full viewport height (100vh) container
- Background video using react-player or HTML5 <video> tag 
  (autoplay, muted, loop, playsInline, object-fit: cover)
- Dark gradient overlay (linear-gradient from transparent to rgba(0,0,0,0.7))
- Centered content: large logo, tagline text with text-shadow
- Three floating CTA buttons at the bottom of the frame:
  - 'I'm an Investor' (gold accent)
  - 'I'm an Entrepreneur' (green accent)  
  - 'I'm a Service Provider' (blue accent)
- Each button links to /register?role=investor|entrepreneur|provider
- Buttons should have hover animations (scale up, glow effect)
- Mobile responsive: buttons stack vertically on small screens
- Scroll-down indicator arrow animation at very bottom"
```

**Step 11: Build How It Works Section**
```
Cursor prompt: "Create components/landing/HowItWorks.tsx:
- Section with title 'How Connect AFRICA Works'
- Three columns (responsive grid), one per user type
- Each column has an icon, role title, and numbered steps
- Animate on scroll using framer-motion (fade up)
- Include connecting lines/arrows between steps
- CTA button at bottom: 'Get Started'"
```

**Step 12: Build Testimonials Section**
```
Cursor prompt: "Create components/landing/Testimonials.tsx:
- Section title 'What Our Users Say'
- Filter tabs: All | Investors | Entrepreneurs | Providers
- Horizontal carousel of testimonial cards
- Each card: avatar, name, role, company, country flag, quote text
- Auto-scroll with pause on hover
- Mobile: single card view with swipe
- Use placeholder testimonial data for now"
```

**Step 13: Assemble Landing Page**
```
Cursor prompt: "Assemble src/app/page.tsx with all landing sections:
1. HeroVideo (full viewport)
2. HowItWorks (scroll into view)
3. Problem/Solution section (info grid)
4. Platform stats (animated counters)
5. Testimonials (carousel)
6. Final CTA section
7. Footer
Ensure smooth scrolling between sections.
Add the Navbar at top (transparent on hero, solid on scroll)."
```

### PHASE 4: Authentication & Disclaimer (Steps 14–17)

**Step 14: Build Registration Flow**
```
Cursor prompt: "Create the registration page at (auth)/register/page.tsx:
- Step 1: Role selection with three large cards (Investor/Entrepreneur/Provider)
  Read role from URL param if present (?role=investor)
- Step 2: Form fields — email, password, confirm password, full name, country
- Use react-hook-form with zod validation
- On submit: supabase.auth.signUp(), create profile with role and 
  status='pending_disclaimer'
- Redirect to /register/disclaimer"
```

**Step 15: Build Disclaimer Page**
```
Cursor prompt: "Create (auth)/register/disclaimer/page.tsx:
- Fetch the active disclaimer for the user's role from disclaimers table
- Display full legal text in a scrollable container (max-height with overflow)
- Track scroll position — enable 'I have read' checkbox only when scrolled to bottom
- Form at bottom:
  a. Checkbox: 'I have read and understood the above disclaimer'
  b. Text input: 'Type your full name as electronic signature'
  c. Checkbox: 'I agree to the platform Terms of Service and Rules'
  d. Submit button: 'Sign & Continue'
- On submit:
  a. Insert into disclaimer_signatures (user_id, disclaimer_id, IP, user_agent)
  b. Update profile: disclaimer_signed=true, disclaimer_signed_at=now(), status='active'
  c. Insert audit_log entry
  d. Redirect to role-specific dashboard"
```

**Step 16: Build Login Page**
```
Cursor prompt: "Create (auth)/login/page.tsx:
- Email + password form with zod validation
- 'Remember me' checkbox
- 'Forgot password' link
- Social login buttons (Google, LinkedIn) via Supabase OAuth
- On success: check if disclaimer_signed. If not, redirect to /register/disclaimer.
  If yes, redirect to role-based dashboard."
```

**Step 17: Auth Middleware**
```
Cursor prompt: "Update middleware.ts to handle:
- Unauthenticated users → redirect to /login for /dashboard/* routes
- Authenticated but disclaimer not signed → redirect to /register/disclaimer
- Role-based route protection:
  /investor/* requires role='investor'
  /entrepreneur/* requires role='entrepreneur'  
  /provider/* requires role='provider'
  /admin/* requires role='admin'
- Public routes (/,/about,/advice/*,/rules/*,/terms) always accessible"
```

### PHASE 5: Stripe Integration (Steps 18–21)

**Step 18: Set Up Stripe Products**
```
Cursor prompt: "Create src/lib/stripe/config.ts defining:
- LISTING_FEE_PRICE_ID (€1,000 one-time)
- PROVIDER_MONTHLY_PRICE_ID
- PROVIDER_ANNUAL_PRICE_ID
- INVESTOR_PRO_PRICE_ID
- INVESTOR_TEAM_PRICE_ID

Create API route api/stripe/checkout/route.ts:
- Accept: price_id, payment_type, metadata (venture_id, etc.)
- Create Stripe Checkout Session with success/cancel URLs
- Return session URL"
```

**Step 19: Stripe Webhook Handler**
```
Cursor prompt: "Create api/stripe/webhook/route.ts:
- Verify webhook signature
- Handle events:
  checkout.session.completed → create payment record, update venture/provider status
  customer.subscription.created → activate provider/investor subscription
  customer.subscription.updated → update tier
  customer.subscription.deleted → deactivate subscription
  payment_intent.succeeded → log payment
  charge.refunded → update payment, log refund
- Use Supabase admin client for database writes
- Log all events to audit_log"
```

**Step 20: Refund API**
```
Cursor prompt: "Create api/stripe/refund/route.ts:
- Admin-only endpoint
- Accept: payment_id, amount (partial refund for rejected listings)
- Create Stripe refund
- Update payment record
- Update venture status if applicable
- Log to audit_log"
```

**Step 21: Billing Portal**
```
Cursor prompt: "Create api/stripe/portal/route.ts:
- Create Stripe Billing Portal session for subscription management
- Providers and investors can manage their subscriptions
- Return portal URL for redirect"
```

### PHASE 6: Entrepreneur Features (Steps 22–26)

**Step 22: Project Creation Form**
```
Cursor prompt: "Create entrepreneur/project/new/page.tsx with a multi-step form:
Step 1: Basic Info (title, tagline, country, sector, stage)
Step 2: Details (description, funding ask, valuation, team size, website)
Step 3: Team (add team members with name, role, LinkedIn, bio)
Step 4: Traction (revenue, users, growth metrics — dynamic JSONB fields)
Step 5: Documents (upload pitch deck, financials via FileUploader)
Step 6: Review & Pay (summary of all info, then Stripe checkout for €1,000)
Save as draft between steps. Use react-hook-form with zod schemas per step."
```

**Step 23: AI Profile Assistant**
```
Cursor prompt: "Create api/ai/profile-assist/route.ts:
- Accept: partial venture data
- Use OpenAI to:
  a. Suggest improvements to description/tagline
  b. Flag missing critical information
  c. Generate a structured summary
  d. Score 'investor readiness' (1-10 with explanations)
- Return suggestions as structured JSON
Create a 'Get AI Help' button in the project form that triggers this."
```

**Step 24: Document Checklist**
```
Cursor prompt: "Create components/entrepreneur/DocumentChecklist.tsx:
- Show required documents by venture stage:
  Pre-seed: pitch deck, team CVs
  Seed: + financials, business plan
  Series A: + cap table, legal docs, due diligence pack
- Checkmarks for uploaded documents
- Upload buttons for missing documents
- Progress bar showing completion percentage"
```

**Step 25: Inbound Interest Management**
```
Cursor prompt: "Create entrepreneur/interest/page.tsx:
- List of pending intro requests from investors
- Each card shows: investor name, firm, thesis, ticket size, message
- Accept/Decline buttons
- On accept: create conversation, enable messaging
- On decline: update intro_request status
- Filter by status (pending/accepted/declined)"
```

**Step 26: Entrepreneur Dashboard Home**
```
Cursor prompt: "Create entrepreneur/page.tsx dashboard:
- Listing status card (draft/submitted/under review/approved)
- Profile completeness progress bar
- Recent activity feed
- Pending intro request count with link
- Quick links: Edit Project, View Documents, Browse Providers
- If no listing exists: prominent 'Create Your First Listing' CTA"
```

### PHASE 7: Investor Features (Steps 27–32)

**Step 27: Venture Discovery Page**
```
Cursor prompt: "Create investor/discover/page.tsx:
- Filter sidebar (or top bar on mobile):
  Country (multi-select, 54 African nations)
  Sector (multi-select)
  Stage (multi-select)
  Funding range (min/max slider)
  Risk markers (checkboxes)
  Sort by: newest, funding amount, traction
- Grid of VentureCard components
- Each card: logo, title, country flag, sector badge, stage badge, 
  tagline, funding ask, key traction metric
- Click card → venture detail page
- Watchlist toggle (heart icon) on each card
- Pagination or infinite scroll
- Only shows approved ventures"
```

**Step 28: Venture Detail Page**
```
Cursor prompt: "Create a dynamic venture detail page:
- Hero: logo, title, tagline, country, sector, stage badges
- Tabs: Overview | Team | Traction | Documents
- Overview: description, funding ask, valuation, milestones
- Team: team member cards with LinkedIn links
- Traction: metrics displayed as charts/graphs
- Documents: list of public documents (download links)
- Sidebar: 'Request Intro' button, Watchlist button, AI Summary button
- Request Intro opens a modal with message field → creates intro_request"
```

**Step 29: Watchlist Page**
```
Cursor prompt: "Create investor/watchlist/page.tsx:
- Grid of saved ventures from watchlist_items table
- Toggle alerts per venture
- Notes field per venture (editable inline)
- Remove from watchlist button
- Show last update date per venture
- Alert badge if venture has new updates since last viewed"
```

**Step 30: Deal Rooms**
```
Cursor prompt: "Create investor/deal-rooms/page.tsx:
- List of active deal rooms the investor is part of
- Each room card: venture name, member count, last activity date
- Click → deal-rooms/[id]/page.tsx

Create investor/deal-rooms/[id]/page.tsx:
- Header: venture info, room members
- Tabs: Documents | Notes | Messages | Activity
- Documents: shared document list with access tracking
- Notes: collaborative notes (user + timestamp)
- Messages: real-time conversation thread
- Activity: audit trail of room actions"
```

**Step 31: AI Investor Memo**
```
Cursor prompt: "Create api/ai/memo-generate/route.ts:
- Accept: venture_id
- Fetch venture data, traction, team, documents
- Use OpenAI to generate a structured investment memo:
  Executive Summary, Market Analysis, Team Assessment,
  Financial Overview, Risk Factors, Open Questions
- Return as structured markdown
- Add 'Generate Memo' button on venture detail page"
```

**Step 32: Investor Dashboard Home**
```
Cursor prompt: "Create investor/page.tsx dashboard:
- Recent venture matches (based on thesis preferences)
- Watchlist updates (new activity on saved ventures)
- Pending intro requests (sent, waiting for response)
- Active deal rooms with recent activity
- Quick stats: ventures viewed, intros sent, response rate
- Upgrade CTA if on free tier"
```

### PHASE 8: Service Provider Features (Steps 33–36)

**Step 33: Provider Profile Builder**
```
Cursor prompt: "Create provider/profile/page.tsx:
- Form: company name, category, sub-categories, description
- Services offered (dynamic list: name, description, price range)
- Countries covered (multi-select of African nations)
- Contact info, website
- Logo upload
- Partner references (name, contact, relationship)
- Save draft / Publish buttons
- Verification badge display (if verified)"
```

**Step 34: Lead Management**
```
Cursor prompt: "Create provider/leads/page.tsx:
- Incoming leads from provider_leads table
- Each lead card: from user, venture (if applicable), message, date
- Status workflow: New → Contacted → Converted → Closed
- Quick response button (opens messaging)
- Filter by status
- Lead count stats"
```

**Step 35: Provider Subscription Management**
```
Cursor prompt: "Create provider/subscription/page.tsx:
- Current plan display
- Plan comparison (monthly vs annual, features per tier)
- Upgrade/downgrade buttons → Stripe Checkout
- Manage billing → Stripe Portal
- Subscription status: active/expiring/expired
- Renewal date display"
```

**Step 36: Provider Analytics**
```
Cursor prompt: "Create provider/analytics/page.tsx:
- Profile views over time (chart)
- Lead volume by month (chart)
- Conversion rate (leads → contacts)
- Top referring ventures/users
- Country breakdown of leads
- Use recharts or similar for visualizations"
```

### PHASE 9: Messaging & Notifications (Steps 37–39)

**Step 37: Messaging System**
```
Cursor prompt: "Build the messaging system:
- components/messaging/MessageThread.tsx: 
  Real-time message thread using Supabase Realtime subscriptions
  Display messages with sender avatar, name, timestamp
  File attachment support
  Read receipts (read_by array)
  
- components/messaging/MessageInput.tsx:
  Text input with send button
  File attachment button
  Emoji picker (optional)
  
- Shared messages page template used by all three role dashboards
- Conversation list sidebar showing all active conversations
- Unread message badges
- Supabase Realtime for live updates"
```

**Step 38: Intro Request Flow**
```
Cursor prompt: "Create components/messaging/IntroRequest.tsx:
- Modal for sending intro request:
  To: [user name]
  Regarding: [venture name] (auto-filled if from venture page)
  Message: text area (required, min 50 chars)
  Submit button
- Validation: check investor hasn't already sent request to same venture
- Rate limiting: max 10 intro requests per week for free tier
- On submit: create intro_request record, notify recipient"
```

**Step 39: WhatsApp Notifications**
```
Cursor prompt: "Create api/whatsapp/send/route.ts:
- Accept: user_id, template, variables
- Check user whatsapp_optin = true
- Send via WhatsApp Business API (Meta Cloud API)
- Templates for:
  - New intro request received
  - Intro request accepted
  - Venture status update (approved/rejected)
  - New lead for provider
  - Watchlist venture updated
- Webhook handler for delivery receipts"
```

### PHASE 10: Admin Panel (Steps 40–43)

**Step 40: Admin Dashboard**
```
Cursor prompt: "Create admin/page.tsx:
- Overview stats: total users, ventures pending review, active providers,
  revenue this month, pending disputes
- Recent activity feed from audit_log
- Quick links to review queues
- Charts: signups over time, revenue over time, conversion funnel"
```

**Step 41: Venture Review Queue**
```
Cursor prompt: "Create admin/ventures/page.tsx:
- Table of submitted ventures awaiting review
- Columns: title, entrepreneur, country, sector, stage, submitted date, fee paid
- Click row → detail view with full venture info
- Action buttons: Approve, Reject (with reason), Request Changes
- On approve: update status, notify entrepreneur, log audit
- On reject: update status, trigger partial refund, notify, log audit
- Filter by status: submitted, under_review, approved, rejected"
```

**Step 42: Provider Verification**
```
Cursor prompt: "Create admin/providers/page.tsx:
- Table of providers pending verification
- Detail view: company info, references, subscription status
- Verification levels: basic → verified → premium
- Action: Set verification level, add notes
- Badge management"
```

**Step 43: Audit Log Viewer**
```
Cursor prompt: "Create admin/audit-log/page.tsx:
- Searchable, filterable table of all audit events
- Columns: timestamp, actor, action, target, details
- Filter by: action type, actor, date range
- Click row for full detail view
- Export to CSV"
```

### PHASE 11: Advice & Rules Pages (Steps 44–46)

**Step 44: Advice Pages**
```
Cursor prompt: "Create the advice section:
- /advice/page.tsx: Hub page with three cards linking to role-specific advice
- /advice/investors/page.tsx: Long-form content page with:
  Sections: Understanding African Markets, Due Diligence Checklist,
  Risk Assessment, Common Failure Patterns, Working with Local Partners,
  Timeline Expectations, Post-Investment Governance
  Use accordions for each section, rich formatting, callout boxes
  
- /advice/entrepreneurs/page.tsx: Sections on what investors want,
  profile building, document prep, pricing rounds, communicating traction
  
- /advice/providers/page.tsx: Sections on profile building, verification,
  lead conversion, pricing transparency, reputation building
  
All pages should be content-rich with icons, highlight boxes, and practical tips.
Include a sidebar table of contents for easy navigation."
```

**Step 45: Rules Pages**
```
Cursor prompt: "Create the rules section:
- /rules/page.tsx: Hub page explaining platform governance, links to role rules
- /rules/investors/page.tsx: Full rules document with numbered sections:
  Account Requirements, Communication Guidelines, Confidentiality, 
  Prohibited Activities, Dispute Resolution, Termination
  
- /rules/entrepreneurs/page.tsx: Listing Accuracy, Mandatory Disclosures,
  Document Standards, Response Obligations, Prohibited Listings, 
  Refund Policy, Profile Maintenance
  
- /rules/providers/page.tsx: Verification Standards, Service Delivery,
  Pricing Transparency, Confidentiality, Conflict Disclosure,
  Subscription Terms, Badge Revocation

All rules pages use numbered section format with clear headings.
Include 'Last updated' date at top.
Link to these from the disclaimer during signup."
```

**Step 46: Terms of Service Page**
```
Cursor prompt: "Create /terms/page.tsx:
- Full Terms of Service document
- Sections: Acceptance, Definitions, Account Terms, User Responsibilities,
  Payment Terms, Intellectual Property, Limitation of Liability,
  Dispute Resolution, Governing Law, Changes to Terms
- 'Last updated' date
- Print-friendly layout"
```

### PHASE 12: AI Features (Steps 47–48)

**Step 47: AI Summarization**
```
Cursor prompt: "Create api/ai/summarize/route.ts:
- Accept: text content (venture description, document content)
- Use OpenAI to generate concise summaries
- Use for: venture summaries on cards, document summaries, 
  risk flag explanations
- Rate limit per user"
```

**Step 48: AI-Assisted Profile Drafting**
```
Cursor prompt: "Integrate AI assistance into project and provider forms:
- 'Help me write this' button next to description fields
- AI suggests improvements based on context
- AI generates tagline options from description
- AI checks for completeness and clarity
- Show suggestions as inline editable recommendations"
```

### PHASE 13: Testing & Polish (Steps 49–52)

**Step 49: Responsive Design Pass**
```
Cursor prompt: "Review all pages and components for mobile responsiveness:
- Test at 320px, 375px, 768px, 1024px, 1440px breakpoints
- Ensure hero video plays correctly on mobile (fallback to poster image)
- Dashboard sidebar collapses to bottom nav on mobile
- All forms are usable on mobile
- Tables convert to card layouts on small screens
- Touch-friendly button sizes (min 44px tap targets)"
```

**Step 50: Loading States & Error Handling**
```
Cursor prompt: "Add loading states and error handling throughout:
- Skeleton loaders for venture cards, tables, and feeds
- Error boundaries for each page section
- Toast notifications for all user actions (success/error)
- Empty states with helpful messages and CTAs
- Form validation with inline error messages
- API error handling with user-friendly messages"
```

**Step 51: SEO & Metadata**
```
Cursor prompt: "Add SEO optimization:
- Dynamic metadata for each page (title, description, OG image)
- Structured data (JSON-LD) for organization
- Sitemap generation
- robots.txt
- Social sharing cards for venture pages"
```

**Step 52: Performance Optimization**
```
Cursor prompt: "Optimize performance:
- Image optimization with Next.js Image component
- Lazy loading for below-fold content
- Video optimization (compressed hero video, poster image fallback)
- Database query optimization (proper indexes, select specific columns)
- API response caching where appropriate
- Bundle size analysis and code splitting"
```

---

## 9. API ROUTES & EDGE FUNCTIONS

### API Route Summary

| Route | Method | Auth | Purpose |
|-------|--------|------|---------|
| `/api/stripe/checkout` | POST | Yes | Create Stripe Checkout session |
| `/api/stripe/webhook` | POST | No (verified) | Handle Stripe webhooks |
| `/api/stripe/portal` | POST | Yes | Create billing portal session |
| `/api/stripe/refund` | POST | Admin | Issue refund |
| `/api/ai/profile-assist` | POST | Yes | AI venture profile help |
| `/api/ai/memo-generate` | POST | Investor | Generate investment memo |
| `/api/ai/summarize` | POST | Yes | Summarize text/documents |
| `/api/whatsapp/send` | POST | Server | Send WhatsApp notification |
| `/api/whatsapp/webhook` | POST | No (verified) | Receive delivery receipts |

### Supabase Edge Functions

| Function | Trigger | Purpose |
|----------|---------|---------|
| `on-user-created` | Auth hook | Create profile row |
| `daily-digest` | Cron | Send watchlist digests |
| `subscription-check` | Cron | Deactivate expired subscriptions |
| `intro-expiry` | Cron | Expire unanswered intros after 14 days |

---

## 10. ADMIN PANEL

### Admin Hierarchy

```
Super Admin → can manage other admins, access all features
Admin → can review ventures, verify providers, manage users, issue refunds
Moderator → can review ventures, flag content (future role)
```

### Admin Capabilities

- Review and approve/reject venture submissions
- Verify service providers and assign badge levels
- Suspend/activate user accounts
- Issue full or partial refunds
- View complete audit trail
- Manage disclaimers (create new versions)
- View platform analytics and revenue
- Manage feed content (pin announcements, remove posts)
- Handle disputes between users

---

## 11. AI INTEGRATION

### OpenAI Integration Points

1. **Venture Profile Assistant** — helps entrepreneurs write clear, investor-ready profiles
2. **Investment Memo Generator** — creates structured memos from venture data for investors
3. **Document Summarization** — summarizes uploaded documents (pitch decks, financials)
4. **Risk Flag Explanations** — explains risk signals in context
5. **Local-Context Prompts** — provides country/sector-specific guidance (what "good" looks like)
6. **Profile Completeness Scoring** — AI-powered readiness assessment

### Prompt Engineering Notes
- System prompts should include African market context
- Include country-specific knowledge where available
- Always caveat AI outputs: "AI-generated — review for accuracy"
- Rate limit: 20 AI requests/day for free tier, unlimited for paid

---

## 12. WHATSAPP BUSINESS API INTEGRATION

### Notification Templates (pre-approved by Meta)

1. `intro_request_received` — "You have a new intro request from {investor_name} regarding {venture_name}"
2. `intro_accepted` — "Great news! {entrepreneur_name} accepted your intro request for {venture_name}"
3. `venture_approved` — "Your venture {venture_name} has been approved and is now live"
4. `venture_rejected` — "Your venture {venture_name} requires changes. Check your dashboard."
5. `new_lead` — "New lead for {provider_name}: {user_name} is interested in your services"
6. `watchlist_update` — "{venture_name} has posted new updates"

### Opt-in Flow
- During registration/onboarding: "Receive updates via WhatsApp?"
- Phone number collection with country code
- Double opt-in: confirm via WhatsApp message
- Settings page to enable/disable per notification type

---

## 13. DEPLOYMENT & ENVIRONMENT VARIABLES

### Required Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_LISTING_FEE_PRICE_ID=price_...
STRIPE_PROVIDER_MONTHLY_PRICE_ID=price_...
STRIPE_PROVIDER_ANNUAL_PRICE_ID=price_...
STRIPE_INVESTOR_PRO_PRICE_ID=price_...
STRIPE_INVESTOR_TEAM_PRICE_ID=price_...

# OpenAI
OPENAI_API_KEY=sk-...

# WhatsApp Business API
WHATSAPP_API_TOKEN=...
WHATSAPP_PHONE_NUMBER_ID=...
WHATSAPP_BUSINESS_ACCOUNT_ID=...

# App
NEXT_PUBLIC_APP_URL=https://connectafrica.com
```

### Deployment Checklist

1. Deploy Supabase project (run all migrations)
2. Configure Supabase Storage buckets and policies
3. Set up Stripe products, prices, and webhook endpoint
4. Register WhatsApp Business API templates with Meta
5. Deploy Next.js to Vercel (or similar)
6. Configure custom domain and SSL
7. Set all environment variables in production
8. Test end-to-end: registration → disclaimer → payment → listing → review
9. Seed initial disclaimer content
10. Create admin account

---

## APPENDIX: DATA CONSTANTS

### African Countries (54)
```typescript
export const AFRICAN_COUNTRIES = [
  { code: 'DZ', name: 'Algeria' }, { code: 'AO', name: 'Angola' },
  { code: 'BJ', name: 'Benin' }, { code: 'BW', name: 'Botswana' },
  { code: 'BF', name: 'Burkina Faso' }, { code: 'BI', name: 'Burundi' },
  { code: 'CV', name: 'Cabo Verde' }, { code: 'CM', name: 'Cameroon' },
  { code: 'CF', name: 'Central African Republic' }, { code: 'TD', name: 'Chad' },
  { code: 'KM', name: 'Comoros' }, { code: 'CG', name: 'Congo' },
  { code: 'CD', name: 'DR Congo' }, { code: 'CI', name: "Côte d'Ivoire" },
  { code: 'DJ', name: 'Djibouti' }, { code: 'EG', name: 'Egypt' },
  { code: 'GQ', name: 'Equatorial Guinea' }, { code: 'ER', name: 'Eritrea' },
  { code: 'SZ', name: 'Eswatini' }, { code: 'ET', name: 'Ethiopia' },
  { code: 'GA', name: 'Gabon' }, { code: 'GM', name: 'Gambia' },
  { code: 'GH', name: 'Ghana' }, { code: 'GN', name: 'Guinea' },
  { code: 'GW', name: 'Guinea-Bissau' }, { code: 'KE', name: 'Kenya' },
  { code: 'LS', name: 'Lesotho' }, { code: 'LR', name: 'Liberia' },
  { code: 'LY', name: 'Libya' }, { code: 'MG', name: 'Madagascar' },
  { code: 'MW', name: 'Malawi' }, { code: 'ML', name: 'Mali' },
  { code: 'MR', name: 'Mauritania' }, { code: 'MU', name: 'Mauritius' },
  { code: 'MA', name: 'Morocco' }, { code: 'MZ', name: 'Mozambique' },
  { code: 'NA', name: 'Namibia' }, { code: 'NE', name: 'Niger' },
  { code: 'NG', name: 'Nigeria' }, { code: 'RW', name: 'Rwanda' },
  { code: 'ST', name: 'São Tomé and Príncipe' }, { code: 'SN', name: 'Senegal' },
  { code: 'SC', name: 'Seychelles' }, { code: 'SL', name: 'Sierra Leone' },
  { code: 'SO', name: 'Somalia' }, { code: 'ZA', name: 'South Africa' },
  { code: 'SS', name: 'South Sudan' }, { code: 'SD', name: 'Sudan' },
  { code: 'TZ', name: 'Tanzania' }, { code: 'TG', name: 'Togo' },
  { code: 'TN', name: 'Tunisia' }, { code: 'UG', name: 'Uganda' },
  { code: 'ZM', name: 'Zambia' }, { code: 'ZW', name: 'Zimbabwe' }
];
```

### Investment Sectors
```typescript
export const SECTORS = [
  'Agriculture & Agritech', 'Clean Energy & Climate',
  'Consumer Goods & Retail', 'Education & Edtech',
  'Financial Services & Fintech', 'Healthcare & Biotech',
  'Infrastructure & Construction', 'Logistics & Supply Chain',
  'Manufacturing', 'Media & Entertainment',
  'Mining & Natural Resources', 'Real Estate & PropTech',
  'Technology & SaaS', 'Telecommunications',
  'Tourism & Hospitality', 'Transportation & Mobility',
  'Water & Sanitation', 'Other'
];
```

---

*End of Build Guide — Connect AFRICA v1.0*
