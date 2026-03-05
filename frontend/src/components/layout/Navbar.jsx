import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const navLinks = [
  { label: "How it works", to: "/how-it-works" },
  { label: "Why us", to: "/why-us" },
  { label: "Testimonials", to: "/testimonials" },
  { label: "Advice", to: "/advice" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[var(--ds-bg-light)] border-b border-[var(--ds-border)]">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link
            to="/"
            className="flex items-center gap-1 text-xl tracking-tight"
            style={{ fontFamily: "var(--ds-font-display)", fontStyle: "italic" }}
          >
            <span className="font-bold text-[var(--ds-text-primary)]">Connect</span>
            <span className="font-bold text-[var(--ds-accent)]">Africa</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-sm font-medium text-[var(--ds-text-secondary)] hover:text-[var(--ds-text-primary)] transition"
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/login"
              className="text-sm font-medium px-5 py-2 rounded-full border border-[var(--ds-text-primary)] text-[var(--ds-text-primary)] hover:bg-[var(--ds-text-primary)] hover:text-[var(--ds-text-on-dark)] transition"
            >
              Sign In
            </Link>
            <Link
              to="/choose-role"
              className="text-sm font-medium px-5 py-2 rounded-full bg-[var(--ds-accent)] text-[var(--ds-text-on-dark)] hover:bg-[var(--ds-accent-hover)] transition"
            >
              Register
            </Link>
          </div>

          <button
            type="button"
            className="md:hidden p-2 text-[var(--ds-text-primary)]"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden py-4 border-t border-[var(--ds-border)]">
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="py-1.5 text-sm text-[var(--ds-text-secondary)] hover:text-[var(--ds-text-primary)] transition"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                to="/login"
                className="mt-1 py-3 text-center text-sm font-medium rounded-full border border-[var(--ds-text-primary)] text-[var(--ds-text-primary)]"
                onClick={() => setMobileOpen(false)}
              >
                Sign In
              </Link>
              <Link
                to="/choose-role"
                className="py-3 text-center text-sm font-medium rounded-full bg-[var(--ds-accent)] text-[var(--ds-text-on-dark)]"
                onClick={() => setMobileOpen(false)}
              >
                Register
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
