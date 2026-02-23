import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

export function HeroVideo() {
  return (
    <section className="relative h-screen min-h-[600px] flex flex-col justify-between overflow-hidden">
      {/* Hero background: herovideo.mp4 from frontend/public/video/ — plays as a loop */}
      <div className="absolute inset-0 bg-[var(--ds-bg-dark)]">
        <video
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          aria-label="Hero background video"
        >
          <source src="/video/herovideo.mp4" type="video/mp4" />
        </video>
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none"
          aria-hidden
        />
      </div>

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 pt-24">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-[var(--ds-text-on-dark)] tracking-tight drop-shadow-lg uppercase"
            style={{ lineHeight: "var(--ds-line-tight)" }}
          >
            CONNECT <span className="text-[var(--ds-accent)]">AFRICA</span>
          </h1>
          <p className="mt-4 text-lg sm:text-xl md:text-2xl text-[var(--ds-text-on-dark)]/95 max-w-2xl mx-auto drop-shadow-md">
            The trust layer for cross-border investment into Africa
          </p>
        </motion.div>
      </div>

      <motion.div
        className="relative z-10 px-4 pb-12 flex justify-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        <motion.a
          href="/choose-role"
          className="inline-flex items-center px-8 py-4 rounded-xl font-semibold text-lg bg-[var(--ds-accent)] text-[var(--ds-text-on-dark)] hover:bg-[var(--ds-accent-hover)] transition-all duration-300 hover:scale-105 hover:shadow-lg"
          whileHover={{ y: -2 }}
        >
          Get Started
        </motion.a>
      </motion.div>

      <motion.a
        href="#how-it-works"
        className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 text-[var(--ds-text-on-dark)]/80 hover:text-[var(--ds-text-on-dark)] transition"
        aria-label="Scroll to How it works"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <ChevronDown className="w-8 h-8" />
        </motion.div>
      </motion.a>
    </section>
  );
}
