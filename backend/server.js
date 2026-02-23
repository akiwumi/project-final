import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { supabase } from "./lib/supabase.js";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/final-project";
mongoose.connect(mongoUrl);
mongoose.Promise = Promise;

const port = process.env.PORT || 8080;
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello Technigo!");
});

// Supabase client is available as `supabase` for auth, database, and storage in your routes.

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
