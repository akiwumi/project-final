import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, ShieldPlus, UserPlus } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../lib/supabase";
import {
  adminRequest,
  publicRequest,
  ADMIN_BASE_PATH,
  ADMIN_LOGIN_PATH,
} from "../../lib/adminApi";

const inputCls =
  "w-full px-4 py-2.5 rounded-xl border border-[var(--ds-border)] bg-white text-[var(--ds-text-primary)] placeholder:text-[var(--ds-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--ds-accent)] focus:border-transparent text-sm";

export function AdminRegister() {
  const navigate = useNavigate();
  const { user, isLoading: isAuthLoading } = useAuth();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    inviteCode: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let active = true;

    async function redirectIfAlreadyAdmin() {
      if (isAuthLoading || !user) return;
      try {
        await adminRequest("/api/admin/me");
        if (active) {
          navigate(ADMIN_BASE_PATH, { replace: true });
        }
      } catch {
        // Signed in as non-admin: stay on page.
      }
    }

    redirectIfAlreadyAdmin();

    return () => {
      active = false;
    };
  }, [isAuthLoading, navigate, user]);

  function setField(field, value) {
    setForm((previous) => ({ ...previous, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!form.fullName.trim()) {
      setError("Full name is required.");
      return;
    }

    if (!form.email.trim()) {
      setError("Email is required.");
      return;
    }

    if (form.password.length < 12) {
      setError("Password must be at least 12 characters.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!form.inviteCode.trim()) {
      setError("Admin invite code is required.");
      return;
    }

    setSubmitting(true);

    try {
      await publicRequest("/api/admin/register", {
        method: "POST",
        body: {
          fullName: form.fullName.trim(),
          email: form.email.trim(),
          password: form.password,
          inviteCode: form.inviteCode.trim(),
        },
      });

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: form.email.trim(),
        password: form.password,
      });

      if (signInError) {
        setSuccess(
          "Admin account created. Please sign in from the admin login screen to continue."
        );
        return;
      }

      navigate(ADMIN_BASE_PATH, { replace: true });
    } catch (requestError) {
      setError(requestError.message || "Failed to create admin account.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[var(--ds-bg-light)] flex items-center justify-center px-4 py-10">
      <div className="max-w-md w-full bg-white rounded-2xl border border-[var(--ds-border)] shadow-sm p-8">
        <div className="mb-7 text-center">
          <div className="w-12 h-12 rounded-xl bg-[var(--ds-accent)]/10 flex items-center justify-center mx-auto mb-4">
            <ShieldPlus className="w-6 h-6 text-[var(--ds-accent)]" />
          </div>
          <h1
            className="text-2xl font-bold text-[var(--ds-text-primary)] mb-2"
            style={{ fontFamily: "var(--ds-font-display)" }}
          >
            Admin Registration
          </h1>
          <p className="text-sm text-[var(--ds-text-secondary)]">
            Create a secured admin account using your invite code.
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3 rounded-xl border text-sm bg-red-50 border-red-200 text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-5 p-3 rounded-xl border text-sm bg-green-50 border-green-200 text-green-700">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[var(--ds-text-primary)]">Full Name</label>
            <input
              type="text"
              className={inputCls}
              placeholder="Admin Name"
              value={form.fullName}
              onChange={(event) => setField("fullName", event.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[var(--ds-text-primary)]">Email</label>
            <input
              type="email"
              className={inputCls}
              placeholder="admin@company.com"
              value={form.email}
              onChange={(event) => setField("email", event.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[var(--ds-text-primary)]">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className={`${inputCls} pr-10`}
                placeholder="Minimum 12 characters"
                value={form.password}
                onChange={(event) => setField("password", event.target.value)}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--ds-text-muted)]"
                onClick={() => setShowPassword((value) => !value)}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[var(--ds-text-primary)]">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                className={`${inputCls} pr-10`}
                placeholder="Re-enter password"
                value={form.confirmPassword}
                onChange={(event) => setField("confirmPassword", event.target.value)}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--ds-text-muted)]"
                onClick={() => setShowConfirmPassword((value) => !value)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[var(--ds-text-primary)]">
              Admin Invite Code
            </label>
            <input
              type="password"
              className={inputCls}
              placeholder="Invite code"
              value={form.inviteCode}
              onChange={(event) => setField("inviteCode", event.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-xl bg-[var(--ds-accent)] text-[var(--ds-text-on-dark)] font-semibold text-sm hover:bg-[var(--ds-accent-hover)] transition disabled:opacity-70 flex items-center justify-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            {submitting ? "Creating admin account..." : "Create Admin Account"}
          </button>
        </form>

        <div className="mt-5 pt-5 border-t border-[var(--ds-border)] text-center">
          <p className="text-sm text-[var(--ds-text-secondary)] mb-3">Already have an admin account?</p>
          <Link
            to={ADMIN_LOGIN_PATH}
            className="inline-block w-full py-3 rounded-xl border border-[var(--ds-accent)] text-[var(--ds-accent)] font-semibold text-sm hover:bg-[var(--ds-accent)] hover:text-[var(--ds-text-on-dark)] transition"
          >
            Back to Admin Login
          </Link>
        </div>
      </div>
    </div>
  );
}
