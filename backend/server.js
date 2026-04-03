import "dotenv/config";
import express from "express";
import cors from "cors";
import { supabase } from "./lib/supabase.js";

const port = process.env.PORT || 8080;
const app = express();
const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*",
  })
);
app.use(express.json());

// GET /api/projects/:id/download/:type  (type = "pitch" or "businessPlan")
app.get("/api/projects/:id/download/:type", async (req, res) => {
  try {
    const { id, type } = req.params;

    if (type !== "pitch" && type !== "businessPlan") {
      return res
        .status(400)
        .json({ error: 'Invalid type. Use "pitch" or "businessPlan".' });
    }

    if (!UUID_REGEX.test(id)) {
      return res.status(400).json({ error: "Invalid project id format" });
    }

    const { data: project, error: projectError } = await supabase
      .from("projects")
      .select("pitch_url, business_plan_url")
      .eq("id", id)
      .single();

    if (projectError) {
      if (projectError.code === "PGRST116") {
        return res.status(404).json({ error: "Project not found" });
      }

      console.error("Failed to fetch project for download", projectError);
      return res.status(500).json({ error: "Failed to fetch project" });
    }

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    const path = type === "pitch" ? project.pitch_url : project.business_plan_url;
    if (!path) {
      return res.status(404).json({ error: "File not found" });
    }

    const { data, error: signedUrlError } = await supabase.storage
      .from("project-docs")
      .createSignedUrl(path, 60 * 60); // 1 hour expiry

    if (signedUrlError || !data?.signedUrl) {
      console.error("Failed to generate signed URL", signedUrlError);
      return res.status(500).json({ error: "Failed to generate download URL" });
    }

    return res.json({ url: data.signedUrl });
  } catch (error) {
    console.error("Unexpected error in download endpoint", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
