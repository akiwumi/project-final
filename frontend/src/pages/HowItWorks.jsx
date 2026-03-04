import { motion } from "framer-motion";
import { Navbar } from "../components/layout/Navbar";
import { Footer } from "../components/layout/Footer";
import {
  Rocket,
  Users,
  Briefcase,
  UserPlus,
  FileText,
  Search,
  Handshake,
  ShieldCheck,
  BadgeCheck,
  ArrowRight,
} from "lucide-react";

// ─── Shared primitives ────────────────────────────────────────────────────────

function SectionLabel({ children }) {
  return (
    <p className="text-xs uppercase tracking-[0.2em] text-[var(--ds-accent)] mb-3 font-medium">
      {children}
    </p>
  );
}

function CTAButton({ href, children }) {
  return (
    <a
      href={href}
      className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-semibold text-sm bg-[var(--ds-accent)] text-[var(--ds-text-on-dark)] hover:bg-[var(--ds-accent-hover)] transition shadow-md"
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
        <svg
          className="w-5 h-5 text-[var(--ds-accent)]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>
      <span className="text-xs text-[var(--ds-text-muted)] font-medium">{label}</span>
    </div>
  );
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const ROLES = [
  {
    id: "entrepreneur",
    icon: Rocket,
    title: "Entrepreneurs",
    colour: "bg-[var(--ds-accent)]/10 text-[var(--ds-accent)]",
    intro:
      "Connect Africa gives founders a structured, credible path to reach vetted global investors. Our listing process filters out noise and puts serious capital in front of serious projects.",
    steps: [
      {
        icon: UserPlus,
        heading: "Register & get verified",
        body: "Create your entrepreneur account with your personal and company details. Once your email is confirmed you complete your profile and accept the platform terms.",
      },
      {
        icon: FileText,
        heading: "Submit your project",
        body: "Upload your pitch deck and business plan (PDF, max 50 MB), add a project summary, select your industry category and funding stage, and state the investment amount you are seeking.",
      },
      {
        icon: ShieldCheck,
        heading: "Pay the submission fee & verify",
        body: "A one-time €1,000 submission fee is charged. 80% is refunded if your project fails screening. You then schedule a phone verification call with our team at a time that suits you.",
      },
      {
        icon: Handshake,
        heading: "Receive investor interest",
        body: "Approved projects are listed in the discovery feed, visible to our global investor network. You track views, expressions of interest, and communicate with investors through your dashboard.",
      },
    ],
    imgLabel: "Entrepreneur submitting a project on the platform",
    cta: { label: "Register as an Entrepreneur", href: "/register" },
  },
  {
    id: "investor",
    icon: Users,
    title: "Investors",
    colour: "bg-[var(--ds-accent-green)]/10 text-[var(--ds-accent-green)]",
    intro:
      "Access a curated pipeline of pre-screened African ventures. Every listing has passed our verification process, so you spend less time on discovery and more time on decisions.",
    steps: [
      {
        icon: UserPlus,
        heading: "Create your investor profile",
        body: "Register with your personal and fund details. Specify your geographic focus, sector preferences, and typical ticket size so the platform can surface the most relevant opportunities.",
      },
      {
        icon: Search,
        heading: "Browse & filter",
        body: "Search the project discovery feed by country, sector, funding stage, or investment size. Every listing includes a summary, verified company information, and key metrics.",
      },
      {
        icon: BadgeCheck,
        heading: "Express interest",
        body: "Click 'Express Interest' on any project. The entrepreneur is notified and a structured introduction process begins, protecting both parties before full documents are shared.",
      },
      {
        icon: Handshake,
        heading: "Enter the deal room",
        body: "When both sides are ready, a private deal room is opened for document sharing, Q&A, and coordinated due diligence — all within the platform's secure environment.",
      },
    ],
    imgLabel: "Investor browsing the project discovery feed",
    cta: { label: "Register as an Investor", href: "/choose-role" },
  },
  {
    id: "provider",
    icon: Briefcase,
    title: "Service Providers",
    colour: "bg-blue-100 text-blue-700",
    intro:
      "Legal firms, compliance consultants, due diligence specialists and other professional services firms use Connect Africa to connect with pre-qualified clients at the moment they need expert support.",
    steps: [
      {
        icon: UserPlus,
        heading: "Register & describe your services",
        body: "Create your provider profile, select the services you offer (legal, compliance, due diligence, accounting, etc.) and list the markets and sectors you specialise in.",
      },
      {
        icon: BadgeCheck,
        heading: "Get verified",
        body: "Our team reviews your credentials and verifies your firm. A verification badge on your profile increases trust and significantly improves your lead conversion rate.",
      },
      {
        icon: Search,
        heading: "Get matched with clients",
        body: "The platform matches entrepreneurs and investors with relevant service providers at key stages of the deal process — when legal, compliance, or due diligence support is most needed.",
      },
      {
        icon: Handshake,
        heading: "Close deals",
        body: "Communicate with clients, share proposals, and manage engagements directly through the platform. Our escrow and review system protects both sides.",
      },
    ],
    imgLabel: "Service provider dashboard and lead management",
    cta: { label: "Register as a Service Provider", href: "/choose-role" },
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export function HowItWorksPage() {
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
              transition={{ duration: 0.5 }}
            >
              How It Works
            </motion.p>
            <motion.h1
              className="text-4xl sm:text-5xl font-bold mb-6"
              style={{ fontFamily: "var(--ds-font-display)", fontStyle: "italic", lineHeight: "var(--ds-line-tight)" }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              One platform, three paths to success
            </motion.h1>
            <motion.p
              className="text-[var(--ds-text-on-dark)]/70 text-lg leading-relaxed max-w-2xl mx-auto mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Whether you are raising capital, deploying it, or providing the services that make deals happen —
              Connect Africa gives you a structured, verified, and efficient path to your goal.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <CTAButton href="/choose-role">Get started today</CTAButton>
            </motion.div>
          </div>
        </section>

        {/* ── Overview image placeholder ── */}
        <section className="bg-[var(--ds-surface)] py-16 px-4">
          <div className="max-w-5xl mx-auto">
            <ImgPlaceholder label="Platform overview diagram — three user paths illustrated" aspect="aspect-[16/5]" />
          </div>
        </section>

        {/* ── Role sections ── */}
        {ROLES.map((role, roleIndex) => (
          <section
            key={role.id}
            className={`py-20 px-4 ${roleIndex % 2 === 0 ? "bg-[var(--ds-bg-light)]" : "bg-[var(--ds-surface)]"}`}
          >
            <div className="max-w-6xl mx-auto">
              <div className={`flex flex-col ${roleIndex % 2 === 1 ? "lg:flex-row-reverse" : "lg:flex-row"} gap-12 items-start`}>

                {/* Text side */}
                <motion.div
                  className="flex-1"
                  initial={{ opacity: 0, x: roleIndex % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`p-2.5 rounded-xl ${role.colour}`}>
                      <role.icon className="w-6 h-6" />
                    </div>
                    <SectionLabel>{role.title}</SectionLabel>
                  </div>
                  <h2
                    className="text-2xl sm:text-3xl font-bold text-[var(--ds-text-primary)] mb-4"
                    style={{ fontFamily: "var(--ds-font-display)", fontStyle: "italic" }}
                  >
                    {role.intro.split(".")[0]}.
                  </h2>
                  <p className="text-[var(--ds-text-secondary)] leading-relaxed mb-8 text-sm">
                    {role.intro.split(".").slice(1).join(".").trim()}
                  </p>

                  {/* Steps */}
                  <ol className="space-y-5">
                    {role.steps.map((step, i) => (
                      <motion.li
                        key={step.heading}
                        className="flex gap-4"
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.08 }}
                      >
                        <div className="flex flex-col items-center shrink-0">
                          <div className="w-8 h-8 rounded-full bg-[var(--ds-accent)] text-[var(--ds-text-on-dark)] text-xs font-bold flex items-center justify-center">
                            {i + 1}
                          </div>
                          {i < role.steps.length - 1 && (
                            <div className="w-px flex-1 bg-[var(--ds-border)] mt-2" style={{ minHeight: 24 }} />
                          )}
                        </div>
                        <div className="pb-4">
                          <p className="font-semibold text-sm text-[var(--ds-text-primary)] mb-1">
                            {step.heading}
                          </p>
                          <p className="text-xs text-[var(--ds-text-secondary)] leading-relaxed">
                            {step.body}
                          </p>
                        </div>
                      </motion.li>
                    ))}
                  </ol>

                  <div className="mt-8">
                    <CTAButton href={role.cta.href}>{role.cta.label}</CTAButton>
                  </div>
                </motion.div>

                {/* Image side */}
                <motion.div
                  className="flex-1 w-full"
                  initial={{ opacity: 0, x: roleIndex % 2 === 0 ? 30 : -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  <ImgPlaceholder label={role.imgLabel} aspect="aspect-[4/3]" />
                </motion.div>

              </div>
            </div>
          </section>
        ))}

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
              Ready to take your first step?
            </motion.h2>
            <p className="text-[var(--ds-text-on-dark)]/70 mb-8 text-sm leading-relaxed">
              Join hundreds of entrepreneurs, investors, and service providers already using
              Connect Africa to build meaningful cross-border relationships.
            </p>
            <CTAButton href="/choose-role">Choose your role</CTAButton>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
