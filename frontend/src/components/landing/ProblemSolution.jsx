import { motion } from "framer-motion";
import { AlertTriangle, Shield, Zap } from "lucide-react";

const items = [
  {
    problem: "Information asymmetry",
    solution: "Standardized data & verified listings",
    icon: AlertTriangle,
  },
  {
    problem: "Trust deficits",
    solution: "Paid listings + verification workflows",
    icon: Shield,
  },
  {
    problem: "High deal friction",
    solution: "Structured workflows & deal rooms",
    icon: Zap,
  },
];

export function ProblemSolution() {
  return (
    <section id="why" className="py-24 bg-[var(--ds-bg-light)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.p
          className="text-center text-xs uppercase tracking-[0.2em] text-[var(--ds-accent)] mb-3 font-medium"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Why Connect Africa
        </motion.p>
        <motion.h2
          className="text-3xl sm:text-4xl font-bold italic text-center text-[var(--ds-text-primary)] mb-4"
          style={{ fontFamily: "var(--ds-font-display)", lineHeight: "var(--ds-line-tight)" }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Turning barriers into advantages
        </motion.h2>
        <motion.p
          className="text-center text-[var(--ds-text-secondary)] max-w-xl mx-auto mb-14 leading-[var(--ds-line-relaxed)]"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          We address the root causes that slow cross-border investment into Africa.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {items.map((item, i) => (
            <motion.div
              key={item.problem}
              className="bg-[var(--ds-surface)] rounded-2xl p-8 shadow-sm border-l-4 border-[var(--ds-accent)]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="flex items-center gap-2 text-[var(--ds-text-muted)] mb-2">
                <item.icon className="w-4 h-4 shrink-0" />
                <span className="text-xs uppercase tracking-wide font-medium line-through">Problem</span>
              </div>
              <p className="text-[var(--ds-text-primary)] font-medium mb-5 text-sm leading-[var(--ds-line-relaxed)]">{item.problem}</p>
              <div className="pt-4 border-t border-[var(--ds-border)]">
                <span className="text-[var(--ds-accent)] font-semibold text-xs uppercase tracking-[0.15em]">
                  Solution
                </span>
                <p className="text-[var(--ds-text-primary)] mt-2 text-sm leading-[var(--ds-line-relaxed)]">{item.solution}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
