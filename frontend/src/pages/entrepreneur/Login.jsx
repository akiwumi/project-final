import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Navbar } from "../../components/layout/Navbar";
import { Footer } from "../../components/layout/Footer";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { supabase } from "../../lib/supabase";

const inputCls =
  "w-full px-4 py-2.5 rounded-xl border border-[var(--ds-border)] bg-white text-[var(--ds-text-primary)] placeholder:text-[var(--ds-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--ds-accent)] focus:border-transparent text-sm";

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (authError) {
      setError(authError.message);
      return;
    }

    navigate("/entrepreneur/dashboard");
  }

  return (
    <div className="min-h-screen bg-[var(--ds-bg-light)]">
      <Navbar />
      <main className="pt-24 pb-20 flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="w-12 h-12 rounded-xl bg-[var(--ds-accent)]/10 flex items-center justify-center mx-auto mb-4">
              <LogIn className="w-6 h-6 text-[var(--ds-accent)]" />
            </div>
            <h1
              className="text-2xl font-bold text-[var(--ds-text-primary)] mb-2"
              style={{ fontFamily: "var(--ds-font-display)" }}
            >
              Sign in to your account
            </h1>
            <p className="text-sm text-[var(--ds-text-secondary)]">
              Welcome back. Enter your credentials to continue.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-[var(--ds-border)] shadow-sm p-8">
            {error && (
              <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-[var(--ds-text-primary)]">
                  Email address
                </label>
                <input
                  type="email"
                  className={inputCls}
                  placeholder="jane@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-[var(--ds-text-primary)]">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    className={`${inputCls} pr-10`}
                    placeholder="Your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--ds-text-muted)]"
                    onClick={() => setShowPassword((v) => !v)}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-[var(--ds-accent)] text-[var(--ds-text-on-dark)] font-semibold text-sm hover:bg-[var(--ds-accent-hover)] transition disabled:opacity-70 mt-2"
              >
                {loading ? "Signing in…" : "Sign in"}
              </button>
            </form>

            <div className="mt-5 pt-5 border-t border-[var(--ds-border)] text-center">
              <p className="text-sm text-[var(--ds-text-secondary)] mb-3">Don't have an account?</p>
              <Link
                to="/register"
                className="inline-block w-full py-3 rounded-xl border border-[var(--ds-accent)] text-[var(--ds-accent)] font-semibold text-sm hover:bg-[var(--ds-accent)] hover:text-[var(--ds-text-on-dark)] transition"
              >
                Create an account
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
