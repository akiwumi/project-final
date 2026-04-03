import "dotenv/config";
import express from "express";
import cors from "cors";
import { supabase } from "./lib/supabase.js";

const port = process.env.PORT || 8080;
const app = express();

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const ADMIN_INVITE_CODE = process.env.ADMIN_INVITE_CODE || "";

const DEFAULT_ADMIN_TABLES = [
  "admin_users",
  "entrepreneurs",
  "projects",
  "payments",
  "messages",
  "project_interests",
];

const PROJECT_CREATE_FIELDS = [
  "entrepreneur_id",
  "title",
  "category",
  "stage",
  "amount_seeking",
  "country",
  "summary",
  "status",
  "pitch_url",
  "business_plan_url",
  "submitted_at",
  "views",
  "interests",
];

const PROJECT_UPDATE_FIELDS = [
  "title",
  "category",
  "stage",
  "amount_seeking",
  "country",
  "summary",
  "status",
  "pitch_url",
  "business_plan_url",
  "submitted_at",
  "views",
  "interests",
];

function parseAllowedOrigins(rawValue) {
  if (!rawValue || rawValue === "*") return "*";

  const list = rawValue
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  return new Set(list);
}

const defaultLocalOrigins = new Set([
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:4173",
  "http://127.0.0.1:4173",
]);

const configuredOrigins = parseAllowedOrigins(process.env.FRONTEND_URL || "");
const allowAllOrigins = configuredOrigins === "*";
const allowedOrigins = allowAllOrigins
  ? null
  : new Set([...(configuredOrigins || []), ...defaultLocalOrigins]);

