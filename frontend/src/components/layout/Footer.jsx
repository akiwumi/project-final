import { MapPin, Mail } from "lucide-react";

const footerLinks = {
  product: [
    { label: "How it works", href: "#how-it-works" },
    { label: "For Investors", href: "#how-it-works" },
    { label: "For Entrepreneurs", href: "#how-it-works" },
    { label: "For Providers", href: "#how-it-works" },
  ],
  resources: [
    { label: "Advice", href: "#advice" },
    { label: "Rules", href: "#rules" },
    { label: "Terms", href: "#terms" },
    { label: "About", href: "#about" },
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
            <h4 className="text-xs uppercase tracking-[0.15em] font-medium text-[var(--ds-accent)] mb-4">Product</h4>
            <ul className="space-y-2.5">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-[var(--ds-text-on-dark)]/65 hover:text-[var(--ds-accent)] transition"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-[0.15em] font-medium text-[var(--ds-accent)] mb-4">Resources</h4>
            <ul className="space-y-2.5">
              {footerLinks.resources.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-[var(--ds-text-on-dark)]/65 hover:text-[var(--ds-accent)] transition"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-[0.15em] font-medium text-[var(--ds-accent)] mb-4">Contact</h4>
            <p className="text-sm flex items-center gap-2 text-[var(--ds-text-on-dark)]/65">
              <MapPin className="w-4 h-4 shrink-0" />
              Africa · Global
            </p>
            <p className="text-sm flex items-center gap-2 mt-2 text-[var(--ds-text-on-dark)]/65">
              <Mail className="w-4 h-4 shrink-0" />
              <a
                href="mailto:hello@connectafrica.example"
                className="hover:text-[var(--ds-accent)] transition"
              >
                hello@connectafrica.example
              </a>
            </p>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-white/10 text-center text-xs text-[var(--ds-text-on-dark)]/40">
          © {new Date().getFullYear()} Connect Africa. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
