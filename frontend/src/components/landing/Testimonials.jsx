import { motion } from "framer-motion";
import { useState } from "react";
import { Quote } from "lucide-react";

const TABS = ["All", "Investors", "Entrepreneurs", "Providers"];

const testimonials = [
  {
    role: "Investor",
    name: "Sarah M.",
    company: "Global Ventures LP",
    country: "UK",
    quote:
      "Connect Africa gave me access to vetted deals I couldn't find elsewhere. The due diligence layer is a game-changer.",
  },
  {
    role: "Entrepreneur",
    name: "Kwame A.",
    company: "AgriTech East Africa",
    country: "Kenya",
    quote:
      "Within two weeks of listing we had serious interest from three investors. The structure really builds trust.",
  },
  {
    role: "Provider",
    name: "Amara D.",
    company: "Legal & Compliance Co",
    country: "Nigeria",
    quote:
      "Verification brought us more qualified leads. Clients know we're vetted and that matters in cross-border work.",
  },
  {
    role: "Investor",
    name: "James L.",
    company: "Impact Fund",
    country: "USA",
    quote:
      "Finally a platform that treats African markets with the same rigor as other emerging markets. Highly recommend.",
  },
];

export function Testimonials() {
  const [activeTab, setActiveTab] = useState("All");

  const filtered =
    activeTab === "All"
      ? testimonials
      : testimonials.filter((t) => t.role === activeTab);

  return (
    <section id="testimonials" className="py-20 bg-[var(--ds-bg-light)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          className="text-3xl sm:text-4xl font-bold text-center text-[var(--ds-text-primary)] mb-4"
          style={{ lineHeight: "var(--ds-line-tight)" }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          What Our Users Say
        </motion.h2>

        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                activeTab === tab
                  ? "bg-[var(--ds-accent)] text-[var(--ds-text-on-dark)]"
                  : "bg-[var(--ds-surface)] text-[var(--ds-text-secondary)] border border-[var(--ds-border)] hover:bg-[var(--ds-overlay)]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          layout
        >
          {filtered.map((t, i) => (
            <motion.div
              key={`${t.name}-${t.role}`}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-[var(--ds-surface)] rounded-2xl p-6 border border-[var(--ds-border)]"
            >
              <Quote className="w-8 h-8 text-[var(--ds-accent)]/50 mb-2" />
              <p className="text-[var(--ds-text-secondary)] italic leading-[var(--ds-line-relaxed)]">&ldquo;{t.quote}&rdquo;</p>
              <div className="mt-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[var(--ds-accent)]/20 flex items-center justify-center text-[var(--ds-accent)] font-bold">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-[var(--ds-text-primary)]">{t.name}</p>
                  <p className="text-sm text-[var(--ds-text-muted)]">
                    {t.role} · {t.company} · {t.country}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