const corsOptions = {
  origin(origin, callback) {
    // Non-browser clients (curl, server-to-server) can proceed without Origin header.
    if (!origin) return callback(null, true);

    if (allowAllOrigins) return callback(null, true);

    if (allowedOrigins?.has(origin)) return callback(null, true);

    return callback(null, false);
  },
  methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(
  cors(corsOptions)
);
app.options("*", cors(corsOptions));
app.use(express.json());

function isUuid(value) {
  return typeof value === "string" && UUID_REGEX.test(value);
}

function getAuthToken(req) {
  const authHeader = req.headers.authorization || "";
  if (!authHeader.startsWith("Bearer ")) return null;
  return authHeader.slice("Bearer ".length).trim() || null;
}

function pickFields(input, allowedFields) {
  const out = {};
  for (const field of allowedFields) {
    if (Object.prototype.hasOwnProperty.call(input, field)) {
      out[field] = input[field];
    }
  }
  return out;
}

function toSafeTableName(value) {
  if (typeof value !== "string") return null;
  if (!/^[a-z][a-z0-9_]{0,62}$/.test(value)) return null;
  return value;
}

async function requireAdmin(req, res, next) {
  try {
    const token = getAuthToken(req);
    if (!token) {
      return res.status(401).json({ error: "Missing or invalid authorization header" });
    }

    const { data: authData, error: authError } = await supabase.auth.getUser(token);
    if (authError || !authData?.user) {
      return res.status(401).json({ error: "Invalid or expired session" });
    }

    const user = authData.user;

    const { data: adminUser, error: adminError } = await supabase
      .from("admin_users")
      .select("id, email, full_name, role, is_active, created_at")
      .eq("id", user.id)
      .maybeSingle();

    if (adminError) {
      console.error("Failed to verify admin role", adminError);
      return res.status(500).json({
        error:
          "Admin role verification failed. Ensure the admin_users table is created in Supabase.",
      });
    }

    if (!adminUser || adminUser.is_active === false) {
      return res.status(403).json({ error: "Admin access required" });
    }

    req.authUser = user;
    req.adminUser = adminUser;
    return next();
  } catch (error) {
    console.error("Unexpected admin auth error", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function getAllowedAdminTables() {
  const allowed = new Set(DEFAULT_ADMIN_TABLES);

  const { data, error } = await supabase
    .from("admin_schema_tables")
    .select("table_name, is_admin_enabled")
    .eq("is_admin_enabled", true);

  if (error) {
    // The metadata view is optional. We silently fall back to known tables.
    return allowed;
  }

  for (const row of data || []) {
    const tableName = toSafeTableName(row.table_name);
    if (tableName) {
      allowed.add(tableName);
    }
  }

  return allowed;
}

async function getTableColumns(tableName) {
  const { data, error } = await supabase
    .from("admin_schema_columns")
    .select("column_name, data_type, is_nullable, ordinal_position")
    .eq("table_name", tableName)
    .order("ordinal_position", { ascending: true });

  if (error) {
    return [];
  }

  return data || [];
}

async function countRows(tableName, filter) {
  let query = supabase.from(tableName).select("*", { count: "exact", head: true });

  if (filter?.column && Object.prototype.hasOwnProperty.call(filter, "value")) {
    query = query.eq(filter.column, filter.value);
  }

  const { count, error } = await query;
  if (error) {
    console.error(`Count failed for ${tableName}`, error);
    return 0;
  }

  return count || 0;
}

function coerceRowId(id) {
  if (typeof id !== "string") return null;
  const trimmed = id.trim();
  if (!trimmed) return null;

  if (/^-?\d+$/.test(trimmed)) {
    const intValue = Number.parseInt(trimmed, 10);
    if (!Number.isNaN(intValue)) return intValue;
  }

  return trimmed;
}

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

// Register a new admin user in Supabase Auth + admin_users table.
app.post("/api/admin/register", async (req, res) => {
  try {
    const { email, password, fullName, inviteCode } = req.body || {};

    if (!ADMIN_INVITE_CODE) {
      return res.status(500).json({
        error:
          "ADMIN_INVITE_CODE is not configured on the backend. Set it before using admin registration.",
      });
    }

    if (!inviteCode || inviteCode !== ADMIN_INVITE_CODE) {
      return res.status(403).json({ error: "Invalid admin invite code" });
    }

    if (!email || typeof email !== "string") {
      return res.status(400).json({ error: "Email is required" });
    }

    if (!password || typeof password !== "string" || password.length < 12) {
      return res.status(400).json({
        error: "Password is required and must be at least 12 characters",
      });
    }

    const cleanedName =
      typeof fullName === "string" && fullName.trim()
        ? fullName.trim().slice(0, 120)
        : "Admin User";

    const normalizedEmail = email.trim().toLowerCase();

    const { data: created, error: createError } = await supabase.auth.admin.createUser({
      email: normalizedEmail,
      password,
      email_confirm: true,
      user_metadata: {
        is_admin: true,
        role: "super_admin",
        full_name: cleanedName,
      },
    });

    if (createError || !created?.user) {
      const status = createError?.message?.toLowerCase().includes("already") ? 409 : 400;
      return res.status(status).json({ error: createError?.message || "Failed to create admin" });
    }

    const { error: profileError } = await supabase.from("admin_users").upsert(
      {
        id: created.user.id,
        email: normalizedEmail,
        full_name: cleanedName,
        role: "super_admin",
        is_active: true,
      },
      { onConflict: "id" }
    );

    if (profileError) {
      console.error("Failed to create admin profile row", profileError);

      // Roll back auth user when profile insert fails to avoid orphaned admin auth accounts.
      await supabase.auth.admin.deleteUser(created.user.id);

      return res.status(500).json({
        error: "Admin user was not created. Check admin_users table schema and try again.",
      });
    }

    return res.status(201).json({
      id: created.user.id,
      email: normalizedEmail,
      full_name: cleanedName,
      role: "super_admin",
      is_active: true,
    });
  } catch (error) {
    console.error("Unexpected error creating admin", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/admin/me", requireAdmin, async (req, res) => {
  return res.json({
    user: {
      id: req.authUser.id,
      email: req.authUser.email,
      role: req.adminUser.role,
      full_name: req.adminUser.full_name,
      is_active: req.adminUser.is_active,
      created_at: req.adminUser.created_at,
    },
  });
});

app.get("/api/admin/dashboard", requireAdmin, async (_req, res) => {
  try {
    const [
      totalUsers,
      totalProjects,
      totalMessages,
      totalPayments,
      pendingVerification,
      underReview,
      approved,
      failedScreening,
    ] = await Promise.all([
      countRows("entrepreneurs"),
      countRows("projects"),
      countRows("messages"),
      countRows("payments"),
      countRows("projects", { column: "status", value: "pending_verification" }),
      countRows("projects", { column: "status", value: "under_review" }),
      countRows("projects", { column: "status", value: "approved" }),
      countRows("projects", { column: "status", value: "failed_screening" }),
    ]);

    return res.json({
      stats: {
        total_users: totalUsers,
        total_projects: totalProjects,
        total_messages: totalMessages,
        total_payments: totalPayments,
      },
      project_status_breakdown: {
        pending_verification: pendingVerification,
        under_review: underReview,
        approved,
        failed_screening: failedScreening,
      },
      generated_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Failed loading admin dashboard", error);
    return res.status(500).json({ error: "Failed to load admin dashboard" });
  }
});

app.get("/api/admin/users", requireAdmin, async (_req, res) => {
  try {
    const { data: entrepreneurs, error } = await supabase
      .from("entrepreneurs")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Failed to fetch entrepreneurs", error);
      return res.status(500).json({ error: "Failed to fetch users" });
    }

    const users = entrepreneurs || [];
    if (users.length === 0) {
      return res.json({ users: [] });
    }

    const userIds = users.map((u) => u.id);

    const [{ data: projectRows, error: projectError }, { data: messageRows, error: messageError }] =
      await Promise.all([
        supabase
          .from("projects")
          .select("id, entrepreneur_id, status, created_at")
          .in("entrepreneur_id", userIds),
        supabase
          .from("messages")
          .select("id, entrepreneur_id, created_at, sender")
          .in("entrepreneur_id", userIds)
          .order("created_at", { ascending: false }),
      ]);

    if (projectError) {
      console.error("Failed to fetch project summaries", projectError);
      return res.status(500).json({ error: "Failed to fetch user project summaries" });
    }

    if (messageError) {
      console.error("Failed to fetch message summaries", messageError);
      return res.status(500).json({ error: "Failed to fetch user message summaries" });
    }

    const projectMap = new Map();
    for (const row of projectRows || []) {
      if (!projectMap.has(row.entrepreneur_id)) {
        projectMap.set(row.entrepreneur_id, {
          total_projects: 0,
          approved_projects: 0,
          pending_projects: 0,
          latest_project_at: null,
        });
      }

      const summary = projectMap.get(row.entrepreneur_id);
      summary.total_projects += 1;
      if (row.status === "approved") {
        summary.approved_projects += 1;
      }
      if (row.status === "pending_verification" || row.status === "under_review") {
        summary.pending_projects += 1;
      }
      if (!summary.latest_project_at || row.created_at > summary.latest_project_at) {
        summary.latest_project_at = row.created_at;
      }
    }

    const messageMap = new Map();
    for (const row of messageRows || []) {
      if (!messageMap.has(row.entrepreneur_id)) {
        messageMap.set(row.entrepreneur_id, {
          total_messages: 0,
          latest_message_at: null,
          latest_sender: null,
        });
      }

      const summary = messageMap.get(row.entrepreneur_id);
      summary.total_messages += 1;
      if (!summary.latest_message_at) {
        summary.latest_message_at = row.created_at;
        summary.latest_sender = row.sender;
      }
    }

    const enriched = users.map((user) => ({
      ...user,
      project_summary: projectMap.get(user.id) || {
        total_projects: 0,
        approved_projects: 0,
        pending_projects: 0,
        latest_project_at: null,
      },
      message_summary: messageMap.get(user.id) || {
        total_messages: 0,
        latest_message_at: null,
        latest_sender: null,
      },
    }));

    return res.json({ users: enriched });
  } catch (error) {
    console.error("Unexpected error fetching admin users", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/admin/users/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    if (!isUuid(id)) {
      return res.status(400).json({ error: "Invalid user id format" });
    }

    const [
      entrepreneurResult,
      projectsResult,
      paymentsResult,
      messagesResult,
      authUserResult,
    ] = await Promise.all([
      supabase.from("entrepreneurs").select("*").eq("id", id).maybeSingle(),
      supabase
        .from("projects")
        .select("*")
        .eq("entrepreneur_id", id)
        .order("created_at", { ascending: false }),
      supabase
        .from("payments")
        .select("*")
        .eq("entrepreneur_id", id)
        .order("created_at", { ascending: false }),
      supabase
        .from("messages")
        .select("*")
        .eq("entrepreneur_id", id)
        .order("created_at", { ascending: false }),
      supabase.auth.admin.getUserById(id),
    ]);

    if (entrepreneurResult.error) {
      console.error("Failed to load entrepreneur", entrepreneurResult.error);
      return res.status(500).json({ error: "Failed to load entrepreneur details" });
    }
    if (projectsResult.error) {
      console.error("Failed to load projects", projectsResult.error);
      return res.status(500).json({ error: "Failed to load project history" });
    }
    if (paymentsResult.error) {
      console.error("Failed to load payments", paymentsResult.error);
      return res.status(500).json({ error: "Failed to load payment history" });
    }
    if (messagesResult.error) {
      console.error("Failed to load messages", messagesResult.error);
      return res.status(500).json({ error: "Failed to load message history" });
    }

    if (!entrepreneurResult.data && !authUserResult?.data?.user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json({
      user: entrepreneurResult.data,
      auth_user: authUserResult?.data?.user || null,
      projects: projectsResult.data || [],
      payments: paymentsResult.data || [],
      messages: messagesResult.data || [],
    });
  } catch (error) {
    console.error("Unexpected error in /api/admin/users/:id", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/admin/users/:id/contact", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const text = typeof req.body?.text === "string" ? req.body.text.trim() : "";

    if (!isUuid(id)) {
      return res.status(400).json({ error: "Invalid user id format" });
    }

    if (!text) {
      return res.status(400).json({ error: "Message text is required" });
    }

    const senderName = req.adminUser.full_name || req.adminUser.email || "Admin Team";

    const { data, error } = await supabase
      .from("messages")
      .insert({
        entrepreneur_id: id,
        sender: "admin",
        sender_name: senderName,
        text,
      })
      .select("*")
      .single();

    if (error) {
      console.error("Failed to send admin message", error);
      return res.status(500).json({ error: "Failed to send message" });
    }

    return res.status(201).json({ message: data });
  } catch (error) {
    console.error("Unexpected error sending admin message", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.delete("/api/admin/users/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    if (!isUuid(id)) {
      return res.status(400).json({ error: "Invalid user id format" });
    }

    if (id === req.adminUser.id) {
      return res.status(400).json({ error: "You cannot delete your own admin account" });
    }

    // This removes the auth user and cascades related rows where FKs are configured.
    const { error: deleteAuthError } = await supabase.auth.admin.deleteUser(id);
    if (deleteAuthError) {
      const status = deleteAuthError.message?.toLowerCase().includes("not found") ? 404 : 500;
      return res.status(status).json({ error: deleteAuthError.message || "Failed to delete user" });
    }

    // Best-effort cleanup for admin profile rows (if the deleted user was also an admin user).
    await supabase.from("admin_users").delete().eq("id", id);

    return res.json({ success: true });
  } catch (error) {
    console.error("Unexpected error deleting user", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/admin/projects", requireAdmin, async (_req, res) => {
  try {
    const { data, error } = await supabase
      .from("projects")
      .select(
        "*, entrepreneurs(id, first_name, last_name, email, company_name, country, city)"
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Failed to fetch projects", error);
      return res.status(500).json({ error: "Failed to fetch projects" });
    }

    return res.json({ projects: data || [] });
  } catch (error) {
    console.error("Unexpected error fetching admin projects", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/admin/projects", requireAdmin, async (req, res) => {
  try {
    const payload = pickFields(req.body || {}, PROJECT_CREATE_FIELDS);

    if (!isUuid(payload.entrepreneur_id)) {
      return res.status(400).json({ error: "Valid entrepreneur_id is required" });
    }

    const required = ["title", "category", "stage", "amount_seeking", "country", "summary"];
    for (const field of required) {
      if (!payload[field] || typeof payload[field] !== "string" || !payload[field].trim()) {
        return res.status(400).json({ error: `${field} is required` });
      }
    }

    payload.title = payload.title.trim();
    payload.category = payload.category.trim();
    payload.stage = payload.stage.trim();
    payload.amount_seeking = payload.amount_seeking.trim();
    payload.country = payload.country.trim();
    payload.summary = payload.summary.trim();
    payload.status = payload.status || "under_review";
    payload.submitted_at = payload.submitted_at || new Date().toISOString();

    const { data, error } = await supabase
      .from("projects")
      .insert(payload)
      .select("*, entrepreneurs(id, first_name, last_name, email, company_name)")
      .single();

    if (error) {
      console.error("Failed to create project", error);
      return res.status(500).json({ error: "Failed to create project" });
    }

    return res.status(201).json({ project: data });
  } catch (error) {
    console.error("Unexpected error creating project", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.patch("/api/admin/projects/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    if (!isUuid(id)) {
      return res.status(400).json({ error: "Invalid project id format" });
    }

    const updates = pickFields(req.body || {}, PROJECT_UPDATE_FIELDS);
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: "No valid project fields provided to update" });
    }

    const { data, error } = await supabase
      .from("projects")
      .update(updates)
      .eq("id", id)
      .select("*, entrepreneurs(id, first_name, last_name, email, company_name)")
      .single();

    if (error) {
      const status = error.code === "PGRST116" ? 404 : 500;
      return res.status(status).json({ error: error.message || "Failed to update project" });
    }

    return res.json({ project: data });
  } catch (error) {
    console.error("Unexpected error updating project", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.delete("/api/admin/projects/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    if (!isUuid(id)) {
      return res.status(400).json({ error: "Invalid project id format" });
    }

    const { data: existing, error: fetchError } = await supabase
      .from("projects")
      .select("id, pitch_url, business_plan_url")
      .eq("id", id)
      .maybeSingle();

    if (fetchError) {
      console.error("Failed to load project before delete", fetchError);
      return res.status(500).json({ error: "Failed to load project" });
    }

    if (!existing) {
      return res.status(404).json({ error: "Project not found" });
    }

    const { error: deleteError } = await supabase.from("projects").delete().eq("id", id);

    if (deleteError) {
      console.error("Failed to delete project", deleteError);
      return res.status(500).json({ error: "Failed to delete project" });
    }

    const storagePaths = [existing.pitch_url, existing.business_plan_url].filter(Boolean);
    if (storagePaths.length > 0) {
      const { error: storageError } = await supabase.storage
        .from("project-docs")
        .remove(storagePaths);
      if (storageError) {
        console.warn("Project deleted, but storage cleanup failed", storageError);
      }
    }

    return res.json({ success: true });
  } catch (error) {
    console.error("Unexpected error deleting project", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/admin/messages", requireAdmin, async (req, res) => {
  try {
    const limitParam = Number.parseInt(req.query.limit, 10);
    const limit = Number.isNaN(limitParam) ? 200 : Math.max(1, Math.min(1000, limitParam));

    const { data, error } = await supabase
      .from("messages")
      .select(
        "*, entrepreneurs(id, first_name, last_name, email, company_name, country, city)"
      )
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Failed to fetch admin messages", error);
      return res.status(500).json({ error: "Failed to fetch messages" });
    }

    return res.json({ messages: data || [] });
  } catch (error) {
    console.error("Unexpected error loading admin messages", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/admin/tables", requireAdmin, async (_req, res) => {
  try {
    const allowedTables = await getAllowedAdminTables();

    const tableEntries = [];
    for (const tableName of allowedTables) {
      tableEntries.push({ table_name: tableName });
    }

    tableEntries.sort((a, b) => a.table_name.localeCompare(b.table_name));

    const data = await Promise.all(
      tableEntries.map(async ({ table_name }) => {
        const [rowCount, columns] = await Promise.all([
          countRows(table_name),
          getTableColumns(table_name),
        ]);
        return {
          table_name,
          row_count: rowCount,
          columns,
        };
      })
    );

    return res.json({ tables: data });
  } catch (error) {
    console.error("Failed to load admin table metadata", error);
    return res.status(500).json({ error: "Failed to load table metadata" });
  }
});

app.get("/api/admin/tables/:table/rows", requireAdmin, async (req, res) => {
  try {
    const tableName = toSafeTableName(req.params.table);
    if (!tableName) {
      return res.status(400).json({ error: "Invalid table name" });
    }

    const allowedTables = await getAllowedAdminTables();
    if (!allowedTables.has(tableName)) {
      return res.status(403).json({ error: "Table is not enabled for admin access" });
    }

    const limitParam = Number.parseInt(req.query.limit, 10);
    const limit = Number.isNaN(limitParam) ? 50 : Math.max(1, Math.min(500, limitParam));

    let { data, error } = await supabase
      .from(tableName)
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      // Some tables don't have created_at; retry without ordering.
      const fallback = await supabase.from(tableName).select("*").limit(limit);
      data = fallback.data;
      error = fallback.error;
    }

    if (error) {
      console.error(`Failed to fetch rows for table ${tableName}`, error);
      return res.status(500).json({ error: "Failed to fetch table rows" });
    }

    return res.json({ table: tableName, rows: data || [] });
  } catch (error) {
    console.error("Unexpected error fetching table rows", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/admin/tables/:table/rows", requireAdmin, async (req, res) => {
  try {
    const tableName = toSafeTableName(req.params.table);
    if (!tableName) {
      return res.status(400).json({ error: "Invalid table name" });
    }

    const allowedTables = await getAllowedAdminTables();
    if (!allowedTables.has(tableName)) {
      return res.status(403).json({ error: "Table is not enabled for admin access" });
    }

    const payload = req.body;
    if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
      return res.status(400).json({ error: "Request body must be an object" });
    }

    if (tableName === "admin_users") {
      return res.status(403).json({
        error:
          "Use /api/admin/register for creating admin users to enforce invite-code validation.",
      });
    }

    const { data, error } = await supabase
      .from(tableName)
      .insert(payload)
      .select("*")
      .single();

    if (error) {
      console.error(`Failed to create row in ${tableName}`, error);
      return res.status(500).json({ error: error.message || "Failed to create row" });
    }

    return res.status(201).json({ row: data });
  } catch (error) {
    console.error("Unexpected error creating table row", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.patch("/api/admin/tables/:table/rows/:id", requireAdmin, async (req, res) => {
  try {
    const tableName = toSafeTableName(req.params.table);
    if (!tableName) {
      return res.status(400).json({ error: "Invalid table name" });
    }

    const allowedTables = await getAllowedAdminTables();
    if (!allowedTables.has(tableName)) {
      return res.status(403).json({ error: "Table is not enabled for admin access" });
    }

    const rowId = coerceRowId(req.params.id);
    if (rowId === null) {
      return res.status(400).json({ error: "Invalid row id" });
    }

    const payload = req.body;
    if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
      return res.status(400).json({ error: "Request body must be an object" });
    }

    if (tableName === "admin_users" && String(rowId) === String(req.adminUser.id)) {
      if (
        Object.prototype.hasOwnProperty.call(payload, "is_active") &&
        payload.is_active === false
      ) {
        return res.status(400).json({ error: "You cannot deactivate your own admin account" });
      }
    }

    const { data, error } = await supabase
      .from(tableName)
      .update(payload)
      .eq("id", rowId)
      .select("*")
      .single();

    if (error) {
      const status = error.code === "PGRST116" ? 404 : 500;
      return res.status(status).json({ error: error.message || "Failed to update row" });
    }

    return res.json({ row: data });
  } catch (error) {
    console.error("Unexpected error updating table row", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.delete("/api/admin/tables/:table/rows/:id", requireAdmin, async (req, res) => {
  try {
    const tableName = toSafeTableName(req.params.table);
    if (!tableName) {
      return res.status(400).json({ error: "Invalid table name" });
    }

    const allowedTables = await getAllowedAdminTables();
    if (!allowedTables.has(tableName)) {
      return res.status(403).json({ error: "Table is not enabled for admin access" });
    }

    const rowId = coerceRowId(req.params.id);
    if (rowId === null) {
      return res.status(400).json({ error: "Invalid row id" });
    }

    if (tableName === "admin_users" && String(rowId) === String(req.adminUser.id)) {
      return res.status(400).json({ error: "You cannot delete your own admin account" });
    }

    const { error } = await supabase.from(tableName).delete().eq("id", rowId);

    if (error) {
      console.error(`Failed to delete row in ${tableName}`, error);
      return res.status(500).json({ error: error.message || "Failed to delete row" });
    }

    return res.json({ success: true });
  } catch (error) {
    console.error("Unexpected error deleting table row", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
