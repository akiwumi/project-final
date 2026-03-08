import "dotenv/config";
import express from "express";
import cors from "cors";
import Stripe from "stripe";
import { supabase } from "./lib/supabase.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const port = process.env.PORT || 8080;
const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*",
  })
);
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello Technigo!");
});

// POST /api/payments/create-intent
app.post("/api/payments/create-intent", async (req, res) => {
  const { projectId, entrepreneurId } = req.body;
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 100000,
      currency: "eur",
      metadata: { projectId, entrepreneurId },
      description: "Connect Africa — Project Submission Fee",
    });

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

// POST /api/payments/webhook  (set this URL in Stripe Dashboard)
app.post(
  "/api/payments/webhook",
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

      await supabase
        .from("payments")
        .update({ status: "succeeded" })
        .eq("stripe_payment_intent_id", pi.id);

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

// GET /api/projects/:id/download/:type  (type = "pitch" or "businessPlan")
app.get("/api/projects/:id/download/:type", async (req, res) => {
  const { id, type } = req.params;

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

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
