import "dotenv/config";
import express from "express";
import cors from "cors";
import { supabase } from "./lib/supabase.js";

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
