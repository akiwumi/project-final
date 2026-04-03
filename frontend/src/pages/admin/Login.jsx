import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, LockKeyhole, LogIn } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../lib/supabase";
import {
  adminRequest,
  ADMIN_BASE_PATH,
  ADMIN_REGISTER_PATH,
} from "../../lib/adminApi";

const inputCls =
  "w-full px-4 py-2.5 rounded-xl border border-[var(--ds-border)] bg-white text-[var(--ds-text-primary)] placeholder:text-[var(--ds-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--ds-accent)] focus:border-transparent text-sm";

function normalizeAdminIdentifier(value) {
  const trimmed = (value || "").trim().toLowerCase();
  if (!trimmed) return "";
  if (trimmed.includes("@")) return trimmed;
  return `${trimmed}@admin.local`;
}

export function AdminLogin() {
  const navigate = useNavigate();
  const { user, isLoading: isAuthLoading } = useAuth();

  const [emailOrLogin, setEmailOrLogin] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingExistingSession, setCheckingExistingSession] = useState(false);
  const loginInputId = "admin-login-identifier";
  const passwordInputId = "admin-login-password";
  const statusMessageId = "admin-login-status";

  useEffect(() => {
    let active = true;

    async function checkExistingAdminSession() {
      if (isAuthLoading || !user) return;

      setCheckingExistingSession(true);
      try {
        await adminRequest("/api/admin/me");
        if (active) {
          navigate(ADMIN_BASE_PATH, { replace: true });
        }
      } catch {
        await supabase.auth.signOut();
        if (active) {
          setError("This account does not have admin access.");
        }
      } finally {
        if (active) {
          setCheckingExistingSession(false);
        }
      }
    }

    checkExistingAdminSession();

    return () => {
      active = false;
    };
  }, [isAuthLoading, navigate, user]);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const normalizedEmail = normalizeAdminIdentifier(emailOrLogin);
    if (!normalizedEmail) {
      setLoading(false);
      setError("Login is required.");
      return;
    }

    const { error: authError } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password,
    });

    if (authError) {
      setLoading(false);
      setError(authError.message || "Failed to sign in");
      return;
    }

    try {
      await adminRequest("/api/admin/me");
      navigate(ADMIN_BASE_PATH, { replace: true });
    } catch (adminError) {
      await supabase.auth.signOut();
      setError(adminError.message || "This account is not authorized for admin access.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[var(--ds-bg-light)] flex items-center justify-center px-4 py-10">
      <div className="max-w-md w-full bg-white rounded-2xl border border-[var(--ds-border)] shadow-sm p-8">
        <div className="mb-7 text-center">
          <div className="w-12 h-12 rounded-xl bg-[var(--ds-accent)]/10 flex items-center justify-center mx-auto mb-4">
            <LockKeyhole className="w-6 h-6 text-[var(--ds-accent)]" />
          </div>
          <h1
            className="text-2xl font-bold text-[var(--ds-text-primary)] mb-2"
            style={{ fontFamily: "var(--ds-font-display)" }}
          >
            Admin Sign In
          </h1>
          <p className="text-sm text-[var(--ds-text-secondary)]">
            Restricted portal. Use your admin credentials.
          </p>
        </div>

        {(error || checkingExistingSession) && (
          <div
            id={statusMessageId}
            role={error ? "alert" : "status"}
            aria-live={error ? "assertive" : "polite"}
            className="mb-5 p-3 rounded-xl border text-sm bg-amber-50 border-amber-200 text-amber-800"
          >
            {checkingExistingSession ? "Checking admin permissions..." : error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div className="flex flex-col gap-1.5">
            <label htmlFor={loginInputId} className="text-sm font-medium text-[var(--ds-text-primary)]">
              Login or Email
            </label>
            <input
              id={loginInputId}
              type="text"
              autoComplete="username"
              className={inputCls}
              placeholder="sokina"
              value={emailOrLogin}
              onChange={(event) => setEmailOrLogin(event.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor={passwordInputId} className="text-sm font-medium text-[var(--ds-text-primary)]">Password</label>
            <div className="relative">
              <input
                id={passwordInputId}
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                className={`${inputCls} pr-10`}
                placeholder="Your admin password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--ds-text-muted)]"
                onClick={() => setShowPassword((value) => !value)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || checkingExistingSession}
            className="w-full py-3 rounded-xl bg-[var(--ds-accent)] text-[var(--ds-text-on-dark)] font-semibold text-sm hover:bg-[var(--ds-accent-hover)] transition disabled:opacity-70 flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            {loading ? "Signing in..." : "Sign in to Admin"}
          </button>
        </form>

        <div className="mt-5 pt-5 border-t border-[var(--ds-border)] text-center">
          <p className="text-sm text-[var(--ds-text-secondary)] mb-3">
            Need to create the first admin account?
          </p>
          <Link
            to={ADMIN_REGISTER_PATH}
            className="inline-block w-full py-3 rounded-xl border border-[var(--ds-accent)] text-[var(--ds-accent)] font-semibold text-sm hover:bg-[var(--ds-accent)] hover:text-[var(--ds-text-on-dark)] transition"
          >
            Open Admin Registration
          </Link>
        </div>
      </div>
    </div>
  );
}
