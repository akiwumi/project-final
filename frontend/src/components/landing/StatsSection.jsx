import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { Globe, TrendingUp, Users, Briefcase } from "lucide-react";

const stats = [
  { icon: Globe, value: 54, suffix: "", label: "African Nations" },
  { icon: TrendingUp, value: 0, suffix: "+", label: "Ventures" },
  { icon: Users, value: 0, suffix: "+", label: "Investors" },
  { icon: Briefcase, value: 0, suffix: "+", label: "Service Providers" },
];

function AnimatedCounter({ value, suffix = "", inView }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const duration = 1500;
    const step = value / (duration / 50);
    let current = 0;
    const timer = setInterval(() => {
      current += step;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, 50);
    return () => clearInterval(timer);
  }, [value, inView]);
  return (
    <span>
      {count}
      {suffix}
    </span>
  );
}

export function StatsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <section className="py-24 bg-[var(--ds-bg-dark)] text-[var(--ds-text-on-dark)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        <motion.p
          className="text-center text-xs uppercase tracking-[0.2em] text-[var(--ds-accent)] mb-3 font-medium"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          By the Numbers
        </motion.p>
        <motion.h2
          className="text-3xl sm:text-4xl font-bold italic text-center mb-14"
          style={{ fontFamily: "var(--ds-font-display)", lineHeight: "var(--ds-line-tight)" }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.05 }}
        >
          Platform at a Glance
        </motion.h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="flex justify-center mb-3">
                <stat.icon className="w-9 h-9 text-[var(--ds-accent)]" />
              </div>
              <div
                className="text-3xl sm:text-4xl font-bold text-[var(--ds-accent)]"
                style={{ fontFamily: "var(--ds-font-display)" }}
              >
                <AnimatedCounter
                  value={stat.value}
                  suffix={stat.suffix}
                  inView={inView}
                />
              </div>
              <p className="text-[var(--ds-text-on-dark)]/70 mt-1 text-sm">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
