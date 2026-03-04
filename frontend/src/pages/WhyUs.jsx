import { motion } from "framer-motion";
import { Navbar } from "../components/layout/Navbar";
import { Footer } from "../components/layout/Footer";
import {
  ShieldCheck,
  Globe2,
  TrendingUp,
  Lock,
  Users,
  BarChart3,
  Zap,
  AlertTriangle,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

function CTAButton({ href, children, variant = "gold" }) {
  const styles = {
    gold: "bg-[var(--ds-accent)] text-[var(--ds-text-on-dark)] hover:bg-[var(--ds-accent-hover)]",
    outline:
      "border-2 border-[var(--ds-text-on-dark)] text-[var(--ds-text-on-dark)] hover:bg-[var(--ds-text-on-dark)] hover:text-[var(--ds-bg-dark)]",
  };
  return (
    <a
      href={href}
      className={`inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-semibold text-sm transition shadow-md ${styles[variant]}`}
    >
      {children}
      <ArrowRight className="w-4 h-4" />
    </a>
  );
}

function ImgPlaceholder({ label, aspect = "aspect-video", className = "" }) {
  return (
    <div
      className={`${aspect} ${className} rounded-2xl bg-[var(--ds-bg-dark)]/5 border-2 border-dashed border-[var(--ds-border)] flex flex-col items-center justify-center gap-2`}
    >
      <div className="w-10 h-10 rounded-full bg-[var(--ds-accent)]/20 flex items-center justify-center">
        <svg className="w-5 h-5 text-[var(--ds-accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
      <span className="text-xs text-[var(--ds-text-muted)] font-medium text-center px-4">{label}</span>
    </div>
  );
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const PROBLEMS = [
  {
    icon: AlertTriangle,
    problem: "Information asymmetry",
    detail:
      "Investors lack standardised, comparable data on African ventures. Due diligence is costly and slow, often leading to deals being abandoned before they begin.",
    solution: "Standardised, verified listings",
    solutionDetail:
      "Every project on Connect Africa follows a consistent format. Company details, financials, team backgrounds, and documents are structured identically — making comparison and review fast and reliable.",
  },
  {
    icon: Lock,
    problem: "Trust deficits",
    detail:
      "Cross-border deals suffer from a fundamental trust gap. Without face-to-face relationships, investors hesitate and entrepreneurs struggle to be taken seriously.",
    solution: "Paid listing + phone verification",
    solutionDetail:
      "Our submission fee and mandatory phone verification create real accountability. Investors know that every listed entrepreneur has been vetted, putting serious skin in the game.",
  },
  {
    icon: Zap,
    problem: "High deal friction",
    detail:
      "Connecting parties, coordinating documents, scheduling calls, and managing compliance across borders is time-consuming and error-prone without the right tools.",
    solution: "Structured workflows & deal rooms",
    solutionDetail:
      "From first contact to document sharing, every step of the process is managed within the platform. Structured workflows reduce back-and-forth and keep deals moving forward.",
  },
];

const DIFFERENTIATORS = [
  {
    icon: ShieldCheck,
    title: "Verified listings only",
    body: "Every entrepreneur and project goes through a multi-step verification process. Investors never waste time on unqualified or fraudulent submissions.",
  },
  {
    icon: Globe2,
    title: "Pan-African reach",
    body: "We cover 54 African countries across all sectors — from FinTech in Nigeria to AgriTech in Kenya to CleanEnergy in South Africa.",
  },
  {
    icon: TrendingUp,
    title: "Structured deal flow",
    body: "Introductions, document requests, and deal room access all follow a defined process, so both sides always know exactly where they stand.",
  },
  {
    icon: Users,
    title: "Three-sided ecosystem",
    body: "Entrepreneurs, investors, and service providers are all on one platform — so legal, compliance, and due diligence support is always a click away.",
  },
  {
    icon: BarChart3,
    title: "Full transparency",
    body: "Entrepreneurs see who has viewed their listing and who has expressed interest. Investors see verified metrics. Everyone operates with the same information.",
  },
  {
    icon: Lock,
    title: "Secure & confidential",
    body: "Documents are stored securely and only shared with verified investors who have signed NDAs within the platform. Your IP stays protected.",
  },
];

const STATS = [
  { value: "54", label: "African countries covered" },
  { value: "21", label: "Industry categories" },
  { value: "80%", label: "Submission fee refunded if project fails screening" },
  { value: "14", label: "Days average to first investor contact" },
];

const COMPARISONS = [
  { feature: "Verified entrepreneur profiles", us: true, others: false },
  { feature: "Structured listing format", us: true, others: false },
  { feature: "Phone verification for every submission", us: true, others: false },
  { feature: "Refund policy for failed submissions", us: true, others: false },
  { feature: "Pan-African market coverage", us: true, others: "Partial" },
  { feature: "Integrated service provider network", us: true, others: false },
  { feature: "Deal room & document sharing", us: true, others: "Partial" },
  { feature: "Investor-entrepreneur chat", us: true, others: "Partial" },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export function WhyUsPage() {
  return (
    <div className="min-h-screen bg-[var(--ds-bg-light)]">
      <Navbar />
      <main className="pt-16">

        {/* ── Hero ── */}
        <section className="bg-[var(--ds-bg-dark)] text-[var(--ds-text-on-dark)] py-24 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.p
              className="text-xs uppercase tracking-[0.2em] text-[var(--ds-accent)] mb-4 font-medium"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
            >
              Why Connect Africa
            </motion.p>
            <motion.h1
              className="text-4xl sm:text-5xl font-bold mb-6"
              style={{ fontFamily: "var(--ds-font-display)", fontStyle: "italic", lineHeight: "var(--ds-line-tight)" }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              Turning Africa's investment barriers into competitive advantages
            </motion.h1>
            <motion.p
              className="text-[var(--ds-text-on-dark)]/70 text-lg leading-relaxed max-w-2xl mx-auto mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Africa holds some of the world's most compelling investment opportunities.
              The barriers that have historically kept capital out are now our
              platform's core features — because removing friction creates value for everyone.
            </motion.p>
            <motion.div
              className="flex flex-wrap gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <CTAButton href="/choose-role">Join the platform</CTAButton>
              <CTAButton href="/how-it-works" variant="outline">See how it works</CTAButton>
            </motion.div>
          </div>
        </section>

        {/* ── Stats bar ── */}
        <section className="bg-[var(--ds-accent)] py-10 px-4">
          <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map((s, i) => (
              <motion.div
                key={s.label}
                className="text-center"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <p
                  className="text-3xl font-bold text-[var(--ds-bg-dark)] mb-1"
                  style={{ fontFamily: "var(--ds-font-display)" }}
                >
                  {s.value}
                </p>
                <p className="text-xs text-[var(--ds-bg-dark)]/70 font-medium leading-snug">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── Problem → Solution ── */}
        <section className="py-20 px-4 bg-[var(--ds-surface)]">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--ds-accent)] mb-3 font-medium">
                The Problems We Solve
              </p>
              <h2
                className="text-3xl sm:text-4xl font-bold text-[var(--ds-text-primary)] mb-4"
                style={{ fontFamily: "var(--ds-font-display)", fontStyle: "italic" }}
              >
                We built the platform we wished existed
              </h2>
              <p className="text-[var(--ds-text-secondary)] text-sm leading-relaxed max-w-xl mx-auto">
                Every feature on Connect Africa was designed to address a real, documented
                friction point in cross-border African investment.
              </p>
            </div>

            <div className="space-y-8">
              {PROBLEMS.map((item, i) => (
                <motion.div
                  key={item.problem}
                  className="grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-2xl overflow-hidden border border-[var(--ds-border)]"
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  {/* Problem */}
                  <div className="bg-[var(--ds-bg-light)] p-8">
                    <div className="flex items-center gap-2 mb-3">
                      <item.icon className="w-4 h-4 text-[var(--ds-text-muted)]" />
                      <span className="text-xs font-semibold uppercase tracking-wider text-[var(--ds-text-muted)] line-through">
                        The problem
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-[var(--ds-text-primary)] mb-3">
                      {item.problem}
                    </h3>
                    <p className="text-sm text-[var(--ds-text-secondary)] leading-relaxed">
                      {item.detail}
                    </p>
                  </div>
                  {/* Solution */}
                  <div className="bg-[var(--ds-bg-dark)] text-[var(--ds-text-on-dark)] p-8 border-l-4 border-[var(--ds-accent)]">
                    <div className="flex items-center gap-2 mb-3">
                      <CheckCircle className="w-4 h-4 text-[var(--ds-accent)]" />
                      <span className="text-xs font-semibold uppercase tracking-wider text-[var(--ds-accent)]">
                        Our solution
                      </span>
                    </div>
                    <h3 className="text-lg font-bold mb-3">{item.solution}</h3>
                    <p className="text-sm text-[var(--ds-text-on-dark)]/70 leading-relaxed">
                      {item.solutionDetail}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Differentiators ── */}
        <section className="py-20 px-4 bg-[var(--ds-bg-light)]">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-12 items-start">
              <motion.div
                className="flex-1"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <p className="text-xs uppercase tracking-[0.2em] text-[var(--ds-accent)] mb-3 font-medium">
                  What Sets Us Apart
                </p>
                <h2
                  className="text-3xl font-bold text-[var(--ds-text-primary)] mb-4"
                  style={{ fontFamily: "var(--ds-font-display)", fontStyle: "italic" }}
                >
                  Six reasons
                  Connect Africa works
                </h2>
                <p className="text-[var(--ds-text-secondary)] text-sm leading-relaxed mb-10">
                  We are not a directory or a marketplace. We are an investment facilitation
                  platform — and every design decision reflects that distinction.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {DIFFERENTIATORS.map((d, i) => (
                    <motion.div
                      key={d.title}
                      className="bg-[var(--ds-surface)] rounded-2xl p-5 border border-[var(--ds-border)]"
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.07 }}
                    >
                      <div className="p-2 w-fit rounded-xl bg-[var(--ds-accent)]/10 mb-3">
                        <d.icon className="w-4 h-4 text-[var(--ds-accent)]" />
                      </div>
                      <h3 className="font-semibold text-sm text-[var(--ds-text-primary)] mb-1.5">
                        {d.title}
                      </h3>
                      <p className="text-xs text-[var(--ds-text-secondary)] leading-relaxed">
                        {d.body}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                className="lg:w-80 shrink-0 w-full space-y-4"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <ImgPlaceholder label="Platform interface screenshot showing verified listings" aspect="aspect-square" />
                <ImgPlaceholder label="Map showing Connect Africa's geographic reach across the continent" aspect="aspect-video" />
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── Comparison table ── */}
        <section className="py-20 px-4 bg-[var(--ds-surface)]">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--ds-accent)] mb-3 font-medium">
                Platform Comparison
              </p>
              <h2
                className="text-3xl font-bold text-[var(--ds-text-primary)] mb-4"
                style={{ fontFamily: "var(--ds-font-display)", fontStyle: "italic" }}
              >
                How we compare
              </h2>
              <p className="text-[var(--ds-text-secondary)] text-sm leading-relaxed">
                Compared to generic fundraising platforms and investor directories,
                Connect Africa offers a depth of verification and structure that simply
                doesn't exist elsewhere for African markets.
              </p>
            </div>

            <div className="rounded-2xl border border-[var(--ds-border)] overflow-hidden">
              <div className="grid grid-cols-3 bg-[var(--ds-bg-dark)] text-[var(--ds-text-on-dark)] px-5 py-4 text-xs font-semibold uppercase tracking-wider">
                <div>Feature</div>
                <div className="text-center text-[var(--ds-accent)]">Connect Africa</div>
                <div className="text-center text-[var(--ds-text-on-dark)]/50">Other platforms</div>
              </div>
              {COMPARISONS.map((row, i) => (
                <div
                  key={row.feature}
                  className={`grid grid-cols-3 px-5 py-3.5 text-sm items-center ${
                    i % 2 === 0 ? "bg-white" : "bg-[var(--ds-bg-light)]"
                  } border-b border-[var(--ds-border)] last:border-b-0`}
                >
                  <span className="text-[var(--ds-text-secondary)] text-xs">{row.feature}</span>
                  <span className="text-center">
                    {row.us === true ? (
                      <CheckCircle className="w-4 h-4 text-green-500 mx-auto" />
                    ) : (
                      <span className="text-xs text-[var(--ds-text-muted)]">{row.us}</span>
                    )}
                  </span>
                  <span className="text-center">
                    {row.others === true ? (
                      <CheckCircle className="w-4 h-4 text-green-500 mx-auto" />
                    ) : row.others === false ? (
                      <span className="text-lg text-red-400 leading-none">✕</span>
                    ) : (
                      <span className="text-xs text-[var(--ds-text-muted)] italic">{row.others}</span>
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Bottom CTA ── */}
        <section className="py-20 px-4 bg-[var(--ds-bg-dark)] text-[var(--ds-text-on-dark)] text-center">
          <div className="max-w-2xl mx-auto">
            <motion.h2
              className="text-3xl font-bold mb-4"
              style={{ fontFamily: "var(--ds-font-display)", fontStyle: "italic" }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Africa's next investment era starts here
            </motion.h2>
            <p className="text-[var(--ds-text-on-dark)]/70 mb-8 text-sm leading-relaxed">
              Stop navigating an opaque process. Connect Africa gives every participant —
              entrepreneur, investor, or service provider — the structure they need to move
              with confidence.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <CTAButton href="/choose-role">Create your account</CTAButton>
              <CTAButton href="/testimonials" variant="outline">Read success stories</CTAButton>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
