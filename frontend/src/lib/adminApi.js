import { supabase } from "./supabase";

function normalizePath(path) {
  const trimmed = typeof path === "string" ? path.trim() : "";
  if (!trimmed) return "/ops-private-47x";

  const withLeadingSlash = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  const withoutTrailingSlash = withLeadingSlash.replace(/\/+$/, "");
  return withoutTrailingSlash || "/ops-private-47x";
}

export const ADMIN_BASE_PATH = normalizePath(
  import.meta.env.VITE_ADMIN_BASE_PATH || "/ops-private-47x"
);
export const ADMIN_LOGIN_PATH = `${ADMIN_BASE_PATH}/login`;
export const ADMIN_REGISTER_PATH = `${ADMIN_BASE_PATH}/register`;

const API_BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:8080").replace(
  /\/+$/,
  ""
);

function toApiUrl(path) {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${normalized}`;
}

async function parseJsonResponse(response) {
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    return null;
  }

  try {
    return await response.json();
  } catch {
    return null;
  }
}

async function getAccessToken() {
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    throw new Error(error.message || "Failed to get auth session");
  }

  return data?.session?.access_token || null;
}

export async function adminRequest(path, { method = "GET", body, headers } = {}) {
  const token = await getAccessToken();
  if (!token) {
    throw new Error("You must be signed in as admin to perform this action.");
  }

  const finalHeaders = new Headers(headers || {});
  finalHeaders.set("Authorization", `Bearer ${token}`);

  if (body !== undefined && !finalHeaders.has("Content-Type")) {
    finalHeaders.set("Content-Type", "application/json");
  }

  const response = await fetch(toApiUrl(path), {
    method,
    headers: finalHeaders,
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  const payload = await parseJsonResponse(response);

  if (!response.ok) {
    throw new Error(payload?.error || `Request failed with status ${response.status}`);
  }

  return payload;
}

export async function publicRequest(path, { method = "GET", body, headers } = {}) {
  const finalHeaders = new Headers(headers || {});
  if (body !== undefined && !finalHeaders.has("Content-Type")) {
    finalHeaders.set("Content-Type", "application/json");
  }

  const response = await fetch(toApiUrl(path), {
    method,
    headers: finalHeaders,
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  const payload = await parseJsonResponse(response);

  if (!response.ok) {
    throw new Error(payload?.error || `Request failed with status ${response.status}`);
  }

  return payload;
}
