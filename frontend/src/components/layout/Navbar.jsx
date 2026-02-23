import { Menu } from "lucide-react";
import { useState } from "react";

const navLinks = [
  { label: "How it works", href: "#how-it-works" },
  { label: "Why us", href: "#why" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Advice", href: "#advice" },
  { label: "Rules", href: "#rules" },
  { label: "Terms", href: "#terms" },
  { label: "About", href: "#about" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 bg-[#FDFCF9] text-[var(--ds-text-primary)] shadow-sm border-b border-[var(--ds-border)]"
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <a href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <span>CONNECT</span>
            <span className="text-[var(--ds-accent)]">AFRICA</span>
          </a>

          <div className="hidden md:flex items-center gap-6">
            {navLinks.slice(0, 4).map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-base font-medium text-[var(--ds-text-secondary)] hover:text-[var(--ds-text-primary)] transition"
              >
                {link.label}
              </a>
            ))}
            <a
              href="/login"
              className="text-base font-medium px-5 py-2.5 rounded-xl border-2 border-[var(--ds-text-primary)] text-[var(--ds-text-primary)] hover:bg-[var(--ds-overlay)] transition"
            >
              Sign In
            </a>
            <a
              href="/register"
              className="text-base font-semibold px-6 py-3 rounded-xl bg-[var(--ds-accent)] text-[var(--ds-text-on-dark)] hover:bg-[var(--ds-accent-hover)] transition"
            >
              Get Started
            </a>
          </div>

          <button
            type="button"
            className="md:hidden p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden py-4 border-t border-[var(--ds-border)]">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="py-2 text-base text-[var(--ds-text-secondary)]"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <a
                href="/login"
                className="py-3 text-center font-medium rounded-xl border-2 border-[var(--ds-text-primary)] text-[var(--ds-text-primary)]"
                onClick={() => setMobileOpen(false)}
              >
                Sign In
              </a>
              <a
                href="/register"
                className="mt-2 py-3 text-center font-semibold rounded-xl bg-[var(--ds-accent)] text-[var(--ds-text-on-dark)]"
                onClick={() => setMobileOpen(false)}
              >
                Get Started
              </a>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
