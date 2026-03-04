import { motion } from "framer-motion";

export function CTASection() {
  return (
    <section className="py-24 bg-[var(--ds-bg-dark)]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.p
          className="text-xs uppercase tracking-[0.2em] text-[var(--ds-accent)] mb-4 font-medium"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Get Started Today
        </motion.p>
        <motion.h2
          className="text-3xl sm:text-4xl font-bold italic text-[var(--ds-text-on-dark)] mb-5"
          style={{ fontFamily: "var(--ds-font-display)", lineHeight: "var(--ds-line-tight)" }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Ready to connect?
        </motion.h2>
        <motion.p
          className="text-[var(--ds-text-on-dark)]/65 mb-10 leading-[var(--ds-line-relaxed)]"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          Join investors, entrepreneurs, and service providers building the future of African investment.
        </motion.p>
        <motion.div
          className="flex flex-wrap justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <a
            href="/choose-role"
            className="inline-flex items-center px-8 py-3.5 rounded-full font-medium bg-[var(--ds-accent)] text-[var(--ds-text-primary)] hover:bg-[var(--ds-accent-hover)] transition shadow-md"
          >
            Get Started
          </a>
          <a
            href="#how-it-works"
            className="inline-flex items-center px-8 py-3.5 rounded-full font-medium border border-[var(--ds-text-on-dark)]/30 text-[var(--ds-text-on-dark)] hover:border-[var(--ds-text-on-dark)]/60 transition"
          >
            Learn More
          </a>
        </motion.div>
      </div>
    </section>
  );
}
