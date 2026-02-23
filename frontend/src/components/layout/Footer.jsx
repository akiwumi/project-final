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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <span className="font-bold text-lg">
              CONNECT <span className="text-[var(--ds-accent)]">AFRICA</span>
            </span>
            <p className="mt-2 text-sm opacity-90 leading-[var(--ds-line-normal)]">
              The trust layer for cross-border investment into Africa.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Product</h4>
            <ul className="space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm opacity-90 hover:text-[var(--ds-accent)] transition"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Resources</h4>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm opacity-90 hover:text-[var(--ds-accent)] transition"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Contact</h4>
            <p className="text-sm flex items-center gap-2 opacity-90">
              <MapPin className="w-4 h-4 shrink-0" />
              Africa · Global
            </p>
            <p className="text-[length:var(--ds-small-size)] flex items-center gap-2 mt-1 opacity-90">
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
        <div className="mt-10 pt-8 border-t border-white/20 text-center text-sm opacity-80">
          © {new Date().getFullYear()} Connect Africa. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
