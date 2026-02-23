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
  }, [value, inView, suffix]);
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
    <section className="py-20 bg-[var(--ds-bg-dark)] text-[var(--ds-text-on-dark)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        <motion.h2
          className="text-3xl sm:text-4xl font-bold text-center mb-14"
          style={{ lineHeight: "var(--ds-line-tight)" }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
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
                <stat.icon className="w-10 h-10 text-[var(--ds-accent)]" />
              </div>
              <div className="text-3xl sm:text-4xl font-bold text-[var(--ds-accent)]">
                <AnimatedCounter
                  value={stat.value}
                  suffix={stat.suffix}
                  inView={inView}
                />
              </div>
              <p className="text-[var(--ds-text-on-dark)]/80 mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
