import { MapPin, Mail } from "lucide-react";
import { Link } from "react-router-dom";

const footerLinks = {
  product: [
    { label: "How it works", to: "/how-it-works" },
    { label: "For Investors", to: "/investor" },
    { label: "For Entrepreneurs", to: "/register" },
    { label: "For Providers", to: "/register?role=provider" },
  ],
  resources: [
    { label: "Advice", to: "/advice" },
    { label: "Rules", to: "/terms" },
    { label: "Terms", to: "/terms" },
    { label: "Privacy", to: "/privacy" },
    { label: "About", to: "/why-us" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-[var(--ds-bg-dark)] text-[var(--ds-text-on-dark)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <span
              className="font-bold text-lg italic"
              style={{ fontFamily: "var(--ds-font-display)" }}
            >
              Connect <span className="text-[var(--ds-accent)]">Africa</span>
            </span>
            <p className="mt-3 text-sm text-[var(--ds-text-on-dark)]/65 leading-[var(--ds-line-relaxed)]">
              The trust layer for cross-border investment into Africa.
            </p>
          </div>
          <div>
            <h3 className="text-xs uppercase tracking-[0.15em] font-medium text-[var(--ds-accent)] mb-4">Product</h3>
            <ul className="space-y-2.5">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-sm text-[var(--ds-text-on-dark)]/65 hover:text-[var(--ds-accent)] transition"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-xs uppercase tracking-[0.15em] font-medium text-[var(--ds-accent)] mb-4">Resources</h3>
            <ul className="space-y-2.5">
              {footerLinks.resources.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-sm text-[var(--ds-text-on-dark)]/65 hover:text-[var(--ds-accent)] transition"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-xs uppercase tracking-[0.15em] font-medium text-[var(--ds-accent)] mb-4">Contact</h3>
            <p className="text-sm flex items-center gap-2 text-[var(--ds-text-on-dark)]/65">
              <MapPin className="w-4 h-4 shrink-0" />
              Africa · Global
            </p>
            <p className="text-sm flex items-center gap-2 mt-2 text-[var(--ds-text-on-dark)]/65">
              <Mail className="w-4 h-4 shrink-0" />
              <a
                href="mailto:support@connectafrica.com"
                className="hover:text-[var(--ds-accent)] transition"
              >
                support@connectafrica.com
              </a>
            </p>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-white/10 text-center text-xs text-[var(--ds-text-on-dark)]/60">
          © {new Date().getFullYear()} Connect Africa. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
