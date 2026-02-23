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
    <section id="why" className="py-20 bg-[var(--ds-surface)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          className="text-3xl sm:text-4xl font-bold text-center text-[var(--ds-text-primary)] mb-4"
          style={{ lineHeight: "var(--ds-line-tight)" }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Why Connect AFRICA
        </motion.h2>
        <motion.p
          className="text-center text-[var(--ds-text-secondary)] max-w-2xl mx-auto mb-14 leading-[var(--ds-line-relaxed)]"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          We turn the biggest barriers into your advantage.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {items.map((item, i) => (
            <motion.div
              key={item.problem}
              className="bg-[var(--ds-surface)] rounded-2xl p-8 shadow-sm border border-[var(--ds-border)]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="flex items-center gap-3 text-[var(--ds-text-muted)] mb-2">
                <item.icon className="w-5 h-5 shrink-0" />
                <span className="font-semibold text-[var(--ds-text-secondary)]">Problem</span>
              </div>
              <p className="text-[var(--ds-text-primary)] font-medium mb-4">{item.problem}</p>
              <div className="border-t border-[var(--ds-border)] pt-4">
                <span className="text-[var(--ds-accent)] font-semibold text-sm uppercase tracking-wide">
                  Solution
                </span>
                <p className="text-[var(--ds-text-primary)] mt-1">{item.solution}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
