# Backend Wiring Guide — Connect Africa

## Entrepreneur Registration, Submission & Payment Flow

This guide walks through every step needed to wire the frontend pages to a live backend.
Stack: **Supabase** (auth, database, storage, realtime) + **Express** backend + **Stripe**.

---

## Table of Contents

1. [Environment Variables](#1-environment-variables)
2. [Supabase — Database Tables](#2-supabase--database-tables)
3. [Supabase — Row Level Security (RLS)](#3-supabase--row-level-security-rls)
4. [Supabase — Storage Buckets](#4-supabase--storage-buckets)
5. [Supabase — Auth & Email Confirmation](#5-supabase--auth--email-confirmation)
6. [Frontend — Supabase Client](#6-frontend--supabase-client)
7. [Wire: Registration (`Register.jsx`)](#7-wire-registration-registerjsx)
8. [Wire: Welcome / T&C Acceptance (`Welcome.jsx`)](#8-wire-welcome--tc-acceptance-welcomejsx)
9. [Wire: Profile Page (`Profile.jsx`)](#9-wire-profile-page-profilejsx)
10. [Wire: Project Submission (`SubmitProject.jsx`)](#10-wire-project-submission-submitprojectjsx)
11. [Wire: Payment & Verification (`Payment.jsx`)](#11-wire-payment--verification-paymentjsx)
12. [Wire: Dashboard — Submissions & Chat (`Dashboard.jsx`)](#12-wire-dashboard--submissions--chat-dashboardjsx)
13. [Wire: Project Feed (`ProjectFeed.jsx`)](#13-wire-project-feed-projectfeedjsx)
14. [Express Backend Routes](#14-express-backend-routes)
15. [Stripe Setup](#15-stripe-setup)
16. [Deployment Checklist](#16-deployment-checklist)

---

## 1. Environment Variables

### `backend/.env`

```env
# Supabase
SUPABASE_URL=https://<your-project>.supabase.co
SUPABASE_ANON_KEY=<your-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>   # Admin ops, bypasses RLS

# Stripe
STRIPE_SECRET_KEY=sk_live_...         # or sk_test_... for development
STRIPE_WEBHOOK_SECRET=whsec_...       # from Stripe Dashboard → Webhooks

# App
FRONTEND_URL=https://your-deployed-frontend.com
PORT=8080
```

### `frontend/.env` (create this file)

```env
VITE_SUPABASE_URL=https://<your-project>.supabase.co
VITE_SUPABASE_ANON_KEY=<your-anon-key>
VITE_API_URL=http://localhost:8080   # your Express backend URL
```

> **Never commit `.env` files.** Both are already in `.gitignore`.

---

## 2. Supabase — Database Tables

Open your Supabase project → **SQL Editor** → run each block below.

### 2a. `entrepreneurs` table

```sql
create table public.entrepreneurs (
  id            uuid primary key references auth.users(id) on delete cascade,
  first_name    text not null,
  last_name     text not null,
  email         text not null,
  phone         text not null,
  company_name  text not null,
  company_type  text not null check (company_type in ('startup', 'ongoing')),
  years_operating integer,
  employees     text,
  website       text,
  company_address text not null,
  city          text not null,
  country       text not null,
  avatar_url    text,
  bio           text,
  presentation  text,
  terms_accepted boolean not null default false,
  terms_accepted_at timestamptz,
  created_at    timestamptz default now()
);
```

### 2b. `projects` table

```sql
create table public.projects (
  id              uuid primary key default gen_random_uuid(),
  entrepreneur_id uuid not null references public.entrepreneurs(id) on delete cascade,
  title           text not null,
  category        text not null,
  stage           text not null,
  amount_seeking  text not null,
  country         text not null,
  summary         text not null,
  pitch_url       text,           -- Supabase Storage path
  business_plan_url text,         -- Supabase Storage path (optional)
  status          text not null default 'pending_payment'
                  check (status in ('pending_payment','under_review','approved','failed_screening')),
  views           integer not null default 0,
  interests       integer not null default 0,
  submitted_at    timestamptz,
  created_at      timestamptz default now()
);
```

### 2c. `payments` table

```sql
create table public.payments (
  id                  uuid primary key default gen_random_uuid(),
  project_id          uuid not null references public.projects(id) on delete cascade,
  entrepreneur_id     uuid not null references public.entrepreneurs(id),
  stripe_payment_intent_id text unique,
  amount_cents        integer not null default 100000,   -- €1,000.00
  currency            text not null default 'eur',
  status              text not null default 'pending'
                      check (status in ('pending','succeeded','refunded','partially_refunded')),
  verification_date   date,
  verification_time   text,   -- e.g. "09:30"
  created_at          timestamptz default now()
);
```

### 2d. `messages` table (admin chat)

```sql
create table public.messages (
  id              uuid primary key default gen_random_uuid(),
  entrepreneur_id uuid not null references public.entrepreneurs(id) on delete cascade,
  sender          text not null check (sender in ('user', 'admin')),
  sender_name     text not null,
  text            text not null,
  created_at      timestamptz default now()
);
```

### 2e. `project_interests` table

```sql
create table public.project_interests (
  id          uuid primary key default gen_random_uuid(),
  project_id  uuid not null references public.projects(id) on delete cascade,
  user_id     uuid not null references auth.users(id) on delete cascade,
  created_at  timestamptz default now(),
  unique(project_id, user_id)
);
```

---

## 3. Supabase — Row Level Security (RLS)

Run in SQL Editor. This ensures users can only read/write their own data.

```sql
-- Enable RLS on all tables
alter table public.entrepreneurs enable row level security;
alter table public.projects enable row level security;
alter table public.payments enable row level security;
alter table public.messages enable row level security;
alter table public.project_interests enable row level security;

-- entrepreneurs: only the owner can read/write their own row
create policy "owner access" on public.entrepreneurs
  for all using (auth.uid() = id);

-- projects: owner can manage; everyone can read approved ones
create policy "owner manage projects" on public.projects
  for all using (auth.uid() = entrepreneur_id);

create policy "public read approved projects" on public.projects
  for select using (status = 'approved');

-- payments: owner only
create policy "owner payments" on public.payments
  for all using (auth.uid() = entrepreneur_id);

-- messages: owner reads/writes their own thread
create policy "owner messages" on public.messages
  for all using (auth.uid() = entrepreneur_id);

-- project_interests: authenticated users can insert/read their own
create policy "own interests" on public.project_interests
  for all using (auth.uid() = user_id);
```

---

## 4. Supabase — Storage Buckets

In the Supabase Dashboard → **Storage** → create two buckets:

| Bucket name | Public? | Max file size | Allowed MIME types |
|---|---|---|---|
| `avatars` | ✅ Public | 5 MB | `image/jpeg, image/png, image/gif, image/webp` |
| `project-docs` | ❌ Private | 50 MB | `application/pdf` |

Then add storage policies in SQL Editor:

```sql
-- avatars: anyone can read; only owner can upload to their own folder
create policy "public read avatars" on storage.objects
  for select using (bucket_id = 'avatars');

create policy "owner upload avatar" on storage.objects
  for insert with check (
    bucket_id = 'avatars' and
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- project-docs: only the owning entrepreneur can upload/read
create policy "owner upload docs" on storage.objects
  for insert with check (
    bucket_id = 'project-docs' and
    auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "owner read docs" on storage.objects
  for select using (
    bucket_id = 'project-docs' and
    auth.uid()::text = (storage.foldername(name))[1]
  );
```

---

## 5. Supabase — Auth & Email Confirmation

### 5a. Enable email confirmations

Dashboard → **Authentication → Providers → Email**:
- Toggle **"Confirm email"** ON
- Set **"Redirect URL"** to: `https://your-frontend.com/welcome`

### 5b. Customise the confirmation email

Dashboard → **Authentication → Email Templates → Confirm signup**:

```html
<h2>Confirm your Connect Africa account</h2>
<p>Click the button below to confirm your email address and activate your account.</p>
<a href="{{ .ConfirmationURL }}">Confirm Email</a>
<p>This link expires in 24 hours.</p>
```

The `ConfirmationURL` automatically redirects to your **Redirect URL** after clicking, which should be `/welcome`.

### 5c. Handle the redirect in `Welcome.jsx`

When Supabase redirects to `/welcome`, it appends a token to the URL. Supabase JS handles this automatically — the session is set when the page loads. You just need to check the session is valid:

```js
// At the top of Welcome.jsx — add this useEffect
import { supabase } from "../../lib/supabase";

useEffect(() => {
  supabase.auth.getSession().then(({ data: { session } }) => {
    if (!session) {
      // Not confirmed yet — redirect back
      navigate("/register");
    }
  });
}, []);
```

---

## 6. Frontend — Supabase Client

Create `frontend/src/lib/supabase.js`:

```js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

Install the package:

```bash
cd frontend && npm install @supabase/supabase-js
```

---

## 7. Wire: Registration (`Register.jsx`)

Replace the `handleSubmit` function body:

```js
import { supabase } from "../../lib/supabase";

async function handleSubmit(e) {
  e.preventDefault();
  const errs = validate();
  if (Object.keys(errs).length > 0) {
    setErrors(errs);
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }

  // 1. Create auth user — Supabase sends confirmation email automatically
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: form.email,
    password: form.password,
    options: {
      emailRedirectTo: `${window.location.origin}/welcome`,
    },
  });

  if (authError) {
    setErrors({ email: authError.message });
    return;
  }

  // 2. Insert entrepreneur profile row
  const { error: profileError } = await supabase.from("entrepreneurs").insert({
    id: authData.user.id,
    first_name: form.firstName,
    last_name: form.lastName,
    email: form.email,
    phone: `${form.phoneCode} ${form.phone}`,
    company_name: form.companyName,
    company_type: form.companyType,
    years_operating: form.yearsOperating ? parseInt(form.yearsOperating) : null,
    employees: form.employees,
    website: form.website || null,
    company_address: form.companyAddress,
    city: form.city,
    country: form.country,
  });

  if (profileError) {
    console.error("Profile insert error:", profileError);
    // Auth user was created — don't block UX, show confirmation anyway
  }

  setSubmitted(true);
}
```

---

## 8. Wire: Welcome / T&C Acceptance (`Welcome.jsx`)

Replace `handleAccept`:

```js
import { supabase } from "../../lib/supabase";

async function handleAccept() {
  if (!accepted) return;

  const { data: { user } } = await supabase.auth.getUser();

  const { error } = await supabase
    .from("entrepreneurs")
    .update({
      terms_accepted: true,
      terms_accepted_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (error) {
    console.error("T&C update error:", error);
    return;
  }

  navigate("/entrepreneur/profile");
}
```

---

## 9. Wire: Profile Page (`Profile.jsx`)

### 9a. Load real data on mount

```js
import { useEffect } from "react";
import { supabase } from "../../lib/supabase";

const [profile, setProfile] = useState(null);

useEffect(() => {
  async function loadProfile() {
    const { data: { user } } = await supabase.auth.getUser();
    const { data } = await supabase
      .from("entrepreneurs")
      .select("*")
      .eq("id", user.id)
      .single();
    if (data) {
      setProfile(data);
      setBio(data.bio || "");
      setPresentation(data.presentation || "");
      setAvatarPreview(data.avatar_url || null);
    }
  }
  loadProfile();
}, []);
```

### 9b. Save profile with avatar upload

```js
async function handleSave(e) {
  e.preventDefault();
  setSaving(true);

  const { data: { user } } = await supabase.auth.getUser();
  let avatarUrl = profile?.avatar_url || null;

  // Upload avatar if a new file was selected
  if (avatar) {
    const ext = avatar.name.split(".").pop();
    const path = `${user.id}/avatar.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(path, avatar, { upsert: true });

    if (!uploadError) {
      const { data: urlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(path);
      avatarUrl = urlData.publicUrl;
    }
  }

  await supabase
    .from("entrepreneurs")
    .update({ bio, presentation, avatar_url: avatarUrl })
    .eq("id", user.id);

  setSaving(false);
  setSaved(true);
}
```

---

## 10. Wire: Project Submission (`SubmitProject.jsx`)

Replace `handleSubmit` — upload PDFs to Supabase Storage then insert project row:

```js
import { supabase } from "../../lib/supabase";

async function handleSubmit(e) {
  e.preventDefault();
  const errs = validate();
  if (Object.keys(errs).length > 0) {
    setErrors(errs);
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }

  const { data: { user } } = await supabase.auth.getUser();

  // Upload pitch PDF
  const pitchPath = `${user.id}/${Date.now()}-pitch.pdf`;
  const { error: pitchError } = await supabase.storage
    .from("project-docs")
    .upload(pitchPath, form.pitchFile);

  if (pitchError) {
    setErrors({ pitchFile: "Upload failed. Please try again." });
    return;
  }

  // Upload business plan PDF (optional)
  let bpPath = null;
  if (form.businessPlanFile) {
    bpPath = `${user.id}/${Date.now()}-business-plan.pdf`;
    await supabase.storage.from("project-docs").upload(bpPath, form.businessPlanFile);
  }

  // Insert project row (status = pending_payment until Stripe confirms)
  const { data: project, error: insertError } = await supabase
    .from("projects")
    .insert({
      entrepreneur_id: user.id,
      title: form.title,
      category: form.category,
      stage: form.stage,
      amount_seeking: form.amountSeeking,
      country: form.country,
      summary: form.summary,
      pitch_url: pitchPath,
      business_plan_url: bpPath,
      status: "pending_payment",
    })
    .select()
    .single();

  if (insertError) {
    setErrors({ title: "Submission failed. Please try again." });
    return;
  }

  // Pass project ID to payment page
  navigate("/entrepreneur/payment", {
    state: { project: { ...form, id: project.id } },
  });
}
```

---

## 11. Wire: Payment & Verification (`Payment.jsx`)

Payment requires a backend API call to Stripe. This is a **two-step** process.

### 11a. Create a Stripe Payment Intent (backend)

Add this route to `backend/server.js`:

```js
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// POST /api/payments/create-intent
app.post("/api/payments/create-intent", async (req, res) => {
  const { projectId, entrepreneurId } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 100000,        // €1,000.00 in cents
      currency: "eur",
      metadata: { projectId, entrepreneurId },
      description: "Connect Africa — Project Submission Fee",
    });

    // Save to payments table
    await supabase.from("payments").insert({
      project_id: projectId,
      entrepreneur_id: entrepreneurId,
      stripe_payment_intent_id: paymentIntent.id,
      status: "pending",
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
```

### 11b. Stripe Webhook (backend) — update status on payment success

```js
import { buffer } from "micro";

// POST /api/payments/webhook  (set this URL in Stripe Dashboard)
app.post("/api/payments/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === "payment_intent.succeeded") {
      const pi = event.data.object;

      // Update payment status
      await supabase
        .from("payments")
        .update({ status: "succeeded" })
        .eq("stripe_payment_intent_id", pi.id);

      // Update project status to under_review
      await supabase
        .from("projects")
        .update({
          status: "under_review",
          submitted_at: new Date().toISOString(),
        })
        .eq("id", pi.metadata.projectId);
    }

    res.json({ received: true });
  }
);
```

### 11c. Frontend — save verification slot and trigger payment

In `Payment.jsx`, replace `handlePay`:

```js
import { supabase } from "../../lib/supabase";

async function handlePay(e) {
  e.preventDefault();
  const errs = validate();
  if (Object.keys(errs).length > 0) {
    setErrors(errs);
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }

  setProcessing(true);
  const { data: { user } } = await supabase.auth.getUser();

  // 1. Create Stripe payment intent via backend
  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/payments/create-intent`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      projectId: project?.id,
      entrepreneurId: user.id,
    }),
  });
  const { clientSecret, error } = await res.json();

  if (error) {
    setErrors({ cardNumber: error });
    setProcessing(false);
    return;
  }

  // 2. Confirm card payment with Stripe.js
  // Install: npm install @stripe/stripe-js
  const { loadStripe } = await import("@stripe/stripe-js");
  const stripeJs = await loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

  const { error: stripeError } = await stripeJs.confirmCardPayment(clientSecret, {
    payment_method: {
      card: {
        // Use Stripe Elements in production instead of raw card fields
        // See: https://stripe.com/docs/stripe-js/elements
        number: cardNumber.replace(/\s/g, ""),
        exp_month: parseInt(expiry.split("/")[0]),
        exp_year: parseInt("20" + expiry.split("/")[1]),
        cvc: cvv,
      },
      billing_details: { name: cardName },
    },
  });

  if (stripeError) {
    setErrors({ cardNumber: stripeError.message });
    setProcessing(false);
    return;
  }

  // 3. Save verification date & time
  await supabase
    .from("payments")
    .update({
      verification_date: selectedDate.toISOString().split("T")[0],
      verification_time: selectedTime,
    })
    .eq("project_id", project?.id)
    .eq("entrepreneur_id", user.id);

  setProcessing(false);
  setPaid(true);
}
```

> **Production note:** Use [Stripe Elements](https://stripe.com/docs/stripe-js/elements) instead of raw card fields. Raw card fields require PCI SAQ D compliance. Stripe Elements keeps you at SAQ A.

---

## 12. Wire: Dashboard — Submissions & Chat (`Dashboard.jsx`)

### 12a. Load submissions

```js
import { useEffect } from "react";
import { supabase } from "../../lib/supabase";

useEffect(() => {
  async function loadData() {
    const { data: { user } } = await supabase.auth.getUser();

    const { data: submissions } = await supabase
      .from("projects")
      .select("*")
      .eq("entrepreneur_id", user.id)
      .order("created_at", { ascending: false });

    if (submissions) setSubmissions(submissions);
  }
  loadData();
}, []);
```

### 12b. Load messages + subscribe to realtime

```js
useEffect(() => {
  async function loadMessages() {
    const { data: { user } } = await supabase.auth.getUser();

    // Load history
    const { data } = await supabase
      .from("messages")
      .select("*")
      .eq("entrepreneur_id", user.id)
      .order("created_at", { ascending: true });

    if (data) setMessages(data);

    // Subscribe to new messages (realtime)
    const channel = supabase
      .channel("messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `entrepreneur_id=eq.${user.id}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new]);
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }

  loadMessages();
}, []);
```

### 12c. Send a message

```js
async function sendMessage() {
  if (!newMsg.trim()) return;
  const { data: { user } } = await supabase.auth.getUser();

  await supabase.from("messages").insert({
    entrepreneur_id: user.id,
    sender: "user",
    sender_name: "Jane Doe",   // replace with profile.first_name + " " + profile.last_name
    text: newMsg.trim(),
  });

  setNewMsg("");
  // The realtime subscription above will add the message to state automatically
}
```

> **Enable Realtime for the `messages` table:** Supabase Dashboard → **Database → Replication** → toggle on `messages`.

---

## 13. Wire: Project Feed (`ProjectFeed.jsx`)

```js
import { useEffect } from "react";
import { supabase } from "../../lib/supabase";

useEffect(() => {
  async function loadProjects() {
    const { data } = await supabase
      .from("projects")
      .select(`
        id, title, category, stage, amount_seeking, country,
        summary, views, interests, submitted_at,
        entrepreneurs ( company_name, avatar_url )
      `)
      .eq("status", "approved")
      .order("submitted_at", { ascending: false });

    if (data) setProjects(data);
  }
  loadProjects();
}, []);
```

### Express interest

```js
async function handleInterest(projectId) {
  const { data: { user } } = await supabase.auth.getUser();

  await supabase.from("project_interests").upsert(
    { project_id: projectId, user_id: user.id },
    { onConflict: "project_id,user_id" }
  );

  // Increment counter via RPC (add this SQL function in Supabase)
  await supabase.rpc("increment_project_interests", { pid: projectId });
}
```

Add this SQL function in Supabase SQL Editor:

```sql
create or replace function increment_project_interests(pid uuid)
returns void language sql as $$
  update public.projects
  set interests = interests + 1
  where id = pid;
$$;
```

---

## 14. Express Backend Routes

Summary of all API routes needed in `backend/server.js`:

| Method | Path | Description |
|---|---|---|
| `POST` | `/api/payments/create-intent` | Create Stripe PaymentIntent, insert `payments` row |
| `POST` | `/api/payments/webhook` | Stripe webhook — update payment + project status |
| `GET` | `/api/projects/:id/download/:type` | Signed URL for pitch/business plan PDF download |

### Signed PDF download (admin or investor use)

```js
// GET /api/projects/:id/download/:type  (type = "pitch" or "businessPlan")
app.get("/api/projects/:id/download/:type", async (req, res) => {
  const { id, type } = req.params;

  // Fetch the project (use service role key here to bypass RLS)
  const { data: project } = await supabase
    .from("projects")
    .select("pitch_url, business_plan_url")
    .eq("id", id)
    .single();

  const path = type === "pitch" ? project.pitch_url : project.business_plan_url;
  if (!path) return res.status(404).json({ error: "File not found" });

  const { data } = await supabase.storage
    .from("project-docs")
    .createSignedUrl(path, 60 * 60); // 1 hour expiry

  res.json({ url: data.signedUrl });
});
```

---

## 15. Stripe Setup

1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Dashboard → **Developers → API Keys** — copy **Publishable key** and **Secret key**
3. Add to `.env`:
   ```
   STRIPE_SECRET_KEY=sk_test_...
   VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
   ```
4. Set up Webhook:
   - Dashboard → **Developers → Webhooks → Add endpoint**
   - URL: `https://your-backend.com/api/payments/webhook`
   - Events to listen for: `payment_intent.succeeded`, `payment_intent.payment_failed`
   - Copy the **Webhook signing secret** → add as `STRIPE_WEBHOOK_SECRET`
5. Install Stripe packages:
   ```bash
   cd backend && npm install stripe
   cd frontend && npm install @stripe/stripe-js
   ```

---

## 16. Deployment Checklist

- [ ] All `.env` variables set in your hosting platform (Heroku / Render for backend; Vercel for frontend)
- [ ] Supabase **Redirect URL** set to your production frontend URL (`/welcome`)
- [ ] Supabase **Site URL** set to production URL in Auth settings
- [ ] Stripe webhook endpoint pointed to production backend URL
- [ ] `STRIPE_SECRET_KEY` switched from `sk_test_` to `sk_live_`
- [ ] Supabase Realtime enabled for `messages` table
- [ ] Storage bucket CORS configured if needed (Supabase Dashboard → Storage → Policies)
- [ ] `VITE_API_URL` in frontend `.env` points to production backend URL
- [ ] `frontend/src/lib/supabase.js` created (see Step 6)
- [ ] `vercel.json` already has SPA rewrite rule ✅
