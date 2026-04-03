import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";

export function HeroVideo() {
  return (
    <section className="relative h-[100svh] min-h-[100svh] sm:h-screen sm:min-h-[600px] flex flex-col justify-between overflow-hidden">
      {/* Hero background video */}
      <div className="absolute inset-0 bg-[var(--ds-bg-dark)]">
        <video
          className="absolute inset-0 w-full h-full object-cover object-center"
          autoPlay
          muted
          loop
          playsInline
          aria-label="Hero background video"
        >
          <source src="/video/herovideo.mp4" type="video/mp4" />
        </video>
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none"
          aria-hidden
        />
      </div>

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 pt-20 sm:pt-24 pb-6">
        <motion.div
          className="text-center max-w-3xl"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        >
          {/* Eyebrow label */}
          <motion.p
            className="mb-4 sm:mb-5 text-[11px] sm:text-sm uppercase tracking-[0.2em] sm:tracking-[0.25em] font-medium text-[var(--ds-accent)]"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            The Pan-African Investment Platform
          </motion.p>

          <h1
            className="text-[clamp(2.25rem,9vw,5.25rem)] font-bold italic text-[var(--ds-text-on-dark)] drop-shadow-lg"
            style={{
              fontFamily: "var(--ds-font-display)",
              lineHeight: "var(--ds-line-tight)",
            }}
          >
            Connect{" "}
            <span className="not-italic text-[var(--ds-accent)]">Africa</span>
          </h1>

          <p
            className="mt-4 sm:mt-5 text-sm sm:text-lg md:text-xl text-[var(--ds-text-on-dark)]/80 max-w-[22rem] sm:max-w-xl mx-auto drop-shadow-md font-light"
            style={{ fontFamily: "var(--ds-font-sans)" }}
          >
            The trust layer for cross-border investment into Africa
          </p>
        </motion.div>
      </div>

      <motion.div
        className="relative z-10 px-4 pb-10 sm:pb-14 flex justify-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        <motion.div whileHover={{ y: -2 }}>
          <Link
            to="/choose-role"
            className="inline-flex w-full max-w-xs sm:w-auto justify-center items-center px-6 sm:px-8 py-3 sm:py-3.5 rounded-full font-medium text-sm sm:text-base bg-[var(--ds-accent)] text-[var(--ds-text-primary)] hover:bg-[var(--ds-accent-hover)] transition-all duration-300 hover:shadow-lg"
          >
            Get Started
          </Link>
        </motion.div>
      </motion.div>

      <motion.a
        href="#how-it-works"
        className="hidden sm:block absolute bottom-4 left-1/2 -translate-x-1/2 z-10 text-[var(--ds-text-on-dark)]/60 hover:text-[var(--ds-text-on-dark)] transition"
        aria-label="Scroll to How it works"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3 }}
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <ChevronDown className="w-7 h-7" />
        </motion.div>
      </motion.a>
    </section>
  );
}
