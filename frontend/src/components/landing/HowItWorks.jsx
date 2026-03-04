import { motion } from "framer-motion";
import { Users, Rocket, Briefcase } from "lucide-react";

const columns = [
  {
    icon: Users,
    title: "For Investors",
    steps: [
      "Create your profile",
      "Browse vetted ventures",
      "Request introductions",
      "Enter deal rooms",
    ],
  },
  {
    icon: Rocket,
    title: "For Entrepreneurs",
    steps: [
      "Pay listing fee",
      "Build your profile",
      "Get reviewed & approved",
      "Receive investor interest",
    ],
  },
  {
    icon: Briefcase,
    title: "For Service Providers",
    steps: [
      "Subscribe to the platform",
      "Get verified",
      "Receive leads",
      "Close deals",
    ],
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-[var(--ds-surface)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.p
          className="text-center text-xs uppercase tracking-[0.2em] text-[var(--ds-accent)] mb-3 font-medium"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          How It Works
        </motion.p>
        <motion.h2
          className="text-3xl sm:text-4xl font-bold italic text-center text-[var(--ds-text-primary)] mb-4"
          style={{ fontFamily: "var(--ds-font-display)", lineHeight: "var(--ds-line-tight)" }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.05 }}
        >
          Three roles, one platform
        </motion.h2>
        <motion.p
          className="text-center text-[var(--ds-text-secondary)] max-w-xl mx-auto mb-16 leading-[var(--ds-line-relaxed)]"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Choose your path and get started in minutes.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {columns.map((col, colIndex) => (
            <motion.div
              key={col.title}
              className="relative bg-[var(--ds-surface)] rounded-2xl p-8 shadow-md"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: colIndex * 0.1 }}
            >
              <div className="flex justify-center mb-6">
                <div className="p-3 rounded-xl bg-[var(--ds-accent-green)]/10 text-[var(--ds-accent-green)]">
                  <col.icon className="w-7 h-7" />
                </div>
              </div>
              <h3
                className="text-lg font-bold italic text-center text-[var(--ds-text-primary)] mb-6"
                style={{ fontFamily: "var(--ds-font-display)" }}
              >
                {col.title}
              </h3>
              <ol className="space-y-3">
                {col.steps.map((step, i) => (
                  <li key={step} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--ds-accent)] text-[var(--ds-text-primary)] text-xs font-bold flex items-center justify-center">
                      {i + 1}
                    </span>
                    <span className="text-[var(--ds-text-secondary)] text-sm leading-[var(--ds-line-relaxed)]">{step}</span>
                  </li>
                ))}
              </ol>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="text-center mt-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <a
            href="/choose-role"
            className="inline-flex items-center px-8 py-3.5 rounded-full font-medium bg-[var(--ds-accent)] text-[var(--ds-text-primary)] hover:bg-[var(--ds-accent-hover)] transition shadow-md"
          >
            Get Started
          </a>
        </motion.div>
      </div>
    </section>
  );
}
